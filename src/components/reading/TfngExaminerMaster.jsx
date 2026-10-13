// src/components/reading/TfngExaminerMaster.jsx
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  RotateCcw, 
  ArrowRight, 
  Lightbulb, 
  Search, 
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTfngExaminerCards } from '../../data/readingEnhancements';

export default function TfngExaminerMaster({
  passage,
  onSwitchMode
}) {
  const cards = useMemo(() => {
    return getTfngExaminerCards(passage);
  }, [passage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showReverseChallenge, setShowReverseChallenge] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleSelectChoice = (choice) => {
    if (isRevealed) return;
    setSelectedAnswer(choice);
    setIsRevealed(true);
    setAnsweredCount(prev => prev + 1);

    if (choice === currentCard?.correctAnswer) {
      setUserScore(prev => prev + 1);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
      setShowReverseChallenge(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setUserScore(0);
    setAnsweredCount(0);
    setShowReverseChallenge(false);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#E6E2D8]">
        <Scale className="w-12 h-12 text-[#7A7369] mb-3" />
        <h3 className="text-base font-bold text-[#24211E]">Bài đọc này chưa có câu hỏi True / False / Not Given</h3>
        <p className="text-xs text-[#7A7369] mt-1">Vui lòng chọn bài đọc khác hoặc làm bài ở chế độ luyện tập.</p>
      </div>
    );
  }

  // Find relevant paragraph text for context
  const relevantParagraph = passage?.paragraphs?.find(p => p.id === currentCard?.paragraphRef);

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-xs">
      
      {/* 1. Header Toolbar */}
      <div className="p-3 sm:p-4 bg-white border-b border-[#E6E2D8] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E]">
                Thử Tài Giám Khảo: Bóc Phốt TFNG (Be The Examiner)
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                Câu {currentIndex + 1}/{cards.length}
              </span>
            </div>
            <p className="text-[11px] text-[#7A7369]">
              Giải mã tư duy ra đề của giám khảo Cambridge để không bao giờ bị nhầm giữa FALSE và NOT GIVEN
            </p>
          </div>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="text-[#7A7369]">Đúng:</span>
          <span className="text-[#3E4F42] bg-[#EDF3EE] px-2 py-0.5 rounded-lg border border-[#D1DDD3]">
            {userScore} / {cards.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-lg hover:bg-[#FAF8F5] text-[#7A7369] transition cursor-pointer"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Content Split View */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 sm:p-4 overflow-y-auto">
        
        {/* Left Column: Đoạn văn tham chiếu & Câu hỏi */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {/* Statement Card */}
          <div className="p-4 rounded-xl bg-white border border-[#E6E2D8] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52] block mb-1">
              NHẬN ĐỊNH CỦA ĐỀ BÀI (STATEMENT #{currentCard.number}):
            </span>
            <div className="text-sm sm:text-base font-serif font-bold text-[#24211E] bg-[#FAF8F5] p-3 rounded-xl border border-[#E6E2D8] leading-relaxed">
              "{currentCard.statement}"
            </div>

            {/* Answer Options */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-[#7A7369] block mb-2">
                Hãy đóng vai Giám Khảo và đưa ra phán quyết:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = currentCard.correctAnswer === opt;

                  let btnStyle = "bg-[#FAF8F5] hover:bg-[#F4EFEA] border-[#E6E2D8] text-[#24211E]";
                  if (isRevealed) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs";
                    } else if (isSelected) {
                      btnStyle = "bg-red-600 text-white border-red-600 font-bold";
                    } else {
                      btnStyle = "bg-gray-100 text-gray-400 border-gray-200 opacity-60";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-[#3E4F42] text-white border-[#3E4F42] font-bold";
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectChoice(opt)}
                      disabled={isRevealed}
                      className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${btnStyle}`}
                    >
                      {isRevealed && isCorrect && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isRevealed && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Context Paragraph */}
          {relevantParagraph && (
            <div className="p-3.5 rounded-xl bg-white border border-[#E6E2D8]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6E2D8]">
                <span className="text-[11px] font-bold text-[#3E4F42] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Đoạn văn đối chiếu [Đoạn {relevantParagraph.id}]</span>
                </span>
                <span className="text-[10px] text-[#7A7369] font-mono">Trích từ bài đọc</span>
              </div>
              <p className="font-serif text-xs sm:text-sm text-[#24211E] leading-relaxed">
                {relevantParagraph.text}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Examiner's Secret Blueprint */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {isRevealed ? (
            <div className="p-4 rounded-xl bg-white border border-[#E6E2D8] shadow-sm space-y-3.5 animate-in fade-in-50">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    selectedAnswer === currentCard.correctAnswer
                      ? "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {selectedAnswer === currentCard.correctAnswer ? "✓ Phán quyết chính xác!" : "✗ Chưa chính xác!"}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#A67C52]">
                    Đáp án đúng: {currentCard.correctAnswer}
                  </span>
                </div>

                {currentIndex + 1 < cards.length && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#344237] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Câu tiếp</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Trap Type Badge */}
              <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block">
                    BẢN CHẤT DẠNG BẪY:
                  </span>
                  <span className="text-xs font-bold text-[#24211E]">
                    {currentCard.trapType}
                  </span>
                </div>
              </div>

              {/* Textual Evidence */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1 mb-1">
                  <Search className="w-3 h-3" />
                  <span>BẰNG CHỨNG TRỰC TIẾP TRONG BÀI (EVIDENCE):</span>
                </span>
                <div className="text-xs font-serif italic text-[#3E4F42] bg-[#EDF3EE]/60 p-2.5 rounded-xl border border-[#D1DDD3] leading-relaxed">
                  "{currentCard.evidenceQuote}"
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369] block mb-1">
                  MỔ XẺ LÝ DO HỌC VIÊN DỄ BỊ SAI:
                </span>
                <p className="text-xs text-[#24211E] leading-relaxed bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E6E2D8]">
                  {currentCard.explanation}
                </p>
              </div>

              {/* Cambridge Strategy Rule */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] text-amber-900 mb-0.5">Lời Khuyên Của Giám Khảo Cambridge:</strong>
                  <span>{currentCard.examinerTip}</span>
                </div>
              </div>

              {/* Reverse Challenge */}
              <div className="pt-2 border-t border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setShowReverseChallenge(prev => !prev)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#3E4F42] hover:text-[#24211E] p-2 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
                    <span>Thử thách Đảo Ngược: Cách giám khảo biến đổi câu này</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showReverseChallenge ? "rotate-90" : ""}`} />
                </button>

                {showReverseChallenge && (
                  <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#D1DDD3] text-xs text-[#24211E] leading-relaxed animate-in fade-in-50">
                    {currentCard.reverseChallenge}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-[#E6E2D8] text-[#7A7369]">
              <Scale className="w-10 h-10 text-[#A67C52] mb-3 opacity-60" />
              <h4 className="text-xs sm:text-sm font-bold text-[#24211E]">
                Hồ Sơ Bí Mật Của Giám Khảo Đang Khóa
              </h4>
              <p className="text-[11px] text-[#7A7369] mt-1 max-w-xs">
                Hãy chọn TRUE, FALSE hoặc NOT GIVEN ở cột bên trái để mở khóa hồ sơ phân tích bẫy Cambridge chi tiết!
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
