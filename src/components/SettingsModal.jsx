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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cài Đặt Hệ Thống</h2>
              <p className="text-xs text-slate-400">Tùy chỉnh cấu hình phiên học và công cụ chấm điểm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Target Band Setting */}
          <div className="space-y-2">
            <label className="font-bold text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Mục Tiêu Band Mặc Định
            </label>
            <p className="text-slate-400 text-xs">
              Mục tiêu này được lưu vĩnh viễn trên trình duyệt của bạn cho các lần mở sau:
            </p>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {BAND_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => onSelectBand(b)}
                  className={`py-2 rounded-lg font-bold text-xs border transition cursor-pointer ${
                    b === targetBand
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Gemini AI Key Setting */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                Google Gemini API Key (Tuỳ chọn)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Miễn phí 100%
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Mặc định ứng dụng đã có sẵn <strong>Bộ Chấm Điểm NLP IELTS thông minh</strong> hoạt động ngoại tuyến. Nếu bạn muốn thêm chấm điểm bằng AI Gemini Examiner trực tiếp từ Google, hãy dán API Key của bạn vào đây:
            </p>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="password"
                placeholder="Dán AI Studio API Key (AIzaSy...)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : "Lưu Key"}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Chưa có API Key? Lấy miễn phí tại:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1 underline font-medium"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Privacy & Storage Notice */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Mọi dữ liệu điểm số, band mục tiêu và API Key được lưu trữ cục bộ trực tiếp trên trình duyệt của bạn (LocalStorage) và chỉ được dùng khi giao tiếp với Google AI, không lưu trên bất kỳ máy chủ bên thứ ba nào khác.</span>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-slate-400 text-xs">Khôi phục cài đặt gốc:</span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Đặt lại dữ liệu
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
