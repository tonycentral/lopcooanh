// src/features/farm/types.ts
// Strict TypeScript interfaces for the 2D Farm Engine & State

export type ToolType = 'none' | 'hoe' | 'water_can' | 'axe' | 'pickaxe' | 'scythe' | 'hand' | 'seed' | 'item_fence' | 'item_chest' | 'item_fertilizer' | 'resource_stone';

export type AnimalType = 'wild_boar' | 'companion_dog';

export interface AnimalEntityData {
  type: AnimalType;
  x: number;
  y: number;
  state: 'idle' | 'follow' | 'wander' | 'sit' | 'fetch' | 'return_stone' | 'running_to_crop' | 'eating' | 'fleeing';
}

export type ObstacleType = 'rock' | 'wood' | 'weed';

export type PlaceableType = 'fence' | 'chest';

export interface ChestData {
  items: InventoryItem[]; // Up to 8 slots
}

export interface PlaceableData {
  type: PlaceableType;
  placedAt: number;
  chestData?: ChestData;
}

export interface CraftingIngredient {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  icon: string;
  outputItemId: string;
  outputName: string;
  outputCount: number;
  desc: string;
  ingredients: CraftingIngredient[];
}

export type StationType = 'campfire' | 'bbq_stand';

export interface StationData {
  type: StationType;
  isDestructible: false;
}

export interface ObstacleData {
  type: ObstacleType;
  hp: number;
  maxHp: number;
  isDestructible?: boolean;
}

export interface CropData {
  id: string;                  // e.g. 'wheat', 'herb', 'apple'
  plantedAt: number;           // Unix timestamp in ms
  totalGrowthSeconds: number;  // Duration to full maturity in seconds
  totalStages: number;         // Number of visual stages (e.g. 4)
  growthSecondsAcc?: number;   // Accumulated growth seconds while watered
  wateredAt?: number | null;   // Timestamp when current watering started (null if soil is dry)
  isWithered?: boolean;        // Whether crop has decayed due to over-ripening
  ripeAt?: number | null;      // Timestamp when crop became fully ripe (Stage 3)
}

export interface TileData {
  isTilled: boolean;
  isWatered: boolean;
  crop: CropData | null;
  obstacle?: ObstacleData | null;
  placeable?: PlaceableData | null;
  station?: StationData | null;
  isFertilized?: boolean;
  lastUpdated?: number;
  uncultivatedSince?: number | null; // Timestamp when tile became empty tilled & dry (for 3h reversion)
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  type: 'tool' | 'seed' | 'crop' | 'resource' | 'placeable' | 'consumable';
  count?: number;
  cropId?: string;
  price?: number;
}

export interface CropDefinition {
  id: string;
  name: string;
  seedId: string;
  growthSeconds: number;
  stages: number;
  goldValue: number;
  vocabReward: string;
}

export interface CropGrowthCalculation {
  currentStage: number;
  isRipe: boolean;
  percent: number;
  elapsedSec: number;
  remainingSec: number;
}

export interface NotificationMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}

export * from './types/vocab';
export * from './types/reading';

export interface PlayerFarmState {
  gold: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  level: number;
  masteredQuizIds: string[];
  day: number;
  activeTool: string;
  activeSeedId?: string;
  lastSimulatedAt?: number;
  hotbar: InventoryItem[];
  inventory: InventoryItem[];
  tiles: Record<string, TileData>; // Sparse Map: 'x,y' -> TileData
  updatedAt: number;
}

export type SyncStatus = 'idle' | 'pending' | 'saving' | 'synced' | 'error' | 'offline';
