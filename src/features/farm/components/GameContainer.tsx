// src/features/farm/components/GameContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../engine/config';
import { useGameStore } from '../state/useGameStore';
import { flushPendingFarmSync, initVisibilitySyncListener } from '../services/supabaseSync';
import ShopModal from './ShopModal';
import ChestModal from './ChestModal';
import { 
  Coins, 
  Zap, 
  HelpCircle, 
  Cloud, 
  CloudCheck, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Package,
  User,
  LogOut,
  LogIn,
  ShoppingBag,
  Moon,
  Hammer
} from 'lucide-react';

interface GameContainerProps {
  currentUser?: { id: string; email?: string } | null;
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
}

export default function GameContainer({ currentUser, onOpenAuthModal, onSignOut }: GameContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const gold = useGameStore((state) => state.gold);
  const energy = useGameStore((state) => state.energy);
  const maxEnergy = useGameStore((state) => state.maxEnergy);
  const day = useGameStore((state) => state.day);
  const hotbar = useGameStore((state) => state.hotbar);
  const inventory = useGameStore((state) => state.inventory);
  const activeTool = useGameStore((state) => state.activeTool);
  const syncStatus = useGameStore((state) => state.syncStatus);
  const lastNotification = useGameStore((state) => state.lastNotification);
  const selectTool = useGameStore((state) => state.selectTool);
  const initSync = useGameStore((state) => state.initSync);
  const clearNotification = useGameStore((state) => state.clearNotification);
  const sleepNextDay = useGameStore((state) => state.sleepNextDay);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopTab, setShopTab] = useState<'buy' | 'sell' | 'craft'>('buy');
  const [currentChestKey, setCurrentChestKey] = useState<string | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);

  // Auto-dismiss notification after 3.5 seconds
  useEffect(() => {
    if (!lastNotification) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, 3500);
    return () => clearTimeout(timer);
  }, [lastNotification, clearNotification]);

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

      // If modal or sleeping transition is active, ignore hotbar tool changes
      if (isShopOpen || Boolean(currentChestKey) || isSleeping) return;

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= hotbar.length) {
        selectTool(hotbar[keyNum - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, selectTool, isShopOpen, shopTab, currentChestKey, isSleeping]);

  const handleSleep = () => {
    if (isSleeping) return;
    setIsSleeping(true);
    setTimeout(() => {
      sleepNextDay();
      setIsSleeping(false);
    }, 600);
  };

  // Synchronize modal state with Phaser input context (disable WASD/mouse raycast when modal is open)
  useEffect(() => {
    if (!gameRef.current) return;
    try {
      const scene = gameRef.current.scene.getScene('FarmScene') as { setModalOpen?: (open: boolean) => void } | null;
      if (scene && typeof scene.setModalOpen === 'function') {
        scene.setModalOpen(isShopOpen || Boolean(currentChestKey) || isSleeping);
      }
    } catch {
      // Scene might not be initialized yet
    }
  }, [isShopOpen, currentChestKey, isSleeping]);

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

    return () => {
      game.events.off('open-chest', handleOpenChest);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleManualSync = () => {
    flushPendingFarmSync();
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center relative p-2 sm:p-4 select-none font-sans">
      
      {/* =========================================================================
          UNIFIED GAME FRAME (ASPECT RATIO 3:2 / 960x640px BOUNDED)
          Ensures ZERO dead space and anchors all HUD tightly inside the viewport
          ========================================================================= */}
      <div className="relative w-full max-w-[960px] aspect-[3/2] max-h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center">
        
        {/* 1. Canvas Viewport for Phaser 3 */}
        <div ref={containerRef} className="w-full h-full" />

        {/* 2. TOP HUD: Stats, Energy, Gold, Inventory & Cloud Status */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none gap-2">
          
          {/* Top-Left: Player Stats Bar */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-slate-800 shadow-xl">
            {/* Day & Season & Sleep */}
            <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-200">Ngày {day} (Xuân)</span>
              <button
                onClick={handleSleep}
                disabled={isSleeping}
                title="Nghỉ ngơi qua ngày mới (Hồi phục thể lực)"
                className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30 transition-colors pointer-events-auto cursor-pointer disabled:opacity-50"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Ngủ</span>
              </button>
            </div>

            {/* Energy Meter */}
            <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <div className="w-16 sm:w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${Math.round((energy / maxEnergy) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-300">{energy}</span>
            </div>

            {/* Gold Counter */}
            <div className="flex items-center gap-1 text-amber-300 font-semibold text-[11px] sm:text-xs">
              <Coins className="w-3.5 h-3.5" />
              <span>{gold}</span>
            </div>

            {/* Resources Counter (Wood & Stone) */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700 text-xs">
              <span className="flex items-center gap-0.5 text-amber-200" title="Gỗ đã khai thác (Dùng Rìu chặt)">
                <span className="text-xs sm:text-sm">🪵</span>
                <span className="font-mono font-bold text-amber-300 text-[11px] sm:text-xs">
                  {inventory.find((i) => i.id === 'resource_wood')?.count ?? 0}
                </span>
              </span>
              <span className="flex items-center gap-0.5 text-slate-300" title="Đá đã khai thác (Dùng Cuốc chim đập)">
                <span className="text-xs sm:text-sm">🪨</span>
                <span className="font-mono font-bold text-slate-200 text-[11px] sm:text-xs">
                  {inventory.find((i) => i.id === 'resource_stone')?.count ?? 0}
                </span>
              </span>
            </div>

            {/* Harvested Goods Summary */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-1.5 text-xs">
                {inventory.filter(i => i.type === 'crop' && (i.count ?? 0) > 0).map(item => (
                  <span key={item.id} className="text-slate-300 flex items-center gap-0.5">
                    <span>{item.icon}</span>
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">{item.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top-Right: Cloud Sync Status & User Profile */}
          <div className="pointer-events-auto flex items-center gap-2">
            
            {/* Shop Button */}
            <button
              onClick={() => {
                setShopTab('buy');
                setIsShopOpen(true);
              }}
              title="Mở Cửa Hàng (Phím B)"
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-md shadow-amber-950 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cửa Hàng (B)</span>
            </button>

            {/* Crafting Button */}
            <button
              onClick={() => {
                setShopTab('craft');
                setIsShopOpen(true);
              }}
              title="Mở Bảng Chế Tạo (Phím C)"
              className="flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-md shadow-indigo-950 cursor-pointer"
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>Chế Tạo (C)</span>
            </button>

            {/* Cloud Sync Status Indicator */}
            <button
              onClick={handleManualSync}
              title="Nhấn để ép đồng bộ ngay lập tức lên Supabase"
              className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] hover:border-slate-700 transition-colors shadow-lg"
            >
              {syncStatus === 'saving' && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="hidden sm:inline text-amber-300 font-medium">Đang lưu...</span>
                </>
              )}
              {syncStatus === 'pending' && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  <span className="hidden sm:inline text-slate-300">Chờ lưu</span>
                </>
              )}
              {syncStatus === 'synced' && (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-300 font-medium">Đã lưu</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline text-rose-300 font-medium">Offline</span>
                </>
              )}
              {syncStatus === 'idle' && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline text-slate-400">Offline</span>
                </>
              )}
            </button>

            {/* Auth / User Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline max-w-[90px] truncate">{currentUser.email?.split('@')[0]}</span>
                {onSignOut && (
                  <button 
                    onClick={onSignOut} 
                    title="Đăng xuất" 
                    className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all shadow-md shadow-emerald-950"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )
            )}

            {/* Quick Controls Hint */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>WASD | Chuột</span>
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

        {/* 5. Sleep Transition Overlay */}
        {isSleeping && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-slate-100 animate-in fade-in duration-300">
            <Moon className="w-10 h-10 text-indigo-400 animate-pulse mb-3" />
            <div className="text-base font-bold tracking-wide">Màn đêm buông xuống...</div>
            <div className="text-xs text-slate-400 mt-1">Đang hồi phục thể lực &amp; chuyển sang ngày mới</div>
          </div>
        )}

      </div>

      {/* 6. Shop & Crafting Modal */}
      <ShopModal isOpen={isShopOpen} initialTab={shopTab} onClose={() => setIsShopOpen(false)} />

      {/* 7. Chest Storage Modal */}
      <ChestModal isOpen={Boolean(currentChestKey)} chestKey={currentChestKey} onClose={() => setCurrentChestKey(null)} />

    </div>
  );
}
