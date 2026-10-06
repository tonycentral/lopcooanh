import React from 'react';
import { 
  Target, 
  History, 
  TrendingUp,
  PhoneCall,
  Home,
  FileText,
  BarChart3,
  Mail
} from 'lucide-react';

export default function Header({ 
  targetBand, 
  current7DayScore,
  onOpenBandModal, 
  onOpenHistory, 
  onOpenContact,
  onChangeEmail,
  onGoWelcome,
  studentEmail,
  activeTask,
  onToggleTask,
  currentView
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md shrink-0">
      <div className="w-full px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
        
        {/* Logo & App title - Clickable to return to Welcome Page */}
        <div 
          onClick={onGoWelcome}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          title="Về Trang Chào Mừng Lớp Cô Oanh"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/40 p-0.5 flex items-center justify-center shadow-md shadow-blue-950/40 group-hover:scale-105 transition-transform shrink-0 overflow-hidden bg-slate-950">
            <img 
              src="./logo.png" 
              alt="Logo Lớp cô Oanh" 
              className="w-full h-full object-contain drop-shadow" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-300 transition leading-none">
                Lớp cô Oanh
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {activeTask === "task1" ? "Task 1" : "Task 2"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block leading-none mt-0.5">
              Website chuyên cải thiện writing
            </p>
          </div>
        </div>

        {/* Center: Task Toggle, 1-Line Target Band & 7-Day Current Status */}
        <div className="flex items-center gap-2">
          
          {/* Welcome Navigation Button if currently in practice mode */}
          {currentView === 'practice' && (
            <button
              onClick={onGoWelcome}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* Quick Task 1 / Task 2 Switcher */}
          {onToggleTask && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <button
                onClick={() => onToggleTask("task1")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTask === "task1"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Task 1</span>
              </button>
              <button
                onClick={() => onToggleTask("task2")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTask === "task2"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200"
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
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer select-none text-xs"
            title="Nhấn để đổi mục tiêu Band"
          >
            <Target className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-slate-400">Mục tiêu:</span>
            <span className="font-bold text-white">Band {targetBand}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium ml-0.5">
              Đổi
            </span>
          </button>

          {/* Chấm điểm hiện trạng người dùng (Trung bình 7 ngày gần nhất) */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs select-none"
            title="Điểm trung bình các bài đã làm trong 7 ngày gần nhất"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400">Hiện trạng (7 ngày):</span>
            <span className={`font-bold ${
              current7DayScore !== null
                ? parseFloat(current7DayScore) >= parseFloat(targetBand)
                  ? "text-emerald-400"
                  : "text-amber-400"
                : "text-slate-500"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
            title="Liên hệ cô Oanh học trực tiếp (Zalo 0899.488.299)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Học với cô Oanh</span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded hidden xl:inline">
              0899.488.299
            </span>
          </button>

          {/* Student Email / Switcher */}
          {studentEmail && (
            <button
              onClick={onChangeEmail}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
              title="Đổi địa chỉ email học viên"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium hidden md:inline max-w-[130px] truncate">
                {studentEmail}
              </span>
            </button>
          )}

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Lịch sử chấm câu"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

        </div>

      </div>
    </header>
  );
}
