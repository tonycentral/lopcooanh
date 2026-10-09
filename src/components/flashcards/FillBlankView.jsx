import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight
} from 'lucide-react';
import { speakWord, playCorrectSound, playIncorrectSound } from '../../services/soundEffects';

export default function FillBlankView({ 
  card, 
  allCards, 
  onAnswer, 
  soundEnabled 
}) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 4 candidate chips (1 target word + 3 distractors)
  const chips = useMemo(() => {
    if (!card) return [];

    const otherWords = allCards
      .filter(c => c.id !== card.id && c.word !== card.word)
      .map(c => c.word);

    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [card.word, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [card?.id, allCards]);

  // Construct cloze sentence
  const clozeParts = useMemo(() => {
    if (!card?.modelSentence || !card?.word) return { before: '', after: '' };
    
    const regex = new RegExp(`\\b${card.word}\\b`, 'i');
    const match = card.modelSentence.match(regex);
    
    if (match) {
      const idx = match.index;
      return {
        before: card.modelSentence.slice(0, idx),
        matched: match[0],
        after: card.modelSentence.slice(idx + match[0].length)
      };
    }

    return {
      before: card.modelSentence,
      matched: card.word,
      after: ''
    };
  }, [card]);

  useEffect(() => {
    setSelectedWord(null);
    setIsAnswered(false);
  }, [card?.id]);

  const handleSelectChip = (word) => {
    if (isAnswered) return;
    setSelectedWord(word);
  };

  const handleCheck = () => {
    if (!selectedWord || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedWord.toLowerCase() === card.word.toLowerCase();

    if (isCorrect) {
      if (soundEnabled) playCorrectSound();
    } else {
      if (soundEnabled) playIncorrectSound();
    }
  };

  const handleNext = () => {
    const isCorrect = selectedWord?.toLowerCase() === card.word.toLowerCase();
    onAnswer(isCorrect);
  };

  if (!card) return null;

  const isCorrect = selectedWord?.toLowerCase() === card.word.toLowerCase();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between py-2 space-y-5">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-medium uppercase px-3 py-1 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
          Điền từ vào câu
        </span>
        <p className="text-xs text-[#7A7369]">
          Chọn từ vựng thích hợp nhất để hoàn thành câu dưới đây:
        </p>
      </div>

      {/* Sentence Cloze Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs space-y-4">
        
        <div className="text-base sm:text-lg text-[#24211E] font-serif leading-relaxed">
          <span>"{clozeParts.before}</span>
          
          {/* Missing slot */}
          <span className={`inline-flex items-center justify-center min-w-[120px] px-3 py-1 mx-1.5 rounded-xl border font-sans font-medium text-sm sm:text-base transition-all ${
            selectedWord
              ? isAnswered
                ? isCorrect
                  ? "bg-[#EDF3EE] border-[#3E4F42] text-[#3E4F42]"
                  : "bg-[#FAF5EE] border-[#A67C52] text-[#A67C52] animate-shake"
                : "bg-[#EDF3EE] border-[#3E4F42] text-[#3E4F42]"
              : "bg-white border-dashed border-[#E6E2D8] text-[#7A7369]"
          }`}>
            {selectedWord || "____ ? ____"}
          </span>

          <span>{clozeParts.after}"</span>
        </div>

        {/* Vietnamese Hint / Translation */}
        {card.vietnameseSentence && (
          <div className="pt-3 border-t border-[#E6E2D8] text-xs text-[#7A7369] leading-relaxed">
            <span className="font-semibold text-[#24211E]">Dịch nghĩa: </span>
            {card.vietnameseSentence}
          </div>
        )}

      </div>

      {/* Word Chips Bank: Interactive Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-[#7A7369] text-center">
          Ngân hàng từ vựng:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {chips.map((chip, idx) => {
            const isSelected = selectedWord === chip;

            return (
              <button
                key={idx}
                onClick={() => handleSelectChip(chip)}
                disabled={isAnswered}
                className={`px-4 py-2 rounded-xl border font-medium text-xs sm:text-sm transition cursor-pointer select-none active:scale-95 shadow-xs ${
                  isSelected
                    ? "bg-[#3E4F42] border-[#3E4F42] text-white"
                    : "bg-white hover:bg-[#F4EFEA] border-[#E6E2D8] text-[#24211E]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Check / Continue Banner */}
      {!isAnswered ? (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCheck}
            disabled={!selectedWord}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs sm:text-sm transition disabled:opacity-40 cursor-pointer active:scale-95 shadow-xs"
          >
            Kiểm Tra Đáp Án
          </button>
        </div>
      ) : (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 duration-200 ${
          isCorrect
            ? "bg-[#EDF3EE] border-[#3E4F42]/30"
            : "bg-[#FAF5EE] border-[#A67C52]/30"
        }`}>
          <div className="flex items-center gap-3 text-left">
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
              <p className="text-xs text-[#7A7369]">
                Từ đúng: <strong className="text-[#24211E]">{card.word}</strong> ({card.partOfSpeech}) - {card.meaning}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isCorrect
                ? "bg-[#3E4F42] hover:bg-[#334237]"
                : "bg-[#A67C52] hover:bg-[#A67C52]"
            }`}
          >
            <span>Tiếp Tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
