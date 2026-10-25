// src/features/farm/index.ts
// Clean public API for the Farm Feature

export * from './types';
export { useGameStore, getCropGrowthStage, CROP_DEFINITIONS, SHOP_SEEDS, SHOP_CROPS } from './state/useGameStore';
export { default as GameContainer } from './components/GameContainer';
export { default as ShopModal } from './components/ShopModal';
export { flushPendingFarmSync, loadInitialFarmState } from './services/supabaseSync';
