// src/components/reading/SpeedScanSprint.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Zap, 
  Target, 
  Clock, 
  Flame, 
  Award, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSpeedScanTargetsForPassage } from '../../data/readingEnhancements';

export default function SpeedScanSprint({
  passage,
  onComplete,
  onSwitchMode
}) {
  const targets = useMemo(() => {
    return getSpeedScanTargetsForPassage(passage);
  }, [passage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(20);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [revealedHint, setRevealedHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [targetFoundState, setTargetFoundState] = useState(null); // 'found' | 'timeout' | null
  const [lastClickedWord, setLastClickedWord] = useState(null);

  const currentTarget = targets[currentIndex] || targets[0];

  // Reset per target
  useEffect(() => {
    setTimerSeconds(20);
    setRevealedHint(false);
    setTargetFoundState(null);
    setLastClickedWord(null);
  }, [currentIndex]);

  // Countdown timer
  useEffect(() => {
    if (isCompleted || targetFoundState === 'found') return;

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeTaken(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, targetFoundState, isCompleted]);

  const handleTimeOut = () => {
    setTargetFoundState('timeout');
    setStreak(0);
  };

  const handleWordClick = (wordText, paragraphId) => {
    if (targetFoundState === 'found' || isCompleted) return;

    const cleanWord = wordText.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const cleanTarget = currentTarget?.keyword?.replace(/[^a-z0-9]/gi, '').toLowerCase();

    setLastClickedWord(wordText);

    // Check match (allow substring match if multi-word target like "11 centimetres" or "Hudson Bay")
    const isMatch = cleanWord === cleanTarget || 
      (cleanTarget.includes(cleanWord) && cleanWord.length >= 3) ||
      (cleanWord.includes(cleanTarget) && cleanTarget.length >= 3);

    if (isMatch) {
      // Correct!
      const timeBonus = timerSeconds * 15;
      const streakBonus = streak * 25;
      const roundScore = 100 + timeBonus + streakBonus;

      setScore(prev => prev + roundScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setTargetFoundState('found');

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      // Auto advance after 1.2s
      setTimeout(() => {
        if (currentIndex + 1 < targets.length) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
          try {
            confetti({
              particleCount: 80,
              spread: 90,
              origin: { y: 0.5 }
            });
          } catch (e) {}
        }
      }, 1200);

    } else {
      // Wrong word: Penalty 2s
      setTimerSeconds(prev => Math.max(1, prev - 2));
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTotalTimeTaken(0);
    setIsCompleted(false);
    setTargetFoundState(null);
  };

  if (!targets || targets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#E6E2D8]">
        <Eye className="w-12 h-12 text-[#7A7369] mb-3" />
        <h3 className="text-base font-bold text-[#24211E]">Không tìm thấy mục tiêu Scan cho bài này</h3>
        <p className="text-xs text-[#7A7369] mt-1">Vui lòng chọn bài đọc khác.</p>
      </div>
    );
  }

  // Summary screen
  if (isCompleted) {
    const avgSeconds = (totalTimeTaken / targets.length).toFixed(1);
    let reflexRank = "🦅 Mắt Đại Bàng (Eagle Eye - Band 8.5+)";
    if (avgSeconds > 12) reflexRank = "📖 Cần Tăng Tốc Độ Quét Mắt";
    else if (avgSeconds > 8) reflexRank = "🎯 Thợ Quét Vững Vàng (Band 6.5 - 7.0)";
    else if (avgSeconds > 5) reflexRank = "⚡ Quét Thủ Thần Tốc (Band 7.5 - 8.0)";

    return (
      <div className="bg-white border border-[#E6E2D8] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm text-center animate-in fade-in-50">
        <div className="w-16 h-16 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Zap className="w-8 h-8 text-amber-600" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A67C52] bg-[#FAF5EE] px-3 py-1 rounded-full border border-[#E6E2D8]">
          Hoàn Thành Thử Thách Quét Mắt
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#24211E] mt-3">
          Chúc mừng! Bạn đã hoàn thành Speed-Scanning Sprint
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7369] mt-1">
          {passage.title}
        </p>

        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Điểm Phản Xạ</div>
            <div className="text-2xl font-bold font-mono text-[#3E4F42] mt-0.5">{score}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Tốc độ trung bình</div>
            <div className="text-2xl font-bold font-mono text-[#A67C52] mt-0.5">{avgSeconds}s / từ</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
            <div className="text-[11px] text-[#7A7369]">Danh Hiệu</div>
            <div className="text-xs font-bold text-[#3E4F42] mt-2 line-clamp-1">{reflexRank}</div>
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
            <span>Về bài đọc</span>
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
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#24211E]">
                Speed-Scanning Thần Tốc (Visual Search Sprint)
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]">
                Mục tiêu {currentIndex + 1}/{targets.length}
              </span>
            </div>
            <p className="text-[11px] text-[#7A7369]">
              Quét nhanh mắt trên bài đọc và click trực tiếp vào từ khóa mục tiêu trước khi hết giờ!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] text-xs font-bold text-[#A67C52]">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Streak: {streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-xs font-bold text-[#3E4F42] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* 2. Target Radar Box */}
      <div className="p-3 sm:p-4 bg-white border-b border-[#E6E2D8]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          
          {/* Target display */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>MỤC TIÊU CẦN TÌM ({currentTarget?.categoryName}):</span>
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-[#3E4F42] bg-[#FAF8F5] px-3.5 py-1 rounded-xl border border-[#D1DDD3] inline-block mt-1">
                "{currentTarget?.keyword}"
              </div>
            </div>
          </div>

          {/* Timer & Hint button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRevealedHint(true);
                setTimerSeconds(prev => Math.max(1, prev - 3)); // penalty 3s for hint
              }}
              disabled={revealedHint}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                revealedHint 
                  ? "bg-amber-50 border-amber-300 text-amber-900" 
                  : "bg-white border-[#E6E2D8] text-[#7A7369] hover:bg-[#FAF8F5]"
              }`}
              title="Xem gợi ý vị trí đoạn văn (-3 giây)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>{revealedHint ? `Đoạn [${currentTarget?.paragraphId}]` : "Gợi ý (-3s)"}</span>
            </button>

            {/* Countdown Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
              timerSeconds <= 5 
                ? "bg-red-50 text-red-700 border-red-300 animate-pulse" 
                : "bg-[#FAF8F5] text-[#24211E] border-[#E6E2D8]"
            }`}>
              <Clock className="w-4 h-4 text-[#A67C52]" />
              <span>{timerSeconds}s</span>
            </div>
          </div>

        </div>

        {/* Status banner */}
        {targetFoundState === 'found' && (
          <div className="max-w-4xl mx-auto mt-2.5 p-2 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3] text-xs font-bold text-[#3E4F42] flex items-center gap-2 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>XUẤT SẮC! Đã tìm thấy "{currentTarget?.keyword}" ở đoạn [{currentTarget?.paragraphId}]! Chuẩn bị sang mục tiêu tiếp theo...</span>
          </div>
        )}

        {targetFoundState === 'timeout' && (
          <div className="max-w-4xl mx-auto mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2 animate-in fade-in-50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Hết giờ! Từ "{currentTarget?.keyword}" nằm ở đoạn [{currentTarget?.paragraphId}].</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (currentIndex + 1 < targets.length) setCurrentIndex(prev => prev + 1);
                else setIsCompleted(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#3E4F42] text-white text-[11px] font-bold cursor-pointer"
            >
              Tiếp tục ➔
            </button>
          </div>
        )}
      </div>

      {/* 3. Interactive Reading Passage Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          
          <div className="text-xs text-[#7A7369] font-medium flex items-center justify-between pb-1">
            <span>👇 Quét mắt và click vào từ "{currentTarget?.keyword}":</span>
            <span className="text-[11px] text-[#A67C52] font-mono">Nhấn sai từ sẽ bị trừ 2 giây</span>
          </div>

          {passage?.paragraphs?.map((p) => {
            const isHintedParagraph = revealedHint && p.id === currentTarget?.paragraphId;
            // Tokenize words
            const tokens = p.text.split(/(\s+|[.,;!?"()]+)/);

            return (
              <div
                key={p.id}
                className={`p-3.5 sm:p-4 rounded-xl border bg-white transition-all relative ${
                  isHintedParagraph 
                    ? "border-amber-300 ring-2 ring-amber-200 bg-amber-50/20" 
                    : "border-[#E6E2D8]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    {p.id}
                  </span>
                  
                  <div className="flex-1 font-serif text-xs sm:text-sm text-[#24211E] leading-relaxed">
                    {tokens.map((token, idx) => {
                      const isWhitespaceOrPunct = /^[\s.,;!?"()]+$/.test(token) || token.trim() === '';
                      if (isWhitespaceOrPunct) {
                        return <span key={idx}>{token}</span>;
                      }

                      const clean = token.replace(/[^a-z0-9]/gi, '').toLowerCase();
                      const targetClean = currentTarget?.keyword?.replace(/[^a-z0-9]/gi, '').toLowerCase();
                      const isFoundWord = targetFoundState === 'found' && (clean === targetClean || targetClean.includes(clean));

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleWordClick(token, p.id)}
                          className={`font-serif rounded px-0.5 py-0.2 mx-0.2 inline-block transition cursor-pointer text-left ${
                            isFoundWord
                              ? "bg-emerald-500 text-white font-bold scale-110 shadow-xs"
                              : "hover:bg-amber-100/70 hover:text-amber-900 active:scale-95"
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
