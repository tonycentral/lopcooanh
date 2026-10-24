import React, { useId } from 'react';

/**
 * Ambient Wildlife & Atmospheric Particle Layer
 * Renders living animated elements:
 * - Flying birds (sparrows/doves) soaring across the farm
 * - Fluttering butterflies (swallowtail/monarch) hovering near flowers
 * - Gentle drifting leaves / blossom petals in the breeze
 * - Dragonflies over paddies and lakes
 */
export default function AmbientWildlife({ areaId = 'orchard' }) {
  const isPond = areaId === 'pond';
  const isPaddy = areaId === 'paddy';
  const isGreenhouse = areaId === 'greenhouse';
  const isOrchard = areaId === 'orchard';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      
      {/* =========================================================================
          1. ANIMATED FLYING BIRDS (SOARING ACROSS SCREEN IN GENTLE LOOPS)
          ========================================================================= */}
      {!isGreenhouse && (
        <>
          {/* Bird 1: Small Sparrow soaring from Top-Left to Bottom-Right */}
          <div className="absolute animate-bird-flight-1">
            <svg className="w-8 h-8 filter drop-shadow-md" viewBox="0 0 32 32">
              {/* Flapping Wing Animation via CSS */}
              <g className="animate-bird-wing">
                {/* Body & Beak */}
                <ellipse cx="16" cy="16" rx="6" ry="3.5" fill="#5D4037" transform="rotate(-15 16 16)" />
                <polygon points="22,14 26,16 22,18" fill="#FFB300" />
                <circle cx="20" cy="14" r="0.8" fill="#212121" />
                {/* Left Wing */}
                <path d="M 14 14 Q 8 6 12 18 Z" fill="#8D6E63" />
                {/* Right Wing */}
                <path d="M 14 16 Q 18 4 20 14 Z" fill="#795548" />
                {/* Tail Feathers */}
                <polygon points="10,17 4,14 6,19" fill="#4E342E" />
              </g>
            </svg>
          </div>

          {/* Bird 2: White Dove / Swallow gliding high */}
          <div className="absolute animate-bird-flight-2">
            <svg className="w-9 h-9 filter drop-shadow-md" viewBox="0 0 36 36">
              <g className="animate-bird-wing-fast">
                <ellipse cx="18" cy="18" rx="7" ry="4" fill="#ECEFF1" transform="rotate(-20 18 18)" />
                <polygon points="25,15 29,17 25,19" fill="#FFA000" />
                <path d="M 16 15 Q 8 4 14 20 Z" fill="#CFD8DC" />
                <path d="M 16 18 Q 22 2 24 16 Z" fill="#ECEFF1" />
                <polygon points="11,19 3,16 5,22" fill="#B0BEC5" />
              </g>
            </svg>
          </div>
        </>
      )}

      {/* =========================================================================
          2. FLUTTERING BUTTERFLIES (HOVERING NEAR FLOWERS & CROPS)
          ========================================================================= */}
      {(isOrchard || isGreenhouse || isPaddy) && (
        <>
          {/* Yellow Butterfly */}
          <div className="absolute top-[35%] left-[24%] animate-butterfly-float-1">
            <svg className="w-5 h-5 filter drop-shadow-sm" viewBox="0 0 24 24">
              <g className="animate-butterfly-wing">
                {/* Left Wings */}
                <ellipse cx="7" cy="8" rx="5" ry="4" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.8" transform="rotate(-20 7 8)" />
                <ellipse cx="8" cy="14" rx="4" ry="3" fill="#FBC02D" stroke="#F57F17" strokeWidth="0.8" />
                {/* Right Wings */}
                <ellipse cx="17" cy="8" rx="5" ry="4" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.8" transform="rotate(20 17 8)" />
                <ellipse cx="16" cy="14" rx="4" ry="3" fill="#FBC02D" stroke="#F57F17" strokeWidth="0.8" />
                {/* Body & Antennae */}
                <line x1="12" y1="5" x2="12" y2="18" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="5" x2="10" y2="2" stroke="#3E2723" strokeWidth="0.8" />
                <line x1="12" y1="5" x2="14" y2="2" stroke="#3E2723" strokeWidth="0.8" />
              </g>
            </svg>
          </div>

          {/* Blue Azure Butterfly */}
          <div className="absolute top-[68%] left-[72%] animate-butterfly-float-2">
            <svg className="w-5 h-5 filter drop-shadow-sm" viewBox="0 0 24 24">
              <g className="animate-butterfly-wing">
                <ellipse cx="7" cy="8" rx="5" ry="4" fill="#42A5F5" stroke="#1565C0" strokeWidth="0.8" transform="rotate(-20 7 8)" />
                <ellipse cx="8" cy="14" rx="4" ry="3" fill="#29B6F6" stroke="#1565C0" strokeWidth="0.8" />
                <ellipse cx="17" cy="8" rx="5" ry="4" fill="#42A5F5" stroke="#1565C0" strokeWidth="0.8" transform="rotate(20 17 8)" />
                <ellipse cx="16" cy="14" rx="4" ry="3" fill="#29B6F6" stroke="#1565C0" strokeWidth="0.8" />
                <line x1="12" y1="5" x2="12" y2="18" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </>
      )}

      {/* =========================================================================
          3. DRAGONFLIES (FOR POND & PADDY)
          ========================================================================= */}
      {(isPond || isPaddy) && (
        <div className="absolute top-[42%] left-[45%] animate-dragonfly-dart">
          <svg className="w-6 h-6 filter drop-shadow" viewBox="0 0 24 24">
            {/* Long needle body */}
            <line x1="12" y1="4" x2="12" y2="22" stroke="#D32F2F" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="4" r="1.8" fill="#B71C1C" />
            {/* Translucent Wings */}
            <ellipse cx="6" cy="7" rx="6" ry="1.2" fill="#E0F7FA" opacity="0.85" stroke="#80DEEA" strokeWidth="0.5" />
            <ellipse cx="18" cy="7" rx="6" ry="1.2" fill="#E0F7FA" opacity="0.85" stroke="#80DEEA" strokeWidth="0.5" />
            <ellipse cx="7" cy="10" rx="5" ry="1.1" fill="#E0F7FA" opacity="0.85" stroke="#80DEEA" strokeWidth="0.5" />
            <ellipse cx="17" cy="10" rx="5" ry="1.1" fill="#E0F7FA" opacity="0.85" stroke="#80DEEA" strokeWidth="0.5" />
          </svg>
        </div>
      )}

      {/* =========================================================================
          4. DRIFTING PARTICLES: BLOSSOMS / FALLEN LEAVES IN BREEZE
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Particle 1 */}
        <div className="absolute animate-leaf-drift-1 top-2 left-[10%] opacity-80">
          <div className="w-2.5 h-1.5 rounded-full bg-pink-300 rotate-45 shadow-sm" />
        </div>
        {/* Particle 2 */}
        <div className="absolute animate-leaf-drift-2 top-8 left-[35%] opacity-70">
          <div className="w-2 h-1 rounded-full bg-amber-400 -rotate-12 shadow-sm" />
        </div>
        {/* Particle 3 */}
        <div className="absolute animate-leaf-drift-1 top-4 left-[65%] opacity-75">
          <div className="w-2.5 h-1.5 rounded-full bg-emerald-400 rotate-60 shadow-sm" />
        </div>
        {/* Particle 4 */}
        <div className="absolute animate-leaf-drift-3 top-10 left-[85%] opacity-70">
          <div className="w-2 h-1 rounded-full bg-pink-200 rotate-30 shadow-sm" />
        </div>
      </div>

    </div>
  );
}
