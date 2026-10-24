import React, { useState, useRef, useEffect } from 'react';
import { 
  Target, 
  FileText, 
  BarChart3, 
  ChevronDown, 
  User, 
  Cloud, 
  LogOut,
  Settings, 
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';

export default function Header({ 
  targetBand, 
  current7DayScore,
  onOpenBandModal, 
  onGoWelcome,
  currentUser,
  onOpenAuth,
  onOpenSettings,
  onSignOut,
  studentEmail,
  activeTask,
  onToggleTask,
  currentView,
  isMobile = false,
  isSidebarCollapsed = false,
  onToggleSidebar
}) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Close account menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate progress towards target band
  const targetNum = parseFloat(targetBand) || 7.0;
  const currentNum = current7DayScore !== null ? current7DayScore : 0;
  const progressPercent = Math.min(100, Math.round((currentNum / targetNum) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#E6E2D8] shadow-[0_1px_3px_rgba(0,0,0,0.03)] shrink-0">
      <div className="w-full px-2.5 sm:px-5 h-14 flex items-center justify-between gap-2">
        
        {/* Left Section: Sidebar Toggle (Desktop) / Brand Logo (Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {!isMobile && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded-xl bg-white border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs shrink-0"
              title={isSidebarCollapsed ? "Mở rộng thanh menu bên trái" : "Thu gọn thanh menu bên trái"}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-4 h-4 text-[#3E4F42]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Logo on mobile */}
          {isMobile && (
            <div 
              onClick={onGoWelcome}
              className="flex items-center gap-1.5 cursor-pointer group select-none shrink-0"
              title="Trang chủ MochiFarm"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img 
                  src="./logo.png" 
                  alt="Logo MochiFarm" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-title font-bold text-sm text-[#24211E] leading-none">
                MochiFarm
              </span>
            </div>
          )}
        </div>

        {/* Center: Contextual Controls (e.g. Task 1 / Task 2 Pill when in 1.4 Full Essay) */}
        <div className="flex items-center gap-2 min-w-0">
          {currentView === 'farm' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs">
              <span>🌾</span>
              <span>Nông Trại Tri Thức</span>
            </div>
          )}

          {currentView === 'full_essay' && onToggleTask && (
            <div className="flex items-center p-0.5 rounded-xl bg-white border border-[#E6E2D8] text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => onToggleTask('task1')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTask === 'task1'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "text-[#7A7369] hover:text-[#24211E]"
                }`}
                title="Dạng đề Task 1: Báo cáo số liệu biểu đồ"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Task 1 (Biểu đồ)</span>
                <span className="sm:hidden">Task 1</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTask('task2')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTask === 'task2'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "text-[#7A7369] hover:text-[#24211E]"
                }`}
                title="Dạng đề Task 2: Bài luận nghị luận"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Task 2 (Bài luận)</span>
                <span className="sm:hidden">Task 2</span>
              </button>
            </div>
          )}

          {/* Progress Band Widget */}
          <div 
            onClick={onOpenBandModal}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 transition cursor-pointer select-none text-xs shadow-2xs group shrink-0"
            title={`Tiến độ Band: Hiện tại ${current7DayScore !== null ? current7DayScore.toFixed(1) : '--'} / Mục tiêu ${targetBand}. Nhấn để đổi Band mục tiêu.`}
          >
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#3E4F42] shrink-0 group-hover:scale-105 transition-transform" />
              <span className="text-[#7A7369] hidden md:inline">Tiến độ:</span>
              <span className="font-semibold text-[#24211E]">
                <span className="hidden sm:inline">{current7DayScore !== null ? current7DayScore.toFixed(1) : '--'}</span>
                <span className="text-[#7A7369] font-normal mx-0.5 hidden sm:inline">/</span>
                <span>{targetBand}</span>
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="hidden sm:block w-12 sm:w-16 h-1.5 bg-[#F4EFEA] rounded-full overflow-hidden border border-[#E6E2D8]">
              <div 
                className="h-full bg-[#3E4F42] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {current7DayScore !== null && (
              <span className="text-[10px] font-mono text-[#7A7369] hidden lg:inline">
                {progressPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right Area: User Account Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-xs text-[#24211E] transition cursor-pointer shadow-2xs select-none"
                title="Tài khoản & Cài đặt"
              >
                <div className="w-5 h-5 rounded-lg bg-[#3E4F42] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {(currentUser?.user_metadata?.full_name || studentEmail || "H").charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-[#24211E] hidden sm:inline max-w-[110px] sm:max-w-[140px] truncate">
                  {currentUser?.user_metadata?.full_name || currentUser?.email}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#7A7369] transition-transform duration-200 ${isAccountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-64 bg-white border border-[#E6E2D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 duration-150">
                  {/* Account Header */}
                  <div className="px-3 py-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] mb-1.5">
                    <div className="font-bold text-xs text-[#24211E] truncate">
                      {currentUser?.user_metadata?.full_name || "Học viên"}
                    </div>
                    <div className="text-[11px] text-[#7A7369] truncate">
                      {currentUser?.email || studentEmail}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3E4F42] mt-1.5">
                      <Cloud className="w-3 h-3" />
                      <span>Đã kết nối đám mây Supabase</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#24211E] hover:bg-[#FAF8F5] hover:text-[#3E4F42] transition cursor-pointer font-medium"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#24211E]">Cài đặt tài khoản &amp; AI</div>
                        <div className="text-[10px] text-[#7A7369]">Hồ sơ, Gemini Key, Dữ liệu</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        if (onOpenBandModal) onOpenBandModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#24211E] hover:bg-[#FAF8F5] transition cursor-pointer font-medium"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>Mục tiêu: <strong className="text-[#3E4F42]">Band {targetBand}</strong></div>
                        <div className="text-[10px] text-[#7A7369]">Chỉnh sửa mục tiêu điểm số</div>
                      </div>
                    </button>

                    <div className="h-px bg-[#E6E2D8] my-1" />

                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-[#A67C52] hover:bg-[#FAF5EE] transition cursor-pointer font-semibold"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer shadow-xs shrink-0"
              title="Đăng nhập"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
