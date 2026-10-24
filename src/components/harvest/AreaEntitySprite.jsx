import React from 'react';
import HarvestTownTree from './HarvestTownTree';

/**
 * Authentic Graphical Sprites for All 5 IELTS Farm Areas:
 * 1. Orchard: 10 Harvest Town Tree Species (Apples, Pine, Oak, Maple, Willow, etc.)
 * 2. Paddy: 5-Stage Terraced Golden Rice Fields with Irrigation
 * 3. Greenhouse: 5-Stage Ornate Botanical Planters with Exotic Blooms
 * 4. Pond: 5-Stage Natural Spring Pools with Swimming Koi Schools & Lotus Blossoms
 * 5. Pasture: 5-Stage Rustic Wooden Pens with Animated Livestock & Prize Ribbons
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
  // OTHER AREAS (RUỘNG LÚA, NHÀ KÍNH, KHU AO HỒ, KHU CHĂN NUÔI)
  // =========================================================================
  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      
      {/* Proximity / Selection Ring */}
      {isNearby && (
        <div className="absolute -inset-2 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none" />
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

      {/* Ground Mound / Shadow Base */}
      <div 
        className="absolute bottom-1 w-20 h-6 rounded-full bg-black/45 blur-[1px] pointer-events-none" 
        style={{ transform: `scale(${scale})` }}
      />

      {/* Real Graphic Sprite Body */}
      <div 
        className={`relative transition-transform duration-300 ${isNearby ? 'scale-110' : ''}`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* =====================================================================
            AREA 2: RUỘNG LÚA (PADDY FIELD - VOCABULARY)
            ===================================================================== */}
        {areaId === 'paddy' && (
          <div className="relative w-24 h-22 flex flex-col items-center justify-end">
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
                /* Level 1: Young Rice Seedlings planted in water */
                <g stroke="#7CB342" strokeWidth="2" strokeLinecap="round">
                  <line x1="32" y1="46" x2="30" y2="34" />
                  <line x1="48" y1="46" x2="48" y2="32" />
                  <line x1="64" y1="46" x2="66" y2="34" />
                </g>
              )}

              {level === 2 && (
                /* Level 2: Green tillering stalks */
                <g stroke="#558B2F" strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 34 46 Q 30 28 26 20 M 34 46 Q 36 26 38 18" />
                  <path d="M 48 46 Q 46 24 44 14 M 48 46 Q 50 24 52 14" />
                  <path d="M 62 46 Q 60 28 58 20 M 62 46 Q 66 26 70 18" />
                </g>
              )}

              {level >= 3 && (
                /* Level 3, 4, 5: Dense waving golden rice with panicles */
                <g className={isHealthy ? 'animate-pulse' : 'opacity-75'}>
                  {/* Left Cluster */}
                  <path d="M 30 46 Q 24 22 18 12 M 30 46 Q 28 20 32 8 M 30 46 Q 36 24 40 14" stroke="#FBC02D" strokeWidth="3" strokeLinecap="round" fill="none" />
                  {/* Center Cluster */}
                  <path d="M 48 46 Q 44 16 46 4 M 48 46 Q 48 16 52 6 M 48 46 Q 54 20 58 12" stroke="#F57F17" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Right Cluster */}
                  <path d="M 66 46 Q 62 24 58 14 M 66 46 Q 68 20 72 8 M 66 46 Q 74 22 80 12" stroke="#FBC02D" strokeWidth="3" strokeLinecap="round" fill="none" />
                  
                  {/* Drooping Golden Rice Grains (Panicles) */}
                  <circle cx="18" cy="12" r="3" fill="#FFD54F" />
                  <circle cx="32" cy="8" r="3.5" fill="#FFE082" />
                  <circle cx="46" cy="4" r="4" fill="#FFD54F" />
                  <circle cx="52" cy="6" r="3.5" fill="#FFE082" />
                  <circle cx="72" cy="8" r="3.5" fill="#FFD54F" />
                  <circle cx="80" cy="12" r="3" fill="#FFE082" />

                  {/* Level 5 Ancient Sparkles */}
                  {level === 5 && (
                    <g className="animate-bounce">
                      <polygon points="48,-6 52,0 58,0 54,4 56,10 48,6 40,10 42,4 38,0 44,0" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>
        )}

        {/* =====================================================================
            AREA 3: NHÀ KÍNH (GREENHOUSE - WRITING)
            ===================================================================== */}
        {areaId === 'greenhouse' && (
          <div className="relative w-22 h-24 flex flex-col items-center justify-end">
            <svg className="w-22 h-22 overflow-visible" viewBox="0 0 88 88">
              {/* Terracotta Botanical Planter */}
              <polygon points="22,56 66,56 58,84 30,84" fill="#D84315" stroke="#BF360C" strokeWidth="2.5" />
              <rect x="18" y="52" width="52" height="7" fill="#FF7043" stroke="#BF360C" strokeWidth="1.5" rx="2" />
              
              {/* Botanical Stems & Leaves */}
              <path d="M 44 52 Q 32 36 26 22" stroke="#2E7D32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 44 52 Q 56 36 62 22" stroke="#2E7D32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 44 52 Q 44 30 44 14" stroke="#388E3C" strokeWidth="4" fill="none" strokeLinecap="round" />

              {/* Foliage leaves */}
              <ellipse cx="32" cy="36" rx="9" ry="5" fill="#4CAF50" transform="rotate(-30 32 36)" />
              <ellipse cx="56" cy="36" rx="9" ry="5" fill="#4CAF50" transform="rotate(30 56 36)" />

              {/* Blooming Exotic Flowers by Level */}
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

              {/* Level 5 Ancient Master Bloom */}
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
            ===================================================================== */}
        {areaId === 'pond' && (
          <div className="relative w-24 h-22 flex flex-col items-center justify-center">
            <svg className="w-24 h-20 overflow-visible" viewBox="0 0 96 80">
              {/* Natural Stone Basin */}
              <ellipse cx="48" cy="42" rx="46" ry="30" fill="#01579B" stroke="#4FC3F7" strokeWidth="3" />
              <ellipse cx="48" cy="40" rx="42" ry="26" fill="#0288D1" />
              <ellipse cx="48" cy="38" rx="36" ry="20" fill="#29B6F6" opacity="0.6" />
              
              {/* Ripple Rings */}
              {!isWilting && (
                <ellipse cx="48" cy="38" rx="26" ry="12" fill="none" stroke="#B3E5FC" strokeWidth="1" opacity="0.7" className="animate-ping" />
              )}

              {/* Swimming Koi Fish */}
              <g className={isHealthy ? 'animate-pulse' : 'opacity-70'}>
                {/* Koi 1 (Orange & White Calico) */}
                <path d="M 36 36 Q 48 28 58 38 Q 50 48 36 36 Z" fill="#FF5722" stroke="#BF360C" strokeWidth="1.2" />
                <polygon points="36,36 28,32 30,40" fill="#FF7043" />
                <circle cx="52" cy="36" r="2.5" fill="#FFFFFF" />

                {/* Level 3+ Second Fish */}
                {level >= 3 && (
                  <>
                    <path d="M 54 48 Q 64 42 74 50 Q 66 58 54 48 Z" fill="#FFD600" stroke="#FFAB00" strokeWidth="1" />
                    <polygon points="54,48 48,45 49,52" fill="#FFE082" />
                  </>
                )}
              </g>

              {/* Floating Lotus Lilypad & Flower */}
              <ellipse cx="30" cy="48" rx="10" ry="6" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1" />
              <circle cx="30" cy="46" r="4.5" fill="#F06292" />
              <circle cx="30" cy="46" r="1.8" fill="#FFF59D" />

              {/* Level 5 Golden Dragonfish Halo */}
              {level === 5 && (
                <circle cx="48" cy="40" r="18" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />
              )}
            </svg>
          </div>
        )}

        {/* =====================================================================
            AREA 5: KHU CHĂN NUÔI (LIVESTOCK - LISTENING)
            ===================================================================== */}
        {areaId === 'pasture' && (
          <div className="relative w-24 h-22 flex flex-col items-center justify-end">
            <svg className="w-24 h-20 overflow-visible" viewBox="0 0 96 80">
              {/* Wooden Pen Fence & Hay Bedding */}
              <rect x="8" y="40" width="80" height="34" fill="#5D4037" stroke="#3E2723" strokeWidth="2.5" rx="5" />
              <rect x="12" y="44" width="72" height="26" fill="#FDD835" opacity="0.85" rx="3" />
              {/* Fence Cross Rails */}
              <line x1="8" y1="50" x2="88" y2="50" stroke="#8D6E63" strokeWidth="2.5" />
              <line x1="8" y1="62" x2="88" y2="62" stroke="#8D6E63" strokeWidth="2.5" />

              {/* Animated Animal Sprite */}
              <g className={isHealthy ? 'animate-bounce' : 'opacity-80'}>
                <text x="48" y="38" fontSize="34" textAnchor="middle" className="filter drop-shadow-md">
                  {entity.type.includes('cow') ? '🐄' : entity.type.includes('chicken') ? '🐔' : entity.type.includes('sheep') ? '🐑' : entity.type.includes('horse') ? '🐎' : '🦆'}
                </text>
              </g>

              {/* Level 4 Baby Animals (Chicks / Calf) */}
              {level >= 4 && (
                <text x="70" y="58" fontSize="16">🐥</text>
              )}

              {/* Level 5 Champion Blue Prize Ribbon */}
              {level === 5 && (
                <g className="animate-bounce">
                  <circle cx="24" cy="38" r="6" fill="#1E88E5" stroke="#0D47A1" strokeWidth="1" />
                  <polygon points="21,43 18,52 24,49 30,52 27,43" fill="#1565C0" />
                  <circle cx="24" cy="38" r="2.5" fill="#FFD700" />
                </g>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Rustic Paper Garden Plaque (Strict Retro Warm Palette) */}
      <div className="mt-1 text-center pointer-events-none z-10">
        <div className="px-2 py-0.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[#2c1b18] shadow-md flex flex-col items-center">
          <div className="font-pixel text-[8px] sm:text-[9px] font-bold tracking-wide truncate max-w-[105px]">
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
