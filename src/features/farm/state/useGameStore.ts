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
    name: 'Lúa Mì (Wheat)',
    seedId: 'seed_wheat',
    growthSeconds: 60, // 60s for demo & fast testing
    stages: 4,
    goldValue: 15,
    vocabReward: 'cultivate'
  },
  herb: {
    id: 'herb',
    name: 'Thảo Mộc (Herb)',
    seedId: 'seed_herb',
    growthSeconds: 120, // 2 minutes
    stages: 4,
    goldValue: 35,
    vocabReward: 'indigenous'
  }
};

export const SHOP_SEEDS = [
  { id: 'seed_wheat', name: 'Hạt Lúa Mì (Wheat)', icon: '🌱', cropId: 'wheat', price: 5, desc: 'Thời gian chín: 60s. Thu hoạch bán được 15 Gold.' },
  { id: 'seed_herb', name: 'Hạt Thảo Mộc (Herb)', icon: '🌿', cropId: 'herb', price: 12, desc: 'Thời gian chín: 120s. Thu hoạch bán được 35 Gold.' }
];

export const SHOP_CROPS = [
  { id: 'crop_wheat', name: 'Bông Lúa Mì', icon: '🌾', price: 15, desc: 'Nông sản thu hoạch từ lúa mì.' },
  { id: 'crop_herb', name: 'Nhánh Thảo Mộc', icon: '🌿', price: 35, desc: 'Dược liệu cao cấp từ thảo mộc.' }
];

