import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  PhoneCall, 
  Layers, 
  User, 
  Cloud, 
  LogOut 
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';

export default function WelcomePage({ 
  onStartPractice, 
  onStartFullEssay,
  onStartFlashcard,
  onOpenContactModal,
  onChangeEmail,
  onOpenAuth,
  onOpenSettings,
  onSignOut,
  currentUser,
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#24211E] flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img src="./logo.png" alt="Logo Lớp cô Oanh" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base text-[#24211E] leading-tight">Lớp cô Oanh</div>
          </div>
        </div>

        {/* Student Email / Login Button */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings || onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] transition cursor-pointer max-w-[220px] shadow-xs"
              title="Cài đặt tài khoản & AI"
            >
              <Cloud className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
              <span className="font-medium text-[#3E4F42] truncate">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E4F42]" />
            </button>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#A67C52] hover:bg-[#F4EFEA] transition cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition shadow-xs cursor-pointer active:scale-95"
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
        )}
      </header>

      {/* Main Minimalist Center Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8 space-y-6">
        
        {/* Title & Mascot Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[#E6E2D8] p-2 shadow-xs flex items-center justify-center">
              <img 
                src="./logo.png" 
                alt="Logo Mascot" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#24211E] tracking-tight">
            Lớp cô Oanh
          </h1>
          {justSaved && (
            <p className="text-xs text-[#3E4F42] font-medium">
              ✓ Đã lưu cài đặt
            </p>
          )}
        </div>

        {/* Minimalist Card */}
        <div className="bg-white border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          
          {/* Cloud Account Prompt Card */}
          {currentUser ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#EDF3EE] border border-[#3E4F42]/20 text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#3E4F42] shrink-0" />
                <span className="text-[#24211E]">
                  Tài khoản: <strong>{currentUser?.user_metadata?.full_name || currentUser?.email}</strong>
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#3E4F42] bg-white px-2 py-0.5 rounded-full border border-[#3E4F42]/20">
                Đã đồng bộ
              </span>
            </div>
          ) : (
            <div 
              onClick={onOpenAuth}
              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E6E2D8] transition cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#24211E] group-hover:text-[#3E4F42] transition">
                    Đăng nhập tài khoản
                  </div>
                  <div className="text-[11px] text-[#7A7369]">
                    Lưu lịch sử bài viết & đồng bộ từ vựng đã nhớ
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-[#3E4F42] group-hover:translate-x-0.5 transition shrink-0 ml-2">
                Đăng nhập &rarr;
              </span>
            </div>
          )}

          {/* Thanh Bar Chọn Band */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#7A7369]">Mục tiêu:</span>
              <span className="font-semibold text-[#3E4F42]">Band {targetBand}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8]">
              {BAND_OPTIONS.map((band) => {
                const isSelected = band === targetBand;
                return (
                  <button
                    key={band}
                    onClick={() => handleSelectBand(band)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-medium transition cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#3E4F42] text-white shadow-xs"
                        : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                    }`}
                  >
                    {band}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút Chọn Task 1 hoặc Task 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#7A7369]">Phần luyện tập:</span>
              <span className="font-semibold text-[#3E4F42]">{selectedTask === "task1" ? "Task 1" : selectedTask === "vocab" ? "Từ vựng" : "Task 2"}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => handleSelectTask("task1")}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedTask === "task1"
                    ? "bg-[#3E4F42] text-white shadow-xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
              >
                {selectedTask === "task1" && <Check className="w-3.5 h-3.5" />}
                <span>Task 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTask("task2")}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedTask === "task2"
                    ? "bg-[#3E4F42] text-white shadow-xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
              >
                {selectedTask === "task2" && <Check className="w-3.5 h-3.5" />}
                <span>Task 2</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTask("vocab")}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  selectedTask === "vocab"
                    ? "bg-[#3E4F42] text-white shadow-xs"
                    : "text-[#7A7369] hover:text-[#24211E] hover:bg-white"
                }`}
              >
                {selectedTask === "vocab" && <Check className="w-3.5 h-3.5" />}
                <span>Từ vựng</span>
              </button>
            </div>
          </div>

          {/* Nút Bắt Đầu Luyện Tập & Học Nhanh Flashcard */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                  return;
                }
                onStartPractice();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>📚 Học từ vựng (Luyện câu &amp; đoạn • Band {targetBand})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onStartFullEssay && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  onStartFullEssay();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#D1DDD3] font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-2xs"
              >
                <span>✍️ Luyện viết toàn bộ ({selectedTask === "task1" ? "Task 1 Report" : "Task 2 Essay"})</span>
                <ArrowRight className="w-4 h-4 text-[#3E4F42]" />
              </button>
            )}

            {onStartFlashcard && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  onStartFlashcard();
                }}
                className="w-full py-2 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Layers className="w-3.5 h-3.5 text-[#3E4F42]" />
                <span>🗂️ Ôn tập từ vựng qua Flashcard</span>
              </button>
            )}
          </div>

        </div>

        {/* Nút Liên Hệ Cô Oanh Để Học Trực Tiếp */}
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#3E4F42] border border-[#3E4F42]/30 text-xs sm:text-sm font-medium transition cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Liên hệ cô Oanh để học trực tiếp ({formattedPhone})</span>
          </button>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-[#7A7369]">
        Lớp cô Oanh • Hotline/Zalo: {formattedPhone}
      </footer>

    </div>
  );
}
