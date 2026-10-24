import React, { useState } from 'react';
import { X, Bug, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { defeatPlotPest } from '../../services/harvestTownService';

export default function PestChallengeModal({
  isOpen,
  onClose,
  plot,
  onPestDefeated,
  studentEmail
}) {
  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [successDefeated, setSuccessDefeated] = useState(false);

  if (!isOpen || !plot || !plot.pest) return null;

  const pest = plot.pest;

  // Challenges targeting error types
  const questions = [
    {
      prompt: 'Diệt Rệp Mạo Từ: Chọn mạo từ chuẩn xác để điền vào chỗ trống: "The government should play ______ active role in protecting the environment."',
      options: ['an (Vì active bắt đầu bằng nguyên âm)', 'a', 'the', 'zero article (không điền)'],
      correctIndex: 0,
      rule: 'Cụm Collocation chuẩn: "play an active role in something".'
    },
    {
      prompt: 'Diệt Rệp Mạo Từ: Phân biệt mạo từ xác định: "______ Internet has revolutionized global telecommunications."',
      options: ['The (Internet là thực thể duy nhất)', 'An', 'A', 'Zero article'],
      correctIndex: 0,
      rule: 'Luôn dùng "The Internet" với chữ viết hoa.'
    }
  ];

  const handleSelectOption = (idx) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const curr = questions[step];
    if (idx === curr.correctIndex) {
      sounds.playCoin();
    } else {
      sounds.playClick();
    }
  };

  const handleNext = () => {
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setAnswered(false);
      setSelectedIdx(null);
    } else {
      // Defeat pest!
      sounds.playPestSquish();
      confetti({ particleCount: 40, spread: 60 });
      setSuccessDefeated(true);
      const res = defeatPlotPest(plot.id, studentEmail);
      if (res.success && onPestDefeated) {
        onPestDefeated(res.state);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-xl max-h-[92vh] flex flex-col pixel-panel rounded-xl overflow-hidden shadow-2xl relative font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#421212] text-rose-100 px-4 sm:px-6 py-3 border-b-4 border-[#240606] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-bounce">🐛</span>
            <div>
              <h2 className="font-pixel text-base font-bold text-rose-300">
                PEST ERADICATION • DIỆT SÂU BỌ HẠI CÂY TRỒNG
              </h2>
              <p className="text-xs text-rose-200/80">
                {pest.name} — {pest.errorPattern}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#240606] text-rose-200 hover:text-white border border-[#6B1B1B] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#2D1B13] text-[#FFE8B8]">
          <div className="p-3.5 rounded-xl bg-[#3E1B1B] border border-[#6B2828] text-xs text-rose-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-300">
              <ShieldAlert className="w-4 h-4" />
              <span>Sâu bệnh đang làm nghẽn tiến độ sinh trưởng của ô đất #{plot.id} ({plot.word || 'Cây trồng'}):</span>
            </div>
            <p className="text-[11px] text-stone-300">
              Hoàn thành 2 câu hỏi khắc phục lỗi sai điển hình này để xua đuổi sâu bọ và hồi phục độ phì nhiêu (Soil Quality) cho đất!
            </p>
          </div>

          {!successDefeated ? (
            <div className="p-4 rounded-xl bg-[#3B2314] border-2 border-[#5D3A1F] space-y-3">
              <div className="text-xs text-amber-200 font-semibold leading-relaxed">
                Câu {step + 1}/{questions.length}: {questions[step].prompt}
              </div>

              <div className="space-y-2 pt-1">
                {questions[step].options.map((opt, idx) => {
                  let btnStyle = 'bg-[#24130A] hover:bg-[#3B2314] border-[#4A2B11] text-stone-200';
                  if (answered) {
                    if (idx === questions[step].correctIndex) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                    } else if (idx === selectedIdx) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-300 line-through';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={answered}
                      className={`w-full text-left p-3 rounded-lg border-2 text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {answered && idx === questions[step].correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 italic">
                    Ghi nhớ: {questions[step].rule}
                  </span>
                  <button
                    onClick={handleNext}
                    className="pixel-btn pixel-btn-green font-pixel text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <span>{step + 1 < questions.length ? 'Câu Kế Tiếp' : 'Diệt Trừ Sâu Bệnh!'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-emerald-950 border-2 border-emerald-500 text-center space-y-3">
              <div className="text-3xl">✨🌾✨</div>
              <div className="font-pixel text-base font-bold text-emerald-400">
                ĐÃ DIỆT TRỪ THÀNH CÔNG SÂU HẠI!
              </div>
              <p className="text-xs text-stone-200">
                Ô đất #{plot.id} đã trở lại trạng thái khỏe mạnh xanh tốt! Bạn nhận được +30 XP và +20 Gold phần thưởng diệt sâu.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="pixel-btn pixel-btn-gold font-pixel text-xs py-2.5 px-6"
                >
                  Trở Về Nông Trại
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
