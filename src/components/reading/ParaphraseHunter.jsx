// src/components/reading/ParaphraseHunter.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getParaphraseChallengesForPassage } from '../../data/readingEnhancements';

export default function ParaphraseHunter({
  passage,
  onComplete,
  onSwitchMode
}) {
  const challenges = useMemo(() => {
    return getParaphraseChallengesForPassage(passage);
  }, [passage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedParagraphId, setSelectedParagraphId] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct' | 'incorrect' | null
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Timer state (60s countdown per challenge)
  const [timer, setTimer] = useState(60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const currentChallenge = challenges[currentIndex] || challenges[0];

  // Reset challenge state on next challenge
  useEffect(() => {
    setSelectedParagraphId(null);
    setFeedbackState(null);
    setShowHint(false);
    setTimer(60);
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (isCompleted || feedbackState === 'correct' || isTimerPaused) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, feedbackState, isCompleted, isTimerPaused]);

  const handleTimeOut = () => {
    setFeedbackState('timeout');
    setStreak(0);
  };

  const handleSelectParagraph = (paragraphId) => {
    if (feedbackState === 'correct') return;

    setSelectedParagraphId(paragraphId);

    const isMatch = paragraphId === currentChallenge?.paragraphId;

    if (isMatch) {
      // Correct!
      const timeBonus = Math.floor(timer * 1.5);
      const streakBonus = streak * 20;
      const roundScore = 100 + timeBonus + streakBonus;

      setScore(prev => prev + roundScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setFeedbackState('correct');

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Safe fallback
      }
    } else {
      // Incorrect
      setFeedbackState('incorrect');
      setStreak(0);
    }
  };

  const handleNextChallenge = () => {
    if (currentIndex + 1 < challenges.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setFeedbackState(null);
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#E6E2D8]">
        <BookOpen className="w-12 h-12 text-[#7A7369] mb-3" />
        <h3 className="text-base font-bold text-[#24211E]">Chưa có thử thách Paraphrase cho bài này</h3>
        <p className="text-xs text-[#7A7369] mt-1">Vui lòng chọn bài đọc khác hoặc quay lại chế độ luyện tập.</p>
      </div>
    );
  }

  // Completed Screen
  if (isCompleted) {
    const bandEstimate = score >= 500 ? "8.5+" : score >= 350 ? "7.5" : score >= 200 ? "6.5" : "5.5";
    return (
      <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm text-center animate-in fade-in-50">
        <div className="w-16 h-16 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF5EE] px-3 py-1 rounded-full border border-[#E6E2D8]">
          Hoàn Thành Thử Thách
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#24211E] mt-3">
          Chúc mừng! Bạn đã hoàn thành Thợ Săn Paraphrase
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7369] mt-1">
          {passage.title}
        </p>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Điểm số</div>
            <div className="text-2xl font-bold font-mono text-[#3E4F42] mt-0.5">{score}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Streak cao nhất</div>
            <div className="text-2xl font-bold font-mono text-[#A67C52] mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>{maxStreak}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Ước tính Phản xạ</div>
            <div className="text-2xl font-bold font-mono text-[#3E4F42] mt-0.5">Band {bandEstimate}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 rounded-xl border border-[#E6E2D8] bg-[#FAF8F5] hover:bg-[#F4EFEA] text-xs font-bold text-[#24211E] transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode?.('practice')}
            className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#344237] text-xs font-bold text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Về bài đọc & làm câu hỏi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl overflow-hidden shadow-xs">
      
      {/* 1. Header Toolbar */}
      <div className="p-3 sm:p-4 bg-white border-b border-[#E6E2D8] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E]">
                Thợ Săn Paraphrase (Synonym Hunter)
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]">
                Thử thách {currentIndex + 1}/{challenges.length}
              </span>
            </div>
            <p className="text-[11px] text-[#7A7369]">
              Đọc ý tưởng mục tiêu và click vào đúng Đoạn văn mang nghĩa tương đương trong bài đọc
            </p>
          </div>
        </div>

        {/* Stats: Score, Streak, Timer */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] text-xs font-bold text-[#A67C52]">
            <Flame className={`w-3.5 h-3.5 ${streak > 0 ? "fill-amber-500 text-amber-500 animate-pulse" : "text-[#7A7369]"}`} />
            <span>Streak: {streak}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-xs font-bold text-[#3E4F42] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score} pts</span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold ${
            timer <= 15 
              ? "bg-red-50 text-red-700 border-red-200 animate-pulse" 
              : "bg-white text-[#24211E] border-[#E6E2D8]"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timer}s</span>
          </div>
        </div>
      </div>

      {/* 2. Challenge Mission Card */}
      <div className="p-3 sm:p-4 bg-white border-b border-[#E6E2D8] shadow-2xs">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52] flex items-center gap-1 mb-1">
                <Target className="w-3 h-3" />
                <span>Ý TƯỞNG CẦN SĂN TÌM TRONG BÀI ĐỌC (TARGET CLUE):</span>
              </span>
              <div className="text-sm sm:text-base font-serif font-bold text-[#24211E] bg-[#FAF8F5] p-3 rounded-xl border border-[#E6E2D8] leading-relaxed">
                "{currentChallenge?.targetClue}"
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowHint(prev => !prev)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] text-[11px] font-bold text-[#7A7369] transition cursor-pointer flex items-center gap-1"
                title="Xem gợi ý nếu bị kẹt"
              >
                <HelpCircle className="w-3 h-3 text-[#A67C52]" />
                <span>{showHint ? "Ẩn gợi ý" : "Gợi ý"}</span>
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-in fade-in-50">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                💡 <strong>Gợi ý:</strong> Ý tưởng này xuất hiện ở nửa {currentChallenge?.paragraphId <= 'C' ? 'đầu' : 'sau'} của bài đọc. Hãy chú ý tìm các từ đồng nghĩa!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Split View: Passage with Interactive Paragraphs */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          
          <div className="text-xs text-[#7A7369] font-medium flex items-center justify-between pb-1">
            <span>👇 Nhấp vào Đoạn văn mà bạn cho là chứa ý diễn đạt tương đương:</span>
            <span className="text-[11px] text-[#A67C52] font-bold">5 đoạn văn [A, B, C, D, E]</span>
          </div>

          {passage?.paragraphs?.map((p) => {
            const isSelected = selectedParagraphId === p.id;
            const isCorrectTarget = p.id === currentChallenge?.paragraphId;

            let cardStyle = "bg-white hover:bg-[#FAF8F5] border-[#E6E2D8] text-[#24211E]";
            if (isSelected) {
              if (feedbackState === 'correct') {
                cardStyle = "bg-[#EDF3EE] border-[#3E4F42] shadow-sm";
              } else if (feedbackState === 'incorrect') {
                cardStyle = "bg-red-50/80 border-red-300 shadow-sm";
              }
            } else if (feedbackState === 'correct' && isCorrectTarget) {
              cardStyle = "bg-[#EDF3EE] border-[#3E4F42] ring-2 ring-[#3E4F42]/30";
            }

            return (
              <div
                key={p.id}
                onClick={() => handleSelectParagraph(p.id)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative ${cardStyle}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                    isSelected && feedbackState === 'correct'
                      ? "bg-[#3E4F42] text-white"
                      : isSelected && feedbackState === 'incorrect'
                      ? "bg-red-600 text-white"
                      : "bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]"
                  }`}>
                    {p.id}
                  </span>
                  
                  <div className="flex-1">
                    <p className="font-serif text-xs sm:text-sm text-[#24211E] leading-relaxed select-text">
                      {p.text}
                    </p>
                  </div>
                </div>

                {isSelected && feedbackState === 'correct' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-bold text-[#3E4F42] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#D1DDD3]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CHÍNH XÁC!</span>
                  </div>
                )}

                {isSelected && feedbackState === 'incorrect' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-bold text-red-600 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-red-200">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>CHƯA ĐÚNG</span>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* 4. Bottom Feedback Drawer / Next Action */}
      {feedbackState && (
        <div className={`p-3.5 sm:p-4 border-t transition-all ${
          feedbackState === 'correct' 
            ? "bg-[#EDF3EE] border-[#D1DDD3]" 
            : feedbackState === 'timeout'
            ? "bg-amber-50 border-amber-200"
            : "bg-red-50/80 border-red-200"
        }`}>
          <div className="max-w-4xl mx-auto flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm mb-1">
                {feedbackState === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[#3E4F42]">PARAPHRASE MATCH! Bạn bắt bài chuẩn xác!</span>
                  </>
                ) : feedbackState === 'timeout' ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-900">Hết giờ! Hãy xem đáp án và phân tích đối chiếu bên dưới:</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-800">Đoạn văn này chưa khớp. Hãy thử chọn lại hoặc xem đối chiếu:</span>
                  </>
                )}
              </div>

              {/* Paraphrase Breakdown Box */}
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-1.5 text-[#24211E]">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-[#A67C52] uppercase shrink-0 pt-0.5">Bằng chứng bài đọc:</span>
                  <span className="font-serif italic font-medium text-[#3E4F42]">
                    "{currentChallenge?.passageMatch}"
                  </span>
                </div>
                {currentChallenge?.distractorTrap && (
                  <div className="flex items-start gap-2 text-[11px] text-[#7A7369]">
                    <span className="font-bold text-amber-700 shrink-0">Bẫy gây nhiễu:</span>
                    <span>{currentChallenge.distractorTrap}</span>
                  </div>
                )}
                <div className="text-[11px] text-[#3E4F42] pt-0.5 border-t border-[#E6E2D8]">
                  💡 <strong>Giải thích:</strong> {currentChallenge?.explanation}
                </div>
              </div>
            </div>

            {/* Next Challenge Action */}
            <div className="flex items-center gap-2 shrink-0 self-end">
              <button
                type="button"
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#344237] text-xs font-bold text-white transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>{currentIndex + 1 < challenges.length ? "Thử thách tiếp theo" : "Xem tổng kết"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
