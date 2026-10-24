import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Flame, 
  ShoppingBag, 
  Package, 
  Train, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  PenTool, 
  FileText, 
  BookOpen, 
  Check, 
  Award,
  AlertTriangle,
  TrendingUp,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CROP_DEFINITIONS, 
  FARM_LEVELS, 
  harvestPlot, 
  completeRevivalQuest, 
  contributeToCoopTrain, 
  buyShopItem, 
  tendCropWithLearning 
} from '../../services/farmService';
import RevivalQuestModal from './RevivalQuestModal';
import BarnInventoryModal from './BarnInventoryModal';
import CoopTrainModal from './CoopTrainModal';
import FarmShopModal from './FarmShopModal';

export default function FarmDashboard({
  farmState,
  onUpdateFarmState,
  onGoWritingPractice,
  onGoFullEssay,
  onGoVocabulary,
  onGoFlashcard,
  onGoGrammar,
  onGoReading,
  currentUser,
  studentEmail
}) {
  const [isRevivalOpen, setIsRevivalOpen] = useState(false);
  const [isBarnOpen, setIsBarnOpen] = useState(false);
  const [isCoopTrainOpen, setIsCoopTrainOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [harvestNotification, setHarvestNotification] = useState(null);

  const levelInfo = FARM_LEVELS.find(l => l.level === (farmState.level || 1)) || FARM_LEVELS[0];
  const nextLevelInfo = FARM_LEVELS.find(l => l.level === (farmState.level || 1) + 1) || levelInfo;
  
  const xpCurrent = farmState.xp || 0;
  const xpSpan = Math.max(1, nextLevelInfo.minXp - levelInfo.minXp);
  const xpIntoLevel = Math.max(0, xpCurrent - levelInfo.minXp);
  const levelProgressPct = Math.min(100, Math.round((xpIntoLevel / xpSpan) * 100));

  const isDoubleXpActive = Boolean(farmState.doubleXpUntil && farmState.doubleXpUntil > Date.now());

  // Xử lý thu hoạch một ô đất
  const handleHarvest = (plotId) => {
    const res = harvestPlot(plotId, studentEmail);
    if (res.success) {
      if (onUpdateFarmState) onUpdateFarmState(res.state);
      setHarvestNotification({
        title: `Thu hoạch thành công ${res.itemQty} ${res.cropDef.name}!`,
        desc: `+${res.xpEarned} EXP ${res.isDoubleXp ? '(x2 Buff!)' : ''} • +${res.coinsEarned} Bút Vàng`
      });
      setTimeout(() => setHarvestNotification(null), 3500);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  // Chuyển hướng tới khu vực rèn luyện tương ứng với ô đất
  const handleTendPlot = (cropType) => {
    const def = CROP_DEFINITIONS[cropType];
    if (!def) return;

    if (def.skillTarget === 'vocab') {
      if (onGoVocabulary) onGoVocabulary();
    } else if (def.skillTarget === 'grammar') {
      if (onGoGrammar) onGoGrammar();
    } else if (def.skillTarget === 'task1') {
      if (onGoWritingPractice) onGoWritingPractice('task1');
    } else if (def.skillTarget === 'task2') {
      if (onGoFullEssay) onGoFullEssay();
    } else if (def.skillTarget === 'reading') {
      if (onGoReading) onGoReading();
    } else if (def.skillTarget === 'pronunciation') {
      if (onGoFlashcard) onGoFlashcard();
    }
  };

  // Hoàn thành nhiệm vụ dọn cỏ hồi sinh
  const handleCompleteRevival = () => {
    const res = completeRevivalQuest(studentEmail);
    if (res.success) {
      if (onUpdateFarmState) onUpdateFarmState(res.state);
      setHarvestNotification({
        title: '🌿 Nông trại đã hồi sinh!',
        desc: 'Đã dọn sạch cỏ dại! Bạn nhận được Buff x2 EXP trong 3 ngày và 100 Bút Vàng.'
      });
      setTimeout(() => setHarvestNotification(null), 4000);
    }
  };

  // Đóng góp chuyến tàu hợp tác xã
  const handleCoopContribution = (itemKey, amount) => {
    const res = contributeToCoopTrain(itemKey, amount, studentEmail);
    if (res.success && onUpdateFarmState) {
      onUpdateFarmState(res.state);
    }
    return res;
  };

  // Mua hàng trong shop
  const handleBuyShopItem = (itemId) => {
    const res = buyShopItem(itemId, studentEmail);
    if (res.success && onUpdateFarmState) {
      onUpdateFarmState(res.state);
    }
    return res;
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F8F6F1] text-[#2B2826] flex flex-col">
      {/* Top Farm Stats Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#DDD6CB] px-3 sm:px-6 py-2.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          
          {/* Farm Level & Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#4A5D4E] text-white flex items-center justify-center text-xl shadow-md shadow-[#4A5D4E]/20 shrink-0">
              {levelInfo.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-[#2B2826]">
                  {levelInfo.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFECE5] text-[#4A5D4E] border border-[#CAD8C8]">
                  Cấp {levelInfo.level}
                </span>
                {isDoubleXpActive && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>x2 EXP</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 sm:w-36 h-2 bg-[#EFECE5] rounded-full overflow-hidden border border-[#DDD6CB]">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${levelProgressPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#6E675E] font-mono">
                  {xpCurrent}/{nextLevelInfo.minXp} EXP
                </span>
              </div>
            </div>
          </div>

          {/* Currency & Resource Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            {/* Bút Vàng (Coins) */}
            <div 
              onClick={() => setIsShopOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm cursor-pointer hover:bg-amber-100 transition select-none"
              title="Bút Vàng tích lũy - Nhấn để mở Cửa hàng"
            >
              <span>🪙</span>
              <span>{farmState.coins || 0}</span>
              <span className="text-[10px] text-amber-700 hidden sm:inline">Vàng</span>
            </div>

            {/* Nước Thần (Water Energy) */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 text-xs font-bold shadow-sm select-none"
              title="Gáo Nước Thần (Tích lũy khi hoàn thành bài tập)"
            >
              <Droplet className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span>{farmState.water || 0}</span>
              <span className="text-[10px] text-blue-700 hidden sm:inline">Nước</span>
            </div>

            {/* Chuỗi Ngày (Streak) */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-300 text-orange-900 text-xs font-bold shadow-sm select-none"
              title="Chuỗi ngày chăm sóc vườn liên tục"
            >
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>{farmState.streak || 1}</span>
              <span className="text-[10px] text-orange-700 hidden sm:inline">Ngày</span>
            </div>

            {/* Kho Nông Sản Button */}
            <button
              type="button"
              onClick={() => setIsBarnOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DDD6CB] text-xs font-bold text-[#2B2826] transition shadow-sm cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-[#4A5D4E]" />
              <span className="hidden xs:inline">Kho Thóc</span>
            </button>

            {/* Chuyến Tàu Lớp Button */}
            <button
              type="button"
              onClick={() => setIsCoopTrainOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
            >
              <Train className="w-3.5 h-3.5 text-emerald-200" />
              <span>Tàu Lớp</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Farm Content Area */}
      <main className="max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-5">
        
        {/* Harvest notification toast */}
        {harvestNotification && (
          <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="text-xs sm:text-sm font-extrabold">{harvestNotification.title}</div>
                <div className="text-[11px] text-emerald-100">{harvestNotification.desc}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsBarnOpen(true)}
              className="text-xs font-bold underline text-white px-2 py-1 hover:text-emerald-200 cursor-pointer"
            >
              Xem kho nông sản
            </button>
          </div>
        )}

        {/* Comeback Revival Banner (Cỏ dại khi vắng mặt lâu) */}
        {farmState.hasWeeds && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400/80 shadow-md flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center text-2xl border border-amber-400/40 shrink-0">
                🌿
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-black text-[#2B2826] flex items-center gap-2">
                  <span>Chào mừng trở lại! Nông trại đang cần bạn dọn cỏ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                    Quà Hồi Sinh
                  </span>
                </div>
                <p className="text-xs text-[#6E675E] leading-relaxed mt-0.5">
                  Trong lúc bạn nghỉ ngơi, một số ô đất mọc cỏ dại. Hoàn thành 1 bài ôn nhanh 2 phút để dọn sạch cỏ và nhận ngay <strong>Gói Phân Bón x2 EXP trong 3 ngày</strong>!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRevivalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Dọn Cỏ & Nhận x2 EXP</span>
            </button>
          </div>
        )}

        {/* Landscape Farm Banner - Điền Trang Lớp Cô Oanh */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#E2ECE3] via-[#FAF8F5] to-[#EAE5DC] border border-[#DDD6CB] p-5 sm:p-8 shadow-sm">
          {/* Subtle farm decor elements */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#4A5D4E]">
              <span>🏡 Điền Trang Tri Thức — MochiFarm</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] font-bold">
                IELTS MochiFarm
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-[#6E675E]">
              <span>🌾 Càng học bài $\to$ Cây càng nhanh chín!</span>
            </div>
          </div>

          {/* Interactive Plots Grid (6 Ô Đất Trồng) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmState.plots.map((plot) => {
              const def = CROP_DEFINITIONS[plot.cropType] || CROP_DEFINITIONS.wheat;
              const isRipe = plot.progress >= 100;
              const isWeeded = plot.isWeeded;

              return (
                <div
                  key={plot.id}
                  className={`relative p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-3 shadow-sm ${
                    isRipe
                      ? 'bg-gradient-to-b from-amber-50 to-white border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/10'
                      : isWeeded
                      ? 'bg-amber-950/5 border-amber-300'
                      : 'bg-white hover:bg-[#FAF8F5] border-[#DDD6CB] hover:border-[#CAD8C8]'
                  }`}
                >
                  {/* Top Plot Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border ${def.borderColor} ${def.bgColor}`}>
                        {isWeeded ? '🌿' : def.icon}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#2B2826] leading-tight">
                          {def.name}
                        </div>
                        <div className="text-[10px] text-[#6E675E] leading-tight mt-0.5">
                          {def.skillTitle}
                        </div>
                      </div>
                    </div>

                    {isRipe && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm animate-bounce shrink-0">
                        Chín rộ ✨
                      </span>
                    )}
                    {isWeeded && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 shrink-0">
                        Cỏ dại
                      </span>
                    )}
                  </div>

                  {/* Growth Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6E675E]">
                      <span>Tiến độ sinh trưởng:</span>
                      <span className={isRipe ? 'text-amber-800 font-extrabold' : 'text-[#4A5D4E]'}>
                        {plot.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#EFECE5] rounded-full overflow-hidden border border-[#DDD6CB]">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isRipe
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                            : 'bg-gradient-to-r from-emerald-500 to-green-500'
                        }`}
                        style={{ width: `${plot.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Harvest or Tend Action Button */}
                  {isRipe ? (
                    <button
                      type="button"
                      onClick={() => handleHarvest(plot.id)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Thu Hoạch Ngay (+{def.reward.coins} Bút Vàng)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTendPlot(plot.cropType)}
                      className="w-full py-2 px-3 rounded-2xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-sm"
                    >
                      <Droplet className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Tưới Nước (Học để cây lớn)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Farm Quick Access Hub */}
          <div className="mt-6 pt-5 border-t border-[#DDD6CB] flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-[#6E675E]">
              💡 <em>Mẹo nông dân: Mỗi câu viết Task 1, Task 2 hoặc 5 từ flashcard hoàn thành sẽ tưới 1 gáo nước thần giúp cây trồng chín rộ!</em>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onGoWritingPractice}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DDD6CB] text-xs font-bold text-[#2B2826] transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-[#4A5D4E]" />
                <span>Viết Câu Task 1 & 2</span>
              </button>

              <button
                type="button"
                onClick={onGoFlashcard}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DDD6CB] text-xs font-bold text-[#2B2826] transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Học Flashcard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chuyến Tàu Hợp Tác Xã Preview Banner */}
        <div 
          onClick={() => setIsCoopTrainOpen(true)}
          className="p-5 rounded-3xl bg-white border border-[#DDD6CB] hover:border-[#CAD8C8] shadow-sm flex items-center justify-between gap-4 cursor-pointer group transition"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-800 flex items-center justify-center text-2xl border border-blue-400/40 shrink-0 group-hover:scale-105 transition">
              🚂
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold text-[#2B2826] flex items-center gap-2">
                <span>Chuyến Tàu Nông Sản Hợp Tác Xã MochiFarm</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                  {farmState.coopTrain?.deadline || 'Chủ Nhật'}
                </span>
              </div>
              <p className="text-xs text-[#6E675E] leading-relaxed mt-0.5">
                Cả lớp cùng góp nông sản từ bài tập để hoàn thành chuyến tàu xuất khẩu. Nhấn để đóng góp nông sản và nhận quà!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#4A5D4E] group-hover:translate-x-1 transition shrink-0">
            <span>Vào toa tàu &rarr;</span>
          </div>
        </div>

      </main>

      {/* Modals */}
      <RevivalQuestModal
        isOpen={isRevivalOpen}
        onClose={() => setIsRevivalOpen(false)}
        onComplete={handleCompleteRevival}
      />

      <BarnInventoryModal
        isOpen={isBarnOpen}
        onClose={() => setIsBarnOpen(false)}
        inventory={farmState.barnInventory || {}}
        onOpenCoopTrain={() => setIsCoopTrainOpen(true)}
      />

      <CoopTrainModal
        isOpen={isCoopTrainOpen}
        onClose={() => setIsCoopTrainOpen(false)}
        coopTrain={farmState.coopTrain || {}}
        barnInventory={farmState.barnInventory || {}}
        onContribute={handleCoopContribution}
      />

      <FarmShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={farmState.coins || 0}
        ownedItems={farmState.ownedItems || []}
        onBuyItem={handleBuyShopItem}
      />
    </div>
  );
}
