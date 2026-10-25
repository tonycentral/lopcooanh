// src/features/farm/services/supabaseSync.ts
// Supabase Sync Service for 2D Farm State (Option 4B JSONB Blob)
// Provides debounced persistence (15s), state hydration on load, and auto-flush on blur/unload.

import { supabase } from '../../../services/supabaseClient';
import type { PlayerFarmState, SyncStatus } from '../types';

const SYNC_DEBOUNCE_MS = 15000; // 15 seconds
const LOCAL_STORAGE_KEY = 'harvest_sla_farm_state_v2';

let syncTimer: any = null;
let pendingState: PlayerFarmState | null = null;
let currentUserId: string | null = null;
let syncStatusListener: ((status: SyncStatus) => void) | null = null;

export function setSyncStatusListener(listener: ((status: SyncStatus) => void) | null) {
  syncStatusListener = listener;
}

function notifyStatus(status: SyncStatus) {
  if (syncStatusListener) {
    syncStatusListener(status);
  }
}

/**
 * Load farm state on startup.
 * Priority: If logged in, fetch cloud JSONB. If local is newer, merge/resolve conflict.
 */
export async function loadInitialFarmState(userId?: string | null): Promise<PlayerFarmState | null> {
  let localState: PlayerFarmState | null = null;

  // 1. Read LocalStorage fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      localState = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[FarmSync] Failed reading local state:', err);
  }

  if (!userId || !supabase) {
    return localState;
  }

  currentUserId = userId;

  try {
    notifyStatus('saving');

    // 2. Try reading from player_farms table
    const { data: farmRow, error: farmErr } = await supabase
      .from('player_farms')
      .select('tiles, gold, energy, max_energy, day, hotbar, inventory, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (!farmErr && farmRow) {
      const cloudState: PlayerFarmState = {
        gold: farmRow.gold ?? 250,
        energy: farmRow.energy ?? 100,
        maxEnergy: farmRow.max_energy ?? 100,
        day: farmRow.day ?? 1,
        activeTool: 'hoe',
        hotbar: farmRow.hotbar ?? [],
        inventory: farmRow.inventory ?? [],
        tiles: farmRow.tiles ?? {},
        updatedAt: farmRow.updated_at ? new Date(farmRow.updated_at).getTime() : Date.now()
      };

      // Conflict Resolution: Pick whichever is newer
      if (localState && localState.updatedAt > cloudState.updatedAt) {
        // Local is fresher -> schedule sync back to cloud
        queueFarmStateSync(userId, localState);
        notifyStatus('synced');
        return localState;
      }

      // Save to local cache & return cloud state
      saveToLocalStorage(cloudState);
      notifyStatus('synced');
      return cloudState;
    }

    // 3. Fallback: Check if stored in profiles.farm_state column
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('farm_state')
      .eq('id', userId)
      .maybeSingle();

    if (profileRow?.farm_state && Object.keys(profileRow.farm_state).length > 0) {
      const cloudProfileState = profileRow.farm_state as PlayerFarmState;
      if (!localState || cloudProfileState.updatedAt >= localState.updatedAt) {
        saveToLocalStorage(cloudProfileState);
        notifyStatus('synced');
        return cloudProfileState;
      }
    }
  } catch (err) {
    console.warn('[FarmSync] Error fetching cloud farm state, fallback to local:', err);
    notifyStatus('offline');
  }

  return localState;
}

/**
 * Queue farm state to be saved (Debounced 15s).
 * Immediately writes to LocalStorage, debounces remote Supabase push.
 */
export function queueFarmStateSync(userId: string | null | undefined, state: PlayerFarmState) {
  currentUserId = userId || null;
  pendingState = { ...state, updatedAt: Date.now() };

  // 1. Immediate local persist
  saveToLocalStorage(pendingState);
  notifyStatus('pending');

  // 2. Debounced Cloud push
  if (syncTimer) {
    clearTimeout(syncTimer);
  }

  syncTimer = setTimeout(() => {
    flushPendingFarmSync();
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Force flush pending state to Supabase immediately (called on blur / unload or manual save)
 */
export async function flushPendingFarmSync(): Promise<void> {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  if (!pendingState || !currentUserId || !supabase) {
    notifyStatus('synced');
    return;
  }

  const stateToSync = pendingState;
  notifyStatus('saving');

  try {
    // 1. Try Upsert into player_farms table
    const { error: upsertErr } = await supabase
      .from('player_farms')
      .upsert({
        user_id: currentUserId,
        gold: stateToSync.gold,
        energy: stateToSync.energy,
        max_energy: stateToSync.maxEnergy,
        day: stateToSync.day,
        hotbar: stateToSync.hotbar,
        inventory: stateToSync.inventory,
        tiles: stateToSync.tiles,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertErr) {
      // Fallback: If player_farms table doesn't exist yet, save into profiles.farm_state
      await supabase
        .from('profiles')
        .update({
          farm_state: stateToSync,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUserId);
    }

    notifyStatus('synced');
    pendingState = null;
  } catch (err) {
    console.warn('[FarmSync] Failed syncing to Supabase:', err);
    notifyStatus('error');
  }
}

function saveToLocalStorage(state: PlayerFarmState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[FarmSync] LocalStorage write error:', e);
  }
}

/**
 * Attach listeners to flush sync when user switches tabs or closes browser window
 */
export function initVisibilitySyncListener(): () => void {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushPendingFarmSync();
    }
  };

  const handleBeforeUnload = () => {
    flushPendingFarmSync();
  };

  window.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
