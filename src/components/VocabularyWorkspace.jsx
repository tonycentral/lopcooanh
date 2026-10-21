// src/components/VocabularyWorkspace.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ClassicCardView from './flashcards/ClassicCardView';
import QuizGameView from './flashcards/QuizGameView';
import MatchPairsView from './flashcards/MatchPairsView';
import FillBlankView from './flashcards/FillBlankView';
import SentencePracticeView from './flashcards/SentencePracticeView';

import { 
  getFlashcardProgress, 
  recordCardResult, 
  addXP, 
  isWordMastered,
  isWordNeedsReview,
  shuffleArray
} from '../services/flashcardService';
import { getSynonymVocab } from '../services/synonymService';
import { playCorrectSound, playIncorrectSound } from '../services/soundEffects';
import { 
  MASTER_TOPIC_CATEGORIES, 
  getMasterCategoryId,
  get10MasterVocabTopics 
} from '../data/topicCategories';

import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Filter, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  Volume2,
  Shuffle,
  VolumeX,
  Flame,
  Zap,
  Tag,
  Bookmark,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  GraduationCap,
  Cpu,
  Leaf,
  Car,
  HeartPulse,
  Briefcase,
  TrendingUp,
  Users,
  Scale,
  Landmark
} from 'lucide-react';

const CATEGORY_ICONS = {
  education: GraduationCap,
  technology: Cpu,
  environment: Leaf,
  transport: Car,
  health: HeartPulse,
  work_career: Briefcase,
  business: TrendingUp,
  society_family: Users,
  crime_law: Scale,
  culture_arts: Landmark
};

// 10 Classified Master Topics ONLY (excluding 'ALL')
const CLASSIFIED_10_TOPICS = MASTER_TOPIC_CATEGORIES.filter(cat => cat.id !== 'ALL');

