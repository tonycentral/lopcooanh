// src/features/farm/components/ShopModal.tsx
// Farm Shop Modal: Buy Seeds & Sell Harvested Crops

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Coins, 
  Sprout, 
  Package, 
  Sparkles
} from 'lucide-react';
import { useGameStore, SHOP_SEEDS, SHOP_CROPS } from '../state/useGameStore';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');

  const gold = useGameStore((state) => state.gold);
  const inventory = useGameStore((state) => state.inventory);
  const hotbar = useGameStore((state) => state.hotbar);
  const buySeed = useGameStore((state) => state.buySeed);
  const sellCrop = useGameStore((state) => state.sellCrop);
  const sellAllCrops = useGameStore((state) => state.sellAllCrops);

  // Close on Esc key or B key toggle
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const harvestedCrops = inventory.filter((item) => item.type === 'crop' && (item.count ?? 0) > 0);
  const totalCropsCount = harvestedCrops.reduce((acc, item) => acc + (item.count ?? 0), 0);

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
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Cửa Hàng Nông Trại
              </h2>
              <p className="text-xs text-slate-400">
                Giao thương hạt giống &amp; tiêu thụ nông sản
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>{gold} Gold</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setTab('buy')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              tab === 'buy'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Mua Hạt Giống (Buy)</span>
          </button>

          <button
            onClick={() => setTab('sell')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              tab === 'sell'
                ? 'border-amber-400 text-amber-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Bán Nông Sản (Sell)</span>
            {totalCropsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {totalCropsCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Mua Hạt Giống (Buy Seeds) */}
        {tab === 'buy' && (
          <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
            {SHOP_SEEDS.map((seed) => {
              const currentSeedCount = hotbar.find((h) => h.id === seed.id)?.count ?? 0;
              const canAfford1 = gold >= seed.price;
              const canAfford5 = gold >= seed.price * 5;

              return (
                <div 
                  key={seed.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl w-10 h-10 flex items-center justify-center bg-slate-800/80 rounded-xl">
                      {seed.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        {seed.name}
                        <span className="text-[11px] font-normal text-slate-400">
                          (Đang có: <span className="font-mono text-emerald-400">{currentSeedCount}</span>)
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{seed.desc}</div>
                      <div className="text-xs font-bold text-amber-400 mt-1 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{seed.price} Gold / hạt</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => buySeed(seed.id, 1)}
                      disabled={!canAfford1}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950"
                    >
                      Mua x1
                    </button>
                    <button
                      onClick={() => buySeed(seed.id, 5)}
                      disabled={!canAfford5}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      Mua x5 ({seed.price * 5}g)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Bán Nông Sản (Sell Crops) */}
        {tab === 'sell' && (
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Quick Sell All Banner */}
            {totalCropsCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-300">
                    Kho hiện có {totalCropsCount} sản phẩm thu hoạch
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bán nhanh tất cả vào chợ để nhận vàng ngay lập tức.
                  </div>
                </div>
                <button
                  onClick={sellAllCrops}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bán Tất Cả</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Kho chưa có nông sản thành phẩm. Hãy gieo hạt, tưới nước và thu hoạch khi cây chín!
              </div>
            )}

            {/* List of Sellable Items */}
            <div className="space-y-3">
              {SHOP_CROPS.map((crop) => {
                const invItem = inventory.find((i) => i.id === crop.id);
                const count = invItem?.count ?? 0;
                const canSell = count > 0;

                return (
                  <div 
                    key={crop.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl w-10 h-10 flex items-center justify-center bg-slate-800/80 rounded-xl">
                        {crop.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          {crop.name}
                          <span className="text-[11px] font-normal text-slate-400">
                            (Trong kho: <span className="font-mono text-amber-400 font-bold">{count}</span>)
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{crop.desc}</div>
                        <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>Thu mua: {crop.price} Gold / đơn vị</span>
                        </div>
                      </div>
                    </div>

                    {/* Sell Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => sellCrop(crop.id, 1)}
                        disabled={!canSell}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-30 disabled:hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-md shadow-amber-950"
                      >
                        Bán x1 (+{crop.price}g)
                      </button>
                      {count >= 5 && (
                        <button
                          onClick={() => sellCrop(crop.id, 5)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                        >
                          Bán x5 (+{crop.price * 5}g)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center text-[11px] text-slate-500">
          Mẹo: Nhấn phím <span className="font-mono text-slate-300 font-semibold">B</span> hoặc <span className="font-mono text-slate-300 font-semibold">Esc</span> để đóng cửa hàng
        </div>
      </div>
    </div>
  );
}
