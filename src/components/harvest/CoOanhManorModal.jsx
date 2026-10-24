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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg pixel-panel p-5 sm:p-6 text-[#FFE8B8] space-y-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E0F07] pb-3">
          <div className="flex items-center gap-3">
            {/* NPC Avatar */}
            <div className="w-12 h-12 rounded-xl bg-[#5D3A1F] border-2 border-amber-400 p-1 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-3xl filter drop-shadow">👩‍🏫</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-base text-amber-200 tracking-tight">
                  CÔ OANH • MENTOR THỊ TRẤN
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-500/70 font-pixel font-bold">
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
                        : 'text-stone-500 fill-stone-700'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-amber-300 font-pixel font-bold ml-1.5 font-mono">
                  {points}/1000 Tim
                </span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-[#140804] text-amber-200 hover:text-white border border-[#4A2B11] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialogue Box (Retro RPG Style with typing effect) */}
        <div className="p-4 rounded-xl bg-[#24130A] border-2 border-[#5D3A1F] shadow-inner relative">
          <div className="absolute -top-2.5 left-4 px-2 py-0.2 rounded bg-amber-500 text-[#2D1A0D] text-[9px] font-pixel font-bold uppercase tracking-wider">
            Lời Khuyên Từ Cô Oanh
          </div>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-serif pt-1 min-h-[60px]">
            "{displayedText}"
            <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />
          </p>
        </div>

        {/* 5-Heart Milestone Perks */}
        <div className="space-y-2">
          <div className="font-pixel text-xs text-amber-300 flex items-center justify-between">
            <span>ĐẶC QUYỀN HỮU NGHỊ (5 MỐC TIM):</span>
            <span className="text-[10px] text-stone-400">Luyện tập để tăng tim</span>
          </div>

          <div className="space-y-1.5">
            {perks.map(p => (
              <div 
                key={p.heart}
                className={`p-2 rounded-lg border flex items-center justify-between text-xs transition ${
                  p.unlocked 
                    ? 'bg-amber-950/60 border-amber-500/80 text-amber-200' 
                    : 'bg-[#1E0F07] border-[#3B2314] text-stone-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[11px] text-rose-400">
                    {'❤️'.repeat(p.heart)}
                  </span>
                  <span className="font-medium">{p.title}</span>
                </div>
                <span className="font-pixel text-[10px]">
                  {p.unlocked ? 'ĐÃ MỞ ✓' : 'KHÓA'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
