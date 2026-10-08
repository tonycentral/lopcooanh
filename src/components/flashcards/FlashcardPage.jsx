import React, { useState, useEffect, useMemo } from 'react';
import FlashcardTopBar from './FlashcardTopBar';
import ClassicCardView from './ClassicCardView';
import QuizGameView from './QuizGameView';
import MatchPairsView from './MatchPairsView';
import FillBlankView from './FillBlankView';
import SessionCompletionModal from './SessionCompletionModal';

import { 
  getFlashcardProgress, 
  recordCardResult, 
  addXP, 
  extractAllVocabularies 
} from '../../services/flashcardService';
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
  Award
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

  // Filter mode: 'current' (chủ đề hiện tại) | 'all' (tất cả) | 'weak' (từ chưa nhớ) | 'daily10' (10 từ ngẫu nhiên)
  const [filterMode, setFilterMode] = useState('current');

  // Active study mode: 'card' (Lật thẻ) | 'quiz' (Trắc nghiệm) | 'match' (Nối cặp) | 'fill' (Điền từ)
  const [activeMode, setActiveMode] = useState('card');

  // Gamification state for this session
  const [hearts, setHearts] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionMasteredCount, setSessionMasteredCount] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Deck of cards filtered by selected criteria
  const activeDeck = useMemo(() => {
    let list = [];

    if (filterMode === 'current' && currentTopic) {
      list = allVocabularies.filter(v => v.topicId === currentTopic.id);
    } else if (filterMode === 'weak') {
      const weakIds = new Set(progress.needsReviewWordIds || []);
      list = allVocabularies.filter(v => weakIds.has(v.id));
      if (list.length === 0) {
        // Fallback if no weak words
        list = allVocabularies.slice(0, 10);
      }
    } else if (filterMode === 'daily10') {
      list = [...allVocabularies].sort(() => 0.5 - Math.random()).slice(0, 10);
    } else {
      // 'all'
      list = allVocabularies;
    }

    return list.length > 0 ? list : allVocabularies.slice(0, 10);
  }, [filterMode, currentTopic, allVocabularies, progress.needsReviewWordIds]);

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  // Reset index when filter or mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, [filterMode, activeMode]);

  // Handle card result from ClassicCardView
  const handleCardResult = (isMastered) => {
    if (!currentCard) return;

    const updated = recordCardResult(currentCard.id, isMastered);
    setProgress(updated);

    if (isMastered) {
      setSessionXp(prev => prev + 10);
      setSessionMasteredCount(prev => prev + 1);
    }

    goToNextCard();
  };

  // Handle quiz answer
  const handleQuizAnswer = (isCorrect) => {
    if (!currentCard) return;

    if (isCorrect) {
      const updated = recordCardResult(currentCard.id, true);
      setProgress(updated);
      setSessionXp(prev => prev + 10);
      setSessionMasteredCount(prev => prev + 1);
    } else {
      const updated = recordCardResult(currentCard.id, false);
      setProgress(updated);
      setHearts(prev => Math.max(0, prev - 1));
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
  };

  const handleRestoreHearts = () => {
    setHearts(5);
  };

  const MODE_TITLES = {
    card: "🃏 Lật Thẻ Thông Minh",
    quiz: "🎯 Trắc Nghiệm Phản Xạ",
    match: "⚡ Ghép Cặp Thần Tốc",
    fill: "✍️ Điền Từ Vào Câu"
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      
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
      />

      {/* Mode Switcher Tabs & Filters */}
      <div className="w-full bg-slate-900/60 border-b border-slate-800 px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
        
        {/* 4 Interactive Study Modes */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveMode('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeMode === 'card'
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🃏 Lật Thẻ</span>
          </button>

          <button
            onClick={() => setActiveMode('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeMode === 'quiz'
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🎯 Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setActiveMode('match')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeMode === 'match'
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>⚡ Ghép Cặp</span>
          </button>

          <button
            onClick={() => setActiveMode('fill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
              activeMode === 'fill'
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>✍️ Điền Từ</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none">
          <span className="text-slate-500 font-semibold hidden md:inline flex items-center gap-1">
            <Filter className="w-3 h-3" /> Lọc:
          </span>

          <button
            onClick={() => setFilterMode('current')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
              filterMode === 'current'
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
          >
            Chủ đề đang học ({currentTopic?.vietnameseName || currentTopic?.name || "Hiện tại"})
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
              filterMode === 'all'
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
          >
            Tất cả ({allVocabularies.length} từ)
          </button>

          <button
            onClick={() => setFilterMode('daily10')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
              filterMode === 'daily10'
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
          >
            Ngẫu nhiên 10 từ
          </button>

          <button
            onClick={() => setFilterMode('weak')}
            className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
              filterMode === 'weak'
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
          >
            Từ cần ôn ({progress.needsReviewWordIds?.length || 0})
          </button>
        </div>

      </div>

      {/* Main Flashcard Practice Area */}
      <main className="flex-1 min-h-0 flex flex-col justify-center items-center px-4 py-3 overflow-y-auto scrollbar-thin">
        
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
