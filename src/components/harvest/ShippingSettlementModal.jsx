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
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, settlementData]);

  if (!isOpen || !settlementData) return null;

  const { items = [], totalGoldEarned = 0, bonusXp = 0, heirloomCoins = 0, newDay, newSeason } = settlementData;

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-in fade-in font-sans select-none"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-lg pixel-panel p-5 sm:p-7 text-[#FFE8B8] space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Harvest Town Receipt Style */}
        <div className="text-center space-y-1 border-b-2 border-[#1E0F07] pb-3">
          <div className="inline-block px-3 py-0.5 rounded bg-amber-500 text-[#2D1A0D] text-[10px] font-pixel font-bold uppercase tracking-wider">
            Biên Lai Xuất Khẩu Buổi Tối
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-amber-200 font-pixel tracking-wide flex items-center justify-center gap-2 pt-1">
            <span>📦</span>
            <span>HÓA ĐƠN KẾT TOÁN THỊ TRẤN</span>
            <span>✨</span>
          </h2>
          <p className="text-xs text-amber-100/70">
            Chào mừng Ngày {newDay} ({newSeason}) — Giấc ngủ ngon đã phục hồi 100% Thể Lực!
          </p>
        </div>

        {/* Itemized Table */}
        <div className="bg-[#24130A] border-2 border-[#5D3A1F] rounded-xl p-3 sm:p-4 max-h-[45vh] overflow-y-auto space-y-2">
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
                  className="flex items-center justify-between py-1.5 border-b border-[#3D2312] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <span className="font-bold text-amber-100">{item.name}</span>
                      <span className={`text-[10px] ml-1.5 ${tier.color}`}>{tier.stars}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-400">x{item.qty}</span>
                    <span className="font-pixel text-amber-300 font-bold text-xs">
                      +{item.subtotal} G
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Heirloom Passive Income row */}
          {heirloomCoins > 0 && (
            <div className="flex items-center justify-between py-2 border-t-2 border-amber-500/40 text-xs font-pixel text-purple-300">
              <span className="flex items-center gap-1.5">
                <span>👑</span>
                <span>Lãi Thụ Động Từ Hầm Hạt Giống (Seed Vault):</span>
              </span>
              <span className="text-purple-300 font-bold">+{heirloomCoins} G</span>
            </div>
          )}
        </div>

        {/* Summary Grand Total */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950 via-[#3B2314] to-amber-950 border-2 border-amber-500/80 flex items-center justify-between">
          <div>
            <div className="font-pixel text-[10px] text-amber-300 uppercase">TỔNG THU NHẬP ĐÊM NAY:</div>
            <div className="text-[11px] text-cyan-300 font-pixel">✨ +{bonusXp} EXP Nông Dân</div>
          </div>
          <div className="font-pixel text-xl sm:text-2xl font-bold text-amber-200">
            🪙 +{totalGoldEarned} Gold
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="pixel-btn pixel-btn-gold font-pixel text-xs w-full py-2.5 shadow-lg"
          >
            Bắt Đầu Ngày Mới &amp; Học Morning Almanac ✨
          </button>
        </div>

      </div>
    </div>
  );
}
