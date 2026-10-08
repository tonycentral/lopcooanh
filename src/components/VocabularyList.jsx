import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  PenTool, 
  CheckCircle2,
  Layers,
  RotateCcw,
  Sparkles,
  PlusCircle,
  FileEdit,
  Tag,
  Search
} from 'lucide-react';
import { getKnownWords, toggleKnownWord, resetKnownWordsForTopic } from '../services/userService';

export default function VocabularyList({ 
  vocabularies = [], 
  selectedVocab, 
  onSelectVocab, 
  studentEmail,
  onStartPractice,
  onOpenFlashcard,
  onGoFullEssay,
  onNextTopic,
  onOpenSourcesModal
}) {
  const [knownWordIds, setKnownWordIds] = useState(() => getKnownWords(studentEmail));
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const PAGE_SIZE = 5;

  // Refresh known words if studentEmail changes
  useEffect(() => {
    setKnownWordIds(getKnownWords(studentEmail));
  }, [studentEmail]);

  // Sort vocabularies: Unlearned words FIRST, Known words LAST (Không ưu tiên hiển thị từ đã biết)
  const sortedVocabs = useMemo(() => {
    if (!vocabularies || vocabularies.length === 0) return [];
    const unlearned = [];
    const known = [];

    vocabularies.forEach(vocab => {
      if (knownWordIds.includes(vocab.id)) {
        known.push(vocab);
      } else {
        unlearned.push(vocab);
      }
    });

    return [...unlearned, ...known];
  }, [vocabularies, knownWordIds]);

  // Filter vocabularies by search query (matches word, meaning, and synonyms)
  const filteredVocabs = useMemo(() => {
    if (!sortedVocabs || sortedVocabs.length === 0) return [];
    if (!searchQuery.trim()) return sortedVocabs;
    const q = searchQuery.toLowerCase().trim();
    return sortedVocabs.filter(v => 
      v.word.toLowerCase().includes(q) ||
      (v.meaning && v.meaning.toLowerCase().includes(q)) ||
      (v.synonyms && v.synonyms.some(s => s.toLowerCase().includes(q))) ||
      (v.collocations && v.collocations.some(c => c.toLowerCase().includes(q)))
    );
  }, [sortedVocabs, searchQuery]);

  // Total pages based on 5 words per batch
  const totalPages = Math.max(1, Math.ceil(filteredVocabs.length / PAGE_SIZE));

  // Current batch of 5 words
  const currentBatch = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filteredVocabs.slice(start, start + PAGE_SIZE);
  }, [filteredVocabs, pageIndex]);

  // Reset pageIndex if it exceeds totalPages
  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(0);
    }
  }, [totalPages, pageIndex]);

  // Handle Toggle "Tôi đã biết"
  const handleToggleKnown = (e, vocabId) => {
    e.stopPropagation();
    const updated = toggleKnownWord(studentEmail, vocabId);
    setKnownWordIds(updated);
  };

  // Handle "Luyện tập"
  const handlePracticeWord = (vocab) => {
    if (onSelectVocab) onSelectVocab(vocab);
    if (onStartPractice) onStartPractice(vocab);
  };

  // Số lượng từ đã biết riêng trong chủ đề hiện tại
  const topicKnownCount = useMemo(() => {
    return vocabularies.filter(v => knownWordIds.includes(v.id)).length;
  }, [vocabularies, knownWordIds]);

  const isAllKnown = vocabularies.length > 0 && topicKnownCount >= vocabularies.length;

  const handleResetTopicWords = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có muốn bỏ đánh dấu 'Đã biết' của các từ trong chủ đề này để ôn tập lại từ đầu không?")) {
      const allIds = vocabularies.map(v => v.id);
      const updated = resetKnownWordsForTopic(studentEmail, allIds);
      setKnownWordIds(updated);
    }
  };

  // Pagination navigation
  const handleNextPage = () => {
    setPageIndex(prev => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setPageIndex(prev => (prev - 1 + totalPages) % totalPages);
  };

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="p-5 text-center text-xs text-slate-400">
        Không có từ vựng cho chủ đề này.
      </div>
    );
  }

  const startWordIdx = filteredVocabs.length > 0 ? pageIndex * PAGE_SIZE + 1 : 0;
  const endWordIdx = Math.min((pageIndex + 1) * PAGE_SIZE, filteredVocabs.length);

  return (
    <div className="h-full flex flex-col overflow-hidden text-[#2B2826]">
      
      {/* Top Header: Title & Pagination Action */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#E7E2D9] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#4A5D4E] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#2B2826] leading-tight">
              Từ vựng trọng tâm ({filteredVocabs.length})
            </h3>
            <span className="text-[10px] text-[#7A7369]">
              Hiện từ {startWordIdx}-{endWordIdx} • Đã biết: <strong className={isAllKnown ? "text-[#3D5240] font-bold" : "text-[#4A5D4E]"}>{topicKnownCount}/{vocabularies.length}</strong>
            </span>
          </div>
        </div>

        {/* Actions: Flashcard shortcut + Nút chọn 5 từ vựng tiếp theo */}
        <div className="flex items-center gap-1.5">
          {onOpenFlashcard && (
            <button
              type="button"
              onClick={onOpenFlashcard}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#EDF3EE] hover:bg-[#E2ECE3] text-[#344837] border border-[#CAD8C8] text-xs font-bold transition cursor-pointer shadow-sm"
              title="Học bộ từ này theo dạng Flashcard tương tác"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">Flashcard</span>
            </button>
          )}

          {totalPages > 1 && (
            <button
              type="button"
              onClick={handlePrevPage}
              className="p-1 rounded-lg bg-[#F2EFE9] hover:bg-[#EAE5DC] text-[#6E675E] hover:text-[#2B2826] border border-[#DDD6CB] transition cursor-pointer"
              title="5 từ trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNextPage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white border border-[#3D4E41] text-xs font-bold transition cursor-pointer shadow-sm"
            title="Xem 5 từ vựng tiếp theo"
          >
            <span>5 từ tiếp theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Search for Words & Synonyms */}
      <div className="relative mb-2 shrink-0">
        <Search className="w-3.5 h-3.5 text-[#968E84] absolute left-2.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Tìm từ vựng hoặc từ đồng nghĩa (synonyms)..."
          className="w-full bg-[#FAF8F5] border border-[#DDD6CB] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#2B2826] placeholder-[#968E84] outline-none focus:border-[#4A5D4E] transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setPageIndex(0);
            }}
            className="absolute right-2.5 top-1 text-sm text-[#7A7369] hover:text-[#2B2826] font-bold"
            title="Xóa tìm kiếm"
          >
            ×
          </button>
        )}
      </div>

      {/* Celebratory Banner when 100% of vocabularies in this topic are learned */}
      {isAllKnown && (
        <div className="p-3 mb-2 rounded-2xl bg-[#FAF8F5] border border-[#CAD8C8] shadow-sm space-y-2 shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <h4 className="text-xs font-black text-[#2B2826] flex items-center gap-1.5">
                <span>Xuất sắc! Bạn đã học hết {vocabularies.length}/{vocabularies.length} từ vựng</span>
                <span className="px-1.5 py-0.2 rounded bg-[#EDF3EE] text-[#3D5240] text-[10px] font-mono border border-[#CAD8C8]">100%</span>
              </h4>
              <p className="text-[11px] text-[#7A7369] leading-snug">
                Bạn đã nắm vững toàn bộ từ vựng chủ đề này. Hãy chọn hành động tiếp theo:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#E7E2D9]">
            {onGoFullEssay && (
              <button
                type="button"
                onClick={onGoFullEssay}
                className="col-span-2 py-1.5 px-3 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5 text-[#E0EAE1]" />
                <span>Viết Full Bài Essay ngay (Tab 4)</span>
              </button>
            )}

            {onNextTopic && (
              <button
                type="button"
                onClick={onNextTopic}
                className="py-1 px-2.5 rounded-xl bg-[#F2EFE9] hover:bg-[#EAE5DC] text-[#2B2826] font-bold text-xs flex items-center justify-center gap-1 transition border border-[#DDD6CB] cursor-pointer"
              >
                <span>Chủ đề tiếp theo</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#4A5D4E]" />
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTopicWords}
              className="py-1 px-2.5 rounded-xl bg-[#F2EFE9] hover:bg-[#EAE5DC] text-[#5A524A] font-medium text-xs flex items-center justify-center gap-1 transition border border-[#DDD6CB] cursor-pointer"
              title="Bỏ đánh dấu đã biết các từ này để ôn tập lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B88728]" />
              <span>Ôn tập lại từ</span>
            </button>

            {onOpenSourcesModal && (
              <button
                type="button"
                onClick={onOpenSourcesModal}
                className="col-span-2 py-1 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#4A5D4E] border border-[#CAD8C8] font-semibold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nguồn bổ sung chủ đề &amp; từ vựng mới</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vocabulary List with Synonyms and Meanings */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin py-1">
        {currentBatch.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#968E84]">
            Không tìm thấy từ vựng nào khớp với từ khóa "{searchQuery}".
          </div>
        ) : (
          currentBatch.map((vocab) => {
            const isSelected = selectedVocab?.id === vocab.id;
            const isKnown = knownWordIds.includes(vocab.id);

            return (
              <div
                key={vocab.id}
                onClick={() => handlePracticeWord(vocab)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left select-none flex flex-col gap-2 ${
                  isSelected
                    ? "bg-[#F5F8F5] border-[#4A5D4E] shadow-sm ring-1 ring-[#4A5D4E]"
                    : isKnown
                      ? "bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border-[#E7E2D9] opacity-80"
                      : "bg-white hover:bg-[#FAF8F5] border-[#E7E2D9] hover:border-[#CAD8C8] shadow-sm"
                }`}
              >
                {/* TỪ VỰNG VÀ PHIÊN ÂM (IPA) */}
                <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-sm sm:text-base font-extrabold tracking-tight ${
                      isSelected ? "text-[#2B2826]" : isKnown ? "text-[#5A524A]" : "text-[#2B2826]"
                    }`}>
                      {vocab.word}
                    </span>

                    {vocab.ipa && (
                      <span className="text-xs font-mono text-[#4A5D4E] italic font-semibold">
                        {vocab.ipa}
                      </span>
                    )}

                    <span className="text-[10px] text-[#8E867B] font-sans">
                      ({vocab.partOfSpeech || "từ vựng"})
                    </span>
                  </div>

                  {isKnown && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDF3EE] text-[#3D5240] border border-[#CAD8C8] font-medium flex items-center gap-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" /> Đã biết
                    </span>
                  )}
                </div>

                {/* NGHĨA TIẾNG VIỆT */}
                {vocab.meaning && (
                  <div className="text-xs text-[#3A3633] font-medium leading-snug">
                    <span className="text-[#B88758] font-bold mr-1">Nghĩa:</span>
                    <span>{vocab.meaning}</span>
                  </div>
                )}

                {/* TỪ ĐỒNG NGHĨA (SYNONYMS) - ĐỒNG BỘ VỚI FLASHCARDS */}
                {vocab.synonyms && vocab.synonyms.length > 0 && (
                  <div className="pt-1.5 border-t border-[#EFECE5] space-y-1">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B88758] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Từ đồng nghĩa (Synonyms):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vocab.synonyms.map((syn, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs px-2 py-0.5 rounded-md bg-[#FAF4EE] border border-[#EADBCC] text-[#785334] font-mono font-medium hover:bg-[#F4ECE3] transition cursor-default select-text"
                          title={`Từ đồng nghĩa Band 7.5+ của "${vocab.word}": ${syn}`}
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLLOCATIONS ĂN ĐIỂM (NẾU CÓ) */}
                {vocab.collocations && vocab.collocations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {vocab.collocations.slice(0, 2).map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDF3EE] text-[#3D5240] border border-[#CAD8C8] font-medium"
                        title={`Collocation: ${col}`}
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}

                {/* 2 NÚT LỰA CHỌN: "Tôi đã biết" & "Luyện tập" */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  {/* Nút 1: Tôi đã biết */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleKnown(e, vocab.id)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer ${
                      isKnown
                        ? "bg-[#EDF3EE] text-[#3D5240] hover:bg-[#E2ECE3] border border-[#CAD8C8]"
                        : "bg-[#F2EFE9] hover:bg-[#EAE5DC] text-[#6E675E] hover:text-[#2B2826] border border-[#DDD6CB]"
                    }`}
                    title={isKnown ? "Nhấn để bỏ đánh dấu đã biết" : "Đánh dấu đã biết để không ưu tiên hiển thị lần sau"}
                  >
                    {isKnown ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#3D5240]" />
                        <span>Đã biết</span>
                      </>
                    ) : (
                      <span>Tôi đã biết</span>
                    )}
                  </button>

                  {/* Nút 2: Luyện tập */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePracticeWord(vocab);
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-[#4A5D4E] text-white ring-1 ring-[#3D4E41]"
                        : "bg-[#4A5D4E] hover:bg-[#3D4E41] text-white"
                    }`}
                    title="Bắt đầu 3 phần luyện tập từ này"
                  >
                    <PenTool className="w-3 h-3" />
                    <span>Luyện tập</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom pagination status */}
      {totalPages > 1 && (
        <div className="pt-2 border-t border-[#E7E2D9] flex items-center justify-between text-[11px] text-[#7A7369] shrink-0">
          <span>Trang {pageIndex + 1} / {totalPages}</span>
          <button
            type="button"
            onClick={handleNextPage}
            className="text-[#4A5D4E] hover:text-[#3D4E41] font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Sang 5 từ tiếp theo</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
}
