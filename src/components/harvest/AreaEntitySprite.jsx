import React from 'react';
import HarvestTownTree from './HarvestTownTree';
import PastureAnimalPen from './PastureAnimalPen';
import PondAquaticEnclosure from './PondAquaticEnclosure';
import WorkshopMachinery from './WorkshopMachinery';
import GrammarLibraryTome from './GrammarLibraryTome';

/**
 * Authentic Graphical Sprites for All 7 IELTS Farm Areas:
 * 1. Orchard: 10 Harvest Town Tree Species (Apples, Pine, Oak, Maple, Willow, etc.)
 * 2. Pasture: 10 Dedicated Animal Enclosures with Autonomous Living Pixel Art Animals
 * 3. Pond: 10 Dedicated Aquatic Basins with Autonomous Swimming Pixel Art Fish
 * 4. Paddy: 5-Stage Terraced Golden Rice Fields with Irrigation
 * 5. Greenhouse: 5-Stage Ornate Botanical Planters with Exotic Blooms
 * 6. Workshop: 10 Steampunk Clockwork Machines with Rotating Cogwheels (Toán Tư Duy)
 * 7. Library: 10 Ancient Grammar Codices with Blinking Scholar Owl (Ngữ Pháp)
 */
export default function AreaEntitySprite({
  areaId,
  entity,
  isNearby = false
}) {
  const { level = 1, status = 'healthy', name, topicIcon, fruit } = entity;
  const isWilting = status === 'wilting';
  const isThirsty = status === 'thirsty';
  const isHealthy = status === 'healthy';

  // Scale factor based on Level 1 -> 5
  const scaleMultipliers = [0.85, 0.95, 1.05, 1.18, 1.3];
  const scale = scaleMultipliers[Math.min(4, Math.max(0, level - 1))];

  // =========================================================================
  // 1. VƯỜN CÂY (ORCHARD - READING): 10 SPECIES HARVEST TOWN TREES
  // =========================================================================
  if (areaId === 'orchard') {
    return (
      <div className="relative flex flex-col items-center justify-center select-none">
        {isNearby && (
          <div className="absolute -inset-3 rounded-full border-2 border-amber-300 bg-amber-400/20 animate-ping pointer-events-none" />
        )}
        <HarvestTownTree
          topicId={entity.topicId}
          level={level}
          status={status}
          isNearby={isNearby}
        />
      </div>
    );
  }

  // =========================================================================
  // OTHER AREAS (CHĂN NUÔI, AO HỒ, RUỘNG LÚA, NHÀ KÍNH)
  // =========================================================================
  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      
      {/* Proximity / Selection Ring */}
      {isNearby && (
        <div className="absolute -inset-2 border-2 border-[#d9911e] bg-[#d9911e]/20 animate-ping pointer-events-none" />
      )}

      {/* Health Status Alerts (Strict Retro Warm Palette) */}
      {isWilting && (
        <div className="absolute -top-4 px-2 py-0.5 border-2 border-[#45283c] bg-[#663931] text-[#e8cfa6] font-pixel text-[8px] animate-bounce z-20 shadow-md flex items-center gap-1">
          <span>🥀</span>
          <span>HÉO ÚA</span>
        </div>
      )}
      {isThirsty && (
        <div className="absolute -top-4 px-2 py-0.5 border-2 border-[#45283c] bg-[#8f563b] text-[#e8cfa6] font-pixel text-[8px] animate-bounce z-20 shadow-md flex items-center gap-1">
          <span>💧</span>
          <span>KHÁT NƯỚC</span>
        </div>
      )}

      {/* Ground Mound / Shadow Base (for paddy & greenhouse) */}
      {(areaId === 'paddy' || areaId === 'greenhouse') && (
        <div 
          className="absolute bottom-1 w-20 h-6 rounded-full bg-black/45 blur-[1px] pointer-events-none" 
          style={{ transform: `scale(${scale})` }}
        />
      )}

      {/* Real Graphic Sprite Body */}
      <div 
        className={`relative transition-transform duration-300 ${isNearby ? 'scale-105' : ''}`}
      >
        {/* =====================================================================
            AREA 2: RUỘNG LÚA (PADDY FIELD - VOCABULARY)
            ===================================================================== */}
        {areaId === 'paddy' && (
          <div className="relative w-24 h-22 flex flex-col items-center justify-end" style={{ transform: `scale(${scale})` }}>
            <svg className="w-24 h-18 overflow-visible" viewBox="0 0 96 72">
              {/* Earthen Terraced Bund (Bờ Ruộng Đất Nâu) */}
              <ellipse cx="48" cy="46" rx="46" ry="20" fill="#3E271B" stroke="#5D4037" strokeWidth="2.5" />
              <ellipse cx="48" cy="44" rx="42" ry="17" fill="#2B1810" />
              
              {/* Flooded Water Sheen */}
              {!isWilting && (
                <ellipse cx="48" cy="43" rx="36" ry="14" fill="#00838F" opacity="0.45" />
              )}

              {/* RICE STALKS BY GROWTH LEVEL */}
              {level === 1 && (
                <g stroke="#7CB342" strokeWidth="2" strokeLinecap="round">
                  <line x1="32" y1="46" x2="30" y2="34" />
                  <line x1="48" y1="46" x2="48" y2="32" />
                  <line x1="64" y1="46" x2="66" y2="34" />
                </g>
              )}

              {level === 2 && (
                <g stroke="#558B2F" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 34 46 Q 30 28 26 20 M 34 46 Q 36 26 38 18" />
                  <path d="M 48 46 Q 46 24 44 14 M 48 46 Q 50 24 52 14" />
                  <path d="M 62 46 Q 60 28 58 20 M 62 46 Q 66 26 70 18" />
                </g>
              )}

              {level >= 3 && (
                <g className={isHealthy ? 'animate-pulse' : 'opacity-75'}>
                  <path d="M 30 46 Q 24 22 18 12 M 30 46 Q 28 20 32 8 M 30 46 Q 36 24 40 14" stroke="#FBC02D" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 48 46 Q 44 18 42 6 M 48 46 Q 52 18 54 6" stroke="#FBC02D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <path d="M 66 46 Q 60 24 56 14 M 66 46 Q 68 20 72 8 M 66 46 Q 74 22 78 12" stroke="#FBC02D" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <circle cx="42" cy="6" r="3.5" fill="#FFE082" />
                  <circle cx="54" cy="6" r="3.5" fill="#FFE082" />
                  <circle cx="32" cy="8" r="3" fill="#FFE082" />
                  <circle cx="72" cy="8" r="3" fill="#FFE082" />
                </g>
              )}

              {level === 5 && (
                <g className="animate-spin-slow">
                  <circle cx="48" cy="20" r="14" fill="none" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="48" cy="20" r="2" fill="#FFF59D" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* =====================================================================
            AREA 3: NHÀ KÍNH (GREENHOUSE - WRITING)
            ===================================================================== */}
        {areaId === 'greenhouse' && (
          <div className="relative w-24 h-22 flex flex-col items-center justify-end" style={{ transform: `scale(${scale})` }}>
            <svg className="w-22 h-22 overflow-visible" viewBox="0 0 88 88">
              <polygon points="22,56 66,56 58,84 30,84" fill="#D84315" stroke="#BF360C" strokeWidth="2.5" />
              <rect x="18" y="52" width="52" height="7" fill="#FF7043" stroke="#BF360C" strokeWidth="1.5" rx="2" />
              
              <path d="M 44 52 Q 32 36 26 22" stroke="#2E7D32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 44 52 Q 56 36 62 22" stroke="#2E7D32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 44 52 Q 44 30 44 14" stroke="#388E3C" strokeWidth="4" fill="none" strokeLinecap="round" />

              <ellipse cx="32" cy="36" rx="9" ry="5" fill="#4CAF50" transform="rotate(-30 32 36)" />
              <ellipse cx="56" cy="36" rx="9" ry="5" fill="#4CAF50" transform="rotate(30 56 36)" />

              {level >= 2 && (
                <circle cx="26" cy="22" r="7.5" fill={isWilting ? '#8D6E63' : '#AB47BC'} />
              )}
              {level >= 3 && (
                <circle cx="62" cy="22" r="7.5" fill={isWilting ? '#8D6E63' : '#E91E63'} />
              )}
              {level >= 4 && (
                <>
                  <circle cx="44" cy="14" r="10" fill={isWilting ? '#6D4C41' : '#FFA726'} />
                  <circle cx="44" cy="14" r="4" fill="#FFF59D" />
                </>
              )}

              {level === 5 && (
                <g className="animate-pulse">
                  <circle cx="44" cy="14" r="13" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="44" cy="14" r="5" fill="#FFEB3B" />
                </g>
              )}
            </svg>
          </div>
        )}

        {/* =====================================================================
            AREA 4: KHU AO HỒ (LAKE & POND - SPEAKING)
            EACH SPECIES HAS ITS OWN DEDICATED AQUATIC ENCLOSURE & SWIMMING FISH
            ===================================================================== */}
        {areaId === 'pond' && (
          <PondAquaticEnclosure
            entity={entity}
            isNearby={isNearby}
          />
        )}

        {/* =====================================================================
            AREA 5: KHU CHĂN NUÔI (LIVESTOCK - LISTENING)
            EACH ANIMAL HAS ITS OWN DEDICATED PEN & WANDERS WITHIN IT
            ===================================================================== */}
        {areaId === 'pasture' && (
          <PastureAnimalPen
            entity={entity}
            isNearby={isNearby}
          />
        )}

        {/* =====================================================================
            AREA 6: XƯỞNG CƠ KHÍ (CLOCKWORK WORKSHOP - TOÁN TƯ DUY)
            ROTATING BRASS GEARS, ABACUS & BALANCE SCALES
            ===================================================================== */}
        {areaId === 'workshop' && (
          <WorkshopMachinery
            entity={entity}
            isNearby={isNearby}
          />
        )}

        {/* =====================================================================
            AREA 7: THƯ VIỆN CỔ (ANCIENT LIBRARY - NGỮ PHÁP)
            ANCIENT TOMES, GLOWING RUNES & BLINKING SCHOLAR OWL
            ===================================================================== */}
        {areaId === 'library' && (
          <GrammarLibraryTome
            entity={entity}
            isNearby={isNearby}
          />
        )}
      </div>

      {/* Rustic Paper Garden Plaque (Strict Retro Warm Palette) */}
      <div className="mt-1 text-center pointer-events-none z-10">
        <div className="px-2 py-0.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[#2c1b18] shadow-md flex flex-col items-center">
          <div className="font-pixel text-[8px] sm:text-[9px] font-bold tracking-wide truncate max-w-[110px]">
            {name}
          </div>
          <div className="flex items-center gap-1 text-[7px] font-pixel leading-none mt-0.5">
            <span className="text-[#d9911e] font-bold">
              {'★'.repeat(level)}{'☆'.repeat(5 - level)}
            </span>
            <span className={`font-bold ${
              isWilting ? 'text-[#663931]' : isThirsty ? 'text-[#8f563b]' : 'text-[#4b692f]'
            }`}>
              {isWilting ? 'Héo' : isThirsty ? 'Khát' : 'Tươi'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
