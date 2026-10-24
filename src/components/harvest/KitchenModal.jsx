import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, Flame, Utensils } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { KITCHEN_RECIPES, cookCollocationDish } from '../../services/harvestTownService';

export default function KitchenModal({
  isOpen,
  onClose,
  pantryState,
  onCookCompleted,
  studentEmail
}) {
  const [selectedWordA, setSelectedWordA] = useState(null);
  const [selectedWordB, setSelectedWordB] = useState(null);
  const [cookResult, setCookResult] = useState(null);
  const [isCooking, setIsCooking] = useState(false);

  if (!isOpen) return null;

  const pantry = pantryState || [
    { word: 'profound', category: 'adj' },
    { word: 'impact', category: 'noun' },
    { word: 'heavily', category: 'adv' },
    { word: 'rely', category: 'verb' },
    { word: 'spark', category: 'verb' },
    { word: 'controversy', category: 'noun' },
    { word: 'vital', category: 'adj' },
    { word: 'role', category: 'noun' },
    { word: 'sharp', category: 'adj' },
    { word: 'upsurge', category: 'noun' }
  ];

  const handleSelectWord = (word) => {
    if (selectedWordA === word) {
      setSelectedWordA(null);
      return;
    }
    if (selectedWordB === word) {
      setSelectedWordB(null);
      return;
    }
    if (!selectedWordA) {
      setSelectedWordA(word);
    } else if (!selectedWordB) {
      setSelectedWordB(word);
    } else {
      setSelectedWordA(word);
      setSelectedWordB(null);
    }
    sounds.playClick();
    setCookResult(null);
  };

  const handleCook = () => {
    if (!selectedWordA || !selectedWordB) return;
    setIsCooking(true);
    sounds.playCook();

    setTimeout(() => {
      setIsCooking(false);
      const res = cookCollocationDish(selectedWordA, selectedWordB, studentEmail);
      setCookResult(res);
      if (res.success && !res.burned) {
        sounds.playFanfare();
        confetti({ particleCount: 50, spread: 80 });
      } else {
        sounds.playIncorrectSound();
      }
      if (onCookCompleted && res.state) {
        onCookCompleted(res.state);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-2xl max-h-[92vh] flex flex-col pixel-panel rounded-xl overflow-hidden shadow-2xl relative font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2D1A0D] text-[#FFE8B8] px-4 sm:px-6 py-3 border-b-4 border-[#140804] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍳</span>
            <div>
              <h2 className="font-pixel text-base sm:text-lg font-bold text-amber-200">
                THE KITCHEN • NHÀ BẾP COLLOCATIONS & CHUNKS
              </h2>
              <p className="text-xs text-amber-100/70">
                Kết hợp 2 từ ngữ học thuật thành món ăn thượng hạng để hồi phục Focus Points (FP)!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cooking Pot & Cauldron Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#2D1B13] text-[#FFE8B8]">
          
          <div className="p-5 rounded-xl bg-[#3B2314] border-2 border-[#5D3A1F] text-center space-y-4 shadow-inner">
            <div className="font-pixel text-xs text-amber-300 uppercase tracking-wide">
              NỒI NẤU COLLOCATIONS MA THUẬT
            </div>

            {/* Two Ingredients Slots */}
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {/* Ingredient Slot 1 */}
              <div 
                onClick={() => setSelectedWordA(null)}
                className={`w-28 sm:w-36 h-20 rounded-xl border-3 flex flex-col items-center justify-center p-2 transition cursor-pointer ${
                  selectedWordA 
                    ? 'bg-amber-900/80 border-amber-400 text-amber-100 shadow-md' 
                    : 'bg-[#24130A] border-dashed border-[#5D3A1F] text-stone-500'
                }`}
              >
                <span className="text-[10px] uppercase font-pixel tracking-wider text-amber-300">Nguyên Liệu 1</span>
                <span className="font-bold text-sm sm:text-base text-amber-200 mt-1 truncate max-w-full">
                  {selectedWordA || '(Chọn từ)'}
                </span>
              </div>

              <span className="text-2xl font-black text-amber-400">+</span>

              {/* Ingredient Slot 2 */}
              <div 
                onClick={() => setSelectedWordB(null)}
                className={`w-28 sm:w-36 h-20 rounded-xl border-3 flex flex-col items-center justify-center p-2 transition cursor-pointer ${
                  selectedWordB 
                    ? 'bg-amber-900/80 border-amber-400 text-amber-100 shadow-md' 
                    : 'bg-[#24130A] border-dashed border-[#5D3A1F] text-stone-500'
                }`}
              >
                <span className="text-[10px] uppercase font-pixel tracking-wider text-amber-300">Nguyên Liệu 2</span>
                <span className="font-bold text-sm sm:text-base text-amber-200 mt-1 truncate max-w-full">
                  {selectedWordB || '(Chọn từ)'}
                </span>
              </div>
            </div>

            {/* Cook Button */}
            <div className="pt-2">
              <button
                onClick={handleCook}
                disabled={!selectedWordA || !selectedWordB || isCooking}
                className={`pixel-btn pixel-btn-gold font-pixel text-xs py-3 px-6 shadow-lg ${
                  (!selectedWordA || !selectedWordB || isCooking) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${isCooking ? 'animate-bounce text-orange-500' : ''}`} />
                  <span>{isCooking ? 'Đang Nấu Sôi Sùng Sục...' : 'NẤU MÓN COLLOCATION'}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Result Alert */}
          {cookResult && (
            <div className={`p-4 rounded-xl border-2 space-y-2 animate-in fade-in ${
              cookResult.burned 
                ? 'bg-rose-950/80 border-rose-500 text-rose-200' 
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
            }`}>
              <div className="font-pixel text-xs font-bold flex items-center gap-2">
                {cookResult.burned ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">MÓN ĂN BỊ CHÁY KHÉT!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">MÓN ĂN HOÀNG KIM 5 SAO RA LÒ!</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-stone-200">
                {cookResult.message}
              </p>
            </div>
          )}

          {/* Pantry Words Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-amber-300">
                TỦ NGUYÊN LIỆU TỪ VỰNG (BẤM ĐỂ CHỌN 2 TỪ KẾT HỢP):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {pantry.map((item, idx) => {
                const isSelected = selectedWordA === item.word || selectedWordB === item.word;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectWord(item.word)}
                    className={`p-2.5 rounded-lg border-2 text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-[#2D1A0D] border-amber-300 font-bold shadow'
                        : 'bg-[#3B2314] hover:bg-[#5D3A1F] text-amber-100 border-[#24130A]'
                    }`}
                  >
                    <div className="font-pixel text-xs capitalize">{item.word}</div>
                    <div className="text-[10px] text-amber-300/70">{item.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Known Recipes Book Reference */}
          <div className="p-3.5 rounded-xl bg-[#24130A] border border-[#5D3A1F] text-xs space-y-2">
            <div className="font-pixel text-[11px] text-amber-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Sổ Tay Công Thức Nấu Ăn Band 7.5+ Gợi Ý:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
              {KITCHEN_RECIPES.map(rec => (
                <div key={rec.id} className="p-2 rounded bg-[#3B2314] border border-[#4A2B11] flex items-center gap-2">
                  <span className="text-lg">{rec.icon}</span>
                  <div>
                    <div className="font-bold text-amber-200">{rec.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{rec.pair.join(' + ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
