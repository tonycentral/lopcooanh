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
  NotificationMessage,
  PlaceableType,
  CraftingRecipe
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
  },
  apple: {
    id: 'apple',
    name: 'Cây Táo (Apple Tree)',
    seedId: 'seed_apple',
    growthSeconds: 1800, // 30 minutes to mature
    stages: 4,
    goldValue: 15, // 15 Gold per apple (x3 apples = 45 Gold)
    vocabReward: 'orchard'
  }
};

export const SHOP_SEEDS = [
  { id: 'seed_wheat', name: 'Hạt Lúa Mì (Wheat)', icon: '🌱', cropId: 'wheat', price: 5, desc: 'Thời gian chín: 60s. Thu hoạch bán được 15 Gold.' },
  { id: 'seed_herb', name: 'Hạt Thảo Mộc (Herb)', icon: '🌿', cropId: 'herb', price: 12, desc: 'Thời gian chín: 120s. Thu hoạch bán được 35 Gold.' },
  { id: 'seed_apple', name: 'Hạt Cây Táo (Apple Tree)', icon: '🍎🌱', cropId: 'apple', price: 25, desc: 'Thời gian lớn: 30 phút. Thu hoạch bằng tay được 3 Trái Táo (15 Gold/trái) và tự kết trái lại sau 15 phút. Dùng Rìu chặt thu được 6 Gỗ.' }
];

export const SHOP_CROPS = [
  { id: 'crop_wheat', name: 'Bông Lúa Mì', icon: '🌾', price: 15, desc: 'Nông sản thu hoạch từ lúa mì.' },
  { id: 'crop_herb', name: 'Nhánh Thảo Mộc', icon: '🌿', price: 35, desc: 'Dược liệu cao cấp từ thảo mộc.' },
  { id: 'crop_apple', name: 'Trái Táo Đỏ', icon: '🍎', price: 15, desc: 'Trái cây ngọt lịm thu hoạch từ cây táo.' }
];

