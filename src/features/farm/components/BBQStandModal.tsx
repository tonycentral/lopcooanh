// src/features/farm/components/BBQStandModal.tsx
// Barbecue Stand Modal & English Reading Comprehension Challenge

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  UtensilsCrossed,
  Coins
} from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import type { ReadingChallenge, BBQFoodItem } from '../types';
import rawReadingData from '../data/bbqChallenges.json';

const BBQ_MENU: BBQFoodItem[] = [
  {
    id: 'bbq_skewer',
    name: 'Xiên Rau Củ Nướng Than',
    icon: '🍢',
    desc: 'Xiên ớt chuông, cà chua bi và nấm nướng thơm lừng trên than hồng.',
    requiredIngredients: [{ id: 'crop_wheat', name: 'Bông Lúa Mì', count: 1 }],
    costGold: 5
  },
  {
    id: 'bbq_corn',
    name: 'Bắp Nướng Bơ Thảo Mộc',
    icon: '🌽',
    desc: 'Bắp ngọt phết bơ tỏi và thảo mộc xì xèo dậy mùi quyến rũ.',
    requiredIngredients: [{ id: 'crop_herb', name: 'Nhánh Thảo Mộc', count: 1 }],
    costGold: 8
  },
  {
    id: 'bbq_mushroom',
    name: 'Nấm Rừng Nướng Khói Sồi',
    icon: '🍄',
    desc: 'Nấm tươi mọng nước ướp muối biển nướng trên khói gỗ sồi đậm đà.',
    requiredIngredients: [{ id: 'resource_wood', name: 'Gỗ Tự Nhiên', count: 1 }],
    costGold: 5
  },
  {
    id: 'bbq_feast',
    name: 'Đại Tiệc Nướng Thảo Điền',
    icon: '🍖',
    desc: 'Bữa tiệc tổng hợp cao cấp giúp hồi sinh lực và tâm trí sảng khoái.',
    requiredIngredients: [
      { id: 'crop_wheat', name: 'Bông Lúa Mì', count: 1 },
      { id: 'crop_herb', name: 'Nhánh Thảo Mộc', count: 1 }
    ],
    costGold: 15
  }
];

interface BBQStandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BBQStandModal({ isOpen, onClose }: BBQStandModalProps) {
  const completeQuizReward = useGameStore((state) => state.completeQuizReward);
  const orderBBQMeal = useGameStore((state) => state.orderBBQMeal);
  const gold = useGameStore((state) => state.gold);
  const hotbar = useGameStore((state) => state.hotbar);
  const inventory = useGameStore((state) => state.inventory);

  const challenges: ReadingChallenge[] = rawReadingData as ReadingChallenge[];

  // Modal Flow Step: 'menu' (Pick food) -> 'reading' (Passage & Question)
  const [step, setStep] = useState<'menu' | 'reading'>('menu');
  const [selectedFood, setSelectedFood] = useState<BBQFoodItem | null>(null);

