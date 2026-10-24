// src/components/flashcards/WriteRecallView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Keyboard, 
  Send, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { speakWord, playCorrectSound, playIncorrectSound } from '../../services/soundEffects';

export default function WriteRecallView({ 
  card, 
  onAnswer, 
  soundEnabled = true 
}) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const inputRef = useRef(null);

  const targetWord = (card?.word || '').trim();

  // Reset state when card changes
  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setHintsRevealed(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [card?.id, card?.word]);

  if (!card) return null;

  // Clean strings for comparison
  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  // Create masked sentence example
  const maskedSentence = card.exampleSentence || card.modelSentence || '';
  const displayMaskedSentence = maskedSentence ? (
    maskedSentence.replace(new RegExp(targetWord, 'gi'), '__________')
  ) : null;

  // Handle Hint button: reveals next character
  const handleRevealHint = () => {
    if (hintsRevealed < targetWord.length) {
      setHintsRevealed(prev => prev + 1);
      const partialHint = targetWord.slice(0, hintsRevealed + 1);
      setUserInput(partialHint);
      if (inputRef.current) inputRef.current.focus();
    }
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
      
      {/* Question Card Box */}
      <div className="w-full bg-white border border-[#E6E2D8] rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Header Tag & Hint status */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E6E2D8] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center font-bold text-xs">
              <Keyboard className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">
                Chế độ Gõ từ (Write &amp; Recall)
              </span>
              <h4 className="text-xs text-[#7A7369]">Gõ chính xác từ vựng Band 8.5 dựa trên nghĩa và ngữ cảnh</h4>
            </div>
          </div>

          {card.cefrBand && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] font-mono font-bold text-xs border border-[#D1DDD3]">
              {card.cefrBand}
            </span>
          )}
        </div>

        {/* Clue Area: Vietnamese Meaning & Band 5 Equivalent */}
        <div className="space-y-3 py-1">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7369]">
              Ý nghĩa tiếng Việt:
            </span>
            <p className="text-sm sm:text-base font-bold text-[#24211E] leading-snug">
              {card.meaning}
            </p>

            {card.basicEquivalent && (
              <div className="pt-1.5 border-t border-[#E6E2D8]/60 flex items-center gap-1.5 text-xs text-[#7A7369]">
                <span className="text-[#A67C52] font-bold">Từ tương đương Band 5:</span>
                <span className="italic font-medium">{card.basicEquivalent}</span>
              </div>
            )}
          </div>

          {/* Masked Sentence Context */}
          {displayMaskedSentence && (
            <div className="p-3 rounded-2xl bg-white border border-[#E6E2D8] text-xs text-[#24211E] space-y-1">
              <span className="text-[10px] font-bold text-[#3E4F42] uppercase tracking-wider flex items-center gap-1">
                <span>📖</span> Ngữ cảnh câu học thuật:
              </span>
              <p className="italic leading-relaxed text-[#4A453E]">
                "{displayMaskedSentence}"
              </p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitted && isCorrect}
              placeholder={`Gõ từ vựng tiếng Anh (${targetWord.length} chữ cái)...`}
              className={`w-full px-4 py-3.5 pr-12 rounded-2xl border-2 text-sm sm:text-base font-medium outline-none transition ${
                isSubmitted
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-rose-400 bg-rose-50 text-rose-900"
                  : "border-[#E6E2D8] bg-[#FAF8F5] focus:border-[#3E4F42] focus:bg-white text-[#24211E]"
              }`}
            />

            {/* Hint Button inside input */}
            {!isSubmitted && (
              <button
                type="button"
                onClick={handleRevealHint}
                className="absolute right-2.5 top-2.5 p-2 rounded-xl text-[#7A7369] hover:text-[#A67C52] hover:bg-white transition cursor-pointer"
                title="Gợi ý chữ cái tiếp theo"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions & Result Notification */}
          {!isSubmitted ? (
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleRevealHint}
                className="px-3 py-1.5 rounded-xl border border-[#E6E2D8] bg-[#FAF8F5] text-xs text-[#7A7369] hover:text-[#24211E] transition flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#A67C52]" />
                <span>Gợi ý ({hintsRevealed}/{targetWord.length})</span>
              </button>

              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Kiểm tra</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Result Banner */
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
                    {isCorrect ? "Chính xác tuyệt vời! (+10 XP)" : "Chưa chính xác!"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => speakWord(targetWord)}
                  className="p-1.5 rounded-xl bg-white border border-[#E6E2D8] text-[#3E4F42] hover:bg-[#EDF3EE] transition cursor-pointer"
                  title="Phát âm từ này"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Reveal Correct Answer */}
              <div className="text-xs space-y-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-base text-[#24211E] tracking-tight">{targetWord}</span>
                  {card.ipa && <span className="font-mono text-xs text-[#3E4F42] italic">{card.ipa}</span>}
                  {card.partOfSpeech && <span className="text-[10px] text-[#7A7369] font-mono uppercase">({card.partOfSpeech})</span>}
                </div>

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
