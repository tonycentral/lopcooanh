import React from 'react';
import { X, Check, Target, Award, BookMarked, Sparkles } from 'lucide-react';
import { BAND_DESCRIPTORS, BAND_OPTIONS } from '../data/bandDescriptors';

export default function BandSelectorModal({ 
  isOpen, 
  onClose, 
  currentBand, 
  onSelectBand 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24211E]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3E4F42]/10 text-[#3E4F42] flex items-center justify-center border border-[#3E4F42]/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-[#24211E] flex items-center gap-2">
                Chọn Band IELTS Mục Tiêu
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#3E4F42]/10 text-[#3E4F42] border border-[#3E4F42]/20 font-sans">
                  Tự động lưu phiên sau
                </span>
              </h2>
              <p className="text-xs text-[#7A7369]">
                Hệ thống sẽ hiệu chuẩn tiêu chí chấm điểm ngữ pháp, từ vựng và Coherence theo band này.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-[#F4EFEA] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Band Options Grid */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {BAND_OPTIONS.map((band) => {
              const isSelected = band === currentBand;
              return (
                <button
                  key={band}
                  onClick={() => onSelectBand(band)}
                  className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? "bg-[#3E4F42] border-[#3E4F42] text-white shadow-xs scale-105"
                      : "bg-white hover:bg-[#F4EFEA] border-[#E6E2D8] text-[#24211E]"
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? "text-emerald-100" : "text-[#7A7369]"}`}>Band</span>
                  <span className="text-2xl font-serif font-bold">{band}</span>
                  {isSelected && (
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-white font-medium bg-black/15 px-1.5 py-0.2 rounded-full">
                      <Check className="w-2.5 h-2.5" /> Đang chọn
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Band Detailed Breakdown */}
          {BAND_DESCRIPTORS[currentBand] && (
            <div className="mt-4 p-5 rounded-xl bg-white border border-[#E6E2D8] space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#A67C52]" />
                  <span className="font-semibold text-[#24211E] text-base font-serif">
                    Tiêu chuẩn Đánh giá Band {currentBand}: {BAND_DESCRIPTORS[currentBand].level}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] text-[#7A7369] font-medium">
                  IELTS Task 2
                </span>
              </div>

              <p className="text-sm text-[#7A7369] leading-relaxed italic">
                "{BAND_DESCRIPTORS[currentBand].description}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8]">
                  <div className="text-xs font-semibold text-[#3E4F42] mb-1 flex items-center gap-1">
                    <BookMarked className="w-3.5 h-3.5" /> Lexical Resource (LR)
                  </div>
                  <p className="text-xs text-[#24211E] leading-normal font-sans">
                    {BAND_DESCRIPTORS[currentBand].lexicalResource}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8]">
                  <div className="text-xs font-semibold text-[#A67C52] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Coherence &amp; Cohesion (CC)
                  </div>
                  <p className="text-xs text-[#24211E] leading-normal font-sans">
                    {BAND_DESCRIPTORS[currentBand].coherence}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8]">
                  <div className="text-xs font-semibold text-[#3E4F42] mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Grammatical Range (GRA)
                  </div>
                  <p className="text-xs text-[#24211E] leading-normal font-sans">
                    {BAND_DESCRIPTORS[currentBand].grammar}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#A67C52]/30 text-xs text-[#7A7369] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A67C52] shrink-0"></span>
            Mọi bài viết của bạn sẽ được so khớp trực tiếp với tiêu chuẩn Band {currentBand} để chỉ ra chính xác điểm cần khắc phục.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E2D8] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-sm shadow-xs transition cursor-pointer"
          >
            Lưu &amp; Tiếp Tục Luyện Tập
          </button>
        </div>
      </div>
    </div>
  );
}
