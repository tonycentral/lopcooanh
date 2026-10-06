import React from 'react';
import { X, Sparkles, Copy, Check, BookOpen } from 'lucide-react';
import { COHESIVE_CATEGORIES } from '../data/cohesiveDevices';

export default function CohesiveGuideModal({ isOpen, onClose }) {
  const [copiedWord, setCopiedWord] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (word) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center border border-pink-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sổ Tay Cohesive Devices Band 7.5 - 8.5</h2>
              <p className="text-xs text-slate-400">Từ nối học thuật &amp; Kỹ thuật quy chiếu tạo mạch lạc</p>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {COHESIVE_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center justify-between">
                  <span>{cat.category}</span>
                  <span className="text-xs font-normal text-slate-400 italic">{cat.purpose}</span>
                </h3>
              </div>

              <div className="space-y-2">
                {cat.devices.map((item, dIdx) => (
                  <div 
                    key={dIdx} 
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-300 font-mono text-sm">{item.word}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold">
                          Band {item.band}
                        </span>
                      </div>
                      <p className="text-slate-300 italic text-[11px] font-mono leading-relaxed">
                        "{item.example}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(item.word)}
                      className="p-1 rounded text-slate-400 hover:text-white transition shrink-0"
                      title="Copy từ nối"
                    >
                      {copiedWord === item.word ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Đóng Sổ Tay
          </button>
        </div>
      </div>
    </div>
  );
}
