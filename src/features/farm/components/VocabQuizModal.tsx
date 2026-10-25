// src/features/farm/components/VocabQuizModal.tsx
// Vocabulary Fill-in-the-Blank Quiz Modal with Review & Explanation State Machine

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  Zap, 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import type { VocabQuiz } from '../types';
import rawQuizData from '../data/vocabQuizzes.json';

interface VocabQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VocabQuizModal({ isOpen, onClose }: VocabQuizModalProps) {
  const recordQuizResult = useGameStore((state) => state.recordQuizResult);
  const resetMasteredQuizzes = useGameStore((state) => state.resetMasteredQuizzes);
  const masteredQuizIds = useGameStore((state) => state.masteredQuizIds || []);

  const allQuizzes: VocabQuiz[] = rawQuizData as VocabQuiz[];

  // Filter available quizzes that haven't been mastered yet
  const availableQuizzes = useMemo(() => {
    const masteredSet = new Set(masteredQuizIds);
    return allQuizzes.filter((q) => !masteredSet.has(q.id));
  }, [allQuizzes, masteredQuizIds]);

  // Modal State Machine: 'answering' | 'reviewed'
  const [modalState, setModalState] = useState<'answering' | 'reviewed'>('answering');
  const [currentQuiz, setCurrentQuiz] = useState<VocabQuiz | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Pick a fresh random question from available pool
  const pickNextQuiz = useCallback(() => {
    if (availableQuizzes.length === 0) {
      setCurrentQuiz(null);
      setShuffledOptions([]);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
    const chosen = availableQuizzes[randomIndex];
    setCurrentQuiz(chosen);
    setShuffledOptions([...chosen.options].sort(() => 0.5 - Math.random()));
    setSelectedAnswer(null);
    setIsCorrect(false);
    setModalState('answering');
  }, [availableQuizzes]);

  // Reset modal on open
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      pickNextQuiz();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, pickNextQuiz]);

  // Handle player answer selection
  const handleSelectOption = useCallback((option: string) => {
    if (modalState !== 'answering' || !currentQuiz) return;

    setSelectedAnswer(option);
    const correct = option.toLowerCase() === currentQuiz.targetWord.toLowerCase();
    setIsCorrect(correct);
    setModalState('reviewed');

    // Record result in Zustand & Cloud sync
    recordQuizResult(currentQuiz.id, correct, currentQuiz.energyReward, currentQuiz.xpReward);
  }, [modalState, currentQuiz, recordQuizResult]);

  // Reset mastered list and start over
  const handleResetMastered = () => {
    resetMasteredQuizzes();
    // After store updates, picking next will use full pool
    setTimeout(() => {
      const firstRandom = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
      setCurrentQuiz(firstRandom);
      setShuffledOptions([...firstRandom.options].sort(() => 0.5 - Math.random()));
      setSelectedAnswer(null);
      setIsCorrect(false);
      setModalState('answering');
    }, 50);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc to exit anytime
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // In answering state: 1, 2, 3, 4 selects options
      if (modalState === 'answering') {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= shuffledOptions.length) {
          handleSelectOption(shuffledOptions[num - 1]);
        }
      } 
      // In reviewed state: Enter or Space advances to next question
      else if (modalState === 'reviewed') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pickNextQuiz();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, modalState, shuffledOptions, handleSelectOption, pickNextQuiz, onClose]);

  if (!isOpen) return null;

  const totalQuestions = allQuizzes.length;
  const masteredCount = Math.min(masteredQuizIds.length, totalQuestions);

  // Screen when all quizzes have been mastered
  if (availableQuizzes.length === 0 && !currentQuiz) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
        <div 
          className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center gap-5 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Trophy className="w-9 h-9 fill-amber-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
              Chúc Mừng!
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mastered All
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Bạn đã thông thạo toàn bộ <strong className="text-amber-300">{totalQuestions}/{totalQuestions}</strong> câu hỏi từ vựng nông trại!
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={handleResetMastered}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Luyện Tập Lại Từ Đầu
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Rời Đi (Esc)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuiz) return null;

  // Split sentence at blank `_____` to render highlighted input bracket
  const sentenceParts = currentQuiz.sentence.split('_____');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-24 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Khu Nghỉ Chân Tri Thức
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Rest Sanctuary
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Đã thành thạo: {masteredCount}/{totalQuestions} từ
                </span>
                <span>•</span>
                <span>Còn lại: {availableQuizzes.length} câu</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fill-in-the-Blank Sentence Card */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 sm:p-5 relative z-10 shadow-inner flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Điền từ vào chỗ trống:
            </span>
            <span className="text-slate-400 lowercase font-mono">
              +35 Energy • +25 XP
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-slate-200">
            {sentenceParts[0]}
            <span className={`inline-block px-2.5 py-0.5 mx-1 font-bold rounded-lg border transition-all ${
              modalState === 'answering'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm animate-pulse'
                : isCorrect
                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 scale-105'
                : 'bg-rose-500/30 border-rose-400 text-rose-300'
            }`}>
              {modalState === 'reviewed' ? selectedAnswer : '[ _____ ]'}
            </span>
            {sentenceParts[1]}
          </p>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-2.5 relative z-10">
          {shuffledOptions.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isTarget = opt.toLowerCase() === currentQuiz.targetWord.toLowerCase();

            let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:border-slate-500';

            if (modalState === 'reviewed') {
              if (isSelected && isCorrect) {
                btnStyle = 'bg-emerald-600/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-600/40 border-rose-500 text-rose-200 animate-shake';
              } else if (!isCorrect && isTarget) {
                btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 border-dashed ring-1 ring-emerald-500/40';
              } else {
                btnStyle = 'bg-slate-800/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                disabled={modalState !== 'answering'}
                onClick={() => handleSelectOption(opt)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm ${
                  modalState === 'answering' ? 'cursor-pointer active:scale-98' : 'cursor-default'
                } ${btnStyle}`}
              >
                <span className="capitalize">{opt}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50 text-slate-400 shrink-0 font-mono">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            STATE: REVIEWED - EXPANDED EXPLANATION PANEL & ACTION BUTTONS
            Modal stays open so the player can absorb the definition, context, and usage!
            ========================================================================= */}
        {modalState === 'reviewed' && (
          <div className="relative z-10 animate-fade-in flex flex-col gap-3 pt-1 border-t border-slate-800/80">
            {/* Answer Status & Reward Header */}
            {isCorrect ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chính xác! (Correct Answer)</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <span className="flex items-center gap-0.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> +{currentQuiz.energyReward}
                  </span>
                  <span className="flex items-center gap-0.5 text-yellow-300">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> +{currentQuiz.xpReward} XP
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Chưa chính xác! Đáp án đúng: <strong className="text-emerald-300 underline underline-offset-2 capitalize">{currentQuiz.targetWord}</strong></span>
                </div>
                <span className="text-[11px] text-slate-400 italic">Không trừ thể lực</span>
              </div>
            )}

            {/* Detailed Explanation Section */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col gap-2 text-xs sm:text-sm leading-relaxed shadow-sm">
              <div className="font-bold text-amber-300 flex items-center justify-between border-b border-slate-700/60 pb-1">
                <span className="flex items-center gap-1.5 capitalize">
                  📖 {currentQuiz.targetWord}
                </span>
                {currentQuiz.partOfSpeech && (
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 border border-cyan-800/50">
                    {currentQuiz.partOfSpeech}
                  </span>
                )}
              </div>

              <p className="text-slate-200">
                <strong>Ý nghĩa:</strong> {currentQuiz.definition}
              </p>

              {currentQuiz.contextUsage && (
                <p className="text-slate-300 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                  <strong className="text-amber-200">Ngữ cảnh:</strong> {currentQuiz.contextUsage}
                </p>
              )}
            </div>

            {/* Action Buttons: Next Question & Exit */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Rời Đi (Esc)
              </button>

              <button
                onClick={pickNextQuiz}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                <span>Câu Tiếp Theo</span>
                <span className="text-[11px] font-mono opacity-80">[Enter / Space]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer info when in answering state */}
        {modalState === 'answering' && (
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-2.5 relative z-10">
            <span>Phím tắt: [1-4] chọn đáp án</span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Rời Đi [Esc]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
