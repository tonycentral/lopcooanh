import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Tag
} from 'lucide-react';
import { speakWord, playFlipSound } from '../../services/soundEffects';

export default function ClassicCardView({ 
  card, 
  onMarkCard, 
  soundEnabled 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto pronounce word on card mount
  useEffect(() => {
    setIsFlipped(false);
    if (card?.word && soundEnabled) {
      speakWord(card.word);
    }
  }, [card?.id, soundEnabled]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      }
      if (e.key === '1' || e.code === 'ArrowLeft') {
        e.preventDefault();
        onMarkCard(false);
      }
      if (e.key === '2' || e.code === 'ArrowRight') {
        e.preventDefault();
        onMarkCard(true);
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (card?.word) speakWord(card.word);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, card]);

  const handleFlip = () => {
    if (soundEnabled) playFlipSound();
    setIsFlipped(prev => !prev);
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (card?.word) speakWord(card.word);
  };

  if (!card) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6 py-2">
      
      {/* 3D Flip Card Container */}
      <div 
        onClick={handleFlip}
        className="w-full h-[360px] sm:h-[420px] cursor-pointer perspective-1000 select-none group"
      >
        <div 
          className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-sm border border-[#E6E2D8] ${
            isFlipped
              ? "rotate-y-180 bg-[#FAF8F5]"
              : "bg-white hover:border-[#3E4F42]/40"
          }`}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rounded-3xl bg-white">
            
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
                  {card.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                </span>
                <span className="text-xs text-[#7A7369] font-medium truncate max-w-[200px]">
                  {card.topicVietnameseName || card.topicName}
                </span>
              </div>

              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F4EFEA] text-[#7A7369] border border-[#E6E2D8]">
                Band 7.5 - 8.5
              </span>
            </div>

            {/* Center Content: Word & IPA */}
            <div className="flex flex-col items-center text-center my-auto space-y-3">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#24211E] tracking-wide">
                  {card.word}
                </h2>
                <button
                  onClick={handleSpeak}
                  className="p-2 sm:p-2.5 rounded-2xl bg-[#EDF3EE] hover:bg-[#3E4F42] text-[#3E4F42] hover:text-white border border-[#3E4F42]/20 transition transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  title="Nghe phát âm (Phím R)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {card.ipa && (
                  <span className="text-sm sm:text-base font-mono text-[#7A7369] font-medium">
                    {card.ipa}
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className="text-xs text-[#7A7369] italic px-2 py-0.5 rounded-md bg-[#F4EFEA] border border-[#E6E2D8] font-mono">
                    ({card.partOfSpeech})
                  </span>
                )}
              </div>

              {/* Band 6 Basic Equivalent Hint */}
              {card.basicEquivalent && (
                <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#F4EFEA] border border-[#E6E2D8] text-xs text-[#7A7369]">
                  <span>Thay thế: </span>
                  <span className="font-semibold text-[#A67C52] line-through mr-1.5">
                    {card.basicEquivalent}
                  </span>
                  <span className="text-[#3E4F42] font-semibold">&rarr; Nâng Band</span>
                </div>
              )}
            </div>

            {/* Bottom Flip Instruction */}
            <div className="text-center pt-2 border-t border-[#E6E2D8] text-xs text-[#7A7369] flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#3E4F42]" />
              <span>Nhấn vào thẻ hoặc bấm <strong>Space</strong> để xem nghĩa &amp; ví dụ</span>
            </div>

          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl overflow-y-auto scrollbar-thin bg-[#FAF8F5]">
            
            {/* Top Back Row */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E2D8]">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#24211E]">{card.word}</span>
                <span className="text-xs text-[#7A7369] italic font-mono">({card.partOfSpeech})</span>
              </div>
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-xl text-[#7A7369] hover:text-[#24211E] hover:bg-white transition cursor-pointer"
                title="Nghe lại"
              >
                <Volume2 className="w-4 h-4 text-[#3E4F42]" />
              </button>
            </div>

            {/* Meaning in Vietnamese */}
            <div className="py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3E4F42] mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nghĩa tiếng Việt:
              </div>
              <p className="text-base sm:text-lg font-medium text-[#24211E] leading-snug">
                {card.meaning}
              </p>
            </div>

            {/* Collocations */}
            {card.collocations && card.collocations.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7369] mb-1 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#3E4F42]" /> Collocation ăn điểm:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.collocations.map((col, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#EDF3EE] border border-[#3E4F42]/20 text-[#3E4F42] font-medium"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {card.synonyms && card.synonyms.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A7369] mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#A67C52]" /> Từ đồng nghĩa:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.synonyms.map((syn, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-white border border-[#E6E2D8] text-[#24211E] font-mono"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Example sentence */}
            {card.modelSentence && (
              <div className="mt-2 p-3 rounded-xl bg-white border border-[#E6E2D8] text-xs space-y-1">
                <p className="font-serif italic text-[#24211E] leading-relaxed">
                  "{card.modelSentence}"
                </p>
                {card.vietnameseSentence && (
                  <p className="text-[11px] text-[#7A7369] leading-normal">
                    &rarr; {card.vietnameseSentence}
                  </p>
                )}
              </div>
            )}

            <div className="text-center pt-2 text-[11px] text-[#7A7369]">
              Nhấn lần nữa để lật lại mặt trước
            </div>

          </div>

        </div>
      </div>

      {/* Action Buttons: Spaced Repetition Style */}
      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 pt-1">
        
        {/* Needs Review (Chưa nhớ) */}
        <button
          onClick={() => onMarkCard(false)}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] font-medium text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95"
          title="Phím 1 hoặc Mũi tên trái"
        >
          <XCircle className="w-4 h-4 text-[#A67C52]" />
          <span>Cần Ôn Lại</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4EFEA] text-[#7A7369] hidden sm:inline">1</span>
        </button>

        {/* Listen Again */}
        <button
          onClick={handleSpeak}
          className="p-2.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#E6E2D8] text-[#7A7369] hover:text-[#24211E] transition cursor-pointer shadow-xs active:scale-95"
          title="Nghe lại phát âm (Phím R)"
        >
          <Volume2 className="w-4 h-4 text-[#3E4F42]" />
        </button>

        {/* Mastered (Đã thuộc) */}
        <button
          onClick={() => onMarkCard(true)}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95"
          title="Phím 2 hoặc Mũi tên phải (+10 XP)"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã Thuộc</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white hidden sm:inline">2</span>
        </button>

      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#7A7369]">
        <span>Phím tắt:</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E6E2D8] font-mono text-[#24211E]">Space</kbd> Lật thẻ</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E6E2D8] font-mono text-[#24211E]">1</kbd> Chưa thuộc</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E6E2D8] font-mono text-[#24211E]">2</kbd> Đã thuộc</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E6E2D8] font-mono text-[#24211E]">R</kbd> Nghe phát âm</span>
      </div>

    </div>
  );
}
