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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2826]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E7E2D9] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#2B2826] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#7A7267] hover:text-[#2B2826] hover:bg-[#F4EFEA] transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-[#E7E2D9] flex items-center justify-center shadow-xs shrink-0">
            <img 
              src="./logo.png" 
              alt="Lớp cô Oanh" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4A5D4E]/10 border border-[#4A5D4E]/20 text-[#4A5D4E] text-[11px] font-medium mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Học Trực Tiếp 1-kèm-1 &amp; Nhóm Nhỏ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2B2826] tracking-tight">
              Liên Hệ Cô Oanh Writing
            </h2>
            <p className="text-xs text-[#7A7267]">
              Chữa bài chi tiết từng câu • Tối ưu theo band mục tiêu của bạn
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2.5 mb-6 bg-white border border-[#E7E2D9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-2.5 text-xs text-[#2B2826]">
            <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
            <span>Sửa lỗi ngữ pháp, từ vựng và cấu trúc mạch lạc (Coherence) trực tiếp.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#2B2826]">
            <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
            <span>Lộ trình may đo theo mục tiêu riêng (từ 5.0 lên 6.5 - 7.5+).</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#2B2826]">
            <CheckCircle2 className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
            <span>Phản hồi chi tiết sau mỗi bài viết trong vòng 24 - 48h.</span>
          </div>
        </div>

        {/* Main Phone / Zalo Box */}
        <div className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#E7E2D9] mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] text-[#7A7267] uppercase tracking-wider font-medium block">
              Hotline &amp; Zalo Trực Tiếp
            </span>
            <span className="text-2xl font-serif font-bold text-[#2B2826] tracking-wider">
              {formattedPhone}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 border ${
              copied
                ? "bg-[#4A5D4E] text-white border-[#4A5D4E]"
                : "bg-white hover:bg-[#FAF8F5] text-[#2B2826] border-[#E7E2D9]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#7A7267]" />
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
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4D40] text-white text-sm font-medium shadow-xs transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Nhắn Zalo Ngay</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Call Direct Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-[#F4EFEA] text-[#2B2826] border border-[#E7E2D9] text-sm font-medium transition shadow-2xs"
          >
            <Phone className="w-4 h-4 text-[#4A5D4E]" />
            <span>Gọi Trực Tiếp</span>
          </a>
        </div>

        <p className="text-center text-[11px] text-[#7A7267] mt-5">
          Cô Oanh phản hồi Zalo nhanh chóng trong khung giờ 08:00 - 22:00 hàng ngày.
        </p>
      </div>
    </div>
  );
}
