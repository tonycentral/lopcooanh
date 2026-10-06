import React from 'react';
import { 
  Sparkles, 
  BookMarked, 
  ArrowUpRight, 
  PenTool, 
  Tag, 
  Copy, 
  Check 
} from 'lucide-react';

export default function VocabularyList({ 
  vocabularies, 
  selectedVocab, 
  onSelectVocab 
}) {
  const [copiedWord, setCopiedWord] = React.useState(null);

  const handleCopy = (word, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
        Không có từ vựng nào trong chủ đề này.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-indigo-400" />
            Bộ Từ Vựng Trọng Tâm &amp; Nâng Cấp Band
          </h3>
          <p className="text-xs text-slate-400">
            Chọn một từ vựng để bắt đầu viết câu và luyện tập từ đồng nghĩa
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
          {vocabularies.length} từ C1/C2
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vocabularies.map((vocab) => {
          const isSelected = selectedVocab?.id === vocab.id;

          return (
            <div
              key={vocab.id}
              onClick={() => onSelectVocab(vocab)}
              className={`p-4 rounded-xl border transition cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800/95 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/40"
                  : "bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600"
              }`}
            >
              <div>
                {/* Word & Type Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white tracking-wide">
                      {vocab.word}
                    </span>
                    <span className="text-xs text-indigo-400 italic font-mono">
                      ({vocab.partOfSpeech})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopy(vocab.word, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
                      title="Copy từ"
                    >
                      {copiedWord === vocab.word ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold">
                        Đang luyện
                      </span>
                    )}
                  </div>
                </div>

                {/* Vietnamese Meaning */}
                <p className="text-xs text-slate-300 mb-2.5 font-medium leading-relaxed">
                  {vocab.meaning}
                </p>

                {/* Band Comparison Badge */}
                {vocab.basicEquivalent && (
                  <div className="mb-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Thay thế: <span className="line-through text-slate-500 font-mono">{vocab.basicEquivalent}</span>
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Band 7.5+
                    </span>
                  </div>
                )}

                {/* Synonyms list */}
                {vocab.synonyms && vocab.synonyms.length > 0 && (
                  <div className="mb-2.5">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-pink-400" /> Từ đồng nghĩa (Synonyms):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {vocab.synonyms.map((syn, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 font-medium"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collocations */}
                {vocab.collocations && vocab.collocations.length > 0 && (
                  <div className="mb-3 text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-400">Collocations: </span>
                    <span className="italic text-slate-300">
                      {vocab.collocations.join(" • ")}
                    </span>
                  </div>
                )}

                {/* Example sentence */}
                {vocab.modelSentence && (
                  <p className="text-xs text-slate-300/90 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-900/40 italic leading-relaxed">
                    "{vocab.modelSentence}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-700/40 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVocab(vocab);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-700/60 hover:bg-indigo-600 text-slate-200 hover:text-white"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{isSelected ? "Đang viết câu" : "Tập viết câu với từ này"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
