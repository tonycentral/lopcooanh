import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  PhoneCall, 
  Layers, 
  User, 
  Cloud, 
  LogOut,
  RotateCcw
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';
import { getLastActiveLocation, formatLocationLabel } from '../services/userService';

export default function WelcomePage({ 
  onStartPractice, 
  onStartFullEssay,
  onStartFlashcard,
  onStartReading,
  onResumeLastLocation,
  onOpenContactModal,
  onChangeEmail,
  onOpenAuth,
  onOpenSettings,
  onSignOut,
  currentUser,
  studentEmail,
  targetBand = "7.0",
  selectedTask = "task2",
  onSettingsChange,
  isMobile = false,
  hasSidebar = false
}) {
  const [justSaved, setJustSaved] = useState(false);
  const lastActiveLocation = getLastActiveLocation(studentEmail);

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

  // GIAO DIỆN ĐIỆN THOẠI: 100% KHÔNG CUỘN TRANG (SINGLE-SCREEN NO-SCROLL)
  if (isMobile) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-3.5 bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
        {/* Top Header */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E6E2D8] p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <img src="./logo.png" alt="Logo Lớp cô Oanh" className="w-full h-full object-contain" />
            </div>
            <span className="font-title font-bold text-base text-[#24211E]">Lớp cô Oanh</span>
          </div>

          {currentUser ? (
            <button
              onClick={onOpenSettings || onOpenAuth}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#E6E2D8] text-xs font-semibold text-[#3E4F42] shadow-2xs cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#3E4F42] text-white flex items-center justify-center text-[9px] font-bold">
                {(currentUser?.user_metadata?.full_name || studentEmail || "H").charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[110px] truncate">{currentUser?.user_metadata?.full_name || currentUser?.email}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3E4F42] text-white text-xs font-semibold shadow-xs cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}
        </header>

        {/* Center Main Stage (Fits completely on screen without scroll) */}
        <main className="flex-1 min-h-0 flex flex-col justify-center gap-2.5 my-auto max-w-sm mx-auto w-full">
          {/* Logo & Slogan */}
          <div className="text-center space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E6E2D8] p-1.5 shadow-xs mx-auto flex items-center justify-center">
              <img src="./logo.png" alt="Logo Mascot" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-title font-bold text-[#24211E]">Lớp cô Oanh</h1>
            <p className="text-xs text-[#7A7369]">Luyện từ vựng IELTS &amp; Flashcards phản xạ</p>
          </div>

          {/* Target Band Pill */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#7A7369]">Mục tiêu:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/30 text-xs font-bold font-mono">
              Band {targetBand}
            </span>
          </div>

          {/* Resume Last Session (if any) */}
          {lastActiveLocation && lastActiveLocation.view && (
            <button
              type="button"
              onClick={() => {
                if (!currentUser) { onOpenAuth(); return; }
                if (onResumeLastLocation) onResumeLastLocation(lastActiveLocation);
                else onStartPractice();
              }}
              className="w-full py-2.5 px-3.5 rounded-2xl bg-[#3E4F42] text-white text-xs font-semibold shadow-sm flex items-center justify-between gap-2 border border-[#2D3A30] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <RotateCcw className="w-4 h-4 text-[#C2DDC8] shrink-0" />
                <span className="truncate">Tiếp tục: {formatLocationLabel(lastActiveLocation)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C2DDC8] shrink-0" />
            </button>
          )}

          {/* TWO PRIMARY MOBILE ACTION CARDS */}
          <div className="space-y-2">
            {/* 1. Luyện Từ Vựng */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) { onOpenAuth(); return; }
                onStartPractice();
              }}
              className="w-full p-3 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#D1DDD3] text-left shadow-xs transition active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#24211E] group-hover:text-[#3E4F42] transition">
                    📚 Luyện Từ Vựng
                  </div>
                  <div className="text-[11px] text-[#7A7369]">
                    10 chủ đề, collocations &amp; phát âm C1-C2
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#3E4F42] shrink-0" />
            </button>

            {/* 2. Flashcards */}
            {onStartFlashcard && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) { onOpenAuth(); return; }
                  onStartFlashcard();
                }}
                className="w-full p-3 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#D1DDD3] text-left shadow-xs transition active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] text-[#A67C52] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#24211E] group-hover:text-[#3E4F42] transition">
                      🗂️ Flashcards Phản Xạ
                    </div>
                    <div className="text-[11px] text-[#7A7369]">
                      Lật thẻ nhớ, trắc nghiệm phản xạ, nối từ
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A67C52] shrink-0" />
              </button>
            )}
          </div>

          {/* Desktop note */}
          <div className="text-center pt-0.5">
            <p className="text-[10px] text-[#7A7369]">
              💻 Luyện Viết bài (1.2-1.4) &amp; Đề Reading tối ưu trên Máy tính
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-[11px] text-[#7A7369] shrink-0 pt-0.5">
          Hotline/Zalo: <a href="tel:0899488299" className="font-semibold text-[#3E4F42] underline">0899.488.299</a>
        </footer>
      </div>
    );
  }

  return (
    <div className={`${hasSidebar ? "h-full overflow-y-auto" : "min-h-screen"} bg-[#F8F6F1] text-[#24211E] flex flex-col justify-between p-4 sm:p-6 font-sans`}>
      
      {/* Top Header (Chỉ hiện khi chưa có Sidebar bên trái để tránh trùng lặp) */}
      {!hasSidebar && (
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
      )}

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

          <h1 className="text-2xl sm:text-3xl font-title font-bold text-[#24211E] tracking-tight">
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
            
            {/* Nút Tiếp Tục Bài Học Dở Dang (Nếu có phiên học trước đó) */}
            {lastActiveLocation && lastActiveLocation.view && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  if (onResumeLastLocation) {
                    onResumeLastLocation(lastActiveLocation);
                  } else {
                    onStartPractice();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-sm transition shadow-sm flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] border border-[#2D3A30]"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4 text-[#C2DDC8]" />
                  </div>
                  <div className="text-left truncate">
                    <div className="text-[10px] text-[#C2DDC8] uppercase font-bold tracking-wider leading-none mb-1">
                      Tiếp tục bài học dở dang
                    </div>
                    <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                      {formatLocationLabel(lastActiveLocation) || "Quay lại vị trí trước đó"}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-[#C2DDC8]" />
              </button>
            )}

            {isMobile ? (
              /* GIAO DIỆN NÚT HỌC TRÊN ĐIỆN THOẠI: TẬP TRUNG TỪ VỰNG & FLASHCARDS */
              <div className="space-y-2.5">
                {/* 1. Học từ vựng trên điện thoại */}
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuth();
                      return;
                    }
                    onStartPractice();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-sm transition shadow-sm flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] border border-[#2D3A30]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[#C2DDC8]" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-[#C2DDC8] uppercase font-bold tracking-wider leading-none mb-1">
                        Trọng tâm Điện thoại
                      </div>
                      <div className="text-xs sm:text-sm font-semibold">
                        📚 Học từ vựng (10 Chủ đề IELTS • Band {targetBand})
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#C2DDC8]" />
                </button>

                {/* 2. Flashcards trên điện thoại */}
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
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#D1DDD3] font-medium text-sm transition flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] flex items-center justify-center shrink-0 text-[#3E4F42]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-[#7A7369] uppercase font-bold tracking-wider leading-none mb-1">
                          Phản xạ thẻ nhớ
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-[#24211E]">
                          🗂️ Ôn tập từ vựng qua Flashcards
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 text-[#3E4F42]" />
                  </button>
                )}

                {/* Ghi chú & Liên kết tính năng tối ưu trên máy tính */}
                <div className="pt-2 border-t border-[#E6E2D8] text-center space-y-1.5">
                  <div className="text-[11px] text-[#7A7369]">
                    💻 Luyện Viết (1.2 - 1.4) &amp; Reading tối ưu cho Máy tính / Laptop
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs">
                    {onStartFullEssay && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) { onOpenAuth(); return; }
                          onStartFullEssay();
                        }}
                        className="text-[#7A7369] hover:text-[#3E4F42] underline cursor-pointer"
                      >
                        Luyện viết bài
                      </button>
                    )}
                    <span className="text-[#D1DDD3]">•</span>
                    {onStartReading && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) { onOpenAuth(); return; }
                          onStartReading();
                        }}
                        className="text-[#7A7369] hover:text-[#3E4F42] underline cursor-pointer"
                      >
                        Luyện đọc Reading
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* GIAO DIỆN NÚT HỌC TRÊN MÁY TÍNH: ĐẦY ĐỦ CÁC MỤC */
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      onOpenAuth();
                      return;
                    }
                    onStartPractice();
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
                    lastActiveLocation && lastActiveLocation.view
                      ? "bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#D1DDD3] shadow-2xs"
                      : "bg-[#3E4F42] hover:bg-[#334237] text-white shadow-xs py-3 text-sm"
                  }`}
                >
                  <span>📚 Học từ vựng (Luyện câu &amp; đoạn • Band {targetBand})</span>
                  <ArrowRight className={`w-4 h-4 ${lastActiveLocation && lastActiveLocation.view ? "text-[#3E4F42]" : ""}`} />
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

                {onStartReading && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        onOpenAuth();
                        return;
                      }
                      onStartReading();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#D1DDD3] font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-2xs"
                  >
                    <span>📖 Luyện đọc (IELTS Reading • Săn Paraphrase • Speed-Scan • X-Ray Cấu trúc)</span>
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
              </>
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
