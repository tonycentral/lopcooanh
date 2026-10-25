// src/features/farm/components/VocabQuizModal.tsx
// Vocabulary Fill-in-the-Blank Quiz Modal for Campfire / Rest Sanctuary

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import type { VocabQuiz } from '../types';
import rawQuizData from '../data/vocabQuizzes.json';

interface VocabQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VocabQuizModal({ isOpen, onClose }: VocabQuizModalProps) {
  const completeQuizReward = useGameStore((state) => state.completeQuizReward);
  const quizPool: VocabQuiz[] = rawQuizData as VocabQuiz[];

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  // Pick a fresh random question when opening modal
  const pickRandomQuiz = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quizPool.length);
    setCurrentQuizIndex(randomIndex);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRewardClaimed(false);
  }, [quizPool.length]);

  useEffect(() => {
    if (isOpen) {
      pickRandomQuiz();
    }
  }, [isOpen, pickRandomQuiz]);

  const currentQuiz = quizPool[currentQuizIndex] || quizPool[0];

  // Shuffled options for the current question
  const shuffledOptions = useMemo(() => {
    if (!currentQuiz?.options) return [];
    return [...currentQuiz.options].sort(() => 0.5 - Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuizIndex]);

  // Handle answer selection
  const handleSelectOption = useCallback((option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option.toLowerCase() === currentQuiz.targetWord.toLowerCase();
    setIsCorrect(correct);

    if (correct && !rewardClaimed) {
      setRewardClaimed(true);
      completeQuizReward(currentQuiz.energyReward, currentQuiz.xpReward);

      // Auto-close after 1.6s
      const timer = setTimeout(() => {
        onClose();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, currentQuiz, rewardClaimed, completeQuizReward, onClose]);

  // Keyboard shortcut listener (1, 2, 3, 4 for options; Esc to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (!isAnswered) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= shuffledOptions.length) {
          handleSelectOption(shuffledOptions[num - 1]);
        }
      } else if (!isCorrect && (e.key === 'Enter' || e.key === ' ')) {
        pickRandomQuiz();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAnswered, isCorrect, shuffledOptions, handleSelectOption, onClose, pickRandomQuiz]);

  if (!isOpen || !currentQuiz) return null;

  // Split sentence at blank `_____` to render highlighted input bracket
  const sentenceParts = currentQuiz.sentence.split('_____');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-24 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                Khu Nghỉ Chân Tri Thức
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Rest Sanctuary
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Trả lời câu hỏi từ vựng để hồi phục Thể Lực và tích lũy Điểm Kinh Nghiệm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fill-in-the-Blank Sentence Card */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 sm:p-5 relative z-10 shadow-inner flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Điền từ vào chỗ trống:</span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-slate-200">
            {sentenceParts[0]}
            <span className={`inline-block px-2.5 py-0.5 mx-1 font-bold rounded-lg border transition-all ${
              !isAnswered
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm animate-pulse'
                : isCorrect
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 scale-105'
                : 'bg-rose-500/30 border-rose-400 text-rose-300'
            }`}>
              {isAnswered ? selectedAnswer : '[ _____ ]'}
            </span>
            {sentenceParts[1]}
          </p>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 relative z-10">
          {shuffledOptions.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isTarget = opt.toLowerCase() === currentQuiz.targetWord.toLowerCase();

            let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:border-slate-500';

            if (isAnswered) {
              if (isSelected && isCorrect) {
                btnStyle = 'bg-emerald-600/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-600/40 border-rose-500 text-rose-200 animate-shake';
              } else if (!isCorrect && isTarget) {
                btnStyle = 'bg-emerald-950/40 border-emerald-600/60 text-emerald-300/80 border-dashed';
              } else {
                btnStyle = 'bg-slate-800/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left font-medium text-sm sm:text-base transition-all duration-200 shadow-sm disabled:cursor-default ${btnStyle}`}
              >
                <span className="capitalize">{opt}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50 text-slate-400 shrink-0">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <div className="relative z-10 animate-fade-in flex flex-col gap-3">
            {isCorrect ? (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-bold text-emerald-300 flex items-center justify-between">
                    <span>Chính xác! (Correct Answer)</span>
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <span className="flex items-center gap-0.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> +{currentQuiz.energyReward}
                      </span>
                      <span className="flex items-center gap-0.5 text-yellow-300">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> +{currentQuiz.xpReward} XP
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-slate-300">
                    <strong className="text-white capitalize">{currentQuiz.targetWord}:</strong> {currentQuiz.definition}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200">
                <div className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm">
                    <span className="font-bold text-rose-300">Chưa chính xác!</span>
                    <p className="mt-0.5 text-slate-300">
                      Đáp án đúng là: <strong className="text-emerald-300 underline underline-offset-2 capitalize">{currentQuiz.targetWord}</strong>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentQuiz.definition}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={pickRandomQuiz}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Thử câu khác
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer / Instructions */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3 relative z-10">
          <span>Phím tắt: [1-4] chọn đáp án • [Esc] rời đi</span>
          {isAnswered && isCorrect && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Tiếp tục <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
