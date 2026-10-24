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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl harvest-panel p-5 sm:p-6 text-[#3E2723] space-y-5 border-4 border-[#795548] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="font-black text-base text-[#2B2826] tracking-tight">
                Balo Nông Sản &amp; Thùng Xuất Khẩu
              </h3>
              <p className="text-xs text-[#5D4037]">
                Chứa nông sản từ bài tập &amp; bỏ vào thùng giao hàng để nhận Gold
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

        {/* Two-Column: Backpack on Left, Shipping Bin on Right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Left: Backpack Inventory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-[#5D4037]">
              <span>NÔNG SẢN TRONG BALO ({inventory.length})</span>
            </div>

            <div className="bg-white/80 border-2 border-[#8D6E63] rounded-2xl p-2.5 max-h-[42vh] overflow-y-auto space-y-1.5 shadow-inner">
              {inventory.length === 0 ? (
                <p className="text-center text-xs text-[#8D6E63] py-8">
                  Balo trống trơn! Hãy làm bài tập để thu hoạch lúa, táo và bí ngô nhé.
                </p>
              ) : (
                inventory.map(item => {
                  const tier = QUALITY_TIERS[item.quality] || QUALITY_TIERS.normal;

                  return (
                    <div 
                      key={item.id}
                      className="p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-[#D7CCC8] flex items-center justify-between gap-2 text-xs transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-[#2B2826] truncate flex items-center gap-1">
                            <span>{item.name}</span>
                            {!item.isSeed && (
                              <span className={`text-[10px] font-mono ${tier.color}`}>
                                {tier.stars}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#6D4C41]">
                            {item.isSeed ? 'Hạt giống' : `Số lượng: ${item.qty} (Bán: ~${item.price} G)`}
                          </div>
                        </div>
                      </div>

                      {!item.isSeed && (
                        <button
                          type="button"
                          onClick={() => handleShip(item.id)}
                          className="px-2 py-1 text-[11px] harvest-btn-gold shrink-0 cursor-pointer"
                          title="Bỏ vào Thùng Xuất Khẩu"
                        >
                          Bán 📦
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Shipping Bin (Thùng Giao Hàng) */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-black text-[#5D4037]">
                <span>THÙNG XUẤT KHẨU ({shippingBin.length})</span>
                <span className="font-mono text-amber-900">
                  🪙 ~{totalPendingGold} G
                </span>
              </div>

              <div className="bg-[#2A1810] text-[#FFF8E1] border-2 border-[#5D4037] rounded-2xl p-2.5 max-h-[30vh] overflow-y-auto space-y-1.5 shadow-inner mt-1">
                {shippingBin.length === 0 ? (
                  <p className="text-center text-xs text-amber-200/50 py-8">
                    Thùng đang trống. Nhấn nút "Bán 📦" bên trái để chuyển nông sản vào thùng!
                  </p>
                ) : (
                  shippingBin.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-1.5 rounded-lg bg-[#3E2723] border border-[#5D4037] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span className="font-bold text-amber-100">{item.name}</span>
                        <span className="text-[10px] text-amber-200/60 font-mono">x{item.qty}</span>
                      </div>
                      <span className="font-mono font-bold text-yellow-300">
                        +{item.subtotal} G
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Settle Action */}
            <div className="pt-2">
              <button
                type="button"
                disabled={shippingBin.length === 0}
                onClick={handleSettle}
                className={`w-full py-2.5 text-xs font-black tracking-wide rounded-xl shadow-lg transition cursor-pointer ${
                  shippingBin.length > 0 
                    ? 'harvest-btn-gold animate-bounce' 
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-400'
                }`}
              >
                Tổng Kết &amp; Xuất Hàng Ngay (+{totalPendingGold} G) ✨
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
