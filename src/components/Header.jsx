import React from 'react';
import { 
  BookOpen, 
  Target, 
  History, 
  Globe, 
  Settings, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  User,
  Home,
  FileText,
  BarChart3
} from 'lucide-react';
import { BAND_DESCRIPTORS } from '../data/bandDescriptors';

export default function Header({ 
  targetBand, 
  onOpenBandModal, 
  onOpenHistory, 
  onOpenDeployGuide, 
  onOpenSettings,
  onOpenContact,
  onOpenUserModal,
  onGoWelcome,
  currentUser,
  activeTask,
  onToggleTask,
  currentView,
  stats 
}) {
  const currentBandInfo = BAND_DESCRIPTORS[targetBand] || BAND_DESCRIPTORS["7.0"];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        
        {/* Logo & App title - Clickable to return to Welcome Page */}
        <div 
          onClick={onGoWelcome}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          title="Về Trang Chào Mừng Lớp Cô Oanh"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-indigo-300 transition">
                Lớp cô Oanh
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {activeTask === "task1" ? "Task 1" : "Task 2"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Website chuyên cải thiện writing
            </p>
          </div>
        </div>

        {/* Center: Band Selector & Task Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Welcome Navigation Button if currently in practice mode */}
          {currentView === 'practice' && (
            <button
              onClick={onGoWelcome}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              title="Quay lại Trang Chào Mừng"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trang chủ</span>
            </button>
          )}

          {/* Quick Task 1 / Task 2 Switcher */}
          {onToggleTask && (
            <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <button
                onClick={() => onToggleTask("task1")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeTask === "task1"
                    ? "bg-indigo-600 text-white shadow-sm"
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
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Task 2</span>
              </button>
            </div>
          )}

          {/* Target Band Pill */}
          <button
            onClick={onOpenBandModal}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer shadow-inner"
            title="Nhấn để đổi mục tiêu Band"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                Mục tiêu
              </div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                Band {targetBand}
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium ml-0.5 hidden sm:inline">
              Đổi
            </span>
          </button>
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

          {/* User profile / Switcher */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
            title="Đổi tài khoản học viên"
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentUser?.avatarColor || "from-indigo-500 to-purple-600"} flex items-center justify-center text-white font-bold text-[10px]`}>
              {currentUser?.name?.slice(0, 2).toUpperCase() || "HV"}
            </div>
            <span className="font-semibold hidden md:inline max-w-[100px] truncate">
              {currentUser?.name || "Học viên"}
            </span>
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Lịch sử chấm câu"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Deployment Guide */}
          <button
            onClick={onOpenDeployGuide}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition cursor-pointer"
            title="Hướng dẫn đưa lên tên miền miễn phí"
          >
            <Globe className="w-4 h-4" />
            <span>Online</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Cài đặt hệ thống"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
