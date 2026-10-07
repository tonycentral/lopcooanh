import React, { useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  PenTool, 
  Flame, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictorySound } from '../../services/soundEffects';

export default function SessionCompletionModal({ 
  isOpen, 
  stats, 
  onRestart, 
  onGoWritingPractice, 
  soundEnabled 
}) {
  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) playVictorySound();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { totalCards, masteredCount, xpEarned, streak } = stats;
  const accuracy = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl text-center p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Trophy Header */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Trophy className="w-12 h-12 text-slate-950" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md">
            ✓
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hoàn Thành Bài Học!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bạn đã nạp thêm vốn từ vựng học thuật xuất sắc cho bài thi IELTS
          </p>
        </div>

        {/* Gamified Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-1">
          
          {/* XP Earned */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-1">
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>EXP</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              +{xpEarned}
            </div>
            <div className="text-[10px] text-slate-400">Điểm kinh nghiệm</div>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Chính xác</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {accuracy}%
            </div>
            <div className="text-[10px] text-slate-400">{masteredCount}/{totalCards} từ thuộc</div>
          </div>

          {/* Streak */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-1">
              <Flame className="w-4 h-4 fill-rose-400" />
              <span>Streak</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
              {streak}
            </div>
            <div className="text-[10px] text-slate-400">Ngày liên tiếp</div>
          </div>

        </div>

        {/* Motivational Tip */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-300 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Bí quyết nhớ lâu:</strong> Sau khi nạp từ qua Flashcard, hãy chuyển ngay sang phần <strong>Luyện Viết Câu</strong> để áp dụng từ vựng vào ngữ cảnh thật!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          <button
            onClick={onRestart}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ôn Lại Vòng Này</span>
          </button>

          <button
            onClick={onGoWritingPractice}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Sang Luyện Viết Ngay</span>
          </button>

        </div>

      </div>
    </div>
  );
}
