// src/components/flashcards/FlashcardTopBar.jsx
import React from 'react';
import { 
  X, 
  Flame, 
  Heart, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Shuffle,
  CheckCircle2,
  XCircle
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
  activeModeTitle,
  isRandomOrder = true,
  onToggleRandom,
  onShuffleDeck,
  masteredCount = 0,
  needsReviewCount = 0
}) {
  const progressPercent = totalCards > 0 ? Math.min(100, Math.round(((currentIndex) / totalCards) * 100)) : 0;

  return (
    <div className="w-full bg-white border-b border-[#E6E2D8] px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col gap-2 shrink-0 select-none">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Close Button & Stats Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer"
            title="Thoát về không gian Luyện Viết"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick Mastered / Needs Review Counters */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span 
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium cursor-help"
              title="Tổng số từ vựng bạn đã đánh dấu ĐÃ THUỘC"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã thuộc: <strong>{masteredCount}</strong></span>
            </span>

            {needsReviewCount > 0 && (
              <span 
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium cursor-help"
                title="Số từ bạn cần ôn lại"
              >
                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Cần ôn: <strong>{needsReviewCount}</strong></span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="flex-1 max-w-md mx-2 min-w-[180px]">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#7A7369] mb-1">
            <span className="flex items-center gap-1.5 text-[#3E4F42]">
              <Sparkles className="w-3 h-3" />
              {activeModeTitle}
            </span>
            <span className="font-mono text-[#24211E]">
              {totalCards > 0 ? `${currentIndex}/${totalCards} thẻ` : '0 thẻ'}
            </span>
          </div>
          <div className="w-full h-2 bg-[#F4EFEA] rounded-full overflow-hidden p-0.5 border border-[#E6E2D8]">
            <div 
              className="h-full bg-[#3E4F42] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Controls: Random Shuffle, Streak, Hearts, XP, Sound, Restart */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          
          {/* Toggle Thứ Tự Ngẫu Nhiên (Random Shuffle) */}
          {onToggleRandom && (
            <button
              onClick={onToggleRandom}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isRandomOrder
                  ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-2xs"
                  : "bg-white text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
              }`}
              title={isRandomOrder ? "Đang bật thứ tự ngẫu nhiên (Click để chuyển theo thứ tự)" : "Đang theo thứ tự (Click để bật ngẫu nhiên)"}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRandomOrder ? "Random" : "Tuần tự"}</span>
            </button>
          )}

          {/* Nút Trộn Lại Thẻ Ngay (Re-shuffle) */}
          {onShuffleDeck && (
            <button
              onClick={onShuffleDeck}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer shadow-2xs"
              title="Trộn ngẫu nhiên lại bộ thẻ hiện tại"
            >
              <Shuffle className="w-4 h-4 text-[#3E4F42]" />
            </button>
          )}

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
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-[#3E4F42] text-xs font-medium"
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
