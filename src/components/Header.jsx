import { 
  Target, 
  History, 
  TrendingUp,
  PhoneCall,
  Home,
  FileText,
  BarChart3,
  Mail,
  Layers,
  Sparkles,
  PenTool,
  Database,
  User,
  Cloud,
  LogOut
} from 'lucide-react';

export default function Header({ 
  targetBand, 
  current7DayScore,
  onOpenBandModal, 
  onOpenHistory, 
  onOpenContact,
  onOpenSources,
  onChangeEmail,
  onGoWelcome,
  onOpenFlashcard,
  onGoPractice,
  currentUser,
  onOpenAuth,
  onSignOut,
  studentEmail,
  activeTask,
  onToggleTask,
  currentView
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#E7E2D9] shadow-[0_1px_3px_rgba(0,0,0,0.03)] shrink-0">
      <div className="w-full px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
        
        {/* Logo & App title - Clickable to return to Welcome Page */}
        <div 
          onClick={onGoWelcome}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          title="Về Trang Chào Mừng Lớp Cô Oanh"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img 
              src="./logo.png" 
              alt="Logo Lớp cô Oanh" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base sm:text-lg text-[#24211E] group-hover:text-[#3E4F42] transition leading-none">
              Lớp cô Oanh
            </span>
            <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D3DFD5]">
              {activeTask === "task1" ? "Task 1" : "Task 2"}
            </span>
          </div>
        </div>

        {/* Center: Mode Switcher, Quick Task Switcher, Band Target */}
        <div className="flex items-center gap-2">
          
          {/* Welcome Navigation Button if currently in practice or flashcard mode */}
          {(currentView === 'practice' || currentView === 'flashcard') && (
            <button
              onClick={onGoWelcome}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-medium text-[#6B6358] hover:text-[#24211E] transition cursor-pointer"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* Mode Switcher: Luyện Viết vs Flashcard */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
            <button
              onClick={onGoPractice}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'practice'
                  ? "bg-[#3E4F42] text-white shadow-xs"
                  : "text-[#6B6358] hover:text-[#24211E]"
              }`}
              title="Khu vực Luyện Viết"
            >
              <PenTool className="w-3 h-3" />
              <span className="hidden sm:inline">Luyện Viết</span>
            </button>
            <button
              onClick={onOpenFlashcard}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                currentView === 'flashcard'
                  ? "bg-[#3E4F42] text-white shadow-xs"
                  : "text-[#6B6358] hover:text-[#24211E]"
              }`}
              title="Flashcard Từ Vựng"
            >
              <Layers className="w-3 h-3" />
              <span>Flashcard</span>
            </button>
          </div>

          {/* Quick Task 1 / Task 2 Switcher */}
          {onToggleTask && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs">
              <button
                onClick={() => onToggleTask("task1")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeTask === "task1"
                    ? "bg-[#3E4F42] text-white shadow-xs"
                    : "text-[#6B6358] hover:text-[#24211E]"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Task 1</span>
              </button>
              <button
                onClick={() => onToggleTask("task2")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeTask === "task2"
                    ? "bg-[#3E4F42] text-white shadow-xs"
                    : "text-[#6B6358] hover:text-[#24211E]"
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Task 2</span>
              </button>
            </div>
          )}

          {/* 1-Line Target Band Button */}
          <button
            onClick={onOpenBandModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#D3DFD5] transition cursor-pointer select-none text-xs"
            title="Đổi Band mục tiêu"
          >
            <Target className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
            <span className="text-[#7A7369]">Mục tiêu:</span>
            <span className="font-semibold text-[#24211E]">Band {targetBand}</span>
          </button>

          {/* Chấm điểm hiện trạng người dùng */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6E2D8] text-xs select-none"
            title="Điểm trung bình 7 ngày qua"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
            <span className="text-[#7A7369]">7 ngày:</span>
            <span className={`font-semibold ${
              current7DayScore !== null ? "text-[#3E4F42]" : "text-[#7A7369]"
            }`}>
              {current7DayScore !== null ? `Band ${current7DayScore.toFixed(1)}` : "--"}
            </span>
          </div>

        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Contact cô Oanh button */}
          <button
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#3E4F42] border border-[#D3DFD5] text-xs font-medium transition cursor-pointer"
            title="Liên hệ cô Oanh"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#3E4F42]" />
            <span>Liên hệ</span>
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer"
                title="Tài khoản học viên"
              >
                <Cloud className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
                <span className="font-medium text-[#24211E] max-w-[120px] sm:max-w-[160px] truncate">
                  {currentUser?.user_metadata?.full_name || currentUser?.email}
                </span>
              </button>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#C25442] hover:bg-[#FAF8F5] transition cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#324036] text-white font-medium text-xs transition cursor-pointer shadow-xs shrink-0"
              title="Đăng nhập"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}

          {/* Sources Databank Modal Button */}
          {onOpenSources && (
            <button
              onClick={onOpenSources}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#6B6358] hover:text-[#24211E] transition cursor-pointer"
              title="Tài liệu tham khảo"
            >
              <Database className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span className="hidden lg:inline">Tài liệu</span>
            </button>
          )}

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:p-2.5 rounded-xl text-[#6B6358] hover:text-[#24211E] hover:bg-white border border-transparent hover:border-[#E6E2D8] transition cursor-pointer"
            title="Lịch sử bài viết"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>

      </div>
    </header>
  );
}
