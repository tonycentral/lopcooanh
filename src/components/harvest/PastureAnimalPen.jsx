import React, { useState, useEffect, useRef } from 'react';

/**
 * Authentic 16-Bit Living Livestock Enclosures for IELTS Pasture (Chăn Nuôi - Listening)
 * Each of the 10 topics has its OWN DEDICATED PEN / COOP / STABLE
 * and an AUTONOMOUS LIVING PIXEL ART ANIMAL that wanders within its pen!
 */

export default function PastureAnimalPen({
  entity,
  isNearby = false
}) {
  const { type = 'cow_dairy', level = 1, status = 'healthy' } = entity;
  const isWilting = status === 'wilting';
  const isThirsty = status === 'thirsty';
  const isHealthy = status === 'healthy';

  // Scale based on growth level 1..5
  const scale = 0.9 + (level - 1) * 0.08;

  // =========================================================================
  // AUTONOMOUS ANIMAL WANDERING ENGINE
  // Moves around within its pen boundaries, flips direction, walks & idles
  // =========================================================================
  const [animalPos, setAnimalPos] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [isWalking, setIsWalking] = useState(false);
  const [idleAction, setIdleAction] = useState('idle'); // 'idle' | 'eat' | 'look'
  const [walkStep, setWalkStep] = useState(0);

  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId;
    let stepInterval;
    let isMounted = true;

    const scheduleNextWander = () => {
      // Pick random delay between 2.2s and 4.5s
      const delay = 2200 + Math.random() * 2300;

      timeoutId = setTimeout(() => {
        if (!isMounted) return;

        // 70% chance to walk, 30% chance to do idle action in place
        if (Math.random() < 0.75) {
          // New target within pen bounds (-24px to +24px horizontal, -8px to +10px vertical)
          const targetX = (Math.random() - 0.5) * 44;
          const targetY = (Math.random() - 0.5) * 16;

          const dx = targetX - posRef.current.x;
          if (Math.abs(dx) > 3) {
            setFacing(dx > 0 ? 1 : -1);
          }

          setIsWalking(true);
          posRef.current = { x: targetX, y: targetY };
          setAnimalPos({ x: targetX, y: targetY });

          // Walk step animation loop
          stepInterval = setInterval(() => {
            if (isMounted) setWalkStep(s => (s + 1) % 4);
          }, 180);

          // Stop walking after 1.4s
          setTimeout(() => {
            if (!isMounted) return;
            setIsWalking(false);
            clearInterval(stepInterval);
            // Trigger eating/grazing when stopping
            setIdleAction(Math.random() < 0.6 ? 'eat' : 'look');
            setTimeout(() => {
              if (isMounted) setIdleAction('idle');
            }, 1200);
          }, 1400);

        } else {
          // Idle action in place
          setIdleAction(Math.random() < 0.5 ? 'eat' : 'look');
          setTimeout(() => {
            if (isMounted) setIdleAction('idle');
          }, 1500);
        }

        scheduleNextWander();
      }, delay);
    };

    scheduleNextWander();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearInterval(stepInterval);
    };
  }, []);

  // Determine Animal Category
  const isCow = type.includes('cow');
  const isChicken = type.includes('chicken');
  const isSheep = type.includes('sheep');
  const isDog = type.includes('dog');
  const isBull = type.includes('bull');
  const isGoat = type.includes('goat');
  const isHorse = type.includes('horse');
  const isLlama = type.includes('llama');
  const isGeese = type.includes('geese');
  const isPheasant = type.includes('pheasant');

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
          1. SPECIFIC CUSTOM PEN / BARN STRUCTURE FOR EACH ANIMAL SPECIES
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-1">
        
        {/* --- PEN 1: DAIRY COW BARN SHED --- */}
        {isCow && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Ground Soil & Fresh Straw Bedding */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#8f563b" />
            <rect x="20" y="56" width="40" height="24" fill="#e8cfa6" opacity="0.6" />
            
            {/* Red Barn Timber Back Wall */}
            <rect x="8" y="16" width="108" height="30" fill="#8f563b" stroke="#45283c" strokeWidth="3" />
            <rect x="12" y="20" width="100" height="22" fill="#663931" />
            {/* White Barn Cross Braces */}
            <line x1="16" y1="22" x2="48" y2="40" stroke="#e8cfa6" strokeWidth="2.5" />
            <line x1="48" y1="22" x2="16" y2="40" stroke="#e8cfa6" strokeWidth="2.5" />
            <line x1="76" y1="22" x2="108" y2="40" stroke="#e8cfa6" strokeWidth="2.5" />
            <line x1="108" y1="22" x2="76" y2="40" stroke="#e8cfa6" strokeWidth="2.5" />
            
            {/* Wood Feed Trough & Milk Can */}
            <rect x="80" y="62" width="28" height="14" fill="#45283c" stroke="#2c1b18" strokeWidth="2" />
            <rect x="82" y="60" width="24" height="4" fill="#4b692f" /> {/* Green clover */}
            {/* Tin Milk Churn */}
            <rect x="14" y="64" width="8" height="12" fill="#d7b594" stroke="#45283c" strokeWidth="1.5" />
            <rect x="15" y="60" width="6" height="4" fill="#e8cfa6" />
          </svg>
        )}

        {/* --- PEN 2: CHICKEN COOP WITH ROOST LADDER --- */}
        {isChicken && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Yard Soil & Grain */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#8f563b" />
            
            {/* Henhouse Mini Barn (Left side) */}
            <polygon points="12,28 36,12 60,28" fill="#8f563b" stroke="#45283c" strokeWidth="2.5" />
            <rect x="16" y="28" width="40" height="26" fill="#663931" stroke="#45283c" strokeWidth="2" />
            <rect x="28" y="38" width="16" height="16" fill="#2c1b18" /> {/* Coop entrance */}
            
            {/* Coop Roost Ramp / Ladder */}
            <line x1="36" y1="46" x2="56" y2="66" stroke="#45283c" strokeWidth="3" />
            <line x1="40" y1="48" x2="44" y2="52" stroke="#e8cfa6" strokeWidth="2" />
            <line x1="46" y1="54" x2="50" y2="58" stroke="#e8cfa6" strokeWidth="2" />
            
            {/* Feed Bowl & Golden Grain */}
            <ellipse cx="88" cy="68" rx="10" ry="5" fill="#45283c" />
            <circle cx="86" cy="67" r="1.5" fill="#d9911e" />
            <circle cx="89" cy="67" r="1.5" fill="#d9911e" />
            <circle cx="88" cy="69" r="1.5" fill="#d9911e" />
            
            {/* Fence Rail */}
            <line x1="62" y1="48" x2="114" y2="48" stroke="#45283c" strokeWidth="2.5" />
            <line x1="62" y1="60" x2="114" y2="60" stroke="#45283c" strokeWidth="2.5" />
            <rect x="84" y="44" width="4" height="22" fill="#45283c" />
            <rect x="110" y="44" width="4" height="22" fill="#45283c" />
          </svg>
        )}

        {/* --- PEN 3: SHEEP PADDOCK & WOOL BASKET --- */}
        {isSheep && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Green Meadow Turf */}
            <rect x="8" y="44" width="108" height="48" fill="#4b692f" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#4b692f" />
            
            {/* Little Meadow Daisy Flowers */}
            <circle cx="24" cy="56" r="2" fill="#ffffff" />
            <circle cx="24" cy="56" r="1" fill="#d9911e" />
            <circle cx="94" cy="74" r="2" fill="#ffffff" />
            <circle cx="94" cy="74" r="1" fill="#d9911e" />
            
            {/* White/Paper Picket Fence Posts */}
            <line x1="8" y1="48" x2="116" y2="48" stroke="#45283c" strokeWidth="2.5" />
            <line x1="8" y1="60" x2="116" y2="60" stroke="#45283c" strokeWidth="2.5" />
            {[14, 38, 62, 86, 110].map((px, i) => (
              <g key={i}>
                <rect x={px} y="40" width="6" height="24" fill="#e8cfa6" stroke="#45283c" strokeWidth="1.5" />
                <polygon points={`${px},40 ${px+3},36 ${px+6},40`} fill="#e8cfa6" />
              </g>
            ))}
            
            {/* Woven Wool Basket (Right) */}
            <rect x="88" y="66" width="18" height="14" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
            <circle cx="94" cy="65" r="4" fill="#ffffff" stroke="#d7b594" strokeWidth="1" />
            <circle cx="100" cy="66" r="3.5" fill="#ffffff" stroke="#d7b594" strokeWidth="1" />
          </svg>
        )}

        {/* --- PEN 4: COLLIE DOGHOUSE & PLAY YARD --- */}
        {isDog && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Yard Soil & Grass */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#4b692f" />
            
            {/* Doghouse (Left side) */}
            <polygon points="12,24 32,8 52,24" fill="#8f563b" stroke="#45283c" strokeWidth="2.5" />
            <polygon points="14,24 32,10 50,24" fill="#663931" />
            <rect x="16" y="24" width="32" height="26" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
            <ellipse cx="32" cy="40" rx="7" ry="10" fill="#2c1b18" /> {/* Arched door */}
            
            {/* Dog Chew Bone & Bowl (Right) */}
            <rect x="84" y="68" width="16" height="6" fill="#d7b594" stroke="#45283c" strokeWidth="1.5" />
            <circle cx="84" cy="71" r="2.5" fill="#ffffff" />
            <circle cx="100" cy="71" r="2.5" fill="#ffffff" />
            
            {/* Backyard Fence */}
            <line x1="56" y1="46" x2="114" y2="46" stroke="#45283c" strokeWidth="2" />
            <line x1="56" y1="56" x2="114" y2="56" stroke="#45283c" strokeWidth="2" />
          </svg>
        )}

        {/* --- PEN 5: PRIME ANGUS CORRAL & ROUND HAY BALE --- */}
        {isBull && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Heavy Soil */}
            <rect x="8" y="44" width="108" height="48" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#663931" />
            
            {/* Heavy Reinforced Timber Rails */}
            <line x1="8" y1="36" x2="116" y2="36" stroke="#45283c" strokeWidth="4" />
            <line x1="8" y1="48" x2="116" y2="48" stroke="#45283c" strokeWidth="4" />
            <line x1="8" y1="60" x2="116" y2="60" stroke="#45283c" strokeWidth="4" />
            {[16, 44, 72, 100].map((px, i) => (
              <rect key={i} x={px} y="30" width="8" height="36" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
            ))}
            
            {/* Giant Round Golden Hay Bale (Right) */}
            <ellipse cx="96" cy="66" rx="14" ry="12" fill="#d9911e" stroke="#45283c" strokeWidth="2" />
            <ellipse cx="96" cy="66" rx="10" ry="8" fill="#e8cfa6" stroke="#8f563b" strokeWidth="1" />
            <circle cx="96" cy="66" r="3" fill="#663931" />
          </svg>
        )}

        {/* --- PEN 6: ALPINE GOAT ROCKY PEN --- */}
        {isGoat && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Rocky Soil */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#8f563b" />
            
            {/* Goat Climbing Rock Mound (Left side) */}
            <polygon points="12,74 24,42 46,38 60,74" fill="#d7b594" stroke="#45283c" strokeWidth="2.5" />
            <polygon points="26,44 44,40 54,58 20,64" fill="#e8cfa6" />
            <rect x="30" y="38" width="12" height="4" fill="#45283c" /> {/* Rock perch */}
            
            {/* Dried Herb Hanging Rack (Right) */}
            <line x1="80" y1="36" x2="108" y2="36" stroke="#45283c" strokeWidth="2.5" />
            <rect x="82" y="38" width="6" height="18" fill="#4b692f" />
            <rect x="94" y="38" width="6" height="16" fill="#4b692f" />
            <rect x="104" y="38" width="6" height="20" fill="#4b692f" />
          </svg>
        )}

        {/* --- PEN 7: HORSE CAREER STABLE STALL --- */}
        {isHorse && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Straw Bedding Floor */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#d9911e" opacity="0.65" />
            
            {/* Rich Oak Stable Wall with Gabled Eaves */}
            <rect x="8" y="16" width="108" height="32" fill="#8f563b" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="20" width="96" height="24" fill="#663931" />
            
            {/* Stable Half-Door (Dutch Door) */}
            <rect x="42" y="24" width="40" height="20" fill="#45283c" stroke="#2c1b18" strokeWidth="2" />
            <line x1="42" y1="34" x2="82" y2="34" stroke="#d7b594" strokeWidth="1.5" />
            {/* Brass Horseshoe Plaque */}
            <circle cx="62" cy="22" r="4" fill="none" stroke="#d9911e" strokeWidth="2" />
            
            {/* Corner Hay Feeder */}
            <polygon points="14,48 28,48 24,64 14,64" fill="#45283c" />
            <rect x="16" y="46" width="10" height="4" fill="#e8cfa6" />
          </svg>
        )}

        {/* --- PEN 8: LLAMA / ALPACA THATCED CANOPY --- */}
        {isLlama && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Dry Meadow Turf */}
            <rect x="8" y="44" width="108" height="48" fill="#8f563b" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#d7b594" opacity="0.8" />
            
            {/* Thatched Straw Canopy (Top) */}
            <polygon points="16,22 62,8 108,22" fill="#d9911e" stroke="#45283c" strokeWidth="2.5" />
            <polygon points="20,22 62,10 104,22" fill="#e8cfa6" />
            {/* Bamboo Support Posts */}
            <rect x="22" y="22" width="5" height="36" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
            <rect x="98" y="22" width="5" height="36" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
            
            {/* Woven Wool Blanket hanging */}
            <rect x="80" y="48" width="16" height="14" fill="#4b692f" stroke="#45283c" strokeWidth="1.5" />
            <rect x="80" y="52" width="16" height="4" fill="#d9911e" />
          </svg>
        )}

        {/* --- PEN 9: WATCHFUL GEESE POND PEN --- */}
        {isGeese && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Marsh Ground */}
            <rect x="8" y="44" width="108" height="48" fill="#4b692f" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#4b692f" />
            
            {/* Wading Water Saucer Pool (Left side) */}
            <ellipse cx="36" cy="68" rx="20" ry="12" fill="#354d1f" stroke="#45283c" strokeWidth="2" />
            <ellipse cx="36" cy="67" rx="16" ry="9" fill="#243b35" />
            
            {/* Willow Wattle Fence */}
            <line x1="8" y1="46" x2="116" y2="46" stroke="#45283c" strokeWidth="2.5" />
            <line x1="8" y1="56" x2="116" y2="56" stroke="#45283c" strokeWidth="2.5" />
            {[18, 42, 66, 90, 110].map((px, i) => (
              <rect key={i} x={px} y="40" width="4" height="24" fill="#663931" />
            ))}
          </svg>
        )}

        {/* --- PEN 10: ROYAL PHEASANT AVIARY PERCH --- */}
        {isPheasant && (
          <svg className="w-full h-full" viewBox="0 0 124 96">
            {/* Garden Ground */}
            <rect x="8" y="44" width="108" height="48" fill="#663931" stroke="#45283c" strokeWidth="3" />
            <rect x="14" y="50" width="96" height="36" fill="#4b692f" />
            
            {/* Imperial Curved Pagoda Eaves (Top) */}
            <path d="M 12 24 Q 62 10 112 24 L 104 28 Q 62 18 20 28 Z" fill="#45283c" stroke="#2c1b18" strokeWidth="2" />
            <path d="M 22 28 Q 62 19 102 28" stroke="#d9911e" strokeWidth="2" fill="none" />
            
            {/* Ornate Red Timber Perch Posts */}
            <rect x="22" y="28" width="6" height="40" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
            <rect x="96" y="28" width="6" height="40" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
            {/* Wooden Perch Branch */}
            <line x1="28" y1="46" x2="96" y2="46" stroke="#663931" strokeWidth="4" />
          </svg>
        )}

      </div>

      {/* =========================================================================
          2. AUTONOMOUS LIVING PIXEL ART ANIMAL (WANDERING IN PEN)
          ========================================================================= */}
      <div 
        className="absolute z-10 pointer-events-none transition-transform"
        style={{
          left: '50%',
          top: '56%',
          transform: `translate(calc(-50% + ${animalPos.x}px), calc(-50% + ${animalPos.y}px)) scaleX(${facing})`,
          transition: isWalking ? 'transform 1.4s linear' : 'transform 0.2s ease',
          willChange: 'transform'
        }}
      >
        {/* Shadow under animal feet */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-black/40 blur-[0.5px]" />

        {/* --- PIXEL ART: DAIRY COW --- */}
        {isCow && (
          <div className={`relative w-12 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 48 40" className="w-full h-full">
              {/* Cow Body (White with black patches) */}
              <rect x="8" y="14" width="28" height="16" fill="#ffffff" stroke="#45283c" strokeWidth="2" />
              {/* Black Holsten Spots */}
              <rect x="14" y="16" width="8" height="8" fill="#45283c" />
              <rect x="26" y="18" width="6" height="7" fill="#45283c" />
              
              {/* Head & Muzzle */}
              <rect x="30" y="8" width="14" height="14" fill="#ffffff" stroke="#45283c" strokeWidth="2" />
              <rect x="34" y="10" width="5" height="5" fill="#45283c" /> {/* Eye spot */}
              <rect x="37" y="12" width="2" height="2" fill="#ffffff" /> {/* Eye glint */}
              {/* Pink Snout / Muzzle */}
              <rect x="36" y="16" width="9" height="6" fill="#e8cfa6" stroke="#45283c" strokeWidth="1.5" />
              <circle cx="39" cy="19" r="0.8" fill="#45283c" />
              <circle cx="43" cy="19" r="0.8" fill="#45283c" />
              {/* Small Horns */}
              <rect x="32" y="5" width="3" height="4" fill="#d7b594" stroke="#45283c" strokeWidth="1" />
              <rect x="39" y="5" width="3" height="4" fill="#d7b594" stroke="#45283c" strokeWidth="1" />

              {/* Pink Udder */}
              <rect x="12" y="28" width="6" height="4" fill="#e8cfa6" />

              {/* Legs (Stepping when walking) */}
              <rect x={12 + (isWalking ? (walkStep % 2 === 0 ? 2 : -2) : 0)} y="30" width="4" height="7" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <rect x={18 - (isWalking ? (walkStep % 2 === 0 ? 2 : -2) : 0)} y="30" width="4" height="7" fill="#45283c" />
              <rect x={26 + (isWalking ? (walkStep % 2 === 0 ? 2 : -2) : 0)} y="30" width="4" height="7" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <rect x={32 - (isWalking ? (walkStep % 2 === 0 ? 2 : -2) : 0)} y="30" width="4" height="7" fill="#45283c" />
              {/* Hooves */}
              <rect x="12" y="36" width="4" height="2" fill="#2c1b18" />
              <rect x="18" y="36" width="4" height="2" fill="#2c1b18" />
              <rect x="26" y="36" width="4" height="2" fill="#2c1b18" />
              <rect x="32" y="36" width="4" height="2" fill="#2c1b18" />

              {/* Tail swish */}
              <line x1="8" y1="18" x2="5" y2="28" stroke="#45283c" strokeWidth="1.5" />
              <rect x="4" y="27" width="2.5" height="3" fill="#2c1b18" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: ROOSTER / CHICKEN --- */}
        {isChicken && (
          <div className={`relative w-10 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              {/* Body (Plump White/Orange) */}
              <ellipse cx="20" cy="24" rx="10" ry="8" fill="#ffffff" stroke="#45283c" strokeWidth="2" />
              {/* Wing */}
              <ellipse cx="18" cy="24" rx="6" ry="4" fill="#e8cfa6" stroke="#45283c" strokeWidth="1" />
              
              {/* Head & Red Crown / Comb */}
              <circle cx="26" cy="15" r="6" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
              {/* Red Rooster Comb */}
              <polygon points="23,9 26,4 29,9 31,5 33,10" fill="#b93b2a" stroke="#45283c" strokeWidth="1" />
              {/* Red Wattle under beak */}
              <circle cx="31" cy="20" r="2" fill="#b93b2a" />
              {/* Yellow Beak */}
              <polygon points="31,14 36,16 31,18" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              {/* Eye */}
              <circle cx="28" cy="14" r="1.5" fill="#2c1b18" />
              
              {/* Tail Feathers (Arching) */}
              <path d="M 11 22 Q 4 14 6 8 Q 12 12 13 20" fill="#4b692f" stroke="#45283c" strokeWidth="1" />
              <path d="M 12 24 Q 7 18 10 12 Q 14 16 14 22" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              
              {/* Yellow Legs & Claw Feet */}
              <line x1="18" y1="31" x2="18" y2="37" stroke="#d9911e" strokeWidth="2" />
              <line x1="23" y1="31" x2="23" y2="37" stroke="#d9911e" strokeWidth="2" />
              <line x1="16" y1="37" x2="20" y2="37" stroke="#d9911e" strokeWidth="1.5" />
              <line x1="21" y1="37" x2="25" y2="37" stroke="#d9911e" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: FLUFFY SHEEP --- */}
        {isSheep && (
          <div className={`relative w-12 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 48 40" className="w-full h-full">
              {/* Fluffy Wool Body (Cloud of Pixel Blocks) */}
              <rect x="8" y="12" width="28" height="18" rx="6" fill="#ffffff" stroke="#45283c" strokeWidth="2" />
              <circle cx="12" cy="16" r="4" fill="#ffffff" />
              <circle cx="22" cy="12" r="5" fill="#ffffff" />
              <circle cx="32" cy="16" r="4" fill="#ffffff" />
              <circle cx="20" cy="30" r="3" fill="#ffffff" />
              <circle cx="30" cy="29" r="3" fill="#ffffff" />
              
              {/* Black Sheep Face */}
              <rect x="30" y="15" width="12" height="11" rx="3" fill="#45283c" stroke="#2c1b18" strokeWidth="1.5" />
              {/* White Friendly Eye */}
              <circle cx="36" cy="18" r="1.5" fill="#ffffff" />
              <circle cx="36" cy="18" r="0.8" fill="#2c1b18" />
              {/* Floppy Ear */}
              <ellipse cx="29" cy="18" rx="3" ry="1.8" fill="#2c1b18" />
              
              {/* 4 Black Legs */}
              <rect x="13" y="28" width="3.5" height="8" fill="#45283c" />
              <rect x="19" y="28" width="3.5" height="8" fill="#45283c" />
              <rect x="27" y="28" width="3.5" height="8" fill="#45283c" />
              <rect x="33" y="28" width="3.5" height="8" fill="#45283c" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: COLLIE DOG --- */}
        {isDog && (
          <div className={`relative w-12 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 48 40" className="w-full h-full">
              {/* Body (Sable Gold & White) */}
              <rect x="10" y="16" width="24" height="13" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
              <rect x="18" y="18" width="8" height="11" fill="#ffffff" /> {/* White chest patch */}
              
              {/* Head & Snout */}
              <rect x="28" y="10" width="13" height="13" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
              <rect x="34" y="16" width="8" height="6" fill="#ffffff" /> {/* White muzzle */}
              <circle cx="41" cy="18" r="1.5" fill="#2c1b18" /> {/* Black nose */}
              <circle cx="35" cy="13" r="1.5" fill="#2c1b18" /> {/* Eye */}
              <polygon points="30,7 34,11 28,11" fill="#663931" /> {/* Pointed ear */}
              
              {/* Wagging Fluffy Tail */}
              <path d="M 10 20 Q 4 14 6 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              
              {/* 4 Paws */}
              <rect x="14" y="28" width="3.5" height="8" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <rect x="20" y="28" width="3.5" height="8" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <rect x="26" y="28" width="3.5" height="8" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <rect x="31" y="28" width="3.5" height="8" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: ANGUS BULL --- */}
        {isBull && (
          <div className={`relative w-13 h-11 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 52 44" className="w-full h-full">
              {/* Muscular Deep Black Body */}
              <rect x="8" y="14" width="32" height="18" fill="#45283c" stroke="#2c1b18" strokeWidth="2.5" />
              <rect x="20" y="11" width="14" height="8" fill="#2c1b18" /> {/* Hump */}
              
              {/* Heavy Head */}
              <rect x="34" y="12" width="14" height="14" fill="#45283c" stroke="#2c1b18" strokeWidth="2" />
              <circle cx="41" cy="16" r="1.5" fill="#ffffff" />
              <circle cx="41" cy="16" r="0.8" fill="#2c1b18" />
              <rect x="40" y="20" width="8" height="6" fill="#2c1b18" />
              {/* Sharp Curved Horns */}
              <path d="M 36 12 Q 33 6 36 3" stroke="#e8cfa6" strokeWidth="2" fill="none" />
              <path d="M 44 12 Q 47 6 44 3" stroke="#e8cfa6" strokeWidth="2" fill="none" />
              
              {/* 4 Heavy Legs */}
              <rect x="12" y="31" width="4.5" height="8" fill="#2c1b18" />
              <rect x="19" y="31" width="4.5" height="8" fill="#45283c" />
              <rect x="28" y="31" width="4.5" height="8" fill="#2c1b18" />
              <rect x="35" y="31" width="4.5" height="8" fill="#45283c" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: ALPINE GOAT --- */}
        {isGoat && (
          <div className={`relative w-11 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 44 40" className="w-full h-full">
              {/* Cream Goat Body */}
              <rect x="8" y="15" width="22" height="14" fill="#e8cfa6" stroke="#45283c" strokeWidth="2" />
              
              {/* Head with Goatee */}
              <rect x="25" y="10" width="11" height="12" fill="#e8cfa6" stroke="#45283c" strokeWidth="1.5" />
              <circle cx="31" cy="13" r="1.2" fill="#2c1b18" />
              {/* Little Goatee Beard */}
              <polygon points="32,22 35,27 38,22" fill="#ffffff" />
              {/* Backwards Curved Horns */}
              <path d="M 27 10 Q 24 3 20 4" stroke="#8f563b" strokeWidth="2" fill="none" />
              <path d="M 31 10 Q 28 3 24 4" stroke="#8f563b" strokeWidth="2" fill="none" />
              
              {/* Upright Short Tail */}
              <line x1="8" y1="17" x2="5" y2="12" stroke="#e8cfa6" strokeWidth="2.5" />
              
              {/* 4 Slender Legs */}
              <rect x="11" y="28" width="3" height="8" fill="#45283c" />
              <rect x="16" y="28" width="3" height="8" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
              <rect x="22" y="28" width="3" height="8" fill="#45283c" />
              <rect x="26" y="28" width="3" height="8" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: CAREER HORSE --- */}
        {isHorse && (
          <div className={`relative w-14 h-12 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 56 48" className="w-full h-full">
              {/* Chestnut Brown Body */}
              <rect x="10" y="18" width="32" height="16" fill="#8f563b" stroke="#45283c" strokeWidth="2" />
              {/* Arched Neck & Head */}
              <polygon points="34,22 46,8 52,14 38,28" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
              <rect x="44" y="9" width="10" height="9" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
              <circle cx="50" cy="12" r="1.5" fill="#2c1b18" /> {/* Eye */}
              {/* Black Mane */}
              <polygon points="35,18 44,7 48,12 40,24" fill="#45283c" />
              <polygon points="46,6 49,9 44,9" fill="#8f563b" /> {/* Ear */}
              
              {/* Long Flowing Black Tail */}
              <path d="M 10 20 Q 3 28 5 36" stroke="#45283c" strokeWidth="3" strokeLinecap="round" />
              
              {/* 4 Strong Legs with Hooves */}
              <rect x="14" y="32" width="3.5" height="11" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
              <rect x="20" y="32" width="3.5" height="11" fill="#663931" />
              <rect x="32" y="32" width="3.5" height="11" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
              <rect x="38" y="32" width="3.5" height="11" fill="#663931" />
              {/* Black Hooves */}
              <rect x="14" y="42" width="3.5" height="2" fill="#2c1b18" />
              <rect x="20" y="42" width="3.5" height="2" fill="#2c1b18" />
              <rect x="32" y="42" width="3.5" height="2" fill="#2c1b18" />
              <rect x="38" y="42" width="3.5" height="2" fill="#2c1b18" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: LLAMA / ALPACA --- */}
        {isLlama && (
          <div className={`relative w-12 h-13 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 48 52" className="w-full h-full">
              {/* Fluffy Body */}
              <rect x="8" y="24" width="24" height="16" rx="4" fill="#ffffff" stroke="#45283c" strokeWidth="2" />
              
              {/* Tall Woolly Neck */}
              <rect x="24" y="10" width="8" height="18" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
              {/* Cute Head & Snout */}
              <rect x="25" y="6" width="13" height="9" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
              <circle cx="31" cy="9" r="1.5" fill="#2c1b18" />
              <circle cx="37" cy="11" r="1" fill="#e8cfa6" />
              {/* Tall Pointy Ears */}
              <polygon points="26,6 27,1 29,6" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
              <polygon points="30,6 31,1 33,6" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
              
              {/* Decorative Aztec Saddle Blanket */}
              <rect x="14" y="24" width="12" height="10" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <rect x="16" y="26" width="8" height="4" fill="#4b692f" />
              
              {/* 4 Long Legs */}
              <rect x="11" y="39" width="3" height="9" fill="#ffffff" stroke="#45283c" strokeWidth="0.8" />
              <rect x="17" y="39" width="3" height="9" fill="#d7b594" />
              <rect x="23" y="39" width="3" height="9" fill="#ffffff" stroke="#45283c" strokeWidth="0.8" />
              <rect x="28" y="39" width="3" height="9" fill="#d7b594" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: WATCHFUL GOOSE --- */}
        {isGeese && (
          <div className={`relative w-11 h-11 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 44 44" className="w-full h-full">
              {/* White Body */}
              <ellipse cx="18" cy="28" rx="10" ry="7" fill="#ffffff" stroke="#45283c" strokeWidth="1.8" />
              {/* Graceful S-Curved Neck */}
              <path d="M 24 28 Q 28 20 28 12 Q 28 8 32 8" stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Head & Orange Beak */}
              <circle cx="32" cy="8" r="4" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              <polygon points="34,7 41,9 34,11" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <circle cx="32" cy="7" r="1" fill="#2c1b18" />
              
              {/* Tail upturn */}
              <polygon points="10,27 4,23 9,31" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
              
              {/* Orange Webbed Legs */}
              <line x1="16" y1="34" x2="16" y2="40" stroke="#d9911e" strokeWidth="2" />
              <line x1="21" y1="34" x2="21" y2="40" stroke="#d9911e" strokeWidth="2" />
              <line x1="14" y1="40" x2="19" y2="40" stroke="#d9911e" strokeWidth="1.5" />
              <line x1="19" y1="40" x2="24" y2="40" stroke="#d9911e" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* --- PIXEL ART: IMPERIAL PHEASANT --- */}
        {isPheasant && (
          <div className={`relative w-14 h-10 ${isWalking ? 'animate-bounce' : ''}`}>
            <svg viewBox="0 0 56 40" className="w-full h-full">
              {/* Golden Breast & Rich Brown Body */}
              <ellipse cx="26" cy="24" rx="9" ry="6" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
              <ellipse cx="30" cy="23" rx="5" ry="5" fill="#d9911e" />
              
              {/* Emerald Green Head & White Collar */}
              <circle cx="36" cy="16" r="4.5" fill="#4b692f" stroke="#45283c" strokeWidth="1" />
              <rect x="33" y="19" width="6" height="2" fill="#ffffff" /> {/* White collar ring */}
              <circle cx="38" cy="16" r="2" fill="#b93b2a" /> {/* Red eye patch */}
              <circle cx="38" cy="16" r="0.8" fill="#ffffff" />
              <polygon points="40,15 45,17 40,18" fill="#e8cfa6" stroke="#45283c" strokeWidth="0.8" />
              
              {/* Long Imperial Barred Tail Feathers */}
              <path d="M 18 24 Q 8 20 2 12 Q 10 22 17 26" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
              <line x1="6" y1="16" x2="10" y2="19" stroke="#45283c" strokeWidth="1" />
              <line x1="11" y1="20" x2="15" y2="23" stroke="#45283c" strokeWidth="1" />
              
              {/* Slender Legs */}
              <line x1="24" y1="29" x2="24" y2="36" stroke="#663931" strokeWidth="1.5" />
              <line x1="28" y1="29" x2="28" y2="36" stroke="#663931" strokeWidth="1.5" />
            </svg>
          </div>
        )}

      </div>

      {/* =========================================================================
          3. BABY COMPANION (Level >= 3)
          ========================================================================= */}
      {level >= 3 && (
        <div 
          className="absolute z-10 pointer-events-none"
          style={{
            left: '26%',
            bottom: '22%',
            transform: 'scale(0.65)'
          }}
        >
          {isCow && (
            <div className="w-8 h-7 animate-pulse">
              <svg viewBox="0 0 32 28">
                <rect x="6" y="8" width="18" height="12" fill="#ffffff" stroke="#45283c" strokeWidth="1.5" />
                <rect x="12" y="10" width="5" height="5" fill="#45283c" />
                <rect x="20" y="4" width="8" height="8" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
                <rect x="23" y="9" width="5" height="4" fill="#e8cfa6" />
                <rect x="9" y="19" width="3" height="6" fill="#ffffff" />
                <rect x="18" y="19" width="3" height="6" fill="#45283c" />
              </svg>
            </div>
          )}
          {isChicken && (
            <div className="w-5 h-5 animate-bounce">
              <svg viewBox="0 0 20 20">
                <circle cx="10" cy="12" r="5" fill="#ffd54f" stroke="#45283c" strokeWidth="1" />
                <circle cx="13" cy="8" r="3.5" fill="#ffd54f" stroke="#45283c" strokeWidth="1" />
                <polygon points="16,8 19,9 16,10" fill="#d9911e" />
                <circle cx="14" cy="7" r="0.8" fill="#2c1b18" />
              </svg>
            </div>
          )}
          {isSheep && (
            <div className="w-7 h-6 animate-pulse">
              <svg viewBox="0 0 28 24">
                <rect x="4" y="6" width="16" height="10" rx="3" fill="#ffffff" stroke="#45283c" strokeWidth="1" />
                <rect x="17" y="8" width="7" height="6" fill="#45283c" />
                <circle cx="21" cy="9" r="0.8" fill="#ffffff" />
                <rect x="7" y="15" width="2" height="5" fill="#45283c" />
                <rect x="15" y="15" width="2" height="5" fill="#45283c" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          4. LEVEL 5 CHAMPION BLUE PRIZE ROSETTE RIBBON
          ========================================================================= */}
      {level === 5 && (
        <div className="absolute top-1 right-2 z-20 animate-bounce">
          <svg width="22" height="26" viewBox="0 0 24 28">
            <circle cx="12" cy="10" r="7" fill="#1e88e5" stroke="#0d47a1" strokeWidth="1.5" />
            <polygon points="9,16 6,26 12,22 18,26 15,16" fill="#1565c0" stroke="#0d47a1" strokeWidth="1" />
            <circle cx="12" cy="10" r="3" fill="#ffd700" />
          </svg>
        </div>
      )}

    </div>
  );
}
