import { 
  BookOpen, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  PenTool, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { getKnownWords, toggleKnownWord } from '../services/userService';

export default function VocabularyList({ 
  vocabularies = [], 
  selectedVocab, 
  onSelectVocab, 
  studentEmail,
  onStartPractice,
  onOpenFlashcard
}) {
  const [knownWordIds, setKnownWordIds] = useState(() => getKnownWords(studentEmail));
  const [pageIndex, setPageIndex] = useState(0);
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

  // Total pages based on 5 words per batch
  const totalPages = Math.max(1, Math.ceil(sortedVocabs.length / PAGE_SIZE));

  // Current batch of 5 words
  const currentBatch = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return sortedVocabs.slice(start, start + PAGE_SIZE);
  }, [sortedVocabs, pageIndex]);

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

  const startWordIdx = pageIndex * PAGE_SIZE + 1;
  const endWordIdx = Math.min((pageIndex + 1) * PAGE_SIZE, sortedVocabs.length);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Top Header: Title & Pagination Action */}
      <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 text-blue-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
              Từ vựng trọng tâm ({sortedVocabs.length})
            </h3>
            <span className="text-[10px] text-slate-400">
              Hiện từ {startWordIdx}-{endWordIdx} • Đã biết: {knownWordIds.length}
            </span>
          </div>
        </div>

        {/* Actions: Flashcard shortcut + Nút chọn 5 từ vựng tiếp theo */}
        <div className="flex items-center gap-1.5">
          {onOpenFlashcard && (
            <button
              type="button"
              onClick={onOpenFlashcard}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
              title="Học bộ từ này theo dạng Flashcard Duolingo"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">Flashcard</span>
            </button>
          )}

          {totalPages > 1 && (
            <button
              type="button"
              onClick={handlePrevPage}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="5 từ trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNextPage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition cursor-pointer shadow-sm"
            title="Xem 5 từ vựng tiếp theo"
          >
            <span>5 từ tiếp theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vocabulary List: CHỈ HIỆN PHIÊN ÂM VÀ 2 NÚT LỰA CHỌN */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin py-1">
        {currentBatch.map((vocab) => {
          const isSelected = selectedVocab?.id === vocab.id;
          const isKnown = knownWordIds.includes(vocab.id);

          return (
            <div
              key={vocab.id}
              onClick={() => handlePracticeWord(vocab)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left select-none flex flex-col gap-2 ${
                isSelected
                  ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-950/40 ring-1 ring-blue-500/60"
                  : isKnown
                    ? "bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/60 opacity-80"
                    : "bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* CHỈ HIỆN: TỪ VỰNG VÀ PHIÊN ÂM (IPA) */}
              <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className={`text-sm sm:text-base font-extrabold tracking-tight ${
                    isSelected ? "text-white" : isKnown ? "text-slate-300" : "text-white"
                  }`}>
                    {vocab.word}
                  </span>

                  {vocab.ipa && (
                    <span className="text-xs font-mono text-blue-300 italic font-semibold">
                      {vocab.ipa}
                    </span>
                  )}

                  <span className="text-[10px] text-slate-400 font-sans">
                    ({vocab.partOfSpeech || "từ vựng"})
                  </span>
                </div>

                {isKnown && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-0.5 shrink-0">
                    <Check className="w-2.5 h-2.5" /> Đã biết
                  </span>
                )}
              </div>

              {/* 2 NÚT LỰA CHỌN: "Tôi đã biết" & "Luyện tập" */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {/* Nút 1: Tôi đã biết (không ưu tiên hiển thị ở những lần sau) */}
                <button
                  type="button"
                  onClick={(e) => handleToggleKnown(e, vocab.id)}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer ${
                    isKnown
                      ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                  }`}
                  title={isKnown ? "Nhấn để bỏ đánh dấu đã biết" : "Đánh dấu đã biết để không ưu tiên hiển thị lần sau"}
                >
                  {isKnown ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Đã biết</span>
                    </>
                  ) : (
                    <span>Tôi đã biết</span>
                  )}
                </button>

                {/* Nút 2: Luyện tập (kích hoạt 3 phần luyện tập bên cạnh) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePracticeWord(vocab);
                  }}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-blue-600/30 ring-1 ring-blue-400"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                  }`}
                  title="Bắt đầu 3 phần luyện tập từ này"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Luyện tập</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom pagination status */}
      {totalPages > 1 && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Trang {pageIndex + 1} / {totalPages}</span>
          <button
            type="button"
            onClick={handleNextPage}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>Sang 5 từ tiếp theo</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
}