export const SHOP_RESOURCES = [
  { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', price: 4, desc: 'Khai thác từ các khúc gỗ mục bằng Rìu.' },
  { id: 'resource_stone', name: 'Đá Cuội', icon: '🪨', price: 4, desc: 'Thu thập từ các tảng đá bằng Cuốc chim.' },
  { id: 'resource_fiber', name: 'Sợi Cỏ Dại', icon: '🌾', price: 1, desc: 'Cắt dọn từ các bụi cỏ dại bằng Liềm.' }
];

export const ALL_SELLABLE_ITEMS = [...SHOP_CROPS, ...SHOP_RESOURCES];


/**
 * Timestamp Delta & Watering Growth Calculation Engine (Decision 5C)
 * Plants ONLY accumulate growth seconds while soil is watered (isWatered === true).
 * When soil is dry, growth is frozen.
 */
export function getCropGrowthStage(
  crop: CropData | null, 
  isWatered = false, 
  now = Date.now()
): CropGrowthCalculation {
  if (!crop) {
    return { currentStage: 0, isRipe: false, percent: 0, elapsedSec: 0, remainingSec: 0 };
  }

  let baseAccSec = crop.growthSecondsAcc ?? 0;
  let currentWateredAt = crop.wateredAt;

  // Migration fallback: Handle legacy saves where only plantedAt existed
  if (crop.growthSecondsAcc === undefined && crop.plantedAt) {
    if (isWatered) {
      currentWateredAt = crop.plantedAt;
      baseAccSec = 0;
    } else {
      baseAccSec = 0;
      currentWateredAt = null;
    }
  }

  // Live delta only accrues while the tile is watered
  const liveSec = (isWatered && currentWateredAt)
    ? Math.max(0, (now - currentWateredAt) / 1000)
    : 0;

  const totalElapsedSec = Math.min(crop.totalGrowthSeconds, baseAccSec + liveSec);
  const stageDuration = crop.totalGrowthSeconds / (crop.totalStages - 1);
  const currentStage = Math.min(
    crop.totalStages - 1,
    Math.floor(totalElapsedSec / stageDuration)
  );
  const isRipe = currentStage >= crop.totalStages - 1;
  const percent = Math.min(100, Math.round((totalElapsedSec / crop.totalGrowthSeconds) * 100));

  return {
    currentStage,
    isRipe,
    percent,
    elapsedSec: Math.round(totalElapsedSec),
    remainingSec: Math.max(0, Math.ceil(crop.totalGrowthSeconds - totalElapsedSec))
  };
}

// 8 Expanded Hotbar Slots (Mapped to keys 1 - 8)
export const defaultHotbar: InventoryItem[] = [
  { id: 'hoe', name: 'Cuốc Đất (Hoe)', icon: '⛏️', type: 'tool' },
  { id: 'water_can', name: 'Bình Tưới (Water Can)', icon: '💧', type: 'tool' },
  { id: 'axe', name: 'Rìu Chặt Gỗ (Axe)', icon: '🪓', type: 'tool' },
  { id: 'pickaxe', name: 'Cuốc Chim Đập Đá (Pickaxe)', icon: '⛏', type: 'tool' },
  { id: 'scythe', name: 'Liềm Cắt Cỏ (Scythe)', icon: '🗡️', type: 'tool' },
  { id: 'hand', name: 'Thu Hoạch (Hand/Harvest)', icon: '✋', type: 'tool' },
  { id: 'seed_wheat', name: 'Hạt Lúa Mì (Wheat Seeds)', icon: '🌱', type: 'seed', count: 15, cropId: 'wheat' },
  { id: 'seed_herb', name: 'Hạt Thảo Mộc (Herb Seeds)', icon: '🌿', type: 'seed', count: 8, cropId: 'herb' }
];

export function createInitialTiles(): Record<string, TileData> {
  const tiles: Record<string, TileData> = {
    '12,8': {
      isTilled: true,
      isWatered: true,
      crop: {
        id: 'wheat',
        plantedAt: Date.now() - 35000,
        totalGrowthSeconds: 60,
        totalStages: 4,
        growthSecondsAcc: 20,
        wateredAt: Date.now() - 15000
      },
      obstacle: null
    },
    '13,8': {
      isTilled: true,
      isWatered: false,
      crop: null,
      obstacle: null
    },
    '14,8': {
      isTilled: true,
      isWatered: true,
      crop: {
        id: 'herb',
        plantedAt: Date.now() - 95000,
        totalGrowthSeconds: 120,
        totalStages: 4,
        growthSecondsAcc: 60,
        wateredAt: Date.now() - 35000
      },
      obstacle: null
    }
  };

  // Pre-configured natural obstacle positions (Rocks, Wood logs, Weeds)
  const obstaclePositions: Array<{ x: number; y: number; type: 'rock' | 'wood' | 'weed'; hp: number }> = [
    // Rocks (hp: 2)
    { x: 5, y: 4, type: 'rock', hp: 2 },
    { x: 6, y: 15, type: 'rock', hp: 2 },
    { x: 8, y: 11, type: 'rock', hp: 2 },
    { x: 20, y: 5, type: 'rock', hp: 2 },
    { x: 22, y: 14, type: 'rock', hp: 2 },
    { x: 25, y: 8, type: 'rock', hp: 2 },
    { x: 24, y: 17, type: 'rock', hp: 2 },
    { x: 9, y: 18, type: 'rock', hp: 2 },

    // Wood Logs (hp: 2)
    { x: 4, y: 9, type: 'wood', hp: 2 },
    { x: 7, y: 6, type: 'wood', hp: 2 },
    { x: 18, y: 12, type: 'wood', hp: 2 },
    { x: 21, y: 8, type: 'wood', hp: 2 },
    { x: 26, y: 12, type: 'wood', hp: 2 },
    { x: 11, y: 16, type: 'wood', hp: 2 },
    { x: 17, y: 16, type: 'wood', hp: 2 },
    { x: 3, y: 14, type: 'wood', hp: 2 },

    // Weeds (hp: 1)
    { x: 6, y: 8, type: 'weed', hp: 1 },
    { x: 10, y: 5, type: 'weed', hp: 1 },
    { x: 11, y: 10, type: 'weed', hp: 1 },
    { x: 16, y: 6, type: 'weed', hp: 1 },
    { x: 19, y: 9, type: 'weed', hp: 1 },
    { x: 23, y: 6, type: 'weed', hp: 1 },
    { x: 25, y: 15, type: 'weed', hp: 1 },
    { x: 8, y: 14, type: 'weed', hp: 1 },
    { x: 15, y: 15, type: 'weed', hp: 1 },
    { x: 20, y: 16, type: 'weed', hp: 1 },
    { x: 7, y: 17, type: 'weed', hp: 1 },
    { x: 27, y: 5, type: 'weed', hp: 1 }
  ];

  for (const obs of obstaclePositions) {
    const key = `${obs.x},${obs.y}`;
    tiles[key] = {
      isTilled: false,
      isWatered: false,
      crop: null,
      obstacle: {
        type: obs.type,
        hp: obs.hp,
        maxHp: obs.hp
      },
      lastUpdated: Date.now()
    };
  }

  return tiles;
}

const defaultInitialState: PlayerFarmState = {
  gold: 250,
  energy: 100,
  maxEnergy: 100,
  day: 1,
  activeTool: 'hoe',
  hotbar: defaultHotbar,
  inventory: [
    { id: 'crop_wheat', name: 'Bông Lúa Mì', icon: '🌾', type: 'crop', count: 2, price: 15 },
    { id: 'crop_herb', name: 'Nhánh Thảo Mộc', icon: '🌿', type: 'crop', count: 1, price: 35 },
    { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', type: 'resource', count: 4, price: 4 },
    { id: 'resource_stone', name: 'Đá Cuội', icon: '🪨', type: 'resource', count: 2, price: 4 }
  ],
  tiles: createInitialTiles(),
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
  gatherResource: (x: number, y: number) => {
    success: boolean;
    destroyed?: boolean;
    remainingHp?: number;
    resourceName?: string;
    resourceCount?: number;
    icon?: string;
    reason?: string;
  };
  addGold: (amount: number) => void;
  sleepNextDay: () => void;
  buySeed: (seedId: string, quantity?: number) => { success: boolean; reason?: string };
  sellCrop: (cropId: string, quantity?: number) => { success: boolean; reason?: string };
  sellAllCrops: () => { success: boolean; totalGold: number; totalSold: number };
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

      if (currentTile?.obstacle) {
        const obsName = currentTile.obstacle.type === 'rock' ? 'Đá cuội' : currentTile.obstacle.type === 'wood' ? 'Khúc gỗ' : 'Cỏ dại';
        const msg = `Ô đất đang có ${obsName}! Cần dùng công cụ khai thác để dọn dẹp trước.`;
        get().notify(msg, 'warning');
        return { success: false, reason: `Vướng ${obsName}!` };
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
          obstacle: null,
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

      if (currentTile?.obstacle) {
        const msg = 'Không thể tưới nước lên chướng ngại vật!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

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

      const now = Date.now();
      const updatedCrop = currentTile.crop ? {
        ...currentTile.crop,
        wateredAt: now
      } : null;

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          isWatered: true,
          crop: updatedCrop,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        energy: Math.max(0, state.energy - 1),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      if (updatedCrop) {
        get().notify('Đã tưới nước! Cây bắt đầu tích lũy thời gian lớn.', 'success');
      } else {
        get().notify('Đất đã được tưới ẩm, sẵn sàng để gieo hạt!', 'info');
      }
      return { success: true };
    },

    // Slot 3 & 5: Gieo hạt (Seed)
    // Allows planting on ANY tilled soil (dry or watered).
    // If soil is dry, plant is frozen until watered.
    plantCrop: (x, y, seedId) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.isTilled) {
        const msg = 'Cần cuốc đất trước khi gieo hạt!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile?.obstacle) {
        const msg = 'Không thể gieo hạt lên ô đang có chướng ngại vật!';
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

      const now = Date.now();
      const isWatered = Boolean(currentTile.isWatered);

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          crop: {
            id: cropDef.id,
            plantedAt: now,
            totalGrowthSeconds: cropDef.growthSeconds,
            totalStages: cropDef.stages,
            growthSecondsAcc: 0,
            wateredAt: isWatered ? now : null
          },
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        energy: Math.max(0, state.energy - 1),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      if (isWatered) {
        get().notify(`Đã gieo mầm ${cropDef.name} (Đất ẩm, mầm bắt đầu phát triển)!`, 'success');
      } else {
        get().notify(`Đã gieo mầm ${cropDef.name} (Đất khô, hãy tưới nước để cây lớn)!`, 'info');
      }
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

      const growth = getCropGrowthStage(currentTile.crop, currentTile.isWatered);
      if (!growth.isRipe) {
        const msg = currentTile.isWatered
          ? `Cây chưa chín (Stage ${growth.currentStage}/${currentTile.crop.totalStages - 1})! Còn ${growth.remainingSec}s nữa mới có thể thu hoạch.`
          : `Cây chưa chín và đất đang khô! Hãy tưới nước để cây tiếp tục lớn.`;
        get().notify(msg, 'warning');
        return { 
          success: false, 
          reason: currentTile.isWatered ? `Chưa chín! Còn ${growth.remainingSec}s` : 'Đất khô! Cần tưới nước' 
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

    // Resource Gathering (Axe -> Wood, Pickaxe -> Rock, Scythe -> Weed)
    gatherResource: (x, y) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.obstacle) {
        return { success: false, reason: 'Không có chướng ngại vật ở ô này!' };
      }

      const obstacle = currentTile.obstacle;
      const tool = state.activeTool;

      // 1. Tool Matching Validation
      if (obstacle.type === 'wood' && tool !== 'axe') {
        const msg = 'Cần dùng Rìu (Phím 3) để chặt khúc gỗ!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Cần dùng Rìu!' };
      }
      if (obstacle.type === 'rock' && tool !== 'pickaxe') {
        const msg = 'Cần dùng Cuốc chim (Phím 4) để đập tảng đá!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Cần dùng Cuốc chim!' };
      }
      if (obstacle.type === 'weed' && tool !== 'scythe') {
        const msg = 'Cần dùng Liềm (Phím 5) để cắt dọn bụi cỏ dại!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Cần dùng Liềm!' };
      }

      // 2. Energy Consumption
      const energyCost = obstacle.type === 'weed' ? 1 : 3;
      if (state.energy < energyCost) {
        const msg = `Kiệt sức! Cần ${energyCost} Năng lượng để thao tác.`;
        get().notify(msg, 'warning');
        return { success: false, reason: 'Không đủ năng lượng!' };
      }

      const newHp = obstacle.hp - 1;
      const isDestroyed = newHp <= 0;
      const now = Date.now();

      let resourceReward: { id: string; name: string; icon: string; count: number; price: number } | null = null;
      if (isDestroyed) {
        if (obstacle.type === 'wood') {
          resourceReward = { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', count: 2, price: 4 };
        } else if (obstacle.type === 'rock') {
          resourceReward = { id: 'resource_stone', name: 'Đá Cuội', icon: '🪨', count: 2, price: 4 };
        } else if (obstacle.type === 'weed') {
          resourceReward = { id: 'resource_fiber', name: 'Sợi Cỏ Dại', icon: '🌾', count: 1, price: 1 };
        }
      }

      // Update Inventory if resource yielded
      let newInventory = [...(state.inventory || [])];
      if (resourceReward) {
        const existingIdx = newInventory.findIndex((i) => i.id === resourceReward.id);
        if (existingIdx >= 0) {
          newInventory[existingIdx] = {
            ...newInventory[existingIdx],
            count: (newInventory[existingIdx].count ?? 0) + resourceReward.count
          };
        } else {
          newInventory.push({
            id: resourceReward.id,
            name: resourceReward.name,
            icon: resourceReward.icon,
            type: 'resource',
            count: resourceReward.count,
            price: resourceReward.price
          });
        }
      }

      // Update Tile Data
      const updatedTile: TileData = {
        ...currentTile,
        obstacle: isDestroyed ? null : { ...obstacle, hp: newHp },
        lastUpdated: now
      };

      const newTiles = {
        ...state.tiles,
        [key]: updatedTile
      };

      const updated = {
        tiles: newTiles,
        inventory: newInventory,
        energy: Math.max(0, state.energy - energyCost),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });

      if (isDestroyed && resourceReward) {
        get().notify(`Thu hoạch +${resourceReward.count} ${resourceReward.name} ${resourceReward.icon} (-${energyCost} Năng lượng)!`, 'success');
        return {
          success: true,
          destroyed: true,
          resourceName: resourceReward.name,
          resourceCount: resourceReward.count,
          icon: resourceReward.icon
        };
      } else {
        get().notify(`Đã đánh trúng (-${energyCost} Năng lượng, còn ${newHp} HP)!`, 'info');
        return {
          success: true,
          destroyed: false,
          remainingHp: newHp
        };
      }
    },

    addGold: (amount) => {
      set((s) => ({ gold: s.gold + amount, updatedAt: Date.now() }));
    },

    // 1. Core Simulation: Sleep & Advance to Next Day
    // Overnight: watered crops advance by 1 stage, unwatered crops stay frozen, all tiles dry out.
    sleepNextDay: () => {
      const state = get();
      const nextDay = state.day + 1;
      const now = Date.now();

      let boostedCropsCount = 0;
      const updatedTiles: Record<string, TileData> = {};

      for (const [key, tile] of Object.entries(state.tiles)) {
        let updatedCrop = tile.crop;

        if (tile.crop) {
          const stageDuration = tile.crop.totalGrowthSeconds / (tile.crop.totalStages - 1);

          if (tile.isWatered) {
            // Watered crop: advances by 1 stage overnight
            const currentLiveGrowth = getCropGrowthStage(tile.crop, true, now);
            const nextStage = Math.min(tile.crop.totalStages - 1, currentLiveGrowth.currentStage + 1);
            const targetAccSec = Math.min(tile.crop.totalGrowthSeconds, nextStage * stageDuration);

            updatedCrop = {
              ...tile.crop,
              growthSecondsAcc: targetAccSec,
              wateredAt: null // Freezes until watered again next morning
            };
            boostedCropsCount++;
          } else {
            // Dry soil: growth remained frozen all day, preserve accumulated seconds
            const frozenGrowth = getCropGrowthStage(tile.crop, false, now);
            updatedCrop = {
              ...tile.crop,
              growthSecondsAcc: frozenGrowth.elapsedSec,
              wateredAt: null
            };
          }
        }

        updatedTiles[key] = {
          ...tile,
          crop: updatedCrop,
          isWatered: false, // All soil dries up overnight
          lastUpdated: now
        };
      }

      const updated = {
        day: nextDay,
        energy: state.maxEnergy, // 100% recovered
        tiles: updatedTiles,
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      
      const boostDetail = boostedCropsCount > 0 
        ? ` (${boostedCropsCount} cây trồng được tưới nước đã lớn thêm 1 giai đoạn)` 
        : '';
      get().notify(`🌅 Bình minh Ngày ${nextDay}! Thể lực hồi phục (${state.maxEnergy}/${state.maxEnergy}). Đất đã khô ráo${boostDetail}.`, 'success');
    },

    // 2. Core Economy: Buy Seeds from Shop
    buySeed: (seedId: string, quantity = 1) => {
      const state = get();
      const seedDef = SHOP_SEEDS.find((s) => s.id === seedId);
      if (!seedDef) {
        get().notify('Loại hạt giống không hợp lệ!', 'error');
        return { success: false, reason: 'Hạt giống không hợp lệ' };
      }

      const totalCost = seedDef.price * quantity;
      if (state.gold < totalCost) {
        const msg = `Không đủ tiền vàng! Cần ${totalCost} Gold nhưng chỉ có ${state.gold} Gold.`;
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      // Add to hotbar if slot exists
      let inHotbar = false;
      const newHotbar = state.hotbar.map((item) => {
        if (item.id === seedId) {
          inHotbar = true;
          return { ...item, count: (item.count ?? 0) + quantity };
        }
        return item;
      });

      // If not in hotbar, add to inventory
      let newInventory = [...(state.inventory || [])];
      if (!inHotbar) {
        const invIdx = newInventory.findIndex((i) => i.id === seedId);
        if (invIdx >= 0) {
          newInventory[invIdx] = {
            ...newInventory[invIdx],
            count: (newInventory[invIdx].count ?? 0) + quantity
          };
        } else {
          newInventory.push({
            id: seedDef.id,
            name: seedDef.name,
            icon: seedDef.icon,
            type: 'seed',
            count: quantity,
            cropId: seedDef.cropId,
            price: seedDef.price
          });
        }
      }

      const updated = {
        gold: state.gold - totalCost,
        hotbar: newHotbar,
        inventory: newInventory,
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã mua ${quantity}x ${seedDef.name} (-${totalCost} Gold)!`, 'success');
      return { success: true };
    },

    // 3. Core Economy: Sell Crop Harvests & Gathered Resources to Shop
    sellCrop: (itemId: string, quantity = 1) => {
      const state = get();
      const itemDef = ALL_SELLABLE_ITEMS.find((c) => c.id === itemId);
      if (!itemDef) {
        get().notify('Mặt hàng không hợp lệ!', 'error');
        return { success: false, reason: 'Mặt hàng không hợp lệ' };
      }

      const invItem = (state.inventory || []).find((i) => i.id === itemId);
      const availableCount = invItem?.count ?? 0;
      if (availableCount < quantity) {
        const msg = `Không đủ hàng trong kho! Bạn có ${availableCount} đơn vị.`;
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const totalEarned = itemDef.price * quantity;
      const newInventory = (state.inventory || []).map((item) => {
        if (item.id === itemId) {
          return { ...item, count: Math.max(0, (item.count ?? 0) - quantity) };
        }
        return item;
      }).filter((item) => (item.type !== 'crop' && item.type !== 'resource') || (item.count ?? 0) > 0);

      const updated = {
        gold: state.gold + totalEarned,
        inventory: newInventory,
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã bán ${quantity}x ${itemDef.name} (+${totalEarned} Gold)!`, 'success');
      return { success: true };
    },

    // 4. Core Economy: Sell All Crops & Resources at once
    sellAllCrops: () => {
      const state = get();
      const itemsToSell = (state.inventory || []).filter((i) => (i.type === 'crop' || i.type === 'resource') && (i.count ?? 0) > 0);

      if (itemsToSell.length === 0) {
        get().notify('Không có nông sản hay tài nguyên nào trong kho để bán!', 'info');
        return { success: false, totalGold: 0, totalSold: 0 };
      }

      let totalGold = 0;
      let totalSold = 0;

      for (const item of itemsToSell) {
        const itemDef = ALL_SELLABLE_ITEMS.find((c) => c.id === item.id);
        const unitPrice = itemDef?.price ?? item.price ?? 2;
        const count = item.count ?? 0;
        totalGold += unitPrice * count;
        totalSold += count;
      }

      const newInventory = (state.inventory || []).filter((i) => i.type !== 'crop' && i.type !== 'resource');
      const updated = {
        gold: state.gold + totalGold,
        inventory: newInventory,
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Bán sạch hàng hóa! Thu về +${totalGold} Gold từ ${totalSold} sản phẩm & tài nguyên.`, 'success');
      return { success: true, totalGold, totalSold };
    },

    hydrateFromCloud: (cloudState) => {
      set((prev) => {
        // Ensure all default permanent tools are retained in hotbar even from old saves
        let mergedHotbar = prev.hotbar;
        if (cloudState.hotbar && cloudState.hotbar.length > 0) {
          const loadedIds = new Set(cloudState.hotbar.map((i) => i.id));
          const missingTools = defaultHotbar.filter((t) => t.type === 'tool' && !loadedIds.has(t.id));
          mergedHotbar = [...cloudState.hotbar, ...missingTools];
        }

        return {
          ...prev,
          ...cloudState,
          tiles: cloudState.tiles ? { ...prev.tiles, ...cloudState.tiles } : prev.tiles,
          hotbar: mergedHotbar,
          inventory: cloudState.inventory && cloudState.inventory.length > 0 ? cloudState.inventory : prev.inventory
        };
      });
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
