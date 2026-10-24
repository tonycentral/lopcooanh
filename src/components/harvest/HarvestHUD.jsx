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
  Utensils,
  Award,
  Shield
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { FARM_LEVELS_CONFIG, FARM_TIERS } from '../../services/harvestTownService';

export default function HarvestHUD({
  state,
  onOpenTargetBandModal,
  onOpenBackpack,
  onOpenStore,
  onOpenBulletin,
  onOpenAlmanac,
  onOpenPasture,
  onOpenKitchen,
  onOpenSeedVault,
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
    spring: { name: 'Mùa Xuân', icon: '🌸', weatherIcon: Sun, weatherText: 'Nắng ấm (+10% EXP)' },
    summer: { name: 'Mùa Hạ', icon: '☀️', weatherIcon: Sun, weatherText: 'Nắng gắt' },
    fall: { name: 'Mùa Thu', icon: '🍂', weatherIcon: Wind, weatherText: 'Gió thu mát lành' },
    winter: { name: 'Mùa Đông', icon: '❄️', weatherIcon: CloudRain, weatherText: 'Mưa phùn' }
  };
  const currentSeason = seasonLabels[state.season] || seasonLabels.spring;
  const WeatherComp = currentSeason.weatherIcon;

  // Focus Points (FP: 0-100)
  const fp = state.focusPoints ?? 80;
  const maxFp = state.maxFocusPoints || 100;
  const fpPercent = Math.min(100, Math.round((fp / maxFp) * 100));

  // Stamina (0-100)
  const staminaPercent = Math.min(100, Math.round((state.stamina / state.maxStamina) * 100));
  const staminaColor = staminaPercent > 50 ? 'bg-emerald-500' : staminaPercent > 20 ? 'bg-amber-500' : 'bg-red-500';

  const isAlmanacCompleted = state.almanac?.completedToday;
  const currentTierInfo = FARM_TIERS.find(t => t.tier === state.farmTier) || FARM_TIERS[0];

  return (
    <div className="w-full bg-[#2D1A0D] text-[#FFF8E7] border-b-4 border-[#140804] shadow-xl select-none px-2 sm:px-4 py-2 shrink-0 z-30 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap lg:flex-nowrap">
        
        {/* Left: Player Profile & Level Plate */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Farmer Pixel Avatar Frame */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#5D3A1F] border-2 border-amber-400 p-1 flex items-center justify-center shadow-inner shrink-0 group cursor-pointer hover:border-amber-300 transition">
            <span className="text-2xl filter drop-shadow">👨‍🌾</span>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-[#2D1A0D] text-[10px] font-pixel font-black rounded border border-[#140804]">
              L{state.level}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs sm:text-sm font-bold text-amber-200 truncate">
                {state.farmerName || 'Mochi Farmer'}
              </span>
              <button
                type="button"
                onClick={onOpenTargetBandModal}
                className="px-2 py-0.5 rounded bg-[#4A2B11] hover:bg-[#6D421D] border border-amber-500/70 text-[10px] font-pixel font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition shadow-xs"
                title="Đổi Target Band IELTS"
              >
                <Target className="w-2.5 h-2.5 text-amber-400" />
                <span>Band {state.bandTarget || '7.0'}</span>
              </button>
            </div>

            {/* EXP Bar */}
            <div className="w-28 sm:w-36 mt-1">
              <div className="flex justify-between items-center text-[9px] text-amber-200/80 mb-0.5 font-bold">
                <span className="truncate">{levelInfo.title}</span>
                <span className="font-pixel">{xpPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#140804] rounded-full overflow-hidden border border-[#5D3A1F]">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Dual Energy Meters (Focus Points FP + Stamina) & Quick Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3 order-3 lg:order-2 w-full lg:w-auto justify-between lg:justify-center border-t lg:border-t-0 pt-1.5 lg:pt-0 border-[#3D2312] flex-wrap sm:flex-nowrap">
          
          {/* 1. Focus Points (FP) Bar - Generated by Daily Almanac! */}
          <div 
            onClick={onOpenAlmanac}
            className="flex items-center gap-1.5 bg-[#1B2A38] px-2.5 py-1 rounded-xl border border-cyan-500/50 cursor-pointer hover:border-cyan-400 transition"
            title="Focus Points (FP): Năng lượng tập trung tạo ra từ Morning Almanac để canh tác và nghiên cứu!"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[9px] font-pixel font-bold text-cyan-200 gap-2">
                <span>FOCUS (FP)</span>
                <span>{fp}/{maxFp}</span>
              </div>
              <div className="w-16 sm:w-20 h-2 bg-[#0E1720] rounded-full overflow-hidden border border-cyan-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300"
                  style={{ width: `${fpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Stamina Bar */}
          <div 
            className="flex items-center gap-1.5 bg-[#1C2618] px-2.5 py-1 rounded-xl border border-emerald-500/50"
            title="Thể lực (Stamina): Tiêu hao khi làm việc đồng áng, hồi phục qua giấc ngủ hoặc ăn món Collocation!"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[9px] font-pixel font-bold text-emerald-200 gap-2">
                <span>STAMINA</span>
                <span>{state.stamina}/{state.maxStamina}</span>
              </div>
              <div className="w-16 sm:w-20 h-2 bg-[#0D150B] rounded-full overflow-hidden border border-emerald-800">
                <div 
                  className={`h-full ${staminaColor} transition-all duration-300`}
                  style={{ width: `${staminaPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. Gold & Gems */}
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={onOpenStore}
              className="flex items-center gap-1 bg-[#1E0F07] hover:bg-[#331A0C] px-2.5 py-1 rounded-xl border border-amber-500/60 shadow-inner transition cursor-pointer"
              title="Cửa Hàng Hạt Giống & Nông Cụ"
            >
              <span className="text-sm">🪙</span>
              <span className="font-pixel text-xs font-bold text-amber-300">{state.gold}</span>
            </button>

            <button 
              type="button"
              onClick={onOpenSeedVault}
              className="flex items-center gap-1 bg-[#1E0F07] hover:bg-[#331A0C] px-2 py-1 rounded-xl border border-purple-500/60 shadow-inner transition cursor-pointer"
              title="Hầm Hạt Giống Bảo Vật Gia Truyền (Heirlooms)"
            >
              <span className="text-sm animate-heirloom">👑</span>
              <span className="font-pixel text-xs font-bold text-purple-300">{state.seedVault?.length || 0}</span>
            </button>
          </div>

          {/* 4. Morning Almanac Quick Button */}
          <button
            type="button"
            onClick={onOpenAlmanac}
            className={`px-2.5 py-1 rounded-xl font-pixel text-xs flex items-center gap-1.5 transition cursor-pointer shadow ${
              isAlmanacCompleted
                ? 'bg-emerald-800 text-white border-2 border-emerald-400'
                : 'pixel-btn-gold text-[#2D1A0D] animate-bounce'
            }`}
            title="Mở Cuốn Niên Giám Nông Trại (Daily Almanac)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAlmanacCompleted ? 'Almanac ✓' : 'Học Almanac!'}</span>
          </button>
        </div>

        {/* Right: Date, Weather, Streak, Sound & Account */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 lg:order-3">
          
          {/* Streak Flame & Scarecrow Protection */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-950/80 border border-orange-500/60 text-orange-300 text-xs font-pixel font-bold shadow-inner"
            title={`Chuỗi ${state.streak} ngày luyện tập! (Kỷ lục: ${state.longestStreak || 12} ngày). Bù nhìn Oxford bảo vệ: ${state.scarecrows || 0}`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{state.streak}D</span>
            {(state.scarecrows || 0) > 0 && (
              <span className="text-[10px] ml-0.5 text-cyan-300" title="Bù nhìn Oxford bảo vệ chuỗi nếu quên 1 ngày">🛡️</span>
            )}
          </div>

          {/* Date Clock Plate */}
          <div className="bg-[#1E0F07] border-2 border-[#5D3A1F] px-2.5 sm:px-3 py-1 rounded-xl flex items-center gap-2 text-right shadow-inner">
            <div className="text-xl">{currentSeason.icon}</div>
            <div className="flex flex-col text-left">
              <div className="text-[10px] font-pixel font-bold text-amber-200 leading-tight">
                {currentSeason.name}, N.{state.day}
              </div>
              <div className="text-[9px] text-amber-100/70 font-semibold flex items-center gap-1">
                <WeatherComp className="w-2.5 h-2.5 text-amber-400" />
                <span>Năm {state.year}</span>
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border cursor-pointer transition ${
              isMuted 
                ? 'bg-[#1E0F07] text-stone-500 border-[#4A2B11]' 
                : 'bg-amber-600/30 text-amber-300 border-amber-500/60'
            }`}
            title={isMuted ? 'Bật âm thanh retro' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* User Account / Auth Actions */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-[#1E0F07] px-2 py-1 rounded-xl border border-[#5D3A1F]">
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className="text-xs font-bold text-amber-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer max-w-[100px] truncate"
                title="Cài đặt tài khoản & AI"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-[#2D1A0D] flex items-center justify-center text-[10px] font-black shrink-0">
                  {(currentUser?.user_metadata?.full_name || currentUser?.email || 'M').charAt(0).toUpperCase()}
                </div>
                <span className="truncate hidden xl:inline">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
              </button>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1 text-stone-400 hover:text-rose-400 transition cursor-pointer"
                  title="Đăng xuất khỏi nông trại"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 rounded-xl pixel-btn-gold font-pixel text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow"
            >
              <User className="w-3 h-3" />
              <span>Đăng Nhập</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
