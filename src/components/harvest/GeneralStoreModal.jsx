import React from 'react';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { GENERAL_STORE_CATALOG } from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';

export default function GeneralStoreModal({
  isOpen,
  onClose,
  userGold = 0,
  onBuyItem,
  ownedDecor = []
}) {
  if (!isOpen) return null;

  const handleBuy = (item) => {
    sounds.playCoin();
    onBuyItem(item.id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg harvest-panel p-5 text-[#3E2723] space-y-4 border-4 border-[#795548] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏪</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#2B2826] tracking-tight">
                  Tiệm Nông Cụ &amp; Hạt Giống Pierre
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black">
                  🪙 {userGold?.toLocaleString()} G
                </span>
              </div>
              <p className="text-xs text-[#5D4037]">
                Dùng Gold từ bài tập để mua hạt giống và nâng cấp trang trại
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog */}
        <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {GENERAL_STORE_CATALOG.map(item => {
            const isOwned = (item.type === 'decor' || item.type === 'tool') && ownedDecor.includes(item.id);
            const canAfford = userGold >= item.price;

            return (
              <div 
                key={item.id}
                className="bg-white/80 hover:bg-amber-50/80 border-2 border-[#8D6E63] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-xs sm:text-sm text-[#2B2826] truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-[#6D4C41] mt-0.5 leading-snug">
                      {item.description || (item.type === 'seed' ? 'Gieo vào ô đất trống và chăm bón bằng bài tập.' : '')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-1 rounded-lg border border-amber-300">
                    🪙 {item.price} G
                  </span>

                  {isOwned ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
                      ✓ Đã sở hữu
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-bold transition cursor-pointer ${
                        canAfford 
                          ? 'harvest-btn-gold' 
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-400'
                      }`}
                    >
                      Mua
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
