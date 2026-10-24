import React from 'react';

/**
 * Authentic Farm Environment Decorations per Area
 * Orchard: Split-rail fence, stone water well, fruit crates, tool rack, beehive, flower borders
 * Paddy: Terraced bunds, Oxford scarecrow, wooden sluice gates, waterwheel, plank bridges
 * Greenhouse: Iron-glass framework arches, sunbeams, potting benches, hanging ivies, misting nozzles
 * Pond: Curved stone shoreline, wooden fishing pier, moored skiff boat, lotus pads, cattails
 * Pasture: Red timber barn facade, hay bales, milk churns, feed troughs, fencing
 */

export default function AreaEnvironmentDecor({ areaId = 'orchard' }) {
  // 1. ORCHARD: SPLIT-RAIL FENCE, STONE WATER WELL, FRUIT CRATES, BEEHIVE
  if (areaId === 'orchard') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-5">
        
        {/* Top Perimeter Wooden Split-Rail Fence */}
        <div className="absolute top-1 inset-x-2 flex items-center justify-between opacity-90">
          <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 800 24">
            {/* Top & Bottom Horizontal Rails */}
            <line x1="0" y1="8" x2="800" y2="8" stroke="#5D4037" strokeWidth="4" />
            <line x1="0" y1="16" x2="800" y2="16" stroke="#4E342E" strokeWidth="3.5" />
            
            {/* Vertical Fence Posts spaced evenly */}
            {Array.from({ length: 17 }).map((_, i) => (
              <g key={i}>
                <rect x={i * 50 + 4} y="2" width="6" height="22" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" rx="1" />
                <polygon points={`${i * 50 + 4},2 ${i * 50 + 7},0 ${i * 50 + 10},2`} fill="#8D6E63" />
              </g>
            ))}
          </svg>
        </div>

        {/* Bottom Perimeter Wooden Fence */}
        <div className="absolute bottom-1 inset-x-2 flex items-center justify-between opacity-85">
          <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 800 24">
            <line x1="0" y1="8" x2="800" y2="8" stroke="#5D4037" strokeWidth="4" />
            <line x1="0" y1="16" x2="800" y2="16" stroke="#4E342E" strokeWidth="3.5" />
            {Array.from({ length: 17 }).map((_, i) => (
              <g key={i}>
                <rect x={i * 50 + 4} y="2" width="6" height="22" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" rx="1" />
              </g>
            ))}
          </svg>
        </div>

        {/* Stone Water Well (Top-Left Corner) */}
        <div className="absolute top-12 left-4 flex flex-col items-center">
          <svg className="w-14 h-16 filter drop-shadow-lg" viewBox="0 0 56 64">
            {/* Roof */}
            <polygon points="28,2 4,18 52,18" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
            <polygon points="28,4 6,18 50,18" fill="#A1887F" />
            {/* Wooden Posts */}
            <rect x="8" y="18" width="4" height="22" fill="#5D4037" />
            <rect x="44" y="18" width="4" height="22" fill="#5D4037" />
            {/* Winch & Rope */}
            <line x1="12" y1="26" x2="44" y2="26" stroke="#4E342E" strokeWidth="3" />
            <line x1="28" y1="26" x2="28" y2="38" stroke="#FFE082" strokeWidth="2" strokeDasharray="2 1" />
            {/* Bucket */}
            <rect x="24" y="38" width="8" height="8" fill="#3E2723" rx="1" />
            {/* Cobblestone Basin */}
            <ellipse cx="28" cy="48" rx="24" ry="12" fill="#78909C" stroke="#37474F" strokeWidth="2" />
            <ellipse cx="28" cy="46" rx="20" ry="9" fill="#00838F" />
            <ellipse cx="28" cy="45" rx="16" ry="6" fill="#006064" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Giếng Nước</span>
        </div>

        {/* Fruit Crates Stack (Top-Right Corner) */}
        <div className="absolute top-12 right-4 flex flex-col items-center">
          <svg className="w-16 h-14 filter drop-shadow-md" viewBox="0 0 64 56">
            {/* Bottom Crate */}
            <rect x="6" y="24" width="30" height="22" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" rx="2" />
            <line x1="6" y1="35" x2="36" y2="35" stroke="#3E2723" strokeWidth="1.5" />
            {/* Apples inside */}
            <circle cx="15" cy="22" r="4.5" fill="#E53935" />
            <circle cx="23" cy="20" r="5" fill="#E53935" />
            <circle cx="30" cy="22" r="4.5" fill="#E53935" />
            {/* Right Crate */}
            <rect x="32" y="28" width="28" height="20" fill="#795548" stroke="#3E2723" strokeWidth="2" rx="2" />
            {/* Oranges inside */}
            <circle cx="40" cy="26" r="4.5" fill="#FB8C00" />
            <circle cx="48" cy="25" r="5" fill="#FB8C00" />
            <circle cx="54" cy="27" r="4" fill="#FB8C00" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Thùng Quả</span>
        </div>

        {/* Honey Beehive Box (Bottom-Left Corner) */}
        <div className="absolute bottom-10 left-6 flex flex-col items-center">
          <svg className="w-12 h-14 filter drop-shadow-md" viewBox="0 0 48 56">
            {/* Stand Legs */}
            <line x1="12" y1="44" x2="8" y2="54" stroke="#4E342E" strokeWidth="3" />
            <line x1="36" y1="44" x2="40" y2="54" stroke="#4E342E" strokeWidth="3" />
            {/* Slanted Roof */}
            <polygon points="24,6 4,18 44,18" fill="#F57F17" stroke="#E65100" strokeWidth="1.5" />
            {/* Box Body with Entrance Slits */}
            <rect x="8" y="18" width="32" height="26" fill="#FFD54F" stroke="#F57F17" strokeWidth="2" rx="2" />
            <rect x="18" y="24" width="12" height="3" fill="#3E2723" rx="1" />
            <rect x="18" y="32" width="12" height="3" fill="#3E2723" rx="1" />
            {/* Flying Little Bees */}
            <circle cx="36" cy="12" r="2.5" fill="#FFEB3B" stroke="#212121" strokeWidth="0.8" />
            <circle cx="40" cy="18" r="2" fill="#FFEB3B" stroke="#212121" strokeWidth="0.8" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Tổ Ong 🐝</span>
        </div>

        {/* Wooden Garden Bench & Flower Planter (Bottom-Right Corner) */}
        <div className="absolute bottom-10 right-6 flex flex-col items-center">
          <svg className="w-16 h-12 filter drop-shadow-md" viewBox="0 0 64 48">
            {/* Bench Backrest */}
            <rect x="8" y="10" width="48" height="6" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.5" rx="1" />
            <rect x="8" y="18" width="48" height="5" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.5" rx="1" />
            {/* Bench Seat */}
            <rect x="6" y="25" width="52" height="6" fill="#A1887F" stroke="#4E342E" strokeWidth="1.5" rx="1" />
            {/* Legs */}
            <rect x="10" y="31" width="4" height="15" fill="#3E2723" />
            <rect x="50" y="31" width="4" height="15" fill="#3E2723" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Ghế Nghỉ</span>
        </div>

      </div>
    );
  }

  // 2. PADDY: TERRACED BUNDS, WATER CHANNELS, OXFORD SCARECROW
  if (areaId === 'paddy') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-5">
        
        {/* Oxford Scarecrow (Center Middle Field) */}
        <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-15 flex flex-col items-center">
          <svg className="w-16 h-22 filter drop-shadow-lg" viewBox="0 0 64 88">
            {/* Wooden Stake */}
            <line x1="32" y1="16" x2="32" y2="86" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" />
            <line x1="12" y1="36" x2="52" y2="36" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
            {/* Straw Shirt / Blue Overalls */}
            <path d="M 22 28 L 42 28 L 46 56 L 18 56 Z" fill="#1976D2" stroke="#0D47A1" strokeWidth="1.5" />
            {/* Straw Tufts from Sleeves */}
            <line x1="12" y1="36" x2="6" y2="38" stroke="#FDD835" strokeWidth="2.5" />
            <line x1="52" y1="36" x2="58" y2="38" stroke="#FDD835" strokeWidth="2.5" />
            {/* Head Pumpkin / Burlap Sack */}
            <circle cx="32" cy="22" r="8" fill="#FFA726" stroke="#E65100" strokeWidth="1.5" />
            {/* Eyes & Smile */}
            <circle cx="29" cy="21" r="1.2" fill="#212121" />
            <circle cx="35" cy="21" r="1.2" fill="#212121" />
            <path d="M 29 25 Q 32 28 35 25" stroke="#212121" strokeWidth="1" fill="none" />
            {/* Floppy Straw Hat */}
            <ellipse cx="32" cy="16" rx="14" ry="4" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.5" />
            <path d="M 24 16 L 26 8 L 38 8 L 40 16 Z" fill="#FDD835" stroke="#F57F17" strokeWidth="1.5" />
            {/* Sparrow Perched on Hat */}
            <circle cx="27" cy="6" r="3" fill="#5D4037" />
            <polygon points="24,6 21,5 24,7" fill="#FFA000" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200 px-1.5 py-0.2 rounded bg-black/70 border border-amber-500/50 -mt-1">
            Bù Nhìn Rơm Oxford 🧙‍♂️
          </span>
        </div>

        {/* Irrigation Sluice Gate (Top-Right) */}
        <div className="absolute top-10 right-6 flex flex-col items-center">
          <svg className="w-14 h-16 filter drop-shadow-md" viewBox="0 0 56 64">
            {/* Stone Embankment */}
            <rect x="4" y="20" width="14" height="38" fill="#78909C" stroke="#37474F" strokeWidth="2" />
            <rect x="38" y="20" width="14" height="38" fill="#78909C" stroke="#37474F" strokeWidth="2" />
            {/* Wooden Sluice Board */}
            <rect x="18" y="24" width="20" height="28" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
            <line x1="28" y1="6" x2="28" y2="24" stroke="#D7CCC8" strokeWidth="3" />
            {/* Flowing Shimmering Water */}
            <path d="M 18 52 Q 28 48 38 52 L 38 62 L 18 62 Z" fill="#00BCD4" opacity="0.8" />
          </svg>
          <span className="font-pixel text-[8px] text-cyan-200 px-1 rounded bg-black/60">Cống Thủy Lợi</span>
        </div>

      </div>
    );
  }

  // 3. GREENHOUSE: GLASS CEILING ARCHES, POTTING BENCHES, SUNBEAMS
  if (areaId === 'greenhouse') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-5">
        
        {/* Overhead Victorian Iron-and-Glass Arches */}
        <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Iron Framework Arches */}
          <path d="M 0 0 Q 50 25 100 0" stroke="#263238" strokeWidth="2" fill="none" />
          <path d="M 0 0 Q 50 35 100 0" stroke="#37474F" strokeWidth="2.5" fill="none" />
          {/* Vertical Ribs */}
          <line x1="25" y1="0" x2="25" y2="100" stroke="#263238" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#37474F" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#263238" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Volumetric Sunbeams / God Rays beaming from Top */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/10 via-transparent to-transparent pointer-events-none" />

        {/* Botanical Potting Bench (Top-Left) */}
        <div className="absolute top-10 left-6 flex flex-col items-center">
          <svg className="w-16 h-14 filter drop-shadow-md" viewBox="0 0 64 56">
            <rect x="4" y="24" width="56" height="6" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
            <rect x="8" y="30" width="4" height="22" fill="#4E342E" />
            <rect x="52" y="30" width="4" height="22" fill="#4E342E" />
            {/* Small Terracotta Pots & Brass Watering Can */}
            <polygon points="12,14 20,14 18,24 14,24" fill="#D84315" />
            <polygon points="24,12 32,12 30,24 26,24" fill="#D84315" />
            <rect x="38" y="16" width="12" height="8" fill="#FBC02D" stroke="#F57F17" strokeWidth="1" rx="1" />
            <path d="M 48 18 Q 54 14 56 12" stroke="#F57F17" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Bàn Ươm Mầm</span>
        </div>

      </div>
    );
  }

  // 4. POND: STONE SHORELINE, WOODEN FISHING PIER, MOORED SKIFF BOAT
  if (areaId === 'pond') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-5">
        
        {/* Wooden Fishing Pier / Dock (Bottom-Right) */}
        <div className="absolute bottom-8 right-12 flex flex-col items-center">
          <svg className="w-24 h-18 filter drop-shadow-xl" viewBox="0 0 96 72">
            {/* Pier Planks extending into water */}
            <rect x="12" y="18" width="72" height="14" fill="#6D4C41" stroke="#3E2723" strokeWidth="2" rx="2" />
            <line x1="28" y1="18" x2="28" y2="32" stroke="#4E342E" strokeWidth="1.5" />
            <line x1="44" y1="18" x2="44" y2="32" stroke="#4E342E" strokeWidth="1.5" />
            <line x1="60" y1="18" x2="60" y2="32" stroke="#4E342E" strokeWidth="1.5" />
            {/* Piles / Wooden Posts in Water */}
            <rect x="18" y="32" width="6" height="24" fill="#4E342E" />
            <rect x="72" y="32" width="6" height="24" fill="#4E342E" />
            {/* Moored Wooden Skiff Boat */}
            <path d="M 40 44 Q 60 40 78 48 Q 66 62 42 60 Z" fill="#8D6E63" stroke="#3E2723" strokeWidth="2" />
            <line x1="68" y1="32" x2="64" y2="44" stroke="#FFF59D" strokeWidth="1.5" />
          </svg>
          <span className="font-pixel text-[8px] text-cyan-200 -mt-2 bg-black/70 px-1.5 rounded">Cầu Tàu Câu Cá 🎣</span>
        </div>

        {/* Blooming Pink Lotus Patch (Top-Left) */}
        <div className="absolute top-10 left-8 flex flex-col items-center">
          <svg className="w-16 h-12 filter drop-shadow" viewBox="0 0 64 48">
            {/* Giant Lotus Lilypad */}
            <ellipse cx="28" cy="28" rx="20" ry="12" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
            <polygon points="28,28 38,20 38,28" fill="#1B5E20" />
            {/* Pink Lotus Blossom */}
            <circle cx="28" cy="22" r="6" fill="#F06292" />
            <circle cx="28" cy="22" r="3" fill="#FFF59D" />
          </svg>
        </div>

      </div>
    );
  }

  // 5. PASTURE: TIMBER BARN FACADE, HAY BALES, MILK CHURNS
  if (areaId === 'pasture') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-5">
        
        {/* Red Timber Barn Facade (Top-Right) */}
        <div className="absolute top-6 right-6 flex flex-col items-center">
          <svg className="w-22 h-20 filter drop-shadow-xl" viewBox="0 0 88 80">
            {/* Barn Gambrel Roof */}
            <polygon points="44,4 12,24 76,24" fill="#B71C1C" stroke="#7F0000" strokeWidth="2" />
            <polygon points="44,6 14,24 74,24" fill="#D32F2F" />
            {/* Barn Front Wall with White Trim */}
            <rect x="14" y="24" width="60" height="48" fill="#C62828" stroke="#7F0000" strokeWidth="2" />
            {/* White Barn Cross Braces */}
            <line x1="14" y1="24" x2="74" y2="72" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="74" y1="24" x2="14" y2="72" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Hay Loft Window */}
            <rect x="36" y="30" width="16" height="14" fill="#212121" stroke="#FFFFFF" strokeWidth="1.5" rx="1" />
            <polygon points="36,44 44,40 52,44" fill="#FDD835" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/70 px-1.5 rounded">Chuồng Trại Oxford</span>
        </div>

        {/* Stack of Golden Hay Bales (Bottom-Left) */}
        <div className="absolute bottom-10 left-8 flex flex-col items-center">
          <svg className="w-16 h-14 filter drop-shadow-md" viewBox="0 0 64 56">
            {/* Bottom 2 Bales */}
            <rect x="4" y="28" width="26" height="18" fill="#FDD835" stroke="#F57F17" strokeWidth="2" rx="3" />
            <line x1="10" y1="28" x2="10" y2="46" stroke="#E65100" strokeWidth="1" />
            <line x1="22" y1="28" x2="22" y2="46" stroke="#E65100" strokeWidth="1" />
            
            <rect x="32" y="28" width="26" height="18" fill="#FDD835" stroke="#F57F17" strokeWidth="2" rx="3" />
            <line x1="38" y1="28" x2="38" y2="46" stroke="#E65100" strokeWidth="1" />
            <line x1="50" y1="28" x2="50" y2="46" stroke="#E65100" strokeWidth="1" />

            {/* Top Bale */}
            <rect x="18" y="12" width="26" height="18" fill="#FFEE58" stroke="#F57F17" strokeWidth="2" rx="3" />
            <line x1="24" y1="12" x2="24" y2="30" stroke="#E65100" strokeWidth="1" />
            <line x1="36" y1="12" x2="36" y2="30" stroke="#E65100" strokeWidth="1" />
          </svg>
          <span className="font-pixel text-[8px] text-amber-200/90 -mt-1 bg-black/60 px-1 rounded">Rơm Vàng</span>
        </div>

      </div>
    );
  }

  return null;
}
