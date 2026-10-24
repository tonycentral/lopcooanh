import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sun, 
  CloudRain, 
  Wind, 
  Zap, 
  Target, 
  User, 
  LogOut, 
  Settings,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { FARM_AREAS, FARM_LEVELS_CONFIG } from '../../services/harvestTownService';

export default function HarvestHUD({
  state,
  activeAreaId,
  onSelectArea,
  onOpenTargetBandModal,
  onOpenStore,
  onOpenAlmanac,
  currentUser,
  onOpenAuthModal,
  onOpenSettingsModal,
  onSignOut
}) {
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  const handleToggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
    if (!next) {
      sounds.playCoin();
    }
  };

  const levelInfo = FARM_LEVELS_CONFIG.find(l => l.level === state.level) || FARM_LEVELS_CONFIG[0];
  const nextLvl = FARM_LEVELS_CONFIG.find(l => l.level === state.level + 1) || levelInfo;
  const xpCurrent = state.xp || 0;
  const xpSpan = Math.max(1, nextLvl.maxXp - levelInfo.minXp);
  const xpInto = Math.max(0, xpCurrent - levelInfo.minXp);
  const xpPercent = Math.min(100, Math.round((xpInto / xpSpan) * 100));

  // Season translations
  const seasonLabels = {
    spring: { name: 'Mùa Xuân', icon: '🌸', weatherIcon: Sun, weatherText: 'Nắng ấm' },
    summer: { name: 'Mùa Hạ', icon: '☀️', weatherIcon: Sun, weatherText: 'Nắng gắt' },
    fall: { name: 'Mùa Thu', icon: '🍂', weatherIcon: Wind, weatherText: 'Gió thu' },
    winter: { name: 'Mùa Đông', icon: '❄️', weatherIcon: CloudRain, weatherText: 'Mưa phùn' }
  };
  const currentSeason = seasonLabels[state.season] || seasonLabels.spring;
  const WeatherComp = currentSeason.weatherIcon;

  // STRICT 2 CURRENCIES:
  // 1. Tiền để giao dịch (Gold Coins 🪙)
  const gold = state.gold ?? 250;
  // 2. Mana để học tập & nuôi dưỡng (🔮)
  const mana = state.mana ?? 85;
  const maxMana = state.maxMana || 100;
  const manaPercent = Math.min(100, Math.round((mana / maxMana) * 100));

  return (
    <header className="w-full bg-[#201007] text-[#FFF8E7] border-b-4 border-[#120703] shadow-2xl select-none px-2 sm:px-4 py-2 shrink-0 z-30 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 sm:gap-3">
        
        {/* TOP ROW / LEFT SECTION: Farmer Profile & Currencies */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-2 sm:gap-4">
          
          {/* Farmer Pixel Avatar Frame */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#4A2610] border-2 border-amber-400 p-1 flex items-center justify-center shadow-inner shrink-0 group">
              <span className="text-xl sm:text-2xl filter drop-shadow">👨‍🌾</span>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-[#201007] text-[9px] font-pixel font-black rounded border border-[#120703]">
                L{state.level}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-pixel text-xs font-bold text-amber-200 truncate">
                  {state.farmerName || 'Mochi Farmer'}
                </span>
                <button
                  type="button"
                  onClick={onOpenTargetBandModal}
                  className="px-1.5 py-0.2 rounded bg-[#381B0C] hover:bg-[#5D2E12] border border-amber-500/70 text-[9px] font-pixel font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition"
                  title="Mục tiêu Target Band IELTS"
                >
                  <Target className="w-2.5 h-2.5 text-amber-400" />
                  <span>Band {state.bandTarget || '7.0'}</span>
                </button>
              </div>

              {/* EXP Bar */}
              <div className="w-24 sm:w-32 mt-0.5">
                <div className="flex justify-between items-center text-[8px] text-amber-200/80 mb-0.5 font-bold">
                  <span className="truncate">{levelInfo.title}</span>
                  <span className="font-pixel">{xpPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#120703] rounded-full overflow-hidden border border-[#4A2610]">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300" 
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              STRICT 2-CURRENCY SECTION: TIỀN (🪙) & MANA (🔮)
              ========================================================================= */}
          <div className="flex items-center gap-2">
            
            {/* 1. Tiền (Gold 🪙) */}
            <button 
              type="button"
              onClick={onOpenStore}
              className="flex items-center gap-1.5 bg-[#140803] hover:bg-[#2B1206] px-2.5 py-1 rounded-xl border border-amber-500/70 shadow-inner transition cursor-pointer"
              title="Tiền Vàng (Gold): Dùng để giao dịch & mua sắm hạt giống, nông cụ trong Cửa Hàng"
            >
              <span className="text-base">🪙</span>
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-pixel text-amber-200/60 leading-none">TIỀN</span>
                <span className="font-pixel text-xs sm:text-sm font-bold text-amber-300 leading-tight">{gold}</span>
              </div>
            </button>

            {/* 2. Mana (🔮) */}
            <div 
              className="flex items-center gap-1.5 bg-[#150B20] px-2.5 py-1 rounded-xl border border-purple-500/60 shadow-inner"
              title="Mana: Năng lượng học tập dùng để nuôi dưỡng và chăm sóc các chủ đề IELTS"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
              <div className="flex flex-col">
                <div className="flex justify-between text-[8px] font-pixel font-bold text-purple-200 gap-2 leading-none">
                  <span>MANA</span>
                  <span>{mana}/{maxMana}</span>
                </div>
                <div className="w-16 sm:w-20 h-2 mt-0.5 bg-[#0C0614] rounded-full overflow-hidden border border-purple-900">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 transition-all duration-300"
                    style={{ width: `${manaPercent}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            CENTER SECTION: FULL 5-AREA SKILL NAVIGATION MENU
            "3. Ở mỗi màn hình thì chỉ thể hiện một khu vực, ở menu thì sẽ hiển thị đầy đủ các khu vực"
            ========================================================================= */}
        <nav className="w-full lg:w-auto flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto py-1 px-1 bg-[#140803] rounded-xl border border-[#3E1F0C]">
          {FARM_AREAS.map(area => {
            const isActive = (activeAreaId || state.activeArea) === area.id;

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  if (onSelectArea) onSelectArea(area.id);
                }}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg font-pixel text-[10px] sm:text-xs flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400 text-[#201007] border-yellow-200 shadow-md font-black scale-105 ring-2 ring-amber-400/40'
                    : 'bg-[#2A160A] text-amber-200/90 border-[#4A2610] hover:bg-[#3E1F0C] hover:text-amber-100 hover:border-amber-500/50'
                }`}
                title={`${area.name} - ${area.skillTitle}: ${area.description}`}
              >
                <span className="text-sm filter drop-shadow">{area.icon}</span>
                <span className="font-bold">{area.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase font-bold ${
                  isActive ? 'bg-[#201007] text-amber-300' : 'bg-[#140803] text-amber-400/80'
                }`}>
                  {area.skillName}
                </span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT SECTION: Date, Streak, Sound & Account */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2 sm:gap-3">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-950/80 border border-orange-500/60 text-orange-300 text-xs font-pixel font-bold shadow-inner"
            title={`Chuỗi ${state.streak} ngày luyện tập!`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{state.streak}D</span>
          </div>

          {/* Date Clock Plate */}
          <div className="bg-[#140803] border border-[#4A2610] px-2 py-1 rounded-xl flex items-center gap-1.5 shadow-inner">
            <span className="text-sm">{currentSeason.icon}</span>
            <div className="text-[9px] font-pixel text-amber-200">
              {currentSeason.name}, N.{state.day}
            </div>
          </div>

          {/* Quick Almanac Shortcut */}
          {onOpenAlmanac && (
            <button
              type="button"
              onClick={onOpenAlmanac}
              className="p-1.5 rounded-lg bg-[#2A160A] hover:bg-[#3E1F0C] border border-[#4A2610] text-amber-300 transition cursor-pointer"
              title="Mở Niên Giám Học Tập Morning Almanac"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Quick Store Shortcut */}
          {onOpenStore && (
            <button
              type="button"
              onClick={onOpenStore}
              className="p-1.5 rounded-lg bg-[#2A160A] hover:bg-[#3E1F0C] border border-[#4A2610] text-amber-300 transition cursor-pointer"
              title="Cửa Hàng Nông Cụ & Hồi Mana"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border cursor-pointer transition ${
              isMuted 
                ? 'bg-[#140803] text-stone-500 border-[#381B0C]' 
                : 'bg-amber-600/30 text-amber-300 border-amber-500/60'
            }`}
            title={isMuted ? 'Bật âm thanh retro' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* User Account / Auth Actions */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-[#140803] px-2 py-1 rounded-xl border border-[#4A2610]">
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className="text-xs font-bold text-amber-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer max-w-[90px] truncate"
                title="Cài đặt tài khoản"
              >
                <div className="w-4 h-4 rounded-full bg-amber-500 text-[#201007] flex items-center justify-center text-[9px] font-black shrink-0">
                  {(currentUser?.user_metadata?.full_name || currentUser?.email || 'M').charAt(0).toUpperCase()}
                </div>
                <span className="truncate hidden xl:inline">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
              </button>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-0.5 text-stone-400 hover:text-rose-400 transition cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-2 py-1 rounded-xl pixel-btn-gold font-pixel text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow"
            >
              <User className="w-3 h-3" />
              <span>Đăng Nhập</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
