// src/features/farm/components/GameContainer.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../engine/config';
import { useGameStore } from '../state/useGameStore';
import { flushPendingFarmSync, initVisibilitySyncListener } from '../services/supabaseSync';
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
  Package
} from 'lucide-react';

interface GameContainerProps {
  userId?: string | null;
}

export default function GameContainer({ userId }: GameContainerProps) {
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
    initSync(userId);
    const cleanupVisibility = initVisibilitySyncListener();
    return () => {
      cleanupVisibility();
      flushPendingFarmSync();
    };
  }, [userId, initSync]);

  // Keyboard shortcut listener for Hotbar slots 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= hotbar.length) {
        selectTool(hotbar[keyNum - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotbar, selectTool]);

  // Phaser Game instance lifecycle management (React 19 strict-mode safe)
  useEffect(() => {
    if (!containerRef.current) return;

    const config = createGameConfig(containerRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
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
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 font-sans">
      
      {/* 1. Canvas Viewport for Phaser 3 */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 2. Top-Left: Player Stats & Status Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 shadow-xl">
        {/* Day & Season */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">Ngày {day} (Mùa Xuân)</span>
        </div>

        {/* Energy Meter */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${Math.round((energy / maxEnergy) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-slate-300">{energy}/{maxEnergy}</span>
        </div>

        {/* Gold Counter */}
        <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
          <Coins className="w-4 h-4" />
          <span>{gold} Gold</span>
        </div>

        {/* Harvested Goods Summary */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-700">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-2 text-xs">
            {inventory.filter(i => (i.count ?? 0) > 0).map(item => (
              <span key={item.id} className="text-slate-300 flex items-center gap-1">
                <span>{item.icon}</span>
                <span className="font-mono text-emerald-400 font-bold">{item.count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Top-Center: Notification / Alert Bar */}
      {lastNotification && (
        <div 
          onClick={clearNotification}
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-2xl border backdrop-blur-md shadow-2xl cursor-pointer transition-all animate-bounce ${
            lastNotification.type === 'warning' 
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' 
              : lastNotification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : lastNotification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          {lastNotification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {lastNotification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {lastNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {lastNotification.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span className="text-xs font-semibold">{lastNotification.message}</span>
        </div>
      )}

      {/* 4. Top-Right: Cloud Sync Status & Quick Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        
        {/* Cloud Sync Status Indicator */}
        <button
          onClick={handleManualSync}
          title="Nhấn để ép đồng bộ ngay lập tức lên Supabase"
          className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] hover:border-slate-700 transition-colors"
        >
          {syncStatus === 'saving' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-amber-300 font-medium">Đang lưu mây...</span>
            </>
          )}
          {syncStatus === 'pending' && (
            <>
              <Cloud className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="text-slate-300">Chờ đồng bộ (15s)</span>
            </>
          )}
          {syncStatus === 'synced' && (
            <>
              <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Đã đồng bộ mây</span>
            </>
          )}
          {syncStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-300 font-medium">Lưu ngoại tuyến</span>
            </>
          )}
          {syncStatus === 'idle' && (
            <>
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Offline Local</span>
            </>
          )}
        </button>

        {/* Controls Tooltip */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span><span className="font-semibold text-slate-200">WASD</span> | <span className="font-semibold text-slate-200">Chuột trái</span></span>
        </div>
      </div>

      {/* 5. Bottom Center: Interactive Hotbar (Slots 1-5) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl">
        {hotbar.map((item, idx) => {
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              onClick={() => selectTool(item.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                isActive 
                  ? 'bg-emerald-600/30 border-2 border-emerald-400 shadow-lg shadow-emerald-950 scale-105' 
                  : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="absolute top-1 left-1.5 text-[10px] font-mono text-slate-400 font-bold">
                {idx + 1}
              </span>
              <span className="text-xl">{item.icon}</span>
              {item.type === 'seed' && (
                <span className="absolute bottom-1 right-1.5 text-[10px] font-mono font-bold bg-slate-950/80 px-1 rounded text-emerald-300">
                  x{item.count ?? 0}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
