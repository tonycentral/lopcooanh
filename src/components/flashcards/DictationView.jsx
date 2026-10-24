// src/components/flashcards/DictationView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Volume2, 
  Volume1, 
  Send, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { speakWord, playCorrectSound, playIncorrectSound } from '../../services/soundEffects';
import { speakSentence } from '../../services/speechService';

export default function DictationView({ 
  card, 
  onAnswer, 
  soundEnabled = true 
}) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showMeaningHint, setShowMeaningHint] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const inputRef = useRef(null);

  const targetWord = (card?.word || '').trim();

  // Reset when card changes & auto-play pronunciation once
  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowMeaningHint(false);
    setPlayCount(0);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Auto-play audio when opening card
    const timer = setTimeout(() => {
      handlePlayAudio(1.0);
    }, 300);

    return () => clearTimeout(timer);
  }, [card?.id, card?.word]);

  if (!card) return null;

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  const handlePlayAudio = (rate = 0.9) => {
    setPlayCount(prev => prev + 1);
    speakSentence(targetWord, rate, 'en-US');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isSubmitted) return;

    const correct = normalize(userInput) === normalize(targetWord);
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      if (soundEnabled) playCorrectSound();
      speakWord(targetWord);
    } else {
      if (soundEnabled) playIncorrectSound();
    }
  };

  const handleNext = () => {
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isSubmitted) {
        handleSubmit(e);
      } else {
        handleNext();
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-text">
      
      <div className="w-full bg-white border border-[#E6E2D8] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E6E2D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
              <Headphones className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Chế độ Chép Chính Tả (Dictation Mode)
              </span>
              <h4 className="text-xs text-[#7A7369]">Nghe phát âm chuẩn bản xứ và chép lại đúng chính tả</h4>
            </div>
          </div>

          <span className="text-[11px] font-mono font-medium text-[#7A7369]">
            Đã nghe: {playCount} lần
          </span>
        </div>

        {/* Audio Player Action Center */}
        <div className="py-4 flex flex-col items-center justify-center gap-3 bg-[#FAF8F5] rounded-2xl border border-[#E6E2D8]">
          <div className="flex items-center gap-3">
            {/* Play Normal Speed */}
            <button
              type="button"
              onClick={() => handlePlayAudio(1.0)}
              className="px-5 py-3 rounded-2xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer"
              title="Phát âm tốc độ bình thường (1.0x)"
            >
              <Volume2 className="w-5 h-5" />
              <span>Nghe Tốc Độ Chuẩn (1.0x)</span>
            </button>

            {/* Play Slow Speed */}
            <button
              type="button"
              onClick={() => handlePlayAudio(0.75)}
              className="px-3.5 py-3 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] font-medium text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              title="Phát âm tốc độ chậm (0.75x)"
            >
              <Volume1 className="w-4 h-4 text-[#A67C52]" />
              <span>Nghe Chậm (0.75x)</span>
            </button>
          </div>

          <p className="text-[11px] text-[#7A7369] italic">
            Bấm nút loa để nghe lại nếu chưa nghe rõ
          </p>
        </div>

        {/* Optional Hint Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowMeaningHint(prev => !prev)}
            className="text-xs text-[#A67C52] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            {showMeaningHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showMeaningHint ? "Ẩn nghĩa gợi ý" : "Xem nghĩa gợi ý tiếng Việt"}</span>
          </button>

          {showMeaningHint && (
            <div className="mt-2 p-3 rounded-xl bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] text-xs font-medium animate-fadeIn">
              <strong>Nghĩa:</strong> {card.meaning} {card.partOfSpeech && `(${card.partOfSpeech})`}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitted && isCorrect}
            placeholder="Chép lại từ/cụm từ bạn nghe được..."
            className={`w-full px-4 py-3.5 rounded-2xl border-2 text-sm sm:text-base font-medium outline-none transition ${
              isSubmitted
                ? isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-rose-400 bg-rose-50 text-rose-900"
                : "border-[#E6E2D8] bg-[#FAF8F5] focus:border-[#3E4F42] focus:bg-white text-[#24211E]"
            }`}
          />

          {!isSubmitted ? (
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Kiểm tra chính tả</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
              isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className={`font-bold text-sm ${isCorrect ? "text-emerald-800" : "text-rose-800"}`}>
                    {isCorrect ? "Chính tả chuẩn xác 100%! (+15 XP)" : "Chính tả chưa khớp!"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAudio(1.0)}
                  className="p-1.5 rounded-xl bg-white border border-[#E6E2D8] text-[#3E4F42] hover:bg-[#EDF3EE] transition cursor-pointer"
                  title="Nghe lại"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Reveal answer and explanation */}
              <div className="text-xs space-y-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-base text-[#24211E] tracking-tight">{targetWord}</span>
                  {card.ipa && <span className="font-mono text-xs text-[#3E4F42] italic">{card.ipa}</span>}
                </div>
                <p className="text-[#7A7369]">{card.meaning}</p>
                {card.exampleSentence && (
                  <p className="text-[#4A453E] italic pt-1 border-t border-[#E6E2D8]/50">
                    "{card.exampleSentence}"
                  </p>
                )}
              </div>

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Tiếp tục từ sau</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>

      </div>

    </div>
  );
}
