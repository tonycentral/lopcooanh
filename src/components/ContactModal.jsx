import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  Sparkles, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "0899488299";
  const formattedPhone = "0899.488.299";
  const zaloUrl = `https://zalo.me/${phoneNumber}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Học Trực Tiếp 1-kèm-1 &amp; Nhóm Nhỏ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Liên Hệ Cô Oanh Writing
            </h2>
            <p className="text-xs text-slate-400">
              Chữa bài chi tiết từng câu • Tối ưu theo band mục tiêu của bạn
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2.5 mb-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Sửa lỗi ngữ pháp, từ vựng và cấu trúc mạch lạc (Coherence) trực tiếp.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Lộ trình may đo theo mục tiêu riêng (từ 5.0 lên 6.5 - 7.5+).</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Phản hồi chi tiết sau mỗi bài viết trong vòng 24 - 48h.</span>
          </div>
        </div>

        {/* Main Phone / Zalo Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-800/50 border border-slate-700/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Hotline &amp; Zalo Trực Tiếp
            </span>
            <span className="text-2xl font-black text-white tracking-wider font-mono">
              {formattedPhone}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép số</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Zalo Button */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Nhắn Zalo Ngay</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Call Direct Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-sm font-bold transition hover:text-emerald-300"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi Trực Tiếp</span>
          </a>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-5">
          Cô Oanh phản hồi Zalo nhanh chóng trong khung giờ 08:00 - 22:00 hàng ngày.
        </p>
      </div>
    </div>
  );
}
