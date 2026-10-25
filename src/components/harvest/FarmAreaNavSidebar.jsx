import React, { useState } from 'react';
import { 
  FARM_AREAS, 
  FARM_LEVELS_CONFIG 
} from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';

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

  // Season translations in retro style
  const seasonLabels = {
    spring: { name: 'XUÂN', icon: '🌸' },
    summer: { name: 'HẠ', icon: '☀️' },
    fall: { name: 'THU', icon: '🍂' },
    winter: { name: 'ĐÔNG', icon: '❄️' }
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
    'Farmer Tony';

  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <aside 
      className="h-full shrink-0 flex flex-col justify-between p-2 sm:p-3 z-30 select-none font-pixel w-20 sm:w-64 overflow-y-auto no-scrollbar border-r-4 border-[#45283c] transition-all"
      style={{
        backgroundColor: '#663931',
        boxShadow: 'inset -4px 0 0 #45283c, inset 4px 0 0 #8f563b'
      }}
    >
      
      {/* =========================================================================
          TOP SECTION: USER PROFILE & STATS (PARCHMENT CARD WITH 4PX WOOD BORDER)
          ========================================================================= */}
      <div className="shrink-0 space-y-2">
        
        {/* Profile Card */}
        <div className="rpg-panel-paper p-2 flex flex-col gap-2">
          
          <div className="flex items-center gap-2">
            {/* Standardized 48x48px Pixel Slot for Avatar */}
            <div 
              onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
              className="pixel-slot-48 shrink-0 cursor-pointer hover:brightness-110 active:translate-y-0.5"
              title={currentUser ? "Cài đặt tài khoản" : "Đăng nhập"}
            >
              {currentUser ? (
                <span className="text-sm font-bold text-[#2c1b18]">{userInitial}</span>
              ) : (
                <i className="pixelart-icons-font-user text-xl text-[#2c1b18]"></i>
              )}
              {/* Level Badge in Corner */}
              <div 
                className="absolute -bottom-1 -right-1 px-1 py-0.5 text-[7px] font-bold border-2 border-[#45283c]"
                style={{ backgroundColor: '#4b692f', color: '#ffffff' }}
              >
                L{state.level}
              </div>
            </div>

            {/* User Info (Desktop only) */}
            <div className="hidden sm:flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={currentUser ? onOpenSettingsModal : onOpenAuthModal}
                  className="text-[9px] font-bold text-[#2c1b18] hover:text-[#8f563b] truncate text-left cursor-pointer"
                  title={userDisplayName}
                >
                  {userDisplayName}
                </button>

                {currentUser && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={onOpenSettingsModal}
                      className="p-1 border-2 border-[#45283c] bg-[#8f563b] text-[#e8cfa6] hover:bg-[#9d6043] cursor-pointer"
                      title="Cài đặt tài khoản"
                    >
                      <i className="pixelart-icons-font-sliders text-[10px]"></i>
                    </button>
                    {onSignOut && (
                      <button
                        type="button"
                        onClick={onSignOut}
                        className="p-1 border-2 border-[#45283c] bg-[#45283c] text-[#e8cfa6] hover:brightness-125 cursor-pointer"
                        title="Đăng xuất"
                      >
                        <i className="pixelart-icons-font-logout text-[10px]"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Target Band Pill */}
              <button
                type="button"
                onClick={onOpenTargetBandModal}
                className="mt-1 px-1.5 py-1 border-2 border-[#45283c] bg-[#8f563b] text-[#e8cfa6] hover:bg-[#9d6043] text-[8px] font-bold flex items-center justify-between cursor-pointer"
                title="Thay đổi Target Band IELTS"
              >
                <span className="flex items-center gap-1">
                  <i className="pixelart-icons-font-target text-[9px] text-[#e8cfa6]"></i>
                  <span>BAND</span>
                </span>
                <span className="text-[#ffffff]">{state.bandTarget || '7.0'}</span>
              </button>
            </div>
          </div>

          {/* EXP Progress Gauge (Stepped Retro) */}
          <div className="hidden sm:block border-t-2 border-[#45283c] pt-1">
            <div className="flex justify-between items-center text-[7px] text-[#2c1b18] mb-1 font-bold">
              <span className="truncate">{levelInfo.title}</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="w-full h-3 border-2 border-[#45283c] bg-[#d7b594] p-0.5 box-border">
              <div 
                className="h-full bg-[#4b692f] transition-all duration-200" 
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
            className="rpg-btn-paper p-1.5 flex items-center gap-1.5 cursor-pointer text-left w-full"
            title="Tiền Vàng: Mở Cửa Hàng để mua nông cụ"
          >
            <i className="pixelart-icons-font-coins text-base text-[#d9911e] shrink-0"></i>
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-[7px] text-[#8f563b] leading-tight">TIỀN</span>
              <span className="text-[9px] font-bold text-[#2c1b18] truncate leading-tight">{gold}</span>
            </div>
          </button>

          {/* 2. Mana (🔮) */}
          <div 
            className="rpg-btn-paper p-1.5 flex items-center gap-1.5 text-left w-full"
            title={`Mana: ${mana}/${maxMana} — Năng lượng luyện tập IELTS`}
          >
            <i className="pixelart-icons-font-zap text-base text-[#663931] shrink-0"></i>
            <div className="hidden sm:flex flex-col min-w-0 flex-1">
              <div className="flex justify-between text-[7px] text-[#8f563b] leading-tight">
                <span>MANA</span>
                <span>{mana}</span>
              </div>
              <div className="w-full h-2 border-2 border-[#45283c] bg-[#d7b594] mt-0.5 box-border">
                <div 
                  className="h-full bg-[#663931] transition-all duration-200"
                  style={{ width: `${manaPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Streak & Season Info */}
        <div 
          className="hidden sm:flex items-center justify-between px-2 py-1 border-2 border-[#45283c] text-[7.5px] font-bold"
          style={{ backgroundColor: '#45283c', color: '#e8cfa6' }}
        >
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>{state.streak}D CHUỖI</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{currentSeason.icon}</span>
            <span>MÙA {currentSeason.name}</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MIDDLE SECTION: 5 FARM AREAS IN EXACT SPECIFIED ORDER
          1. Ruộng Lúa (paddy - Từ vựng)
          2. Vườn Cây (orchard - Reading)
          3. Chăn Nuôi (pasture - Listening)
          4. Ao Hồ (pond - Speaking)
          5. Nhà Kính (greenhouse - Writing)
          ========================================================================= */}
      <div className="my-2 flex-1 flex flex-col justify-center space-y-1.5">
        
        {/* Section Header */}
        <div className="hidden sm:flex items-center gap-1.5 px-1 text-[8.5px] font-bold text-[#e8cfa6] uppercase tracking-wider">
          <i className="pixelart-icons-font-compass text-sm"></i>
          <span>7 PHÂN KHU TRẠI</span>
        </div>

        {/* 7 Area Navigation Buttons */}
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
                className={`relative w-full p-1 sm:p-1.5 border-4 border-[#45283c] transition cursor-pointer flex items-center gap-2 text-left box-border ${
                  isActive
                    ? 'rpg-btn-green'
                    : 'rpg-btn'
                }`}
                style={{
                  padding: '4px 6px'
                }}
                title={`${area.name} — ${area.skillTitle}: ${area.description}`}
              >
                {/* Fixed 48x48px (desktop) or compact slot for Area Icon */}
                <div 
                  className={`pixel-slot-48 shrink-0 ${isActive ? 'active' : ''}`}
                  style={{
                    width: '36px',
                    height: '36px',
                    minWidth: '36px',
                    minHeight: '36px'
                  }}
                >
                  <span className="text-lg">{area.icon}</span>
                </div>

                {/* Name & Skill Badge (Desktop) */}
                <div className="hidden sm:flex flex-col min-w-0 flex-1">
                  <span className={`text-[10px] truncate font-bold leading-tight ${
                    isActive ? 'text-[#ffffff]' : 'text-[#e8cfa6]'
                  }`}>
                    {area.name}
                  </span>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span 
                      className="text-[7.5px] px-1 py-0.5 border border-[#45283c] uppercase font-bold leading-none"
                      style={{
                        backgroundColor: isActive ? '#354d1f' : '#45283c',
                        color: '#e8cfa6'
                      }}
                    >
                      {area.skillName}
                    </span>
                  </div>
                </div>

                {/* Mobile Short Label */}
                <span className="sm:hidden text-[7px] text-center block w-full truncate font-bold">
                  {area.skillName.slice(0, 3)}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* =========================================================================
          BOTTOM SECTION: QUICK ACTIONS (ALMANAC, STORE, SOUND TOGGLE)
          ========================================================================= */}
      <div className="shrink-0 pt-2 border-t-4 border-[#45283c] flex items-center justify-between gap-1">
        
        {/* Morning Almanac Button */}
        {onOpenAlmanac && (
          <button
            type="button"
            onClick={onOpenAlmanac}
            className="rpg-btn flex-1 py-1 px-1 text-[8px] flex items-center justify-center gap-1 cursor-pointer"
            title="Mở Cuốn Niên Giám Học Tập Almanac"
          >
            <i className="pixelart-icons-font-book-open text-xs"></i>
            <span className="hidden sm:inline">ALMANAC</span>
          </button>
        )}

        {/* General Store Button */}
        {onOpenStore && (
          <button
            type="button"
            onClick={onOpenStore}
            className="rpg-btn flex-1 py-1 px-1 text-[8px] flex items-center justify-center gap-1 cursor-pointer"
            title="Cửa Hàng Nông Cụ & Hồi Mana"
          >
            <i className="pixelart-icons-font-shopping-bag text-xs"></i>
            <span className="hidden sm:inline">TIỆM</span>
          </button>
        )}

        {/* Retro Sound Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="rpg-btn p-1 text-[8px] shrink-0 cursor-pointer"
          title={isMuted ? 'Bật âm thanh retro' : 'Tắt âm thanh'}
        >
          {isMuted ? (
            <i className="pixelart-icons-font-volume-x text-sm"></i>
          ) : (
            <i className="pixelart-icons-font-volume-3 text-sm"></i>
          )}
        </button>

      </div>

    </aside>
  );
}