import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  Highlighter, 
  Search,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Binary,
  X,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { getXRaySentencesForPassage } from '../../data/readingEnhancements';

export default function ReadingPassageViewer({
  passage,
  mode = "practice", // "practice" | "test"
  selectedVocab,
  onSelectVocab,
  isSubmitted = false,
  questions = [],
  fontSize = "base", // "sm" | "base" | "lg"
  onChangeFontSize
}) {
  const [highlightVocab, setHighlightVocab] = useState(true);
  const [selectedTextSnippet, setSelectedTextSnippet] = useState(null);
  const [isXRayActive, setIsXRayActive] = useState(false);
  const [selectedXRayIndex, setSelectedXRayIndex] = useState(0);
  const [isXRayModalOpen, setIsXRayModalOpen] = useState(false);
  const containerRef = useRef(null);

  // X-Ray Sentence breakdowns
  const xraySentences = useMemo(() => {
    return getXRaySentencesForPassage(passage);
  }, [passage]);

  // Map of lowercase words to vocab objects for lightning-fast token matching
  const vocabMap = useMemo(() => {
    const map = new Map();
    if (!passage?.vocabularies) return map;
    passage.vocabularies.forEach(v => {
      if (v.word) {
        map.set(v.word.toLowerCase().trim(), v);
      }
    });
    return map;
  }, [passage]);

  // List of evidence quotes to highlight after submission
  const evidenceQuotes = useMemo(() => {
    if (!isSubmitted || !questions) return [];
    return questions
      .filter(q => q.evidenceQuote)
      .map(q => ({
        quote: q.evidenceQuote.toLowerCase().trim(),
        paragraphRef: q.paragraphRef,
        questionId: q.id
      }));
  }, [isSubmitted, questions]);

  // Handle user mouse text selection for looking up any arbitrary word
  const handleMouseUp = () => {
    if (mode !== 'practice') return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedTextSnippet(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length >= 2 && text.length <= 40 && !text.includes('\n')) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectedTextSnippet({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    } else {
      setSelectedTextSnippet(null);
    }
  };

  const handleLookupSelection = () => {
    if (!selectedTextSnippet) return;
    const clean = selectedTextSnippet.text.toLowerCase().replace(/[^a-z0-9\s-]/gi, '').trim();
    // Check if it exists in vocabMap
    if (vocabMap.has(clean)) {
      onSelectVocab(vocabMap.get(clean));
    } else {
      // Create quick lookup object
      onSelectVocab({
        word: selectedTextSnippet.text,
        ipa: "",
        pos: "từ trong bài",
        meaning: `Đang tra cứu từ "${selectedTextSnippet.text}" trong bài đọc`,
        definition: `Selected from passage text: "${selectedTextSnippet.text}"`,
        contextSentence: selectedTextSnippet.text
      });
    }
    setSelectedTextSnippet(null);
  };

  // Font size class mapping
  const fontClass = fontSize === 'sm' 
    ? 'text-xs sm:text-[13px] leading-relaxed' 
    : fontSize === 'lg' 
    ? 'text-sm sm:text-base leading-loose' 
    : 'text-xs sm:text-sm leading-relaxed';

  // Render paragraph content with interactive clickable words in practice mode
  const renderParagraphContent = (paragraphText, paragraphId) => {
    if (!paragraphText) return null;

    // Check if this paragraph contains evidence quotes when submitted
    if (isSubmitted) {
      let isEvidence = false;
      let matchedEvidence = null;
      for (const ev of evidenceQuotes) {
        if (ev.paragraphRef === paragraphId || paragraphText.toLowerCase().includes(ev.quote.slice(0, 30))) {
          isEvidence = true;
          matchedEvidence = ev;
          break;
        }
      }

      if (isEvidence) {
        return (
          <div className="relative pl-3 border-l-2 border-[#A67C52] bg-[#FAF5EE]/70 p-2.5 rounded-r-xl">
            <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1 flex items-center gap-1">
              <span>🎯 Đoạn chứa bằng chứng đáp án ({matchedEvidence?.paragraphRef ? `Đoạn ${matchedEvidence.paragraphRef}` : ''})</span>
            </span>
            <p className="font-serif text-[#24211E] select-text">
              {paragraphText}
            </p>
          </div>
        );
      }
    }

    // In Exam/Test Mode (and not submitted): display clean text without hints
    if (mode === 'test' && !isSubmitted) {
      return (
        <p className="font-serif text-[#24211E] select-text">
          {paragraphText}
        </p>
      );
    }

    // In Study/Practice Mode: tokenize and make C1/C2 words clickable
    const words = paragraphText.split(/(\s+|[.,;!?"()]+)/);

    return (
      <p className="font-serif text-[#24211E] select-text">
        {words.map((token, idx) => {
          const cleanToken = token.toLowerCase().trim();
          const vocabData = vocabMap.get(cleanToken);

          if (vocabData && highlightVocab) {
            const isSelected = selectedVocab?.word?.toLowerCase() === cleanToken;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVocab(vocabData);
                }}
                className={`inline-block font-sans rounded px-1 py-0.2 mx-0.5 font-semibold transition cursor-pointer text-left ${
                  isSelected
                    ? "bg-[#3E4F42] text-white shadow-2xs scale-105"
                    : "bg-[#EDF3EE] text-[#3E4F42] hover:bg-[#D1DDD3] border-b border-[#3E4F42]/40"
                }`}
                title={`Click để tra từ: "${vocabData.word}" (${vocabData.meaning || vocabData.pos})`}
              >
                {token}
              </button>
            );
          }

          return <span key={idx}>{token}</span>;
        })}
      </p>
    );
  };

  return (
    <div 
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="flex flex-col h-full bg-white border border-[#E6E2D8] rounded-2xl shadow-xs overflow-hidden relative"
    >
      
      {/* Top Passage Toolbar */}
      <div className="p-3 sm:p-3.5 border-b border-[#E6E2D8] bg-[#FAF8F5] flex items-center justify-between gap-2 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-[#3E4F42] border border-[#D1DDD3]">
                {passage?.passageType || "Passage 1"}
              </span>
              <span className="text-[10px] text-[#7A7369] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#7A7369]" />
                {passage?.readingTimeMinutes || 20} phút • {passage?.wordCount || 800} từ
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Nút Bật/Tắt X-Ray Cấu Trúc Câu */}
          {xraySentences.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsXRayActive(prev => !prev);
                if (!isXRayActive) {
                  setIsXRayModalOpen(true);
                  setSelectedXRayIndex(0);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isXRayActive 
                  ? "bg-[#3E4F42] text-white border-[#3E4F42] shadow-2xs" 
                  : "bg-white text-[#3E4F42] border-[#D1DDD3] hover:bg-[#EDF3EE]"
              }`}
              title="Mổ xẻ câu phức & Dịch song ngữ học thuật"
            >
              <Binary className="w-3 h-3" />
              <span>X-Ray Cấu trúc</span>
              <span className={`text-[10px] font-mono px-1 rounded ${
                isXRayActive ? "bg-white/20 text-white" : "bg-[#EDF3EE] text-[#3E4F42]"
              }`}>
                {xraySentences.length}
              </span>
            </button>
          )}

          {mode === 'practice' && (
            <button
              type="button"
              onClick={() => setHighlightVocab(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                highlightVocab 
                  ? "bg-[#EDF3EE] text-[#3E4F42] border-[#D1DDD3]" 
                  : "bg-white text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
              }`}
              title="Bật/Tắt gạch chân từ vựng trong bài đọc"
            >
              <Highlighter className="w-3 h-3" />
              <span className="hidden sm:inline">Từ vựng</span>
            </button>
          )}

          {/* Font size toggles */}
          <div className="flex items-center border border-[#E6E2D8] rounded-lg bg-white p-0.5">
            <button
              type="button"
              onClick={() => onChangeFontSize && onChangeFontSize('sm')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                fontSize === 'sm' ? "bg-[#3E4F42] text-white" : "text-[#7A7369] hover:text-[#24211E]"
              }`}
              title="Cỡ chữ nhỏ"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize && onChangeFontSize('base')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                fontSize === 'base' ? "bg-[#3E4F42] text-white" : "text-[#7A7369] hover:text-[#24211E]"
              }`}
              title="Cỡ chữ chuẩn"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize && onChangeFontSize('lg')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                fontSize === 'lg' ? "bg-[#3E4F42] text-white" : "text-[#7A7369] hover:text-[#24211E]"
              }`}
              title="Cỡ chữ lớn"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Mode Status Ribbon */}
      {mode === 'practice' && (
        <div className="px-3.5 py-1.5 bg-[#FAF5EE] border-b border-[#E6E2D8] flex items-center justify-between text-[11px] text-[#A67C52] shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A67C52]" />
            <span>Chế độ Luyện Tập: <strong>Click trực tiếp vào từ vựng được tô sáng</strong> hoặc bôi đen chữ để tra cứu tức thì.</span>
          </div>
          <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-[#E6E2D8]">
            {passage?.vocabularies?.length || 0} từ C1/C2
          </span>
        </div>
      )}

      {/* Floating Tooltip when selecting arbitrary text */}
      {selectedTextSnippet && (
        <div 
          style={{ 
            position: 'fixed', 
            left: `${selectedTextSnippet.x}px`, 
            top: `${selectedTextSnippet.y}px`, 
            transform: 'translate(-50%, -100%)' 
          }}
          className="z-50 bg-[#24211E] text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-fadeIn cursor-pointer hover:bg-[#3E4F42]"
          onClick={handleLookupSelection}
        >
          <Search className="w-3 h-3 text-[#EDF3EE]" />
          <span>Tra từ: "{selectedTextSnippet.text.slice(0, 15)}..."</span>
        </div>
      )}

      {/* Passage Text Content (Scrollable) */}
      <div className={`flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin ${fontClass}`}>
        
        {/* Title Header */}
        <div className="space-y-1.5 pb-3 border-b border-[#E6E2D8]">
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#24211E] leading-snug">
            {passage?.title}
          </h2>
          {passage?.subtitle && (
            <p className="text-xs sm:text-sm text-[#7A7369] font-serif italic">
              {passage.subtitle}
            </p>
          )}
        </div>

        {/* Paragraphs List */}
        <div className="space-y-4">
          {passage?.paragraphs?.map((p) => {
            const paraXRay = xraySentences.find(x => x.paragraphId === p.id);
            return (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-xs text-[#3E4F42] bg-[#EDF3EE] px-1.5 py-0.5 rounded border border-[#D1DDD3] shrink-0">
                    {p.id}
                  </span>
                  <div className="flex-1">
                    {renderParagraphContent(p.text, p.id)}
                  </div>
                </div>

                {/* X-Ray Pill when mode is active */}
                {isXRayActive && paraXRay && (
                  <div className="ml-7 p-2 rounded-xl bg-[#EDF3EE]/80 border border-[#D1DDD3] text-xs flex items-center justify-between gap-2 animate-in fade-in-50">
                    <div className="flex items-center gap-1.5 text-[#3E4F42] overflow-hidden">
                      <Binary className="w-3.5 h-3.5 text-[#3E4F42] shrink-0" />
                      <span className="font-bold shrink-0">X-Ray Đoạn {p.id}:</span>
                      <span className="italic truncate text-[11px] font-serif text-[#24211E]">
                        "{paraXRay.fullSentence.slice(0, 45)}..."
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const idx = xraySentences.findIndex(x => x.id === paraXRay.id);
                        setSelectedXRayIndex(idx >= 0 ? idx : 0);
                        setIsXRayModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-[#3E4F42] hover:text-white text-[#3E4F42] border border-[#D1DDD3] font-bold text-[10px] transition cursor-pointer flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span>Mổ xẻ câu</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* End of Passage note */}
        <div className="pt-4 border-t border-[#E6E2D8] text-center text-xs text-[#7A7369] italic font-serif">
          — Hết Bài Đọc ({passage?.title}) —
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SENTENCE SURGERY MODAL (MỔ XẺ CẤU TRÚC CÂU & DỊCH SONG NGỮ) */}
      {/* ========================================================================= */}
      {isXRayModalOpen && xraySentences.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-[#E6E2D8] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border-b border-[#E6E2D8] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EDF3EE] text-[#3E4F42] flex items-center justify-center font-bold">
                  <Binary className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#24211E]">
                      Mổ Xẻ Cấu Trúc Câu (Sentence Surgery)
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#A67C52] border border-[#E6E2D8]">
                      Câu {selectedXRayIndex + 1}/{xraySentences.length} (Đoạn {xraySentences[selectedXRayIndex]?.paragraphId})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A7369]">
                    Phân tích thành phần ngữ pháp nòng cốt và bản dịch song ngữ học thuật
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsXRayModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              
              {/* Full sentence */}
              <div>
                <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">
                  CÂU HỌC THUẬT GỐC (FULL ACADEMIC SENTENCE):
                </span>
                <div className="text-xs sm:text-sm font-serif italic text-[#24211E] bg-[#FAF8F5] p-3 rounded-xl border border-[#E6E2D8] leading-relaxed">
                  "{xraySentences[selectedXRayIndex]?.fullSentence}"
                </div>
              </div>

              {/* Clause Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                    🟢 CHỦ NGỮ CHÍNH (SUBJECT):
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 font-serif">
                    {xraySentences[selectedXRayIndex]?.coreSubject}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                    🟢 ĐỘNG TỪ & VỊ NGỮ CHÍNH (MAIN VERB):
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 font-serif">
                    {xraySentences[selectedXRayIndex]?.coreVerb}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-0.5">
                    🔵 MỆNH ĐỀ PHỤ / QUAN HỆ (SUBORDINATE CLAUSES):
                  </span>
                  <p className="text-xs text-sky-950">
                    {xraySentences[selectedXRayIndex]?.subordinateClause}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-0.5">
                    🟣 LIÊN TỪ & TRẠNG TỪ LIÊN KẾT (CONNECTORS):
                  </span>
                  <p className="text-xs text-purple-950">
                    {xraySentences[selectedXRayIndex]?.connectors}
                  </p>
                </div>
              </div>

              {/* Vietnamese Bilingual Translation */}
              <div className="p-3.5 rounded-xl bg-[#EDF3EE] border border-[#D1DDD3]">
                <span className="text-[10px] font-bold text-[#3E4F42] uppercase tracking-wider block mb-1">
                  🇻🇳 DỊCH NGHĨA HỌC THUẬT SONG NGỮ (ACADEMIC VIETNAMESE):
                </span>
                <p className="text-xs sm:text-sm text-[#24211E] leading-relaxed font-medium">
                  {xraySentences[selectedXRayIndex]?.vietnameseTranslation}
                </p>
              </div>

              {/* Grammar Insights & Key Chunk */}
              <div className="space-y-2">
                {xraySentences[selectedXRayIndex]?.grammarAnalysis && (
                  <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#E6E2D8] text-xs text-[#24211E] flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#A67C52] text-[11px] mb-0.5">Phân Tích Ngữ Pháp Band 7.5+:</strong>
                      <span>{xraySentences[selectedXRayIndex].grammarAnalysis}</span>
                    </div>
                  </div>
                )}

                {xraySentences[selectedXRayIndex]?.keyVocabChunk && (
                  <div className="text-xs text-[#7A7369] bg-white p-2.5 rounded-xl border border-[#E6E2D8] flex items-center justify-between">
                    <span>📚 <strong>Cụm từ then chốt:</strong> {xraySentences[selectedXRayIndex].keyVocabChunk}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Navigation */}
            <div className="p-3 sm:p-4 bg-[#FAF8F5] border-t border-[#E6E2D8] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedXRayIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedXRayIndex === 0}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 text-xs font-semibold text-[#24211E] transition cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Câu trước</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedXRayIndex(prev => Math.min(xraySentences.length - 1, prev + 1))}
                  disabled={selectedXRayIndex === xraySentences.length - 1}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] disabled:opacity-40 text-xs font-semibold text-[#24211E] transition cursor-pointer flex items-center gap-1"
                >
                  <span>Câu tiếp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsXRayModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#344237] text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
