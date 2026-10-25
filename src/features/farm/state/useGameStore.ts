// src/features/farm/state/useGameStore.ts
// Typed Zustand Store for 2D Farm Simulation & Language Learning integration

import { create } from 'zustand';
import type { 
  PlayerFarmState, 
  TileData, 
  CropDefinition, 
  CropGrowthCalculation,
  CropData,
  InventoryItem,
  SyncStatus,
  NotificationMessage
} from '../types';
import { 
  queueFarmStateSync, 
  loadInitialFarmState, 
  setSyncStatusListener 
} from '../services/supabaseSync';

export const CROP_DEFINITIONS: Record<string, CropDefinition> = {
  wheat: {
    id: 'wheat',
    name: 'Lúa Mì Học Thuật (Academic Wheat)',
    seedId: 'seed_wheat',
    growthSeconds: 60, // 60s for demo & fast testing
    stages: 4,
    goldValue: 15,
    vocabReward: 'cultivate'
  },
  herb: {
    id: 'herb',
    name: 'Thảo Mộc Tri Thức (Wisdom Herb)',
    seedId: 'seed_herb',
    growthSeconds: 120, // 2 minutes
    stages: 4,
    goldValue: 35,
    vocabReward: 'indigenous'
  }
};

/**
 * Timestamp Delta Calculation Engine (Decision 5C)
 */
export function getCropGrowthStage(crop: CropData | null, now = Date.now()): CropGrowthCalculation {
  if (!crop) {
    return { currentStage: 0, isRipe: false, percent: 0, elapsedSec: 0, remainingSec: 0 };
  }
  const elapsedSec = Math.max(0, (now - crop.plantedAt) / 1000);
  const stageDuration = crop.totalGrowthSeconds / (crop.totalStages - 1);
  const currentStage = Math.min(
    crop.totalStages - 1,
    Math.floor(elapsedSec / stageDuration)
  );
  const isRipe = currentStage >= crop.totalStages - 1;
  const percent = Math.min(100, Math.round((elapsedSec / crop.totalGrowthSeconds) * 100));

  return {
    currentStage,
    isRipe,
    percent,
    elapsedSec,
    remainingSec: Math.max(0, Math.ceil(crop.totalGrowthSeconds - elapsedSec))
  };
}

// 5 Main Hotbar Slots (Mapped to keys 1 - 5)
const defaultHotbar: InventoryItem[] = [
  { id: 'hoe', name: 'Cuốc Đất (Hoe)', icon: '⛏️', type: 'tool' },
  { id: 'water_can', name: 'Bình Tưới (Water Can)', icon: '💧', type: 'tool' },
  { id: 'seed_wheat', name: 'Hạt Lúa Mì (Wheat Seeds)', icon: '🌱', type: 'seed', count: 15, cropId: 'wheat' },
  { id: 'hand', name: 'Thu Hoạch (Hand/Harvest)', icon: '✋', type: 'tool' },
  { id: 'seed_herb', name: 'Hạt Thảo Mộc (Herb Seeds)', icon: '🌿', type: 'seed', count: 8, cropId: 'herb' }
];

const defaultInitialState: PlayerFarmState = {
  gold: 250,
  energy: 100,
  maxEnergy: 100,
  day: 1,
  activeTool: 'hoe',
  hotbar: defaultHotbar,
  inventory: [
    { id: 'crop_wheat', name: 'Bông Lúa Mì', icon: '🌾', type: 'crop', count: 2, price: 15 },
    { id: 'crop_herb', name: 'Nhánh Thảo Mộc', icon: '🌿', type: 'crop', count: 1, price: 35 }
  ],
  tiles: {
    '12,8': {
      isTilled: true,
      isWatered: true,
      crop: {
        id: 'wheat',
        plantedAt: Date.now() - 35000,
        totalGrowthSeconds: 60,
        totalStages: 4
      }
    },
    '13,8': {
      isTilled: true,
      isWatered: false,
      crop: null
    },
    '14,8': {
      isTilled: true,
      isWatered: true,
      crop: {
        id: 'herb',
        plantedAt: Date.now() - 95000,
        totalGrowthSeconds: 120,
        totalStages: 4
      }
    }
  },
  updatedAt: Date.now()
};

