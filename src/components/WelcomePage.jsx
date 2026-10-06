import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Target, 
  FileText, 
  BarChart3, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight, 
  Check, 
  Copy, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { BAND_DESCRIPTORS, BAND_OPTIONS } from '../data/bandDescriptors';
import { updateCurrentUserSettings } from '../services/userService';

export default function WelcomePage({ 
  onStartPractice, 
  onOpenContactModal,
  onOpenUserModal,
  currentUser,
  onUserUpdate
}) {
  // Local state for immediate responsiveness
  const [selectedBand, setSelectedBand] = useState(currentUser?.targetBand || "7.0");
  const [selectedTask, setSelectedTask] = useState(currentUser?.selectedTask || "task2");
  const [justSaved, setJustSaved] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const phoneNumber = "0899488299";
  const formattedPhone = "0899.488.299";
  const zaloUrl = `https://zalo.me/${phoneNumber}`;

  // Keep in sync when currentUser changes from outside
  useEffect(() => {
    if (currentUser) {
      setSelectedBand(currentUser.targetBand || "7.0");
      setSelectedTask(currentUser.selectedTask || "task2");
    }
  }, [currentUser]);

  // Handle Band selection change & auto-save to user profile
  const handleSelectBand = (band) => {
    setSelectedBand(band);
    const updated = updateCurrentUserSettings({ targetBand: band });
    if (updated && onUserUpdate) {
      onUserUpdate(updated);
    }
    triggerSaveFeedback();
  };

  // Handle Task selection change & auto-save to user profile
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    const updated = updateCurrentUserSettings({ selectedTask: task });
    if (updated && onUserUpdate) {
      onUserUpdate(updated);
    }
    triggerSaveFeedback();
  };

  // Visual confirmation that settings were saved
  const triggerSaveFeedback = () => {
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
    }, 2000);
  };

  // Quick copy phone number
  const handleCopyPhone = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formattedPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const currentBandInfo = BAND_DESCRIPTORS[selectedBand] || BAND_DESCRIPTORS["7.0"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[350px] bg-emerald-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Top Bar / Navigation */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-tight">
                Lớp cô Oanh
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                Website chuyên cải thiện writing
              </span>
            </div>
          </div>

          {/* User Profile Pill & Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUserModal}
              className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-indigo-500/50 transition cursor-pointer"
              title="Đổi tài khoản học viên"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentUser?.avatarColor || "from-indigo-500 to-purple-600"} flex items-center justify-center text-white font-bold text-xs`}>
                {currentUser?.name?.slice(0, 2).toUpperCase() || "HV"}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 block leading-none">Học viên</span>
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                  {currentUser?.name || "Học viên mới"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                Đổi
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col justify-center">
        
        {/* Hero Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phương pháp luyện câu &amp; Coherence chuyên biệt</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Lớp cô Oanh
            <span className="block text-xl sm:text-2xl mt-1.5 font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Website chuyên cải thiện writing
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Thiết lập mục tiêu và lựa chọn phần thi viết để bắt đầu hành trình nâng band câu văn học thuật và tư duy mạch lạc.
          </p>

          {/* Auto-save status feedback */}
          <div className="pt-1 flex items-center justify-center gap-2 text-xs">
            {justSaved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" />
                Đã lưu cấu hình cho học viên {currentUser?.name}!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Cài đặt được tự động lưu riêng cho học viên: <strong className="text-slate-200">{currentUser?.name}</strong>
              </span>
            )}
          </div>

        </div>

        {/* Configuration Panel (Modern & Minimalist Card) */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-8">
          
          {/* Section 1: Thanh Bar Chọn Band */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  Mục Tiêu Band Điểm Của Bạn
                </label>
                <p className="text-xs text-slate-400">
                  Chọn mức Band mong muốn để hệ thống hiệu chuẩn bài tập và tiêu chí chấm
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 self-start sm:self-auto">
                <span className="text-xs text-slate-400">Đang chọn:</span>
                <span className="text-sm font-black text-indigo-300">Band {selectedBand}</span>
              </div>
            </div>

            {/* Interactive Band Bar (Segmented Track) */}
            <div className="relative pt-2 pb-1">
              {/* Horizontal Scroll / Grid for Band Options */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                {BAND_OPTIONS.map((band) => {
                  const isSelected = band === selectedBand;
                  return (
                    <button
                      key={band}
                      onClick={() => handleSelectBand(band)}
                      className={`relative py-3 px-2 rounded-xl text-center transition-all duration-200 font-bold cursor-pointer select-none ${
                        isSelected
                          ? "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/40 scale-[1.03] border border-indigo-400/80"
                          : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Band</div>
                      <div className="text-base sm:text-lg font-black leading-tight">{band}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Band Description Card */}
            {currentBandInfo && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <span>Mức độ:</span>
                  <span className="text-white">{currentBandInfo.level}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentBandInfo.description}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Chọn Tập Task 1 Hoặc Task 2 */}
          <div className="space-y-4 pt-2 border-t border-slate-800/70">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Chọn Chế Độ Luyện Tập
              </label>
              <p className="text-xs text-slate-400">
                Lựa chọn phần thi IELTS Writing bạn muốn tập trung rèn luyện hôm nay
              </p>
            </div>

            {/* Segmented Task 1 / Task 2 Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Task 1 Card */}
              <button
                type="button"
                onClick={() => handleSelectTask("task1")}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  selectedTask === "task1"
                    ? "bg-gradient-to-br from-indigo-950/70 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/50"
                    : "bg-slate-950/50 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedTask === "task1"
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-slate-800/60 text-slate-400"
                  }`}>
                    <BarChart3 className="w-5 h-5" />
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                    selectedTask === "task1"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-700 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="font-black text-base text-white group-hover:text-indigo-300 transition">
                  IELTS Writing Task 1
                </div>
                <div className="text-xs text-indigo-400 font-semibold mb-1">
                  Mô Tả Biểu Đồ &amp; Báo Cáo Số Liệu
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Luyện viết câu tổng quan (Overview), so sánh số liệu, mô tả xu hướng tăng/giảm và phân tích quy trình/bản đồ (150 từ, 20 phút).
                </p>
              </button>

              {/* Task 2 Card */}
              <button
                type="button"
                onClick={() => handleSelectTask("task2")}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                  selectedTask === "task2"
                    ? "bg-gradient-to-br from-purple-950/70 to-slate-900 border-purple-500 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/50"
                    : "bg-slate-950/50 border-slate-800/90 hover:bg-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedTask === "task2"
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "bg-slate-800/60 text-slate-400"
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                    selectedTask === "task2"
                      ? "bg-purple-600 text-white"
                      : "border border-slate-700 text-transparent"
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="font-black text-base text-white group-hover:text-purple-300 transition">
                  IELTS Writing Task 2
                </div>
                <div className="text-xs text-purple-400 font-semibold mb-1">
                  Bài Luận Nghị Luận Xã Hội (Essay)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rèn luyện câu phức, nâng cấp từ vựng C1/C2, lập luận chặt chẽ và móc nối 2 câu liên tiếp chuẩn Coherence (250 từ, 40 phút).
                </p>
              </button>

            </div>
          </div>

          {/* Primary CTA: Bắt Đầu Luyện Tập */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onStartPractice}
              className="w-full group py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base transition-all duration-200 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Bắt Đầu Luyện Tập Với Band {selectedBand} ({selectedTask === "task1" ? "Task 1" : "Task 2"})</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Section 3: Nút Liên Hệ Cô Oanh Để Học Trực Tiếp (Hotline / Zalo 0899.488.299) */}
        <div className="mt-8">
          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-bold text-white text-base">
                    Học trực tiếp cùng cô Oanh
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    1-on-1 &amp; Nhóm nhỏ
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chữa bài chi tiết từng câu, sửa lỗi ngữ pháp &amp; định hướng lộ trình bứt phá Band Writing.
                </p>
                <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Zalo / Hotline:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm tracking-wider">
                    {formattedPhone}
                  </span>
                  <button
                    onClick={handleCopyPhone}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-blue-600/25 cursor-pointer transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Zalo</span>
              </a>

              <button
                type="button"
                onClick={onOpenContactModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-600/25 cursor-pointer transform hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Liên hệ cô Oanh để học trực tiếp</span>
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © Lớp cô Oanh • Nền tảng chuyên cải thiện IELTS Writing chuẩn phương pháp
          </p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Hotline Zalo: 0899.488.299</span>
            <span>•</span>
            <button
              onClick={onOpenContactModal}
              className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              Hỗ trợ học viên
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
