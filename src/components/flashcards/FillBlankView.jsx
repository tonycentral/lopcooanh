import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  Lightbulb,
  BookOpen 
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
    
    // Replace word case-insensitively
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
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Điền Từ Vào Câu IELTS Chuẩn Band
        </span>
        <p className="text-xs text-slate-400">
          Chọn từ vựng học thuật thích hợp nhất để hoàn thành câu dưới đây:
        </p>
      </div>

      {/* Sentence Cloze Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-xl space-y-4">
        
        <div className="text-base sm:text-lg text-slate-100 font-serif leading-relaxed">
          <span>"{clozeParts.before}</span>
          
          {/* Missing slot */}
          <span className={`inline-flex items-center justify-center min-w-[120px] px-3 py-1 mx-1.5 rounded-xl border font-sans font-bold text-sm sm:text-base transition-all ${
            selectedWord
              ? isAnswered
                ? isCorrect
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40"
                  : "bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 animate-shake"
                : "bg-blue-950/90 border-blue-500 text-blue-200 shadow-md shadow-blue-950/50"
              : "bg-slate-800/80 border-dashed border-slate-600 text-slate-400"
          }`}>
            {selectedWord || "____ ? ____"}
          </span>

          <span>{clozeParts.after}"</span>
        </div>

        {/* Vietnamese Hint / Translation */}
        {card.vietnameseSentence && (
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Dịch nghĩa: </span>
            {card.vietnameseSentence}
          </div>
        )}

      </div>

      {/* Word Chips Bank: Interactive Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 text-center">
          Ngân hàng từ vựng:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {chips.map((chip, idx) => {
            const isSelected = selectedWord === chip;

            return (
              <button
                key={idx}
                onClick={() => handleSelectChip(chip)}
                disabled={isAnswered}
                className={`px-4 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm transition cursor-pointer select-none active:scale-95 shadow-md ${
                  isSelected
                    ? "bg-blue-600 border-blue-400 text-white shadow-blue-900/40 scale-105"
                    : "bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500"
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
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-900/30 transition disabled:opacity-40 cursor-pointer active:scale-95"
          >
            Kiểm Tra Đáp Án
          </button>
        </div>
      ) : (
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-200 ${
          isCorrect
            ? "bg-emerald-950/60 border-emerald-500/50 shadow-lg shadow-emerald-950/30"
            : "bg-rose-950/60 border-rose-500/50 shadow-lg shadow-rose-950/30"
        }`}>
          <div className="flex items-center gap-3 text-left">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}>
              {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h4 className={`font-black text-sm sm:text-base ${
                isCorrect ? "text-emerald-300" : "text-rose-300"
              }`}>
                {isCorrect ? "Chính xác! Hoàn thành câu tuyệt hảo (+10 XP)" : "Chưa chính xác (-1 tim)"}
              </h4>
              <p className="text-xs text-slate-300">
                Từ đúng: <strong className="text-white">{card.word}</strong> ({card.partOfSpeech}) - {card.meaning}
              </p>
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
      )}

    </div>
  );
}