export interface GameStoreState extends PlayerFarmState {
  currentUserId: string | null;
  syncStatus: SyncStatus;
  lastNotification: NotificationMessage | null;
  
  // Actions
  setUserId: (userId: string | null) => void;
  selectTool: (toolId: string) => void;
  notify: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  clearNotification: () => void;
  tillTile: (x: number, y: number) => { success: boolean; reason?: string };
  waterTile: (x: number, y: number) => { success: boolean; reason?: string };
  plantCrop: (x: number, y: number, seedId: string) => { success: boolean; cropName?: string; reason?: string };
  harvestCrop: (x: number, y: number) => { 
    success: boolean; 
    cropName?: string; 
    goldReward?: number; 
    vocabReward?: string; 
    reason?: string 
  };
  addGold: (amount: number) => void;
  hydrateFromCloud: (cloudState: Partial<PlayerFarmState>) => void;
  initSync: (userId?: string | null) => Promise<void>;
}

export const useGameStore = create<GameStoreState>((set, get) => {
  return {
    ...defaultInitialState,
    currentUserId: null,
    syncStatus: 'idle',
    lastNotification: null,

    setUserId: (userId) => set({ currentUserId: userId }),

    selectTool: (toolId) => set({ activeTool: toolId }),

    notify: (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
      set({
        lastNotification: {
          id: Date.now(),
          message,
          type,
          timestamp: Date.now()
        }
      });
    },

    clearNotification: () => set({ lastNotification: null }),

    // Slot 1: Cuốc đất (Hoe)
    tillTile: (x, y) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (currentTile?.crop) {
        const msg = 'Đang có cây trồng trên ô này, không thể cuốc!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile?.isTilled) {
        const msg = 'Đất này đã được cuốc sẵn rồi!';
        get().notify(msg, 'info');
        return { success: false, reason: msg };
      }

      if (state.energy < 2) {
        const msg = 'Kiệt sức! Cần nghỉ ngơi để hồi phục thể lực (-2 Năng lượng)';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...(currentTile || {}),
          isTilled: true,
          isWatered: false,
          crop: null,
          lastUpdated: Date.now()
        }
      };

      const updated = {
        tiles: newTiles,
        energy: Math.max(0, state.energy - 2),
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      return { success: true };
    },

    // Slot 2: Tưới nước (Water Can)
    waterTile: (x, y) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.isTilled) {
        const msg = 'Cần cuốc đất trước khi tưới nước!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile.isWatered) {
        const msg = 'Đất đã đủ ẩm, không cần tưới thêm!';
        get().notify(msg, 'info');
        return { success: false, reason: msg };
      }

      if (state.energy < 1) {
        const msg = 'Kiệt sức! Không đủ thể lực để tưới nước (-1 Năng lượng)';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          isWatered: true,
          lastUpdated: Date.now()
        }
      };

      const updated = {
        tiles: newTiles,
        energy: Math.max(0, state.energy - 1),
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      return { success: true };
    },

    // Slot 3 & 5: Gieo hạt (Seed)
    plantCrop: (x, y, seedId) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.isTilled) {
        const msg = 'Cần cuốc đất trước khi gieo hạt!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile.crop) {
        const msg = 'Ô đất này đã có mầm cây đang phát triển!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const seedItem = state.hotbar.find(item => item.id === seedId);
      if (!seedItem || (seedItem.count ?? 0) <= 0) {
        const msg = 'Đã hết hạt giống trong túi đồ!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (state.energy < 1) {
        const msg = 'Kiệt sức! Cần nghỉ ngơi (-1 Năng lượng)';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const cropDef = CROP_DEFINITIONS[seedItem.cropId || ''];
      if (!cropDef) {
        const msg = 'Hạt giống không hợp lệ!';
        get().notify(msg, 'error');
        return { success: false, reason: msg };
      }

      const newHotbar = state.hotbar.map(item => {
        if (item.id === seedId) {
          return { ...item, count: (item.count ?? 1) - 1 };
        }
        return item;
      });

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          crop: {
            id: cropDef.id,
            plantedAt: Date.now(),
            totalGrowthSeconds: cropDef.growthSeconds,
            totalStages: cropDef.stages
          },
          lastUpdated: Date.now()
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        energy: Math.max(0, state.energy - 1),
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã gieo mầm ${cropDef.name}!`, 'success');
      return { success: true, cropName: cropDef.name };
    },

    // Slot 4: Bàn tay Thu hoạch (Hand / Harvest)
    harvestCrop: (x, y) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.crop) {
        const msg = 'Không có cây nào ở ô này để thu hoạch!';
        get().notify(msg, 'info');
        return { success: false, reason: msg };
      }

      const growth = getCropGrowthStage(currentTile.crop);
      if (!growth.isRipe) {
        const msg = `Cây chưa chín! Còn ${growth.remainingSec} giây nữa mới có thể thu hoạch.`;
        get().notify(msg, 'warning');
        return { 
          success: false, 
          reason: `Chưa chín! Còn ${growth.remainingSec}s` 
        };
      }

      const cropDef = CROP_DEFINITIONS[currentTile.crop.id];
      const goldReward = cropDef?.goldValue || 20;
      const cropItemId = `crop_${currentTile.crop.id}`;

      // Update inventory (increment harvested count)
      let newInventory = [...(state.inventory || [])];
      const existingInvIdx = newInventory.findIndex(i => i.id === cropItemId);
      if (existingInvIdx >= 0) {
        newInventory[existingInvIdx] = {
          ...newInventory[existingInvIdx],
          count: (newInventory[existingInvIdx].count ?? 0) + 1
        };
      } else {
        newInventory.push({
          id: cropItemId,
          name: cropDef?.name || 'Nông sản',
          icon: currentTile.crop.id === 'wheat' ? '🌾' : '🌿',
          type: 'crop',
          count: 1,
          price: goldReward
        });
      }

      // Reset tile to tilled soil ready for next planting
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          isWatered: false,
          crop: null,
          lastUpdated: Date.now()
        }
      };

      const updated = {
        tiles: newTiles,
        inventory: newInventory,
        gold: state.gold + goldReward,
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Thu hoạch thành công +1 ${cropDef?.name}! (+${goldReward} Gold)`, 'success');

      return { 
        success: true, 
        cropName: cropDef?.name || 'Nông sản',
        goldReward,
        vocabReward: cropDef?.vocabReward
      };
    },

    addGold: (amount) => {
      set((s) => ({ gold: s.gold + amount, updatedAt: Date.now() }));
    },

    hydrateFromCloud: (cloudState) => {
      set((prev) => ({
        ...prev,
        ...cloudState,
        tiles: cloudState.tiles ? { ...prev.tiles, ...cloudState.tiles } : prev.tiles,
        hotbar: cloudState.hotbar && cloudState.hotbar.length > 0 ? cloudState.hotbar : prev.hotbar,
        inventory: cloudState.inventory && cloudState.inventory.length > 0 ? cloudState.inventory : prev.inventory
      }));
    },

    initSync: async (userId) => {
      if (userId) {
        set({ currentUserId: userId });
      }
      setSyncStatusListener((status) => set({ syncStatus: status }));
      const loaded = await loadInitialFarmState(userId || get().currentUserId);
      if (loaded) {
        get().hydrateFromCloud(loaded);
      }
    }
  };
});