export default function VocabularyWorkspace({
  topics = [],
  selectedTopic,
  onSelectTopic,
  onRandomTopic,
  activeTask = 'task2',
  onToggleTask,
  selectedVocab,
  onSelectVocab,
  studentEmail,
  targetBand = '7.0',
  apiKey = '',
  onRefreshStats,
  onOpenSourcesModal,
  onOpenChartModal,
  onGoFullEssay,
  isMobile = false,
  initialMode = 'card'
}) {
  // Aggregate vocabularies strictly by the 10 Master Categories
  const master10Topics = useMemo(() => {
    return get10MasterVocabTopics(topics);
  }, [topics]);

  // Determine current active category ID from selectedTopic or default
  const [activeCategoryId, setActiveCategoryId] = useState(() => {
    if (selectedTopic) {
      if (CLASSIFIED_10_TOPICS.some(c => c.id === selectedTopic.id)) return selectedTopic.id;
      return selectedTopic.topicCategory || getMasterCategoryId(selectedTopic) || 'education';
    }
    return 'education';
  });

  // Current active master topic object
  const currentMasterTopic = useMemo(() => {
    return master10Topics.find(m => m.id === activeCategoryId) || master10Topics[0];
  }, [master10Topics, activeCategoryId]);

  // Practice modes: 'card' (Lật thẻ) | 'quiz' (Trắc nghiệm) | 'fill' (Điền từ) | 'match' (Ghép cặp) | 'sentence' (Luyện dịch câu AI)
  const [activeMode, setActiveMode] = useState(initialMode || 'card');

  // Search & Filter within topic
  const [searchQuery, setSearchQuery] = useState('');
  const [wordFilter, setWordFilter] = useState('all'); // 'all' | 'weak' | 'mastered'

  // Progress state
  const [progress, setProgress] = useState(() => getFlashcardProgress());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionXp, setSessionXp] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [showMobileWordList, setShowMobileWordList] = useState(false);

  // Sync initialMode if passed
  useEffect(() => {
    if (initialMode) setActiveMode(initialMode);
  }, [initialMode]);

  // Vocabularies of the current master category
  const baseVocabularies = useMemo(() => {
    return currentMasterTopic?.vocabularies || [];
  }, [currentMasterTopic]);

  // Mastered & Need Review counts for this master topic
  const topicStats = useMemo(() => {
    const total = baseVocabularies.length;
    const mastered = baseVocabularies.filter(v => isWordMastered(v, progress)).length;
    const needsReview = baseVocabularies.filter(v => isWordNeedsReview(v, progress)).length;
    return { total, mastered, needsReview };
  }, [baseVocabularies, progress]);

  // Filtered and optionally shuffled vocabularies
  const displayedVocabularies = useMemo(() => {
    let list = [...baseVocabularies];

    // Filter by mastery status
    if (wordFilter === 'weak') {
      list = list.filter(v => isWordNeedsReview(v, progress));
    } else if (wordFilter === 'mastered') {
      list = list.filter(v => isWordMastered(v, progress));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => 
        v.word.toLowerCase().includes(q) ||
        (v.meaning && v.meaning.toLowerCase().includes(q)) ||
        (v.synonyms && v.synonyms.some(s => s.toLowerCase().includes(q))) ||
        (v.collocations && v.collocations.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (isShuffled) {
      return shuffleArray(list);
    }

    return list;
  }, [baseVocabularies, wordFilter, searchQuery, isShuffled, shuffleKey, progress]);

  // Current active word
  const currentWord = useMemo(() => {
    if (!selectedVocab && displayedVocabularies.length > 0) {
      return displayedVocabularies[0];
    }
    if (selectedVocab) {
      const found = baseVocabularies.find(v => (v.id && v.id === selectedVocab.id) || v.word.toLowerCase() === selectedVocab.word.toLowerCase());
      if (found) return found;
    }
    return displayedVocabularies[0] || baseVocabularies[0] || null;
  }, [selectedVocab, displayedVocabularies, baseVocabularies]);

  // Current index in displayed list
  const currentIndex = useMemo(() => {
    if (!currentWord || displayedVocabularies.length === 0) return 0;
    const idx = displayedVocabularies.findIndex(v => (v.id && v.id === currentWord.id) || v.word.toLowerCase() === currentWord.word.toLowerCase());
    return idx >= 0 ? idx : 0;
  }, [currentWord, displayedVocabularies]);

  // Handle category switch
  const handleSelectCategory = (catId) => {
    setActiveCategoryId(catId);
    setSearchQuery('');
    setWordFilter('all');
    const targetMaster = master10Topics.find(m => m.id === catId);
    if (targetMaster && onSelectTopic) {
      onSelectTopic(targetMaster);
    }
    if (targetMaster?.vocabularies?.[0] && onSelectVocab) {
      onSelectVocab(targetMaster.vocabularies[0]);
    }
  };

  // Handle random category
  const handleRandomCategory = () => {
    const others = CLASSIFIED_10_TOPICS.filter(c => c.id !== activeCategoryId);
    const rand = others[Math.floor(Math.random() * others.length)] || CLASSIFIED_10_TOPICS[0];
    handleSelectCategory(rand.id);
  };

  // Navigate to previous word
  const handlePrevWord = () => {
    if (displayedVocabularies.length === 0) return;
    const newIdx = (currentIndex - 1 + displayedVocabularies.length) % displayedVocabularies.length;
    const target = displayedVocabularies[newIdx];
    if (onSelectVocab && target) onSelectVocab(target);
  };

  // Navigate to next word
  const handleNextWord = () => {
    if (displayedVocabularies.length === 0) return;
    const newIdx = (currentIndex + 1) % displayedVocabularies.length;
    const target = displayedVocabularies[newIdx];
    if (onSelectVocab && target) onSelectVocab(target);
  };

  // Mark card as Mastered / Needs review
  const handleMarkCard = (isMastered) => {
    if (!currentWord) return;
    const updated = recordCardResult(currentWord, isMastered);
    setProgress(updated);

    if (isMastered) {
      setSessionXp(prev => prev + 10);
      if (soundEnabled) playCorrectSound();
    } else {
      if (soundEnabled) playIncorrectSound();
    }

    handleNextWord();
  };

  // Handle quiz answer
  const handleQuizAnswer = (isCorrect) => {
    if (!currentWord) return;
    const updated = recordCardResult(currentWord, isCorrect);
    setProgress(updated);

    if (isCorrect) {
      setSessionXp(prev => prev + 10);
      if (soundEnabled) playCorrectSound();
    } else {
      if (soundEnabled) playIncorrectSound();
    }

    handleNextWord();
  };

  // Handle synonym select -> switch card
  const handleSelectSynonym = (syn) => {
    if (!syn) return;
    const clean = syn.trim().toLowerCase();
    const found = baseVocabularies.find(v => v.word.toLowerCase() === clean);
    if (found) {
      if (onSelectVocab) onSelectVocab(found);
    } else {
      const generated = getSynonymVocab(syn, currentWord, currentMasterTopic?.name || "IELTS Writing");
      if (generated && onSelectVocab) onSelectVocab(generated);
    }
  };

  const handleShuffle = () => {
    setIsShuffled(true);
    setShuffleKey(k => k + 1);
  };

  const PRACTICE_MODES = [
    { id: 'card', label: '🃏 Thẻ Flashcard', shortLabel: '🃏 Flashcard', desc: 'Lật thẻ 3D ghi nhớ từ, IPA, collocations & ví dụ' },
    { id: 'quiz', label: '🎯 Trắc nghiệm', shortLabel: '🎯 Trắc nghiệm', desc: 'Chọn nghĩa đúng phản xạ nhanh' },
    { id: 'fill', label: '✍️ Điền từ', shortLabel: '✍️ Điền từ', desc: 'Điền từ vào câu học thuật ngữ cảnh' },
    { id: 'match', label: '⚡ Ghép cặp', shortLabel: '⚡ Ghép cặp', desc: 'Minigame ghép từ và nghĩa' },
    { id: 'sentence', label: '📝 Luyện dịch câu (AI)', shortLabel: '📝 Dịch câu AI', desc: 'Dịch câu có từ & AI chấm điểm nâng Band' }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#F8F6F1] text-[#24211E]">
      
      {/* 1. Thanh chọn 10 Chủ đề lớn (Strictly 10 Master Topics ONLY - Không theo từng đề) */}
      <section className="px-3 sm:px-4 pt-2.5 pb-1 shrink-0 space-y-2">
        
        {/* Row of 10 Category Pills + Random */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {CLASSIFIED_10_TOPICS.map((cat) => {
            const isSelected = cat.id === activeCategoryId;
            const IconComponent = CATEGORY_ICONS[cat.id] || BookOpen;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#3E4F42] text-white shadow-xs font-bold"
                    : "bg-white hover:bg-[#FAF8F5] text-[#24211E] border border-[#E6E2D8] hover:border-[#3E4F42]/30"
                }`}
                title={cat.description}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#7A7369]"}`} />
                <span>{cat.shortName}</span>
              </button>
            );
          })}

          {/* Random Category Button */}
          <button
            type="button"
            onClick={handleRandomCategory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            title="Đổi sang ngẫu nhiên một trong 10 chủ đề"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Ngẫu nhiên</span>
          </button>
        </div>

        {/* Consolidated Topic & Mastery Header (1 Concise Line) */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs gap-3">
          {/* Left: Topic Name & Mastery Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider shrink-0">
                CHỦ ĐỀ:
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#24211E] truncate">
                {currentMasterTopic?.vietnameseName}
              </span>
              <span className="text-[11px] text-[#7A7369] font-mono hidden md:inline truncate">
                ({currentMasterTopic?.name})
              </span>
            </div>

            {/* Mastery Pill */}
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E6E2D8] shrink-0 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] text-[#7A7369]">
                Đã thuộc: <strong className="text-[#3E4F42] font-bold">{topicStats.mastered}</strong>/{topicStats.total}
              </span>
            </div>
          </div>

          {/* Right: Gamification Badges & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Streak & XP */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                <span>{progress.streak || 1} ngày</span>
              </span>

              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20 font-bold">
                <Zap className="w-3 h-3 text-[#3E4F42] fill-[#3E4F42]" />
                <span>{progress.xp + sessionXp} XP</span>
              </span>
            </div>

            {/* Shuffle button */}
            <button
              type="button"
              onClick={handleShuffle}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isShuffled 
                  ? "bg-[#3E4F42] text-white border-[#3E4F42]" 
                  : "bg-white text-[#7A7369] hover:text-[#24211E] border-[#E6E2D8]"
              }`}
              title="Xáo trộn thứ tự từ"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Sound toggle button */}
            <button
              type="button"
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-1.5 rounded-lg bg-white border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer"
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#3E4F42]" /> : <VolumeX className="w-3.5 h-3.5 text-[#7A7369]" />}
            </button>

            {/* Mobile word list toggle */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setShowMobileWordList(prev => !prev)}
                className="px-2.5 py-1 rounded-lg bg-[#3E4F42] text-white text-[11px] font-bold flex items-center gap-1"
              >
                <span>Từ ({baseVocabularies.length})</span>
              </button>
            )}
          </div>
        </div>

      </section>

      {/* 3. Main Workspace Area (2 Columns) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-2.5 sm:p-4 overflow-hidden">
        
        {/* CỘT TRÁI: DANH SÁCH TỪ VỰNG TRONG 10 CHỦ ĐỀ LỚN (4 cols trên desktop) */}
        {(!isMobile || showMobileWordList) && (
          <aside className={`
            ${isMobile 
              ? "fixed inset-0 z-50 bg-white p-4 flex flex-col" 
              : "md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs"
            }
          `}>
            {/* Header list */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3E4F42]" />
                <h3 className="font-bold text-xs sm:text-sm text-[#24211E]">
                  Từ vựng {currentMasterTopic?.shortName} ({displayedVocabularies.length})
                </h3>
              </div>

              {isMobile && (
                <button
                  type="button"
                  onClick={() => setShowMobileWordList(false)}
                  className="p-1 rounded-lg hover:bg-[#FAF8F5] text-[#7A7369]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="pt-2 relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-4 text-[#7A7369]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ, nghĩa, synonym..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E6E2D8] bg-[#FAF8F5] text-xs text-[#24211E] outline-none focus:border-[#3E4F42] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-3.5 text-[#7A7369] hover:text-[#24211E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 pt-2 pb-1 text-[11px]">
              <button
                type="button"
                onClick={() => setWordFilter('all')}
                className={`flex-1 py-1 rounded-lg font-medium transition cursor-pointer text-center ${
                  wordFilter === 'all'
                    ? "bg-[#3E4F42] text-white shadow-2xs"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                }`}
              >
                Tất cả ({baseVocabularies.length})
              </button>

              <button
                type="button"
                onClick={() => setWordFilter('weak')}
                className={`flex-1 py-1 rounded-lg font-medium transition cursor-pointer text-center ${
                  wordFilter === 'weak'
                    ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                }`}
              >
                Cần ôn ({topicStats.needsReview})
              </button>

              <button
                type="button"
                onClick={() => setWordFilter('mastered')}
                className={`flex-1 py-1 rounded-lg font-medium transition cursor-pointer text-center ${
                  wordFilter === 'mastered'
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                    : "bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                }`}
              >
                Đã thuộc ({topicStats.mastered})
              </button>
            </div>

            {/* Word List Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pt-1.5 pr-1 scrollbar-thin">
              {displayedVocabularies.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#7A7369] space-y-1">
                  <p>Không có từ vựng nào khớp với bộ lọc.</p>
                </div>
              ) : (
                displayedVocabularies.map((vocab) => {
                  const isSelected = currentWord && ((currentWord.id && currentWord.id === vocab.id) || currentWord.word.toLowerCase() === vocab.word.toLowerCase());
                  const mastered = isWordMastered(vocab, progress);

                  return (
                    <div
                      key={vocab.id || vocab.word}
                      onClick={() => {
                        if (onSelectVocab) onSelectVocab(vocab);
                        if (isMobile) setShowMobileWordList(false);
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-[#EDF3EE] border-[#3E4F42] ring-1 ring-[#3E4F42]/30 shadow-2xs"
                          : "bg-white hover:bg-[#FAF8F5] border-[#E6E2D8]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className={`text-xs sm:text-sm font-bold tracking-tight ${
                            isSelected ? "text-[#3E4F42]" : "text-[#24211E]"
                          }`}>
                            {vocab.word}
                          </span>
                          {vocab.partOfSpeech && (
                            <span className="text-[10px] font-mono italic text-[#7A7369]">
                              ({vocab.partOfSpeech})
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#7A7369] truncate mt-0.5">
                          {vocab.meaning}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {mastered ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700" title="Đã thuộc">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400" title="Chưa thuộc" />
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition ${isSelected ? "text-[#3E4F42] translate-x-0.5" : "text-[#7A7369]/40"}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick footer */}
            {onOpenSourcesModal && (
              <div className="pt-2 border-t border-[#E6E2D8] mt-1 shrink-0">
                <button
                  type="button"
                  onClick={onOpenSourcesModal}
                  className="w-full py-1.5 px-3 rounded-xl border border-dashed border-[#D1DDD3] text-[#3E4F42] hover:bg-[#EDF3EE] text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kho từ vựng &amp; Đề mở rộng</span>
                </button>
              </div>
            )}
          </aside>
        )}

        {/* CỘT PHẢI: TRUNG TÂM LUYỆN TẬP FLASHCARD & 5 CHẾ ĐỘ LUYỆN TẬP (8 cols trên desktop) */}
        <section className={`${isMobile ? "col-span-1" : "md:col-span-8"} h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden shadow-xs`}>
          
          {/* Top Bar of Right Column: 5 Practice Modes Switcher */}
          <div className="pb-3 border-b border-[#E6E2D8] flex items-center justify-between gap-2 flex-wrap shrink-0">
            
            {/* Segmented Modes Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] text-xs overflow-x-auto scrollbar-none max-w-full">
              {PRACTICE_MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveMode(mode.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#3E4F42] text-white shadow-xs font-bold"
                        : "text-[#7A7369] hover:text-[#24211E]"
                    }`}
                    title={mode.desc}
                  >
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Word Navigation Buttons */}
            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="text-[11px] text-[#7A7369] font-mono mr-1">
                {displayedVocabularies.length > 0 ? `${currentIndex + 1}/${displayedVocabularies.length}` : "0/0"}
              </span>

              <button
                type="button"
                onClick={handlePrevWord}
                disabled={displayedVocabularies.length <= 1}
                className="p-1.5 rounded-lg border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] disabled:opacity-40 transition cursor-pointer"
                title="Từ trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextWord}
                disabled={displayedVocabularies.length <= 1}
                className="p-1.5 rounded-lg border border-[#E6E2D8] bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] disabled:opacity-40 transition cursor-pointer"
                title="Từ sau (Mũi tên phải)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Mode Workspace Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-3 pr-1 scrollbar-thin">
            {!currentWord ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#7A7369]">
                <BookOpen className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-xs">Chưa có từ vựng nào trong chủ đề này.</p>
              </div>
            ) : activeMode === 'card' ? (
              /* ================= KIỂU 1: LẬT THẺ FLASHCARD 3D (CHÍNH) ================= */
              <div className="h-full flex flex-col justify-center">
                <ClassicCardView
                  card={currentWord}
                  onMarkCard={handleMarkCard}
                  soundEnabled={soundEnabled}
                  onSelectSynonym={handleSelectSynonym}
                  isMastered={isWordMastered(currentWord, progress)}
                />

                {/* Bottom Navigation Pills */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#E6E2D8] text-xs">
                  <button
                    type="button"
                    onClick={handlePrevWord}
                    className="px-3.5 py-1.5 rounded-xl border border-[#E6E2D8] hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] transition flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Từ trước</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextWord}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Từ tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : activeMode === 'quiz' ? (
              /* ================= KIỂU 2: TRẮC NGHIỆM PHẢN XẠ ================= */
              <div className="h-full flex flex-col justify-center">
                <QuizGameView
                  card={currentWord}
                  allCards={baseVocabularies}
                  onAnswer={handleQuizAnswer}
                  soundEnabled={soundEnabled}
                />
              </div>
            ) : activeMode === 'fill' ? (
              /* ================= KIỂU 3: ĐIỀN TỪ VÀO CÂU ================= */
              <div className="h-full flex flex-col justify-center">
                <FillBlankView
                  card={currentWord}
                  allCards={baseVocabularies}
                  onAnswer={handleQuizAnswer}
                  soundEnabled={soundEnabled}
                />
              </div>
            ) : activeMode === 'match' ? (
              /* ================= KIỂU 4: GHÉP CẶP TỪ VỰNG ================= */
              <div className="h-full flex flex-col justify-center">
                <MatchPairsView
                  cards={displayedVocabularies.length >= 5 ? displayedVocabularies : baseVocabularies}
                  onRoundComplete={() => {
                    addXP(25);
                    setSessionXp(prev => prev + 25);
                    setProgress(getFlashcardProgress());
                    if (soundEnabled) playCorrectSound();
                  }}
                  soundEnabled={soundEnabled}
                />
              </div>
            ) : (
              /* ================= KIỂU 5: LUYỆN DỊCH CÂU (AI CHẤM ĐIỂM) ================= */
              /* (Bỏ hoàn toàn phần luyện viết đoạn văn theo bài) */
              <div className="h-full">
                <SentencePracticeView
                  vocab={currentWord}
                  topic={currentMasterTopic}
                  targetBand={targetBand}
                  apiKey={apiKey}
                  studentEmail={studentEmail}
                  onSentenceGraded={onRefreshStats}
                />
              </div>
            )}
          </div>

        </section>

      </main>

    </div>
  );
}
