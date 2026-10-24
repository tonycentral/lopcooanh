import React from 'react';
import { X, Package, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { QUALITY_TIERS } from '../../services/harvestTownService';

export default function BackpackModal({
  isOpen,
  onClose,
  inventory = [],
  shippingBin = [],
  onShipItem,
  onSettleShipping
}) {
  if (!isOpen) return null;

  const handleShip = (invId) => {
    sounds.playCoin();
    onShipItem(invId, 1);
  };

  const handleSettle = () => {
    sounds.playCoin();
    onSettleShipping();
  };

  const totalPendingGold = shippingBin.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl pixel-panel p-5 sm:p-6 text-[#FFE8B8] space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="font-pixel text-base text-amber-200 tracking-tight">
                BALO NÔNG SẢN &amp; THÙNG XUẤT KHẨU
              </h3>
              <p className="text-xs text-amber-100/70">
                Chứa nông sản từ bài tập &amp; xuất khẩu để nhận Gold mỗi tối
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

        {/* Two-Column: Backpack on Left, Shipping Bin on Right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Left: Backpack Inventory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-pixel text-amber-300">
              <span>NÔNG SẢN TRONG BALO ({inventory.length})</span>
            </div>

            <div className="bg-[#24130A] border-2 border-[#5D3A1F] rounded-xl p-2.5 max-h-[42vh] overflow-y-auto space-y-1.5 shadow-inner">
              {inventory.length === 0 ? (
                <div className="p-6 text-center text-stone-400 text-xs">
                  Balo đang trống! Hãy chăm bón và thu hoạch cây nhé.
                </div>
              ) : (
                inventory.map(item => {
                  const tier = QUALITY_TIERS[item.quality] || QUALITY_TIERS.normal;

                  return (
                    <div 
                      key={item.id}
                      className="p-2 rounded-lg bg-[#3B2314] border border-[#5D3A1F] flex items-center justify-between gap-2 hover:border-amber-400 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="font-pixel text-xs text-amber-200 truncate font-bold">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-stone-300 flex items-center gap-1 font-mono">
                            <span>x{item.qty}</span>
                            {!item.isSeed && (
                              <span className={tier.color}>• {tier.stars}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!item.isSeed ? (
                        <button
                          type="button"
                          onClick={() => handleShip(item.id)}
                          className="pixel-btn pixel-btn-gold font-pixel text-[9px] py-1 px-2 shrink-0 flex items-center gap-0.5"
                          title="Bỏ 1 cái vào Thùng Xuất Khẩu"
                        >
                          <span>Bán</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-pixel text-stone-500 shrink-0">Hạt giống</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Shipping Bin (Waiting for night settlement) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-pixel text-amber-300">
              <span>THÙNG XUẤT KHẨU ({shippingBin.length})</span>
              <span className="font-bold text-amber-300">🪙 {totalPendingGold} G</span>
            </div>

            <div className="bg-[#24130A] border-2 border-[#5D3A1F] rounded-xl p-2.5 max-h-[42vh] overflow-y-auto space-y-1.5 shadow-inner">
              {shippingBin.length === 0 ? (
                <div className="p-6 text-center text-stone-400 text-xs">
                  Thùng xuất khẩu đang trống. Hãy bấm [Bán] các vật phẩm từ balo!
                </div>
              ) : (
                shippingBin.map(item => (
                  <div 
                    key={item.id}
                    className="p-2 rounded-lg bg-[#3B2314] border border-[#5D3A1F] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="font-pixel text-[11px] text-amber-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-stone-400">x{item.qty} @ {item.unitPrice} G</div>
                      </div>
                    </div>
                    <span className="font-pixel text-xs text-amber-300 font-bold shrink-0">
                      +{item.subtotal} G
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Settle / Ship Now Button */}
            {shippingBin.length > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSettle}
                  className="pixel-btn pixel-btn-gold font-pixel text-xs w-full py-2 shadow"
                >
                  Kết Toán &amp; Sang Ngày Mới (+{totalPendingGold} G)
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
