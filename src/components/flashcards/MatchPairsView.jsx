import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakWord, playMatchSound, playIncorrectSound } from '../../services/soundEffects';

export default function MatchPairsView({ 
  cards, 
  onRoundComplete, 
  soundEnabled 
}) {
  const roundCards = useMemo(() => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [cards]);

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

  useEffect(() => {
    if (isRoundFinished) {
      confetti({
        particleCount: 50,
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
      if (soundEnabled) playMatchSound();
      setMatchedCardIds(prev => new Set([...prev, enItem.cardId]));
      setSelectedEn(null);
      setSelectedVi(null);
      setCombo(prev => prev + 1);
    } else {
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
          <span className="text-xs font-medium uppercase px-3 py-1 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#3E4F42]/20">
            Nối từ tương ứng
          </span>
          <p className="text-xs text-[#7A7369] mt-1">
            Chạm 1 từ tiếng Anh và 1 nghĩa tiếng Việt tương ứng
          </p>
        </div>

        {combo > 1 && (
          <div className="flex items-center gap-1 text-xs font-medium text-[#A67C52] bg-[#FAF5EE] px-2.5 py-1 rounded-xl border border-[#A67C52]/20">
            <Zap className="w-3.5 h-3.5 fill-[#A67C52]" />
            <span>Combo x{combo}</span>
          </div>
        )}
      </div>

      {/* 2-Column Matching Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 py-2">
        
        {/* Left Column: English Academic Words */}
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-[#7A7369] uppercase tracking-wider text-center">
            Từ Tiếng Anh
          </div>
          {items.enItems.map((item) => {
            const isMatched = matchedCardIds.has(item.cardId);
            const isSelected = selectedEn?.id === item.id;
            const isMismatched = mismatchPair?.enId === item.id;

            let cardStyle = "bg-white border-[#E6E2D8] text-[#24211E] hover:border-[#3E4F42]/40 shadow-xs";

            if (isMatched) {
              cardStyle = "bg-[#EDF3EE] border-[#3E4F42]/30 text-[#3E4F42] opacity-60 pointer-events-none";
            } else if (isMismatched) {
              cardStyle = "bg-[#FAF5EE] border-[#A67C52] text-[#A67C52] ring-1 ring-[#A67C52] animate-shake";
            } else if (isSelected) {
              cardStyle = "bg-[#EDF3EE] border-[#3E4F42] text-[#3E4F42] ring-1 ring-[#3E4F42] scale-102";
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectEn(item)}
                disabled={isMatched}
                className={`w-full p-3 sm:p-3.5 rounded-xl border text-center font-serif font-bold text-xs sm:text-sm transition flex items-center justify-between gap-2 cursor-pointer select-none ${cardStyle}`}
              >
                <div className="text-left font-sans">
                  <div className="leading-snug font-serif font-bold">{item.text}</div>
                  {item.ipa && (
                    <div className="text-[10px] text-[#7A7369] font-mono font-normal">
                      {item.ipa}
                    </div>
                  )}
                </div>
                {isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-[#3E4F42] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Vietnamese Meanings */}
        <div className="space-y-2">
          <div className="text-[11px] font-medium text-[#7A7369] uppercase tracking-wider text-center">
            Nghĩa Tiếng Việt
          </div>
          {items.viItems.map((item) => {
            const isMatched = matchedCardIds.has(item.cardId);
            const isSelected = selectedVi?.id === item.id;
            const isMismatched = mismatchPair?.viId === item.id;

            let cardStyle = "bg-white border-[#E6E2D8] text-[#24211E] hover:border-[#3E4F42]/40 shadow-xs";

            if (isMatched) {
              cardStyle = "bg-[#EDF3EE] border-[#3E4F42]/30 text-[#3E4F42] opacity-60 pointer-events-none";
            } else if (isMismatched) {
              cardStyle = "bg-[#FAF5EE] border-[#A67C52] text-[#A67C52] ring-1 ring-[#A67C52] animate-shake";
            } else if (isSelected) {
              cardStyle = "bg-[#EDF3EE] border-[#3E4F42] text-[#3E4F42] ring-1 ring-[#3E4F42] scale-102";
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectVi(item)}
                disabled={isMatched}
                className={`w-full p-3 sm:p-3.5 rounded-xl border text-left font-medium text-xs sm:text-xs transition flex items-center justify-between gap-2 cursor-pointer select-none leading-relaxed ${cardStyle}`}
              >
                <span>{item.text}</span>
                {isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-[#3E4F42] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Completion Banner */}
      {isRoundFinished && (
        <div className="p-4 rounded-2xl bg-[#EDF3EE] border border-[#3E4F42]/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#3E4F42] text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#3E4F42]">
                Hoàn thành vòng nối từ (+25 XP)
              </h4>
              <p className="text-xs text-[#7A7369]">
                Bạn đã ghi nhớ chính xác các cặp từ này.
              </p>
            </div>
          </div>

          <button
            onClick={onRoundComplete}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3E4F42] hover:bg-[#334237] text-white font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp Tục Vòng Mới</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
