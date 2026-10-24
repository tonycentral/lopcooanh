import React, { useState, useEffect, useRef, useCallback } from 'react';
import AreaEntitySprite from './AreaEntitySprite';
import FarmerCharacter from './FarmerCharacter';
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

  const interactWithEntity = (entity) => {
    if (!entity) return;
    setPlayerAction('watering');
    sounds.playWater();
    setTimeout(() => {
      setPlayerAction(null);
      if (onSelectEntity) onSelectEntity(entity);
    }, 380);
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

  // Custom environment style per area
  const isOrchard = activeArea.id === 'orchard';

  return (
    <div 
      ref={mapRef}
      onClick={handleGroundClick}
      className="relative w-full h-full flex-1 min-h-0 overflow-hidden cursor-crosshair select-none font-sans"
      style={{
        backgroundColor: isOrchard ? '#2E6930' : '#1A331A',
        backgroundImage: isOrchard
          ? `radial-gradient(#3B7A3D 15%, transparent 16%), radial-gradient(#336E35 15%, transparent 16%)`
          : undefined,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        imageRendering: 'pixelated'
      }}
    >
      {/* =========================================================================
          1. HARVEST TOWN RICH FARM ENVIRONMENT
          ========================================================================= */}
      
      {/* Sunlit Mowing Lines / Lush Grass Checkerboard */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_50%,transparent_50%)] [background-size:60px_100%]" />

      {/* Rustic Earthen & Cobblestone Farm Pathways */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#795548" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#6D4C41" />
          </linearGradient>
        </defs>

        {/* Row 1 Pathway */}
        <path d="M 8 36 L 92 36" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
        <path d="M 8 36 L 92 36" stroke="url(#pathGrad)" strokeWidth="4.5" strokeLinecap="round" />
        
        {/* Row 2 Pathway */}
        <path d="M 8 70 L 92 70" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
        <path d="M 8 70 L 92 70" stroke="url(#pathGrad)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Center Connecting Avenue */}
        <path d="M 48 24 L 48 82" stroke="#4E342E" strokeWidth="7" strokeLinecap="round" />
        <path d="M 48 24 L 48 82" stroke="url(#pathGrad)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Left & Right Cross Paths */}
        <path d="M 12 36 L 12 70" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 2" />
        <path d="M 84 36 L 84 70" stroke="#6D4C41" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 2" />

        {/* Cobblestone Stepping Stones along the path */}
        <ellipse cx="21" cy="36" rx="1.5" ry="1" fill="#BCAAA4" opacity="0.8" />
        <ellipse cx="39" cy="36" rx="1.8" ry="1.2" fill="#D7CCC8" opacity="0.9" />
        <ellipse cx="57" cy="36" rx="1.6" ry="1" fill="#BCAAA4" opacity="0.8" />
        <ellipse cx="75" cy="36" rx="1.5" ry="1.1" fill="#D7CCC8" opacity="0.8" />
        
        <ellipse cx="21" cy="70" rx="1.5" ry="1.1" fill="#D7CCC8" opacity="0.8" />
        <ellipse cx="39" cy="70" rx="1.6" ry="1" fill="#BCAAA4" opacity="0.8" />
        <ellipse cx="57" cy="70" rx="1.7" ry="1.2" fill="#D7CCC8" opacity="0.9" />
        <ellipse cx="75" cy="70" rx="1.5" ry="1" fill="#BCAAA4" opacity="0.8" />
      </svg>

      {/* Decorative Wildflower Patches */}
      <div className="absolute top-10 left-6 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌼🌸🌼
      </div>
      <div className="absolute top-12 right-12 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌷🌼
      </div>
      <div className="absolute bottom-6 left-16 pointer-events-none text-xs opacity-75 filter drop-shadow">
        🌸🌼🌷
      </div>
      <div className="absolute bottom-8 right-8 pointer-events-none text-xs opacity-80 filter drop-shadow">
        🌼🌸
      </div>

      {/* Area Landmark Wood Sign (Top Center) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="px-4 py-1.5 rounded-xl bg-[#2D160A]/95 border-2 border-amber-400 text-amber-100 font-pixel text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
          <span className="text-xl filter drop-shadow">{activeArea.icon}</span>
          <span className="tracking-wide text-amber-200">{activeArea.name}</span>
          <span className="text-[10px] text-amber-300 px-2 py-0.2 rounded-md bg-[#1B0D06] border border-amber-500/60 uppercase">
            {activeArea.skillTitle}
          </span>
        </div>
      </div>

      {/* Quick Action Shortcuts (Store & Almanac) */}
      <div className="absolute top-2 right-3 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenAlmanac(); }}
          className="pixel-btn pixel-btn-gold font-pixel text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-md cursor-pointer"
          title="Mở Cuốn Niên Giám Học Sáng"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Almanac</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenStore(); }}
          className="pixel-btn pixel-btn-wood font-pixel text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-md cursor-pointer"
          title="Tiệm Nông Cụ & Hồi Mana"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cửa Hàng</span>
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
          3. PLAYABLE FARMER CHARACTER (16-BIT RETRO SPRITE)
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
          <div className="px-4 py-1.5 rounded-xl bg-[#2D160A]/95 border-2 border-amber-400 text-amber-100 font-pixel text-xs font-bold shadow-2xl flex items-center gap-2">
            <span className="text-sm">✨</span>
            <span>Nhấn <kbd className="px-1.5 py-0.5 bg-amber-500 text-[#201007] rounded text-[10px] font-black border border-yellow-200">E</kbd> hoặc Click để Chăm Sóc [{nearestEntity.name}]</span>
          </div>
        </aside>
      )}

      {/* =========================================================================
          4. MOBILE VIRTUAL CONTROLS (D-PAD & ACTION BUTTON)
          ========================================================================= */}
      <div className="sm:hidden absolute bottom-3 left-3 z-30 flex items-center gap-1 select-none pointer-events-auto">
        <div className="relative w-24 h-24 bg-black/60 backdrop-blur-sm rounded-full border border-amber-500/40 p-1">
          {/* UP */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('up')}
            onPointerUp={() => handleDpadUp('up')}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#4A2610] active:bg-amber-500 rounded text-amber-200 flex items-center justify-center font-bold"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          {/* DOWN */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('down')}
            onPointerUp={() => handleDpadUp('down')}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#4A2610] active:bg-amber-500 rounded text-amber-200 flex items-center justify-center font-bold"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* LEFT */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('left')}
            onPointerUp={() => handleDpadUp('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#4A2610] active:bg-amber-500 rounded text-amber-200 flex items-center justify-center font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {/* RIGHT */}
          <button
            type="button"
            onPointerDown={() => handleDpadDown('right')}
            onPointerUp={() => handleDpadUp('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#4A2610] active:bg-amber-500 rounded text-amber-200 flex items-center justify-center font-bold"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Action Button [E / Tưới] */}
      <div className="sm:hidden absolute bottom-4 right-3 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={triggerNearbyAction}
          className="w-14 h-14 rounded-full pixel-btn-gold text-[#201007] font-pixel text-xs font-black shadow-2xl flex flex-col items-center justify-center active:scale-90"
        >
          <Sparkles className="w-5 h-5" />
          <span>TƯỚI</span>
        </button>
      </div>

    </div>
  );
}
