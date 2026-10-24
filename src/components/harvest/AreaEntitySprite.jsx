import React from 'react';
import HarvestTownTree from './HarvestTownTree';

/**
 * Authentic Graphical Sprites for the 5 Farm Areas
 * Orchard uses HarvestTownTree for full 10-species pixel art visual immersion.
 * Paddy, Greenhouse, Pond, Pasture use detailed thematic pixel sprites.
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
        {/* Proximity / Selection Ring */}
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
      
      {/* Proximity Ring */}
      {isNearby && (
        <div className="absolute -inset-2 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none" />
      )}

      {/* Status Alerts */}
      {isWilting && (
        <div className="absolute -top-4 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-200 font-pixel text-[8px] animate-bounce z-20 shadow">
          🥀 HÉO ÚA
        </div>
      )}
      {isThirsty && (
        <div className="absolute -top-4 px-2 py-0.5 rounded-full bg-amber-950 border border-amber-400 text-amber-200 font-pixel text-[8px] animate-bounce z-20 shadow">
          💧 KHÁT NƯỚC
        </div>
      )}

      {/* Ground Shadow */}
      <div 
        className="absolute bottom-1 w-16 h-5 rounded-full bg-black/40 blur-[1px] pointer-events-none" 
        style={{ transform: `scale(${scale})` }}
      />

      {/* Real Graphic Sprite */}
      <div 
        className={`relative transition-transform duration-300 ${isNearby ? 'scale-110' : ''}`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* AREA 2: RUỘNG LÚA (PADDY FIELD - VOCABULARY) */}
        {areaId === 'paddy' && (
          <div className="relative w-20 h-20 flex flex-col items-center justify-end">
            <svg className="w-20 h-14" viewBox="0 0 80 56">
              {/* Terraced Paddy Ridge */}
              <ellipse cx="40" cy="38" rx="38" ry="16" fill="#3E271B" stroke="#6D4C41" strokeWidth="2" />
              <ellipse cx="40" cy="36" rx="34" ry="13" fill="#2E1C12" />
              {!isWilting && (
                <ellipse cx="40" cy="36" rx="30" ry="11" fill="#00838F" opacity="0.4" />
              )}
              {/* Rice Stalks */}
              <g className={isHealthy ? 'animate-bounce' : 'opacity-70'}>
                <path d="M 28 36 Q 26 18 20 10 M 28 36 Q 30 16 32 8 M 28 36 Q 34 20 38 12" stroke="#FBC02D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 52 36 Q 50 18 46 10 M 52 36 Q 54 16 56 8 M 52 36 Q 58 20 62 12" stroke="#F57F17" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {level >= 3 && (
                  <path d="M 40 36 Q 38 14 40 4 M 40 36 Q 42 14 44 6" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" fill="none" />
                )}
              </g>
            </svg>
          </div>
        )}

        {/* AREA 3: NHÀ KÍNH (GREENHOUSE - WRITING) */}
        {areaId === 'greenhouse' && (
          <div className="relative w-20 h-22 flex flex-col items-center justify-end">
            <svg className="w-18 h-20" viewBox="0 0 72 80">
              {/* Terracotta Planter */}
              <polygon points="18,52 54,52 48,76 24,76" fill="#D84315" stroke="#BF360C" strokeWidth="2" />
              <rect x="14" y="48" width="44" height="6" fill="#FF7043" stroke="#BF360C" strokeWidth="1.5" rx="2" />
              {/* Blooming Botanical Stems */}
              <path d="M 36 48 Q 28 34 24 20" stroke="#2E7D32" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 36 48 Q 44 34 48 20" stroke="#2E7D32" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 36 48 Q 36 28 36 12" stroke="#43A047" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Exotic Flowers */}
              <circle cx="24" cy="20" r="7" fill={isWilting ? '#8D6E63' : '#AB47BC'} />
              <circle cx="48" cy="20" r="7" fill={isWilting ? '#8D6E63' : '#EC407A'} />
              <circle cx="36" cy="12" r="9" fill={isWilting ? '#6D4C41' : '#FFA726'} />
              <circle cx="36" cy="12" r="3" fill="#FFF59D" />
            </svg>
          </div>
        )}

        {/* AREA 4: KHU AO HỒ (LAKE & POND - SPEAKING) */}
        {areaId === 'pond' && (
          <div className="relative w-22 h-20 flex flex-col items-center justify-center">
            <svg className="w-22 h-18" viewBox="0 0 88 72">
              {/* Pond Basin */}
              <ellipse cx="44" cy="38" rx="42" ry="26" fill="#01579B" stroke="#4FC3F7" strokeWidth="2.5" />
              <ellipse cx="44" cy="36" rx="38" ry="22" fill="#0288D1" />
              <ellipse cx="44" cy="34" rx="32" ry="16" fill="#29B6F6" opacity="0.6" />
              {/* Koi Fish */}
              <path d="M 34 32 Q 44 26 54 34 Q 48 42 34 32 Z" fill="#FF5722" stroke="#BF360C" strokeWidth="1" className={isHealthy ? 'animate-pulse' : ''} />
              <polygon points="34,32 26,28 28,36" fill="#FF7043" />
              {level >= 3 && (
                <>
                  <path d="M 48 44 Q 56 40 64 46 Q 58 52 48 44 Z" fill="#FFD600" stroke="#FFAB00" strokeWidth="1" />
                  <circle cx="60" cy="24" r="5" fill="#43A047" />
                  <circle cx="61" cy="23" r="2.5" fill="#F06292" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* AREA 5: KHU CHĂN NUÔI (LIVESTOCK - LISTENING) */}
        {areaId === 'pasture' && (
          <div className="relative w-22 h-20 flex flex-col items-center justify-end">
            <svg className="w-22 h-18" viewBox="0 0 88 72">
              {/* Wooden Pen */}
              <rect x="8" y="38" width="72" height="28" fill="#5D4037" stroke="#3E2723" strokeWidth="2" rx="4" />
              <line x1="8" y1="46" x2="80" y2="46" stroke="#8D6E63" strokeWidth="2" />
              <line x1="8" y1="56" x2="80" y2="56" stroke="#8D6E63" strokeWidth="2" />
              {/* Livestock Animal */}
              <text x="44" y="36" fontSize="28" textAnchor="middle" className={isHealthy ? 'animate-bounce' : 'opacity-80'}>
                {entity.type.includes('cow') ? '🐄' : entity.type.includes('chicken') ? '🐔' : entity.type.includes('sheep') ? '🐑' : entity.type.includes('horse') ? '🐎' : '🦆'}
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Rustic Wooden Garden Plaque */}
      <div className="mt-1 text-center pointer-events-none z-10">
        <div className="px-2 py-0.5 rounded-md bg-[#2D160A]/95 border border-[#5E3219] shadow-md flex flex-col items-center">
          <div className="font-pixel text-[8.5px] sm:text-[9.5px] text-amber-200 font-bold tracking-wide truncate max-w-[105px]">
            {name}
          </div>
          <div className="flex items-center gap-1 text-[7.5px] font-pixel leading-none mt-0.5">
            <span className="text-amber-400 font-black">
              {'★'.repeat(level)}{'☆'.repeat(5 - level)}
            </span>
            <span className={`text-[7px] font-bold ${
              isWilting ? 'text-rose-400' : isThirsty ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isWilting ? 'Héo úa' : isThirsty ? 'Khát' : 'Tươi tốt'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
