import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  Award,
  Sun,
  CloudRain,
  Wind,
  Zap,
  Target,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { FARM_LEVELS_CONFIG } from '../../services/harvestTownService';

export default function HarvestHUD({
  state,
  onOpenTargetBandModal,
  onOpenBackpack,
  onOpenStore,
  onOpenBulletin,
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

  // Stamina percentage & color
  const staminaPercent = Math.min(100, Math.round((state.stamina / state.maxStamina) * 100));
  const staminaColor = staminaPercent > 50 ? 'bg-emerald-500' : staminaPercent > 20 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="w-full bg-[#3E2723] text-[#FFF8E1] border-b-4 border-[#271406] shadow-md select-none px-2 sm:px-4 py-2 shrink-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left: Player Badge & Level Plate */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Farmer Pixel Avatar Frame */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#5D4037] border-2 border-[#8D6E63] p-1 flex items-center justify-center shadow-inner shrink-0 group cursor-pointer hover:border-amber-400 transition">
            <span className="text-2xl filter drop-shadow">👨‍🌾</span>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-[#3E2723] text-[10px] font-black rounded-md border border-[#3E2723]">
              L{state.level}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-amber-200 truncate">
                {state.farmerName || 'Mochi Farmer'}
              </span>
              <button
                type="button"
                onClick={onOpenTargetBandModal}
                className="px-2 py-0.5 rounded-md bg-[#5D4037] hover:bg-[#6D4C41] border border-[#8D6E63] text-[10px] font-black text-amber-300 flex items-center gap-1 cursor-pointer transition"
                title="Đổi Target Band IELTS"
              >
                <Target className="w-2.5 h-2.5 text-amber-400" />
                <span>Band {state.bandTarget || '7.0'}</span>
              </button>
            </div>

            {/* EXP Bar */}
            <div className="w-28 sm:w-36 mt-1">
              <div className="flex justify-between items-center text-[9px] text-amber-100/80 mb-0.5 font-bold">
                <span className="truncate">{levelInfo.title}</span>
                <span>{xpPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#271406] rounded-full overflow-hidden border border-[#5D4037]">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Stamina & Currencies (Gold & Gems) */}
        <div className="flex items-center gap-2 sm:gap-4 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-center border-t sm:border-t-0 pt-1.5 sm:pt-0 border-[#5D4037]">
          {/* Stamina Energy Bar */}
          <div className="flex items-center gap-1.5 bg-[#2A1810] px-2.5 py-1 rounded-xl border border-[#5D4037]" title="Thể lực: Tiêu hao khi làm vườn, hồi phục khi hoàn thành bài tập IELTS!">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[9px] font-black text-amber-200 gap-2">
                <span>STAMINA</span>
                <span>{state.stamina}/{state.maxStamina}</span>
              </div>
              <div className="w-20 sm:w-24 h-2 bg-[#1A0D08] rounded-full overflow-hidden border border-[#4E342E]">
                <div 
                  className={`h-full ${staminaColor} transition-all duration-300`}
                  style={{ width: `${staminaPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Gold (G) */}
          <button 
            type="button"
            onClick={onOpenStore}
            className="flex items-center gap-1.5 bg-[#2A1810] hover:bg-[#3E2723] px-2.5 py-1 rounded-xl border border-amber-600/60 shadow-inner cursor-pointer transition active:scale-95"
            title="Gold (Vàng Nông Trại) - Kiếm từ thu hoạch & làm bài tập. Nhấn để mở Cửa hàng!"
          >
            <span className="text-base">🪙</span>
            <span className="font-mono font-black text-xs sm:text-sm text-yellow-300 tracking-tight">
              {state.gold?.toLocaleString() || 0} <span className="text-[10px] text-yellow-500 font-sans">G</span>
            </span>
          </button>

          {/* Mochi Gems */}
          <div 
            className="flex items-center gap-1.5 bg-[#2A1810] px-2.5 py-1 rounded-xl border border-purple-500/50 shadow-inner"
            title="Mochi Gems (Ngọc Tri Thức) - Nhận được khi viết bài luận Task 1/Task 2 hoàn chỉnh!"
          >
            <span className="text-sm">💎</span>
            <span className="font-mono font-black text-xs sm:text-sm text-purple-300">
              {state.gems || 0}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border cursor-pointer transition ${
              isMuted 
                ? 'bg-[#2A1810] text-stone-400 border-[#5D4037]' 
                : 'bg-amber-600/30 text-amber-300 border-amber-500/60'
            }`}
            title={isMuted ? 'Bật âm thanh retro' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Harvest Town Day & Season Clock Widget */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-3">
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-950/60 border border-orange-500/60 text-orange-300 text-xs font-black shadow-inner"
            title={`Chuỗi ${state.streak} ngày luyện tập liên tiếp!`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            <span>{state.streak}D</span>
          </div>

          {/* Date Clock Plate */}
          <div className="bg-[#2A1810] border-2 border-[#5D4037] px-2.5 sm:px-3 py-1 rounded-xl flex items-center gap-2 text-right shadow-inner">
            <div className="text-xl">{currentSeason.icon}</div>
            <div className="flex flex-col text-left">
              <div className="text-[11px] font-black text-amber-200 leading-tight">
                {currentSeason.name}, Ngày {state.day}
              </div>
              <div className="text-[9px] text-amber-100/70 font-semibold flex items-center gap-1">
                <WeatherComp className="w-2.5 h-2.5 text-amber-400" />
                <span>Năm {state.year}</span>
              </div>
            </div>
          </div>

          {/* User Account / Auth Actions */}
          {currentUser ? (
            <div className="flex items-center gap-1 bg-[#2A1810] px-2 py-1 rounded-xl border border-[#5D4037]">
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className="text-xs font-bold text-amber-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer max-w-[110px] truncate"
                title="Cài đặt tài khoản & AI"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-[#3E2723] flex items-center justify-center text-[10px] font-black shrink-0">
                  {(currentUser?.user_metadata?.full_name || currentUser?.email || 'M').charAt(0).toUpperCase()}
                </div>
                <span className="truncate hidden md:inline">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
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
              className="px-2.5 py-1 rounded-xl harvest-btn-gold text-[11px] font-black flex items-center gap-1 cursor-pointer shadow"
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
