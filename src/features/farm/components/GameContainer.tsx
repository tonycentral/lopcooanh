// src/features/farm/components/GameContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../engine/config';
import { useGameStore } from '../state/useGameStore';
import { flushPendingFarmSync, initVisibilitySyncListener } from '../services/supabaseSync';
import ShopModal from './ShopModal';
import ChestModal from './ChestModal';
import VocabQuizModal from './VocabQuizModal';
import BBQStandModal from './BBQStandModal';
import FurnitureCraftModal from './FurnitureCraftModal';
import { 
  Coins, 
  Zap, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  User,
  LogOut,
  LogIn,
  ShoppingBag,
  Hammer,
  Move,
  Sparkles,
  ChevronUp,
  Footprints,
  Sprout,
  ShoppingBasket,
  PawPrint,
  Search
} from 'lucide-react';

const TOOL_METADATA: Record<string, { title: string; desc: string; shortcut: string }> = {
  hoe: { title: 'Cuốc Đất', desc: 'Tạo luống canh tác trên ô đất', shortcut: '1' },
  water_can: { title: 'Bình Tưới Nước', desc: 'Tưới ẩm ô đất để cây hoa màu lớn', shortcut: '2' },
  seed: { title: 'Gieo Hạt Giống', desc: 'Chọn hạt lúa mì, thảo mộc, táo để gieo', shortcut: '3' },
  hand: { title: 'Thu Hoạch / Chăm Sóc', desc: 'Hái hoa màu, hái táo, nhặt trứng, vắt sữa, vuốt ve', shortcut: '4' },
  axe: { title: 'Rìu Chặt Cây', desc: 'Đốn gỗ mục & chặt cây táo lấy gỗ tự nhiên', shortcut: '5' },
  pickaxe: { title: 'Cuốc Chim', desc: 'Đập tảng đá để khai thác đá cuội', shortcut: '6' },
  scythe: { title: 'Liềm Cắt Cỏ Dại', desc: 'Dọn cỏ dại & thu hoạch sợi cỏ khô (-1 Energy)', shortcut: '7' },
  actions: { title: 'Menu Chức Năng Khác', desc: 'Chơi ném đá với chó, di dời đồ, kiểm tra ô đất', shortcut: '8' }
};

