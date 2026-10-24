import React, { useEffect } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { QUALITY_TIERS } from '../../services/harvestTownService';

export default function ShippingSettlementModal({
  isOpen,
  onClose,
  settlementData
}) {
  useEffect(() => {
    if (isOpen && settlementData?.totalGoldEarned > 0) {
      sounds.playCoin();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, settlementData]);

  if (!isOpen || !settlementData) return null;

  const { items = [], totalGoldEarned = 0, bonusXp = 0, newDay, newSeason } = settlementData;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-lg harvest-panel-dark p-5 sm:p-7 text-[#FFF8E1] space-y-5 border-4 border-[#8D6E63] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Stardew/Harvest Town Style */}
        <div className="text-center space-y-1 border-b-2 border-[#5D4037] pb-4">
          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-widest">
            Thùng Giao Hàng Thị Trấn
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-serif tracking-wide flex items-center justify-center gap-2">
            <span>📦</span>
            <span>HÓA ĐƠN XUẤT NÔNG SẢN</span>
            <span>✨</span>
          </h2>
          <p className="text-xs text-amber-100/70">
            Tổng kết các bài tập &amp; nông sản đã thu hoạch hôm nay
          </p>
        </div>

        {/* Itemized Table */}
        <div className="bg-[#2A1810] border-2 border-[#5D4037] rounded-xl p-3 sm:p-4 max-h-[45vh] overflow-y-auto space-y-2">
          {items.length === 0 ? (
            <p className="text-center text-xs text-amber-200/60 py-4">
              Không có vật phẩm nào được xuất khẩu hôm nay.
            </p>
          ) : (
            items.map((item, idx) => {
              const tier = QUALITY_TIERS[item.quality] || QUALITY_TIERS.normal;

              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#3E2723]/60 hover:bg-[#3E2723] border border-[#5D4037] text-xs transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-bold text-amber-100 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className={`text-[10px] font-mono ${tier.color}`}>
                          {tier.stars}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-200/60">
                        {item.qty} × {item.unitPrice} G
                      </div>
                    </div>
                  </div>

                  <div className="font-mono font-bold text-yellow-300">
                    +{item.subtotal} G
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Total Summary Row */}
        <div className="bg-[#1A0D08] border-2 border-amber-500/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
              TỔNG THU NHẬP HÔM NAY
            </div>
            <div className="text-xs text-emerald-400 font-bold mt-0.5">
              +{bonusXp} EXP Tích Lũy
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl sm:text-3xl font-black text-yellow-300 flex items-center gap-1.5">
              <span>+{totalGoldEarned.toLocaleString()}</span>
              <span className="text-sm text-yellow-500 font-sans">G</span>
            </span>
          </div>
        </div>

        {/* Day Advancing Info */}
        {newDay && (
          <div className="text-center text-xs text-amber-200/80 font-bold bg-[#3E2723]/40 py-1.5 rounded-lg border border-[#5D4037]">
            🌾 Ngày mới đã bắt đầu! Đã sang ngày {newDay}. Thể lực nông dân đã hồi phục +30⚡!
          </div>
        )}

        {/* OK Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 harvest-btn-gold text-sm tracking-wide shadow-lg cursor-pointer"
          >
            Nhận Tiền &amp; Tiếp Tục Làm Vườn ✨
          </button>
        </div>

      </div>
    </div>
  );
}
