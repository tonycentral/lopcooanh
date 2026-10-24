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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in font-sans select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md pixel-panel p-5 text-[#FFE8B8] space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <h3 className="font-pixel text-base text-amber-200 tracking-tight">
                TÚI HẠT GIỐNG TỪ VỰNG IELTS
              </h3>
              <p className="text-xs text-amber-100/70">
                {selectedPlotId ? `Chọn loại cây để gieo vào Ô Đất #${selectedPlotId}` : 'Chọn hạt giống để mang theo'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crops Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {Object.values(CROPS_CONFIG).map(crop => {
            const canAfford = userGold >= crop.seedPrice;

            return (
              <div 
                key={crop.id}
                className="bg-[#24130A] hover:bg-[#3B2314] border-2 border-[#5D3A1F] rounded-xl p-3 flex flex-col justify-between transition group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl filter drop-shadow group-hover:scale-110 transition">
                      {crop.icon}
                    </span>
                    <span className="font-pixel text-xs text-amber-300 font-bold">
                      🪙 {crop.seedPrice} G
                    </span>
                  </div>

                  <h4 className="font-pixel text-xs text-amber-100 group-hover:text-amber-300 transition font-bold leading-tight">
                    {crop.name}
                  </h4>
                  <p className="text-[10px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {crop.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#3B2314] flex items-center justify-between">
                  <span className="text-[9px] font-pixel text-cyan-300">
                    Bán: {crop.baseSellPrice} G
                  </span>

                  <button
                    type="button"
                    onClick={() => handleChooseSeed(crop.id)}
                    disabled={!canAfford}
                    className={`pixel-btn pixel-btn-gold font-pixel text-[10px] py-1 px-3 ${
                      !canAfford ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    Gieo Hạt
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
