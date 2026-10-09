import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight
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

    const correctMeaning = card.meaning;
    
    const otherMeanings = allCards
      .filter(c => c.id !== card.id && c.meaning !== correctMeaning)
      .map(c => c.meaning);

    const shuffledOthers = [...otherMeanings].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [correctMeaning, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return combined;
  }, [card?.id, allCards]);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (card?.word && soundEnabled) {
      speakWord(card.word);
    }
  }, [card?.id, soundEnabled]);

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
      <div className="text-center space-y-2">
        <span className="text-xs font-medium uppercase px-3 py-1 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
          Trắc nghiệm phản xạ • Chọn nghĩa đúng
        </span>

        {/* Word Display with Speaker */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#24211E] tracking-wide">
            {card.word}
          </h2>
          <button
            onClick={() => speakWord(card.word)}
            className="p-2 rounded-2xl bg-[#EDF3EE] hover:bg-[#3E4F42] text-[#3E4F42] hover:text-white border border-[#3E4F42]/20 transition transform hover:scale-105 cursor-pointer shadow-xs"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#7A7369] font-mono">
          <span>{card.ipa}</span>
          <span>•</span>
          <span className="italic">({card.partOfSpeech})</span>
        </div>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 py-2">
        {options.map((opt, idx) => {
          let btnStyle = "bg-white hover:bg-[#F4EFEA] border-[#E6E2D8] text-[#24211E] shadow-xs";
          
          if (isAnswered) {
            if (opt === card.meaning) {
              btnStyle = "bg-[#EDF3EE] border-[#3E4F42] text-[#3E4F42] font-semibold";
            } else if (opt === selectedOption) {
              btnStyle = "bg-[#FAF5EE] border-[#A67C52] text-[#A67C52] font-semibold";
            } else {
              btnStyle = "bg-[#FAF8F5] border-[#E6E2D8] text-[#7A7369] opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer select-none ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#F4EFEA] border border-[#E6E2D8] flex items-center justify-center text-xs font-mono font-medium text-[#7A7369] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>

              {isAnswered && opt === card.meaning && (
                <CheckCircle2 className="w-5 h-5 text-[#3E4F42] shrink-0" />
              )}
              {isAnswered && opt === selectedOption && opt !== card.meaning && (
                <XCircle className="w-5 h-5 text-[#A67C52] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Result Banner */}
      {isAnswered ? (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 duration-200 ${
          isCorrect
            ? "bg-[#EDF3EE] border-[#3E4F42]/30"
            : "bg-[#FAF5EE] border-[#A67C52]/30"
        }`}>
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isCorrect ? "bg-[#3E4F42] text-white" : "bg-[#A67C52] text-white"
            }`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${
                isCorrect ? "text-[#3E4F42]" : "text-[#A67C52]"
              }`}>
                {isCorrect ? "Chính xác (+10 XP)" : "Chưa chính xác"}
              </h4>
              {!isCorrect && (
                <p className="text-xs text-[#7A7369] leading-snug">
                  Nghĩa đúng: <strong className="text-[#24211E]">{card.meaning}</strong>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isCorrect
                ? "bg-[#3E4F42] hover:bg-[#334237]"
                : "bg-[#A67C52] hover:bg-[#A67C52]"
            }`}
          >
            <span>Tiếp Tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center text-[11px] text-[#7A7369]">
          Nhấn phím <strong>1, 2, 3, 4</strong> để chọn nhanh đáp án
        </div>
      )}

    </div>
  );
}
