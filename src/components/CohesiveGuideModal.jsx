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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24211E]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] border border-[#E6E2D8] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#24211E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center border border-[#D1DDD3]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#24211E]">Sổ Tay Cohesive Devices</h2>
              <p className="text-xs text-[#7A7369]">Từ nối học thuật &amp; Kỹ thuật quy chiếu mạch lạc</p>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {COHESIVE_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-[#E6E2D8] space-y-3 shadow-2xs">
              <div>
                <h3 className="font-semibold text-[#24211E] text-sm flex items-center justify-between">
                  <span>{cat.category}</span>
                  <span className="text-xs font-normal text-[#7A7369] italic">{cat.purpose}</span>
                </h3>
              </div>

              <div className="space-y-2">
                {cat.devices.map((item, dIdx) => (
                  <div 
                    key={dIdx} 
                    className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3E4F42] font-mono text-sm">{item.word}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDF3EE] text-[#3E4F42] font-medium border border-[#D1DDD3]">
                          Band {item.band}
                        </span>
                      </div>
                      <p className="text-[#24211E] italic text-[11px] font-serif leading-relaxed">
                        "{item.example}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(item.word)}
                      className="p-1 rounded text-[#7A7369] hover:text-[#24211E] transition shrink-0"
                      title="Copy từ nối"
                    >
                      {copiedWord === item.word ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E2D8] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#24211E] border border-[#E6E2D8] font-medium text-xs transition cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
