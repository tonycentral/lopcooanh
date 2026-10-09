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
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E7E2D9] p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img 
              src="./logo.png" 
              alt="Logo Lớp cô Oanh" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#2B2826] group-hover:text-[#4A5D4E] transition leading-none">
                Lớp cô Oanh
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3D5240] border border-[#CAD8C8]">
                {activeTask === "task1" ? "Task 1" : "Task 2"}
              </span>
            </div>
            <p className="text-[10px] text-[#7A7369] hidden md:block leading-none mt-0.5">
              Website chuyên cải thiện writing
            </p>
          </div>
        </div>

        {/* Center: Task Toggle, 1-Line Target Band & 7-Day Current Status */}
        <div className="flex items-center gap-2">
          
          {/* Welcome Navigation Button if currently in practice or flashcard mode */}
          {(currentView === 'practice' || currentView === 'flashcard') && (
            <button
              onClick={onGoWelcome}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#5A524A] hover:text-[#2B2826] transition cursor-pointer shadow-xs"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-[#4A5D4E]" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* Mode Switcher: Luyện Viết vs Flashcard */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#F0EDE6] border border-[#DDD6CB] text-xs shadow-xs">
            <button
              onClick={onGoPractice}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                currentView === 'practice'
                  ? "bg-[#4A5D4E] text-white shadow-xs"
                  : "text-[#6E675E] hover:text-[#2B2826]"
              }`}
              title="Khu vực Luyện Viết Task 1 & Task 2"
            >
              <PenTool className="w-3 h-3" />
              <span className="hidden sm:inline">Luyện Viết</span>
            </button>
            <button
              onClick={onOpenFlashcard}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                currentView === 'flashcard'
                  ? "bg-[#655243] text-white shadow-xs"
                  : "text-[#6E675E] hover:text-[#2B2826]"
              }`}
              title="Học Nhanh Từ Vựng (Flashcard Tương Tác)"
            >
              <Layers className="w-3 h-3" />
              <span>Flashcard</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#EDF3EE] text-[#3D5240] font-black border border-[#CAD8C8] hidden xs:inline">
                Smart
              </span>
            </button>
          </div>

          {/* Quick Task 1 / Task 2 Switcher */}
          {onToggleTask && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-[#F0EDE6] border border-[#DDD6CB] text-xs shadow-xs">
              <button
                onClick={() => onToggleTask("task1")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTask === "task1"
                    ? "bg-[#4A5D4E] text-white shadow-xs"
                    : "text-[#6E675E] hover:text-[#2B2826]"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Task 1</span>
              </button>
              <button
                onClick={() => onToggleTask("task2")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTask === "task2"
                    ? "bg-[#4A5D4E] text-white shadow-xs"
                    : "text-[#6E675E] hover:text-[#2B2826]"
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
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E7E2D9] hover:border-[#CAD8C8] transition cursor-pointer select-none text-xs shadow-xs"
            title="Nhấn để đổi mục tiêu Band"
          >
            <Target className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
            <span className="text-[#7A7369]">Mục tiêu:</span>
            <span className="font-bold text-[#2B2826]">Band {targetBand}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDF3EE] text-[#3D5240] font-medium ml-0.5 border border-[#CAD8C8]">
              Đổi
            </span>
          </button>

          {/* Chấm điểm hiện trạng người dùng (Trung bình 7 ngày gần nhất) */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E2D9] text-xs select-none shadow-xs"
            title="Điểm trung bình các bài đã làm trong 7 ngày gần nhất"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#B88758] shrink-0" />
            <span className="text-[#7A7369]">Hiện trạng (7 ngày):</span>
            <span className={`font-bold ${
              current7DayScore !== null
                ? parseFloat(current7DayScore) >= parseFloat(targetBand)
                  ? "text-[#3D5240]"
                  : "text-[#B88758]"
                : "text-[#A8A196]"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF3EE] hover:bg-[#E3EDE5] text-[#3D5240] border border-[#CAD8C8] text-xs font-bold transition cursor-pointer shadow-xs"
            title="Liên hệ cô Oanh học trực tiếp (Zalo 0899.488.299)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#4A5D4E]" />
            <span className="hidden sm:inline">Học với cô Oanh</span>
            <span className="text-[10px] font-mono text-[#3D5240] bg-white px-1.5 py-0.5 rounded border border-[#CAD8C8] hidden xl:inline">
              0899.488.299
            </span>
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#CAD8C8] text-xs text-[#2B2826] transition cursor-pointer shadow-xs"
                title="Tài khoản đám mây Supabase (Đã kết nối)"
              >
                <Cloud className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
                <span className="font-semibold text-[#3D5240] max-w-[120px] sm:max-w-[160px] truncate">
                  {currentUser?.user_metadata?.full_name || currentUser?.email}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D4E]" title="Đã đồng bộ đám mây" />
              </button>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1.5 sm:p-2 rounded-xl text-[#7A7369] hover:text-[#B95C48] hover:bg-[#F2EFE9] transition cursor-pointer"
                  title="Đăng xuất tài khoản"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs transition shadow-xs cursor-pointer active:scale-95 shrink-0"
              title="Đăng nhập / Đăng ký để đồng bộ bài viết và từ vựng"
            >
              <User className="w-3.5 h-3.5" />
              <span className="font-bold">Đăng Nhập</span>
            </button>
          )}

          {/* Sources Databank Modal Button */}
          {onOpenSources && (
            <button
              onClick={onOpenSources}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E7E2D9] text-xs text-[#5A524A] hover:text-[#2B2826] transition cursor-pointer shadow-xs"
              title="Kho đề thi & Nguồn bổ sung chủ đề (Cambridge, Simon, AWL)"
            >
              <Database className="w-3.5 h-3.5 text-[#4A5D4E]" />
              <span className="font-semibold hidden lg:inline">Nguồn Cambridge</span>
            </button>
          )}

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:p-2.5 rounded-xl text-[#6E675E] hover:text-[#2B2826] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7E2D9] transition cursor-pointer"
            title="Lịch sử chấm câu"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>

      </div>
    </header>
  );
}
