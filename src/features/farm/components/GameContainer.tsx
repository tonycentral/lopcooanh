// src/features/farm/components/GameContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../engine/config';
import { useGameStore } from '../state/useGameStore';
import { flushPendingFarmSync, initVisibilitySyncListener } from '../services/supabaseSync';
import ShopModal from './ShopModal';
import ChestModal from './ChestModal';
import VocabQuizModal from './VocabQuizModal';
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
  Sparkles
} from 'lucide-react';

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
  const syncStatus = useGameStore((state) => state.syncStatus);
  const lastNotification = useGameStore((state) => state.lastNotification);
  const selectTool = useGameStore((state) => state.selectTool);
  const initSync = useGameStore((state) => state.initSync);
  const clearNotification = useGameStore((state) => state.clearNotification);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopTab, setShopTab] = useState<'buy' | 'sell' | 'craft'>('buy');
  const [currentChestKey, setCurrentChestKey] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Auto-dismiss notification after 3.5 seconds
  useEffect(() => {
    if (!lastNotification) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, 3500);
    return () => clearTimeout(timer);
  }, [lastNotification, clearNotification]);

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

      // If modal is active, ignore hotbar tool changes
      if (isShopOpen || Boolean(currentChestKey) || isProfileOpen || isQuizOpen) return;

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= hotbar.length) {
        selectTool(hotbar[keyNum - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, selectTool, isShopOpen, shopTab, currentChestKey, isProfileOpen, isQuizOpen]);

  // Synchronize modal state with Phaser input context (disable WASD/mouse raycast when modal is open)
  useEffect(() => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('FarmScene') as { setModalOpen?: (open: boolean) => void } | null;
      if (scene && typeof scene.setModalOpen === 'function') {
        scene.setModalOpen(isShopOpen || Boolean(currentChestKey) || isProfileOpen || isQuizOpen);
      }
    } catch {
      // Scene might not be initialized yet
    }
  }, [isShopOpen, currentChestKey, isProfileOpen, isQuizOpen]);

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

    return () => {
      game.events.off('open-chest', handleOpenChest);
      game.events.off('open-vocab-quiz', handleOpenQuiz);
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

        {/* 4. BOTTOM HOTBAR: Pinned directly at the bottom edge of the Game Frame */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
          {hotbar.map((item, idx) => {
            const isActive = activeTool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectTool(item.id)}
                className={`relative flex flex-col items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-600/30 border-2 border-emerald-400 shadow-lg shadow-emerald-950 scale-105' 
                    : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono text-slate-400 font-bold">
                  {idx + 1}
                </span>
                <span className="text-sm sm:text-base md:text-lg">{item.icon}</span>
                {(item.type === 'seed' || item.type === 'placeable' || item.type === 'consumable') && item.count !== undefined && (
                  <span className="absolute bottom-0.5 right-0.5 sm:right-1 text-[8px] sm:text-[9px] font-mono font-bold bg-slate-950/80 px-0.5 sm:px-1 rounded text-emerald-300">
                    x{item.count}
                  </span>
                )}
              </button>
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

    </div>
  );
}

