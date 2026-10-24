import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplet, 
  ArrowRight, 
  Package, 
  Zap, 
  Check, 
  HelpCircle,
  AlertTriangle,
  Heart
} from 'lucide-react';
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
  onClearWeeds
}) {
  const [hoveredPlot, setHoveredPlot] = useState(null);

  const handlePlotClick = (plot) => {
    if (plot.state === 'ripe') {
      sounds.playHarvest();
      confetti({
        particleCount: 35,
        spread: 50,
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
        onWaterPlotWithPractice(crop.skill, plot.id);
      }
    } else if (plot.state === 'weeds') {
      sounds.playClick();
      if (onClearWeeds) onClearWeeds();
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-2 sm:my-4 px-2 sm:px-4 select-none">
      
      {/* MAP TERRAIN CONTAINER: Warm Countryside RPG Ground */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#81C784]/40 via-[#A5D6A7]/30 to-[#81C784]/50 border-4 border-[#5D4037] p-3 sm:p-6 shadow-xl">
        
        {/* Subtle decorative grass & stone pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2E7D32_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* TOP ROW: Landmarks & Buildings */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          
          {/* 1. Farmer Cottage (Nhà Gỗ) */}
          <div 
            onClick={() => { sounds.playClick(); }}
            className="harvest-panel p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:border-amber-600 transition group shadow-sm"
            title="Nhà Gỗ Nông Dân - Phòng của bạn & Mục tiêu Band IELTS"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 border-2 border-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0">
              🏡
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-black text-[#5D4037] uppercase tracking-wider">
                NHÀ GỖ CỦA BẠN
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#2B2826] truncate">
                Mục Tiêu: Band {state.bandTarget}
              </div>
            </div>
          </div>

          {/* 2. Town Bulletin Board (Bảng Tin Thị Trấn) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenBulletin(); }}
            className="harvest-panel p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:border-amber-600 transition group shadow-sm relative"
            title="Bảng Tin Nhiệm Vụ Hàng Ngày từ Cô Oanh & Cư Dân Thị Trấn"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 border-2 border-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0">
              📜
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-black text-[#5D4037] uppercase tracking-wider">
                BẢNG TIN THỊ TRẤN
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#2B2826] truncate flex items-center gap-1">
                <span>3 Nhiệm Vụ Mới</span>
              </div>
            </div>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black animate-bounce shadow">
              HOT
            </span>
          </div>

          {/* 3. Cô Oanh's Manor (Dinh Thự Cố Vấn) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenCoOanhManor(); }}
            className="harvest-panel p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:border-rose-400 transition group shadow-sm"
            title="Dinh Thự Cô Oanh - Gặp gỡ cố vấn, nhận lời khuyên IELTS & mở khóa bí kíp"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 border-2 border-rose-800 flex items-center justify-center text-2xl group-hover:scale-105 transition shrink-0">
              👩‍🏫
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <span>CÔ OANH MENTOR</span>
                <span className="text-rose-500 font-normal">❤️{state.coOanhFriendship?.hearts || 2}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#2B2826] truncate">
                Bí Kíp &amp; Lời Khuyên
              </div>
            </div>
          </div>

        </div>

        {/* WEEDS COMEBACK ALERT BANNER (Only shows when inactive for >= 3 days) */}
        {state.hasWeeds && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-900/90 border-2 border-amber-400 text-amber-100 flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-spin-slow">🌿</span>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-yellow-300">
                  Cỏ Dại Xuất Hiện Do Bạn Nghỉ Học Vài Ngày!
                </h4>
                <p className="text-[11px] text-amber-100/90 leading-tight">
                  Cây trồng không bị mất! Hãy làm bài test 2 phút để dọn cỏ và nhận ngay <b className="text-yellow-300">Buff x2 EXP trong 3 ngày</b> + 150 G!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearWeeds}
              className="px-3.5 py-1.5 text-xs harvest-btn-gold shrink-0 cursor-pointer shadow-md"
            >
              Dọn Cỏ Hồi Sinh Ngay ✨
            </button>
          </div>
        )}

        {/* CENTER MAIN STAGE: The 12-Plot Farm Field + Shipping Bin on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          
          {/* Left 3 Cols: The 12-Plot Farmstead Grid (3 rows x 4 cols) */}
          <div className="lg:col-span-3 harvest-panel-dark p-3 sm:p-5 border-4 border-[#6D4C41]">
            <div className="flex items-center justify-between mb-3 border-b border-[#5D4037] pb-2 text-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-base">🌾</span>
                <span className="font-black text-xs uppercase tracking-wider">
                  CÁNH ĐỒNG TRI THỨC (12 Ô ĐẤT)
                </span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-bold hidden sm:inline">
                💡 Nhấn ô trống để gieo hạt • Nhấn cây đang lớn để tưới nước bằng bài tập
              </span>
            </div>

            {/* 3x4 Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {state.plots.map(plot => {
                const isRipe = plot.state === 'ripe';
                const isGrowing = plot.state === 'growing';
                const isEmpty = plot.state === 'empty_tilled';
                const isWeeded = plot.state === 'weeds';
                const crop = CROPS_CONFIG[plot.cropType];
                const tier = QUALITY_TIERS[plot.quality] || QUALITY_TIERS.normal;

                return (
                  <div
                    key={plot.id}
                    onClick={() => handlePlotClick(plot)}
                    onMouseEnter={() => setHoveredPlot(plot)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    className={`relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-between cursor-pointer transition select-none group border-2 ${
                      plot.wateredToday ? 'harvest-soil-wet border-[#4E342E]' : 'harvest-soil border-[#6D4C41]'
                    } ${
                      isRipe 
                        ? 'animate-harvest-ready border-amber-400 bg-amber-950/40' 
                        : 'hover:scale-[1.03] active:scale-95'
                    }`}
                  >
                    {/* Top Plot Badge */}
                    <div className="w-full flex items-center justify-between text-[9px] font-bold z-10 pointer-events-none">
                      <span className="text-amber-200/60 font-mono">#{plot.id}</span>
                      
                      {isRipe && (
                        <span className={`px-1.5 py-0.2 rounded-md bg-black/60 font-mono ${tier.color} border border-amber-400/40 font-black`}>
                          {tier.stars}
                        </span>
                      )}

                      {isGrowing && (
                        <span className="text-[9px] text-blue-300 flex items-center gap-0.5">
                          <Droplet className="w-2.5 h-2.5 fill-blue-400" />
                          <span>{plot.progress}%</span>
                        </span>
                      )}
                    </div>

                    {/* Central Crop Visual / Soil Representation */}
                    <div className="my-auto flex flex-col items-center justify-center">
                      {isRipe && (
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(255,215,0,0.6)]">
                            {crop?.icon || '🌾'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 mt-0.5 rounded-full bg-amber-400 text-[#3E2723] font-black shadow border border-[#271406]">
                            GẶT NGAY!
                          </span>
                        </div>
                      )}

                      {isGrowing && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl sm:text-3xl filter drop-shadow">
                            {plot.growthStage === 0 ? '🌱' : plot.growthStage === 1 ? '🌿' : crop?.icon || '🌾'}
                          </span>
                          <span className="text-[9px] text-amber-200/90 font-bold truncate max-w-[70px] mt-0.5">
                            {crop?.name?.split(' ')[0] || 'Cây non'}
                          </span>
                        </div>
                      )}

                      {isEmpty && (
                        <div className="flex flex-col items-center text-amber-200/40 group-hover:text-amber-300 transition">
                          <span className="text-2xl font-black">+</span>
                          <span className="text-[9px] font-bold mt-0.5">Gieo hạt</span>
                        </div>
                      )}

                      {isWeeded && (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl">🌿</span>
                          <span className="text-[9px] text-amber-300 font-bold">Cỏ dại</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Progress Bar for Growing plots */}
                    {isGrowing && (
                      <div className="w-full h-1 bg-[#271406] rounded-full overflow-hidden border border-[#5D4037]/60">
                        <div 
                          className="h-full bg-emerald-400 transition-all"
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

          {/* Right 1 Col: The Shipping Bin (Thùng Xuất Khẩu Gỗ) */}
          <div className="harvest-panel p-4 flex flex-col justify-between h-full border-4 border-[#795548] shadow-md">
            <div>
              <div className="text-center pb-2 border-b-2 border-[#8D6E63]">
                <div className="text-3xl sm:text-4xl filter drop-shadow mb-1">
                  📦
                </div>
                <h3 className="font-black text-sm text-[#3E2723] uppercase tracking-wide">
                  THÙNG XUẤT KHẨU
                </h3>
                <p className="text-[11px] text-[#5D4037] mt-0.5">
                  Bỏ nông sản &amp; bài viết vào thùng để bán lấy Gold mỗi tối!
                </p>
              </div>

              {/* Status info */}
              <div className="mt-4 space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-[#D7CCC8] flex items-center justify-between text-xs font-bold text-[#5D4037]">
                  <span>Vật phẩm chờ bán:</span>
                  <span className="font-mono text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded font-black">
                    {state.shippingBin?.length || 0} món
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-[#D7CCC8] flex items-center justify-between text-xs font-bold text-[#5D4037]">
                  <span>Dự kiến nhận:</span>
                  <span className="font-mono text-yellow-700 font-black">
                    🪙 ~{state.shippingBin?.reduce((acc, c) => acc + (c.subtotal || 0), 0) || 0} G
                  </span>
                </div>
              </div>
            </div>

            {/* Open Bin / Settle Button */}
            <div className="mt-4 pt-3 border-t border-[#D7CCC8]">
              <button
                type="button"
                onClick={() => { sounds.playClick(); onOpenShippingBin(); }}
                className="w-full py-2.5 text-xs font-black harvest-btn-gold shadow-md cursor-pointer tracking-wider"
              >
                Mở Thùng &amp; Bán Hàng 📦
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: The 3 Adventure Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 sm:mt-6">
          
          {/* 1. Pierre's General Store (Tiệm Nông Cụ & Hạt Giống) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenStore(); }}
            className="harvest-panel p-3 flex items-center gap-3 cursor-pointer hover:border-amber-600 transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              🏪
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-[#5D4037] uppercase">TIỆM NÔNG CỤ PIERRE</div>
              <div className="text-xs font-bold text-[#2B2826] truncate">Mua Hạt Giống &amp; Phân Bón</div>
            </div>
          </div>

          {/* 2. The Ancient Mines (Hầm Mỏ Đọc Hiểu & Tư Duy) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenMines(); }}
            className="harvest-panel p-3 flex items-center gap-3 cursor-pointer hover:border-purple-600 transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-purple-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              ⛏️
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-purple-900 uppercase">HẦM MỎ TRI THỨC</div>
              <div className="text-xs font-bold text-[#2B2826] truncate">Đọc Hiểu &amp; Phản Biện (+Gems)</div>
            </div>
          </div>

          {/* 3. River Pier (Bến Sông Câu Cá & Nghe Chép) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenFishing(); }}
            className="harvest-panel p-3 flex items-center gap-3 cursor-pointer hover:border-blue-600 transition group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-blue-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
              🎣
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-blue-900 uppercase">BẾN SÔNG MOCHI</div>
              <div className="text-xs font-bold text-[#2B2826] truncate">Nghe Chép &amp; Bắt Cá Từ Vựng</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
