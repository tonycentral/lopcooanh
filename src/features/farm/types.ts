// src/features/farm/types.ts
// Strict TypeScript interfaces for the 2D Farm Engine & State

export type ToolType = 'hoe' | 'water_can' | 'axe' | 'pickaxe' | 'scythe' | 'hand' | 'seed' | 'item_fence' | 'item_chest' | 'item_fertilizer';

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

export interface ObstacleData {
  type: ObstacleType;
  hp: number;
  maxHp: number;
}

export interface CropData {
  id: string;                  // e.g. 'wheat', 'herb'
  plantedAt: number;           // Unix timestamp in ms
  totalGrowthSeconds: number;  // Duration to full maturity in seconds
  totalStages: number;         // Number of visual stages (e.g. 4)
  growthSecondsAcc?: number;   // Accumulated growth seconds while watered
  wateredAt?: number | null;   // Timestamp when current watering started (null if soil is dry)
}

export interface TileData {
  isTilled: boolean;
  isWatered: boolean;
  crop: CropData | null;
  obstacle?: ObstacleData | null;
  placeable?: PlaceableData | null;
  isFertilized?: boolean;
  lastUpdated?: number;
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

export interface PlayerFarmState {
  gold: number;
  energy: number;
  maxEnergy: number;
  day: number;
  activeTool: string;
  hotbar: InventoryItem[];
  inventory: InventoryItem[];
  tiles: Record<string, TileData>; // Sparse Map: 'x,y' -> TileData
  updatedAt: number;
}

export type SyncStatus = 'idle' | 'pending' | 'saving' | 'synced' | 'error' | 'offline';
