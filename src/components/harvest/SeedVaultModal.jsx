import React from 'react';
import { X, Sparkles, Award, Coins, BookOpen, Volume2 } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export default function SeedVaultModal({
  isOpen,
  onClose,
  seedVault = []
}) {
  if (!isOpen) return null;

  const totalPassiveCoins = seedVault.reduce((acc, h) => acc + (h.dailyCoins || 10), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col pixel-panel rounded-xl overflow-hidden shadow-2xl relative font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2D1A0D] text-[#FFE8B8] px-4 sm:px-6 py-3 border-b-4 border-[#140804] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-heirloom">👑</span>
            <div>
              <h2 className="font-pixel text-base sm:text-lg font-bold text-amber-200">
                SEED VAULT • HẦM HẠT GIỐNG BẢO VẬT GIA TRUYỀN
              </h2>
              <p className="text-xs text-amber-100/70">
                Các từ vựng đã đạt mốc Mastered (Heirloom) — Sinh lãi Gold vĩnh viễn mỗi sớm mai!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passive Income Banner */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#2D1B13] text-[#FFE8B8]">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950 via-[#3E2723] to-amber-950 border-2 border-amber-500/70 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
                🪙
              </div>
              <div>
                <div className="text-xs text-amber-300 font-pixel">TỔNG THU NHẬP THỤ ĐỘNG HÀNG NGÀY:</div>
                <div className="text-xl font-black text-amber-200">+{totalPassiveCoins} Gold / ngày</div>
              </div>
            </div>

            <span className="px-3 py-1 rounded bg-amber-500 text-[#2D1A0D] font-pixel text-xs font-bold">
              {seedVault.length} BẢO VẬT
            </span>
          </div>

          {/* Heirloom Words List */}
          <div className="space-y-2.5">
            <div className="font-pixel text-xs text-amber-300">
              DANH SÁCH TỪ VỰNG HEIRLOOM ĐÃ THÔNG THẠO HOÀN TOÀN:
            </div>

            {seedVault.length === 0 ? (
              <div className="p-8 text-center text-stone-400 bg-[#24130A] rounded-xl border border-[#4A2B11] space-y-2">
                <p className="text-sm">Chưa có từ vựng nào đạt cấp độ Heirloom (Bảo vật gia truyền).</p>
                <p className="text-xs text-stone-500">
                  Hãy chăm chỉ tưới nước và ôn tập từ vựng qua 5 chu kỳ SRS (&gt;30 ngày) để biến chúng thành Bảo vật sinh lãi mãi mãi!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seedVault.map(item => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#3B2314] border-2 border-amber-500/60 shadow-md space-y-2 hover:border-amber-400 transition"
                  >
                    <div className="flex items-center justify-between border-b border-[#5D3A1F] pb-1.5">
                      <span className="font-pixel text-base font-bold text-amber-200">
                        {item.word}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 text-[11px] font-bold">
                        +{item.dailyCoins || 12} G/ngày
                      </span>
                    </div>

                    <p className="text-xs text-stone-300">
                      {item.meaning}
                    </p>

                    <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                      <span>Mốc hoàn thành: {item.masteredDate}</span>
                      <span className="text-amber-400 font-pixel">MASTERED ★</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
