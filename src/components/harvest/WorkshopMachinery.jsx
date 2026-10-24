import React from 'react';

/**
 * Authentic 16-Bit Living Clockwork Machinery for Math Thinking & Logic (Xưởng Cơ Khí)
 * Features rotating brass cogwheels, steam gauges, abacus beads, and balance scales!
 */
export default function WorkshopMachinery({
  entity,
  isNearby = false
}) {
  const { type = 'gear_solar', level = 1, status = 'healthy' } = entity;
  const isWilting = status === 'wilting';
  const isThirsty = status === 'thirsty';
  const isHealthy = status === 'healthy';

  const scale = 0.9 + (level - 1) * 0.08;

  const isQuantum = type.includes('quantum');
  const isAbacus = type.includes('abacus');
  const isClockwork = type.includes('clockwork');
  const isBalance = type.includes('balance');
  const isTransit = type.includes('transit');
  const isCipher = type.includes('cipher');
  const isAstrolabe = type.includes('astrolabe');

  return (
    <div 
      className="relative flex flex-col items-center justify-end select-none font-pixel"
      style={{
        width: '120px',
        height: '96px',
        transform: `scale(${scale})`,
        imageRendering: 'pixelated'
      }}
    >
      {/* Proximity / Selection Ring */}
      {isNearby && (
        <div className="absolute inset-0 border-4 border-[#d9911e] bg-[#d9911e]/15 animate-pulse pointer-events-none z-0" />
      )}

      {/* Shadow Base */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/45 blur-[1px] pointer-events-none" />

      {/* Main Pixel Art Machine Body */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <svg viewBox="0 0 120 96" className="w-full h-full overflow-visible">
          
          {/* Heavy Cast-Iron & Timber Workshop Base Pedestal */}
          <rect x="20" y="68" width="80" height="18" fill="#45283c" stroke="#2c1b18" strokeWidth="3" />
          <rect x="24" y="72" width="72" height="10" fill="#663931" />
          {/* Brass Rivets on Base */}
          <circle cx="28" cy="77" r="1.5" fill="#d9911e" />
          <circle cx="92" cy="77" r="1.5" fill="#d9911e" />
          <circle cx="60" cy="77" r="1.5" fill="#d9911e" />

          {/* Copper Steam Piping Network */}
          <path d="M 28 68 L 28 44 Q 28 36 36 36 L 44 36" stroke="#8f563b" strokeWidth="4" fill="none" strokeLinecap="square" />
          <path d="M 28 68 L 28 44 Q 28 36 36 36 L 44 36" stroke="#d9911e" strokeWidth="2" fill="none" strokeLinecap="square" />
          <circle cx="44" cy="36" r="3" fill="#45283c" />

          {/* Steam Pressure Gauge */}
          <circle cx="36" cy="30" r="7" fill="#e8cfa6" stroke="#45283c" strokeWidth="2" />
          <line x1="36" y1="30" x2="39" y2="26" stroke="#b93b2a" strokeWidth="1.5" />
          <circle cx="36" cy="30" r="1" fill="#45283c" />

          {/* =================================================================
              SPECIFIC MACHINE MECHANISM BY TOPIC
              ================================================================= */}

          {/* 1. PYTHAGOREAN ABACUS & CALCULATOR */}
          {isAbacus && (
            <g>
              {/* Abacus Outer Frame */}
              <rect x="42" y="24" width="56" height="44" fill="#8f563b" stroke="#45283c" strokeWidth="2.5" />
              <rect x="46" y="28" width="48" height="36" fill="#e8cfa6" />
              {/* Central Separator Beam */}
              <line x1="42" y1="40" x2="98" y2="40" stroke="#45283c" strokeWidth="3" />
              
              {/* 4 Vertical Metal Rods */}
              {[52, 64, 76, 88].map((rx, idx) => (
                <g key={idx}>
                  <line x1={rx} y1="28" x2={rx} y2="64" stroke="#45283c" strokeWidth="1.5" />
                  {/* Upper Deck Beads (Value 5) */}
                  <ellipse cx={rx} cy={idx % 2 === 0 ? 34 : 31} rx="4" ry="2.5" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
                  {/* Lower Deck Beads (Value 1) */}
                  <ellipse cx={rx} cy="46" rx="4" ry="2.5" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
                  <ellipse cx={rx} cy="52" rx="4" ry="2.5" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
                  <ellipse cx={rx} cy="58" rx="4" ry="2.5" fill="#8f563b" stroke="#45283c" strokeWidth="1" />
                </g>
              ))}
            </g>
          )}

          {/* 2. FINANCIAL BALANCE SCALE */}
          {isBalance && (
            <g>
              {/* Central Pillar */}
              <rect x="68" y="22" width="6" height="46" fill="#d9911e" stroke="#45283c" strokeWidth="2" />
              <circle cx="71" cy="22" r="5" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
              
              {/* Fulcrum Beam (Tilting gently) */}
              <line x1="42" y1="20" x2="100" y2="24" stroke="#45283c" strokeWidth="3.5" />
              <line x1="42" y1="20" x2="100" y2="24" stroke="#d9911e" strokeWidth="2" />
              
              {/* Left Scale Pan with Gold Weights */}
              <line x1="46" y1="21" x2="40" y2="40" stroke="#45283c" strokeWidth="1.2" />
              <line x1="46" y1="21" x2="52" y2="40" stroke="#45283c" strokeWidth="1.2" />
              <path d="M 38 40 Q 46 48 54 40 Z" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
              <rect x="44" y="34" width="4" height="6" fill="#8f563b" />

              {/* Right Scale Pan */}
              <line x1="96" y1="23" x2="90" y2="44" stroke="#45283c" strokeWidth="1.2" />
              <line x1="96" y1="23" x2="102" y2="44" stroke="#45283c" strokeWidth="1.2" />
              <path d="M 88 44 Q 96 52 104 44 Z" fill="#d9911e" stroke="#45283c" strokeWidth="1.5" />
            </g>
          )}

          {/* 3. QUANTUM COMPUTING RIG & VACUUM TUBES */}
          {isQuantum && (
            <g>
              {/* Glass Chamber with Glowing Core */}
              <rect x="48" y="20" width="46" height="48" rx="4" fill="#1b4d3e" stroke="#45283c" strokeWidth="2.5" />
              <rect x="52" y="24" width="38" height="40" fill="#164344" />
              
              {/* Pulsing Quantum Coils */}
              <circle cx="71" cy="44" r="12" fill="none" stroke="#68b684" strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />
              <circle cx="71" cy="44" r="6" fill="#e8cfa6" className="animate-pulse" />
              
              {/* Vacuum Tubes on Top */}
              <rect x="56" y="10" width="6" height="10" rx="3" fill="#e8cfa6" stroke="#45283c" strokeWidth="1" opacity="0.8" />
              <rect x="80" y="10" width="6" height="10" rx="3" fill="#e8cfa6" stroke="#45283c" strokeWidth="1" opacity="0.8" />
              <line x1="59" y1="13" x2="59" y2="18" stroke="#b93b2a" strokeWidth="1" />
              <line x1="83" y1="13" x2="83" y2="18" stroke="#b93b2a" strokeWidth="1" />
            </g>
          )}

          {/* 4. DEFAULT ROTATING CLOCKWORK GEARS & MECHANISM */}
          {!isAbacus && !isBalance && !isQuantum && (
            <g>
              {/* Clockwork Machine Housing */}
              <rect x="44" y="24" width="54" height="44" fill="#663931" stroke="#45283c" strokeWidth="2.5" />
              <rect x="48" y="28" width="46" height="36" fill="#8f563b" />

              {/* Large Brass Cogwheel (Clockwise Rotation) */}
              <g 
                style={{ 
                  transformOrigin: '71px 44px',
                  animation: isHealthy ? 'spinClockwise 8s linear infinite' : 'none'
                }}
              >
                <circle cx="71" cy="44" r="16" fill="#d9911e" stroke="#45283c" strokeWidth="2" />
                <circle cx="71" cy="44" r="6" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
                {/* 8 Gear Teeth */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <rect
                    key={i}
                    x="68.5"
                    y="24"
                    width="5"
                    height="6"
                    fill="#d9911e"
                    stroke="#45283c"
                    strokeWidth="1"
                    transform={`rotate(${deg} 71 44)`}
                  />
                ))}
              </g>

              {/* Interlocking Small Gear (Counter-Clockwise Rotation) */}
              <g 
                style={{ 
                  transformOrigin: '52px 34px',
                  animation: isHealthy ? 'spinCounterClockwise 5s linear infinite' : 'none'
                }}
              >
                <circle cx="52" cy="34" r="9" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
                <circle cx="52" cy="34" r="3" fill="#d9911e" />
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <rect
                    key={i}
                    x="50.5"
                    y="22"
                    width="3"
                    height="4"
                    fill="#8f563b"
                    stroke="#45283c"
                    strokeWidth="0.8"
                    transform={`rotate(${deg} 52 34)`}
                  />
                ))}
              </g>

              {/* Mechanical Lever / Switch */}
              <line x1="88" y1="36" x2="98" y2="28" stroke="#45283c" strokeWidth="3" />
              <circle cx="98" cy="28" r="3" fill="#b93b2a" />
            </g>
          )}

          {/* Level 5 Master Mechanic Golden Gear Halo */}
          {level === 5 && (
            <circle cx="71" cy="44" r="28" fill="none" stroke="#d9911e" strokeWidth="1.5" strokeDasharray="4 3" className="animate-spin-slow" />
          )}

        </svg>
      </div>

      {/* Gear rotation inline CSS keyframes */}
      <style>{`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounterClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
