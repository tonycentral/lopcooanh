// src/features/farm/types.ts
// Strict TypeScript interfaces for the 2D Farm Engine & State

export type ToolType = 'none' | 'hoe' | 'water_can' | 'axe' | 'pickaxe' | 'scythe' | 'hand' | 'seed' | 'item_fence' | 'item_chest' | 'item_fertilizer' | 'resource_stone' | 'furniture_table' | 'furniture_chair' | 'furniture_bookshelf' | 'furniture_rug' | 'furniture_fireplace';

export interface PlacedFurnitureItem {
  id: string;
  itemId: string;
  gridX: number;
  gridY: number;
  rotation?: number;
}

export type BuildingType = 'house' | 'coop' | 'barn';

export interface FarmBuilding {
  id: string;
  type: BuildingType;
  gridX: number;
  gridY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
  createdAt?: number;
}

export type MovableEntityType = 'station_campfire' | 'station_bbq' | 'crop' | 'placeable' | 'building_coop' | 'building_barn';

export interface MovableEntityData {
  type: MovableEntityType;
  id?: string;
  name: string;
  originalGridX: number;
  originalGridY: number;
  width: number;
  height: number;
  textureKey: string;
  cropData?: CropData;
  placeableData?: PlaceableData;
  buildingData?: FarmBuilding;
}

export type LivestockType = 'chicken' | 'cow';

export interface FarmAnimal {
  id: string;
  type: LivestockType;
  name: string;
  buildingId: string;
  x: number;
  y: number;
  currentHappiness: number;
  lastProducedAt: number;
  friendship?: number; // 0 - 100 for compatibility
  hasProductReady?: boolean;
}

export type LivestockData = FarmAnimal;

export interface EggEntityData {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

export type AnimalType = 'wild_boar' | 'companion_dog' | 'chicken' | 'cow';

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
  hasHouse?: boolean;
  houseOrigin?: { x: number; y: number } | null;
  sanctuaryPosition?: { x: number; y: number };
  bbqPosition?: { x: number; y: number };
  buildings?: FarmBuilding[];
  livestock?: LivestockData[];
  animals?: FarmAnimal[];
  droppedEggs?: EggEntityData[];
  indoorPlacedItems?: PlacedFurnitureItem[];
  hotbar: InventoryItem[];
  inventory: InventoryItem[];
  tiles: Record<string, TileData>; // Sparse Map: 'x,y' -> TileData
  updatedAt: number;
}

export type SyncStatus = 'idle' | 'pending' | 'saving' | 'synced' | 'error' | 'offline';
