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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg pixel-panel p-5 text-[#FFE8B8] space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏪</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-base text-amber-200 tracking-tight">
                  TIỆM NÔNG CỤ &amp; HẠT GIỐNG PIERRE
                </h3>
                <span className="font-pixel text-[10px] px-2 py-0.5 rounded bg-amber-500 text-[#2D1A0D] font-bold">
                  🪙 {userGold?.toLocaleString()} G
                </span>
              </div>
              <p className="text-xs text-amber-100/70">
                Dùng Gold từ việc học tập để mua hạt giống và trang trí trang trại
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
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
                className="bg-[#24130A] hover:bg-[#3B2314] border-2 border-[#5D3A1F] rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#5D3A1F] border border-amber-500/70 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-pixel text-xs text-amber-200 truncate font-bold">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-[10px] text-stone-300 line-clamp-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-pixel text-xs text-amber-300 font-bold">
                    🪙 {item.price} G
                  </span>

                  {isOwned ? (
                    <span className="px-2.5 py-1 rounded bg-[#140804] border border-[#5D3A1F] text-stone-400 font-pixel text-[10px]">
                      Đã sở hữu
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`pixel-btn pixel-btn-gold font-pixel text-[10px] py-1.5 px-3 ${
                        !canAfford ? 'opacity-40 cursor-not-allowed' : ''
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
