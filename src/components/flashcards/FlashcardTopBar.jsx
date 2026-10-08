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
    <div className="w-full bg-slate-900/90 border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col gap-2 shrink-0 select-none">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Thoát về không gian Luyện Viết"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center: Animated Progress Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3 h-3" />
              {activeModeTitle}
            </span>
            <span className="font-mono text-slate-300">
              {currentIndex}/{totalCards} từ
            </span>
          </div>
          <div className="w-full h-3 sm:h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-emerald-500/30"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Gamification Stats: Streak, Hearts, XP, Sound, Restart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold"
            title={`Chuỗi học tập liên tiếp: ${streak} ngày`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak}</span>
          </div>

          {/* Hearts / Lives */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold"
            title={`Số tim còn lại: ${hearts}/5`}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>{hearts}</span>
          </div>

          {/* XP Points */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold"
            title={`Tổng điểm kinh nghiệm XP: ${xp}`}
          >
            <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span className="font-mono">+{xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? "bg-slate-800 border-slate-700 text-blue-400 hover:text-blue-300"
                : "bg-slate-800/50 border-slate-700/50 text-slate-500 hover:text-slate-400"
            }`}
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Restart Session */}
          {onResetSession && (
            <button
              onClick={onResetSession}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
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
