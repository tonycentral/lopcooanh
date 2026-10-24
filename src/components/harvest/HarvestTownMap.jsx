import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Package, 
  Heart, 
  BookOpen, 
  Utensils, 
  Flame, 
  Award,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import FarmerCharacter from './FarmerCharacter';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { CROPS_CONFIG, QUALITY_TIERS } from '../../services/harvestTownService';

export default function HarvestTownMap({
  state,
  onHarvestPlot,
  onPlantPlot,
  onWaterPlotWithPractice,
  onOpenSeedPouch,
  onOpenShippingBin,
  onOpenBulletin,
  onOpenCoOanhManor,
  onOpenStore,
  onOpenMines,
  onOpenFishing,
  onOpenAlmanac,
  onOpenPasture,
  onOpenKitchen,
  onOpenSeedVault,
  onOpenPestChallenge,
  onClearWeeds
}) {
  const mapRef = useRef(null);

  // 1. Player Position & State (Coordinates in Percentage 0-100%)
  const [playerPos, setPlayerPos] = useState({ x: 42, y: 55 });
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [playerAction, setPlayerAction] = useState(null); // null | 'watering' | 'harvesting' | 'reading'
  
  // Target destination when clicking/tapping on ground
  const [targetDestination, setTargetDestination] = useState(null);
  const [pendingTargetAction, setPendingTargetAction] = useState(null);

  // 2. Keyboard Navigation Loop
  const keysPressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input / textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e', 'enter'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
        setTargetDestination(null); // Cancel click-to-walk if keyboard is used
      }

      // Action trigger
      if (key === ' ' || key === 'e' || key === 'enter') {
        triggerNearbyAction();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      delete keysPressed.current[key];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 3. Game Tick Loop for Movement (60 FPS)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const gameLoop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setPlayerPos(prev => {
        let dx = 0;
        let dy = 0;
        const speed = 24 * dt; // 24% of screen width per second

        // Check Keyboard
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= speed;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += speed;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= speed;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += speed;

        // Check Click-to-Move Target
        if (targetDestination) {
          const distX = targetDestination.x - prev.x;
          const distY = targetDestination.y - prev.y;
          const dist = Math.hypot(distX, distY);

          if (dist > 1.2) {
            dx = (distX / dist) * speed;
            dy = (distY / dist) * speed;
          } else {
            // Arrived at target!
            setTargetDestination(null);
            if (pendingTargetAction) {
              executeEntityAction(pendingTargetAction);
              setPendingTargetAction(null);
            }
          }
        }

        const moving = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
        setIsMoving(moving);

        if (moving) {
          // Update facing direction
          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 'right' : 'left');
          } else {
            setDirection(dy > 0 ? 'down' : 'up');
          }
          // Step frame animation
          setWalkFrame(f => (f + 1) % 60);

          // Constrain within bounds (4% to 96%)
          const newX = Math.max(4, Math.min(96, prev.x + dx));
          const newY = Math.max(8, Math.min(94, prev.y + dy));
          return { x: newX, y: newY };
        }

        return prev;
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [targetDestination, pendingTargetAction]);

  // 4. Map Click to Walk
  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTargetDestination({ x: clickX, y: clickY });
    setPendingTargetAction(null);
    sounds.playClick();
  };

  // 5. Entities Definition on the Farm Map
  const entities = [
    // Buildings
    { id: 'almanac', type: 'building', name: 'Almanac Nhà Gỗ', x: 14, y: 18, radius: 12, actionName: 'Mở Almanac Học Sáng', onInteract: onOpenAlmanac },
    { id: 'kitchen', type: 'building', name: 'Bếp Collocations', x: 38, y: 18, radius: 10, actionName: 'Nấu Món Collocation', onInteract: onOpenKitchen },
    { id: 'pasture', type: 'building', name: 'Chuồng Ngữ Pháp', x: 62, y: 18, radius: 12, actionName: 'Chăm Sóc Vật Nuôi', onInteract: onOpenPasture },
    { id: 'cooanh', type: 'building', name: 'Dinh Thự Cô Oanh', x: 88, y: 18, radius: 10, actionName: 'Gặp Cô Oanh', onInteract: onOpenCoOanhManor },
    { id: 'bulletin', type: 'building', name: 'Bảng Tin Thị Trấn', x: 80, y: 44, radius: 9, actionName: 'Xem Nhiệm Vụ', onInteract: onOpenBulletin },
    { id: 'shipping', type: 'building', name: 'Thùng Xuất Khẩu', x: 92, y: 46, radius: 9, actionName: 'Mở Thùng Xuất Khẩu', onInteract: onOpenShippingBin },
    { id: 'store', type: 'building', name: 'Tiệm Nông Cụ', x: 80, y: 72, radius: 9, actionName: 'Mua Hạt Giống', onInteract: onOpenStore },
    { id: 'seedvault', type: 'building', name: 'Hầm Bảo Vật Seed Vault', x: 92, y: 72, radius: 9, actionName: 'Hầm Hạt Giống', onInteract: onOpenSeedVault },
    { id: 'mines', type: 'building', name: 'Hầm Mỏ Reading', x: 8, y: 88, radius: 10, actionName: 'Vào Hầm Mỏ', onInteract: onOpenMines },
    { id: 'pier', type: 'building', name: 'Bến Sông Câu Cá', x: 90, y: 90, radius: 10, actionName: 'Câu Cá & Nghe Âm', onInteract: onOpenFishing }
  ];

  // 12 Organic Soil Mound Coordinates inside the central farmstead (cols: 4, rows: 3)
  const plotPositions = [
    { id: 1, x: 14, y: 43 }, { id: 2, x: 28, y: 43 }, { id: 3, x: 42, y: 43 }, { id: 4, x: 56, y: 43 },
    { id: 5, x: 14, y: 58 }, { id: 6, x: 28, y: 58 }, { id: 7, x: 42, y: 58 }, { id: 8, x: 56, y: 58 },
    { id: 9, x: 14, y: 73 }, { id: 10, x: 28, y: 73 }, { id: 11, x: 42, y: 73 }, { id: 12, x: 56, y: 73 }
  ];

  // Detect Nearest Interactive Entity
  const getNearestEntity = useCallback(() => {
    let nearest = null;
    let minDist = 14; // Proximity threshold in %

    // Check Crop Plots
    plotPositions.forEach(pos => {
      const plot = state.plots.find(p => p.id === pos.id);
      if (!plot) return;
      const dist = Math.hypot(pos.x - playerPos.x, pos.y - playerPos.y);
      if (dist < minDist) {
        minDist = dist;
        let actionName = 'Gieo Hạt';
        if (plot.pest) actionName = `Diệt Sâu: ${plot.pest.name}`;
        else if (plot.state === 'ripe') actionName = `Gặt: ${plot.word || 'Cây Chín'}`;
        else if (plot.state === 'growing') actionName = `Tưới Nước: ${plot.word || 'Ô Đất'}`;
        else if (plot.state === 'weeds') actionName = 'Dọn Cỏ';

        nearest = {
          id: `plot_${plot.id}`,
          type: 'plot',
          plot,
          actionName,
          x: pos.x,
          y: pos.y
        };
      }
    });

    // Check Buildings
    entities.forEach(ent => {
      const dist = Math.hypot(ent.x - playerPos.x, ent.y - playerPos.y);
      if (dist < ent.radius && dist < minDist) {
        minDist = dist;
        nearest = ent;
      }
    });

    return nearest;
  }, [playerPos, state.plots]);

  const nearestEntity = getNearestEntity();

  // Execute Action for an Entity
  const executeEntityAction = (entity) => {
    if (!entity) return;

    if (entity.type === 'plot') {
      const plot = entity.plot;
      if (plot.pest) {
        sounds.playClick();
        if (onOpenPestChallenge) onOpenPestChallenge(plot);
      } else if (plot.state === 'ripe') {
        setPlayerAction('harvesting');
        sounds.playHarvest();
        confetti({ particleCount: 35, spread: 60 });
        setTimeout(() => setPlayerAction(null), 700);
        onHarvestPlot(plot.id);
      } else if (plot.state === 'empty_tilled') {
        sounds.playClick();
        onOpenSeedPouch(plot.id);
      } else if (plot.state === 'growing') {
        setPlayerAction('watering');
        sounds.playWater();
        setTimeout(() => setPlayerAction(null), 700);
        const crop = CROPS_CONFIG[plot.cropType];
        if (crop && onWaterPlotWithPractice) {
          onWaterPlotWithPractice(crop.skill || 'vocab', plot.id);
        }
      } else if (plot.state === 'weeds') {
        sounds.playClick();
        if (onClearWeeds) onClearWeeds();
      }
    } else if (entity.onInteract) {
      if (entity.id === 'almanac') setPlayerAction('reading');
      sounds.playClick();
      setTimeout(() => setPlayerAction(null), 600);
      entity.onInteract();
    }
  };

  const triggerNearbyAction = () => {
    if (nearestEntity) {
      executeEntityAction(nearestEntity);
    }
  };

  // Direct Click on an Object: Walk there and trigger action!
  const handleDirectObjectClick = (e, entity) => {
    e.stopPropagation();
    setTargetDestination({ x: entity.x, y: entity.y });
    setPendingTargetAction(entity);
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
      onClick={handleMapClick}
      className="relative w-full h-full flex-1 min-h-0 overflow-hidden bg-[#2D5A27] cursor-crosshair select-none font-sans"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 1. LUSH PIXEL FIELD GROUND */}
      {/* Grass tile matrix & organic dirt trails */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#81C784_2px,transparent_2px)] [background-size:20px_20px]" />
      
      {/* Cobblestone Dirt Road connecting buildings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <path d="M 14 26 L 14 43 L 38 43 L 62 43 L 80 43 L 80 72 L 90 90" stroke="#795548" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 38 26 L 38 43 L 62 43 L 62 26" stroke="#795548" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 88 26 L 80 43 L 92 46" stroke="#795548" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 14 73 L 8 88" stroke="#795548" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Decorative Wild Flower & Grass Tufts */}
      <div className="absolute top-[32%] left-[18%] text-sm opacity-70 pointer-events-none animate-pulse">🌼</div>
      <div className="absolute top-[68%] left-[4%] text-sm opacity-70 pointer-events-none">🌿</div>
      <div className="absolute top-[82%] left-[32%] text-sm opacity-70 pointer-events-none">🍄</div>
      <div className="absolute top-[30%] left-[72%] text-sm opacity-70 pointer-events-none">🌻</div>
      <div className="absolute top-[55%] left-[84%] text-sm opacity-70 pointer-events-none">🌷</div>

      {/* =========================================================================
          2. LIVING FARM BUILDINGS & INTERACTIVE LANDMARKS
          ========================================================================= */}

      {/* (A) Farmhouse & Almanac Porch (Top-Left: x: 14%, y: 18%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[0])}
        className="absolute top-[2%] left-[3%] w-[22%] min-w-[130px] max-w-[200px] cursor-pointer group z-10 transition hover:scale-[1.02]"
        title="Nhà Gỗ Nông Dân - Đến bàn gỗ đọc Cuốn Niên Giám Morning Almanac"
      >
        <div className="relative pixel-panel p-2 rounded-xl bg-[#4A2B11] border-3 border-[#1E0F07] shadow-lg flex flex-col items-center">
          {/* Chimney with animated smoke */}
          <div className="absolute -top-3 right-3 flex flex-col items-center pointer-events-none">
            <span className="text-[10px] text-stone-300 animate-bounce">💨</span>
          </div>
          <div className="text-3xl sm:text-4xl filter drop-shadow">🏡</div>
          <div className="font-pixel text-[9px] sm:text-[10px] text-amber-200 font-bold uppercase mt-1">
            NHÀ GỖ ALMANAC
          </div>
          
          {/* Glowing Almanac Book on Porch */}
          <div className="mt-1 px-2 py-0.5 rounded bg-[#24130A] border border-amber-400/80 flex items-center gap-1 animate-pulse">
            <BookOpen className="w-2.5 h-2.5 text-cyan-400" />
            <span className="font-pixel text-[8px] text-amber-300">
              {state.almanac?.completedToday ? 'Almanac ✓' : 'ĐỌC ALMANAC'}
            </span>
          </div>
        </div>
      </div>

      {/* (B) The Kitchen Cottage (Top-Center: x: 38%, y: 18%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[1])}
        className="absolute top-[2%] left-[27%] w-[20%] min-w-[120px] max-w-[180px] cursor-pointer group z-10 transition hover:scale-[1.02]"
        title="Nhà Bếp Collocations - Nấu món ăn học thuật hồi phục Focus Points!"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#3B2314] border-3 border-[#1E0F07] shadow-lg flex flex-col items-center">
          <div className="text-3xl sm:text-4xl filter drop-shadow">🍳</div>
          <div className="font-pixel text-[9px] sm:text-[10px] text-amber-200 font-bold uppercase mt-1">
            BẾP COLLOCATIONS
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/70 text-[8px] font-pixel text-amber-300">
            Nấu Món C1
          </div>
        </div>
      </div>

      {/* (C) Grammar Pasture & Barn (Top-Right: x: 62%, y: 18%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[2])}
        className="absolute top-[2%] left-[49%] w-[24%] min-w-[140px] max-w-[210px] cursor-pointer group z-10 transition hover:scale-[1.02]"
        title="Chuồng Vật Nuôi Ngữ Pháp - Chăm Đàn Gà SVO, Bò Thời Gian, Cừu Mạo Từ"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#2D1B13] border-3 border-[#1E0F07] shadow-lg flex flex-col items-center">
          {/* Animated livestock icons inside fence */}
          <div className="flex items-center gap-1.5 text-2xl filter drop-shadow">
            <span className="animate-bounce">🐔</span>
            <span>🐄</span>
            <span>🐑</span>
            <span className="text-sm">🐝</span>
          </div>
          <div className="font-pixel text-[9px] sm:text-[10px] text-amber-200 font-bold uppercase mt-1">
            CHUỒNG NGỮ PHÁP
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/70 text-[8px] font-pixel text-emerald-300 flex items-center gap-1">
            <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
            <span>Chăm bón đàn vật nuôi</span>
          </div>
        </div>
      </div>

      {/* (D) Cô Oanh's Manor (Far Top-Right: x: 88%, y: 18%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[3])}
        className="absolute top-[2%] right-[2%] w-[22%] min-w-[130px] max-w-[190px] cursor-pointer group z-10 transition hover:scale-[1.02]"
        title="Dinh Thự Cố Vấn Cô Oanh - Nhận bí kíp 5 tim & lời khuyên IELTS"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#3B1E2B] border-3 border-[#1A0A12] shadow-lg flex flex-col items-center">
          <div className="text-3xl sm:text-4xl filter drop-shadow">👩‍🏫</div>
          <div className="font-pixel text-[9px] sm:text-[10px] text-rose-300 font-bold uppercase mt-1 flex items-center gap-1">
            <span>CÔ OANH</span>
            <span className="text-rose-400">❤️{state.coOanhFriendship?.hearts || 2}</span>
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/70 text-[8px] font-pixel text-rose-200">
            Bí Kíp 5 Tim
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THE 12 ORGANIC CROP MOUNDS (NATURAL SOIL BEDS)
          ========================================================================= */}
      
      {/* Soil Basin Frame */}
      <div className="absolute top-[34%] left-[4%] w-[64%] h-[56%] rounded-2xl bg-[#3E2723]/90 border-4 border-[#271406] shadow-2xl p-2 pointer-events-none">
        <div className="w-full h-full border border-dashed border-[#5D4037]/60 rounded-xl" />
      </div>

      {/* 12 Live Crop Plots */}
      {plotPositions.map(pos => {
        const plot = state.plots.find(p => p.id === pos.id);
        if (!plot) return null;

        const isRipe = plot.state === 'ripe';
        const isGrowing = plot.state === 'growing';
        const isEmpty = plot.state === 'empty_tilled';
        const isWeeded = plot.state === 'weeds';
        const isThirsty = plot.healthState === 'thirsty';
        const hasPest = !!plot.pest;
        const crop = CROPS_CONFIG[plot.cropType];
        const tier = QUALITY_TIERS[plot.quality] || QUALITY_TIERS.normal;

        const isNearby = nearestEntity?.id === `plot_${plot.id}`;

        let soilBg = 'pixel-soil-healthy';
        if (plot.wateredToday) soilBg = 'pixel-soil-wet';
        if (isThirsty) soilBg = 'pixel-soil-thirsty';
        if (plot.healthState === 'wilting') soilBg = 'pixel-soil-wilted';

        return (
          <div
            key={plot.id}
            onClick={(e) => handleDirectObjectClick(e, {
              id: `plot_${plot.id}`,
              type: 'plot',
              plot,
              x: pos.x,
              y: pos.y
            })}
            className={`absolute w-[12%] min-w-[62px] max-w-[90px] aspect-square rounded-xl cursor-pointer select-none transition-all duration-100 flex flex-col items-center justify-between p-1 z-10 ${soilBg} ${
              isNearby ? 'ring-3 ring-amber-400 scale-105' : 'hover:scale-105'
            } ${isRipe ? 'animate-harvest-ready' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Header Tag: ID & Pest Badge */}
            <div className="w-full flex items-center justify-between text-[8px] font-pixel pointer-events-none">
              <span className="text-amber-300/80">#{plot.id}</span>
              {hasPest && (
                <span className="text-xs animate-pest" title={plot.pest.name}>🐛</span>
              )}
              {isRipe && (
                <span className={`px-1 py-0.2 rounded bg-black/70 font-mono ${tier.color} font-bold`}>
                  {tier.stars}
                </span>
              )}
              {isGrowing && !hasPest && (
                <span className="text-cyan-300 flex items-center text-[7px]">
                  <Droplet className="w-2 h-2 fill-cyan-400" />
                  <span>{plot.progress}%</span>
                </span>
              )}
            </div>

            {/* Central Living Plant */}
            <div className="my-auto flex flex-col items-center justify-center">
              {isRipe && (
                <div className="flex flex-col items-center animate-bounce">
                  <span className="text-2xl filter drop-shadow-[0_2px_6px_rgba(255,215,0,0.8)]">
                    {crop?.icon || '🌾'}
                  </span>
                  <span className="font-pixel text-[7px] px-1 py-0.2 rounded bg-amber-400 text-[#2D1A0D] font-bold">
                    GẶT!
                  </span>
                </div>
              )}

              {isGrowing && (
                <div className={`flex flex-col items-center ${isThirsty ? 'opacity-80 rotate-6' : ''}`}>
                  <span className="text-xl filter drop-shadow">
                    {plot.srsStage === 0 ? '🌱' : plot.srsStage === 1 ? '🌿' : plot.srsStage === 2 ? '🪴' : crop?.icon || '🌾'}
                  </span>
                  <span className="font-pixel text-[8px] text-amber-200 truncate max-w-[60px] font-bold mt-0.5">
                    {plot.word || crop?.name?.split(' ')[0]}
                  </span>
                </div>
              )}

              {isEmpty && (
                <div className="flex flex-col items-center text-amber-300/40 hover:text-amber-300">
                  <span className="text-lg font-black">+</span>
                  <span className="font-pixel text-[7px]">Gieo</span>
                </div>
              )}

              {isWeeded && (
                <div className="flex flex-col items-center">
                  <span className="text-lg animate-pulse">🌿</span>
                  <span className="font-pixel text-[7px] text-rose-300">Cỏ dại</span>
                </div>
              )}
            </div>

            {/* Micro Progress Bar */}
            {isGrowing && (
              <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${plot.progress}%` }} />
              </div>
            )}
            {isEmpty && <div className="h-1" />}
            {isRipe && <div className="h-1" />}
          </div>
        );
      })}

      {/* =========================================================================
          4. RIGHT-SIDE TOWN AMENITIES (BULLETIN, SHIPPING, STORE, SEED VAULT)
          ========================================================================= */}
      
      {/* Bulletin Board (x: 77%, y: 44%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[4])}
        className="absolute top-[37%] left-[71%] w-[12%] min-w-[75px] max-w-[110px] cursor-pointer group z-10 transition hover:scale-105"
        title="Bảng Tin Thị Trấn - Xem nhiệm vụ ngày từ Cô Oanh"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#5D3A1F] border-2 border-amber-500/80 flex flex-col items-center shadow-lg">
          <span className="text-2xl filter drop-shadow">📜</span>
          <span className="font-pixel text-[8px] text-amber-200 font-bold uppercase mt-0.5">BẢNG TIN</span>
          <span className="mt-0.5 px-1 py-0.2 rounded bg-rose-600 text-white font-pixel text-[7px] animate-bounce">
            3 MỚI
          </span>
        </div>
      </div>

      {/* Shipping Bin (x: 91%, y: 44%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[5])}
        className="absolute top-[37%] right-[2%] w-[13%] min-w-[80px] max-w-[120px] cursor-pointer group z-10 transition hover:scale-105"
        title="Thùng Xuất Khẩu Gỗ - Bỏ nông sản vào để kết toán nhận Gold mỗi tối"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#3E2723] border-2 border-amber-500/80 flex flex-col items-center shadow-lg">
          <span className="text-2xl filter drop-shadow animate-bounce">📦</span>
          <span className="font-pixel text-[8px] text-amber-200 font-bold uppercase mt-0.5">XUẤT KHẨU</span>
          <span className="mt-0.5 px-1 py-0.2 rounded bg-amber-500 text-[#2D1A0D] font-pixel text-[7px] font-bold">
            {state.shippingBin?.length || 0} món
          </span>
        </div>
      </div>

      {/* Pierre's General Store (x: 77%, y: 65%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[6])}
        className="absolute top-[59%] left-[71%] w-[12%] min-w-[75px] max-w-[110px] cursor-pointer group z-10 transition hover:scale-105"
        title="Tiệm Nông Cụ Pierre - Mua hạt giống & nâng cấp trang trại"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#4A2B11] border-2 border-amber-500/80 flex flex-col items-center shadow-lg">
          <span className="text-2xl filter drop-shadow">🏪</span>
          <span className="font-pixel text-[8px] text-amber-200 font-bold uppercase mt-0.5">TIỆM PIERRE</span>
          <span className="mt-0.5 text-[7px] font-pixel text-amber-300">Hạt giống</span>
        </div>
      </div>

      {/* Seed Vault Chest (x: 91%, y: 65%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[7])}
        className="absolute top-[59%] right-[2%] w-[13%] min-w-[80px] max-w-[120px] cursor-pointer group z-10 transition hover:scale-105"
        title="Hầm Hạt Giống Bảo Vật Gia Truyền - Sinh lãi Gold thụ động"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#2D1A2E] border-2 border-purple-500/80 flex flex-col items-center shadow-lg">
          <span className="text-2xl filter drop-shadow animate-heirloom">👑</span>
          <span className="font-pixel text-[8px] text-purple-300 font-bold uppercase mt-0.5">SEED VAULT</span>
          <span className="mt-0.5 px-1 py-0.2 rounded bg-purple-900 text-purple-200 font-pixel text-[7px]">
            {state.seedVault?.length || 0} Heirloom
          </span>
        </div>
      </div>

      {/* Ancient Mines (Bottom-Left: x: 8%, y: 88%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[8])}
        className="absolute bottom-[2%] left-[3%] w-[18%] min-w-[100px] max-w-[160px] cursor-pointer group z-10 transition hover:scale-105"
        title="Hầm Mỏ Đá Quý Reading - Luyện đọc hiểu & phản biện"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#1E252B] border-2 border-cyan-500/80 flex items-center gap-2 shadow-lg">
          <span className="text-2xl filter drop-shadow">⛏️</span>
          <div className="min-w-0">
            <div className="font-pixel text-[8px] text-cyan-300 font-bold uppercase">HẦM MỎ READING</div>
            <div className="text-[7px] text-stone-300 font-pixel">Khai mỏ +Gems</div>
          </div>
        </div>
      </div>

      {/* River Stream & Fishing Pier (Bottom-Right: x: 86%, y: 88%) */}
      <div 
        onClick={(e) => handleDirectObjectClick(e, entities[9])}
        className="absolute bottom-[2%] right-[2%] w-[20%] min-w-[110px] max-w-[180px] cursor-pointer group z-10 transition hover:scale-105"
        title="Bến Sông Câu Cá - Luyện nghe chép & bắt âm IPA"
      >
        <div className="pixel-panel p-2 rounded-xl bg-[#0F2838] border-2 border-blue-400/80 flex items-center gap-2 shadow-lg">
          <span className="text-2xl filter drop-shadow animate-bounce">🎣</span>
          <div className="min-w-0">
            <div className="font-pixel text-[8px] text-blue-300 font-bold uppercase">BẾN SÔNG PHONICS</div>
            <div className="text-[7px] text-stone-300 font-pixel">Bắt cá từ vựng</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. THE PLAYABLE 16-BIT FARMER CHARACTER
          ========================================================================= */}
      <FarmerCharacter
        x={playerPos.x}
        y={playerPos.y}
        direction={direction}
        isMoving={isMoving}
        walkFrame={walkFrame}
        action={playerAction}
        playerName={state.farmerName || 'Học Viên Mochi'}
        level={state.level || 1}
        interactionPrompt={nearestEntity?.actionName}
      />

      {/* =========================================================================
          6. MOBILE RETRO ON-SCREEN D-PAD & ACTION CONTROLS
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

      {/* Mobile Big Action Button */}
      {nearestEntity && (
        <div className="absolute bottom-3 right-3 sm:hidden z-30 pointer-events-auto">
          <button
            onClick={triggerNearbyAction}
            className="px-4 py-3 rounded-xl bg-amber-500 border-3 border-amber-200 text-[#24130A] font-pixel text-xs font-black shadow-2xl active:scale-95 animate-pulse"
          >
            {nearestEntity.actionName || 'TƯƠNG TÁC'}
          </button>
        </div>
      )}

      {/* Desktop Helper Instruction overlay */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-400/50 text-[10px] font-pixel text-amber-200 pointer-events-none z-20">
        <span>🎮 WASD / Phím Mũi Tên di chuyển</span>
        <span>•</span>
        <span>Nhấn [E] hoặc [Space] để hành động</span>
        <span>•</span>
        <span>Nhấp chuột để đi tới</span>
      </div>

    </div>
  );
}
