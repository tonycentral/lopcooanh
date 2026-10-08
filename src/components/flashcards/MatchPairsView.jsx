import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Zap, 
  Timer,
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord, playMatchSound, playIncorrectSound } from '../../services/soundEffects';

export default function MatchPairsView({ 
  cards, 
  onRoundComplete, 
  soundEnabled 
}) {
  // Select 5 cards for the matching round
  const roundCards = useMemo(() => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [cards]);

  // Generate pair items (5 English words + 5 Vietnamese meanings)
  const items = useMemo(() => {
    const wordItems = roundCards.map(c => ({
      id: `en_${c.id}`,
      cardId: c.id,
      type: 'en',
      text: c.word,
      ipa: c.ipa
    }));

    const meaningItems = roundCards.map(c => ({
      id: `vi_${c.id}`,
      cardId: c.id,
      type: 'vi',
      text: c.meaning
    }));

    // Randomize the order of each column
    return {
      enItems: [...wordItems].sort(() => 0.5 - Math.random()),
      viItems: [...meaningItems].sort(() => 0.5 - Math.random())
    };
  }, [roundCards]);

  const [selectedEn, setSelectedEn] = useState(null);
  const [selectedVi, setSelectedVi] = useState(null);
  const [matchedCardIds, setMatchedCardIds] = useState(new Set());
  const [mismatchPair, setMismatchPair] = useState(null);
  const [combo, setCombo] = useState(0);

  const isRoundFinished = matchedCardIds.size === roundCards.length && roundCards.length > 0;

  // Trigger celebration when round finishes
  useEffect(() => {
    if (isRoundFinished) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isRoundFinished]);

  const handleSelectEn = (item) => {
    if (matchedCardIds.has(item.cardId) || mismatchPair) return;

    if (soundEnabled) speakWord(item.text);
    setSelectedEn(item);

    if (selectedVi) {
      checkMatch(item, selectedVi);
    }
  };

  const handleSelectVi = (item) => {
    if (matchedCardIds.has(item.cardId) || mismatchPair) return;

    setSelectedVi(item);

    if (selectedEn) {
      checkMatch(selectedEn, item);
    }
  };

  const checkMatch = (enItem, viItem) => {
    if (enItem.cardId === viItem.cardId) {
      // Correct match!
      if (soundEnabled) playMatchSound();
      setMatchedCardIds(prev => new Set([...prev, enItem.cardId]));
      setSelectedEn(null);
      setSelectedVi(null);
      setCombo(prev => prev + 1);
    } else {
      // Mismatch
      if (soundEnabled) playIncorrectSound();
      setMismatchPair({ enId: enItem.id, viId: viItem.id });
      setCombo(0);
      setTimeout(() => {
        setMismatchPair(null);
        setSelectedEn(null);
        setSelectedVi(null);
      }, 500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between py-2 space-y-5">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
            Mini-Game Phản Xạ • Nối Cặp Thần Tốc
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Chạm vào 1 từ tiếng Anh và 1 nghĩa tiếng Việt tương ứng
          </p>
        </div>

        {combo > 1 && (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 animate-bounce">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Combo x{combo}!</span>
          </div>
        )}
      </div>

      {/* 2-Column Matching Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 py-2">
        
        {/* Left Column: English Academic Words */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Từ Tiếng Anh Band 8.0
          </div>
          {items.enItems.map((item) => {
            const isMatched = matchedCardIds.has(item.cardId);
            const isSelected = selectedEn?.id === item.id;
            const isMismatched = mismatchPair?.enId === item.id;

            let cardStyle = "bg-slate-900 border-slate-700/80 text-white hover:border-blue-500/50 hover:bg-slate-800/90 shadow-md";

            if (isMatched) {
              cardStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 pointer-events-none";
            } else if (isMismatched) {
              cardStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500 animate-shake";
            } else if (isSelected) {
              cardStyle = "bg-blue-950/90 border-blue-400 text-blue-200 ring-2 ring-blue-500 shadow-blue-950/50 scale-102";
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectEn(item)}
                disabled={isMatched}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition flex items-center justify-between gap-2 cursor-pointer select-none ${cardStyle}`}
              >
                <div className="text-left">
                  <div className="leading-snug">{item.text}</div>
                  {item.ipa && (
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {item.ipa}
                    </div>
                  )}
                </div>
                {isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Vietnamese Meanings */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Nghĩa Tiếng Việt
          </div>
          {items.viItems.map((item) => {
            const isMatched = matchedCardIds.has(item.cardId);
            const isSelected = selectedVi?.id === item.id;
            const isMismatched = mismatchPair?.viId === item.id;

            let cardStyle = "bg-slate-900 border-slate-700/80 text-slate-200 hover:border-pink-500/50 hover:bg-slate-800/90 shadow-md";

            if (isMatched) {
              cardStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 pointer-events-none";
            } else if (isMismatched) {
              cardStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500 animate-shake";
            } else if (isSelected) {
              cardStyle = "bg-pink-950/90 border-pink-400 text-pink-200 ring-2 ring-pink-500 shadow-pink-950/50 scale-102";
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectVi(item)}
                disabled={isMatched}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left font-medium text-xs sm:text-xs transition flex items-center justify-between gap-2 cursor-pointer select-none leading-relaxed ${cardStyle}`}
              >
                <span>{item.text}</span>
                {isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Completion Banner */}
      {isRoundFinished && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black">
              ✓
            </div>
            <div>
              <h4 className="font-black text-sm sm:text-base text-emerald-300">
                Xuất sắc! Nối đúng 5/5 cặp từ (+25 XP)
              </h4>
              <p className="text-xs text-slate-300">
                Bạn đã ghi nhớ hoàn hảo các từ vựng này.
              </p>
            </div>
          </div>

          <button
            onClick={onRoundComplete}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp Tục Vòng Mới</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
