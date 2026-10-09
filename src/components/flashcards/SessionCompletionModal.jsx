import React, { useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  RotateCcw, 
  PenTool, 
  Zap
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { totalCards, masteredCount, xpEarned, streak } = stats;
  const accuracy = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24211E]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl text-center p-6 sm:p-8 space-y-6 text-[#24211E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Trophy Header */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/20 flex items-center justify-center text-[#3E4F42]">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24211E] tracking-tight">
            Hoàn Thành Bài Học
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7369] mt-1">
            Bạn đã nạp thêm vốn từ vựng học thuật cho bài thi IELTS
          </p>
        </div>

        {/* Gamified Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-1">
          
          {/* XP Earned */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#A67C52] text-xs font-semibold mb-1">
              <Zap className="w-4 h-4 fill-[#A67C52]" />
              <span>EXP</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#24211E] font-mono">
              +{xpEarned}
            </div>
            <div className="text-[10px] text-[#7A7369]">Điểm kinh nghiệm</div>
          </div>

          {/* Accuracy */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#3E4F42] text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Chính xác</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#3E4F42] font-mono">
              {accuracy}%
            </div>
            <div className="text-[10px] text-[#7A7369]">{masteredCount}/{totalCards} từ thuộc</div>
          </div>

          {/* Streak */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E6E2D8] text-center shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#A67C52] text-xs font-semibold mb-1">
              <span>Chuỗi ngày</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#24211E] font-mono">
              {streak}
            </div>
            <div className="text-[10px] text-[#7A7369]">Ngày liên tiếp</div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          <button
            onClick={onRestart}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#F4EFEA] text-[#24211E] font-medium text-xs sm:text-sm border border-[#E6E2D8] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-[#7A7369]" />
            <span>Ôn Lại Vòng Này</span>
          </button>

          <button
            onClick={onGoWritingPractice}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <PenTool className="w-4 h-4" />
            <span>Luyện Viết Câu</span>
          </button>

        </div>

      </div>
    </div>
  );
}
