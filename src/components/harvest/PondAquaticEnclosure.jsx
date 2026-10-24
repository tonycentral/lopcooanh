import React, { useState, useEffect, useRef } from 'react';

/**
 * Authentic 16-Bit Living Aquatic Enclosures for IELTS Pond (Khu Ao Hồ - Speaking)
 * Each of the 10 topics has its OWN DEDICATED AQUATIC BASIN / POOL
 * and AUTONOMOUS LIVING PIXEL ART FISH / WATER CREATURES that swim dynamically!
 */

export default function PondAquaticEnclosure({
  entity,
  isNearby = false
}) {
  const { type = 'fish_koi', level = 1, status = 'healthy' } = entity;
  const isWilting = status === 'wilting';
  const isHealthy = status === 'healthy';

  // Scale based on growth level 1..5
  const scale = 0.9 + (level - 1) * 0.08;

  // =========================================================================
  // AUTONOMOUS FISH SWIMMING ENGINE
  // Swims smoothly in curved arcs, turns around, wiggles tail & surfaces bubbles
  // =========================================================================
  const [swimPos, setSwimPos] = useState({ x: 0, y: 0 });
  const [swimPos2, setSwimPos2] = useState({ x: -10, y: 4 }); // Secondary fish for level >= 3
  const [facing, setFacing] = useState(1);
  const [tailFrame, setTailFrame] = useState(0);

  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId;
    let tailInterval;
    let isMounted = true;

    // Tail swishing animation loop
    tailInterval = setInterval(() => {
      if (isMounted) setTailFrame(f => (f + 1) % 4);
    }, 150);

    const scheduleNextSwim = () => {
      // Pick random waypoint every 2.0s to 3.8s
      const delay = 2000 + Math.random() * 1800;

      timeoutId = setTimeout(() => {
        if (!isMounted) return;

        const targetX = (Math.random() - 0.5) * 46;
        const targetY = (Math.random() - 0.5) * 20;

        const dx = targetX - posRef.current.x;
        if (Math.abs(dx) > 3) {
          setFacing(dx > 0 ? 1 : -1);
        }

        posRef.current = { x: targetX, y: targetY };
        setSwimPos({ x: targetX, y: targetY });

        // Secondary fish follows slightly behind with offset
        setSwimPos2({ 
          x: targetX - (dx > 0 ? 14 : -14), 
          y: targetY + (Math.random() - 0.5) * 10 
        });

        scheduleNextSwim();
      }, delay);
    };

    scheduleNextSwim();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearInterval(tailInterval);
    };
  }, []);

  // Determine Aquatic Category
  const isKoi = type.includes('koi');
  const isDragon = type.includes('dragon');
  const isCarp = type.includes('carp');
  const isDuck = type.includes('duck');
  const isGolden = type.includes('golden');
  const isAngel = type.includes('angel');
  const isOtter = type.includes('otter');
  const isSwan = type.includes('swan');
  const isTurtle = type.includes('turtle');
  const isGoldfish = type.includes('goldfish');

  // Tail wag angle in degrees
  const tailAngle = (tailFrame === 0 ? 8 : tailFrame === 2 ? -8 : 0);

  return (
    <div 
      className="relative flex flex-col items-center justify-end select-none font-pixel"
      style={{
        width: '124px',
        height: '96px',
        transform: `scale(${scale})`,
        imageRendering: 'pixelated'
      }}
    >
      {/* Selection Glow Ring */}
      {isNearby && (
        <div className="absolute inset-0 border-4 border-[#d9911e] bg-[#d9911e]/15 animate-pulse pointer-events-none z-0" />
      )}

      {/* =========================================================================
          1. SPECIFIC WATER BASIN / POND HABITAT FOR EACH OF THE 10 TOPICS
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-1">

        {/* --- POND 1: JAPANESE STONE KOI POND & PINK LOTUS --- */}
        {isKoi && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Natural Cobblestone Shoreline */}
            <ellipse cx="62" cy="54" rx="56" ry="34" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
            <ellipse cx="62" cy="54" rx="51" ry="29" fill="#243b35" stroke="#354d1f" strokeWidth="2" />
            <ellipse cx="62" cy="52" rx="45" ry="24" fill="#1b4d3e" />
            
            {/* Water Ripple Sheen */}
            <ellipse cx="62" cy="52" rx="36" ry="16" fill="none" stroke="#68b684" strokeWidth="1" opacity="0.3" />
            
            {/* Stepping River Stones & Pink Water Lily (Right) */}
            <ellipse cx="22" cy="46" rx="6" ry="4" fill="#d7b594" stroke="#45283c" strokeWidth="1" />
            <ellipse cx="98" cy="62" rx="7" ry="4.5" fill="#d7b594" stroke="#45283c" strokeWidth="1" />
            
            {/* Floating Lilypad & Pink Lotus */}
            <ellipse cx="90" cy="44" rx="10" ry="6" fill="#4b692f" stroke="#354d1f" strokeWidth="1" />
            <circle cx="90" cy="42" r="4.5" fill="#e8cfa6" stroke="#b93b2a" strokeWidth="1" />
            <circle cx="90" cy="42" r="1.5" fill="#d9911e" />
          </svg>
        )}

        {/* --- POND 2: CYBER DRAGONFISH DEEP CRYSTAL POOL --- */}
        {isDragon && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Deep Slate-Stone Basin */}
            <polygon points="12,30 112,30 118,78 6,78" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
            <polygon points="16,34 108,34 114,74 10,74" fill="#1f3b39" />
            <polygon points="20,38 104,38 108,70 16,70" fill="#164344" />
            
            {/* Neon Aqua Crystal Clusters (Corners) */}
            <polygon points="18,34 22,24 26,34" fill="#4b692f" stroke="#e8cfa6" strokeWidth="1" />
            <polygon points="25,34 28,20 31,34" fill="#68b684" stroke="#e8cfa6" strokeWidth="1" />
            <polygon points="98,34 102,22 106,34" fill="#68b684" stroke="#e8cfa6" strokeWidth="1" />
            
            {/* Glowing Water Gridlines */}
            <line x1="24" y1="52" x2="100" y2="52" stroke="#68b684" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
          </svg>
        )}

        {/* --- POND 3: SCHOLASTIC CARP WATERFALL SPRING POOL --- */}
        {isCarp && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Rocky Waterfall Spring Basin */}
            <ellipse cx="62" cy="54" rx="55" ry="32" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="49" ry="27" fill="#243b35" />
            
            {/* Frothing Waterfall Stones (Top) */}
            <rect x="42" y="22" width="40" height="12" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
            <path d="M 44 32 Q 62 38 80 32" stroke="#e8cfa6" strokeWidth="3" fill="none" />
            
            {/* Bubbling White Water Foam */}
            <circle cx="56" cy="40" r="3" fill="#ffffff" opacity="0.7" />
            <circle cx="68" cy="41" r="2.5" fill="#ffffff" opacity="0.7" />
            <circle cx="62" cy="43" r="2" fill="#ffffff" opacity="0.6" />
          </svg>
        )}

        {/* --- POND 4: WILD MALLARDS REED MARSH --- */}
        {isDuck && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Natural Marsh Basin with Muddy Banks */}
            <ellipse cx="62" cy="54" rx="56" ry="33" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="50" ry="28" fill="#354d1f" />
            <ellipse cx="62" cy="52" rx="44" ry="23" fill="#243b35" />
            
            {/* Tall Cattails / Bullrushes (Left & Right) */}
            <line x1="18" y1="62" x2="16" y2="28" stroke="#4b692f" strokeWidth="2" />
            <line x1="23" y1="64" x2="24" y2="24" stroke="#4b692f" strokeWidth="2" />
            <rect x="22" y="24" width="4" height="12" rx="2" fill="#8f563b" />
            
            <line x1="104" y1="62" x2="106" y2="26" stroke="#4b692f" strokeWidth="2" />
            <rect x="104" y="26" width="4" height="12" rx="2" fill="#8f563b" />
            
            {/* Floating Duckweed Patches */}
            <circle cx="40" cy="42" r="1.5" fill="#68b684" />
            <circle cx="43" cy="43" r="1.2" fill="#68b684" />
            <circle cx="41" cy="45" r="1" fill="#68b684" />
          </svg>
        )}

        {/* --- POND 5: GOLDEN AROWANA ROYAL WEALTH FOUNTAIN --- */}
        {isGolden && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Octagonal Royal Marble Basin */}
            <polygon points="32,24 92,24 116,48 116,72 92,88 32,88 8,72 8,48" fill="#e8cfa6" stroke="#45283c" strokeWidth="3" />
            <polygon points="35,28 89,28 112,50 112,70 89,84 35,84 12,70 12,50" fill="#243b35" />
            
            {/* Golden Coins submerged on the fountain floor */}
            <circle cx="46" cy="62" r="3.5" fill="#d9911e" stroke="#8f563b" strokeWidth="1" />
            <circle cx="78" cy="64" r="3.5" fill="#d9911e" stroke="#8f563b" strokeWidth="1" />
            <circle cx="62" cy="72" r="4" fill="#d9911e" stroke="#8f563b" strokeWidth="1" />
            
            {/* Golden Rim Ornaments */}
            <circle cx="8" cy="48" r="3" fill="#d9911e" />
            <circle cx="116" cy="48" r="3" fill="#d9911e" />
          </svg>
        )}

        {/* --- POND 6: HEALING ANGELFISH CRYSTAL AQUARIUM --- */}
        {isAngel && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Pure Turquoise Crystal Basin */}
            <ellipse cx="62" cy="54" rx="55" ry="32" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="49" ry="27" fill="#1f423d" />
            
            {/* Tall Undulating Water Grasses (Vallisneria) */}
            <path d="M 28 66 Q 22 46 26 30" stroke="#4b692f" strokeWidth="2.5" fill="none" />
            <path d="M 34 68 Q 40 48 36 28" stroke="#68b684" strokeWidth="2" fill="none" />
            <path d="M 94 66 Q 98 46 94 28" stroke="#4b692f" strokeWidth="2.5" fill="none" />
            
            {/* Rising Bubbles */}
            <circle cx="32" cy="44" r="1.5" fill="#ffffff" opacity="0.6" />
            <circle cx="33" cy="36" r="1.8" fill="#ffffff" opacity="0.7" />
            <circle cx="92" cy="40" r="1.5" fill="#ffffff" opacity="0.6" />
          </svg>
        )}

        {/* --- POND 7: OTTER RIVERBANK WITH FLOATING LOG --- */}
        {isOtter && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Riverbank Basin */}
            <ellipse cx="62" cy="54" rx="56" ry="33" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="50" ry="28" fill="#243b35" />
            
            {/* Floating Driftwood Log (Top-Right) */}
            <rect x="70" y="38" width="34" height="10" rx="4" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
            <line x1="74" y1="42" x2="100" y2="42" stroke="#663931" strokeWidth="1.5" />
            
            {/* River Stones */}
            <ellipse cx="24" cy="58" rx="7" ry="5" fill="#d7b594" stroke="#45283c" strokeWidth="1.5" />
          </svg>
        )}

        {/* --- POND 8: URBAN SWAN GLASS-LIKE LAKE --- */}
        {isSwan && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Pristine Glass Water Mirror */}
            <ellipse cx="62" cy="54" rx="56" ry="34" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="50" ry="28" fill="#1b423c" />
            
            {/* White Water Lily Blossoms */}
            <ellipse cx="26" cy="46" rx="9" ry="5" fill="#4b692f" />
            <circle cx="26" cy="44" r="4" fill="#ffffff" stroke="#d7b594" strokeWidth="1" />
            <circle cx="26" cy="44" r="1.5" fill="#d9911e" />
            
            {/* Water Sheen Ring */}
            <ellipse cx="62" cy="54" rx="38" ry="18" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />
          </svg>
        )}

        {/* --- POND 9: LAW TURTLE SUNNING ROCK POND --- */}
        {isTurtle && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Ancient Muddy Pool */}
            <ellipse cx="62" cy="54" rx="56" ry="33" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="50" ry="28" fill="#243b35" />
            
            {/* Massive Sunning Boulder in the center-left */}
            <ellipse cx="44" cy="52" rx="16" ry="12" fill="#8f563b" stroke="#45283c" strokeWidth="2.5" />
            <ellipse cx="44" cy="50" rx="12" ry="9" fill="#d7b594" stroke="#663931" strokeWidth="1.5" />
            <rect x="40" y="46" width="6" height="3" fill="#4b692f" /> {/* Moss patch */}
            
            {/* Water Grass */}
            <path d="M 96 64 Q 102 44 98 28" stroke="#4b692f" strokeWidth="2" fill="none" />
          </svg>
        )}

        {/* --- POND 10: ROYAL GOLDFISH & SACRED LOTUS BOWL --- */}
        {isGoldfish && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Celadon Green Ceramic Glazed Basin */}
            <ellipse cx="62" cy="54" rx="56" ry="34" fill="#68b684" stroke="#45283c" strokeWidth="3" />
            <ellipse cx="62" cy="53" rx="50" ry="28" fill="#1b4d3e" />
            
            {/* Sacred Pink Lotus in Full Bloom (Center-Top) */}
            <ellipse cx="62" cy="38" rx="13" ry="7" fill="#4b692f" stroke="#354d1f" strokeWidth="1" />
            <polygon points="56,38 62,26 68,38" fill="#e8cfa6" stroke="#b93b2a" strokeWidth="1" />
            <polygon points="52,38 56,30 62,38" fill="#ffffff" />
            <polygon points="62,38 68,30 72,38" fill="#ffffff" />
            <circle cx="62" cy="35" r="2.5" fill="#d9911e" />
          </svg>
        )}

      </div>

      {/* =========================================================================
          2. AUTONOMOUS LIVING PIXEL ART CREATURE (SWIMMING / PADDLING DYNAMICALLY)
          ========================================================================= */}
      <div 
        className="absolute z-10 pointer-events-none transition-transform"
        style={{
          left: '50%',
          top: '54%',
          transform: `translate(calc(-50% + ${swimPos.x}px), calc(-50% + ${swimPos.y}px)) scaleX(${facing})`,
          transition: 'transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform'
        }}
      >
        {/* Subtle Water Ripple beneath swimming creature */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-9 h-3 rounded-full border border-white/20 bg-white/10 animate-ping opacity-40 pointer-events-none" />

        {/* --- 1. KOI FISH (Orange, White & Black Calico) --- */}
        {isKoi && (
          <div className="relative w-12 h-6">
            <svg viewBox="0 0 48 24" className="w-full h-full">
              {/* Torpedo Fish Body */}
              <ellipse cx="26" cy="12" rx="14" ry="7" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
              {/* Orange Calico Patches */}
              <ellipse cx="24" cy="10" rx="7" ry="4" fill="#d9911e" />
              <ellipse cx="32" cy="13" rx="4" ry="3" fill="#b93b2a" />
              <circle cx="18" cy="14" r="2" fill="#45283c" />
              
              {/* Head & Eye */}
              <circle cx="36" cy="11" r="1.5" fill="#2c1b18" />
              {/* Pectoral Fins */}
              <ellipse cx="28" cy="17" rx="4" ry="2.5" fill="#ffffff" stroke="#45283c" strokeWidth="0.8" />
              <ellipse cx="28" cy="7" rx="4" ry="2.5" fill="#ffffff" stroke="#45283c" strokeWidth="0.8" />
              
              {/* Moving Tail Fin */}
              <g style={{ transform: `rotate(${tailAngle}deg)`, transformOrigin: '12px 12px' }}>
                <polygon points="12,12 3,6 6,12 3,18" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              </g>
            </svg>
          </div>
        )}

        {/* --- 2. CYBER AROWANA / DRAGONFISH --- */}
        {isDragon && (
          <div className="relative w-14 h-7">
            <svg viewBox="0 0 56 28" className="w-full h-full">
              {/* Elongated Shimmering Dragon Body */}
              <polygon points="16,14 44,8 48,14 44,20" fill="#68b684" stroke="#45283c" strokeWidth="1.5" />
              <rect x="20" y="10" width="22" height="8" fill="#e8cfa6" opacity="0.6" />
              
              {/* Dragon Barbels / Whiskers on Chin */}
              <line x1="48" y1="14" x2="54" y2="12" stroke="#d9911e" strokeWidth="1.5" />
              <line x1="48" y1="16" x2="54" y2="18" stroke="#d9911e" strokeWidth="1.5" />
              <circle cx="44" cy="12" r="1.5" fill="#2c1b18" />
              
              {/* Dorsal & Ventral Fin Ribbons */}
              <line x1="20" y1="9" x2="40" y2="9" stroke="#d9911e" strokeWidth="2" />
              <line x1="20" y1="19" x2="40" y2="19" stroke="#d9911e" strokeWidth="2" />
              
              {/* Ribbon Tail */}
              <g style={{ transform: `rotate(${tailAngle}deg)`, transformOrigin: '16px 14px' }}>
                <polygon points="16,14 4,8 7,14 4,20" fill="#4b692f" stroke="#45283c" strokeWidth="1" />
              </g>
            </svg>
          </div>
        )}

        {/* --- 3. SCHOLASTIC GOLDEN CARP --- */}
        {isCarp && (
          <div className="relative w-12 h-7">
            <svg viewBox="0 0 48 28" className="w-full h-full">
              {/* Stout Bronze/Gold Body */}
              <ellipse cx="26" cy="14" rx="14" ry="8" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="24" cy="14" rx="10" ry="5" fill="#e8cfa6" />
              {/* Big Golden Fish Eye */}
              <circle cx="36" cy="12" r="2" fill="#ffffff" />
              <circle cx="36" cy="12" r="1" fill="#2c1b18" />
              
              {/* Dorsal Fin Spines */}
              <polygon points="20,6 24,2 28,6 32,2 36,6" fill="#8f563b" />
              
              {/* Big Fan Tail */}
              <g style={{ transform: `rotate(${tailAngle}deg)`, transformOrigin: '12px 14px' }}>
                <polygon points="12,14 2,6 5,14 2,22" fill="#d9911e" stroke="#45283c" strokeWidth="1.2" />
              </g>
            </svg>
          </div>
        )}

        {/* --- 4. WILD MALLARD DUCK (SURFACE SWIMMER) --- */}
        {isDuck && (
          <div className="relative w-11 h-9">
            <svg viewBox="0 0 44 36" className="w-full h-full">
              {/* Duck Body Floating */}
              <ellipse cx="20" cy="22" rx="11" ry="8" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="18" cy="22" rx="6" ry="4" fill="#663931" />
              {/* Emerald Green Duck Head */}
              <circle cx="28" cy="13" r="6" fill="#4b692f" stroke="#45283c" strokeWidth="1.5" />
              <rect x="25" y="17" width="6" height="2" fill="#ffffff" /> {/* White neck collar */}
              <polygon points="33,13 41,15 33,17" fill="#d9911e" stroke="#45283c" strokeWidth="1" /> {/* Yellow bill */}
              <circle cx="30" cy="12" r="1" fill="#2c1b18" />
              {/* Upturned Tail Feather */}
              <polygon points="9,21 3,16 7,24" fill="#2c1b18" />
            </svg>
          </div>
        )}

        {/* --- 5. GOLDEN WEALTH AROWANA --- */}
        {isGolden && (
          <div className="relative w-13 h-7">
            <svg viewBox="0 0 52 28" className="w-full h-full">
              {/* Radiant Gold Scaled Body */}
              <ellipse cx="28" cy="14" rx="16" ry="8" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="28" cy="14" rx="12" ry="5" fill="#e8cfa6" />
              <circle cx="40" cy="12" r="2" fill="#ffffff" />
              <circle cx="40" cy="12" r="1" fill="#2c1b18" />
              {/* Gold Tail */}
              <g style={{ transform: `rotate(${tailAngle}deg)`, transformOrigin: '12px 14px' }}>
                <polygon points="12,14 2,7 6,14 2,21" fill="#d9911e" stroke="#45283c" strokeWidth="1.2" />
              </g>
            </svg>
          </div>
        )}

        {/* --- 6. FRESHWATER ANGELFISH --- */}
        {isAngel && (
          <div className="relative w-10 h-12">
            <svg viewBox="0 0 40 48" className="w-full h-full">
              {/* Tall Diamond-shaped Body */}
              <polygon points="8,24 22,14 32,24 22,34" fill="#e8cfa6" stroke="#45283c" strokeWidth="1.5" />
              {/* Vertical Dark Stripes */}
              <line x1="18" y1="18" x2="18" y2="30" stroke="#45283c" strokeWidth="2" />
              <line x1="25" y1="16" x2="25" y2="32" stroke="#45283c" strokeWidth="2" />
              {/* High Triangular Dorsal Fin */}
              <polygon points="20,15 22,2 26,16" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
              {/* Long Trailing Ventral Fin Streamers */}
              <polygon points="20,33 22,46 26,32" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
              {/* Eye & Mouth */}
              <circle cx="28" cy="22" r="1.5" fill="#2c1b18" />
              <polygon points="32,23 36,24 32,25" fill="#d9911e" />
              {/* Fan Tail */}
              <polygon points="8,24 1,18 4,24 1,30" fill="#e8cfa6" stroke="#45283c" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* --- 7. PLAYFUL RIVER OTTER --- */}
        {isOtter && (
          <div className="relative w-13 h-7">
            <svg viewBox="0 0 52 28" className="w-full h-full">
              {/* Sleek Brown Swimmer Body */}
              <ellipse cx="26" cy="14" rx="16" ry="7" fill="#663931" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="28" cy="15" rx="8" ry="4" fill="#e8cfa6" /> {/* Pale belly */}
              {/* Cute Round Otter Head */}
              <circle cx="40" cy="12" r="6" fill="#663931" stroke="#45283c" strokeWidth="1.2" />
              <circle cx="43" cy="13" r="1.5" fill="#2c1b18" /> {/* Nose */}
              <circle cx="40" cy="10" r="1.2" fill="#ffffff" /> {/* Eye */}
              <circle cx="40" cy="10" r="0.6" fill="#2c1b18" />
              <circle cx="36" cy="8" r="1.5" fill="#45283c" /> {/* Round ear */}
              {/* Tapered Swimming Tail */}
              <path d="M 10 14 Q 2 12 1 17 Q 6 18 11 16" fill="#663931" stroke="#45283c" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* --- 8. ELEGANT WHITE MUTE SWAN --- */}
        {isSwan && (
          <div className="relative w-12 h-11">
            <svg viewBox="0 0 48 44" className="w-full h-full">
              {/* Pure White Swan Body */}
              <ellipse cx="20" cy="28" rx="13" ry="9" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
              {/* High S-Curved Neck */}
              <path d="M 26 28 Q 34 18 30 10 Q 30 6 34 6" stroke="#ffffff" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              {/* Head & Orange/Black Bill */}
              <circle cx="34" cy="6" r="4" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <polygon points="36,5 44,7 36,9" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <polygon points="34,4 37,6 34,7" fill="#2c1b18" /> {/* Black basal knob */}
              <circle cx="33" cy="5" r="0.8" fill="#2c1b18" />
            </svg>
          </div>
        )}

        {/* --- 9. ANCIENT POND TURTLE --- */}
        {isTurtle && (
          <div className="relative w-12 h-9">
            <svg viewBox="0 0 48 36" className="w-full h-full">
              {/* Patterned Carapace Shell */}
              <ellipse cx="24" cy="18" rx="14" ry="11" fill="#4b692f" stroke="#45283c" strokeWidth="2" />
              {/* Shell Scutes Hexagons */}
              <polygon points="24,11 29,14 29,20 24,23 19,20 19,14" fill="#354d1f" stroke="#68b684" strokeWidth="1" />
              
              {/* Green Turtle Head & Neck */}
              <rect x="36" y="15" width="8" height="6" rx="3" fill="#68b684" stroke="#45283c" strokeWidth="1" />
              <circle cx="41" cy="16" r="1" fill="#2c1b18" />
              
              {/* 4 Paddling Flippers */}
              <ellipse cx="14" cy="8" rx="5" ry="3" fill="#68b684" stroke="#45283c" strokeWidth="1" />
              <ellipse cx="32" cy="8" rx="5" ry="3" fill="#68b684" stroke="#45283c" strokeWidth="1" />
              <ellipse cx="14" cy="28" rx="5" ry="3" fill="#68b684" stroke="#45283c" strokeWidth="1" />
              <ellipse cx="32" cy="28" rx="5" ry="3" fill="#68b684" stroke="#45283c" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* --- 10. ROYAL FANCY GOLDFISH (RYUKIN) --- */}
        {isGoldfish && (
          <div className="relative w-12 h-8">
            <svg viewBox="0 0 48 32" className="w-full h-full">
              {/* Chubby Round Red-Gold Body */}
              <ellipse cx="28" cy="16" rx="12" ry="9" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="30" cy="16" rx="7" ry="5" fill="#e8cfa6" />
              {/* Big Goldfish Bubble Eye */}
              <circle cx="36" cy="13" r="2.5" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <circle cx="36" cy="13" r="1.2" fill="#2c1b18" />
              
              {/* Luxurious Flowing Veil Tail */}
              <g style={{ transform: `rotate(${tailAngle * 1.5}deg)`, transformOrigin: '16px 16px' }}>
                <path d="M 16 16 Q 4 4 1 8 Q 8 16 1 24 Q 4 28 16 16" fill="#e8cfa6" stroke="#d9911e" strokeWidth="1.2" opacity="0.9" />
              </g>
            </svg>
          </div>
        )}

      </div>

      {/* =========================================================================
          3. SECOND COMPANION FISH (Level >= 3)
          ========================================================================= */}
      {level >= 3 && !isDuck && !isSwan && (
        <div 
          className="absolute z-9 pointer-events-none transition-transform"
          style={{
            left: '50%',
            top: '54%',
            transform: `translate(calc(-50% + ${swimPos2.x}px), calc(-50% + ${swimPos2.y}px)) scaleX(${facing}) scale(0.65)`,
            transition: 'transform 2.6s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform'
          }}
        >
          <div className="relative w-10 h-6 opacity-85">
            <svg viewBox="0 0 40 24" className="w-full h-full">
              <ellipse cx="22" cy="12" rx="10" ry="5" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <circle cx="28" cy="10" r="1.2" fill="#2c1b18" />
              <polygon points="12,12 3,7 6,12 3,17" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      )}

      {/* Baby Duckling for Duck Family (Level >= 3) */}
      {level >= 3 && isDuck && (
        <div 
          className="absolute z-9 pointer-events-none transition-transform"
          style={{
            left: '50%',
            top: '54%',
            transform: `translate(calc(-50% + ${swimPos2.x}px), calc(-50% + ${swimPos2.y}px)) scaleX(${facing}) scale(0.6)`,
            transition: 'transform 2.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="relative w-8 h-6">
            <svg viewBox="0 0 32 24">
              <ellipse cx="14" cy="14" rx="7" ry="5" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <circle cx="20" cy="8" r="4" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <polygon points="23,8 28,9 23,10" fill="#8f563b" />
              <circle cx="21" cy="7" r="0.8" fill="#2c1b18" />
            </svg>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. LEVEL 5 GOLDEN SACRED AURA
          ========================================================================= */}
      {level === 5 && (
        <div className="absolute top-1 right-2 z-20 animate-bounce">
          <svg width="22" height="26" viewBox="0 0 24 28">
            <circle cx="12" cy="10" r="7" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
            <polygon points="9,16 6,26 12,22 18,26 15,16" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
            <circle cx="12" cy="10" r="3" fill="#ffffff" />
          </svg>
        </div>
      )}

    </div>
  );
}
