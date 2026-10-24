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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg pixel-panel p-5 text-[#FFE8B8] space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Wooden Notice Board */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="font-pixel text-base text-amber-200 tracking-tight flex items-center gap-2">
                <span>BẢNG NHIỆM VỤ THỊ TRẤN</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-[#2D1A0D] font-bold">
                  HÔM NAY
                </span>
              </h3>
              <p className="text-xs text-amber-100/70">
                Đơn hàng ủy thác từ Cô Oanh và các cư dân thị trấn
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

        {/* Commissions List */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {commissions.map(comm => {
            const isCompleted = comm.current >= comm.target;
            const isClaimed = comm.claimed;

            return (
              <div 
                key={comm.id}
                className={`p-3.5 rounded-xl border-2 transition ${
                  isClaimed 
                    ? 'bg-[#1E0F07] border-[#3B2314] opacity-50' 
                    : isCompleted 
                    ? 'bg-amber-950/70 border-amber-400 shadow-md' 
                    : 'bg-[#24130A] border-[#5D3A1F]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[10px] text-amber-400 font-bold uppercase">
                        Người gửi: {comm.sender}
                      </span>
                      {isCompleted && !isClaimed && (
                        <span className="font-pixel text-[9px] px-1.5 py-0.2 rounded bg-emerald-700 text-white font-bold">
                          HOÀN THÀNH
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-amber-100 mt-1 leading-snug">
                      {comm.title}
                    </h4>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-300 mb-1 font-pixel">
                  <span>Tiến độ: {comm.current}/{comm.target}</span>
                  <span>{Math.min(100, Math.round((comm.current / comm.target) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#140804] rounded-full overflow-hidden border border-[#5D3A1F]">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (comm.current / comm.target) * 100)}%` }}
                  />
                </div>

                {/* Reward & Action */}
                <div className="mt-3 pt-2 border-t border-[#3B2314] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-pixel font-bold">
                    <span className="text-amber-300">🪙 +{comm.rewardGold} G</span>
                    <span className="text-cyan-300">✨ +{comm.rewardXp} XP</span>
                    {comm.rewardHearts && (
                      <span className="text-rose-400">❤️ +{comm.rewardHearts}</span>
                    )}
                  </div>

                  {isClaimed ? (
                    <span className="text-[10px] font-pixel text-stone-500">Đã nhận thưởng ✓</span>
                  ) : isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(comm.id)}
                      className="pixel-btn pixel-btn-gold font-pixel text-[10px] py-1 px-3 shadow"
                    >
                      Nhận Thưởng
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAction(comm.skill)}
                      className="pixel-btn pixel-btn-green font-pixel text-[10px] py-1 px-3 flex items-center gap-1"
                    >
                      <span>Làm Ngay</span>
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
