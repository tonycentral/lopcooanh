import React from 'react';
import { 
  BookOpen, 
  Target, 
  History, 
  Globe, 
  Settings, 
  Flame, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { BAND_DESCRIPTORS } from '../data/bandDescriptors';

export default function Header({ 
  targetBand, 
  onOpenBandModal, 
  onOpenHistory, 
  onOpenDeployGuide, 
  onOpenSettings,
  stats 
}) {
  const currentBandInfo = BAND_DESCRIPTORS[targetBand] || BAND_DESCRIPTORS["7.0"];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Logo & App title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                IELTS <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">WriteMaster</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Task 2 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Luyện viết câu, nâng cấp từ vựng &amp; chấm điểm Coherence
            </p>
          </div>
        </div>

        {/* Center Target Band Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBandModal}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer shadow-inner"
            title="Nhấn để đổi mục tiêu Band"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Mục tiêu Band
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                Band {targetBand}
                <span className="text-xs text-indigo-400 font-normal hidden md:inline">
                  • {currentBandInfo.level}
                </span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium ml-1">
              Đổi
            </span>
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Stats Badge */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              {stats.totalSentences} câu đã viết
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stats.targetMetCount} đạt chuẩn
            </span>
          </div>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Lịch sử chấm câu"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Deployment Guide */}
          <button
            onClick={onOpenDeployGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition cursor-pointer"
            title="Hướng dẫn đưa lên tên miền miễn phí"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Online &amp; Domain</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition cursor-pointer"
            title="Cài đặt hệ thống"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
