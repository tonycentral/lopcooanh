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
  Search,
  Volume2
} from 'lucide-react';
import { getKnownWords, toggleKnownWord, resetKnownWordsForTopic } from '../services/userService';
import { getSynonymVocab, findVocabInList } from '../services/synonymService';

export default function VocabularyList({ 
  vocabularies = [], 
  selectedVocab, 
  onSelectVocab, 
  studentEmail,
  onStartPractice,
  onOpenFlashcard,
  onGoFullEssay,
  onNextTopic,
  onOpenSourcesModal,
  isMobileView = false
}) {
  const [knownWordIds, setKnownWordIds] = useState(() => getKnownWords(studentEmail));
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicVocabs, setDynamicVocabs] = useState([]);
  const [highlightedWordId, setHighlightedWordId] = useState(null);
  const [synonymToast, setSynonymToast] = useState(null);
  const PAGE_SIZE = 5;

  // Refresh known words if studentEmail changes
  useEffect(() => {
    setKnownWordIds(getKnownWords(studentEmail));
  }, [studentEmail]);

  // Reset dynamically unlocked synonyms when base vocabularies change (e.g. switched topic)
  useEffect(() => {
    setDynamicVocabs([]);
    setHighlightedWordId(null);
    setSynonymToast(null);
  }, [vocabularies]);

  // Combined vocabularies: Original topic words + dynamically activated synonyms
  const combinedVocabs = useMemo(() => {
    if (!dynamicVocabs.length) return vocabularies || [];
    const existingWords = new Set((vocabularies || []).map(v => v.word.toLowerCase().trim()));
    const additional = dynamicVocabs.filter(v => !existingWords.has(v.word.toLowerCase().trim()));
    return [...vocabularies, ...additional];
  }, [vocabularies, dynamicVocabs]);

  // Sort vocabularies: Unlearned words FIRST, Known words LAST (Không ưu tiên hiển thị từ đã biết)
  const sortedVocabs = useMemo(() => {
    if (!combinedVocabs || combinedVocabs.length === 0) return [];
    const unlearned = [];
    const known = [];

    combinedVocabs.forEach(vocab => {
      if (knownWordIds.includes(vocab.id)) {
        known.push(vocab);
      } else {
        unlearned.push(vocab);
      }
    });

    return [...unlearned, ...known];
  }, [combinedVocabs, knownWordIds]);

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

  // Handle click on any synonym tag -> mở ngay từ vựng mới & luyện tập
  const handleSelectSynonym = (e, synWord, parentVocab) => {
    e.stopPropagation();
    if (!synWord) return;
    const cleanSyn = synWord.trim();

    // 1. Kiểm tra xem từ đã có trong danh sách hiện tại chưa
    let target = findVocabInList(cleanSyn, combinedVocabs);

    // 2. Nếu chưa có trong danh sách, lấy từ kho từ điển đồng nghĩa (Synonym Databank)
    if (!target) {
      target = getSynonymVocab(cleanSyn, parentVocab, "IELTS Writing");
      if (target) {
        setDynamicVocabs(prev => [target, ...prev]);
      }
    }

    if (target) {
      // Xóa bộ lọc tìm kiếm nếu đang lọc để hiển thị ngay từ mới
      if (searchQuery.trim()) {
        setSearchQuery('');
      }

      // Kích hoạt từ vựng mới cho toàn ứng dụng và bảng luyện tập
      if (onSelectVocab) onSelectVocab(target);
      if (onStartPractice) onStartPractice(target);

      // Định vị trang chứa từ mới và kích hoạt hiệu ứng highlight
      const targetId = target.id;
      setHighlightedWordId(targetId);

      setTimeout(() => {
        const idx = filteredVocabs.findIndex(v => 
          v.id === targetId || v.word.toLowerCase().trim() === cleanSyn.toLowerCase()
        );
        if (idx !== -1) {
          setPageIndex(Math.floor(idx / PAGE_SIZE));
        } else {
          setPageIndex(0);
        }

        setTimeout(() => setHighlightedWordId(null), 2500);
      }, 60);

      // Hiển thị thông báo Toast xác nhận
      setSynonymToast({
        word: target.word,
        meaning: target.meaning,
        parent: parentVocab.word || ""
      });
      setTimeout(() => setSynonymToast(null), 3500);
    }
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
    <div className="h-full flex flex-col overflow-hidden text-[#24211E]">
      
      {/* Top Header: Title & Pagination Action */}
      <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-[#E6E2D8] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#24211E] leading-tight">
              Từ vựng trọng tâm ({filteredVocabs.length})
            </h3>
            <span className="text-[10px] text-[#7A7369]">
              Hiện từ {startWordIdx}-{endWordIdx} • Đã biết: <strong className={isAllKnown ? "text-[#3E4F42] font-bold" : "text-[#3E4F42]"}>{topicKnownCount}/{vocabularies.length}</strong>
            </span>
          </div>
        </div>

        {/* Actions: Flashcard shortcut + Nút chọn 5 từ vựng tiếp theo */}
        <div className="flex items-center gap-1.5">
          {onOpenFlashcard && (
            <button
              type="button"
              onClick={onOpenFlashcard}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#EDF3EE] hover:bg-[#EDF3EE] text-[#334237] border border-[#D1DDD3] text-xs font-bold transition cursor-pointer shadow-sm"
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
              className="p-1 rounded-lg bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8] transition cursor-pointer"
              title="5 từ trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNextPage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white border border-[#334237] text-xs font-bold transition cursor-pointer shadow-sm"
            title="Xem 5 từ vựng tiếp theo"
          >
            <span>5 từ tiếp theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toast thông báo mở từ đồng nghĩa */}
      {synonymToast && (
        <div className="mb-2 p-2.5 rounded-xl bg-[#EDF3EE] border border-[#3E4F42]/30 text-xs text-[#24211E] flex items-center justify-between gap-2 animate-fadeIn shadow-2xs shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
            <span>
              Đã mở từ mới: <strong className="font-serif font-bold text-[#3E4F42]">{synonymToast.word}</strong>
              {synonymToast.parent && (
                <span className="text-[#7A7369] ml-1">(Đồng nghĩa của "{synonymToast.parent}")</span>
              )}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setSynonymToast(null)}
            className="text-[#7A7369] hover:text-[#24211E] text-xs px-1 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Search for Words & Synonyms */}
      <div className="relative mb-2 shrink-0">
        <Search className="w-3.5 h-3.5 text-[#7A7369] absolute left-2.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Tìm từ vựng hoặc từ đồng nghĩa (synonyms)..."
          className="w-full bg-[#FAF8F5] border border-[#E6E2D8] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#24211E] placeholder-[#7A7369] outline-none focus:border-[#3E4F42] transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setPageIndex(0);
            }}
            className="absolute right-2.5 top-1 text-sm text-[#7A7369] hover:text-[#24211E] font-bold"
            title="Xóa tìm kiếm"
          >
            ×
          </button>
        )}
      </div>

      {/* Celebratory Banner when 100% of vocabularies in this topic are learned */}
      {isAllKnown && (
        <div className="p-3 mb-2 rounded-2xl bg-[#FAF8F5] border border-[#D1DDD3] shadow-sm space-y-2 shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <h4 className="text-xs font-black text-[#24211E] flex items-center gap-1.5">
                <span>Xuất sắc! Bạn đã học hết {vocabularies.length}/{vocabularies.length} từ vựng</span>
                <span className="px-1.5 py-0.2 rounded bg-[#EDF3EE] text-[#3E4F42] text-[10px] font-mono border border-[#D1DDD3]">100%</span>
              </h4>
              <p className="text-[11px] text-[#7A7369] leading-snug">
                Bạn đã nắm vững toàn bộ từ vựng chủ đề này. Hãy chọn hành động tiếp theo:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#E6E2D8]">
            {onGoFullEssay && (
              <button
                type="button"
                onClick={onGoFullEssay}
                className="col-span-2 py-1.5 px-3 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5 text-[#EDF3EE]" />
                <span>✍️ Luyện Viết Toàn Bộ Task (Full Essay)</span>
              </button>
            )}

            {onNextTopic && (
              <button
                type="button"
                onClick={onNextTopic}
                className="py-1 px-2.5 rounded-xl bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#24211E] font-bold text-xs flex items-center justify-center gap-1 transition border border-[#E6E2D8] cursor-pointer"
              >
                <span>Chủ đề tiếp theo</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#3E4F42]" />
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTopicWords}
              className="py-1 px-2.5 rounded-xl bg-[#F4EFEA] hover:bg-[#E6E2D8] text-[#7A7369] font-medium text-xs flex items-center justify-center gap-1 transition border border-[#E6E2D8] cursor-pointer"
              title="Bỏ đánh dấu đã biết các từ này để ôn tập lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>Ôn tập lại từ</span>
            </button>

            {onOpenSourcesModal && (
              <button
                type="button"
                onClick={onOpenSourcesModal}
                className="col-span-2 py-1 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#3E4F42] border border-[#D1DDD3] font-semibold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer"
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
          <div className="p-4 text-center text-xs text-[#7A7369]">
            Không tìm thấy từ vựng nào khớp với từ khóa "{searchQuery}".
          </div>
        ) : (
          currentBatch.map((vocab) => {
            const isSelected = selectedVocab?.id === vocab.id || (selectedVocab?.word && vocab.word && selectedVocab.word.toLowerCase().trim() === vocab.word.toLowerCase().trim());
            const isHighlighted = highlightedWordId === vocab.id;
            const isKnown = knownWordIds.includes(vocab.id);

            return (
              <div
                key={vocab.id}
                onClick={() => handlePracticeWord(vocab)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left select-none flex flex-col gap-2 ${
                  isHighlighted
                    ? "bg-[#FAF8F5] border-[#3E4F42] shadow-md ring-2 ring-[#3E4F42] scale-[1.01]"
                    : isSelected
                      ? "bg-[#FAF8F5] border-[#3E4F42] shadow-xs ring-1 ring-[#3E4F42]"
                      : isKnown
                        ? "bg-white/60 hover:bg-[#FAF8F5] border-[#E6E2D8] opacity-75"
                        : "bg-white hover:bg-[#FAF8F5] border-[#E6E2D8] shadow-2xs"
                }`}
              >
                {/* TỪ VỰNG VÀ PHIÊN ÂM (IPA) */}
                <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-serif font-bold text-[#24211E]">
                      {vocab.word}
                    </span>

                    {vocab.ipa && (
                      <span className="text-xs font-mono text-[#3E4F42] font-medium">
                        {vocab.ipa}
                      </span>
                    )}

                    {vocab.partOfSpeech && (
                      <span className="text-[10px] text-[#7A7369]">
                        {vocab.partOfSpeech}
                      </span>
                    )}

                    {vocab.isFromSynonymBank && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8] font-medium font-mono">
                        Từ đồng nghĩa
                      </span>
                    )}
                  </div>

                  {isKnown && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-medium flex items-center gap-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" /> Đã biết
                    </span>
                  )}
                </div>

                {/* NGHĨA TIẾNG VIỆT */}
                {vocab.meaning && (
                  <div className="text-xs text-[#24211E] leading-relaxed">
                    <span className="text-[#A67C52] font-medium mr-1.5">Nghĩa:</span>
                    <span>{vocab.meaning}</span>
                  </div>
                )}

                {/* TỪ ĐỒNG NGHĨA - Bấm vào để mở ngay từ mới */}
                {vocab.synonyms && vocab.synonyms.length > 0 && (
                  <div className="pt-1.5 border-t border-[#F4EFEA] space-y-1">
                    <div className="text-[10px] font-medium text-[#7A7369] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#A67C52]" />
                        <span>Đồng nghĩa:</span>
                      </div>
                      <span className="text-[9px] text-[#A67C52] font-mono italic">
                        (Click để mở từ mới &amp; luyện tập)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vocab.synonyms.map((syn, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={(e) => handleSelectSynonym(e, syn, vocab)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E2D8] hover:border-[#3E4F42] hover:bg-[#EDF3EE] hover:text-[#3E4F42] text-[#24211E] font-mono transition cursor-pointer group shadow-2xs"
                          title={`Bấm để mở và luyện tập từ đồng nghĩa "${syn}"`}
                        >
                          <span>{syn}</span>
                          <span className="text-[10px] text-[#A67C52] group-hover:text-[#3E4F42] font-sans opacity-70 group-hover:opacity-100 transition group-hover:translate-x-0.5">&rarr;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLLOCATIONS */}
                {vocab.collocations && vocab.collocations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {vocab.collocations.slice(0, 2).map((col, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}

                {/* 2 NÚT HÀNH ĐỘNG */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => handleToggleKnown(e, vocab.id)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer border ${
                      isKnown
                        ? "bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3]"
                        : "bg-white hover:bg-[#FAF8F5] text-[#7A7369] border-[#E6E2D8]"
                    }`}
                  >
                    {isKnown ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#3E4F42]" />
                        <span>Đã biết</span>
                      </>
                    ) : (
                      <span>Tôi đã biết</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePracticeWord(vocab);
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                      isSelected
                        ? "bg-[#3E4F42] text-white"
                        : "bg-[#3E4F42] hover:bg-[#334237] text-white"
                    }`}
                  >
                    {isMobileView ? (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Chi tiết</span>
                      </>
                    ) : (
                      <>
                        <PenTool className="w-3 h-3" />
                        <span>Luyện tập</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom pagination status */}
      {totalPages > 1 && (
        <div className="pt-2 border-t border-[#E6E2D8] flex items-center justify-between text-[11px] text-[#7A7369] shrink-0">
          <span>Trang {pageIndex + 1} / {totalPages}</span>
          <button
            type="button"
            onClick={handleNextPage}
            className="text-[#3E4F42] hover:text-[#334237] font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Sang 5 từ tiếp theo</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
}
