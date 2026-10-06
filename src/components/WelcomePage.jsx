import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  PhoneCall, 
  Mail, 
  BookOpen 
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';

export default function WelcomePage({ 
  onStartPractice, 
  onOpenContactModal,
  onChangeEmail,
  studentEmail,
  targetBand = "7.0",
  selectedTask = "task2",
  onSettingsChange
}) {
  const [justSaved, setJustSaved] = useState(false);

  const handleSelectBand = (band) => {
    if (onSettingsChange) {
      onSettingsChange({ targetBand: band, selectedTask });
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleSelectTask = (task) => {
    if (onSettingsChange) {
      onSettingsChange({ targetBand, selectedTask: task });
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const formattedPhone = "0899.488.299";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base text-white leading-tight">Lớp cô Oanh</div>
            <div className="text-[11px] text-slate-400">website chuyên cải thiện writing</div>
          </div>
        </div>

        {/* Student Email Display & Switcher */}
        {studentEmail && (
          <button
            onClick={onChangeEmail}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer max-w-[220px]"
            title="Đổi địa chỉ email học viên"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{studentEmail}</span>
            <span className="text-[10px] text-slate-500 shrink-0">• Đổi</span>
          </button>
        )}
      </header>

      {/* Main Minimalist Center Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-10 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Lớp cô Oanh
          </h1>
          <p className="text-xs sm:text-sm text-indigo-400 font-medium">
            website chuyên cải thiện writing
          </p>
          {justSaved && (
            <p className="text-[11px] text-emerald-400 font-medium pt-1 animate-pulse">
              ✓ Đã lưu cài đặt cho {studentEmail}
            </p>
          )}
        </div>

        {/* Minimalist Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Thanh Bar Chọn Band */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Chọn Band:</span>
              <span className="font-bold text-indigo-400">Band {targetBand}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
              {BAND_OPTIONS.map((band) => {
                const isSelected = band === targetBand;
                return (
                  <button
                    key={band}
                    onClick={() => handleSelectBand(band)}
                    className={`py-2.5 px-1 text-center rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {band}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút Chọn Task 1 hoặc Task 2 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Chọn Task:</span>
              <span className="font-bold text-purple-400">{selectedTask === "task1" ? "Task 1" : "Task 2"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => handleSelectTask("task1")}
                className={`py-3 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task1"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {selectedTask === "task1" && <Check className="w-3.5 h-3.5" />}
                <span>Task 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTask("task2")}
                className={`py-3 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task2"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {selectedTask === "task2" && <Check className="w-3.5 h-3.5" />}
                <span>Task 2</span>
              </button>
            </div>
          </div>

          {/* Nút Bắt Đầu Luyện Tập */}
          <button
            type="button"
            onClick={onStartPractice}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Bắt đầu luyện tập (Band {targetBand} • {selectedTask === "task1" ? "Task 1" : "Task 2"})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Nút Liên Hệ Cô Oanh Để Học Trực Tiếp */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Liên hệ cô Oanh để học trực tiếp (Zalo: {formattedPhone})</span>
          </button>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-500">
        Lớp cô Oanh - website chuyên cải thiện writing • Hotline/Zalo: {formattedPhone}
      </footer>

    </div>
  );
}
