import React from 'react';
import { BookOpen, Layers, Home, Sparkles } from 'lucide-react';

export default function MobileBottomNav({
  currentView,
  onGoVocab,
  onGoFlashcard,
  onGoWelcome
}) {
  const isVocab = currentView === 'vocab_practice' || currentView === 'practice';
  const isFlashcard = currentView === 'flashcard';
  const isWelcome = currentView === 'welcome';

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E6E2D8] py-1.5 px-3 z-40 md:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-3 max-w-md mx-auto items-center">
        {/* Tab 1: Luyện Từ Vựng */}
        <button
          type="button"
          onClick={onGoVocab}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer select-none active:scale-95 ${
            isVocab 
              ? "text-[#3E4F42] font-bold" 
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <div className={`p-1 rounded-lg transition ${isVocab ? "bg-[#EDF3EE] text-[#3E4F42]" : ""}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[11px] leading-tight mt-0.5">Luyện từ vựng</span>
        </button>

        {/* Tab 2: Flashcards */}
        <button
          type="button"
          onClick={onGoFlashcard}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer select-none active:scale-95 ${
            isFlashcard 
              ? "text-[#3E4F42] font-bold" 
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <div className={`p-1 rounded-lg transition relative ${isFlashcard ? "bg-[#EDF3EE] text-[#3E4F42]" : ""}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] leading-tight mt-0.5">Flashcards</span>
        </button>

        {/* Tab 3: Trang Chủ */}
        <button
          type="button"
          onClick={onGoWelcome}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer select-none active:scale-95 ${
            isWelcome 
              ? "text-[#3E4F42] font-bold" 
              : "text-[#7A7369] hover:text-[#24211E]"
          }`}
        >
          <div className={`p-1 rounded-lg transition ${isWelcome ? "bg-[#EDF3EE] text-[#3E4F42]" : ""}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] leading-tight mt-0.5">Trang chủ</span>
        </button>
      </div>
    </nav>
  );
}
