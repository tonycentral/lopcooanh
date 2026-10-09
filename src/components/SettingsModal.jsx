import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Mail, 
  Cloud, 
  Key, 
  Target, 
  Trash2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Bot, 
  LogOut, 
  Sparkles,
  Edit2
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';
import { clearHistory } from '../services/storage';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  currentUser,
  studentEmail,
  onUpdateFullName,
  targetBand, 
  onSelectBand, 
  current7DayScore,
  apiKey, 
  onSaveApiKey,
  onResetData,
  onSignOut
}) {
  const [fullNameInput, setFullNameInput] = useState(
    currentUser?.user_metadata?.full_name || ""
  );
  const [isNameSaving, setIsNameSaving] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  const [inputKey, setInputKey] = useState(apiKey || "");
  const [keySavedSuccess, setKeySavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.user_metadata?.full_name) {
      setFullNameInput(currentUser.user_metadata.full_name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSaveName = async () => {
    if (!fullNameInput.trim()) return;
    setIsNameSaving(true);
    if (onUpdateFullName) {
      await onUpdateFullName(fullNameInput.trim());
    }
    setIsNameSaving(false);
    setNameSavedSuccess(true);
    setTimeout(() => setNameSavedSuccess(false), 2000);
  };

  const handleSaveApiKey = () => {
    if (onSaveApiKey) {
      onSaveApiKey(inputKey.trim());
    }
    setKeySavedSuccess(true);
    setTimeout(() => setKeySavedSuccess(false), 2000);
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại dữ liệu lịch sử và làm mới thống kê trên thiết bị này?")) {
      clearHistory();
      if (onResetData) onResetData();
      onClose();
    }
  };

  // Get user avatar initials
  const displayName = currentUser?.user_metadata?.full_name || studentEmail || "Học viên";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#24211E]/55 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#24211E] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL HEADER ================= */}
        <div className="px-6 py-4.5 border-b border-[#E6E2D8] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center border border-[#D1DDD3] shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#24211E]">
                Cài Đặt Tài Khoản &amp; Hệ Thống
              </h2>
              <p className="text-xs text-[#7A7369]">
                Hồ sơ học viên, mục tiêu band điểm và cấu hình AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#24211E] scrollbar-thin">
          
          {/* 1. HỒ SƠ HỌC VIÊN & ĐÁM MÂY SUPABASE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Hồ Sơ Học Viên
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] text-[11px] font-semibold border border-[#D1DDD3]">
                <Cloud className="w-3 h-3" />
                <span>Supabase Cloud Active</span>
              </div>
            </div>

            {/* Avatar & User Details */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-[#3E4F42] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="Nhập họ và tên của bạn..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs font-semibold text-[#24211E] focus:outline-none focus:border-[#3E4F42] focus:bg-white"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isNameSaving}
                    className="px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    {nameSavedSuccess ? <Check className="w-3.5 h-3.5" /> : "Lưu"}
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7A7369] mt-1.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{currentUser?.email || studentEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E6E2D8] text-[11px] text-[#7A7369] leading-relaxed flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A67C52] shrink-0" />
              <span>Tiến độ học tập, điểm số chấm bài và từ vựng flashcard được lưu trữ vĩnh viễn trên đám mây.</span>
            </div>
          </div>

          {/* 2. MỤC TIÊU BAND IELTS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Mục Tiêu Band Điểm
              </label>
              {current7DayScore !== null && (
                <span className="text-[11px] text-[#7A7369]">
                  Điểm 7 ngày qua: <strong className="text-[#3E4F42]">{current7DayScore.toFixed(1)}</strong>
                </span>
              )}
            </div>

            <p className="text-[#7A7369] text-xs">
              Chọn mức Band bạn đang hướng tới để hệ thống tự động hiệu chỉnh tiêu chuẩn chấm điểm và gợi ý bài mẫu:
            </p>

            <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 pt-1">
              {BAND_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onSelectBand && onSelectBand(b)}
                  className={`py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    b === targetBand
                      ? "bg-[#3E4F42] border-[#3E4F42] text-white shadow-xs"
                      : "bg-[#FAF8F5] border-[#E6E2D8] text-[#24211E] hover:bg-white hover:border-[#D1DDD3]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 3. GOOGLE GEMINI AI KEY (TUỲ CHỌN) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Google Gemini API Key (Tuỳ chọn)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] font-semibold border border-[#E6E2D8]">
                Miễn phí
              </span>
            </div>

            <p className="text-[#7A7369] leading-relaxed text-xs">
              Mặc định ứng dụng sử dụng công cụ chấm điểm NLP nội bộ chuẩn Cambridge. Nếu bạn muốn sử dụng thêm giám khảo AI từ Google Gemini, hãy dán API Key cá nhân:
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs text-[#24211E] placeholder-[#7A7369] focus:outline-none focus:border-[#3E4F42] font-mono focus:bg-white"
              />
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                {keySavedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : "Lưu Key"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A7369] pt-1">
              <span>Lấy key miễn phí từ Google:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3E4F42] hover:underline flex items-center gap-1 font-semibold"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 4. DỮ LIỆU & BẢO MẬT */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#7A7369]">
              <ShieldCheck className="w-4 h-4 text-[#3E4F42] shrink-0" />
              <span>Dữ liệu API Key &amp; cấu hình cục bộ được mã hóa an toàn trên máy.</span>
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#A67C52] hover:underline font-medium shrink-0 cursor-pointer"
            >
              Đặt lại dữ liệu máy
            </button>
          </div>

          {/* 5. ĐĂNG XUẤT TÀI KHOẢN */}
          {onSignOut && (
            <div className="pt-2 border-t border-[#E6E2D8] flex justify-between items-center">
              <span className="text-[#7A7369] text-xs">Đang đăng nhập với: <strong>{currentUser?.email || studentEmail}</strong></span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#A67C52] hover:bg-[#FAF5EE] border border-[#E6E2D8] transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng xuất
              </button>
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="px-6 py-4 border-t border-[#E6E2D8] bg-white flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
