import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, X, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const REVIVAL_QUESTIONS = [
  {
    id: 1,
    question: 'Chọn liên từ chỉ sự tương phản (Contrast) thích hợp nhất để liên kết 2 câu trong Task 2:',
    options: [
      { text: 'Consequently, the government should take immediate action.', correct: false },
      { text: 'In contrast, renewable energy sources produce virtually zero emissions.', correct: true },
      { text: 'Furthermore, air pollution continues to deteriorate.', correct: false },
      { text: 'For instance, solar power is widely accessible.', correct: false }
    ],
    hint: 'Liên từ thể hiện sự trái ngược hoàn toàn giữa 2 luận điểm.'
  },
  {
    id: 2,
    question: 'Từ vựng nào đồng nghĩa ở cấp độ C1/C2 với cụm từ "have a negative effect on"?',
    options: [
      { text: 'make it worse', correct: false },
      { text: 'exert a detrimental impact on', correct: true },
      { text: 'give a bad result for', correct: false },
      { text: 'bring a poor consequence to', correct: false }
    ],
    hint: '"Detrimental" là tính từ học thuật Band 8.0 chỉ tác hại tiêu cực sâu sắc.'
  },
  {
    id: 3,
    question: 'Trong Task 1 miêu tả biểu đồ xu hướng, từ nào diễn tả sự "tăng vọt đột ngột"?',
    options: [
      { text: 'skyrocket / surge exponentially', correct: true },
      { text: 'fluctuate slightly', correct: false },
      { text: 'level off gradually', correct: false },
      { text: 'plummet moderately', correct: false }
    ],
    hint: '"Skyrocket" hoặc "Surge" diễn tả mức tăng cực kỳ mạnh mẽ và nhanh chóng.'
  }
];

export default function RevivalQuestModal({ isOpen, onClose, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = REVIVAL_QUESTIONS[currentIdx];

  const handleSelect = (idx, isCorrect) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < REVIVAL_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const handleFinalClaim = () => {
    if (onComplete) onComplete();
    if (onClose) onClose();
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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center text-xl font-bold border border-amber-400/40">
              🌿
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#2B2826] flex items-center gap-2">
                <span>Nhiệm Vụ Dọn Cỏ Phục Hồi Nông Trại</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 font-bold border border-amber-500/30">
                  Comeback Quest
                </span>
              </h3>
              <p className="text-xs text-[#6E675E]">
                Trả lời nhanh 3 câu hỏi để kích hoạt <strong>Gói Phân Bón x2 EXP trong 3 ngày!</strong>
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

        {!isFinished ? (
          <div className="space-y-4">
            {/* Progress counter */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#8E867B]">
              <span>Câu hỏi {currentIdx + 1} / {REVIVAL_QUESTIONS.length}</span>
              <span className="text-amber-800">Đã đúng: {correctCount}/{REVIVAL_QUESTIONS.length}</span>
            </div>

            {/* Question box */}
            <div className="p-4 rounded-2xl bg-white border border-[#DDD6CB] shadow-sm space-y-2">
              <p className="text-sm font-bold text-[#2B2826] leading-relaxed">
                {currentQ.question}
              </p>
              <p className="text-[11px] text-[#8E867B] italic">
                💡 Gợi ý: {currentQ.hint}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                let btnStyle = "bg-white hover:bg-[#F2EFE9] border-[#DDD6CB] text-[#2B2826]";

                if (isAnswered) {
                  if (opt.correct) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm";
                  } else if (isSelected && !opt.correct) {
                    btnStyle = "bg-rose-50 border-rose-500 text-rose-900";
                  } else {
                    btnStyle = "bg-white/50 border-[#DDD6CB] text-[#8E867B] opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx, opt.correct)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {isAnswered && opt.correct && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !opt.correct && (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            {isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-4 rounded-2xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>{currentIdx < REVIVAL_QUESTIONS.length - 1 ? 'Sang câu tiếp theo' : 'Hoàn thành dọn cỏ'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-3xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
              🌾
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-[#2B2826]">
                Dọn Cỏ Thành Công! Nông Trại Đã Sạch Đẹp!
              </h4>
              <p className="text-xs text-[#6E675E] max-w-sm mx-auto">
                Cỏ dại đã tan biến, các luống cây của bạn tràn đầy nhựa sống. Chào mừng bạn quay trở lại đường đua IELTS!
              </p>
            </div>

            {/* Reward Box */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Phần thưởng chào mừng trở lại:</span>
              </div>
              <ul className="text-xs text-amber-800 space-y-1">
                <li className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <strong>Gói Phân Bón x2 EXP</strong> (Có hiệu lực liên tục trong 3 ngày)
                </li>
                <li className="flex items-center gap-2">
                  <span>🪙</span>
                  <strong>+100 Bút Vàng</strong> khởi nghiệp vụ mùa mới
                </li>
                <li className="flex items-center gap-2">
                  <span>💧</span>
                  <strong>+10 Gáo Nước Thần</strong> chăm bón tức thì
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleFinalClaim}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kích Hoạt Buff x2 & Vào Nông Trại</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
