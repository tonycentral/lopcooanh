import React, { useState } from 'react';
import { X, Train, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const ITEM_NAMES = {
  wheat: { name: 'Lúa Mì Từ Vựng', icon: '🌾' },
  apples: { name: 'Táo Đỏ Ngữ Pháp', icon: '🍎' },
  pumpkins: { name: 'Bí Ngô Vàng Task 2', icon: '🎃' }
};

export default function CoopTrainModal({ 
  isOpen, 
  onClose, 
  coopTrain = {}, 
  barnInventory = {}, 
  onContribute 
}) {
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const requirements = coopTrain.requirements || {};
  const userContrib = coopTrain.userContribution || {};

  const handleContributeItem = (itemKey) => {
    const stock = barnInventory[itemKey] || 0;
    if (stock < 1) {
      alert(`Bạn chưa có đủ ${ITEM_NAMES[itemKey]?.name || itemKey} trong kho. Hãy hoàn thành bài học để gặt thêm nhé!`);
      return;
    }

    if (onContribute) {
      const res = onContribute(itemKey, 1);
      if (res?.success) {
        setSuccessMsg(`✓ Đã gửi 1 ${ITEM_NAMES[itemKey]?.name} lên toa tàu của lớp! (+${res.coinsBonus} Bút Vàng)`);
        setTimeout(() => setSuccessMsg(''), 3000);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
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
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-800 flex items-center justify-center text-xl font-bold border border-blue-400/40">
              🚂
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#2B2826] flex items-center gap-2">
                <span>Chuyến Tàu Nông Sản MochiFarm</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 font-bold border border-blue-500/30">
                  Hợp Tác Xã
                </span>
              </h3>
              <p className="text-xs text-[#6E675E]">
                Cả lớp cùng đóng góp nông sản hoàn thành đơn hàng tuần này (Hạn: {coopTrain.deadline || 'Chủ Nhật'})
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

        {/* Train Visual Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#4A5D4E] to-[#3D4E41] text-white space-y-2 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-200">Đơn hàng tuần của Cô Oanh:</span>
            <span className="text-[11px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
              Hạn: {coopTrain.deadline}
            </span>
          </div>
          <div className="text-sm font-extrabold flex items-center gap-2">
            <span>🚂 Đoàn tàu xuất khẩu nông sản học thuật</span>
          </div>
          <p className="text-[11px] text-emerald-100/90 leading-relaxed">
            {coopTrain.rewardText || 'Nhận 200 Bút Vàng và huy hiệu thi đua khi cả lớp hoàn thành chuyến tàu!'}
          </p>
        </div>

        {/* Requirements List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#5A524A] uppercase tracking-wider">
            Các toa hàng cần nạp nông sản:
          </div>

          {Object.entries(requirements).map(([key, data]) => {
            const info = ITEM_NAMES[key] || { name: key, icon: '📦' };
            const myStock = barnInventory[key] || 0;
            const progressPct = Math.min(100, Math.round((data.current / data.target) * 100));
            const isCompleted = data.current >= data.target;

            return (
              <div 
                key={key}
                className="p-3.5 rounded-2xl bg-white border border-[#DDD6CB] shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#DDD6CB] flex items-center justify-center text-xl shrink-0">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#2B2826] truncate">
                      {info.name}
                    </div>
                    <div className="text-[11px] text-[#8E867B] flex items-center gap-2">
                      <span>Lớp đã gom: <strong className="text-[#4A5D4E]">{data.current}/{data.target}</strong></span>
                      <span>•</span>
                      <span>Bạn có: <strong className="text-amber-800">{myStock}</strong></span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-32 sm:w-44 h-1.5 bg-[#EFECE5] rounded-full overflow-hidden mt-1.5">
                      <div 
                        className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-[#4A5D4E]'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleContributeItem(key)}
                  disabled={myStock < 1 || isCompleted}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : myStock >= 1
                      ? 'bg-[#4A5D4E] hover:bg-[#3D4E41] text-white shadow-sm cursor-pointer active:scale-95'
                      : 'bg-[#EFECE5] text-[#8E867B] cursor-not-allowed opacity-60'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đầy toa</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi 1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
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
