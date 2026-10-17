import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  CheckCircle2, 
  Bookmark, 
  X, 
  Shuffle, 
  RotateCcw,
  Check
} from 'lucide-react';
import { speakWord, playCorrectSound, playFlipSound } from '../services/soundEffects';
import { 
  getFlashcardProgress, 
  recordCardResult, 
  isWordMastered 
} from '../services/flashcardService';
import { MASTER_TOPIC_CATEGORIES } from '../data/topicCategories';

export default function MobileVocabWorkspace({
  topics = [],
  selectedTopic,
  onSelectTopic,
  onRandomTopic,
  activeTask = 'task2',
  selectedVocab,
  onSelectVocab,
  studentEmail,
  onOpenFlashcard,
  onOpenSourcesModal,
  onNextTopic
}) {
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showWordListModal, setShowWordListModal] = useState(false);
  const [progress, setProgress] = useState(() => getFlashcardProgress());
  const [touchStartX, setTouchStartX] = useState(null);

  const vocabList = useMemo(() => {
    return selectedTopic?.vocabularies || [];
  }, [selectedTopic]);

  // Current word index within the selected topic
  const currentIndex = useMemo(() => {
    if (!selectedVocab || vocabList.length === 0) return 0;
    const foundIdx = vocabList.findIndex(v => (v.id && v.id === selectedVocab.id) || v.word.toLowerCase() === selectedVocab.word.toLowerCase());
    return foundIdx >= 0 ? foundIdx : 0;
  }, [selectedVocab, vocabList]);

  const currentVocab = vocabList[currentIndex] || selectedVocab || vocabList[0];

  // Auto pronounce word on change
  useEffect(() => {
    if (currentVocab?.word) {
      speakWord(currentVocab.word);
    }
  }, [currentVocab?.word]);

  const isCurrentMastered = useMemo(() => {
    return isWordMastered(currentVocab, progress);
  }, [currentVocab, progress]);

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      playFlipSound();
      const prev = vocabList[currentIndex - 1];
      if (onSelectVocab) onSelectVocab(prev);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < vocabList.length - 1) {
      playFlipSound();
      const next = vocabList[currentIndex + 1];
      if (onSelectVocab) onSelectVocab(next);
    } else if (onNextTopic) {
      playFlipSound();
      onNextTopic();
    }
  };

  const handleToggleMastery = () => {
    if (!currentVocab) return;
    const nextState = !isCurrentMastered;
    const updated = recordCardResult(currentVocab, nextState);
    setProgress(updated);
    if (nextState) {
      playCorrectSound();
    }
  };

  const handleSpeak = (e) => {
    if (e) e.stopPropagation();
    if (currentVocab?.word) {
      speakWord(currentVocab.word);
    }
  };

  // Touch swipe support: Swipe left for next, Swipe right for prev
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    if (diffX < -50) {
      // Swiped left -> next
      handleNextWord();
    } else if (diffX > 50) {
      // Swiped right -> prev
      handlePrevWord();
    }
    setTouchStartX(null);
  };

  const totalWords = vocabList.length;
  const progressPercent = totalWords > 0 ? Math.round(((currentIndex + 1) / totalWords) * 100) : 0;

  return (
    <div className="h-full max-h-[calc(100dvh-3.5rem-4.5rem)] flex flex-col justify-between overflow-hidden p-2.5 sm:p-3 select-none pb-2">
      
      {/* 1. TOP BAR: Topic Picker & Word Counter */}
      <div className="flex items-center justify-between gap-1.5 shrink-0">
        
        {/* Topic Selector Button */}
        <button
          type="button"
          onClick={() => setShowTopicModal(true)}
          className="flex-1 min-w-0 flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6E2D8] hover:border-[#3E4F42]/40 text-xs font-semibold text-[#24211E] shadow-2xs cursor-pointer truncate"
          title="Bấm để đổi chủ đề"
        >
          <span className="truncate">
            {selectedTopic?.vietnameseName || selectedTopic?.name || "Chọn chủ đề"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#7A7369] shrink-0" />
        </button>

        {/* Word Counter & Word List Sheet Toggle */}
        <button
          type="button"
          onClick={() => setShowWordListModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#E6E2D8] hover:border-[#3E4F42]/40 text-xs font-medium text-[#3E4F42] shadow-2xs cursor-pointer shrink-0"
          title="Xem danh sách từ trong chủ đề"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#3E4F42]" />
          <span className="font-mono font-bold">{currentIndex + 1}/{totalWords}</span>
        </button>

        {/* Flashcard Shortcut */}
        {onOpenFlashcard && (
          <button
            type="button"
            onClick={onOpenFlashcard}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#EDF3EE] hover:bg-[#3E4F42] text-[#3E4F42] hover:text-white border border-[#3E4F42]/20 text-xs font-semibold shadow-2xs cursor-pointer transition shrink-0"
            title="Mở Thẻ Flashcards"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flashcard</span>
          </button>
        )}
      </div>

      {/* 2. CENTER: THE NO-SCROLL INTERACTIVE VOCABULARY CARD */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 min-h-0 flex flex-col justify-between bg-white border border-[#E6E2D8] rounded-3xl p-4 shadow-xs my-2 overflow-hidden"
      >
        {/* Card Top: Badges & Mastery Button */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
              Band 8.0 • C1
            </span>
            {currentVocab?.partOfSpeech && (
              <span className="text-[11px] font-mono italic text-[#7A7369] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E2D8]">
                ({currentVocab.partOfSpeech})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleMastery}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isCurrentMastered
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                : "bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentMastered ? "text-emerald-600" : "text-[#7A7369]"}`} />
            <span>{isCurrentMastered ? "Đã thuộc" : "Đánh dấu thuộc"}</span>
          </button>
        </div>

        {/* Card Middle: Hero Word, IPA, Pronounce */}
        <div className="flex flex-col items-center justify-center text-center my-auto py-2 shrink-0">
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24211E] tracking-tight">
              {currentVocab?.word}
            </h2>
            <button
              type="button"
              onClick={handleSpeak}
              className="p-2 rounded-2xl bg-[#EDF3EE] hover:bg-[#3E4F42] text-[#3E4F42] hover:text-white border border-[#3E4F42]/20 transition transform active:scale-95 cursor-pointer shadow-xs"
              title="Nghe phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {currentVocab?.ipa && (
            <div className="mt-1 text-xs sm:text-sm font-mono text-[#7A7369] font-medium">
              {currentVocab.ipa}
            </div>
          )}
        </div>

        {/* Meaning Highlight Box */}
        <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E6E2D8] text-center shrink-0">
          <div className="text-[10px] font-bold text-[#3E4F42] uppercase tracking-wider mb-0.5">
            Nghĩa tiếng Việt
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#24211E] leading-snug">
            {currentVocab?.meaning || currentVocab?.definitionEn || currentVocab?.word}
          </p>
        </div>

        {/* Collocations */}
        {currentVocab?.collocations && currentVocab.collocations.length > 0 && (
          <div className="py-1 shrink-0">
            <div className="text-[10px] font-bold text-[#7A7369] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-[#3E4F42]" />
              <span>Collocations ăn điểm:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {currentVocab.collocations.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-[#EDF3EE] border border-[#3E4F42]/20 text-[#3E4F42] font-medium truncate max-w-full"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Context Sentence */}
        {(currentVocab?.modelSentence || currentVocab?.exampleSentence) && (
          <div className="p-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-0.5 shrink-0">
            <p className="font-serif italic text-[#24211E] leading-snug line-clamp-2">
              "{currentVocab.modelSentence || currentVocab.exampleSentence}"
            </p>
            {currentVocab.vietnameseSentence && (
              <p className="text-[10px] text-[#7A7369] leading-tight line-clamp-1">
                &rarr; {currentVocab.vietnameseSentence}
              </p>
            )}
          </div>
        )}

        {/* Swipe Hint */}
        <div className="text-center pt-1 text-[10px] text-[#7A7369] flex items-center justify-center gap-1 shrink-0">
          <span>&larr; Vuốt sang trái / phải để chuyển từ &rarr;</span>
        </div>
      </div>

      {/* 3. BOTTOM CONTROLS: Previous / Pronounce / Next */}
      <div className="space-y-1.5 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevWord}
            disabled={currentIndex === 0}
            className={`py-2.5 px-3 rounded-2xl border font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              currentIndex === 0
                ? "bg-[#FAF8F5] text-[#A8A29E] border-[#E6E2D8] cursor-not-allowed opacity-50"
                : "bg-white text-[#24211E] hover:bg-[#FAF8F5] border-[#E6E2D8] shadow-2xs"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </button>

          {/* Pronounce Again */}
          <button
            type="button"
            onClick={handleSpeak}
            className="py-2.5 px-3 rounded-2xl bg-[#EDF3EE] hover:bg-[#D7E6D9] text-[#3E4F42] border border-[#3E4F42]/20 font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Phát âm</span>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextWord}
            className="py-2.5 px-3 rounded-2xl bg-[#3E4F42] hover:bg-[#334237] text-white border border-[#2D3A30] font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
          >
            <span>{currentIndex === vocabList.length - 1 ? "Chủ đề kế" : "Tiếp theo"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Topic Progress Bar */}
        <div className="w-full h-1 bg-[#F4EFEA] rounded-full overflow-hidden border border-[#E6E2D8]/60">
          <div 
            className="h-full bg-[#3E4F42] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ================= MODAL 1: CHỌN CHỦ ĐỀ (10 CHỦ ĐỀ IELTS) ================= */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div 
            onClick={() => setShowTopicModal(false)}
            className="flex-1"
          />
          <div className="bg-white rounded-t-3xl border-t border-[#E6E2D8] p-4 max-h-[75vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <h3 className="font-title font-bold text-base text-[#24211E]">Chọn Chủ Đề IELTS</h3>
                <p className="text-[11px] text-[#7A7369]">10 nhóm chủ đề chuẩn từ vựng C1-C2</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A7369] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-1">
              {topics.map((t) => {
                const isSelected = selectedTopic?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (onSelectTopic) onSelectTopic(t);
                      if (onSelectVocab && t.vocabularies?.[0]) {
                        onSelectVocab(t.vocabularies[0]);
                      }
                      setShowTopicModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#EDF3EE] text-[#3E4F42] font-bold border border-[#3E4F42]/30"
                        : "text-[#24211E] hover:bg-[#FAF8F5] border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{t.vietnameseName || t.name}</div>
                      <div className="text-[10px] text-[#7A7369] font-mono mt-0.5">{t.name} • {t.vocabularies?.length || 0} từ</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#3E4F42]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: DANH SÁCH TỪ TRONG CHỦ ĐỀ ================= */}
      {showWordListModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div 
            onClick={() => setShowWordListModal(false)}
            className="flex-1"
          />
          <div className="bg-white rounded-t-3xl border-t border-[#E6E2D8] p-4 max-h-[75vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <h3 className="font-title font-bold text-base text-[#24211E]">
                  {selectedTopic?.vietnameseName || "Từ vựng"} ({vocabList.length} từ)
                </h3>
                <p className="text-[11px] text-[#7A7369]">Chạm vào từ để xem chi tiết ngay</p>
              </div>
              <button
                type="button"
                onClick={() => setShowWordListModal(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A7369] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-1">
              {vocabList.map((v, idx) => {
                const isSelected = (v.id && v.id === currentVocab?.id) || v.word === currentVocab?.word;
                const mastered = isWordMastered(v, progress);
                return (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => {
                      if (onSelectVocab) onSelectVocab(v);
                      setShowWordListModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#EDF3EE] text-[#3E4F42] font-bold border border-[#3E4F42]/30"
                        : "text-[#24211E] hover:bg-[#FAF8F5] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] font-mono text-[#7A7369] w-5 text-right shrink-0">{idx + 1}.</span>
                      <div className="min-w-0 truncate">
                        <div className="text-xs font-serif font-bold text-[#24211E] truncate">{v.word}</div>
                        <div className="text-[11px] text-[#7A7369] truncate">{v.meaning}</div>
                      </div>
                    </div>
                    {mastered ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-[#3E4F42] shrink-0 ml-1.5" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
