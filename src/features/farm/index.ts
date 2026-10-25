// src/features/farm/index.ts
// Clean public API for the Farm Feature

export * from './types';
export { useGameStore, getCropGrowthStage, CROP_DEFINITIONS } from './state/useGameStore';
export { default as GameContainer } from './components/GameContainer';
export { flushPendingFarmSync, loadInitialFarmState } from './services/supabaseSync';
