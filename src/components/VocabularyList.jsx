import React from 'react';
import { BookOpen, Check } from 'lucide-react';

export default function VocabularyList({ 
  vocabularies, 
  selectedVocab, 
  onSelectVocab 
}) {
  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        Không có từ vựng.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Từ vựng trọng tâm ({vocabularies.length})</span>
        </div>
        <span className="text-[10px] text-slate-500">
          Nhấn để chọn từ luyện viết
        </span>
      </div>

      {/* Scrollable list of vocabulary cards */}
      <div className="flex-1 min-h-0 overflow-y-auto pt-2 space-y-2 pr-1 scrollbar-thin">
        {vocabularies.map((vocab) => {
          const isSelected = selectedVocab?.id === vocab.id;

          return (
            <div
              key={vocab.id}
              onClick={() => onSelectVocab(vocab)}
              className={`p-2.5 rounded-xl border transition cursor-pointer text-left select-none ${
                isSelected
                  ? "bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/50"
                  : "bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Word, IPA and Part of Speech */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    {vocab.word}
                  </span>
                  {vocab.ipa && (
                    <span className="text-xs font-mono text-indigo-300 italic font-medium">
                      {vocab.ipa}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-sans">
                    ({vocab.partOfSpeech})
                  </span>
                </div>

                {isSelected ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold flex items-center gap-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                    Đang chọn
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 hover:text-indigo-400 shrink-0">
                    Chọn →
                  </span>
                )}
              </div>

              {/* Vietnamese Meaning */}
              <p className="text-xs text-slate-300 font-medium leading-snug mb-1">
                {vocab.meaning}
              </p>

              {/* Synonyms & Basic equivalent */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
                {vocab.basicEquivalent && (
                  <span className="text-slate-500 text-[10px]">
                    Thay cho: <span className="line-through">{vocab.basicEquivalent}</span> •
                  </span>
                )}
                {vocab.synonyms && vocab.synonyms.length > 0 && (
                  <span className="text-pink-300 text-[10px]">
                    Đồng nghĩa: {vocab.synonyms.slice(0, 3).join(", ")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