  // Reading Challenge State
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  // Pick random challenge
  const pickRandomChallenge = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setChallengeIndex(randomIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setRewardClaimed(false);
  }, [challenges.length]);

  // Reset modal state on open
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setStep('menu');
      setSelectedFood(null);
      pickRandomChallenge();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, pickRandomChallenge]);

  const currentChallenge = challenges[challengeIndex] || challenges[0];

  // Check if player can afford item (either ingredients or gold)
  const canAfford = useCallback((food: BBQFoodItem) => {
    let hasIngredients = true;
    if (food.requiredIngredients && food.requiredIngredients.length > 0) {
      for (const req of food.requiredIngredients) {
        const inHotbar = hotbar.find((i) => i.id === req.id)?.count ?? 0;
        const inInv = inventory.find((i) => i.id === req.id)?.count ?? 0;
        if (inHotbar + inInv < req.count) {
          hasIngredients = false;
          break;
        }
      }
    }
    if (hasIngredients) return true;
    return gold >= (food.costGold ?? 0);
  }, [hotbar, inventory, gold]);

  // Start reading challenge after selecting food
  const handleSelectFood = (food: BBQFoodItem) => {
    const res = orderBBQMeal(food);
    if (res.success) {
      setSelectedFood(food);
      setStep('reading');
      pickRandomChallenge();
    }
  };

  // Answer selection in reading challenge
  const handleSelectOption = useCallback((index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentChallenge.correctIndex;
    setIsCorrect(correct);

    if (correct && !rewardClaimed) {
      setRewardClaimed(true);
      completeQuizReward(currentChallenge.energyReward, currentChallenge.xpReward);

      // Auto-close after 1.8s
      const timer = setTimeout(() => {
        onClose();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, currentChallenge, rewardClaimed, completeQuizReward, onClose]);

  // Keyboard shortcut listener (1, 2, 3, 4 for reading options, Esc to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (step === 'reading') {
        if (!isAnswered) {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= 4) {
            handleSelectOption(num - 1);
          }
        } else if (!isCorrect && (e.key === 'Enter' || e.key === ' ')) {
          pickRandomChallenge();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, isAnswered, isCorrect, handleSelectOption, onClose, pickRandomChallenge]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className="relative w-full max-w-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-24 bg-gradient-to-b from-orange-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-inner">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Quầy Nướng Nông Trại
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Rustic BBQ Stand
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'menu' 
                  ? 'Chọn món nướng thơm lừng để nạp lại Thể Lực và rèn luyện kỹ năng Đọc hiểu'
                  : `Đang thưởng thức: ${selectedFood?.icon} ${selectedFood?.name}`}
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

        {/* =========================================================================
            STEP 1: MENU MÓN NƯỚNG (BBQ MENU SELECTION)
            ========================================================================= */}
        {step === 'menu' && (
          <div className="flex flex-col gap-3 relative z-10 animate-fade-in overflow-y-auto max-h-[60vh] pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BBQ_MENU.map((food) => {
                const affordable = canAfford(food);

                return (
                  <div
                    key={food.id}
                    className="flex flex-col justify-between bg-slate-800/70 border border-slate-700/80 hover:border-orange-500/50 rounded-xl p-3.5 transition-all shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{food.icon}</span>
                        <div className="flex items-center gap-1 text-xs text-amber-300 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700">
                          <Coins className="w-3 h-3 text-amber-400" />
                          <span>{food.costGold} Gold</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-100 mt-2 text-sm sm:text-base group-hover:text-orange-300 transition-colors">
                        {food.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {food.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        {food.requiredIngredients && food.requiredIngredients.length > 0 ? (
                          <span className="text-emerald-400 font-medium">
                            Nguyên liệu: {food.requiredIngredients.map((r) => `${r.count}x ${r.name}`).join(', ')}
                          </span>
                        ) : (
                          <span>Chỉ cần Gold</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectFood(food)}
                        disabled={!affordable}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                          affordable
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white cursor-pointer active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        Thưởng thức
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: MÀN HÌNH ĐỌC HIỂU (READING COMPREHENSION CHALLENGE)
            ========================================================================= */}
        {step === 'reading' && currentChallenge && (
          <div className="flex flex-col gap-4 relative z-10 animate-fade-in overflow-y-auto max-h-[65vh] pr-1">
            {/* Reading Passage Card */}
            <div className="bg-slate-800/80 border border-slate-700/90 rounded-xl p-4 sm:p-5 shadow-inner flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400 uppercase tracking-wide border-b border-slate-700/60 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentChallenge.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400 lowercase">
                  reading challenge
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                "{currentChallenge.passage}"
              </p>

              <div className="text-xs sm:text-sm font-semibold text-amber-200 pt-1">
                ❓ {currentChallenge.question}
              </div>
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 gap-2">
              {currentChallenge.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isTarget = idx === currentChallenge.correctIndex;

                let btnStyle = 'bg-slate-800/70 hover:bg-slate-700/80 border-slate-700 text-slate-200 hover:border-slate-500';

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
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm disabled:cursor-default ${btnStyle}`}
                  >
                    <span className="flex-1 pr-2">{opt}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/50 text-slate-400 shrink-0 font-mono font-bold">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback Section */}
            {isAnswered && (
              <div className="animate-fade-in flex flex-col gap-2">
                {isCorrect ? (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs sm:text-sm">
                      <div className="font-bold text-emerald-300 flex items-center justify-between">
                        <span>Thưởng thức thơm ngon! (Delicious Feast!)</span>
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <span className="flex items-center gap-0.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> +{currentChallenge.energyReward} Thể Lực
                          </span>
                          <span className="flex items-center gap-0.5 text-yellow-300">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> +{currentChallenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-slate-300">
                        {currentChallenge.explanation}
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
                          Đáp án đúng là: <strong className="text-emerald-300 underline underline-offset-2">{currentChallenge.options[currentChallenge.correctIndex]}</strong>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {currentChallenge.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={pickRandomChallenge}
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

            {/* Footer with instruction */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-2.5">
              <span>Phím tắt: [1-4] chọn câu trả lời • [Esc] rời quầy</span>
              {isAnswered && isCorrect && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Hoàn tất <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