interface GameContainerProps {
  currentUser?: { id: string; email?: string } | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export default function GameContainer({ currentUser, onOpenAuthModal, onSignOut }: GameContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const gold = useGameStore((state) => state.gold);
  const energy = useGameStore((state) => state.energy);
  const maxEnergy = useGameStore((state) => state.maxEnergy);
  const xp = useGameStore((state) => state.xp ?? 0);
  const level = useGameStore((state) => state.level ?? 1);
  const hotbar = useGameStore((state) => state.hotbar);
  const inventory = useGameStore((state) => state.inventory);
  const activeTool = useGameStore((state) => state.activeTool);
  const activeSeedId = useGameStore((state) => state.activeSeedId ?? 'seed_wheat');
  const syncStatus = useGameStore((state) => state.syncStatus);
  const lastNotification = useGameStore((state) => state.lastNotification);
  const selectTool = useGameStore((state) => state.selectTool);
  const selectSeed = useGameStore((state) => state.selectSeed);
  const toggleMoveOnlyMode = useGameStore((state) => state.toggleMoveOnlyMode);
  const isRepositionMode = useGameStore((state) => state.isRepositionMode);
  const movingEntity = useGameStore((state) => state.movingEntity);
  const toggleRepositionMode = useGameStore((state) => state.toggleRepositionMode);
  const cancelRelocation = useGameStore((state) => state.cancelRelocation);
  const runOfflineSimulation = useGameStore((state) => state.runOfflineSimulation);
  const initSync = useGameStore((state) => state.initSync);
  const clearNotification = useGameStore((state) => state.clearNotification);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopTab, setShopTab] = useState<'buy' | 'sell' | 'craft'>('buy');
  const [currentChestKey, setCurrentChestKey] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBBQOpen, setIsBBQOpen] = useState(false);
  const [isFurnitureCraftOpen, setIsFurnitureCraftOpen] = useState(false);
  const [isSeedMenuOpen, setIsSeedMenuOpen] = useState(false);
  const seedMenuRef = useRef<HTMLDivElement>(null);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss notification after 3.5 seconds
  useEffect(() => {
    if (!lastNotification) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, 3500);
    return () => clearTimeout(timer);
  }, [lastNotification, clearNotification]);

  // Periodic Natural Offline Simulation (Every 60 seconds & on mount)
  useEffect(() => {
    runOfflineSimulation();
    const timer = setInterval(() => {
      runOfflineSimulation();
    }, 60000);
    return () => clearInterval(timer);
  }, [runOfflineSimulation]);

  // Close seed popover when clicking outside
  useEffect(() => {
    if (!isSeedMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (seedMenuRef.current && !seedMenuRef.current.contains(e.target as Node)) {
        setIsSeedMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSeedMenuOpen]);

  // Close actions menu popover when clicking outside
  useEffect(() => {
    if (!isActionsMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isActionsMenuOpen]);

  // Energy auto-regeneration over time: +1 energy every 4 seconds if below maxEnergy
  useEffect(() => {
    const timer = setInterval(() => {
      const s = useGameStore.getState();
      if (s.energy < s.maxEnergy) {
        useGameStore.setState({ energy: Math.min(s.maxEnergy, s.energy + 1) });
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Initialize Cloud Sync on startup
  useEffect(() => {
    initSync(currentUser?.id || null);
    const cleanupVisibility = initVisibilitySyncListener();
    return () => {
      cleanupVisibility();
      flushPendingFarmSync();
    };
  }, [currentUser?.id, initSync]);

  // Keyboard shortcut listener for Hotbar slots 1-9, Shop modal (B), and Crafting tab (C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shop
      if (e.key === 'b' || e.key === 'B') {
        setShopTab('buy');
        setIsShopOpen((prev) => !prev);
        return;
      }

      // Open craft tab directly
      if (e.key === 'c' || e.key === 'C') {
        if (!isShopOpen) {
          setShopTab('craft');
          setIsShopOpen(true);
        } else if (shopTab === 'craft') {
          setIsShopOpen(false);
        } else {
          setShopTab('craft');
        }
        return;
      }

      // Key M: Toggle Reposition / Layout Mode
      if (e.key === 'm' || e.key === 'M') {
        toggleRepositionMode();
        return;
      }

      // Key ESC: Cancel moving entity or exit reposition mode
      if (e.key === 'Escape' && isRepositionMode) {
        if (movingEntity) {
          cancelRelocation();
        } else {
          toggleRepositionMode(false);
        }
        return;
      }

      // If modal is active, ignore hotbar tool changes
      if (isShopOpen || Boolean(currentChestKey) || isProfileOpen || isQuizOpen || isBBQOpen || isFurnitureCraftOpen) return;

      // Key 0: Toggle Move-Only / Observation Mode
      if (e.key === '0') {
        toggleMoveOnlyMode();
        setIsSeedMenuOpen(false);
        setIsActionsMenuOpen(false);
        return;
      }

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= hotbar.length) {
        const targetTool = hotbar[keyNum - 1].id;
        if (targetTool === 'seed') {
          const currentSeed = activeSeedId || 'seed_wheat';
          selectSeed(currentSeed);
          setIsSeedMenuOpen((prev) => !prev);
          setIsActionsMenuOpen(false);
        } else if (targetTool === 'actions') {
          setIsActionsMenuOpen((prev) => !prev);
          setIsSeedMenuOpen(false);
        } else if (activeTool === targetTool) {
          // Toggle unselect active slot -> move-only mode
          toggleMoveOnlyMode();
          setIsSeedMenuOpen(false);
          setIsActionsMenuOpen(false);
        } else {
          selectTool(targetTool);
          setIsSeedMenuOpen(false);
          setIsActionsMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, activeTool, activeSeedId, selectTool, selectSeed, toggleMoveOnlyMode, isRepositionMode, movingEntity, toggleRepositionMode, cancelRelocation, isShopOpen, shopTab, currentChestKey, isProfileOpen, isQuizOpen, isBBQOpen, isFurnitureCraftOpen, isActionsMenuOpen]);

  // Synchronize modal state with Phaser input context (disable WASD/mouse raycast when modal is open)
  useEffect(() => {
    if (!gameRef.current) return;
    const isModalActive = isShopOpen || Boolean(currentChestKey) || isProfileOpen || isQuizOpen || isBBQOpen || isFurnitureCraftOpen;
    try {
      const farmScene = gameRef.current.scene.getScene('FarmScene') as { setModalOpen?: (open: boolean) => void } | null;
      if (farmScene && typeof farmScene.setModalOpen === 'function') {
        farmScene.setModalOpen(isModalActive);
      }
      const houseScene = gameRef.current.scene.getScene('HouseScene') as { setModalOpen?: (open: boolean) => void } | null;
      if (houseScene && typeof houseScene.setModalOpen === 'function') {
        houseScene.setModalOpen(isModalActive);
      }
    } catch {
      // Scene might not be initialized yet
    }
  }, [isShopOpen, currentChestKey, isProfileOpen, isQuizOpen, isBBQOpen, isFurnitureCraftOpen]);

  // Phaser Game instance lifecycle management (React 19 strict-mode safe)
  useEffect(() => {
    if (!containerRef.current) return;

    const config = createGameConfig(containerRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Listen to chest interaction events emitted from FarmScene
    const handleOpenChest = (chestKey: string) => {
      setCurrentChestKey(chestKey);
    };
    game.events.on('open-chest', handleOpenChest);

    // Listen to vocab quiz interaction events emitted from FarmScene (Campfire)
    const handleOpenQuiz = () => {
      setIsQuizOpen(true);
    };
    game.events.on('open-vocab-quiz', handleOpenQuiz);

    // Listen to BBQ stand interaction events emitted from FarmScene
    const handleOpenBBQ = () => {
      setIsBBQOpen(true);
    };
    game.events.on('open-bbq-stand', handleOpenBBQ);

    // Listen to Carpentry Workbench events emitted from HouseScene
    const handleOpenFurnitureCraft = () => {
      setIsFurnitureCraftOpen(true);
    };
    game.events.on('open-furniture-craft', handleOpenFurnitureCraft);

    return () => {
      game.events.off('open-chest', handleOpenChest);
      game.events.off('open-vocab-quiz', handleOpenQuiz);
      game.events.off('open-bbq-stand', handleOpenBBQ);
      game.events.off('open-furniture-craft', handleOpenFurnitureCraft);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleManualSync = () => {
    flushPendingFarmSync();
  };

  // Resources and crops summary
  const woodCount = inventory.find((i) => i.id === 'resource_wood')?.count ?? 0;
  const stoneCount = inventory.find((i) => i.id === 'resource_stone')?.count ?? 0;
  const fiberCount = inventory.find((i) => i.id === 'resource_fiber')?.count ?? 0;
  const cropItems = inventory.filter((i) => i.type === 'crop' && (i.count ?? 0) > 0);

  const SEED_OPTIONS = [
    { id: 'seed_wheat', name: 'Lúa Mì', icon: '🌱', cropId: 'wheat' },
    { id: 'seed_herb', name: 'Thảo Mộc', icon: '🌿', cropId: 'herb' },
    { id: 'seed_apple', name: 'Cây Táo', icon: '🍎🌱', cropId: 'apple' }
  ];

  const getSeedStock = (seedId: string) => {
    const inHotbar = hotbar.find((i) => i.id === seedId)?.count ?? 0;
    const inInv = inventory.find((i) => i.id === seedId)?.count ?? 0;
    return inHotbar + inInv;
  };

  const totalSeedStock = inventory
    .concat(hotbar)
    .filter((i) => i.type === 'seed' || i.id.startsWith('seed_'))
    .reduce((sum, i) => sum + (i.count ?? 0), 0);

  const stoneStock = inventory
    .concat(hotbar)
    .filter((i) => i.id === 'resource_stone')
    .reduce((sum, i) => sum + (i.count ?? 0), 0);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center relative p-2 sm:p-4 select-none font-sans">
      
      {/* =========================================================================
          UNIFIED GAME FRAME (ASPECT RATIO 3:2 / 960x640px BOUNDED)
          Ensures ZERO dead space and anchors all HUD tightly inside the viewport
          ========================================================================= */}
      <div className="relative w-full max-w-[960px] aspect-[3/2] max-h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center">
        
        {/* 1. Canvas Viewport for Phaser 3 */}
        <div ref={containerRef} className="w-full h-full" />

        {/* 2. REFACTORED TOP HUD: Streamlined Glassmorphism Stats & Icon Action Buttons */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
          
          {/* Top-Left: Glassmorphism Stats Bar */}
          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-700/60 shadow-xl">
            {/* Energy Meter with Tooltip */}
            <div className="group relative flex items-center gap-1.5 cursor-help">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <div className="w-14 sm:w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${Math.round((energy / maxEnergy) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-200 font-semibold">{energy}/{maxEnergy}</span>
              
              {/* Tooltip */}
              <div className="pointer-events-none absolute left-0 top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Năng lượng: {energy}/{maxEnergy} (Tự hồi phục)
                </div>
              </div>
            </div>

            {/* Gold Counter with Tooltip */}
            <div className="group relative flex items-center gap-1 text-amber-300 font-semibold text-[11px] sm:text-xs cursor-help">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold">{gold}</span>
              
              {/* Tooltip */}
              <div className="pointer-events-none absolute left-0 top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Vàng tích lũy: {gold} Gold
                </div>
              </div>
            </div>

            {/* Level & XP Meter with Tooltip */}
            <div className="group relative flex items-center gap-1.5 cursor-help">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] sm:text-[11px]">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Lv.{level}</span>
              </div>
              <div className="w-10 sm:w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${xp % 100}%` }}
                />
              </div>
              
              {/* Tooltip */}
              <div className="pointer-events-none absolute left-0 top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Cấp độ {level} ({xp % 100}/100 XP) • Luyện từ vựng tại Lửa Trại để nhận XP & Thể Lực!
                </div>
              </div>
            </div>

            {/* Inline Resource & Crops Counter with Separator */}
            {(woodCount > 0 || stoneCount > 0 || fiberCount > 0 || cropItems.length > 0) && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/70 text-xs">
                {woodCount > 0 && (
                  <div className="group relative flex items-center gap-0.5 cursor-help">
                    <span className="text-xs">🪵</span>
                    <span className="font-mono font-bold text-amber-300 text-[11px]">{woodCount}</span>
                    <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex z-50">
                      <span className="bg-slate-950/95 text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 shadow whitespace-nowrap">
                        Gỗ: {woodCount}
                      </span>
                    </div>
                  </div>
                )}

                {stoneCount > 0 && (
                  <div className="group relative flex items-center gap-0.5 cursor-help">
                    <span className="text-xs">🪨</span>
                    <span className="font-mono font-bold text-slate-200 text-[11px]">{stoneCount}</span>
                    <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex z-50">
                      <span className="bg-slate-950/95 text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 shadow whitespace-nowrap">
                        Đá: {stoneCount}
                      </span>
                    </div>
                  </div>
                )}

                {fiberCount > 0 && (
                  <div className="group relative flex items-center gap-0.5 cursor-help">
                    <span className="text-xs">🌾</span>
                    <span className="font-mono font-bold text-emerald-300 text-[11px]">{fiberCount}</span>
                    <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex z-50">
                      <span className="bg-slate-950/95 text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 shadow whitespace-nowrap">
                        Sợi cỏ: {fiberCount}
                      </span>
                    </div>
                  </div>
                )}

                {cropItems.map((item) => (
                  <div key={item.id} className="group relative flex items-center gap-0.5 cursor-help">
                    <span className="text-xs">{item.icon}</span>
                    <span className="font-mono font-bold text-emerald-400 text-[11px]">{item.count}</span>
                    <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:flex z-50">
                      <span className="bg-slate-950/95 text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 shadow whitespace-nowrap">
                        {item.name}: {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top-Right: Interactive Icon Buttons with Tooltips */}
          <div className="pointer-events-auto flex items-center gap-2">
            
            {/* Shop Button */}
            <div className="group relative flex items-center justify-center">
              <button
                onClick={() => {
                  setShopTab('buy');
                  setIsShopOpen(true);
                }}
                className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 text-amber-300 border border-slate-700/60 hover:border-amber-500/50 flex items-center justify-center transition-all shadow-lg shadow-black/40 cursor-pointer relative"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-amber-500/30 text-amber-200 border border-amber-500/40 px-1 rounded-sm leading-tight">
                  B
                </span>
              </button>
              {/* Tooltip */}
              <div className="pointer-events-none absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Cửa Hàng (Phím B)
                </div>
              </div>
            </div>

            {/* Crafting Button */}
            <div className="group relative flex items-center justify-center">
              <button
                onClick={() => {
                  setShopTab('craft');
                  setIsShopOpen(true);
                }}
                className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-indigo-500/20 text-indigo-300 border border-slate-700/60 hover:border-indigo-500/50 flex items-center justify-center transition-all shadow-lg shadow-black/40 cursor-pointer relative"
              >
                <Hammer className="w-4 h-4 text-indigo-300" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 px-1 rounded-sm leading-tight">
                  C
                </span>
              </button>
              {/* Tooltip */}
              <div className="pointer-events-none absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Chế Tạo (Phím C)
                </div>
              </div>
            </div>

            {/* Reposition / Layout Mode Button */}
            <div className="group relative flex items-center justify-center">
              <button
                onClick={() => toggleRepositionMode()}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-lg shadow-black/40 cursor-pointer relative ${
                  isRepositionMode
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40'
                    : 'bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border-slate-700/60 hover:border-cyan-500/50'
                }`}
                title="Bố Trí Lại / Di Dời Công Trình & Cây Trồng (Phím M)"
              >
                <Move className="w-4 h-4 text-cyan-300" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 px-1 rounded-sm leading-tight">
                  M
                </span>
              </button>
              {/* Tooltip */}
              <div className="pointer-events-none absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap">
                  Bố Trí Lại (Phím M)
                </div>
              </div>
            </div>

            {/* Profile Avatar Button with 6px Sync Status Dot */}
            <div ref={profileRef} className="relative flex items-center justify-center">
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 flex items-center justify-center transition-all shadow-lg shadow-black/40 cursor-pointer relative"
                title="Hồ sơ & Trạng thái đồng bộ"
              >
                <User className="w-4 h-4 text-emerald-400" />
                {/* 6px Sync Dot */}
                <span 
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                      : syncStatus === 'saving' || syncStatus === 'pending'
                      ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                      : syncStatus === 'error'
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                      : 'bg-slate-400'
                  }`} 
                />
              </button>

              {/* Profile & Sync Popover Dropdown */}
              {isProfileOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 text-slate-200 z-50 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold text-white truncate">
                        {currentUser?.email || 'Người chơi Khách'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span>
                          {syncStatus === 'synced' && 'Đã lưu đám mây'}
                          {syncStatus === 'saving' && 'Đang đồng bộ...'}
                          {syncStatus === 'pending' && 'Chờ đồng bộ...'}
                          {syncStatus === 'error' && 'Chế độ offline'}
                          {syncStatus === 'idle' && 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleManualSync();
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                      <span>Lưu đám mây ngay</span>
                    </span>
                  </button>

                  {currentUser ? (
                    onSignOut && (
                      <button
                        onClick={() => {
                          onSignOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Đăng xuất</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : (
                    onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setIsProfileOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer shadow-md shadow-emerald-950"
                      >
                        <span>Đăng nhập</span>
                        <LogIn className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. ALERT / NOTIFICATION BANNER (Anchored below Top HUD) */}
        {lastNotification && (
          <div 
            onClick={clearNotification}
            className={`absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-md shadow-2xl cursor-pointer transition-all animate-bounce ${
              lastNotification.type === 'warning' 
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' 
                : lastNotification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : lastNotification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {lastNotification.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            {lastNotification.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
            {lastNotification.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {lastNotification.type === 'info' && <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
            <span className="text-[11px] sm:text-xs font-semibold">{lastNotification.message}</span>
          </div>
        )}

        {/* 3b. FLOATING INDICATOR FOR MOVE-ONLY / OBSERVATION MODE */}
        {activeTool === 'none' && !isRepositionMode && (
          <div className="absolute bottom-16 sm:bottom-18 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/90 border border-sky-500/50 text-sky-200 text-[10px] sm:text-[11px] font-semibold backdrop-blur-md shadow-xl animate-pulse whitespace-nowrap">
            <span>✋ Chế độ Quan Sát: Click để di chuyển nhân vật • Phím 0 hoặc chọn công cụ để huỷ</span>
          </div>
        )}

        {/* 3c. FLOATING INDICATOR FOR REPOSITION / RELOCATION MODE */}
        {isRepositionMode && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 text-xs font-semibold backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span>
              {movingEntity
                ? `Đang di dời: ${movingEntity.name} (Click ô mới để đặt, ESC / chuột phải để hủy)`
                : 'Chế độ Bố Trí Lại: Click vào Bếp Lửa Trại, Quầy BBQ, Cây Trồng để nhấc'}
            </span>
            <button
              onClick={() => {
                if (movingEntity) cancelRelocation();
                toggleRepositionMode(false);
              }}
              className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
            >
              Thoát (M / ESC)
            </button>
          </div>
        )}

        {/* 4. BOTTOM HOTBAR: Pinned directly at the bottom edge of the Game Frame */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Slot 0: Move-Only / Observation Mode Button */}
          <div className="group relative">
            {/* Ergonomic Tooltip */}
            <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50">
              <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 shadow-2xl whitespace-nowrap text-center">
                <div className="font-bold text-sky-300 flex items-center justify-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-sky-300" />
                  <span>Chỉ Di Chuyển</span>
                  <span className="font-mono text-[9px] bg-slate-800 text-slate-300 px-1 rounded">Phím 0</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">Dẫn đường A*, tuyệt đối không tác động công cụ</div>
              </div>
            </div>

            <button
              onClick={() => {
                toggleMoveOnlyMode();
                setIsSeedMenuOpen(false);
                setIsActionsMenuOpen(false);
              }}
              title="Chế độ Quan Sát / Chỉ Di Chuyển (Phím 0)"
              className={`relative flex flex-col items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl transition-all cursor-pointer ${
                activeTool === 'none' 
                  ? 'bg-sky-600/30 border-2 border-sky-400 shadow-lg shadow-sky-950 scale-105' 
                  : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold">
                0
              </span>
              <Footprints className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
            </button>
          </div>

          {hotbar.map((item, idx) => {
            const isSeedSlot = item.id === 'seed' || item.type === 'seed';
            const isActionsSlot = item.id === 'actions';
            const isActive = activeTool === item.id || 
              (isSeedSlot && (activeTool === 'seed' || activeTool.startsWith('seed_'))) ||
              (isActionsSlot && (activeTool === 'resource_stone' || activeTool === 'inspect' || isRepositionMode));

            const meta = TOOL_METADATA[item.id] || { title: item.name, desc: '', shortcut: String(idx + 1) };

            return (
              <div 
                key={item.id} 
                className="group relative" 
                ref={isSeedSlot ? seedMenuRef : isActionsSlot ? actionsMenuRef : undefined}
              >
                {/* Ergonomic Hover Tooltip */}
                <div className="pointer-events-none absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50">
                  <div className="bg-slate-950/95 text-slate-200 text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-700 shadow-2xl whitespace-nowrap text-center">
                    <div className="font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                      <span>{meta.title}</span>
                      <span className="font-mono text-[9px] bg-slate-800 text-slate-300 px-1 rounded">Phím {meta.shortcut}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{meta.desc}</div>
                  </div>
                </div>

                {/* Seed Selector Popover Sub-Menu */}
                {isSeedSlot && isSeedMenuOpen && (
                  <div 
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-40 flex flex-col gap-1.5 w-48 animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-[10px] font-bold text-slate-400 px-1 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>Chọn hạt giống</span>
                      <ChevronUp className="w-3 h-3 text-slate-500" />
                    </div>
                    {SEED_OPTIONS.map((seed) => {
                      const stock = getSeedStock(seed.id);
                      const isSelected = activeSeedId === seed.id && (activeTool === seed.id || activeTool === 'seed');
                      const isDisabled = stock <= 0;
                      return (
                        <button
                          key={seed.id}
                          disabled={isDisabled}
                          onClick={() => {
                            selectSeed(seed.id);
                            setIsSeedMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                              : isDisabled
                              ? 'opacity-40 cursor-not-allowed text-slate-500'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-sm">{seed.icon}</span>
                            <span>{seed.name}</span>
                          </span>
                          <span className={`text-[10px] font-mono font-bold ${isDisabled ? 'text-slate-600' : 'text-emerald-400'}`}>
                            x{stock}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Actions Menu Popover Sub-Menu */}
                {isActionsSlot && isActionsMenuOpen && (
                  <div 
                    className="absolute bottom-full mb-2 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-40 flex flex-col gap-1.5 w-52 animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-[10px] font-bold text-slate-400 px-1 border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>Chức năng phụ</span>
                      <ChevronUp className="w-3 h-3 text-slate-500" />
                    </div>

                    {/* 1. Fetch stone with companion dog */}
                    <button
                      onClick={() => {
                        if (stoneStock > 0) {
                          selectTool('resource_stone');
                          setIsActionsMenuOpen(false);
                          useGameStore.getState().notify('🪨 Đã cầm Đá Cuội! Click ra bãi cỏ để ném cho Chó nhặt.', 'info');
                        } else {
                          useGameStore.getState().notify('Bạn không có Đá Cuội trong túi đồ!', 'warning');
                        }
                      }}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer hover:bg-slate-800 text-slate-200 ${
                        activeTool === 'resource_stone' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold' : ''
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <PawPrint className="w-3.5 h-3.5 text-amber-400" />
                        <span>Chơi với Chó (Ném đá)</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${stoneStock <= 0 ? 'text-slate-600' : 'text-amber-400'}`}>
                        x{stoneStock}
                      </span>
                    </button>

                    {/* 2. Reposition / Relocation */}
                    <button
                      onClick={() => {
                        toggleRepositionMode(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer hover:bg-slate-800 text-slate-200"
                    >
                      <Move className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Bố Trí / Di Dời Đồ</span>
                    </button>

                    {/* 3. Inspect Soil & Crop */}
                    <button
                      onClick={() => {
                        selectTool('inspect');
                        setIsActionsMenuOpen(false);
                        useGameStore.getState().notify('🔍 Chế độ Soi Đất: Click vào bất kỳ ô nào để xem thông tin đất & cây trồng!', 'info');
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer hover:bg-slate-800 text-slate-200 ${
                        activeTool === 'inspect' ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold' : ''
                      }`}
                    >
                      <Search className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Kiểm Tra Ô Đất &amp; Cây</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (isSeedSlot) {
                      selectSeed(activeSeedId || 'seed_wheat');
                      setIsSeedMenuOpen((prev) => !prev);
                      setIsActionsMenuOpen(false);
                    } else if (isActionsSlot) {
                      setIsActionsMenuOpen((prev) => !prev);
                      setIsSeedMenuOpen(false);
                    } else if (isActive) {
                      toggleMoveOnlyMode();
                      setIsSeedMenuOpen(false);
                      setIsActionsMenuOpen(false);
                    } else {
                      selectTool(item.id);
                      setIsSeedMenuOpen(false);
                      setIsActionsMenuOpen(false);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600/30 border-2 border-emerald-400 shadow-lg shadow-emerald-950 scale-105' 
                      : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold">
                    {idx + 1}
                  </span>

                  {/* Distinct Icon Rendering */}
                  {item.id === 'seed' ? (
                    <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  ) : item.id === 'hand' ? (
                    <ShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  ) : item.id === 'actions' ? (
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  ) : (
                    <span className="text-sm sm:text-base md:text-lg">{item.icon}</span>
                  )}

                  {/* Seed Badge */}
                  {isSeedSlot && (
                    <span className="absolute bottom-0.5 right-0.5 sm:right-1 text-[8px] sm:text-[9px] font-mono font-bold bg-slate-950/80 px-0.5 sm:px-1 rounded text-emerald-300">
                      x{totalSeedStock}
                    </span>
                  )}
                  {/* Item Count Badges */}
                  {item.id !== 'seed' && (item.type === 'placeable' || item.type === 'resource') && item.count !== undefined && (
                    <span className="absolute bottom-0.5 right-0.5 sm:right-1 text-[8px] sm:text-[9px] font-mono font-bold bg-slate-950/80 px-0.5 sm:px-1 rounded text-emerald-300">
                      x{item.count}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* 5. Shop & Crafting Modal */}
      <ShopModal isOpen={isShopOpen} initialTab={shopTab} onClose={() => setIsShopOpen(false)} />

      {/* 6. Chest Storage Modal */}
      <ChestModal isOpen={Boolean(currentChestKey)} chestKey={currentChestKey} onClose={() => setCurrentChestKey(null)} />

      {/* 7. Vocabulary Quiz Modal (Campfire Sanctuary) */}
      <VocabQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* 8. BBQ Stand Modal & Reading Comprehension Challenge */}
      <BBQStandModal isOpen={isBBQOpen} onClose={() => setIsBBQOpen(false)} />

      {/* 9. Indoor Furniture Crafting Modal (Carpentry Workbench) */}
      <FurnitureCraftModal isOpen={isFurnitureCraftOpen} onClose={() => setIsFurnitureCraftOpen(false)} />

    </div>
  );
}

