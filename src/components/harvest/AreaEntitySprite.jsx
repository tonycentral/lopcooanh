import React from 'react';

/**
 * Renders authentic graphical pixel/vector sprites for the 10 topics across 5 areas
 * Reflects real growth (Level 1 to 5) and health states ('healthy', 'thirsty', 'wilting')
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
  // Level 1: 0.8x, Level 2: 0.95x, Level 3: 1.1x, Level 4: 1.25x, Level 5: 1.4x (Ancient)
  const scaleMultipliers = [0.8, 0.95, 1.1, 1.25, 1.4];
  const scale = scaleMultipliers[Math.min(4, Math.max(0, level - 1))];

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      
      {/* 1. Proximity / Selection Ring */}
      {isNearby && (
        <div className="absolute -inset-2 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping pointer-events-none" />
      )}

      {/* 2. Status Alerts (Thirsty / Wilting / Level 5 Ancient Glow) */}
      {isWilting && (
        <div className="absolute -top-6 px-1.5 py-0.2 rounded bg-rose-900 border border-rose-500 text-rose-200 font-pixel text-[8px] animate-bounce z-20 shadow">
          HÉO ÚA 🥀
        </div>
      )}
      {isThirsty && (
        <div className="absolute -top-6 px-1.5 py-0.2 rounded bg-amber-900 border border-amber-400 text-amber-200 font-pixel text-[8px] animate-bounce z-20 shadow">
          KHÁT NƯỚC 💧
        </div>
      )}
      {level === 5 && isHealthy && (
        <div className="absolute -top-6 px-1.5 py-0.2 rounded bg-amber-500 border border-yellow-200 text-[#24130A] font-pixel text-[8px] font-black z-20 shadow animate-pulse">
          CỔ THỤ HOÀNG KIM 👑
        </div>
      )}

      {/* 3. Shadow Underneath */}
      <div 
        className="absolute bottom-1 w-14 h-4 rounded-full bg-black/40 blur-[1px] pointer-events-none" 
        style={{ transform: `scale(${scale})` }}
      />

      {/* 4. REAL GRAPHIC SPRITE PER AREA TYPE */}
      <div 
        className={`relative transition-transform duration-300 ${isNearby ? 'scale-110' : ''}`}
        style={{ transform: `scale(${scale})` }}
      >
        {/* =========================================================================
            AREA 1: VƯỜN CÂY (ORCHARD - READING)
            ========================================================================= */}
        {areaId === 'orchard' && (
          <div className="relative w-16 h-20 flex flex-col items-center justify-end">
            {/* Trunk */}
            <div className={`w-4 h-9 rounded-sm ${isWilting ? 'bg-[#5D4037]' : 'bg-[#795548]'} border border-[#3E2723] shadow-inner relative`}>
              {/* Bark ridges */}
              <div className="w-full h-1 bg-[#4E342E] my-1" />
              <div className="w-full h-1 bg-[#4E342E] my-1" />
            </div>

            {/* Tree Canopy (Leafy Canopy growing bigger with Level) */}
            <div 
              className={`absolute top-0 rounded-3xl p-2 flex flex-col items-center justify-center border-2 transition-all ${
                isWilting 
                  ? 'bg-[#6D5A43] border-[#4A3B2C] text-stone-400 opacity-80' 
                  : isThirsty 
                  ? 'bg-[#827717] border-[#558B2F] text-amber-100' 
                  : 'bg-[#2E7D32] border-[#1B5E20] text-emerald-100 shadow-[0_4px_12px_rgba(46,125,50,0.6)]'
              }`}
              style={{
                width: `${46 + level * 6}px`,
                height: `${42 + level * 6}px`
              }}
            >
              {/* Inner leaf clusters */}
              <div className="flex items-center gap-1">
                <span className="text-sm">{topicIcon}</span>
                {level >= 3 && isHealthy && (
                  <span className="text-xs animate-bounce">🍎</span>
                )}
              </div>
              {level >= 4 && isHealthy && (
                <div className="flex gap-1 text-[10px] mt-0.5">
                  <span>✨</span>
                  <span>✨</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            AREA 2: RUỘNG LÚA (PADDY FIELD - VOCABULARY)
            ========================================================================= */}
        {areaId === 'paddy' && (
          <div className="relative w-16 h-18 flex flex-col items-center justify-end">
            {/* Terraced Paddy Ridge */}
            <div className={`w-16 h-8 rounded-xl border-2 flex items-center justify-center relative overflow-hidden ${
              isWilting 
                ? 'bg-[#5D4037] border-[#3E2723]' 
                : 'bg-radial from-[#3E2723] to-[#21120B] border-[#795548] shadow-inner'
            }`}>
              {/* Water sheen */}
              {!isWilting && (
                <div className="absolute inset-0 bg-cyan-500/20 pointer-events-none" />
              )}

              {/* Rice Stalks Cluster */}
              <div className="flex items-end gap-1 z-10">
                <span className={`text-2xl filter drop-shadow transition-transform ${
                  isHealthy ? 'animate-bounce' : 'rotate-12 opacity-80'
                }`}>
                  {level >= 3 ? '🌾' : '🌱'}
                </span>
                {level >= 2 && (
                  <span className="text-xl filter drop-shadow -ml-2">
                    {level >= 4 ? '🌾' : '🌿'}
                  </span>
                )}
              </div>
            </div>

            {/* Topic Badge in Mud */}
            <div className="absolute -bottom-2 px-1 rounded bg-[#24130A] border border-amber-500/60 text-[9px] font-pixel text-amber-300">
              {topicIcon}
            </div>
          </div>
        )}

        {/* =========================================================================
            AREA 3: NHÀ KÍNH (GREENHOUSE - WRITING)
            ========================================================================= */}
        {areaId === 'greenhouse' && (
          <div className="relative w-16 h-20 flex flex-col items-center justify-end">
            {/* Terracotta Botanical Pot */}
            <div className="w-10 h-7 rounded-b-xl bg-[#BF360C] border-2 border-[#870000] shadow-md flex items-center justify-center relative">
              <div className="absolute -top-1 w-12 h-2 rounded-md bg-[#D84315] border border-[#870000]" />
              <span className="text-xs">{topicIcon}</span>
            </div>

            {/* Lush Orchid / Flower Blooming from Pot */}
            <div className={`absolute top-1 flex flex-col items-center transition-all ${
              isWilting ? 'opacity-60 -rotate-12' : isThirsty ? 'opacity-85' : 'animate-bounce'
            }`}>
              <span className="text-3xl filter drop-shadow">
                {level >= 4 ? '🌺' : level >= 2 ? '🌸' : '🪴'}
              </span>
              {level >= 3 && isHealthy && (
                <span className="text-[10px] text-amber-300 animate-pulse font-pixel">✨</span>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            AREA 4: KHU AO HỒ (LAKE & POND - SPEAKING)
            ========================================================================= */}
        {areaId === 'pond' && (
          <div className="relative w-18 h-18 flex flex-col items-center justify-center">
            {/* Shimmering Circular Pond Water */}
            <div className={`w-16 h-14 rounded-full border-2 flex items-center justify-center relative overflow-hidden ${
              isWilting 
                ? 'bg-[#1E3A47] border-[#0F222B]' 
                : 'bg-gradient-to-b from-[#0284C7] to-[#0369A1] border-cyan-300 shadow-[0_0_12px_rgba(2,132,199,0.5)]'
            }`}>
              {/* Ripple Ring */}
              <div className="absolute inset-1 rounded-full border border-cyan-200/40 animate-ping pointer-events-none" />

              {/* Swimming Fish / Koi Sprite */}
              <div className="flex items-center gap-1 z-10">
                <span className={`text-2xl filter drop-shadow transition-transform ${
                  isHealthy ? 'animate-pulse scale-105' : 'opacity-70'
                }`}>
                  🐟
                </span>
                {level >= 3 && (
                  <span className="text-lg -ml-2">🐠</span>
                )}
              </div>
            </div>

            {/* Lily Pad Tag */}
            <div className="absolute -bottom-1 px-1.5 rounded-full bg-[#164E63] border border-cyan-400 text-[8px] font-pixel text-cyan-200 flex items-center gap-0.5">
              <span>{topicIcon}</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            AREA 5: KHU CHĂN NUÔI (LIVESTOCK - LISTENING)
            ========================================================================= */}
        {areaId === 'pasture' && (
          <div className="relative w-18 h-18 flex flex-col items-center justify-end">
            {/* Wooden Fence Pen */}
            <div className="w-16 h-9 rounded-lg bg-[#5D4037] border-2 border-[#3E2723] p-1 flex items-center justify-center relative shadow-inner">
              <div className="absolute -top-1 inset-x-0 h-1 bg-[#8D6E63] border-b border-[#3E2723]" />
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#8D6E63] border-t border-[#3E2723]" />

              {/* Living Livestock Animal */}
              <div className="flex items-center gap-1 z-10">
                <span className={`text-2xl filter drop-shadow ${
                  isHealthy ? 'animate-bounce' : 'opacity-75 -rotate-6'
                }`}>
                  {entity.type.includes('cow') ? '🐄' : entity.type.includes('chicken') ? '🐔' : entity.type.includes('sheep') ? '🐑' : entity.type.includes('horse') ? '🐎' : '🦆'}
                </span>
                {level >= 3 && (
                  <span className="text-sm">🐥</span>
                )}
              </div>
            </div>

            {/* Tag */}
            <div className="absolute -bottom-2 px-1 rounded bg-[#24130A] border border-amber-500/60 text-[8px] font-pixel text-amber-300">
              {topicIcon}
            </div>
          </div>
        )}
      </div>

      {/* 5. Entity Name & Level Plate Below */}
      <div className="mt-2 text-center pointer-events-none z-10">
        <div className="px-2 py-0.5 rounded bg-black/80 border border-amber-400/70 shadow flex flex-col items-center max-w-[100px]">
          <div className="font-pixel text-[8px] sm:text-[9px] text-amber-200 font-bold truncate w-full">
            {name}
          </div>
          <div className="text-[7px] text-stone-300 font-pixel flex items-center gap-1">
            <span className="text-amber-400 font-bold">Lv.{level}</span>
            <span>•</span>
            <span className={isHealthy ? 'text-emerald-400' : isThirsty ? 'text-amber-400' : 'text-rose-400'}>
              {isHealthy ? 'Xanh tốt' : isThirsty ? 'Ủ rũ' : 'Héo úa'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
