import React from 'react';

/**
 * 16-Bit Retro Pixel Farmer Character
 * Directions: 'down' (front), 'up' (back), 'left', 'right'
 * Animations: standing, walking (step1, step2), action (watering, harvesting, reading)
 */
export default function FarmerCharacter({
  x, // Percentage 0-100 (optional)
  y, // Percentage 0-100 (optional)
  direction = 'down', // 'down' | 'up' | 'left' | 'right'
  isMoving = false,
  walkFrame = 0, // 0, 1, 2
  action = null, // null | 'watering' | 'harvesting' | 'reading'
  playerName = 'Học Viên Mochi',
  farmerName, // alias support
  level = 1,
  farmerLevel, // alias support
  interactionPrompt = null,
  isNearTarget = false,
  targetName = null
}) {
  const displayName = farmerName || playerName || 'Farmer';
  const displayLevel = farmerLevel || level || 1;
  const prompt = interactionPrompt || (isNearTarget && targetName ? `[E] ${targetName}` : null);

  // Leg offset calculation based on walk cycle
  const legOffset = isMoving ? (walkFrame % 2 === 0 ? 3 : -3) : 0;
  const isFacingLeft = direction === 'left';
  const isFacingRight = direction === 'right';
  const isFacingUp = direction === 'up';

  const positionStyle = (x !== undefined && y !== undefined)
    ? {
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -85%)',
        willChange: 'left, top'
      }
    : {
        transform: 'translateY(-10%)'
      };

  return (
    <div
      className="absolute pointer-events-none transition-all duration-75 z-20 select-none font-pixel"
      style={positionStyle}
    >
      {/* 1. Proximity Interaction Bubble Above Head */}
      {prompt && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce z-30">
          <div className="px-2 py-0.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[#2c1b18] text-[8px] font-bold shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#4b692f] animate-ping" />
            <span>{prompt}</span>
          </div>
          {/* Bubble tail */}
          <div className="w-2 h-2 bg-[#e8cfa6] border-r-2 border-b-2 border-[#45283c] rotate-45 mx-auto -mt-1" />
        </div>
      )}

      {/* 2. Action Animation Overlays */}
      {action === 'watering' && (
        <div className="absolute -top-6 -right-6 text-xl animate-bounce z-30">
          💧✨
        </div>
      )}
      {action === 'harvesting' && (
        <div className="absolute -top-6 -right-6 text-xl animate-spin z-30">
          🌾✨
        </div>
      )}
      {action === 'reading' && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xl animate-pulse z-30">
          📖💡
        </div>
      )}

      {/* 3. Shadow under feet */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-black/40 blur-[1px]" />

      {/* 4. 16-Bit Pixel Art Farmer SVG */}
      <div 
        className={`relative w-12 h-14 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transition-transform ${
          isFacingLeft ? 'scale-x-[-1]' : ''
        }`}
      >
        <svg viewBox="0 0 48 56" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          
          {/* --- STRAW HAT --- */}
          {/* Hat Crown */}
          <rect x="16" y="4" width="16" height="10" fill="#E0A94E" />
          <rect x="18" y="2" width="12" height="4" fill="#F4C778" />
          {/* Red Hat Ribbon */}
          <rect x="16" y="11" width="16" height="3" fill="#D32F2F" />
          {/* Hat Brim */}
          <rect x="10" y="13" width="28" height="4" fill="#C68C32" />
          <rect x="8" y="14" width="32" height="2" fill="#E0A94E" />

          {/* --- HEAD & HAIR --- */}
          {/* Hair back */}
          <rect x="16" y="15" width="16" height="5" fill="#4E342E" />
          
          {!isFacingUp ? (
            <>
              {/* Face Skin */}
              <rect x="17" y="17" width="14" height="10" fill="#FFCC80" />
              {/* Cheeks */}
              <rect x="17" y="23" width="3" height="2" fill="#FF8A80" opacity="0.6" />
              <rect x="28" y="23" width="3" height="2" fill="#FF8A80" opacity="0.6" />
              {/* Eyes */}
              {isFacingRight ? (
                <rect x="25" y="20" width="3" height="4" fill="#212121" />
              ) : (
                <>
                  <rect x="19" y="20" width="3" height="4" fill="#212121" />
                  <rect x="26" y="20" width="3" height="4" fill="#212121" />
                </>
              )}
              {/* Smile */}
              <rect x="22" y="25" width="4" height="1" fill="#8D6E63" />
            </>
          ) : (
            /* Back of Head */
            <rect x="16" y="16" width="16" height="11" fill="#4E342E" />
          )}

          {/* Red Bandana Scarf */}
          <rect x="18" y="26" width="12" height="3" fill="#C62828" />
          <rect x="21" y="29" width="6" height="2" fill="#E53935" />

          {/* --- BODY & OVERALLS --- */}
          {/* Flannel Shirt */}
          <rect x="14" y="29" width="20" height="9" fill="#E53935" />
          <rect x="18" y="29" width="2" height="9" fill="#B71C1C" />
          <rect x="28" y="29" width="2" height="9" fill="#B71C1C" />
          
          {/* Blue Denim Overalls */}
          <rect x="17" y="32" width="14" height="11" fill="#1565C0" />
          {/* Straps */}
          <rect x="18" y="30" width="3" height="5" fill="#0D47A1" />
          <rect x="27" y="30" width="3" height="5" fill="#0D47A1" />
          {/* Brass Buckles */}
          <rect x="18" y="33" width="3" height="2" fill="#FFD54F" />
          <rect x="27" y="33" width="3" height="2" fill="#FFD54F" />
          {/* Overall Pocket */}
          <rect x="21" y="36" width="6" height="4" fill="#0D47A1" />

          {/* --- ARMS / TOOLS --- */}
          {action === 'watering' ? (
            /* Holding Watering Can */
            <>
              <rect x="30" y="32" width="8" height="4" fill="#FFCC80" />
              <rect x="34" y="30" width="10" height="8" fill="#0288D1" />
              <rect x="42" y="28" width="4" height="4" fill="#4FC3F7" />
            </>
          ) : action === 'harvesting' ? (
            /* Holding Golden Scythe */
            <>
              <rect x="30" y="30" width="8" height="4" fill="#FFCC80" />
              <path d="M36 22 C42 16, 46 22, 42 28 L36 34" stroke="#FFD54F" strokeWidth="3" fill="none" />
            </>
          ) : (
            /* Normal Arms */
            <>
              <rect x="12" y="30" width="4" height="8" fill="#E53935" />
              <rect x="12" y="37" width="4" height="3" fill="#FFCC80" />
              <rect x="32" y="30" width="4" height="8" fill="#E53935" />
              <rect x="32" y="37" width="4" height="3" fill="#FFCC80" />
            </>
          )}

          {/* --- LEGS & BOOTS (ANIMATED) --- */}
          {/* Left Leg */}
          <rect 
            x={18 + legOffset} 
            y="43" 
            width="5" 
            height="7" 
            fill="#0D47A1" 
          />
          {/* Left Boot */}
          <rect 
            x={17 + legOffset} 
            y="49" 
            width="6" 
            height="4" 
            fill="#4E342E" 
          />

          {/* Right Leg */}
          <rect 
            x={25 - legOffset} 
            y="43" 
            width="5" 
            height="7" 
            fill="#0D47A1" 
          />
          {/* Right Boot */}
          <rect 
            x={25 - legOffset} 
            y="49" 
            width="6" 
            height="4" 
            fill="#4E342E" 
          />
        </svg>
      </div>

      {/* 5. Player Name & Level Plate (Retro Warm Palette) */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="px-1.5 py-0.5 border-2 border-[#45283c] bg-[#e8cfa6] text-[#2c1b18] text-[7.5px] font-bold flex items-center gap-1 shadow-sm">
          <span className="text-[#8f563b] font-bold">L{displayLevel}</span>
          <span className="truncate max-w-[84px]">{displayName}</span>
        </div>
      </div>
    </div>
  );
}
