import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, BookOpen, Coffee, MessageCircle } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export default function CoOanhManorModal({
  isOpen,
  onClose,
  friendship,
  onGiftCoOanh,
  userInventory = []
}) {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = friendship?.currentDialogue || 
    'Chào em! Cô rất vui khi thấy nông trại Mochi của em mỗi ngày một xanh tốt. Việc học IELTS cũng như làm nông nghiệp vậy: gieo từ vựng đúng cách, chăm chút từng cấu trúc câu, rồi sẽ đến ngày gặt hái band điểm ngọt ngào!';

  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      let idx = 0;
      const timer = setInterval(() => {
        if (idx < fullText.length) {
          setDisplayedText(prev => prev + fullText.charAt(idx));
          if (idx % 3 === 0) sounds.playDialogueBlip();
          idx++;
        } else {
          clearInterval(timer);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isOpen, fullText]);

  if (!isOpen) return null;

  const hearts = friendship?.hearts || 0;
  const points = friendship?.points || 0;

  const perks = [
    { heart: 1, title: 'Bí Kíp Mở Bài Task 1 & 2 Chuẩn Band 7.0+', unlocked: hearts >= 1 },
    { heart: 2, title: 'Bản Đồ 100 Collocation C2 Tránh Lỗi Phổ Biến', unlocked: hearts >= 2 },
    { heart: 3, title: 'Công Thức Đoạn Thân Bài Đạt Điểm Tuyệt Đối Coherence 9.0', unlocked: hearts >= 3 },
    { heart: 4, title: 'Bùa May Mắn Iridium (x1.5 Thu Hoạch Vụ Mùa)', unlocked: hearts >= 4 },
    { heart: 5, title: 'Thư Giới Thiệu & Buổi Kèm 1-1 Trực Tiếp Cùng Cô Oanh', unlocked: hearts >= 5 }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg harvest-panel p-5 sm:p-6 text-[#3E2723] space-y-4 border-4 border-[#795548] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8D6E63] pb-3">
          <div className="flex items-center gap-3">
            {/* NPC Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-[#EFEBE9] border-2 border-[#8D6E63] p-1 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-3xl filter drop-shadow">👩‍🏫</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#2B2826] tracking-tight">
                  Cô Oanh (Cố Vấn Thị Trấn)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                  Mentor
                </span>
              </div>
              
              {/* Hearts Meter */}
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(h => (
                  <Heart 
                    key={h}
                    className={`w-3.5 h-3.5 ${
                      h <= hearts 
                        ? 'text-rose-500 fill-rose-500 animate-pulse' 
                        : 'text-stone-300 fill-stone-200'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-[#6D4C41] font-bold ml-1.5 font-mono">
                  {points}/1000 Điểm Thân Thiết
                </span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialogue Box (Retro RPG Style with typing effect) */}
        <div className="relative bg-[#FFFDE7] border-2 border-[#8D6E63] rounded-2xl p-4 shadow-inner min-h-[90px] flex items-start gap-3">
          <div className="text-xl shrink-0 mt-0.5">💬</div>
          <p className="text-xs sm:text-sm text-[#3E2723] leading-relaxed font-medium">
            {displayedText}
          </p>
        </div>

        {/* Unlocked Master Secrets & Perks */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase text-[#5D4037] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Mốc Thân Thiết &amp; Bí Kíp Giảng Dạy Của Cô Oanh:</span>
          </div>

          <div className="space-y-1.5 max-h-[28vh] overflow-y-auto pr-1">
            {perks.map(p => (
              <div 
                key={p.heart}
                className={`p-2 rounded-xl border text-xs flex items-center justify-between transition ${
                  p.unlocked 
                    ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' 
                    : 'bg-stone-100 border-stone-200 text-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/80 border border-[#D7CCC8]">
                    {p.heart} ❤️
                  </span>
                  <span className="leading-snug">{p.title}</span>
                </div>
                <span>{p.unlocked ? '🔓 Đã mở' : '🔒 Khóa'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playCoin();
              onClose();
            }}
            className="w-full py-2.5 harvest-btn-gold text-xs font-black shadow-md cursor-pointer"
          >
            Cảm Ơn Cô Oanh! Em Sẽ Luyện Tập Ngay ✨
          </button>
        </div>

      </div>
    </div>
  );
}
