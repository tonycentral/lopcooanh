import React from 'react';
import { X, Package, ArrowUpRight } from 'lucide-react';

const CROP_ICONS = {
  wheat: { name: 'Lúa Mì Từ Vựng', icon: '🌾', desc: 'Thu hoạch từ việc rèn luyện từ vựng & flashcards' },
  apples: { name: 'Táo Đỏ Ngữ Pháp', icon: '🍎', desc: 'Thu hoạch từ việc sửa lỗi ngữ pháp & câu phức' },
  tomatoes: { name: 'Cà Chua Task 1', icon: '🍅', desc: 'Thu hoạch từ các câu miêu tả số liệu Task 1' },
  pumpkins: { name: 'Bí Ngô Vàng Task 2', icon: '🎃', desc: 'Thu hoạch từ các luận điểm phản biện Task 2' },
  strawberries: { name: 'Dâu Tây Phát Âm', icon: '🍓', desc: 'Thu hoạch từ bài luyện phát âm & ngữ điệu' },
  sunflowers: { name: 'Hướng Dương Tư Duy', icon: '🌻', desc: 'Thu hoạch từ bài tập đọc hiểu & tư duy' }
};

export default function BarnInventoryModal({ isOpen, onClose, inventory = {}, onOpenCoopTrain }) {
  if (!isOpen) return null;

  const totalItems = Object.values(inventory).reduce((a, b) => a + (b || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] border border-[#DDD6CB] rounded-3xl p-6 shadow-2xl text-[#2B2826] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFECE5] text-[#4A5D4E] flex items-center justify-center text-xl font-bold border border-[#DDD6CB]">
              🏚️
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#2B2826] flex items-center gap-2">
                <span>Kho Nông Sản Điền Trang</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFECE5] text-[#5A524A] font-bold border border-[#DDD6CB]">
                  Tổng {totalItems} nông sản
                </span>
              </h3>
              <p className="text-xs text-[#6E675E]">
                Nông sản thu hoạch từ việc hoàn thành các bài học và thử thách IELTS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8E867B] hover:text-[#2B2826] hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(CROP_ICONS).map(([key, info]) => {
            const count = inventory[key] || 0;
            return (
              <div 
                key={key}
                className="p-3.5 rounded-2xl bg-white border border-[#DDD6CB] shadow-sm flex flex-col items-center text-center space-y-1.5"
              >
                <div className="text-3xl">{info.icon}</div>
                <div className="text-xs font-bold text-[#2B2826]">{info.name}</div>
                <div className="text-lg font-black text-[#4A5D4E]">
                  x{count}
                </div>
                <p className="text-[10px] text-[#8E867B] line-clamp-2 leading-tight">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="p-4 rounded-2xl bg-[#EFECE5]/80 border border-[#DDD6CB] flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[#2B2826]">Dùng nông sản đóng góp chuyến tàu lớp:</div>
            <div className="text-[#6E675E] text-[11px]">Đóng góp để nhận thêm Bút Vàng và tăng thứ hạng lớp học!</div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenCoopTrain) onOpenCoopTrain();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#4A5D4E] hover:bg-[#3D4E41] text-white font-bold text-xs transition flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
          >
            <span>Chuyến Tàu</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
