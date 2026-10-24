import React, { useState } from 'react';
import { 
  FARM_AREAS, 
  FARM_LEVELS_CONFIG 
} from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';
import { 
  Compass, 
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

export default function FarmAreaNavSidebar({
  state,
  activeAreaId,
  onSelectArea,
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
    spring: { name: 'Mùa Xuân', icon: '🌸' },
    summer: { name: 'Mùa Hạ', icon: '☀️' },
    fall: { name: 'Mùa Thu', icon: '🍂' },
    winter: { name: 'Mùa Đông', icon: '❄️' }
  };
  const currentSeason = seasonLabels[state.season] || seasonLabels.spring;

  // STRICT 2 CURRENCIES:
  // 1. Tiền (Gold Coins 🪙)
  const gold = state.gold ?? 250;
  // 2. Mana (🔮)
  const mana = state.mana ?? 85;
  const maxMana = state.maxMana || 100;
  const manaPercent = Math.min(100, Math.round((mana / maxMana) * 100));

  // Determine User Display Name
  const userDisplayName = 
    currentUser?.user_metadata?.full_name || 
    (currentUser?.email ? currentUser.email.split('@')[0] : null) || 
    (studentEmail ? studentEmail.split('@')[0] : null) || 
    state.farmerName || 
    'Tony Nguyen';

  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <aside className="h-full shrink-0 bg-[#180A04] text-[#FFF8E7] border-r-4 border-[#0D0402] shadow-2xl flex flex-col justify-between p-2 sm:p-3 z-30 select-none font-sans w-16 xs:w-20 sm:w-60 lg:w-64 overflow-y-auto no-scrollbar transition-all">
      
      {/* =========================================================================
          TOP SECTION: UNIFIED USER PROFILE & STATS
          ========================================================================= */}
      <div className="shrink-0 space-y-2.5">
        
        {/* Profile Card */}
        <div className="p-1.5 sm:p-2 rounded-2xl bg-[#241107] border-2 border-[#45200D] shadow-inner">
          <div className="flex items-center gap-2">
            
            {/* Avatar Frame with Level */}
            <div 
              onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
              className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#3E1A08] border-2 border-amber-400 p-0.5 flex items-center justify-center shadow-md shrink-0 cursor-pointer hover:border-amber-300 transition"
              title={currentUser ? "Cài đặt tài khoản" : "Đăng nhập"}
            >
              {currentUser ? (
                <div className="w-full h-full rounded-lg bg-amber-500 text-[#201007] flex items-center justify-center text-sm sm:text-base font-black font-pixel">
                  {userInitial}
                </div>
              ) : (
                <span className="text-xl filter drop-shadow">👨‍🌾</span>
              )}

              {/* Level Badge */}
              <span className="absolute -bottom-1 -right-1 px-1 sm:px-1.5 py-0.2 bg-amber-500 text-[#201007] text-[8px] sm:text-[9px] font-pixel font-black rounded border border-[#120703]">
                L{state.level}
              </span>
            </div>

            {/* Name & Target Band (Desktop) */}
            <div className="hidden sm:flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
                  className="font-pixel text-xs font-bold text-amber-200 hover:text-white truncate cursor-pointer text-left"
                >
                  {userDisplayName}
                </button>

                {currentUser && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={onOpenSettingsModal}
                      className="p-1 rounded bg-[#33180B] hover:bg-[#4E2411] text-amber-300/80 hover:text-amber-200 transition cursor-pointer"
                      title="Cài đặt tài khoản & AI"
                    >
                      <Settings className="w-2.5 h-2.5" />
                    </button>
                    {onSignOut && (
                      <button
                        type="button"
                        onClick={onSignOut}
                        className="p-1 rounded bg-[#33180B] hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                        title="Đăng xuất"
                      >
                        <LogOut className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Target Band Pill */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={onOpenTargetBandModal}
                  className="px-1.5 py-0.2 rounded bg-[#3D1E0C] hover:bg-[#5E2F14] border border-amber-500/70 text-[8.5px] font-pixel font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition"
                  title="Thay đổi Target Band IELTS"
                >
                  <Target className="w-2.5 h-2.5 text-amber-400" />
                  <span>Band {state.bandTarget || '7.0'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* EXP Progress Bar (Desktop) */}
          <div className="hidden sm:block mt-2 pt-1.5 border-t border-[#3D1E0C]">
            <div className="flex justify-between items-center text-[8px] text-amber-200/80 mb-0.5 font-bold">
              <span className="truncate">{levelInfo.title}</span>
              <span className="font-pixel">{xpPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#120703] rounded-full overflow-hidden border border-[#3E1E0B]">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300" 
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            STRICT 2 CURRENCIES (TIỀN 🪙 & MANA 🔮)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          
          {/* 1. Tiền (Gold 🪙) */}
          <button 
            type="button"
            onClick={onOpenStore}
            className="flex items-center gap-1.5 bg-[#200E05] hover:bg-[#331709] p-1.5 rounded-xl border border-amber-500/60 shadow-inner transition cursor-pointer text-left"
            title="Tiền Vàng (Gold): Dùng để giao dịch & mua sắm trong Cửa Hàng"
          >
            <span className="text-base sm:text-lg shrink-0">🪙</span>
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-[7.5px] font-pixel text-amber-200/60 leading-none">TIỀN</span>
              <span className="font-pixel text-xs font-bold text-amber-300 leading-tight truncate">{gold}</span>
            </div>
          </button>

          {/* 2. Mana (🔮) */}
          <div 
            className="flex items-center gap-1.5 bg-[#170924] p-1.5 rounded-xl border border-purple-500/60 shadow-inner"
            title={`Mana: ${mana}/${maxMana} — Năng lượng luyện tập IELTS`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <div className="hidden sm:flex flex-col min-w-0 flex-1">
              <div className="flex justify-between text-[7.5px] font-pixel font-bold text-purple-200 gap-1 leading-none">
                <span>MANA</span>
                <span>{mana}/{maxMana}</span>
              </div>
              <div className="w-full h-1.5 mt-0.5 bg-[#0C0414] rounded-full overflow-hidden border border-purple-900">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${manaPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Streak & Season Plate (Desktop) */}
        <div className="hidden sm:flex items-center justify-between gap-1 px-2 py-1 rounded-xl bg-[#200E05] border border-[#3E1E0B] text-[8.5px] font-pixel text-amber-200/90">
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
            <span>{state.streak}D Chuỗi</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{currentSeason.icon}</span>
            <span>{currentSeason.name}, N.{state.day}</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MIDDLE SECTION: 5 FARM AREAS IN EXACT SPECIFIED ORDER
          (Ruộng Lúa -> Vườn Cây -> Chăn Nuôi -> Ao Hồ -> Nhà Kính)
          ========================================================================= */}
      <div className="my-2 flex-1 flex flex-col justify-center space-y-1.5">
        
        {/* Section Header */}
        <div className="hidden sm:flex items-center gap-1.5 px-1 text-[9px] font-pixel text-amber-300 font-bold tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>KHU VỰC NÔNG TRẠI</span>
        </div>

        {/* 5 Area Buttons */}
        <nav className="flex flex-col gap-1.5">
          {FARM_AREAS.map(area => {
            const isActive = activeAreaId === area.id;

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  if (onSelectArea) onSelectArea(area.id);
                }}
                className={`relative w-full p-1.5 sm:p-2 rounded-xl transition cursor-pointer flex items-center gap-2 sm:gap-2.5 border-2 text-left group ${
                  isActive
                    ? 'bg-amber-400 text-[#201007] border-yellow-200 shadow-xl font-black scale-[1.02] ring-2 ring-amber-400/50'
                    : 'bg-[#241107] text-amber-200/90 border-[#3D1E0C] hover:bg-[#381B0C] hover:text-white hover:border-amber-500/60'
                }`}
                title={`${area.name} — ${area.skillTitle}: ${area.description}`}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r bg-yellow-300 shadow-sm" />
                )}

                {/* Area Emoji Icon */}
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xl shrink-0 transition ${
                  isActive 
                    ? 'bg-[#201007]/15 filter drop-shadow' 
                    : 'bg-[#180A04] group-hover:scale-110'
                }`}>
                  {area.icon}
                </div>

                {/* Name & Skill Badge (Desktop) */}
                <div className="hidden sm:flex flex-col min-w-0 flex-1">
                  <span className={`font-pixel text-xs truncate leading-tight ${
                    isActive ? 'text-[#201007] font-bold' : 'text-amber-100 group-hover:text-amber-300'
                  }`}>
                    {area.name}
                  </span>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-sans uppercase font-black tracking-wide leading-none ${
                      isActive 
                        ? 'bg-[#201007] text-amber-300' 
                        : 'bg-[#140702] text-amber-400 border border-amber-500/30'
                    }`}>
                      {area.skillName}
                    </span>
                  </div>
                </div>

                {/* Mobile Short Skill Label */}
                <span className={`sm:hidden text-[7px] font-pixel block text-center truncate uppercase leading-none font-bold ${
                  isActive ? 'text-[#201007]' : 'text-amber-300/80'
                }`}>
                  {area.skillName.slice(0, 4)}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* =========================================================================
          BOTTOM SECTION: QUICK ACTIONS (ALMANAC, STORE, SOUND TOGGLE)
          ========================================================================= */}
      <div className="shrink-0 pt-2 border-t border-[#301608] flex items-center justify-between gap-1">
        
        {/* Morning Almanac Button */}
        {onOpenAlmanac && (
          <button
            type="button"
            onClick={onOpenAlmanac}
            className="flex-1 p-1.5 rounded-xl bg-[#261207] hover:bg-[#3D1E0C] border border-[#4A2610] text-amber-300 font-pixel text-[9px] flex items-center justify-center gap-1 transition cursor-pointer"
            title="Mở Cuốn Niên Giám Học Tập Morning Almanac"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Almanac</span>
          </button>
        )}

        {/* General Store Button */}
        {onOpenStore && (
          <button
            type="button"
            onClick={onOpenStore}
            className="flex-1 p-1.5 rounded-xl bg-[#261207] hover:bg-[#3D1E0C] border border-[#4A2610] text-amber-300 font-pixel text-[9px] flex items-center justify-center gap-1 transition cursor-pointer"
            title="Cửa Hàng Nông Cụ & Hồi Mana"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cửa Hàng</span>
          </button>
        )}

        {/* Retro Sound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          className={`p-1.5 rounded-xl border cursor-pointer transition shrink-0 ${
            isMuted 
              ? 'bg-[#180A04] text-stone-500 border-[#301608]' 
              : 'bg-amber-600/30 text-amber-300 border-amber-500/60'
          }`}
          title={isMuted ? 'Bật âm thanh retro' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

      </div>

    </aside>
  );
}
