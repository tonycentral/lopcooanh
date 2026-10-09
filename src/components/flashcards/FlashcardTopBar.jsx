import React from 'react';
import { 
  X, 
  Flame, 
  Heart, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function FlashcardTopBar({ 
  currentIndex, 
  totalCards, 
  streak, 
  hearts, 
  xp, 
  soundEnabled, 
  onToggleSound, 
  onClose,
  onResetSession,
  activeModeTitle
}) {
  const progressPercent = totalCards > 0 ? Math.min(100, Math.round(((currentIndex) / totalCards) * 100)) : 0;

  return (
    <div className="w-full bg-white border-b border-[#E6E2D8] px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col gap-2 shrink-0 select-none">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer"
          title="Thoát về không gian Luyện Viết"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#7A7369] mb-1">
            <span className="flex items-center gap-1.5 text-[#3E4F42]">
              <Sparkles className="w-3 h-3" />
              {activeModeTitle}
            </span>
            <span className="font-mono text-[#24211E]">
              {currentIndex}/{totalCards} từ
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F4EFEA] rounded-full overflow-hidden p-0.5 border border-[#E6E2D8]">
            <div 
              className="h-full bg-[#3E4F42] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Gamification Stats: Streak, Hearts, XP, Sound, Restart */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#FAF5EE] border border-[#F4EFEA] text-[#A67C52] text-xs font-medium"
            title={`Chuỗi học tập liên tiếp: ${streak} ngày`}
          >
            <Flame className="w-3.5 h-3.5 fill-[#A67C52]" />
            <span>{streak}</span>
          </div>

          {/* Hearts / Lives */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] text-[#A67C52] text-xs font-medium"
            title={`Số tim còn lại: ${hearts}/5`}
          >
            <Heart className="w-3.5 h-3.5 fill-[#A67C52]" />
            <span>{hearts}</span>
          </div>

          {/* XP Points */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-[#3E4F42] text-xs font-medium"
            title={`Tổng điểm kinh nghiệm XP: ${xp}`}
          >
            <Zap className="w-3.5 h-3.5 text-[#3E4F42]" />
            <span className="font-mono">+{xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? "bg-[#EDF3EE] border-[#D1DDD3] text-[#3E4F42]"
                : "bg-white border-[#E6E2D8] text-[#7A7369]"
            }`}
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Restart Session */}
          {onResetSession && (
            <button
              onClick={onResetSession}
              className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E6E2D8] transition cursor-pointer"
              title="Bắt đầu lại bộ thẻ này"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
