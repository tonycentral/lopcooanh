// src/features/farm/components/FurnitureCraftModal.tsx
// Furniture Crafting Modal for Indoor House System

import React, { useEffect } from 'react';
import { X, Hammer, Coins } from 'lucide-react';
import { useGameStore, FURNITURE_RECIPES } from '../state/useGameStore';

interface FurnitureCraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FurnitureCraftModal({ isOpen, onClose }: FurnitureCraftModalProps) {
  const gold = useGameStore((state) => state.gold);
  const inventory = useGameStore((state) => state.inventory);
  const hotbar = useGameStore((state) => state.hotbar);
  const craftFurniture = useGameStore((state) => state.craftFurniture);

  // Close on Esc key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getItemCount = (itemId: string) => {
    const invCount = inventory
      .filter((i) => i.id === itemId)
      .reduce((acc, curr) => acc + (curr.count ?? 0), 0);
    const hotbarCount = hotbar
      .filter((i) => i.id === itemId)
      .reduce((acc, curr) => acc + (curr.count ?? 0), 0);
    return invCount + hotbarCount;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg leading-tight">Bàn Thợ Mộc (Carpentry)</h2>
              <p className="text-xs text-slate-400">Chế tạo nội thất bài trí cho ngôi nhà ấm cúng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm">
              <Coins className="w-4 h-4" />
              <span>{gold}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[60vh] space-y-3">
          {FURNITURE_RECIPES.map((recipe) => {
            const hasGold = gold >= recipe.goldCost;
            let canCraft = hasGold;

            const ingredientChecks = recipe.ingredients.map((ing) => {
              const count = getItemCount(ing.id);
              const hasEnough = count >= ing.count;
              if (!hasEnough) canCraft = false;
              return { ...ing, currentCount: count, hasEnough };
            });

            return (
              <div
                key={recipe.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {recipe.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">{recipe.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{recipe.desc}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${hasGold ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        🪙 {recipe.goldCost} Gold
                      </span>
                      {ingredientChecks.map((ing) => (
                        <span
                          key={ing.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                            ing.hasEnough
                              ? 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}
                        >
                          {ing.icon} {ing.currentCount}/{ing.count} {ing.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canCraft}
                  onClick={() => craftFurniture(recipe.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                    canCraft
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5" />
                  Chế Tạo
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer guide */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 flex items-center justify-between">
          <span>💡 Chọn nội thất trên phím 1-8 để đặt xuống sàn nhà.</span>
          <span>Click chuột phải để thu hồi</span>
        </div>
      </div>
    </div>
  );
}
