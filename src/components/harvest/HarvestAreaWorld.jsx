import React, { useState, useEffect, useRef, useCallback } from 'react';
import AreaEntitySprite from './AreaEntitySprite';
import FarmerCharacter from './FarmerCharacter';
import AmbientWildlife from './AmbientWildlife';
import AreaEnvironmentDecor from './AreaEnvironmentDecor';
import WateringSplashEffect from './WateringSplashEffect';
import { sounds } from '../../services/soundEffects';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  ShoppingBag,
  Info
} from 'lucide-react';

export default function HarvestAreaWorld({
  activeArea, // Object from FARM_AREAS
  entities = [], // 10 topic entities for this area
  onSelectEntity, // (entity) => open practice modal
  onOpenStore,
  onOpenAlmanac,
  farmerName = 'Tony Nguyen',
  farmerLevel = 1,
  mana = 85,
  gold = 250
}) {
  const mapRef = useRef(null);

  // 1. Player Position & State (Coordinates in Percentage 0-100%)
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 52 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [playerAction, setPlayerAction] = useState(null);

  // Interactive Watering Spray Animation State
  const [wateringTarget, setWateringTarget] = useState({ x: 50, y: 50, active: false });

  // Click-to-Move Target
  const [targetDestination, setTargetDestination] = useState(null);
  const [pendingTargetEntity, setPendingTargetEntity] = useState(null);

  // Keyboard Navigation Loop
  const keysPressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e', 'enter'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
        setTargetDestination(null);
      }

      if (key === ' ' || key === 'e' || key === 'enter') {
        triggerNearbyAction();
      }
    };

    const handleKeyUp = (e) => {
      delete keysPressed.current[e.key.toLowerCase()];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Tick Loop (Movement & Pathing)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setPlayerPos(prev => {
        let dx = 0;
        let dy = 0;
        const speed = 26 * dt; // Smooth walking speed

        // Keyboard
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= speed;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += speed;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= speed;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += speed;

        // Click-to-Move
        if (targetDestination) {
          const distX = targetDestination.x - prev.x;
          const distY = targetDestination.y - prev.y;
          const dist = Math.hypot(distX, distY);

          if (dist > 1.2) {
            dx = (distX / dist) * speed;
            dy = (distY / dist) * speed;
          } else {
            setTargetDestination(null);
            if (pendingTargetEntity) {
              interactWithEntity(pendingTargetEntity);
              setPendingTargetEntity(null);
            }
          }
        }

        const moving = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
        setIsMoving(moving);

        if (moving) {
          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 'right' : 'left');
          } else {
            setDirection(dy > 0 ? 'down' : 'up');
          }
          setWalkFrame(f => (f + 1) % 60);

          const newX = Math.max(6, Math.min(94, prev.x + dx));
          const newY = Math.max(14, Math.min(90, prev.y + dy));
          return { x: newX, y: newY };
        }

        return prev;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [targetDestination, pendingTargetEntity]);

  // Click on Ground to Walk
  const handleGroundClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setTargetDestination({ x: clickX, y: clickY });
    setPendingTargetEntity(null);
    sounds.playClick();
  };

  // Find Nearest Topic Entity (Proximity Detection)
  const getNearestEntity = useCallback(() => {
    let nearest = null;
    let minDist = 13; // 13% proximity radius

    entities.forEach(ent => {
      const dist = Math.hypot(ent.x - playerPos.x, ent.y - playerPos.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = ent;
      }
    });

    return nearest;
  }, [playerPos, entities]);

  const nearestEntity = getNearestEntity();

  // Interactive Watering & Tending
  const interactWithEntity = (entity) => {
    if (!entity) return;
    setPlayerAction('watering');
    setWateringTarget({ x: entity.x, y: entity.y, active: true });
    sounds.playWater();

    setTimeout(() => {
      setPlayerAction(null);
      setWateringTarget(prev => ({ ...prev, active: false }));
      if (onSelectEntity) onSelectEntity(entity);
    }, 600);
  };

  const triggerNearbyAction = () => {
    if (nearestEntity) {
      interactWithEntity(nearestEntity);
    }
  };

  const handleEntityClick = (e, entity) => {
    e.stopPropagation();
    setTargetDestination({ x: entity.x, y: entity.y });
    setPendingTargetEntity(entity);
    sounds.playClick();
  };

  // Mobile D-Pad Handlers
  const handleDpadDown = (dir) => {
    if (dir === 'up') keysPressed.current['w'] = true;
    if (dir === 'down') keysPressed.current['s'] = true;
    if (dir === 'left') keysPressed.current['a'] = true;
    if (dir === 'right') keysPressed.current['d'] = true;
  };
  const handleDpadUp = (dir) => {
    if (dir === 'up') delete keysPressed.current['w'];
    if (dir === 'down') delete keysPressed.current['s'];
    if (dir === 'left') delete keysPressed.current['a'];
    if (dir === 'right') delete keysPressed.current['d'];
  };

  // Distinct environment styling per area
  const isOrchard = activeArea.id === 'orchard';
  const isPaddy = activeArea.id === 'paddy';
  const isGreenhouse = activeArea.id === 'greenhouse';
  const isPond = activeArea.id === 'pond';
  const isPasture = activeArea.id === 'pasture';
  const isWorkshop = activeArea.id === 'workshop';
  const isLibrary = activeArea.id === 'library';

  let bgMainColor = '#4b692f'; // Strict Accent Green
  if (isPaddy) bgMainColor = '#4b692f';
  if (isGreenhouse) bgMainColor = '#354d1f';
  if (isPond) bgMainColor = '#243b35';
  if (isPasture) bgMainColor = '#663931';
  if (isWorkshop) bgMainColor = '#573822';
  if (isLibrary) bgMainColor = '#45283c';

  return (
    <div 
      ref={mapRef}
      onClick={handleGroundClick}
      className="relative w-full h-full flex-1 min-h-0 overflow-hidden cursor-crosshair select-none font-pixel"
      style={{
        backgroundColor: bgMainColor,
        backgroundImage: isOrchard
          ? `radial-gradient(#354d1f 15%, transparent 16%), radial-gradient(#4b692f 15%, transparent 16%)`
          : isWorkshop
          ? `radial-gradient(#45283c 20%, transparent 21%), radial-gradient(#663931 20%, transparent 21%)`
          : isLibrary
          ? `radial-gradient(#663931 15%, transparent 16%), radial-gradient(#8f563b 15%, transparent 16%)`
          : undefined,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        imageRendering: 'pixelated'
      }}
    >
      {/* =========================================================================
          1. ENVIRONMENT DECORATIONS PER AREA (Fences, Water Wells, Crates, Barns)
          ========================================================================= */}
      <AreaEnvironmentDecor areaId={activeArea.id} />

      {/* Sunlit Mowing Lines / Lush Grass Checkerboard */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_50%,transparent_50%)] [background-size:60px_100%]" />

      {/* Rustic Wood & Cobblestone Farm Pathways (Strict Retro Warm Palette) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8f563b" />
            <stop offset="50%" stopColor="#a86e4e" />
            <stop offset="100%" stopColor="#663931" />
          </linearGradient>
        </defs>

        {/* Row 1 Pathway */}
        <path d="M 8 36 L 92 36" stroke="#45283c" strokeWidth="6" strokeLinecap="square" />
        <path d="M 8 36 L 92 36" stroke="url(#pathGrad)" strokeWidth="4" strokeLinecap="square" />
        
        {/* Row 2 Pathway */}
        <path d="M 8 70 L 92 70" stroke="#45283c" strokeWidth="6" strokeLinecap="square" />
        <path d="M 8 70 L 92 70" stroke="url(#pathGrad)" strokeWidth="4" strokeLinecap="square" />

        {/* Center Connecting Avenue */}
        <path d="M 48 24 L 48 82" stroke="#45283c" strokeWidth="7" strokeLinecap="square" />
        <path d="M 48 24 L 48 82" stroke="url(#pathGrad)" strokeWidth="5" strokeLinecap="square" />

        {/* Left & Right Cross Paths */}
        <path d="M 12 36 L 12 70" stroke="#663931" strokeWidth="3" strokeLinecap="square" strokeDasharray="2 2" />
        <path d="M 84 36 L 84 70" stroke="#663931" strokeWidth="3" strokeLinecap="square" strokeDasharray="2 2" />

        {/* Cobblestone Stepping Stones along the path */}
        <ellipse cx="21" cy="36" rx="1.5" ry="1" fill="#d7b594" opacity="0.9" />
        <ellipse cx="39" cy="36" rx="1.8" ry="1.2" fill="#e8cfa6" opacity="0.9" />
        <ellipse cx="57" cy="36" rx="1.6" ry="1" fill="#d7b594" opacity="0.9" />
        <ellipse cx="75" cy="36" rx="1.5" ry="1.1" fill="#e8cfa6" opacity="0.9" />
        
        <ellipse cx="21" cy="70" rx="1.5" ry="1.1" fill="#e8cfa6" opacity="0.9" />
        <ellipse cx="39" cy="70" rx="1.6" ry="1" fill="#d7b594" opacity="0.9" />
        <ellipse cx="57" cy="70" rx="1.7" ry="1.2" fill="#e8cfa6" opacity="0.9" />
        <ellipse cx="75" cy="70" rx="1.5" ry="1" fill="#d7b594" opacity="0.9" />
      </svg>

      {/* Decorative Wildflower Patches */}
      <div className="absolute top-10 left-10 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌼🌸🌼
      </div>
      <div className="absolute top-12 right-16 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌷🌼
      </div>
      <div className="absolute bottom-10 left-20 pointer-events-none text-xs opacity-75 filter drop-shadow">
        🌸🌼🌷
      </div>
      <div className="absolute bottom-12 right-12 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌼🌸
      </div>

      {/* Area Landmark Wood Sign (Top Center) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="rpg-panel-paper px-3 py-1 flex items-center gap-2">
          <span className="text-base">{activeArea.icon}</span>
          <span className="text-[10px] font-bold text-[#2c1b18]">{activeArea.name}</span>
          <span className="text-[8px] font-bold px-1.5 py-0.5 border-2 border-[#45283c] bg-[#8f563b] text-[#e8cfa6] uppercase">
            {activeArea.skillTitle}
          </span>
        </div>
      </div>

      {/* Quick Action Shortcuts (Store & Almanac) */}
      <div className="absolute top-2 right-3 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenAlmanac(); }}
          className="rpg-btn text-[9px] py-1 px-2 flex items-center gap-1 cursor-pointer"
          title="Mở Cuốn Niên Giám Học Sáng"
        >
          <i className="pixelart-icons-font-book-open text-xs"></i>
          <span className="hidden sm:inline">ALMANAC</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenStore(); }}
          className="rpg-btn text-[9px] py-1 px-2 flex items-center gap-1 cursor-pointer"
          title="Tiệm Nông Cụ & Hồi Mana"
        >
          <i className="pixelart-icons-font-shopping-bag text-xs"></i>
          <span className="hidden sm:inline">TIỆM</span>
        </button>
      </div>

      {/* =========================================================================
          2. THE 10 REAL TOPIC ENTITY SPRITES
          ========================================================================= */}
      {entities.map(entity => {
        const isNearby = nearestEntity?.id === entity.id;

        return (
          <div
            key={entity.id}
            onClick={(e) => handleEntityClick(e, entity)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform active:scale-95"
            style={{
              left: `${entity.x}%`,
              top: `${entity.y}%`
            }}
          >
            <AreaEntitySprite
              areaId={activeArea.id}
              entity={entity}
              isNearby={isNearby}
            />
          </div>
        );
      })}

      {/* =========================================================================
          3. INTERACTIVE WATERING SPRAY & SPLASH ANIMATION EFFECT
          ========================================================================= */}
      <WateringSplashEffect 
        x={wateringTarget.x} 
        y={wateringTarget.y} 
        isActive={wateringTarget.active} 
      />

      {/* =========================================================================
          4. PLAYABLE FARMER CHARACTER (16-BIT RETRO SPRITE)
          ========================================================================= */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-75"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`
        }}
      >
        <FarmerCharacter
          direction={direction}
          isMoving={isMoving}
          walkFrame={walkFrame}
          action={playerAction}
          farmerName={farmerName}
          farmerLevel={farmerLevel}
          isNearTarget={!!nearestEntity}
          targetName={nearestEntity?.name}
        />
      </div>

      {/* Target Destination Marker (When Clicked) */}
      {targetDestination && (
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-ping"
          style={{
            left: `${targetDestination.x}%`,
            top: `${targetDestination.y}%`
          }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-amber-300 bg-amber-400/40" />
        </div>
      )}

      {/* Proximity Action Banner (Floating at Bottom Center) */}
      {nearestEntity && (
        <aside className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce pointer-events-none">
          <div className="rpg-panel-paper px-3 py-1.5 text-[8.5px] font-bold flex items-center gap-2">
            <span>💧</span>
            <span>Nhấn <kbd className="px-1.5 py-0.5 border-2 border-[#45283c] bg-[#4b692f] text-white text-[8px] font-bold">E</kbd> hoặc Chạm để Chăm Sóc [{nearestEntity.name}]</span>
          </div>
        </aside>
      )}

      {/* =========================================================================
          5. AMBIENT LIVING WILDLIFE (Birds Flying, Butterflies, Petals Floating)
          ========================================================================= */}
      <AmbientWildlife areaId={activeArea.id} />

      {/* =========================================================================
          6. MOBILE VIRTUAL CONTROLS (D-PAD & ACTION BUTTON)
          ========================================================================= */}
      <div className="sm:hidden absolute bottom-3 left-3 z-30 flex items-center gap-1 select-none pointer-events-auto">
        <div className="relative w-24 h-24 bg-[#45283c] border-4 border-[#2c1b18] p-1 shadow-lg">
          {/* UP */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('up')}
            onPointerUp={() => handleDpadUp('up')}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#8f563b] active:bg-[#4b692f] border-2 border-[#45283c] text-[#e8cfa6] flex items-center justify-center font-bold text-xs"
          >
            ▲
          </button>
          {/* DOWN */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('down')}
            onPointerUp={() => handleDpadUp('down')}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#8f563b] active:bg-[#4b692f] border-2 border-[#45283c] text-[#e8cfa6] flex items-center justify-center font-bold text-xs"
          >
            ▼
          </button>
          {/* LEFT */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('left')}
            onPointerUp={() => handleDpadUp('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#8f563b] active:bg-[#4b692f] border-2 border-[#45283c] text-[#e8cfa6] flex items-center justify-center font-bold text-xs"
          >
            ◀
          </button>
          {/* RIGHT */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('right')}
            onPointerUp={() => handleDpadUp('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#8f563b] active:bg-[#4b692f] border-2 border-[#45283c] text-[#e8cfa6] flex items-center justify-center font-bold text-xs"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Mobile Action Button [E / Tưới] */}
      <div className="sm:hidden absolute bottom-4 right-3 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={triggerNearbyAction}
          className="w-14 h-14 rpg-btn-green text-[9px] font-bold flex flex-col items-center justify-center active:scale-95"
        >
          <span className="text-sm">💧</span>
          <span>TƯỚI</span>
        </button>
      </div>

    </div>
  );
}
