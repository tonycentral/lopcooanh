// src/components/flashcards/FlashcardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import FlashcardTopBar from './FlashcardTopBar';
import ClassicCardView from './ClassicCardView';
import QuizGameView from './QuizGameView';
import MatchPairsView from './MatchPairsView';
import FillBlankView from './FillBlankView';
import WriteRecallView from './WriteRecallView';
import DictationView from './DictationView';
import PronunciationPracticeView from './PronunciationPracticeView';
import SessionCompletionModal from './SessionCompletionModal';

import { 
  getFlashcardProgress, 
  recordCardResult, 
  addXP, 
  extractAllVocabularies,
  isWordMastered,
  isWordNeedsReview,
  shuffleArray
} from '../../services/flashcardService';
import { getSynonymVocab } from '../../services/synonymService';
import { playCorrectSound, playIncorrectSound } from '../../services/soundEffects';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Filter, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Heart,
  Flame,
  Award,
  Shuffle
} from 'lucide-react';

export default function FlashcardPage({ 
  currentTopic, 
  task1Topics = [], 
  task2Topics = [], 
  onClose, 
  onGoWritingPractice 
}) {
  // Extract all vocabulary words across Task 1 and Task 2
  const allVocabularies = useMemo(() => {
    return extractAllVocabularies(task1Topics, task2Topics);
  }, [task1Topics, task2Topics]);

  // Persistent progress
  const [progress, setProgress] = useState(() => getFlashcardProgress());

  // Filter mode: 'current' | 'all' | 'weak' | 'mastered' | 'daily10'
  const [filterMode, setFilterMode] = useState('current');

  // Random word order active by default as requested
  const [isRandomOrder, setIsRandomOrder] = useState(true);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Toggle to optionally hide mastered words during practice
  const [hideMastered, setHideMastered] = useState(false);

  // Active study mode: 'card' (Lật thẻ) | 'quiz' (Trắc nghiệm) | 'match' (Nối cặp) | 'fill' (Điền từ)
  const [activeMode, setActiveMode] = useState('card');

  // Gamification state for this session
  const [hearts, setHearts] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionMasteredCount, setSessionMasteredCount] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [extraCards, setExtraCards] = useState([]);

  // Calculate unique mastered & needs-review counts
  const masteredCount = useMemo(() => {
    return allVocabularies.filter(v => isWordMastered(v, progress)).length;
  }, [allVocabularies, progress]);

  const needsReviewCount = useMemo(() => {
    return allVocabularies.filter(v => isWordNeedsReview(v, progress)).length;
  }, [allVocabularies, progress]);

  // Deck of cards filtered by selected criteria and randomized if enabled
  const activeDeck = useMemo(() => {
    let list = [];

    if (filterMode === 'current' && currentTopic) {
      list = allVocabularies.filter(v => v.topicId === currentTopic.id);
    } else if (filterMode === 'weak') {
      list = allVocabularies.filter(v => isWordNeedsReview(v, progress));
      if (list.length === 0) {
        list = allVocabularies.slice(0, 10);
      }
    } else if (filterMode === 'mastered') {
      list = allVocabularies.filter(v => isWordMastered(v, progress));
      if (list.length === 0) {
        list = allVocabularies.slice(0, 10);
      }
    } else if (filterMode === 'daily10') {
      list = shuffleArray(allVocabularies).slice(0, 10);
    } else {
      // 'all'
      list = allVocabularies;
    }

    // Filter out mastered words if hideMastered is ON and not in 'mastered' view
    if (hideMastered && filterMode !== 'mastered') {
      const unmastered = list.filter(v => !isWordMastered(v, progress));
      if (unmastered.length > 0) {
        list = unmastered;
      }
    }

    let baseList = list.length > 0 ? list : allVocabularies.slice(0, 10);

    // Apply Random Shuffle by default as requested
    if (isRandomOrder && filterMode !== 'daily10') {
      baseList = shuffleArray(baseList);
    }

    if (!extraCards.length) return baseList;
    const existingWords = new Set(baseList.map(c => c.word?.toLowerCase().trim()));
    const validExtras = extraCards.filter(c => !existingWords.has(c.word?.toLowerCase().trim()));
    return [...validExtras, ...baseList];
  }, [filterMode, currentTopic, allVocabularies, progress, hideMastered, isRandomOrder, shuffleKey, extraCards]);

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  // Reset index when filter or mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, [filterMode, activeMode]);

  // Handle click on synonym in Flashcard -> Mở ngay flashcard của từ mới
  const handleSelectSynonymCard = (syn) => {
    if (!syn) return;
    const cleanSyn = syn.trim().toLowerCase();
    const existingIdx = activeDeck.findIndex(c => c.word && c.word.toLowerCase().trim() === cleanSyn);
    if (existingIdx !== -1) {
      setCurrentIndex(existingIdx);
      return;
    }

    let found = allVocabularies.find(c => c.word && c.word.toLowerCase().trim() === cleanSyn);
    if (!found) {
      found = getSynonymVocab(syn, currentCard, currentTopic?.name || "IELTS Writing");
    }
    if (found) {
      setExtraCards(prev => [found, ...prev]);
      setCurrentIndex(0);
    }
  };

  // Handle card result from ClassicCardView
  const handleCardResult = (isMastered) => {
    if (!currentCard) return;

    const updated = recordCardResult(currentCard, isMastered);
    setProgress(updated);

    if (isMastered) {
      setSessionXp(prev => prev + 10);
      setSessionMasteredCount(prev => prev + 1);
      if (soundEnabled) playCorrectSound();
    } else {
      if (soundEnabled) playIncorrectSound();
    }

    goToNextCard();
  };

  // Handle quiz answer
  const handleQuizAnswer = (isCorrect) => {
    if (!currentCard) return;

    if (isCorrect) {
      const updated = recordCardResult(currentCard, true);
      setProgress(updated);
      setSessionXp(prev => prev + 10);
      setSessionMasteredCount(prev => prev + 1);
      if (soundEnabled) playCorrectSound();
    } else {
      const updated = recordCardResult(currentCard, false);
      setProgress(updated);
      setHearts(prev => Math.max(0, prev - 1));
      if (soundEnabled) playIncorrectSound();
    }

    goToNextCard();
  };

  // Handle Match Pairs completion
  const handleMatchRoundComplete = () => {
    const newXp = addXP(25);
    setSessionXp(prev => prev + 25);
    setSessionMasteredCount(prev => prev + 5);
    setProgress(getFlashcardProgress());
    setIsSessionFinished(true);
  };

  const goToNextCard = () => {
    if (currentIndex + 1 >= activeDeck.length) {
      setIsSessionFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleResetSession = () => {
    setCurrentIndex(0);
    setHearts(5);
    setSessionXp(0);
    setSessionMasteredCount(0);
    setIsSessionFinished(false);
    if (isRandomOrder) {
      setShuffleKey(k => k + 1);
    }
  };

  const handleShuffleDeck = () => {
    setShuffleKey(k => k + 1);
    setCurrentIndex(0);
  };

  const handleRestoreHearts = () => {
    setHearts(5);
  };

  const MODE_TITLES = {
    card: "🃏 Lật Thẻ Thông Minh",
    write: "⌨️ Gõ Từ (Recall)",
    dictation: "🎧 Nghe Chép Chính Tả",
    speech: "🎙️ Chấm Phát Âm AI",
    quiz: "🎯 Trắc Nghiệm Phản Xạ",
    match: "⚡ Ghép Cặp Thần Tốc",
    fill: "✍️ Điền Từ Vào Câu"
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full flex flex-col bg-[#F8F6F1] text-[#24211E] overflow-hidden select-none">
      
      {/* Top Gamification Bar */}
      <FlashcardTopBar
        currentIndex={currentIndex + 1}
        totalCards={activeDeck.length}
        streak={progress.streak || 1}
        hearts={hearts}
        xp={progress.xp + sessionXp}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onClose={onClose}
        onResetSession={handleResetSession}
        activeModeTitle={MODE_TITLES[activeMode]}
        isRandomOrder={isRandomOrder}
        onToggleRandom={() => {
          setIsRandomOrder(prev => !prev);
          setShuffleKey(k => k + 1);
          setCurrentIndex(0);
        }}
        onShuffleDeck={handleShuffleDeck}
        masteredCount={masteredCount}
        needsReviewCount={needsReviewCount}
      />

      {/* Mode Switcher Tabs & Filters (Single-line Compact on Mobile) */}
      <div className="w-full bg-white border-b border-[#E6E2D8] px-2.5 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0 whitespace-nowrap">
        
        {/* Interactive Study Modes */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs shrink-0">
          <button
            onClick={() => setActiveMode('card')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'card'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>🃏 Lật Thẻ</span>
          </button>

          <button
            onClick={() => setActiveMode('write')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'write'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>⌨️ Gõ Từ</span>
          </button>

          <button
            onClick={() => setActiveMode('dictation')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'dictation'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>🎧 Chép Từ</span>
          </button>

          <button
            onClick={() => setActiveMode('speech')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'speech'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>🎙️ Phát Âm</span>
          </button>

          <button
            onClick={() => setActiveMode('quiz')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'quiz'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>🎯 Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setActiveMode('match')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'match'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>⚡ Ghép Cặp</span>
          </button>

          <button
            onClick={() => setActiveMode('fill')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activeMode === 'fill'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E]"
            }`}
          >
            <span>✍️ Điền Từ</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <button
            onClick={() => setFilterMode('current')}
            className={`px-2 py-1 rounded-xl font-medium transition cursor-pointer ${
              filterMode === 'current'
                ? "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold"
                : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            }`}
          >
            Chủ đề
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-1 rounded-xl font-medium transition cursor-pointer ${
              filterMode === 'all'
                ? "bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3] font-bold"
                : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            }`}
          >
            Tất cả ({allVocabularies.length})
          </button>

          <button
            onClick={() => setFilterMode('weak')}
            className={`px-2 py-1 rounded-xl font-medium transition cursor-pointer ${
              filterMode === 'weak'
                ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            }`}
          >
            Cần ôn ({needsReviewCount})
          </button>

          <button
            onClick={() => setFilterMode('mastered')}
            className={`px-2 py-1 rounded-xl font-medium transition cursor-pointer ${
              filterMode === 'mastered'
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                : "bg-white text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
            }`}
          >
            Đã thuộc ({masteredCount})
          </button>

          {/* Toggle Bỏ qua từ đã thuộc */}
          {filterMode !== 'mastered' && (
            <button
              onClick={() => {
                setHideMastered(prev => !prev);
                setCurrentIndex(0);
              }}
              className={`px-2 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer flex items-center gap-1 border ${
                hideMastered
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs"
                  : "bg-[#FAF8F5] text-[#7A7369] border-[#E6E2D8] hover:text-[#24211E]"
              }`}
              title="Ẩn từ đã thuộc"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{hideMastered ? "Ẩn đã thuộc" : "Hiện tất cả"}</span>
            </button>
          )}

        </div>

      </div>

      {/* Main Flashcard Practice Area - Zero scroll on mobile */}
      <main className="flex-1 min-h-0 flex flex-col justify-center items-center px-3 py-1 pb-20 md:pb-3 overflow-hidden select-none">
        
        {/* Out of Hearts Notice */}
        {hearts === 0 && (
          <div className="w-full max-w-lg mb-4 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 shadow-xl text-center space-y-2 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-sm">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span>Bạn đã dùng hết tim hôm nay!</span>
            </div>
            <p className="text-xs text-slate-300">
              Đừng lo lắng! Trong học tập, sai sót là cách tốt nhất để tiến bộ.
            </p>
            <button
              onClick={handleRestoreHearts}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-900/40 cursor-pointer"
            >
              Hồi Phục 5 Tim Ngay &amp; Tiếp Tục
            </button>
          </div>
        )}

        {/* View Mode Switching */}
        {activeMode === 'card' && (
          <ClassicCardView
            card={currentCard}
            onMarkCard={handleCardResult}
            soundEnabled={soundEnabled}
            onSelectSynonym={handleSelectSynonymCard}
            isMastered={isWordMastered(currentCard, progress)}
          />
        )}

        {activeMode === 'write' && (
          <WriteRecallView
            card={currentCard}
            onAnswer={handleQuizAnswer}
            soundEnabled={soundEnabled}
          />
        )}

        {activeMode === 'dictation' && (
          <DictationView
            card={currentCard}
            onAnswer={handleQuizAnswer}
            soundEnabled={soundEnabled}
          />
        )}

        {activeMode === 'speech' && (
          <PronunciationPracticeView
            card={currentCard}
            onNextWord={goToNextCard}
            soundEnabled={soundEnabled}
          />
        )}

        {activeMode === 'quiz' && (
          <QuizGameView
            card={currentCard}
            allCards={activeDeck}
            onAnswer={handleQuizAnswer}
            soundEnabled={soundEnabled}
          />
        )}

        {activeMode === 'match' && (
          <MatchPairsView
            cards={activeDeck}
            onRoundComplete={handleMatchRoundComplete}
            soundEnabled={soundEnabled}
          />
        )}

        {activeMode === 'fill' && (
          <FillBlankView
            card={currentCard}
            allCards={activeDeck}
            onAnswer={handleQuizAnswer}
            soundEnabled={soundEnabled}
          />
        )}

      </main>

      {/* Session Completion Modal */}
      <SessionCompletionModal
        isOpen={isSessionFinished}
        stats={{
          totalCards: activeDeck.length,
          masteredCount: sessionMasteredCount,
          xpEarned: sessionXp,
          streak: progress.streak || 1
        }}
        onRestart={handleResetSession}
        onGoWritingPractice={() => {
          setIsSessionFinished(false);
          if (onGoWritingPractice) {
            onGoWritingPractice(currentTopic);
          }
        }}
        soundEnabled={soundEnabled}
      />

    </div>
  );
}
