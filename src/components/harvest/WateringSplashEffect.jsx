import React from 'react';

/**
 * Interactive Watering & Care Animation Effect
 * Displays sparkling water arcs, droplet splashes, and expanding ripple rings
 * when the player waters or nurtures a plant/tree/animal.
 */
export default function WateringSplashEffect({
  x = 50,
  y = 50,
  isActive = false
}) {
  if (!isActive) return null;

  return (
    <div 
      className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Expanding Water Ripple Ring at Base */}
      <div className="w-20 h-8 rounded-full border-2 border-cyan-300 bg-cyan-400/20 animate-ping absolute -top-4 -left-10" />

      {/* Sparkling Water Spray Arc */}
      <svg className="w-24 h-24 -mt-16 -ml-12 overflow-visible" viewBox="0 0 96 96">
        {/* Spray Arcs */}
        <path d="M 24 64 Q 48 20 68 52" stroke="#4FC3F7" strokeWidth="2.5" strokeDasharray="4 3" fill="none" className="animate-pulse" />
        <path d="M 28 66 Q 52 26 72 58" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 3" fill="none" className="animate-pulse" />
        <path d="M 20 62 Q 44 14 64 48" stroke="#80D8FF" strokeWidth="2" strokeDasharray="4 2" fill="none" className="animate-pulse" />

        {/* Sparkling Droplets */}
        <circle cx="58" cy="38" r="3" fill="#E0F7FA" className="animate-bounce" />
        <circle cx="68" cy="46" r="3.5" fill="#00E5FF" className="animate-ping" />
        <circle cx="64" cy="54" r="2.5" fill="#80D8FF" className="animate-bounce" />
        <circle cx="76" cy="50" r="3" fill="#E0F7FA" className="animate-ping" />
        <circle cx="48" cy="32" r="2.5" fill="#00E5FF" />
      </svg>
    </div>
  );
}