export const SHOP_RESOURCES = [
  { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', price: 4, desc: 'Khai thác từ các khúc gỗ mục bằng Rìu.' },
  { id: 'resource_stone', name: 'Đá Cuội', icon: '🪨', price: 4, desc: 'Thu thập từ các tảng đá bằng Cuốc chim.' },
  { id: 'resource_fiber', name: 'Sợi Cỏ Dại', icon: '🌾', price: 1, desc: 'Cắt dọn từ các bụi cỏ dại bằng Liềm.' }
];

export const ALL_SELLABLE_ITEMS = [...SHOP_CROPS, ...SHOP_RESOURCES];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'craft_fence',
    name: 'Hàng Rào Gỗ',
    icon: '🪵',
    outputItemId: 'item_fence',
    outputName: 'Hàng Rào Gỗ (x2)',
    outputCount: 2,
    desc: 'Hàng rào kiên cố dùng để bao quanh và trang trí nông trại. Cản đường di chuyển.',
    ingredients: [
      { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', count: 4 }
    ]
  },
  {
    id: 'craft_chest',
    name: 'Rương Gỗ Lưu Trữ',
    icon: '📦',
    outputItemId: 'item_chest',
    outputName: 'Rương Gỗ (x1)',
    outputCount: 1,
    desc: 'Rương chứa đồ tiện lợi với 8 ngăn. Đặt trên ô cỏ hoặc đất trống để cất giữ đồ đạc.',
    ingredients: [
      { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', count: 10 },
      { id: 'resource_stone', name: 'Đá Cuội', icon: '🪨', count: 5 }
    ]
  },
  {
    id: 'craft_fertilizer',
    name: 'Phân Bón Sinh Học',
    icon: '🧪',
    outputItemId: 'item_fertilizer',
    outputName: 'Phân Bón Sinh Học (x2)',
    outputCount: 2,
    desc: 'Phân bón hữu cơ ủ từ sợi cỏ dại. Bón vào đất để giảm 50% thời gian lớn của cây.',
    ingredients: [
      { id: 'resource_fiber', name: 'Sợi Cỏ Dại', icon: '🌾', count: 2 }
    ]
  }
];


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

  // Withered crop due to over-ripening: cannot be normally harvested
  if (crop.isWithered) {
    return {
      currentStage: crop.totalStages - 1,
      isRipe: false,
      percent: 100,
      elapsedSec: crop.totalGrowthSeconds,
      remainingSec: 0
    };
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

export interface OfflineSimulationSummary {
  hoursPassed: number;
  spawnedWeeds: number;
  spawnedObstacles: number;
  revertedSoils: number;
  witheredCrops: number;
  deadTrees: number;
}

/**
 * Natural Offline Simulation Engine:
 * - Calculates time delta based on Date.now() - lastSimulatedAt
 * - Spawns periodic weeds and obstacles on empty grass tiles (capped at 30% map area)
 * - Reverts dry uncultivated tilled soil to grass after 3 hours (10,800s)
 * - Withers unharvested ripe crops (wheat/herb after 6h; apple tree dies after 14 days)
 */
export function calculateOfflineSimulation(
  tiles: Record<string, TileData>,
  lastSimulatedAt: number,
  now: number = Date.now(),
  playerPos?: { x: number; y: number }
): {
  tiles: Record<string, TileData>;
  summary: OfflineSimulationSummary;
  notice?: string;
} {
  const lastSim = lastSimulatedAt || (now - 1000);
  const elapsedMs = Math.max(0, now - lastSim);
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const summary: OfflineSimulationSummary = {
    hoursPassed: Math.floor(elapsedSec / 3600),
    spawnedWeeds: 0,
    spawnedObstacles: 0,
    revertedSoils: 0,
    witheredCrops: 0,
    deadTrees: 0
  };

  const newTiles: Record<string, TileData> = { ...tiles };
  const playerGx = playerPos ? Math.floor(playerPos.x / 32) : 12;
  const playerGy = playerPos ? Math.floor(playerPos.y / 32) : 10;

  // ---------------------------------------------------------------------------
  // A. PERIODIC OBSTACLE SPAWNING (Every 3600s: 1-2 weeds, 1 rock/wood)
  // Max cap: 30% of total map area (30x20 = 600 tiles -> 180 obstacles)
  // ---------------------------------------------------------------------------
  let currentObstacleCount = Object.values(newTiles).filter((t) => Boolean(t.obstacle)).length;
  const MAX_OBSTACLES = 180;

  if (summary.hoursPassed > 0 && currentObstacleCount < MAX_OBSTACLES) {
    // Find candidate empty grass tiles
    const emptyTileKeys: string[] = [];
    for (let gx = 0; gx < 30; gx++) {
      for (let gy = 0; gy < 20; gy++) {
        // Exclude special indestructible stations
        if ((gx === 15 && gy === 3) || (gx === 18 && gy === 3)) continue;
        // Distance >= 3 tiles from player
        if (Math.hypot(gx - playerGx, gy - playerGy) < 3) continue;

        const key = `${gx},${gy}`;
        const t = newTiles[key];
        const isEmpty = !t || (!t.isTilled && !t.crop && !t.obstacle && !t.placeable && !t.station);
        if (isEmpty) {
          emptyTileKeys.push(key);
        }
      }
    }

    // Limit simulation processing up to 24 hourly cycles
    const cyclesToSimulate = Math.min(summary.hoursPassed, 24);
    for (let h = 0; h < cyclesToSimulate; h++) {
      if (emptyTileKeys.length === 0 || currentObstacleCount >= MAX_OBSTACLES) break;

      // 1. Spawn 1-2 weeds
      const weedsCount = (h % 2 === 0) ? 1 : 2;
      for (let w = 0; w < weedsCount; w++) {
        if (emptyTileKeys.length === 0 || currentObstacleCount >= MAX_OBSTACLES) break;
        const randIdx = Math.floor(Math.random() * emptyTileKeys.length);
        const [chosenKey] = emptyTileKeys.splice(randIdx, 1);
        const existing = newTiles[chosenKey] || { isTilled: false, isWatered: false, crop: null };
        newTiles[chosenKey] = {
          ...existing,
          obstacle: { type: 'weed', hp: 1, maxHp: 1 },
          lastUpdated: now
        };
        currentObstacleCount++;
        summary.spawnedWeeds++;
      }

      // 2. Spawn 1 rock or wood log
      if (emptyTileKeys.length > 0 && currentObstacleCount < MAX_OBSTACLES) {
        const randIdx = Math.floor(Math.random() * emptyTileKeys.length);
        const [chosenKey] = emptyTileKeys.splice(randIdx, 1);
        const obsType: 'rock' | 'wood' = Math.random() > 0.5 ? 'rock' : 'wood';
        const existing = newTiles[chosenKey] || { isTilled: false, isWatered: false, crop: null };
        newTiles[chosenKey] = {
          ...existing,
          obstacle: { type: obsType, hp: 2, maxHp: 2 },
          lastUpdated: now
        };
        currentObstacleCount++;
        summary.spawnedObstacles++;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // B. SOIL REVERSION & C. CROP OVER-RIPENING / DECAY
  // ---------------------------------------------------------------------------
  for (const [key, tile] of Object.entries(newTiles)) {
    // B. Soil Reversion (Tilled, uncultivated & dry for 3 hours / 10,800s)
    if (tile.isTilled && !tile.crop && !tile.isWatered) {
      const uncultivatedSince = tile.uncultivatedSince || tile.lastUpdated || lastSim;
      if (now - uncultivatedSince >= 10800 * 1000) {
        newTiles[key] = {
          ...tile,
          isTilled: false,
          isWatered: false,
          isFertilized: false,
          uncultivatedSince: null,
          lastUpdated: now
        };
        summary.revertedSoils++;
        continue;
      } else if (!tile.uncultivatedSince) {
        newTiles[key] = { ...tile, uncultivatedSince };
      }
    } else if (tile.uncultivatedSince && (tile.crop || tile.isWatered)) {
      newTiles[key] = { ...tile, uncultivatedSince: null };
    }

    // C. Crop Over-ripening & Decay
    if (tile.crop) {
      const growth = getCropGrowthStage(tile.crop, tile.isWatered, now);
      if (growth.isRipe && !tile.crop.isWithered) {
        const ripeSince = tile.crop.ripeAt || (now - Math.min(elapsedMs, 3600000));
        if (!tile.crop.ripeAt) {
          tile.crop = { ...tile.crop, ripeAt: ripeSince };
          newTiles[key] = { ...tile, crop: tile.crop };
        }

        const ripeDuration = now - ripeSince;

        // Wheat & Herb wither after 6 hours (21,600s)
        if (tile.crop.id === 'wheat' || tile.crop.id === 'herb') {
          if (ripeDuration >= 21600 * 1000) {
            newTiles[key] = {
              ...tile,
              crop: {
                ...tile.crop,
                isWithered: true
              },
              lastUpdated: now
            };
            summary.witheredCrops++;
          }
        }

        // Apple trees die after 14 days (1,209,600s) into dead wood log
        if (tile.crop.id === 'apple') {
          if (ripeDuration >= 1209600 * 1000) {
            newTiles[key] = {
              ...tile,
              crop: null,
              isTilled: false,
              obstacle: { type: 'wood', hp: 2, maxHp: 2 },
              lastUpdated: now
            };
            summary.deadTrees++;
          }
        }
      }
    }
  }

  // Generate friendly ecosystem feedback notice
  const noticeParts: string[] = [];
  if (summary.spawnedWeeds > 0) noticeParts.push(`${summary.spawnedWeeds} cỏ dại mới`);
  if (summary.spawnedObstacles > 0) noticeParts.push(`${summary.spawnedObstacles} đá/gỗ`);
  if (summary.revertedSoils > 0) noticeParts.push(`${summary.revertedSoils} ô đất hoàn cỏ`);
  if (summary.witheredCrops > 0) noticeParts.push(`${summary.witheredCrops} cây quá vụ héo úa`);
  if (summary.deadTrees > 0) noticeParts.push(`${summary.deadTrees} cây mục`);

  const notice = noticeParts.length > 0 
    ? `🌿 Hệ sinh thái tự nhiên: Đã xuất hiện ${noticeParts.join(', ')} trong thời gian bạn vắng mặt.`
    : undefined;

  return {
    tiles: newTiles,
    summary,
    notice
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
    },
    // Indestructible Rest Stations on the Grid
    '15,3': {
      isTilled: false,
      isWatered: false,
      crop: null,
      station: { type: 'campfire', isDestructible: false },
      lastUpdated: Date.now()
    },
    '18,3': {
      isTilled: false,
      isWatered: false,
      crop: null,
      station: { type: 'bbq_stand', isDestructible: false },
      lastUpdated: Date.now()
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
  xp: 0,
  level: 1,
  masteredQuizIds: [],
  day: 1,
  activeTool: 'hoe',
  activeSeedId: 'seed_wheat',
  lastSimulatedAt: Date.now(),
  hotbar: defaultHotbar,
  inventory: [
    { id: 'crop_wheat', name: 'Bông Lúa Mì', icon: '🌾', type: 'crop', count: 2, price: 15 },
    { id: 'crop_herb', name: 'Nhánh Thảo Mộc', icon: '🌿', type: 'crop', count: 1, price: 35 },
    { id: 'seed_apple', name: 'Hạt Cây Táo (Apple Tree)', icon: '🍎🌱', type: 'seed', count: 3, cropId: 'apple', price: 25 },
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
  selectSeed: (seedId: string) => void;
  toggleMoveOnlyMode: () => void;
  runOfflineSimulation: (playerPos?: { x: number; y: number }) => void;
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
  craftItem: (recipeId: string) => { success: boolean; reason?: string };
  placeEntity: (x: number, y: number, placeableType: PlaceableType) => { success: boolean; reason?: string };
  dismantleEntity: (x: number, y: number) => { success: boolean; reason?: string };
  fertilizeTile: (x: number, y: number) => { success: boolean; reason?: string };
  depositToChest: (chestKey: string, itemId: string, count?: number) => { success: boolean; reason?: string };
  withdrawFromChest: (chestKey: string, itemId: string, count?: number) => { success: boolean; reason?: string };
  completeQuizReward: (energyReward: number, xpReward: number) => void;
  recordQuizResult: (quizId: string, isCorrect: boolean, energyReward: number, xpReward: number) => { isLevelUp: boolean; newLevel: number; earnedEnergy: number; earnedXp: number };
  resetMasteredQuizzes: () => void;
  orderBBQMeal: (food: import('../types').BBQFoodItem) => { success: boolean; reason?: string };
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

    selectSeed: (seedId) => {
      set({ activeSeedId: seedId, activeTool: seedId });
      const seedDef = SHOP_SEEDS.find((s) => s.id === seedId);
      if (seedDef) {
        get().notify(`Đã chọn gieo ${seedDef.name}`, 'info');
      }
    },

    toggleMoveOnlyMode: () => {
      const current = get().activeTool;
      if (current === 'none') {
        set({ activeTool: 'hoe' });
        get().notify('Đã chuyển về Cuốc Đất.', 'info');
      } else {
        set({ activeTool: 'none' });
        get().notify('✋ Đã bật Chế độ Quan Sát / Chỉ Di Chuyển (Phím 0 để đổi lại)', 'info');
      }
    },

    runOfflineSimulation: (playerPos?: { x: number; y: number }) => {
      const state = get();
      const now = Date.now();
      const lastSim = state.lastSimulatedAt || state.updatedAt || now;
      const res = calculateOfflineSimulation(state.tiles, lastSim, now, playerPos);

      const hasEvents = (
        res.summary.spawnedWeeds > 0 ||
        res.summary.spawnedObstacles > 0 ||
        res.summary.revertedSoils > 0 ||
        res.summary.witheredCrops > 0 ||
        res.summary.deadTrees > 0
      );

      if (hasEvents) {
        const updated = {
          tiles: res.tiles,
          lastSimulatedAt: now,
          updatedAt: now
        };
        set(updated);
        queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
        if (res.notice) {
          get().notify(res.notice, 'info');
        }
      } else {
        set({ lastSimulatedAt: now });
      }
    },

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
      if ((x === 15 && y === 3) || (x === 18 && y === 3)) {
        get().notify('Khu vực Công Trình Đặc Biệt, không thể cuốc đất!', 'warning');
        return { success: false, reason: 'Khu Công Trình!' };
      }
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      // If tile has a withered crop, Hoe can clear it for 1 fiber
      if (currentTile?.crop?.isWithered) {
        return get().gatherResource(x, y);
      }

      if (currentTile?.crop) {
        const msg = 'Đang có cây trồng trên ô này, không thể cuốc!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile?.placeable) {
        const msg = 'Ô đất đang có công trình kiến trúc, không thể cuốc!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Vướng công trình!' };
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

      const now = Date.now();
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...(currentTile || {}),
          isTilled: true,
          isWatered: false,
          crop: null,
          obstacle: null,
          uncultivatedSince: now,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        energy: Math.max(0, state.energy - 2),
        updatedAt: now
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

      if (currentTile?.station || (x === 15 && y === 3) || (x === 18 && y === 3)) {
        const msg = 'Không thể tưới nước lên trạm nghỉ chân!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile?.obstacle) {
        const msg = 'Không thể tưới nước lên chướng ngại vật!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      if (currentTile?.placeable) {
        const msg = 'Không thể tưới nước lên công trình kiến trúc!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Vướng công trình!' };
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
          uncultivatedSince: null,
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

      if (currentTile?.placeable) {
        const msg = 'Không thể gieo hạt lên công trình kiến trúc!';
        get().notify(msg, 'warning');
        return { success: false, reason: 'Vướng công trình!' };
      }

      if (currentTile.crop) {
        const msg = 'Ô đất này đã có mầm cây đang phát triển!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const seedInHotbar = state.hotbar.find((item) => item.id === seedId && (item.count ?? 0) > 0);
      const seedInInv = state.inventory.find((item) => item.id === seedId && (item.count ?? 0) > 0);
      const seedItem = seedInHotbar || seedInInv;

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

      const targetCropId = seedItem.cropId || (seedId.replace('seed_', ''));
      const cropDef = CROP_DEFINITIONS[targetCropId];
      if (!cropDef) {
        const msg = 'Hạt giống không hợp lệ!';
        get().notify(msg, 'error');
        return { success: false, reason: msg };
      }

      let newHotbar = state.hotbar;
      let newInventory = state.inventory;

      if (seedInHotbar) {
        newHotbar = state.hotbar.map((item) => {
          if (item.id === seedId) {
            return { ...item, count: (item.count ?? 1) - 1 };
          }
          return item;
        });
      } else if (seedInInv) {
        newInventory = state.inventory.map((item) => {
          if (item.id === seedId) {
            return { ...item, count: (item.count ?? 1) - 1 };
          }
          return item;
        }).filter((item) => (item.count ?? 0) > 0);
      }

      const now = Date.now();
      const isWatered = Boolean(currentTile.isWatered);
      const isFertilized = Boolean(currentTile.isFertilized);
      const effectiveGrowthSec = isFertilized
        ? Math.max(10, Math.round(cropDef.growthSeconds * 0.5))
        : cropDef.growthSeconds;

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          crop: {
            id: cropDef.id,
            plantedAt: now,
            totalGrowthSeconds: effectiveGrowthSec,
            totalStages: cropDef.stages,
            growthSecondsAcc: 0,
            wateredAt: isWatered ? now : null,
            isWithered: false,
            ripeAt: null
          },
          uncultivatedSince: null,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        inventory: newInventory,
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

      // Over-ripened withered crop protection
      if (currentTile.crop.isWithered) {
        const msg = 'Cây đã bị héo úa do quá hạn thu hoạch! Hãy dùng Liềm hoặc Cuốc để dọn dẹp.';
        get().notify(msg, 'warning');
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
      const now = Date.now();

      // Special Handling for Apple Tree: Hand Harvest yields 3 Apples and rolls back to Stage 2!
      if (currentTile.crop.id === 'apple') {
        const appleItemId = 'crop_apple';
        let newInventory = [...(state.inventory || [])];
        const existingInvIdx = newInventory.findIndex((i) => i.id === appleItemId);
        if (existingInvIdx >= 0) {
          newInventory[existingInvIdx] = {
            ...newInventory[existingInvIdx],
            count: (newInventory[existingInvIdx].count ?? 0) + 3
          };
        } else {
          newInventory.push({
            id: appleItemId,
            name: 'Trái Táo Đỏ',
            icon: '🍎',
            type: 'crop',
            count: 3,
            price: 15
          });
        }

        // Roll back to Stage 2 (growthSecondsAcc = 900s, total = 1800s -> needs 900s / 15 mins to fruit again)
        const rolledBackCrop: CropData = {
          ...currentTile.crop,
          growthSecondsAcc: 900,
          wateredAt: currentTile.isWatered ? now : null,
          isWithered: false,
          ripeAt: null
        };

        const newTiles: Record<string, TileData> = {
          ...state.tiles,
          [key]: {
            ...currentTile,
            crop: rolledBackCrop,
            lastUpdated: now
          }
        };

        const updated = {
          tiles: newTiles,
          inventory: newInventory,
          updatedAt: now
        };

        set(updated);
        queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
        get().notify('Thu hoạch thành công +3 Trái Táo 🍎! Cây táo trở về giai đoạn 2 và sẽ kết trái lại sau 15 phút tưới nước.', 'success');

        return {
          success: true,
          cropName: 'Trái Táo Đỏ (x3)',
          goldReward: 45,
          vocabReward: 'orchard'
        };
      }

      // Standard single-harvest crops (Wheat, Herb)
      const goldReward = cropDef?.goldValue || 20;
      const cropItemId = `crop_${currentTile.crop.id}`;

      let newInventory = [...(state.inventory || [])];
      const existingInvIdx = newInventory.findIndex((i) => i.id === cropItemId);
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

      // Reset tile to tilled soil ready for next planting (fertilizer is consumed)
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          isWatered: false,
          crop: null,
          isFertilized: false,
          uncultivatedSince: now,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        inventory: newInventory,
        gold: state.gold + goldReward,
        updatedAt: now
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

    // Resource Gathering (Axe -> Wood/Apple Tree, Pickaxe -> Rock, Scythe -> Weed/Withered Crop)
    gatherResource: (x, y) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];
      const tool = state.activeTool;
      const now = Date.now();

      if ((x === 15 && y === 3) || (x === 18 && y === 3) || currentTile?.station || currentTile?.obstacle?.isDestructible === false) {
        const msg = 'Trạm nghỉ chân bất hoại, không thể phá hủy!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      // -----------------------------------------------------------------------
      // Special Sub-case: Gathering / Clearing Crops (Withered crop or Apple Tree)
      // -----------------------------------------------------------------------
      if (currentTile?.crop) {
        // A. Withered Crop cleared with Scythe or Hoe for 1 Fiber
        if (currentTile.crop.isWithered) {
          if (tool !== 'scythe' && tool !== 'hoe') {
            const msg = 'Cần dùng Liềm (Phím 5) hoặc Cuốc (Phím 1) để dọn dẹp bụi cây héo úa!';
            get().notify(msg, 'warning');
            return { success: false, reason: 'Cần Liềm hoặc Cuốc!' };
          }

          if (state.energy < 1) {
            get().notify('Kiệt sức! Cần 1 Năng lượng để dọn dẹp.', 'warning');
            return { success: false, reason: 'Không đủ năng lượng!' };
          }

          const fiberReward = { id: 'resource_fiber', name: 'Sợi Cỏ Dại', icon: '🌾', count: 1, price: 1 };
          let newInventory = [...(state.inventory || [])];
          const existingIdx = newInventory.findIndex((i) => i.id === fiberReward.id);
          if (existingIdx >= 0) {
            newInventory[existingIdx] = {
              ...newInventory[existingIdx],
              count: (newInventory[existingIdx].count ?? 0) + 1
            };
          } else {
            newInventory.push({ ...fiberReward, type: 'resource' });
          }

          const newTiles = {
            ...state.tiles,
            [key]: {
              ...currentTile,
              crop: null,
              uncultivatedSince: now,
              lastUpdated: now
            }
          };

          const updated = {
            tiles: newTiles,
            inventory: newInventory,
            energy: Math.max(0, state.energy - 1),
            updatedAt: now
          };

          set(updated);
          queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
          get().notify('Đã dọn dẹp bụi cây héo úa (+1 Sợi Cỏ Dại 🌾, -1 Năng lượng)!', 'success');
          return {
            success: true,
            destroyed: true,
            resourceName: fiberReward.name,
            resourceCount: 1,
            icon: fiberReward.icon
          };
        }

        // B. Apple Tree chopped with Axe at Stage 2 or 3 for 6 Wood
        if (currentTile.crop.id === 'apple') {
          if (tool !== 'axe') {
            const msg = 'Cần dùng Rìu (Phím 3) để đốn hạ Cây Táo!';
            get().notify(msg, 'warning');
            return { success: false, reason: 'Cần dùng Rìu!' };
          }

          const growth = getCropGrowthStage(currentTile.crop, currentTile.isWatered, now);
          if (growth.currentStage < 2) {
            const msg = 'Cây táo còn non (Giai đoạn 0-1), chưa đủ lớn để khai thác gỗ!';
            get().notify(msg, 'warning');
            return { success: false, reason: 'Cây táo còn non!' };
          }

          if (state.energy < 3) {
            get().notify('Kiệt sức! Cần 3 Năng lượng để chặt cây táo.', 'warning');
            return { success: false, reason: 'Không đủ năng lượng!' };
          }

          const woodReward = { id: 'resource_wood', name: 'Gỗ Tự Nhiên', icon: '🪵', count: 6, price: 4 };
          let newInventory = [...(state.inventory || [])];
          const existingIdx = newInventory.findIndex((i) => i.id === woodReward.id);
          if (existingIdx >= 0) {
            newInventory[existingIdx] = {
              ...newInventory[existingIdx],
              count: (newInventory[existingIdx].count ?? 0) + 6
            };
          } else {
            newInventory.push({ ...woodReward, type: 'resource' });
          }

          const newTiles = {
            ...state.tiles,
            [key]: {
              ...currentTile,
              crop: null,
              isTilled: true,
              uncultivatedSince: now,
              lastUpdated: now
            }
          };

          const updated = {
            tiles: newTiles,
            inventory: newInventory,
            energy: Math.max(0, state.energy - 3),
            updatedAt: now
          };

          set(updated);
          queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
          get().notify('Đã đốn hạ Cây Táo (+6 Gỗ Tự Nhiên 🪵, -3 Năng lượng)!', 'success');
          return {
            success: true,
            destroyed: true,
            resourceName: woodReward.name,
            resourceCount: 6,
            icon: woodReward.icon
          };
        }
      }

      if (!currentTile?.obstacle) {
        return { success: false, reason: 'Không có chướng ngại vật ở ô này!' };
      }

      const obstacle = currentTile.obstacle;

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

    // 5. Crafting Engine: Craft Tools & Placeables
    craftItem: (recipeId: string) => {
      const state = get();
      const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
      if (!recipe) {
        get().notify('Công thức chế tạo không tồn tại!', 'error');
        return { success: false, reason: 'Công thức không hợp lệ' };
      }

      // Check ingredient availability
      for (const ing of recipe.ingredients) {
        const invCount = state.inventory.find((i) => i.id === ing.id)?.count ?? 0;
        const hotbarCount = state.hotbar.find((i) => i.id === ing.id)?.count ?? 0;
        const totalAvail = invCount + hotbarCount;
        if (totalAvail < ing.count) {
          const msg = `Không đủ ${ing.name}! Cần ${ing.count} nhưng chỉ có ${totalAvail}.`;
          get().notify(msg, 'warning');
          return { success: false, reason: msg };
        }
      }

      // Deduct ingredients
      let newInventory = [...state.inventory];
      let newHotbar = [...state.hotbar];

      for (const ing of recipe.ingredients) {
        let needed = ing.count;

        // Deduct from inventory first
        newInventory = newInventory
          .map((item) => {
            if (item.id === ing.id && needed > 0) {
              const take = Math.min(item.count ?? 0, needed);
              needed -= take;
              return { ...item, count: (item.count ?? 0) - take };
            }
            return item;
          })
          .filter((item) => (item.count ?? 0) > 0 || item.type === 'tool');

        // Deduct from hotbar if needed
        if (needed > 0) {
          newHotbar = newHotbar
            .map((item) => {
              if (item.id === ing.id && needed > 0) {
                const take = Math.min(item.count ?? 0, needed);
                needed -= take;
                return { ...item, count: (item.count ?? 0) - take };
              }
              return item;
            })
            .filter((item) => (item.count ?? 0) > 0 || item.type === 'tool');
        }
      }

      // Add produced item directly to hotbar or inventory
      const outputId = recipe.outputItemId;
      const outputCount = recipe.outputCount;
      const isPlaceable = outputId === 'item_fence' || outputId === 'item_chest';
      const itemType = isPlaceable ? 'placeable' : 'consumable';

      const existingHotbarIdx = newHotbar.findIndex((i) => i.id === outputId);
      if (existingHotbarIdx >= 0) {
        newHotbar[existingHotbarIdx] = {
          ...newHotbar[existingHotbarIdx],
          count: (newHotbar[existingHotbarIdx].count ?? 0) + outputCount
        };
      } else if (newHotbar.length < 10) {
        newHotbar.push({
          id: outputId,
          name: recipe.outputName,
          icon: recipe.icon,
          type: itemType,
          count: outputCount
        });
      } else {
        const existingInvIdx = newInventory.findIndex((i) => i.id === outputId);
        if (existingInvIdx >= 0) {
          newInventory[existingInvIdx] = {
            ...newInventory[existingInvIdx],
            count: (newInventory[existingInvIdx].count ?? 0) + outputCount
          };
        } else {
          newInventory.push({
            id: outputId,
            name: recipe.outputName,
            icon: recipe.icon,
            type: itemType,
            count: outputCount
          });
        }
      }

      const updated = {
        hotbar: newHotbar,
        inventory: newInventory,
        updatedAt: Date.now()
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Chế tạo thành công ${recipe.outputCount}x ${recipe.outputName}!`, 'success');
      return { success: true };
    },

    // 6. Place Entities (Fence & Chest)
    placeEntity: (x: number, y: number, placeableType: PlaceableType) => {
      if ((x === 15 && y === 3) || (x === 18 && y === 3)) {
        get().notify('Không thể đặt vật phẩm đè lên Công Trình Đặc Biệt!', 'warning');
        return { success: false, reason: 'Khu Công Trình!' };
      }
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (currentTile?.placeable) {
        const msg = 'Ô này đã có công trình kiến trúc đặt sẵn!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }
      if (currentTile?.obstacle) {
        const msg = 'Không thể đặt lên ô đang có chướng ngại vật!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }
      if (currentTile?.crop) {
        const msg = 'Không thể đặt đè lên cây trồng đang phát triển!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }
      if (currentTile?.isTilled) {
        const msg = 'Chỉ có thể đặt trên bãi cỏ hoặc đất trống chưa cuốc!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }
      if (state.energy < 1) {
        const msg = 'Kiệt sức! Cần 1 Năng lượng để lắp đặt.';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const itemId = `item_${placeableType}`;
      const hotbarItem = state.hotbar.find((i) => i.id === itemId && (i.count ?? 0) > 0);
      const invItem = state.inventory.find((i) => i.id === itemId && (i.count ?? 0) > 0);

      if (!hotbarItem && !invItem) {
        const msg = `Không còn ${placeableType === 'fence' ? 'Hàng Rào' : 'Rương'} trong túi đồ!`;
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      let newHotbar = [...state.hotbar];
      let newInventory = [...state.inventory];

      if (hotbarItem) {
        newHotbar = newHotbar
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 1) - 1 };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0 || i.type === 'tool');
      } else if (invItem) {
        newInventory = newInventory
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 1) - 1 };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0);
      }

      const now = Date.now();
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...(currentTile || {}),
          isTilled: false,
          isWatered: false,
          crop: null,
          obstacle: null,
          placeable: {
            type: placeableType,
            placedAt: now,
            chestData: placeableType === 'chest' ? { items: [] } : undefined
          },
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        inventory: newInventory,
        energy: Math.max(0, state.energy - 1),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã đặt ${placeableType === 'fence' ? 'Hàng Rào Gỗ' : 'Rương Gỗ'} (-1 Năng lượng)!`, 'success');
      return { success: true };
    },

    // 7. Dismantle Entities (Pickaxe on Fence or Empty Chest)
    dismantleEntity: (x: number, y: number) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.placeable) {
        get().notify('Không có công trình nào ở ô này để tháo dỡ!', 'info');
        return { success: false, reason: 'Không có công trình' };
      }

      const placeable = currentTile.placeable;

      // Chest validation: must be completely empty before dismantling
      if (placeable.type === 'chest') {
        const items = placeable.chestData?.items || [];
        const hasItems = items.some((i) => (i.count ?? 0) > 0);
        if (hasItems) {
          const msg = 'Rương vẫn còn đồ bên trong! Hãy dọn sạch rương trước khi tháo dỡ.';
          get().notify(msg, 'warning');
          return { success: false, reason: msg };
        }
      }

      if (state.energy < 2) {
        const msg = 'Kiệt sức! Cần 2 Năng lượng để tháo dỡ công trình.';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const outputId = `item_${placeable.type}`;
      const itemName = placeable.type === 'fence' ? 'Hàng Rào Gỗ' : 'Rương Gỗ';
      const itemIcon = placeable.type === 'fence' ? '🪵' : '📦';

      let newHotbar = [...state.hotbar];
      let newInventory = [...state.inventory];

      const hotbarIdx = newHotbar.findIndex((i) => i.id === outputId);
      if (hotbarIdx >= 0) {
        newHotbar[hotbarIdx] = {
          ...newHotbar[hotbarIdx],
          count: (newHotbar[hotbarIdx].count ?? 0) + 1
        };
      } else if (newHotbar.length < 10) {
        newHotbar.push({
          id: outputId,
          name: itemName,
          icon: itemIcon,
          type: 'placeable',
          count: 1
        });
      } else {
        const invIdx = newInventory.findIndex((i) => i.id === outputId);
        if (invIdx >= 0) {
          newInventory[invIdx] = {
            ...newInventory[invIdx],
            count: (newInventory[invIdx].count ?? 0) + 1
          };
        } else {
          newInventory.push({
            id: outputId,
            name: itemName,
            icon: itemIcon,
            type: 'placeable',
            count: 1
          });
        }
      }

      const now = Date.now();
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          placeable: null,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        inventory: newInventory,
        energy: Math.max(0, state.energy - 2),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã tháo dỡ và thu hồi 1x ${itemName} (-2 Năng lượng)!`, 'success');
      return { success: true };
    },

    // 8. Fertilize Tile (Reduce growth time by 50%)
    fertilizeTile: (x: number, y: number) => {
      const key = `${x},${y}`;
      const state = get();
      const currentTile = state.tiles[key];

      if (!currentTile?.isTilled && !currentTile?.crop) {
        const msg = 'Chỉ có thể bón phân lên đất đã cuốc hoặc cây trồng!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }
      if (currentTile.isFertilized) {
        const msg = 'Ô đất này đã được bón phân trước đó rồi!';
        get().notify(msg, 'info');
        return { success: false, reason: msg };
      }
      if (state.energy < 1) {
        const msg = 'Kiệt sức! Cần 1 Năng lượng để bón phân.';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      const itemId = 'item_fertilizer';
      const hotbarItem = state.hotbar.find((i) => i.id === itemId && (i.count ?? 0) > 0);
      const invItem = state.inventory.find((i) => i.id === itemId && (i.count ?? 0) > 0);

      if (!hotbarItem && !invItem) {
        const msg = 'Đã hết Phân Bón Sinh Học trong túi đồ!';
        get().notify(msg, 'warning');
        return { success: false, reason: msg };
      }

      let newHotbar = [...state.hotbar];
      let newInventory = [...state.inventory];

      if (hotbarItem) {
        newHotbar = newHotbar
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 1) - 1 };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0 || i.type === 'tool');
      } else if (invItem) {
        newInventory = newInventory
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 1) - 1 };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0);
      }

      const now = Date.now();
      let updatedCrop = currentTile.crop;
      if (updatedCrop) {
        updatedCrop = {
          ...updatedCrop,
          totalGrowthSeconds: Math.max(10, Math.round(updatedCrop.totalGrowthSeconds * 0.5))
        };
      }

      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [key]: {
          ...currentTile,
          isFertilized: true,
          crop: updatedCrop,
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        hotbar: newHotbar,
        inventory: newInventory,
        energy: Math.max(0, state.energy - 1),
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify('Đã bón phân sinh học! (Giảm 50% thời gian lớn của cây)', 'success');
      return { success: true };
    },

    // 9. Deposit item to Chest
    depositToChest: (chestKey: string, itemId: string, count = 1) => {
      const state = get();
      const tile = state.tiles[chestKey];
      if (!tile || tile.placeable?.type !== 'chest') {
        return { success: false, reason: 'Không tìm thấy rương đồ!' };
      }

      const invItem = state.inventory.find((i) => i.id === itemId && (i.count ?? 0) >= count);
      const hotbarItem = state.hotbar.find((i) => i.id === itemId && (i.count ?? 0) >= count);
      const sourceItem = invItem || hotbarItem;

      if (!sourceItem) {
        get().notify('Không đủ số lượng vật phẩm trong kho!', 'warning');
        return { success: false, reason: 'Không đủ số lượng' };
      }

      const chestItems = [...(tile.placeable.chestData?.items || [])];
      const existingChestIdx = chestItems.findIndex((i) => i.id === itemId);

      if (existingChestIdx >= 0) {
        chestItems[existingChestIdx] = {
          ...chestItems[existingChestIdx],
          count: (chestItems[existingChestIdx].count ?? 0) + count
        };
      } else {
        if (chestItems.length >= 8) {
          get().notify('Rương đã đầy (tối đa 8 ngăn)!', 'warning');
          return { success: false, reason: 'Rương đầy' };
        }
        chestItems.push({
          ...sourceItem,
          count
        });
      }

      let newInventory = [...state.inventory];
      let newHotbar = [...state.hotbar];

      if (invItem) {
        newInventory = newInventory
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 0) - count };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0);
      } else if (hotbarItem) {
        newHotbar = newHotbar
          .map((i) => {
            if (i.id === itemId) return { ...i, count: (i.count ?? 0) - count };
            return i;
          })
          .filter((i) => (i.count ?? 0) > 0 || i.type === 'tool');
      }

      const now = Date.now();
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [chestKey]: {
          ...tile,
          placeable: {
            ...tile.placeable,
            chestData: { items: chestItems }
          },
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        inventory: newInventory,
        hotbar: newHotbar,
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã cất ${count}x ${sourceItem.name} vào rương!`, 'success');
      return { success: true };
    },

    // 10. Withdraw item from Chest
    withdrawFromChest: (chestKey: string, itemId: string, count = 1) => {
      const state = get();
      const tile = state.tiles[chestKey];
      if (!tile || tile.placeable?.type !== 'chest') {
        return { success: false, reason: 'Không tìm thấy rương đồ!' };
      }

      const chestItems = [...(tile.placeable.chestData?.items || [])];
      const chestIdx = chestItems.findIndex((i) => i.id === itemId);
      if (chestIdx < 0 || (chestItems[chestIdx].count ?? 0) < count) {
        get().notify('Không đủ vật phẩm trong rương!', 'warning');
        return { success: false, reason: 'Không đủ vật phẩm trong rương' };
      }

      const targetItem = chestItems[chestIdx];
      const remainingCount = (targetItem.count ?? 0) - count;

      if (remainingCount <= 0) {
        chestItems.splice(chestIdx, 1);
      } else {
        chestItems[chestIdx] = { ...targetItem, count: remainingCount };
      }

      let newInventory = [...state.inventory];
      const invIdx = newInventory.findIndex((i) => i.id === itemId);
      if (invIdx >= 0) {
        newInventory[invIdx] = {
          ...newInventory[invIdx],
          count: (newInventory[invIdx].count ?? 0) + count
        };
      } else {
        newInventory.push({
          ...targetItem,
          count
        });
      }

      const now = Date.now();
      const newTiles: Record<string, TileData> = {
        ...state.tiles,
        [chestKey]: {
          ...tile,
          placeable: {
            ...tile.placeable,
            chestData: { items: chestItems }
          },
          lastUpdated: now
        }
      };

      const updated = {
        tiles: newTiles,
        inventory: newInventory,
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify(`Đã lấy ${count}x ${targetItem.name} ra túi đồ!`, 'success');
      return { success: true };
    },

    completeQuizReward: (energyReward: number, xpReward: number) => {
      const state = get();
      const currentXp = state.xp ?? 0;
      const newXp = currentXp + xpReward;
      const currentLevel = state.level ?? 1;
      const newLevel = Math.floor(newXp / 100) + 1;
      const didLevelUp = newLevel > currentLevel;

      const newEnergy = didLevelUp ? state.maxEnergy : Math.min(state.maxEnergy, state.energy + energyReward);
      const now = Date.now();

      const updated = {
        energy: newEnergy,
        xp: newXp,
        level: newLevel,
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });

      if (didLevelUp) {
        get().notify(`🎉 THĂNG CẤP! Nông trại đạt Cấp ${newLevel}! Hồi phục 100% Thể Lực (${state.maxEnergy})!`, 'success');
      } else {
        get().notify(`✨ Tuyệt vời! +${energyReward} Thể Lực, +${xpReward} XP!`, 'success');
      }
    },

    recordQuizResult: (quizId: string, isCorrect: boolean, energyReward: number, xpReward: number) => {
      const state = get();
      if (!isCorrect) {
        return { isLevelUp: false, newLevel: state.level ?? 1, earnedEnergy: 0, earnedXp: 0 };
      }

      const currentMastered = state.masteredQuizIds || [];
      const newMastered = currentMastered.includes(quizId) ? currentMastered : [...currentMastered, quizId];

      const currentXp = state.xp ?? 0;
      const newXp = currentXp + xpReward;
      const currentLevel = state.level ?? 1;
      const newLevel = Math.floor(newXp / 100) + 1;
      const didLevelUp = newLevel > currentLevel;
      const newEnergy = didLevelUp ? state.maxEnergy : Math.min(state.maxEnergy, state.energy + energyReward);
      const now = Date.now();

      const updated = {
        masteredQuizIds: newMastered,
        energy: newEnergy,
        xp: newXp,
        level: newLevel,
        updatedAt: now
      };

      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });

      if (didLevelUp) {
        get().notify(`🎉 THĂNG CẤP! Nông trại đạt Cấp ${newLevel}! Hồi phục 100% Thể Lực (${state.maxEnergy})!`, 'success');
      }

      return {
        isLevelUp: didLevelUp,
        newLevel,
        earnedEnergy: energyReward,
        earnedXp: xpReward
      };
    },

    resetMasteredQuizzes: () => {
      const state = get();
      const updated = {
        masteredQuizIds: [],
        updatedAt: Date.now()
      };
      set(updated);
      queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
      get().notify('Đã làm mới danh sách từ vựng! Bạn có thể ôn luyện lại từ đầu.', 'info');
    },

    orderBBQMeal: (food) => {
      const state = get();
      let hasIngredients = true;

      if (food.requiredIngredients && food.requiredIngredients.length > 0) {
        for (const req of food.requiredIngredients) {
          const inHotbar = state.hotbar.find((i) => i.id === req.id)?.count ?? 0;
          const inInv = state.inventory.find((i) => i.id === req.id)?.count ?? 0;
          if (inHotbar + inInv < req.count) {
            hasIngredients = false;
            break;
          }
        }
      }

      if (food.requiredIngredients && food.requiredIngredients.length > 0 && hasIngredients) {
        let newHotbar = [...state.hotbar];
        let newInventory = [...state.inventory];

        for (const req of food.requiredIngredients) {
          let needed = req.count;
          newHotbar = newHotbar.map((item) => {
            if (item.id === req.id && needed > 0) {
              const deduct = Math.min(item.count ?? 0, needed);
              needed -= deduct;
              return { ...item, count: (item.count ?? 0) - deduct };
            }
            return item;
          }).filter((i) => (i.count ?? 0) > 0 || i.type === 'tool');

          if (needed > 0) {
            newInventory = newInventory.map((item) => {
              if (item.id === req.id && needed > 0) {
                const deduct = Math.min(item.count ?? 0, needed);
                needed -= deduct;
                return { ...item, count: (item.count ?? 0) - deduct };
              }
              return item;
            }).filter((i) => (i.count ?? 0) > 0);
          }
        }

        const updated = { hotbar: newHotbar, inventory: newInventory, updatedAt: Date.now() };
        set(updated);
        queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
        return { success: true };
      }

      const cost = food.costGold ?? 0;
      if (cost > 0) {
        if (state.gold < cost) {
          const msg = `Không đủ ${cost} Gold hoặc nguyên liệu cho món ${food.name}!`;
          get().notify(msg, 'warning');
          return { success: false, reason: msg };
        }
        const updated = { gold: state.gold - cost, updatedAt: Date.now() };
        set(updated);
        queueFarmStateSync(state.currentUserId, { ...get(), ...updated });
        return { success: true };
      }

      return { success: true };
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

        const mergedTiles = cloudState.tiles ? { ...prev.tiles, ...cloudState.tiles } : prev.tiles;
        const now = Date.now();
        const lastSim = cloudState.lastSimulatedAt || cloudState.updatedAt || prev.lastSimulatedAt || prev.updatedAt || now;
        const simRes = calculateOfflineSimulation(mergedTiles, lastSim, now);

        if (simRes.notice) {
          setTimeout(() => {
            get().notify(simRes.notice!, 'info');
          }, 1200);
        }

        return {
          ...prev,
          ...cloudState,
          activeSeedId: cloudState.activeSeedId ?? prev.activeSeedId ?? 'seed_wheat',
          masteredQuizIds: cloudState.masteredQuizIds ?? prev.masteredQuizIds ?? [],
          tiles: simRes.tiles,
          lastSimulatedAt: now,
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
