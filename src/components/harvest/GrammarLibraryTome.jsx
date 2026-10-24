import React, { useState, useEffect } from 'react';

/**
 * Authentic 16-Bit Living Ancient Library Tome & Owl for Grammar Mastery (Thư Viện Cổ)
 * Features glowing ancient parchment tomes, a wise owl with blinking eyes, and flickering candlelight!
 */
export default function GrammarLibraryTome({
  entity,
  isNearby = false
}) {
  const { type = 'scroll_eco', level = 1, status = 'healthy' } = entity;
  const isWilting = status === 'wilting';
  const isHealthy = status === 'healthy';

  const scale = 0.9 + (level - 1) * 0.08;

  // Owl eye blinking animation state
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimer;
    const triggerBlink = () => {
      const interval = 2500 + Math.random() * 3000;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          triggerBlink();
        }, 180);
      }, interval);
    };

    triggerBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

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
      {/* Proximity / Selection Glow Ring */}
      {isNearby && (
        <div className="absolute inset-0 border-4 border-[#d9911e] bg-[#d9911e]/15 animate-pulse pointer-events-none z-0" />
      )}

      {/* Shadow Base */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/45 blur-[1px] pointer-events-none" />

      {/* Main Pixel Art Library & Tome Body */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <svg viewBox="0 0 120 96" className="w-full h-full overflow-visible">
          
          {/* Heavy Antique Mahogany Library Lectern / Desk */}
          <polygon points="18,72 102,72 96,86 24,86" fill="#45283c" stroke="#2c1b18" strokeWidth="2.5" />
          <polygon points="22,74 98,74 93,83 27,83" fill="#663931" />
          {/* Carved Wooden Lectern Pillars */}
          <rect x="30" y="52" width="60" height="22" fill="#663931" stroke="#45283c" strokeWidth="2.5" />
          <rect x="36" y="56" width="48" height="14" fill="#8f563b" />
          
          {/* Bookshelf Stack on Side (Left) */}
          <rect x="18" y="50" width="14" height="22" fill="#45283c" stroke="#2c1b18" strokeWidth="1.5" />
          <rect x="20" y="52" width="10" height="6" fill="#8f563b" />
          <rect x="20" y="60" width="10" height="5" fill="#4b692f" />
          <rect x="20" y="66" width="10" height="5" fill="#d9911e" />

          {/* Flickering Candle in Brass Dish (Right side) */}
          <ellipse cx="96" cy="62" rx="6" ry="3" fill="#d9911e" stroke="#45283c" strokeWidth="1" />
          <rect x="94" y="48" width="4" height="14" fill="#e8cfa6" stroke="#45283c" strokeWidth="1" />
          {/* Candle Flame (Flickering) */}
          <ellipse cx="96" cy="44" rx="3" ry="5" fill="#d9911e" className="animate-pulse" />
          <circle cx="96" cy="45" r="1.5" fill="#ffffff" />

          {/* =================================================================
              CENTRAL ANCIENT OPEN TOME (LEATHERBOUND GRAMMAR CODEX)
              ================================================================= */}
          <g>
            {/* Open Book Wings */}
            {/* Left Page */}
            <polygon points="36,44 60,40 59,60 34,62" fill="#e8cfa6" stroke="#45283c" strokeWidth="2" />
            {/* Right Page */}
            <polygon points="60,40 84,44 86,62 61,60" fill="#e8cfa6" stroke="#45283c" strokeWidth="2" />
            {/* Center Spine */}
            <line x1="60" y1="40" x2="60" y2="60" stroke="#8f563b" strokeWidth="3" />
            
            {/* Syntax Lines of Ancient Text */}
            <line x1="38" y1="47" x2="56" y2="45" stroke="#45283c" strokeWidth="1" strokeDasharray="2 1" />
            <line x1="38" y1="51" x2="56" y2="49" stroke="#45283c" strokeWidth="1" strokeDasharray="3 1" />
            <line x1="37" y1="55" x2="56" y2="53" stroke="#45283c" strokeWidth="1" strokeDasharray="2 1" />
            
            <line x1="64" y1="45" x2="82" y2="47" stroke="#45283c" strokeWidth="1" strokeDasharray="3 1" />
            <line x1="64" y1="49" x2="82" y2="51" stroke="#45283c" strokeWidth="1" strokeDasharray="2 1" />
            <line x1="64" y1="53" x2="83" y2="55" stroke="#45283c" strokeWidth="1" strokeDasharray="3 1" />

            {/* Red Bookmark Ribbon */}
            <path d="M 60 60 L 60 70 L 63 67 L 66 70 L 66 60" fill="#b93b2a" />
          </g>

          {/* =================================================================
              WISE SCHOLAR OWL (PERCHED ON DESK CORNER)
              ================================================================= */}
          <g>
            {/* Owl Body (Warm Brown) */}
            <ellipse cx="40" cy="30" rx="9" ry="12" fill="#8f563b" stroke="#45283c" strokeWidth="1.8" />
            {/* Owl Belly (Cream Feathers) */}
            <ellipse cx="40" cy="32" rx="6" ry="8" fill="#e8cfa6" />
            <line x1="38" y1="28" x2="42" y2="28" stroke="#8f563b" strokeWidth="1" />
            <line x1="37" y1="32" x2="43" y2="32" stroke="#8f563b" strokeWidth="1" />
            <line x1="38" y1="36" x2="42" y2="36" stroke="#8f563b" strokeWidth="1" />
            
            {/* Owl Head & Feathery Ear Tufts */}
            <circle cx="40" cy="20" r="8" fill="#8f563b" stroke="#45283c" strokeWidth="1.5" />
            <polygon points="34,16 31,10 37,14" fill="#663931" /> {/* Left ear tuft */}
            <polygon points="46,16 49,10 43,14" fill="#663931" /> {/* Right ear tuft */}
            
            {/* Big Expressive Owl Eyes (With Blinking State) */}
            {isBlinking ? (
              <>
                <line x1="35" y1="20" x2="39" y2="20" stroke="#2c1b18" strokeWidth="2" />
                <line x1="41" y1="20" x2="45" y2="20" stroke="#2c1b18" strokeWidth="2" />
              </>
            ) : (
              <>
                <circle cx="37" cy="20" r="3" fill="#d9911e" stroke="#2c1b18" strokeWidth="1" />
                <circle cx="37" cy="20" r="1.5" fill="#2c1b18" />
                <circle cx="36" cy="19" r="0.6" fill="#ffffff" />

                <circle cx="43" cy="20" r="3" fill="#d9911e" stroke="#2c1b18" strokeWidth="1" />
                <circle cx="43" cy="20" r="1.5" fill="#2c1b18" />
                <circle cx="42" cy="19" r="0.6" fill="#ffffff" />
              </>
            )}
            
            {/* Yellow Beak */}
            <polygon points="39,22 41,22 40,25" fill="#d9911e" />

            {/* Little Talons clutching book */}
            <line x1="37" y1="41" x2="37" y2="44" stroke="#d9911e" strokeWidth="2" />
            <line x1="43" y1="41" x2="43" y2="44" stroke="#d9911e" strokeWidth="2" />
          </g>

          {/* Level 5 Master Scholar Golden Rune Aura */}
          {level === 5 && (
            <g className="animate-spin-slow">
              <circle cx="60" cy="50" r="28" fill="none" stroke="#d9911e" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="60" cy="50" r="2" fill="#ffffff" />
            </g>
          )}

        </svg>
      </div>
    </div>
  );
}
