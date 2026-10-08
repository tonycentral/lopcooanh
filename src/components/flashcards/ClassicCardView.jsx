import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Bookmark, 
  Tag, 
  HelpCircle,
  Lightbulb,
  ArrowRight,
  BookOpen
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
      // Space: Flip card
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      }
      // Key 1 or Left Arrow: Needs Review (Chưa nhớ)
      if (e.key === '1' || e.code === 'ArrowLeft') {
        e.preventDefault();
        onMarkCard(false);
      }
      // Key 2 or Right Arrow: Mastered (Đã thuộc)
      if (e.key === '2' || e.code === 'ArrowRight') {
        e.preventDefault();
        onMarkCard(true);
      }
      // Key R: Replay audio
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
          className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl border ${
            isFlipped
              ? "rotate-y-180 bg-slate-900 border-indigo-500/40 shadow-indigo-950/40"
              : "bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-slate-700/80 hover:border-blue-500/50 shadow-slate-950/60"
          }`}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rounded-3xl">
            
            {/* Top Badge Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {card.taskType === 'task1' ? 'IELTS Task 1' : 'IELTS Task 2'}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                  {card.topicVietnameseName || card.topicName}
                </span>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Band 7.5 - 8.5
              </span>
            </div>

            {/* Center Content: Word & IPA */}
            <div className="flex flex-col items-center text-center my-auto space-y-3">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wide">
                  {card.word}
                </h2>
                <button
                  onClick={handleSpeak}
                  className="p-2 sm:p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg shadow-blue-900/30"
                  title="Nghe phát âm (Phím R)"
                >
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {card.ipa && (
                  <span className="text-sm sm:text-base font-mono text-blue-300/90 font-medium">
                    {card.ipa}
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className="text-xs text-slate-400 italic px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono">
                    ({card.partOfSpeech})
                  </span>
                )}
              </div>

              {/* Band 6 Basic Equivalent Hint */}
              {card.basicEquivalent && (
                <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/70 text-xs text-slate-300">
                  <span className="text-slate-400">Thay thế từ cơ bản: </span>
                  <span className="font-semibold text-amber-300 line-through mr-1.5">
                    {card.basicEquivalent}
                  </span>
                  <span className="text-emerald-400 font-bold">&rarr; Nâng Band</span>
                </div>
              )}
            </div>

            {/* Bottom Flip Instruction */}
            <div className="text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>Nhấn vào thẻ hoặc bấm <strong>Space</strong> để xem nghĩa &amp; ví dụ</span>
            </div>

          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl overflow-y-auto scrollbar-thin">
            
            {/* Top Back Row */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">{card.word}</span>
                <span className="text-xs text-indigo-400 italic font-mono">({card.partOfSpeech})</span>
              </div>
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Nghe lại"
              >
                <Volume2 className="w-4 h-4 text-blue-400" />
              </button>
            </div>

            {/* Meaning in Vietnamese */}
            <div className="py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Nghĩa Tiếng Việt:
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                {card.meaning}
              </p>
            </div>

            {/* Collocations */}
            {card.collocations && card.collocations.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" /> Collocation ăn điểm:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.collocations.map((col, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium"
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
                <div className="text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Từ đồng nghĩa (Synonyms):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {card.synonyms.map((syn, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-300 font-mono"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Example sentence */}
            {card.modelSentence && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <p className="font-serif italic text-slate-200 leading-relaxed">
                  "{card.modelSentence}"
                </p>
                {card.vietnameseSentence && (
                  <p className="text-[11px] text-slate-400 leading-normal">
                    &rarr; {card.vietnameseSentence}
                  </p>
                )}
              </div>
            )}

            <div className="text-center pt-2 text-[11px] text-slate-500">
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
          className="flex-1 max-w-[220px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-rose-500/15 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg active:scale-95"
          title="Phím 1 hoặc Mũi tên trái"
        >
          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <span>Cần Ôn Lại</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 hidden sm:inline">1</span>
        </button>

        {/* Listen Again */}
        <button
          onClick={handleSpeak}
          className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-lg active:scale-95"
          title="Nghe lại phát âm (Phím R)"
        >
          <Volume2 className="w-5 h-5 text-blue-400" />
        </button>

        {/* Mastered (Đã thuộc) */}
        <button
          onClick={() => onMarkCard(true)}
          className="flex-1 max-w-[220px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm border border-emerald-400/30 transition cursor-pointer shadow-lg shadow-emerald-900/30 active:scale-95"
          title="Phím 2 hoặc Mũi tên phải (+10 XP)"
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Đã Thuộc!</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white hidden sm:inline">2</span>
        </button>

      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
        <span>Phím tắt:</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">Space</kbd> Lật thẻ</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">1</kbd> Chưa thuộc</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">2</kbd> Đã thuộc</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">R</kbd> Nghe phát âm</span>
      </div>

    </div>
  );
}
