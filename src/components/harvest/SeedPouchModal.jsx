import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { CROPS_CONFIG } from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';

export default function SeedPouchModal({
  isOpen,
  onClose,
  onSelectSeed,
  userGold = 0,
  selectedPlotId = null
}) {
  if (!isOpen) return null;

  const handleChooseSeed = (cropKey) => {
    sounds.playClick();
    onSelectSeed(cropKey, selectedPlotId);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md harvest-panel p-5 text-[#3E2723] space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="font-extrabold text-base text-[#3E2723] tracking-tight">
                Túi Hạt Giống IELTS
              </h3>
              <p className="text-xs text-[#5D4037]">
                {selectedPlotId ? `Chọn loại cây để gieo vào Ô Đất #${selectedPlotId}` : 'Chọn hạt giống để mang theo'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crops Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {Object.values(CROPS_CONFIG).map(crop => {
            const canAfford = userGold >= crop.seedPrice;

            return (
              <div 
                key={crop.id}
                className="bg-white/80 hover:bg-amber-50/80 border-2 border-[#8D6E63] rounded-xl p-3 flex flex-col justify-between transition group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl filter drop-shadow">{crop.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                      🪙 {crop.seedPrice} G
                    </span>
                  </div>
                  <h4 className="font-black text-xs text-[#2B2826] mt-2 group-hover:text-amber-900">
                    {crop.name}
                  </h4>
                  <p className="text-[10px] text-[#6D4C41] mt-1 leading-snug">
                    {crop.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#D7CCC8] flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Bán: ~{crop.baseSellPrice} G
                  </span>

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleChooseSeed(crop.id)}
                    className={`px-3 py-1 text-xs rounded-lg font-bold cursor-pointer transition ${
                      canAfford
                        ? 'harvest-btn-green'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed border border-stone-400'
                    }`}
                  >
                    Gieo Ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
