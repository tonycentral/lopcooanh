// src/components/reading/ReadingResultModal.jsx
import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Eye, 
  Clock, 
  Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReadingResultModal({
  isOpen,
  onClose,
  result,
  passage,
  targetBand = "7.0",
  timeSpentSeconds = 0,
  onRetakeTest,
  onNextTest
}) {
  if (!isOpen || !result) return null;

  const isTargetMet = parseFloat(result.band) >= parseFloat(targetBand);

  useEffect(() => {
    if (isTargetMet) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isTargetMet]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins} phút ${remaining < 10 ? '0' : ''}${remaining} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white border border-[#E6E2D8] rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp text-[#24211E]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#A67C52]" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#24211E]">
              Kết Quả Bài Đọc IELTS Reading
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score & Band Card */}
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D1DDD3] flex flex-col items-center text-center space-y-3">
          
          <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black shadow-md ${
            isTargetMet
              ? "bg-[#3E4F42] text-white ring-4 ring-[#EDF3EE]"
              : "bg-[#A67C52] text-white ring-4 ring-[#FAF5EE]"
          }`}>
            <span className="text-[10px] uppercase tracking-wider opacity-90">BAND</span>
            <span className="text-3xl leading-none">{result.band}</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-[#24211E]">
              {isTargetMet ? "Chúc mừng! Bạn đã đạt chuẩn Band mục tiêu" : "Hoàn thành bài đọc! Cần luyện thêm để đạt mục tiêu"}
            </h4>
            <p className="text-xs text-[#7A7369] mt-0.5">
              Đạt <strong>{result.correctCount} / {result.totalCount}</strong> câu đúng ({result.percentage}%) • Mục tiêu của bạn: Band {targetBand}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-[#E6E2D8] text-xs">
            <div className="p-2 rounded-xl bg-white border border-[#E6E2D8]">
              <span className="text-[10px] text-[#7A7369] block">Đúng:</span>
              <strong className="text-sm font-bold text-[#3E4F42]">{result.correctCount} câu</strong>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#E6E2D8]">
              <span className="text-[10px] text-[#7A7369] block">Sai / Chưa làm:</span>
              <strong className="text-sm font-bold text-[#B45309]">{result.totalCount - result.correctCount} câu</strong>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#E6E2D8]">
              <span className="text-[10px] text-[#7A7369] block">Thời gian:</span>
              <strong className="text-xs font-semibold text-[#24211E]">{formatTime(timeSpentSeconds)}</strong>
            </div>
          </div>
        </div>

        {/* Passage Info */}
        <div className="text-xs text-[#7A7369] space-y-1">
          <p>Đề thi: <strong className="text-[#24211E] font-serif">{passage?.title}</strong></p>
          <p>Dạng bài: <span>{passage?.passageType} • {passage?.difficulty}</span></p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem lại bài làm &amp; Giải thích chi tiết</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRetakeTest}
              className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại đề này</span>
            </button>

            <button
              type="button"
              onClick={onNextTest}
              className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Đề tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
