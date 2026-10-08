import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  PhoneCall, 
  Mail,
  Layers,
  User,
  Cloud,
  LogOut
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';

export default function WelcomePage({ 
  onStartPractice, 
  onStartFlashcard,
  onOpenContactModal,
  onChangeEmail,
  onOpenAuth,
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
    <div className="min-h-screen bg-[#F8F6F1] text-[#2B2826] flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E7E2D9] p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
            <img src="./logo.png" alt="Logo Lớp cô Oanh" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-[#2B2826] leading-tight">Lớp cô Oanh</div>
            <div className="text-[11px] text-[#7A7369]">Website chuyên cải thiện writing</div>
          </div>
        </div>

        {/* Student Email / Login Button */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#CAD8C8] text-xs text-[#2B2826] transition cursor-pointer max-w-[220px] shadow-sm"
              title="Tài khoản đám mây Supabase (Đã kết nối)"
            >
              <Cloud className="w-3.5 h-3.5 text-[#4A5D4E] shrink-0" />
              <span className="font-semibold text-[#3D5240] truncate">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D4E]" />
            </button>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#B95C48] hover:bg-[#F2EFE9] transition cursor-pointer"
                title="Đăng xuất tài khoản"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs transition shadow-sm cursor-pointer active:scale-95"
            title="Đăng nhập hoặc đăng ký tài khoản để đồng bộ tiến độ"
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng Nhập / Đăng Ký</span>
          </button>
        )}
      </header>

      {/* Main Minimalist Center Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8 space-y-6">
        
        {/* Title & Mascot Logo */}
        <div className="text-center space-y-2">
          {/* American Mascot Badge */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-[#E7E2D9] p-2 shadow-sm flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <img 
                src="./logo.png" 
                alt="Logo Mascot" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2826] tracking-tight">
            Lớp cô Oanh
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5D4E] font-bold uppercase tracking-wider">
            Website chuyên cải thiện writing • Chuẩn học thuật
          </p>
          {justSaved && (
            <p className="text-[11px] text-[#3D5240] font-medium pt-1">
              ✓ Đã lưu cài đặt cho {studentEmail}
            </p>
          )}
        </div>

        {/* Minimalist Card */}
        <div className="bg-white border border-[#E7E2D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          
          {/* Cloud Account Prompt Card */}
          {currentUser ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EDF3EE] border border-[#CAD8C8] text-xs">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#4A5D4E] shrink-0" />
                <span className="text-[#4A443E]">
                  Tài khoản: <strong className="text-[#2B2826]">{currentUser?.user_metadata?.full_name || currentUser?.email}</strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#3D5240] bg-[#DCE9DD] px-2 py-0.5 rounded-full border border-[#C5D8C7]">
                ☁️ Đã đồng bộ
              </span>
            </div>
          ) : (
            <div 
              onClick={onOpenAuth}
              className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-[#E7E2D9] hover:border-[#CAD8C8] transition cursor-pointer group shadow-sm"
              title="Nhấn để đăng nhập hoặc tạo tài khoản miễn phí"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDF3EE] text-[#4A5D4E] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#2B2826] group-hover:text-[#4A5D4E] transition flex items-center gap-1.5">
                    <span>Đăng nhập tài khoản học viên</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EFECE5] text-[#5A524A] font-medium">0đ Miễn phí</span>
                  </div>
                  <div className="text-[11px] text-[#7A7369]">
                    Lưu lịch sử bài viết & đồng bộ từ vựng đã nhớ giữa máy tính và điện thoại
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4A5D4E] group-hover:translate-x-0.5 transition shrink-0 ml-2">
                Đăng nhập &rarr;
              </span>
            </div>
          )}

          {/* Thanh Bar Chọn Band */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#5A534B]">Chọn Band:</span>
              <span className="font-bold text-[#4A5D4E]">Band {targetBand}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 p-1 bg-[#F2EFE9] rounded-2xl border border-[#DDD6CB]">
              {BAND_OPTIONS.map((band) => {
                const isSelected = band === targetBand;
                return (
                  <button
                    key={band}
                    onClick={() => handleSelectBand(band)}
                    className={`py-2.5 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#4A5D4E] text-white shadow-sm"
                        : "text-[#6E675E] hover:text-[#2B2826] hover:bg-white/60"
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
              <span className="font-semibold text-[#5A534B]">Chọn Task:</span>
              <span className="font-bold text-[#4A5D4E]">{selectedTask === "task1" ? "Task 1" : "Task 2"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F2EFE9] rounded-2xl border border-[#DDD6CB]">
              <button
                type="button"
                onClick={() => handleSelectTask("task1")}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task1"
                    ? "bg-[#4A5D4E] text-white shadow-sm"
                    : "text-[#6E675E] hover:text-[#2B2826] hover:bg-white/60"
                }`}
              >
                {selectedTask === "task1" && <Check className="w-3.5 h-3.5" />}
                <span>Task 1</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTask("task2")}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedTask === "task2"
                    ? "bg-[#4A5D4E] text-white shadow-sm"
                    : "text-[#6E675E] hover:text-[#2B2826] hover:bg-white/60"
                }`}
              >
                {selectedTask === "task2" && <Check className="w-3.5 h-3.5" />}
                <span>Task 2</span>
              </button>
            </div>
          </div>

          {/* Nút Bắt Đầu Luyện Tập & Học Nhanh Flashcard */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                  return;
                }
                onStartPractice();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Luyện viết câu (Band {targetBand} • {selectedTask === "task1" ? "Task 1" : "Task 2"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

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
                className="w-full py-3 px-4 rounded-2xl bg-[#655243] hover:bg-[#544436] text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Layers className="w-4 h-4" />
                <span>Học nhanh Flashcard phản xạ từ vựng</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                  Mới
                </span>
              </button>
            )}
          </div>

        </div>

        {/* Nút Liên Hệ Cô Oanh Để Học Trực Tiếp */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenContactModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white hover:bg-[#FAF8F5] text-[#3D5240] border border-[#CAD8C8] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-[#4A5D4E]" />
            <span>Liên hệ cô Oanh để học trực tiếp (Zalo: {formattedPhone})</span>
          </button>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-[#968E84]">
        Lớp cô Oanh - website chuyên cải thiện writing • Hotline/Zalo: {formattedPhone}
      </footer>

    </div>
  );
}
