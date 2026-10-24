import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Package, 
  AlertTriangle,
  Heart,
  BookOpen,
  Utensils,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { CROPS_CONFIG, QUALITY_TIERS, SRS_STAGES } from '../../services/harvestTownService';

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
  const [hoveredPlot, setHoveredPlot] = useState(null);

  const handlePlotClick = (plot) => {
    // If plot has pest, prioritize clearing pest!
    if (plot.pest) {
      sounds.playClick();
      if (onOpenPestChallenge) {
        onOpenPestChallenge(plot);
      }
      return;
    }

    if (plot.state === 'ripe') {
      sounds.playHarvest();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      onHarvestPlot(plot.id);
    } else if (plot.state === 'empty_tilled') {
      sounds.playClick();
      onOpenSeedPouch(plot.id);
    } else if (plot.state === 'growing') {
      sounds.playClick();
      const crop = CROPS_CONFIG[plot.cropType];
      if (crop && onWaterPlotWithPractice) {
        onWaterPlotWithPractice(crop.skill || 'vocab', plot.id);
      }
    } else if (plot.state === 'weeds') {
      sounds.playClick();
      if (onClearWeeds) onClearWeeds();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto my-2 sm:my-3 px-2 sm:px-4 select-none font-sans">
      
      {/* 16-BIT RETRO PIXEL TERRAIN CONTAINER */}
      <div className="relative rounded-2xl overflow-hidden bg-[#2D5A27] border-4 border-[#1B3817] p-2.5 sm:p-5 shadow-2xl">
        
        {/* Pixel Grass Grid Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#81C784_2px,transparent_2px)] [background-size:24px_24px]" />

        {/* TOP ROW: Farmhouse (Almanac), Kitchen & Pasture */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-5">
          
          {/* 1. Farmhouse with glowing Almanac Book on Porch */}
          <div 
            onClick={() => { sounds.playClick(); if (onOpenAlmanac) onOpenAlmanac(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition group shadow"
            title="Nhà Gỗ Nông Dân - Mở Cuốn Niên Giám Morning Almanac trên bàn gỗ"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#5D3A1F] border-2 border-amber-500/80 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition shadow-inner">
              🏡
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-amber-300 uppercase tracking-wide truncate">
                NHÀ GỖ & ALMANAC
              </div>
              <div className="text-[11px] font-bold text-amber-100 truncate flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>{state.almanac?.completedToday ? 'Đã học ✓' : 'Cần học sáng!'}</span>
              </div>
            </div>
          </div>

          {/* 2. The Kitchen (Collocations) */}
          <div 
            onClick={() => { sounds.playClick(); if (onOpenKitchen) onOpenKitchen(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition group shadow"
            title="Nhà Bếp Collocations - Nấu các món ăn học thuật để hồi phục Focus Points!"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#5D3A1F] border-2 border-amber-500/80 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition shadow-inner">
              🍳
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-amber-300 uppercase tracking-wide truncate">
                BẾP COLLOCATIONS
              </div>
              <div className="text-[11px] font-bold text-amber-100 truncate flex items-center gap-1">
                <Utensils className="w-3 h-3 text-amber-400" />
                <span>Nấu Món Ăn C1</span>
              </div>
            </div>
          </div>

          {/* 3. Grammar Livestock Pasture */}
          <div 
            onClick={() => { sounds.playClick(); if (onOpenPasture) onOpenPasture(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition group shadow"
            title="Chuồng Vật Nuôi Ngữ Pháp - Chăm bón Đàn Gà SVO, Bò Thời Gian, Cừu Mạo Từ"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#5D3A1F] border-2 border-amber-500/80 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition shadow-inner">
              🐔
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-amber-300 uppercase tracking-wide truncate">
                CHUỒNG NGỮ PHÁP
              </div>
              <div className="text-[11px] font-bold text-amber-100 truncate flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Gà • Bò • Cừu • Ong</span>
              </div>
            </div>
          </div>

          {/* 4. Town Bulletin Board */}
          <div 
            onClick={() => { sounds.playClick(); onOpenBulletin(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition group shadow relative"
            title="Bảng Tin Nhiệm Vụ Hàng Ngày từ Cô Oanh & Thị Trấn"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#5D3A1F] border-2 border-amber-500/80 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition shadow-inner">
              📜
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-amber-300 uppercase tracking-wide truncate">
                BẢNG TIN THỊ TRẤN
              </div>
              <div className="text-[11px] font-bold text-amber-100 truncate">
                3 Nhiệm Vụ Ngày
              </div>
            </div>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded bg-rose-600 text-white font-pixel text-[9px] animate-bounce">
              NEW
            </span>
          </div>

        </div>

        {/* WEEDS COMEBACK ALERT */}
        {state.hasWeeds && (
          <div className="mb-4 p-3 rounded-xl bg-[#4A1515] border-3 border-rose-500 text-rose-100 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-spin-slow">🌿</span>
              <div>
                <h4 className="font-pixel text-xs text-rose-300">
                  CỎ DẠI XUẤT HIỆN DO NGHỈ HỌC VÀI NGÀY!
                </h4>
                <p className="text-[11px] text-rose-200/90 leading-tight">
                  Tiến độ không bị mất! Hãy làm bài kiểm tra hồi sinh để nhận <b className="text-amber-300">Buff x2 EXP trong 3 ngày</b> + 150 G!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearWeeds}
              className="pixel-btn pixel-btn-gold font-pixel text-xs py-1.5 px-3 shrink-0"
            >
              Dọn Cỏ Ngay ✨
            </button>
          </div>
        )}

        {/* CENTER MAIN FIELD: 12-Plot Farmstead + Shipping Bin */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 items-start">
          
          {/* Left 3 Cols: The 12-Plot Farmstead (Words as Seeds SRS Grid) */}
          <div className="lg:col-span-3 pixel-panel p-3 sm:p-4">
            
            <div className="flex items-center justify-between mb-3 border-b-2 border-[#1E0F07] pb-2 text-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-base">🌾</span>
                <span className="font-pixel text-xs uppercase tracking-wider text-amber-300">
                  CÁNH ĐỒNG TỪ VỰNG SRS (WORDS AS SEEDS)
                </span>
              </div>
              <span className="text-[10px] text-amber-200/80 font-pixel hidden sm:inline">
                💡 Cây lớn qua 5 nấc SRS • Nhấn để tưới nước / ôn bài
              </span>
            </div>

            {/* 3x4 Soil Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {state.plots.map(plot => {
                const isRipe = plot.state === 'ripe';
                const isGrowing = plot.state === 'growing';
                const isEmpty = plot.state === 'empty_tilled';
                const isWeeded = plot.state === 'weeds';
                const isThirsty = plot.healthState === 'thirsty';
                const hasPest = !!plot.pest;
                const crop = CROPS_CONFIG[plot.cropType];
                const tier = QUALITY_TIERS[plot.quality] || QUALITY_TIERS.normal;
                const srsInfo = SRS_STAGES.find(s => s.stage === (plot.srsStage || 0)) || SRS_STAGES[0];

                let soilClass = 'pixel-soil-healthy';
                if (plot.wateredToday) soilClass = 'pixel-soil-wet';
                if (isThirsty) soilClass = 'pixel-soil-thirsty';
                if (plot.healthState === 'wilting') soilClass = 'pixel-soil-wilted';

                return (
                  <div
                    key={plot.id}
                    onClick={() => handlePlotClick(plot)}
                    onMouseEnter={() => setHoveredPlot(plot)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    className={`relative aspect-square rounded-xl p-2 flex flex-col items-center justify-between cursor-pointer transition select-none group ${soilClass} ${
                      isRipe ? 'animate-harvest-ready border-amber-400' : 'hover:scale-[1.03] active:scale-95'
                    }`}
                  >
                    {/* Plot Header: ID & Indicators */}
                    <div className="w-full flex items-center justify-between text-[9px] font-pixel z-10 pointer-events-none">
                      <span className="text-amber-300/80">#{plot.id}</span>

                      {/* Pest Alert Badge */}
                      {hasPest && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[8px] font-bold animate-pest flex items-center gap-0.5">
                          <span>🐛</span>
                          <span className="hidden sm:inline">SÂU</span>
                        </span>
                      )}

                      {/* Thirsty Warning */}
                      {isThirsty && !hasPest && (
                        <span className="px-1 rounded bg-amber-600 text-[#2D1A0D] text-[8px] font-bold">
                          KHÁT NƯỚC
                        </span>
                      )}

                      {isGrowing && !hasPest && !isThirsty && (
                        <span className="text-[9px] text-cyan-300 flex items-center gap-0.5">
                          <Droplet className="w-2.5 h-2.5 fill-cyan-400" />
                          <span>{plot.progress}%</span>
                        </span>
                      )}

                      {isRipe && (
                        <span className="px-1.5 py-0.2 rounded bg-black/70 font-mono text-amber-300 font-bold border border-amber-400">
                          {tier.stars}
                        </span>
                      )}
                    </div>

                    {/* Central Crop Visual */}
                    <div className="my-auto flex flex-col items-center justify-center text-center">
                      
                      {/* 1. Ripe Crop */}
                      {isRipe && (
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(255,215,0,0.8)]">
                            {crop?.icon || '🌾'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 mt-0.5 rounded bg-amber-400 text-[#2D1A0D] font-pixel font-bold shadow">
                            GẶT!
                          </span>
                        </div>
                      )}

                      {/* 2. Growing Crop with real vocab word */}
                      {isGrowing && (
                        <div className={`flex flex-col items-center ${isThirsty ? 'opacity-80 rotate-6' : ''}`}>
                          <span className="text-2xl sm:text-3xl filter drop-shadow">
                            {plot.srsStage === 0 ? '🌱' : plot.srsStage === 1 ? '🌿' : plot.srsStage === 2 ? '🪴' : crop?.icon || '🌾'}
                          </span>
                          <span className="font-pixel text-[9px] text-amber-200 truncate max-w-[76px] mt-0.5 font-bold">
                            {plot.word || crop?.name?.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      {/* 3. Empty Tilled Soil */}
                      {isEmpty && (
                        <div className="flex flex-col items-center text-amber-300/40 group-hover:text-amber-300 transition">
                          <span className="text-2xl font-black">+</span>
                          <span className="text-[9px] font-pixel mt-0.5">Gieo hạt</span>
                        </div>
                      )}

                      {/* 4. Weeds */}
                      {isWeeded && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl animate-pulse">🌿</span>
                          <span className="text-[9px] font-pixel text-rose-300">Cỏ dại</span>
                        </div>
                      )}

                    </div>

                    {/* Bottom Progress Bar */}
                    {isGrowing && (
                      <div className="w-full h-1.5 bg-[#140804] rounded-full overflow-hidden border border-[#5D3A1F]">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                          style={{ width: `${plot.progress}%` }}
                        />
                      </div>
                    )}

                    {isEmpty && <div className="h-1" />}
                    {isRipe && <div className="h-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: Shipping Bin & Seed Vault */}
          <div className="space-y-3">
            
            {/* The Shipping Bin */}
            <div className="pixel-panel p-3.5 flex flex-col justify-between">
              <div>
                <div className="text-center pb-2 border-b-2 border-[#1E0F07]">
                  <div className="text-3xl filter drop-shadow mb-1 animate-bounce">
                    📦
                  </div>
                  <h3 className="font-pixel text-xs text-amber-200 uppercase tracking-wide">
                    THÙNG XUẤT KHẨU
                  </h3>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    Xuất khẩu nông sản &amp; thu hoạch Gold mỗi tối!
                  </p>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#24130A] border border-[#5D3A1F] flex items-center justify-between text-stone-300">
                    <span>Chờ bán:</span>
                    <span className="font-pixel text-amber-300 font-bold">
                      {state.shippingBin?.length || 0} món
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#24130A] border border-[#5D3A1F] flex items-center justify-between text-stone-300">
                    <span>Dự kiến:</span>
                    <span className="font-pixel text-amber-300 font-bold">
                      🪙 ~{state.shippingBin?.reduce((acc, c) => acc + (c.subtotal || 0), 0) || 0} G
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t-2 border-[#1E0F07]">
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); onOpenShippingBin(); }}
                  className="pixel-btn pixel-btn-gold font-pixel text-xs w-full py-2 shadow"
                >
                  Mở Thùng Xuất Khẩu 📦
                </button>
              </div>
            </div>

            {/* Seed Vault Shortcut Card */}
            <div 
              onClick={() => { sounds.playClick(); if (onOpenSeedVault) onOpenSeedVault(); }}
              className="pixel-panel p-3 flex items-center gap-2.5 cursor-pointer hover:border-purple-400 transition"
              title="Hầm Hạt Giống Bảo Vật Gia Truyền"
            >
              <span className="text-2xl animate-heirloom">👑</span>
              <div className="min-w-0">
                <div className="font-pixel text-[10px] text-purple-300 uppercase">HẦM BẢO VẬT SEED VAULT</div>
                <div className="text-[11px] font-bold text-amber-100 truncate">
                  {state.seedVault?.length || 0} Từ Mastered (Sinh lãi Gold)
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM ROW: The 3 Town Exploration Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-5">
          
          {/* 1. Pierre's General Store */}
          <div 
            onClick={() => { sounds.playClick(); onOpenStore(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition group shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-[#5D3A1F] border border-amber-500/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              🏪
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-amber-300 uppercase">TIỆM NÔNG CỤ PIERRE</div>
              <div className="text-[11px] font-bold text-stone-200 truncate">Mua Hạt Giống &amp; Phân Bón</div>
            </div>
          </div>

          {/* 2. Cô Oanh's Manor */}
          <div 
            onClick={() => { sounds.playClick(); onOpenCoOanhManor(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-rose-400 transition group shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-[#5D3A1F] border border-rose-500/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              👩‍🏫
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-rose-300 uppercase flex items-center gap-1">
                <span>DINH THỰ CÔ OANH</span>
                <span className="text-rose-400">❤️{state.coOanhFriendship?.hearts || 2}</span>
              </div>
              <div className="text-[11px] font-bold text-stone-200 truncate">Bí Kíp 5 Tim &amp; Lời Khuyên</div>
            </div>
          </div>

          {/* 3. The Ancient Mines */}
          <div 
            onClick={() => { sounds.playClick(); onOpenMines(); }}
            className="pixel-panel p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-cyan-400 transition group shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-[#5D3A1F] border border-cyan-500/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              ⛏️
            </div>
            <div className="min-w-0">
              <div className="font-pixel text-[10px] text-cyan-300 uppercase">HẦM MỎ READING MINES</div>
              <div className="text-[11px] font-bold text-stone-200 truncate">Khai Thác Đá Quý &amp; Đọc Hiểu</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
