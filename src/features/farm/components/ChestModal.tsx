// src/features/farm/components/ChestModal.tsx
// 8-Slot Wooden Chest Storage Modal: Deposit and Withdraw items

import React, { useEffect } from 'react';
import { X, Package, ArrowDown, ArrowUp } from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import type { InventoryItem } from '../types';

interface ChestModalProps {
  isOpen: boolean;
  chestKey: string | null;
  onClose: () => void;
}

export default function ChestModal({ isOpen, chestKey, onClose }: ChestModalProps) {
  const tiles = useGameStore((state) => state.tiles);
  const inventory = useGameStore((state) => state.inventory);
  const hotbar = useGameStore((state) => state.hotbar);
  const depositToChest = useGameStore((state) => state.depositToChest);
  const withdrawFromChest = useGameStore((state) => state.withdrawFromChest);

  // Close on Esc key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !chestKey) return null;

  const currentTile = tiles[chestKey];
  const chestItems: InventoryItem[] = currentTile?.placeable?.chestData?.items || [];

  // Filter player items available for deposit (exclude permanent tools)
  const playerDepositableItems = [
    ...inventory.filter((i) => i.type !== 'tool' && (i.count ?? 0) > 0),
    ...hotbar.filter((i) => (i.type === 'crop' || i.type === 'resource' || i.type === 'seed' || i.type === 'consumable') && (i.count ?? 0) > 0)
  ];

  // De-duplicate items that might exist in both
  const uniquePlayerItems: InventoryItem[] = [];
  const seenIds = new Set<string>();
  for (const item of playerDepositableItems) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniquePlayerItems.push(item);
    }
  }

  // 8 slots representation
  const slots: Array<InventoryItem | null> = [];
  for (let i = 0; i < 8; i++) {
    slots.push(chestItems[i] || null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              📦
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Rương Gỗ Lưu Trữ
              </h2>
              <p className="text-xs text-slate-400">
                Sức chứa: <span className="font-mono text-amber-400 font-bold">{chestItems.length}</span>/8 ngăn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Section 1: Chest Slots (8 Slots) */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Đồ trong rương (Bấm để lấy ra)</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {slots.map((item, idx) => {
                if (item) {
                  return (
                    <div
                      key={`chest-slot-${idx}-${item.id}`}
                      className="group relative p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex flex-col items-center justify-between gap-1 hover:border-amber-400 transition-all shadow-md"
                    >
                      <div className="text-2xl mt-1">{item.icon}</div>
                      <div className="text-[11px] font-semibold text-slate-200 text-center truncate max-w-full">
                        {item.name.split('(')[0]}
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md">
                        x{item.count ?? 1}
                      </span>

                      {/* Quick action buttons */}
                      <div className="w-full mt-1 flex items-center gap-1">
                        <button
                          onClick={() => withdrawFromChest(chestKey, item.id, 1)}
                          title="Lấy 1"
                          className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                        >
                          <ArrowDown className="w-2.5 h-2.5" /> 1
                        </button>
                        {(item.count ?? 0) > 1 && (
                          <button
                            onClick={() => withdrawFromChest(chestKey, item.id, item.count ?? 1)}
                            title="Lấy tất cả"
                            className="flex-1 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                          >
                            All
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`empty-slot-${idx}`}
                    className="h-28 rounded-xl border-2 border-dashed border-slate-800/80 bg-slate-950/20 flex flex-col items-center justify-center text-slate-600 text-xs gap-1"
                  >
                    <Package className="w-4 h-4 opacity-30" />
                    <span className="text-[10px]">Trống {idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Player Inventory (Deposit Source) */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Túi đồ của bạn (Bấm để cất vào rương)</span>
              <span className="text-[11px] font-normal text-slate-400">
                {uniquePlayerItems.length} mặt hàng
              </span>
            </div>

            {uniquePlayerItems.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">
                Túi đồ không có vật phẩm nào có thể cất giữ.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {uniquePlayerItems.map((item) => {
                  const isChestFull = chestItems.length >= 8 && !chestItems.some((ci) => ci.id === item.id);

                  return (
                    <div
                      key={`player-item-${item.id}`}
                      className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-semibold text-white truncate">
                            {item.name.split('(')[0]}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400">
                            Có: x{item.count ?? 1}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => depositToChest(chestKey, item.id, 1)}
                          disabled={isChestFull}
                          title="Cất 1 vào rương"
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-[10px] font-bold text-slate-200 border border-slate-700 flex items-center gap-0.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-2.5 h-2.5" /> Cất 1
                        </button>
                        {(item.count ?? 0) >= 5 && (
                          <button
                            onClick={() => depositToChest(chestKey, item.id, 5)}
                            disabled={isChestFull}
                            title="Cất 5 vào rương"
                            className="px-2 py-0.5 rounded bg-indigo-600/80 hover:bg-indigo-500 disabled:opacity-30 text-[9px] font-bold text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            +5
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500">
          Mẹo: Nhấn phím <span className="font-mono text-slate-300 font-semibold">Esc</span> để đóng rương đồ
        </div>
      </div>
    </div>
  );
}
