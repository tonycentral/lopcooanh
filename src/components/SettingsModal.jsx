import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Target, 
  Trash2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Bot 
} from 'lucide-react';
import { BAND_OPTIONS } from '../data/bandDescriptors';
import { clearHistory } from '../services/storage';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  targetBand, 
  onSelectBand, 
  apiKey, 
  onSaveApiKey,
  onResetData 
}) {
  const [inputKey, setInputKey] = useState(apiKey || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại tất cả dữ liệu lịch sử và cài đặt?")) {
      clearHistory();
      if (onResetData) onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24211E]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#24211E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center border border-[#D1DDD3]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#24211E]">Cài Đặt Hệ Thống</h2>
              <p className="text-xs text-[#7A7369]">Cấu hình phiên học và công cụ chấm điểm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#24211E]">
          
          {/* Target Band Setting */}
          <div className="space-y-2">
            <label className="font-medium text-[#24211E] text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-[#3E4F42]" />
              Mục Tiêu Band Mặc Định
            </label>
            <p className="text-[#7A7369] text-xs">
              Mục tiêu này được lưu tự động trên trình duyệt của bạn:
            </p>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {BAND_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => onSelectBand(b)}
                  className={`py-2 rounded-lg font-medium text-xs border transition cursor-pointer ${
                    b === targetBand
                      ? "bg-[#3E4F42] border-[#3E4F42] text-white shadow-xs"
                      : "bg-white border-[#E6E2D8] text-[#24211E] hover:bg-[#FAF8F5]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Gemini AI Key Setting */}
          <div className="space-y-2 pt-2 border-t border-[#E6E2D8]">
            <div className="flex items-center justify-between">
              <label className="font-medium text-[#24211E] text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#3E4F42]" />
                Google Gemini API Key (Tuỳ chọn)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] font-medium border border-[#D1DDD3]">
                Miễn phí
              </span>
            </div>
            <p className="text-[#7A7369] leading-relaxed text-xs">
              Mặc định ứng dụng sử dụng bộ chấm điểm NLP nội bộ. Nếu muốn bổ sung đánh giá từ Google Gemini AI, bạn có thể dán API Key:
            </p>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#24211E] placeholder-[#7A7369] focus:outline-none focus:border-[#3E4F42] font-mono"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : "Lưu Key"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#7A7369] pt-1">
              <span>Lấy key miễn phí tại:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3E4F42] hover:underline flex items-center gap-1 font-medium"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Privacy & Storage Notice */}
          <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] flex items-start gap-2.5 text-xs text-[#7A7369]">
            <ShieldCheck className="w-4 h-4 text-[#3E4F42] shrink-0 mt-0.5" />
            <span>Dữ liệu điểm số, band mục tiêu và API Key được lưu trực tiếp trên thiết bị của bạn (LocalStorage).</span>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-[#E6E2D8] flex justify-between items-center">
            <span className="text-[#7A7369] text-xs">Khôi phục mặc định:</span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A67C52] hover:bg-[#FAF5EE] border border-[#E6E2D8] transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Đặt lại dữ liệu
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E2D8] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#24211E] border border-[#E6E2D8] font-medium text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
