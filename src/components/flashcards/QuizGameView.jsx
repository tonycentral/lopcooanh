import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { speakWord, playCorrectSound, playIncorrectSound } from '../../services/soundEffects';

export default function QuizGameView({ 
  card, 
  allCards, 
  onAnswer, 
  soundEnabled 
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 4 randomized options (1 correct + 3 distractors)
  const options = useMemo(() => {
    if (!card) return [];

    // Correct meaning
    const correctMeaning = card.meaning;
    
    // Pick 3 distractors from allCards
    const otherMeanings = allCards
      .filter(c => c.id !== card.id && c.meaning !== correctMeaning)
      .map(c => c.meaning);

    // Shuffle and pick 3
    const shuffledOthers = [...otherMeanings].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle
    const combined = [correctMeaning, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return combined;
  }, [card?.id, allCards]);

  // Reset state on card change
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (card?.word && soundEnabled) {
      speakWord(card.word);
    }
  }, [card?.id, soundEnabled]);

  // Keyboard shortcut listener (1, 2, 3, 4 for options, Enter for Continue)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (options[idx]) {
            handleSelect(options[idx]);
          }
        }
      } else {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, selectedOption, options]);

  const handleSelect = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === card.meaning;
    if (isCorrect) {
      if (soundEnabled) playCorrectSound();
    } else {
      if (soundEnabled) playIncorrectSound();
    }
  };

  const handleNext = () => {
    const isCorrect = selectedOption === card.meaning;
    onAnswer(isCorrect);
  };

  if (!card) return null;

  const isCorrect = selectedOption === card.meaning;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between py-2 space-y-5">
      
      {/* Top Question Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          Trắc nghiệm Duolingo • Chọn nghĩa đúng
        </span>

        {/* Word Display with Speaker */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
            {card.word}
          </h2>
          <button
            onClick={() => speakWord(card.word)}
            className="p-2 rounded-2xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition transform hover:scale-105 cursor-pointer"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
          <span>{card.ipa}</span>
          <span>•</span>
          <span className="italic">({card.partOfSpeech})</span>
        </div>
      </div>

      {/* 4 Duolingo Options Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 py-2">
        {options.map((opt, idx) => {
          let btnStyle = "bg-slate-900 hover:bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-blue-500/50 shadow-md";
          
          if (isAnswered) {
            if (opt === card.meaning) {
              // Correct option is always green
              btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 shadow-emerald-950/40";
            } else if (opt === selectedOption) {
              // Selected wrong option is red
              btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 shadow-rose-950/40 animate-shake";
            } else {
              btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer select-none ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {isAnswered && opt === card.meaning && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {isAnswered && opt === selectedOption && opt !== card.meaning && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Result Banner: Signature Duolingo Bottom Drawer */}
      {isAnswered ? (
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-200 ${
          isCorrect
            ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg shadow-emerald-950/30"
            : "bg-rose-950/60 border-rose-500/50 shadow-lg shadow-rose-950/30"
        }`}>
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}>
              {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h4 className={`font-black text-sm sm:text-base ${
                isCorrect ? "text-emerald-300" : "text-rose-300"
              }`}>
                {isCorrect ? "Tuyệt vời! Chính xác (+10 XP)" : "Chưa chính xác (-1 tim)"}
              </h4>
              {!isCorrect && (
                <p className="text-xs text-slate-300 leading-snug">
                  Nghĩa chuẩn: <strong className="text-white">{card.meaning}</strong>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isCorrect
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
            }`}
          >
            <span>Tiếp Tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-[11px] text-slate-500">
          Nhấn phím <strong>1, 2, 3, 4</strong> để chọn nhanh đáp án
        </div>
      )}

    </div>
  );
}
