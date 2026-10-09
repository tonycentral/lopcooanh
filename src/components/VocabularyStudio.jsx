import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  Tag, 
  ArrowRight, 
  Layers, 
  PenTool, 
  Copy, 
  Check, 
  BookOpen,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { speakWord } from '../services/soundEffects';

export default function VocabularyStudio({ 
  selectedVocab, 
  topic, 
  onGoWritingPractice, 
  onOpenFlashcard,
  studentEmail 
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!selectedVocab) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#7A7369] bg-white rounded-2xl border border-[#E6E2D8] shadow-xs">
        <BookOpen className="w-12 h-12 text-[#3E4F42] opacity-40 mb-3" />
        <h3 className="text-base font-serif font-bold text-[#24211E]">Chọn một từ vựng để bắt đầu</h3>
        <p className="text-xs max-w-sm mt-1">
          Nhấn vào bất kỳ từ vựng nào ở danh sách bên trái để xem chi tiết phiên âm, ngữ nghĩa, collocations và cách dùng câu chuẩn Band cao.
        </p>
      </div>
    );
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSpeak = () => {
    if (selectedVocab.word) {
      speakWord(selectedVocab.word);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-1 scrollbar-thin text-[#24211E] space-y-4">
      
      {/* Word Header Hero Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
              {topic?.vietnameseName || topic?.name || "Chủ đề"}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white text-[#7A7369] border border-[#E6E2D8]">
              {selectedVocab.cefrBand || "Band 7.5 - 8.5"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFlashcard && (
              <button
                onClick={onOpenFlashcard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#E6E2D8] text-xs font-medium text-[#24211E] transition cursor-pointer shadow-2xs"
                title="Luyện Flashcard phản xạ cho chủ đề này"
              >
                <Layers className="w-3.5 h-3.5 text-[#3E4F42]" />
                <span>Học Flashcard</span>
              </button>
            )}

            {onGoWritingPractice && (
              <button
                onClick={() => onGoWritingPractice(selectedVocab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium transition cursor-pointer shadow-xs"
                title="Luyện viết câu với từ vựng này"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Luyện Viết Câu</span>
              </button>
            )}
          </div>
        </div>

        {/* Word Title & Pronunciation */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#24211E] tracking-tight">
                {selectedVocab.word}
              </h2>
              {selectedVocab.partOfSpeech && (
                <span className="text-sm font-mono italic text-[#7A7369]">
                  ({selectedVocab.partOfSpeech})
                </span>
              )}
            </div>
            {selectedVocab.ipa && (
              <p className="text-sm font-mono text-[#7A7369]">
                {selectedVocab.ipa}
              </p>
            )}
          </div>

          <button
            onClick={handleSpeak}
            className="p-3 rounded-2xl bg-white hover:bg-[#EDF3EE] border border-[#E6E2D8] hover:border-[#3E4F42]/30 text-[#3E4F42] transition cursor-pointer shadow-xs active:scale-95"
            title="Nghe phát âm chuẩn bản xứ"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Vietnamese Meaning */}
        <div className="pt-2 border-t border-[#E6E2D8]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3E4F42] mb-1">
            Nghĩa tiếng Việt:
          </div>
          <p className="text-base sm:text-lg font-medium text-[#24211E] leading-snug">
            {selectedVocab.meaning}
          </p>
        </div>

        {/* Basic equivalent replacement tip */}
        {selectedVocab.basicEquivalent && (
          <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#7A7369] flex items-center justify-between gap-2">
            <div>
              <span>Thay thế từ vựng cơ bản: </span>
              <span className="font-semibold text-[#A67C52] line-through mr-1.5">
                {selectedVocab.basicEquivalent}
              </span>
              <span className="text-[#3E4F42] font-semibold">&rarr; {selectedVocab.word}</span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20 shrink-0">
              Nâng Band Điểm
            </span>
          </div>
        )}
      </div>

      {/* Grid: Collocations & Synonyms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* Collocations */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E2D8] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E4F42]">
            <Bookmark className="w-4 h-4" />
            <span>Collocation Ăn Điểm</span>
          </div>

          {selectedVocab.collocations && selectedVocab.collocations.length > 0 ? (
            <div className="space-y-1.5">
              {selectedVocab.collocations.map((col, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] flex items-center justify-between gap-2 text-xs"
                >
                  <span className="font-medium text-[#24211E]">{col}</span>
                  <button
                    onClick={() => handleCopy(col, `col_${idx}`)}
                    className="p-1 rounded text-[#7A7369] hover:text-[#24211E] transition"
                    title="Copy cụm từ"
                  >
                    {copiedKey === `col_${idx}` ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A7369] italic">Đang cập nhật thêm collocations.</p>
          )}
        </div>

        {/* Synonyms */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E2D8] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A67C52]">
            <Tag className="w-4 h-4" />
            <span>Từ Đồng Nghĩa (Synonyms)</span>
          </div>

          {selectedVocab.synonyms && selectedVocab.synonyms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedVocab.synonyms.map((syn, idx) => (
                <span 
                  key={idx}
                  onClick={() => handleCopy(syn, `syn_${idx}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E6E2D8] text-xs font-mono text-[#24211E] cursor-pointer transition"
                  title="Nhấn để copy"
                >
                  {syn}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A7369] italic">Đang cập nhật từ đồng nghĩa.</p>
          )}
        </div>

      </div>

      {/* Model Sentence in IELTS Writing */}
      {selectedVocab.modelSentence && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6E2D8] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#3E4F42] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Ví Dụ Trong Bài Viết IELTS Chuẩn Band 8.0</span>
            </div>
            <button
              onClick={() => handleCopy(selectedVocab.modelSentence, 'model_sentence')}
              className="p-1 rounded text-[#7A7369] hover:text-[#24211E] transition"
              title="Copy câu mẫu"
            >
              {copiedKey === 'model_sentence' ? <Check className="w-3.5 h-3.5 text-[#3E4F42]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-sm font-serif italic text-[#24211E] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E6E2D8]">
            "{selectedVocab.modelSentence}"
          </p>

          {selectedVocab.vietnameseSentence && (
            <p className="text-xs text-[#7A7369] leading-relaxed pl-1">
              <strong className="text-[#24211E] font-medium">Dịch nghĩa: </strong>
              {selectedVocab.vietnameseSentence}
            </p>
          )}
        </div>
      )}

      {/* Quick Interactive Reflex Card */}
      <div className="p-4 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="text-xs font-semibold text-[#3E4F42] uppercase tracking-wide">
            Áp dụng từ vựng vào bài viết
          </h4>
          <p className="text-xs text-[#7A7369]">
            Hãy chuyển sang phần Luyện Viết để thực hành đặt câu ngay với từ <strong>"{selectedVocab.word}"</strong>.
          </p>
        </div>

        {onGoWritingPractice && (
          <button
            onClick={() => onGoWritingPractice(selectedVocab)}
            className="px-4 py-2 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white text-xs font-medium transition cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Bắt Đầu Luyện Viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
