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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-indigo-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Chọn Band IELTS Mục Tiêu
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Tự động lưu phiên sau
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hệ thống sẽ hiệu chuẩn tiêu chí chấm điểm ngữ pháp, từ vựng và Coherence theo band này.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
                      ? "bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105"
                      : "bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-300">Band</span>
                  <span className="text-2xl font-black">{band}</span>
                  {isSelected && (
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-indigo-100 font-bold bg-white/20 px-1.5 py-0.2 rounded-full">
                      <Check className="w-2.5 h-2.5" /> Đang chọn
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Band Detailed Breakdown */}
          {BAND_DESCRIPTORS[currentBand] && (
            <div className="mt-4 p-5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white text-base">
                    Tiêu chuẩn Đánh giá Band {currentBand}: {BAND_DESCRIPTORS[currentBand].level}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-medium">
                  IELTS Task 2
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{BAND_DESCRIPTORS[currentBand].description}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                    <BookMarked className="w-3.5 h-3.5" /> Lexical Resource (LR)
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    {BAND_DESCRIPTORS[currentBand].lexicalResource}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-sky-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Coherence &amp; Cohesion (CC)
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    {BAND_DESCRIPTORS[currentBand].coherence}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Grammatical Range (GRA)
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    {BAND_DESCRIPTORS[currentBand].grammar}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0"></span>
            Mọi bài viết của bạn sẽ được so khớp trực tiếp với tiêu chuẩn Band {currentBand} để chỉ ra chính xác điểm cần khắc phục.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Lưu &amp; Tiếp Tục Luyện Tập
          </button>
        </div>
      </div>
    </div>
  );
}
