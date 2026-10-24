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
  farmerName = 'Học Viên Mochi',
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
        const speed = 25 * dt; // 25% of screen per second

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

          const newX = Math.max(5, Math.min(95, prev.x + dx));
          const newY = Math.max(12, Math.min(92, prev.y + dy));
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
    let minDist = 12; // 12% proximity radius

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
    }, 400);
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

  return (
    <div 
      ref={mapRef}
      onClick={handleGroundClick}
      className={`relative w-full h-full flex-1 min-h-0 overflow-hidden bg-gradient-to-b ${activeArea.bgGradient} cursor-crosshair select-none font-sans`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 1. LUSH LIVING ENVIRONMENT BACKGROUND */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] [background-size:24px_24px]" />

      {/* Pathways between the 10 topic mounds */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35">
        <path d="M 12 36 L 30 36 L 48 36 L 66 36 L 84 36" stroke="#8D6E63" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 12 70 L 30 70 L 48 70 L 66 70 L 84 70" stroke="#8D6E63" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 48 36 L 48 70" stroke="#8D6E63" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 12 36 L 12 70" stroke="#8D6E63" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 84 36 L 84 70" stroke="#8D6E63" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Area Landmark Banner (Top Center) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="px-3.5 py-1 rounded-xl bg-black/80 border-2 border-amber-400 text-amber-200 font-pixel text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2">
          <span className="text-lg">{activeArea.icon}</span>
          <span className="uppercase tracking-wider">{activeArea.name}</span>
          <span className="text-[10px] text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/70">
            {activeArea.skillTitle}
          </span>
        </div>
        <div className="text-[9px] text-amber-100/80 font-pixel mt-0.5 drop-shadow">
          10 Chủ Đề IELTS Cốt Lõi • Càng luyện tập cây càng lớn, lâu không học sẽ héo úa
        </div>
      </div>

      {/* Side Quick Action Pills (Store & Almanac) */}
      <div className="absolute top-2 right-3 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenAlmanac(); }}
          className="pixel-btn pixel-btn-gold font-pixel text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-md"
          title="Mở Cuốn Niên Giám Học Sáng"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Almanac</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); sounds.playClick(); onOpenStore(); }}
          className="pixel-btn pixel-btn-wood font-pixel text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-md"
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
            className="absolute cursor-pointer select-none transition-transform duration-100 z-10"
            style={{
              left: `${entity.x}%`,
              top: `${entity.y}%`,
              transform: 'translate(-50%, -50%)'
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
          3. PLAYABLE FARMER CHARACTER (WALKING IN THE ACTIVE AREA)
          ========================================================================= */}
      <FarmerCharacter
        x={playerPos.x}
        y={playerPos.y}
        direction={direction}
        isMoving={isMoving}
        walkFrame={walkFrame}
        action={playerAction}
        playerName={farmerName}
        level={farmerLevel}
        interactionPrompt={
          nearestEntity 
            ? `Chăm sóc: ${nearestEntity.name} (Lv.${nearestEntity.level})` 
            : null
        }
      />

      {/* =========================================================================
          4. MOBILE D-PAD & TOUCH ACTION CONTROLS
          ========================================================================= */}
      <div className="absolute bottom-3 left-3 flex flex-col items-center gap-1 z-30 sm:hidden pointer-events-auto">
        <button
          onTouchStart={() => handleDpadDown('up')}
          onTouchEnd={() => handleDpadUp('up')}
          onMouseDown={() => handleDpadDown('up')}
          onMouseUp={() => handleDpadUp('up')}
          className="w-10 h-10 rounded-lg bg-[#24130A]/90 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-bold active:bg-amber-500 active:text-black shadow-lg"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onTouchStart={() => handleDpadDown('left')}
            onTouchEnd={() => handleDpadUp('left')}
            onMouseDown={() => handleDpadDown('left')}
            onMouseUp={() => handleDpadUp('left')}
            className="w-10 h-10 rounded-lg bg-[#24130A]/90 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-bold active:bg-amber-500 active:text-black shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => handleDpadDown('down')}
            onTouchEnd={() => handleDpadUp('down')}
            onMouseDown={() => handleDpadDown('down')}
            onMouseUp={() => handleDpadUp('down')}
            className="w-10 h-10 rounded-lg bg-[#24130A]/90 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-bold active:bg-amber-500 active:text-black shadow-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => handleDpadDown('right')}
            onTouchEnd={() => handleDpadUp('right')}
            onMouseDown={() => handleDpadDown('right')}
            onMouseUp={() => handleDpadUp('right')}
            className="w-10 h-10 rounded-lg bg-[#24130A]/90 border-2 border-amber-400 text-amber-200 flex items-center justify-center font-bold active:bg-amber-500 active:text-black shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Action Button */}
      {nearestEntity && (
        <div className="absolute bottom-3 right-3 sm:hidden z-30 pointer-events-auto">
          <button
            onClick={triggerNearbyAction}
            className="px-4 py-3 rounded-xl bg-amber-500 border-3 border-amber-200 text-[#24130A] font-pixel text-xs font-black shadow-2xl active:scale-95 animate-pulse"
          >
            CHĂM SÓC
          </button>
        </div>
      )}

      {/* Desktop Helper Instruction overlay */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-400/50 text-[10px] font-pixel text-amber-200 pointer-events-none z-20">
        <span>🎮 WASD / Phím Mũi Tên di chuyển</span>
        <span>•</span>
        <span>Nhấn [E] hoặc [Space] để chăm sóc cây</span>
        <span>•</span>
        <span>Nhấp chuột để đi tới</span>
      </div>

    </div>
  );
}
