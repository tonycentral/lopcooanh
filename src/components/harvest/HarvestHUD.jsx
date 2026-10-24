import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sun, 
  CloudRain, 
  Wind, 
  Target, 
  User, 
  LogOut, 
  Settings,
  BookOpen,
  ShoppingBag
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { FARM_LEVELS_CONFIG } from '../../services/harvestTownService';

export default function HarvestHUD({
  state,
  onOpenTargetBandModal,
  onOpenStore,
  onOpenAlmanac,
  currentUser,
  studentEmail,
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

  // STRICT 2 CURRENCIES:
  // 1. Tiền để giao dịch (Gold Coins 🪙)
  const gold = state.gold ?? 250;
  // 2. Mana để học tập & nuôi dưỡng (🔮)
  const mana = state.mana ?? 85;
  const maxMana = state.maxMana || 100;
  const manaPercent = Math.min(100, Math.round((mana / maxMana) * 100));

  // Determine User Display Name (Merged with Account)
  const userDisplayName = 
    currentUser?.user_metadata?.full_name || 
    (currentUser?.email ? currentUser.email.split('@')[0] : null) || 
    (studentEmail ? studentEmail.split('@')[0] : null) || 
    state.farmerName || 
    'Tony Nguyen';

  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <header className="w-full bg-[#1E0E06] text-[#FFF8E7] border-b-4 border-[#0F0502] shadow-2xl select-none px-2 sm:px-4 py-2 shrink-0 z-30 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* =========================================================================
            LEFT SECTION: UNIFIED USER ACCOUNT & FARMER STATS
            (Sáp nhập Học Viên Mochi vào tài khoản của tôi)
            ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          
          {/* Avatar Frame with Level Badge */}
          <div 
            onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#3E1E0B] border-2 border-amber-400 p-0.5 flex items-center justify-center shadow-inner shrink-0 cursor-pointer hover:border-amber-300 transition group"
            title={currentUser ? "Cài đặt tài khoản & AI" : "Đăng nhập tài khoản"}
          >
            {currentUser ? (
              <div className="w-full h-full rounded-lg bg-amber-500 text-[#201007] flex items-center justify-center text-sm sm:text-base font-black font-pixel">
                {userInitial}
              </div>
            ) : (
              <span className="text-xl filter drop-shadow">👨‍🌾</span>
            )}

            {/* Level Badge */}
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-[#201007] text-[9px] font-pixel font-black rounded border border-[#120703] shadow">
              L{state.level}
            </span>
          </div>

          {/* Account Details & Level Progress */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* User Account Name */}
              <button
                type="button"
                onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
                className="font-pixel text-xs sm:text-sm font-bold text-amber-200 hover:text-white transition truncate cursor-pointer text-left max-w-[130px] sm:max-w-[180px]"
                title="Tài khoản học viên"
              >
                {userDisplayName}
              </button>

              {/* Target Band Pill */}
              <button
                type="button"
                onClick={onOpenTargetBandModal}
                className="px-1.5 py-0.2 rounded bg-[#381B0C] hover:bg-[#5D2E12] border border-amber-500/70 text-[9px] font-pixel font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition shadow-xs"
                title="Đổi Target Band IELTS"
              >
                <Target className="w-2.5 h-2.5 text-amber-400" />
                <span>Band {state.bandTarget || '7.0'}</span>
              </button>

              {/* Quick Settings & Logout Buttons (When logged in) */}
              {currentUser ? (
                <div className="hidden xs:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={onOpenSettingsModal}
                    className="p-1 rounded bg-[#2D1508] hover:bg-[#4A2610] text-amber-300/80 hover:text-amber-200 border border-[#4A2610] transition cursor-pointer"
                    title="Cài đặt tài khoản & AI"
                  >
                    <Settings className="w-3 h-3" />
                  </button>

                  {onSignOut && (
                    <button
                      type="button"
                      onClick={onSignOut}
                      className="p-1 rounded bg-[#2D1508] hover:bg-rose-950 text-stone-400 hover:text-rose-300 border border-[#4A2610] hover:border-rose-700/60 transition cursor-pointer"
                      title="Đăng xuất khỏi nông trại"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-1.5 py-0.2 rounded bg-amber-500 hover:bg-amber-400 text-[#201007] text-[9px] font-pixel font-bold flex items-center gap-0.5 cursor-pointer shadow transition"
                >
                  <User className="w-2.5 h-2.5" />
                  <span>Đăng Nhập</span>
                </button>
              )}
            </div>

            {/* Title & EXP Progress Bar */}
            <div className="w-28 sm:w-40 mt-0.5">
              <div className="flex justify-between items-center text-[8px] text-amber-200/80 mb-0.5 font-bold">
                <span className="truncate">{levelInfo.title}</span>
                <span className="font-pixel">{xpPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#0F0502] rounded-full overflow-hidden border border-[#3E1E0B]">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT SECTION: STRICT 2 CURRENCIES (TIỀN 🪙 & MANA 🔮), STREAK, SEASON, TOOLS
            ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* 1. Tiền để giao dịch (Gold Coins 🪙) */}
          <button 
            type="button"
            onClick={onOpenStore}
            className="flex items-center gap-1.5 bg-[#140803] hover:bg-[#2B1206] px-2 sm:px-2.5 py-1 rounded-xl border border-amber-500/70 shadow-inner transition cursor-pointer"
            title="Tiền Vàng (Gold): Dùng để giao dịch & mua sắm hạt giống, nông cụ trong Cửa Hàng"
          >
            <span className="text-base sm:text-lg">🪙</span>
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-pixel text-amber-200/60 leading-none">TIỀN</span>
              <span className="font-pixel text-xs sm:text-sm font-bold text-amber-300 leading-tight">{gold}</span>
            </div>
          </button>

          {/* 2. Mana để học tập & nuôi dưỡng (🔮) */}
          <div 
            className="flex items-center gap-1.5 bg-[#14081E] px-2 sm:px-2.5 py-1 rounded-xl border border-purple-500/60 shadow-inner"
            title="Mana: Năng lượng học tập dùng để nuôi dưỡng và chăm sóc các chủ đề IELTS"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[8px] font-pixel font-bold text-purple-200 gap-2 leading-none">
                <span>MANA</span>
                <span>{mana}/{maxMana}</span>
              </div>
              <div className="w-14 sm:w-20 h-2 mt-0.5 bg-[#0A0312] rounded-full overflow-hidden border border-purple-900">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${manaPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Flame */}
          <div 
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-950/80 border border-orange-500/60 text-orange-300 text-xs font-pixel font-bold shadow-inner"
            title={`Chuỗi ${state.streak} ngày luyện tập liên tục!`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{state.streak}D</span>
          </div>

          {/* Season & Day Clock */}
          <div className="hidden md:flex bg-[#140803] border border-[#3E1E0B] px-2 py-1 rounded-xl items-center gap-1.5 shadow-inner">
            <span className="text-sm">{currentSeason.icon}</span>
            <div className="text-[9px] font-pixel text-amber-200">
              {currentSeason.name}, N.{state.day}
            </div>
          </div>

          {/* Almanac Shortcut Button */}
          {onOpenAlmanac && (
            <button
              type="button"
              onClick={onOpenAlmanac}
              className="p-1.5 rounded-lg bg-[#2D1508] hover:bg-[#4A2610] border border-[#4A2610] text-amber-300 transition cursor-pointer"
              title="Mở Niên Giám Học Tập Morning Almanac"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Store Shortcut Button */}
          {onOpenStore && (
            <button
              type="button"
              onClick={onOpenStore}
              className="p-1.5 rounded-lg bg-[#2D1508] hover:bg-[#4A2610] border border-[#4A2610] text-amber-300 transition cursor-pointer"
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

        </div>

      </div>
    </header>
  );
}
