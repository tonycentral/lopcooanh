import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { SHOP_ITEMS } from '../../services/farmService';
import confetti from 'canvas-confetti';

export default function FarmShopModal({ 
  isOpen, 
  onClose, 
  coins = 0, 
  ownedItems = [], 
  onBuyItem 
}) {
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleBuy = (item) => {
    if (coins < item.price) {
      alert(`Bạn còn thiếu ${item.price - coins} Bút Vàng. Hãy hoàn thành bài tập về nhà hoặc thu hoạch thêm nông sản nhé!`);
      return;
    }

    if (onBuyItem) {
      const res = onBuyItem(item.id);
      if (res?.success) {
        setSuccessMsg(`✓ Đã mua thành công ${item.name}!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        try {
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        } catch (e) {
          console.debug(e);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] border border-[#DDD6CB] rounded-3xl p-6 shadow-2xl text-[#2B2826] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center text-xl font-bold border border-amber-400/40">
              🏪
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#2B2826] flex items-center gap-2">
                <span>Cửa Hàng Trang Viên Lớp Cô Oanh</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 font-bold border border-amber-500/30">
                  🪙 {coins} Bút Vàng
                </span>
              </h3>
              <p className="text-xs text-[#6E675E]">
                Dùng Bút Vàng tích lũy từ bài tập để mua đồ trang trí và bùa bổ trợ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8E867B] hover:text-[#2B2826] hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Shop Items List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => {
            const isOwned = item.category !== 'booster' && ownedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-[#DDD6CB] shadow-sm flex items-center justify-between gap-3 hover:border-[#CAD8C8] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#DDD6CB] flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#2B2826] flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.category === 'booster' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          Tạm thời
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6E675E] leading-snug line-clamp-2">
                      {item.description}
                    </p>
                    <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1 mt-0.5">
                      <span>🪙 {item.price} Bút Vàng</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={isOwned || !canAfford}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    isOwned
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : canAfford
                      ? 'bg-[#4A5D4E] hover:bg-[#3D4E41] text-white shadow-sm cursor-pointer active:scale-95'
                      : 'bg-[#EFECE5] text-[#8E867B] cursor-not-allowed opacity-60'
                  }`}
                >
                  {isOwned ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã có</span>
                    </>
                  ) : (
                    <span>Mua ngay</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
