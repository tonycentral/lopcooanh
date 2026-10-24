import React from 'react';
import { X, Check, ArrowRight, Award, Heart, Sparkles } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

export default function TownBulletinModal({
  isOpen,
  onClose,
  commissions = [],
  onClaimCommission,
  onGoPractice
}) {
  if (!isOpen) return null;

  const handleClaim = (commId) => {
    sounds.playCoin();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClaimCommission(commId);
  };

  const handleAction = (skill) => {
    sounds.playClick();
    onClose();
    if (onGoPractice) onGoPractice(skill);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg harvest-panel p-5 text-[#3E2723] space-y-4 border-4 border-[#795548]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Wooden Notice Board */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="font-extrabold text-base text-[#3E2723] tracking-tight flex items-center gap-2">
                <span>Bảng Nhiệm Vụ Thị Trấn MochiTown</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 font-bold">
                  Hôm Nay
                </span>
              </h3>
              <p className="text-xs text-[#5D4037]">
                Đơn hàng ủy thác từ Cô Oanh và các cư dân thị trấn
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

        {/* Commissions List */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {commissions.map(comm => {
            const isCompleted = comm.current >= comm.target;
            const isClaimed = comm.claimed;

            return (
              <div 
                key={comm.id}
                className={`p-3.5 rounded-2xl border-2 transition ${
                  isClaimed 
                    ? 'bg-stone-100/70 border-stone-300 opacity-60'
                    : isCompleted
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm'
                      : 'bg-white/90 border-[#A1887F] hover:border-[#8D6E63]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Từ: {comm.sender}
                      </span>
                      {isCompleted && !isClaimed && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white animate-pulse">
                          ✓ ĐÃ ĐẠT CHỈ TIÊU
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-[#2B2826] mt-1.5 leading-snug">
                      {comm.title}
                    </h4>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[10px] text-[#5D4037] font-bold mb-1">
                    <span>Tiến độ bài làm:</span>
                    <span>{comm.current} / {comm.target}</span>
                  </div>
                  <div className="w-full h-2 bg-[#D7CCC8] rounded-full overflow-hidden border border-[#A1887F]">
                    <div 
                      className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`}
                      style={{ width: `${Math.min(100, Math.round((comm.current / comm.target) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Rewards & Action Button */}
                <div className="mt-3 pt-2.5 border-t border-[#D7CCC8]/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-amber-800">🪙 +{comm.rewardGold} G</span>
                    <span className="text-emerald-700">✨ +{comm.rewardXp} XP</span>
                    {comm.rewardGems && <span className="text-purple-700">💎 +{comm.rewardGems}</span>}
                    {comm.rewardHearts && <span className="text-rose-600 flex items-center gap-0.5"><Heart className="w-3 h-3 fill-rose-500" /> +{comm.rewardHearts}</span>}
                  </div>

                  {isClaimed ? (
                    <span className="text-xs font-bold text-stone-500">
                      ✓ Đã nhận thưởng
                    </span>
                  ) : isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(comm.id)}
                      className="px-3 py-1.5 text-xs harvest-btn-gold cursor-pointer"
                    >
                      Nhận Thưởng Ngay 🎁
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAction(comm.skill)}
                      className="px-3 py-1.5 text-xs harvest-btn-green flex items-center gap-1 cursor-pointer"
                    >
                      <span>Làm Nhiệm Vụ</span>
                      <ArrowRight className="w-3 h-3" />
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
