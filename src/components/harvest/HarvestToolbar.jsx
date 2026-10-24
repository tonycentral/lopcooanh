import React from 'react';
import { sounds } from '../../services/soundEffects';

export const TOOLS_LIST = [
  { id: 'hoe', name: 'Cuốc Đất', icon: '⛏️', description: 'Xới đất để chuẩn bị luống trồng' },
  { id: 'water', name: 'Bình Tưới', icon: '💧', description: 'Tưới nước cho cây trồng mau lớn' },
  { id: 'scythe', name: 'Liềm Gặt', icon: '✂️', description: 'Thu hoạch cây chín rộ' },
  { id: 'seeds', name: 'Hạt Giống', icon: '🌱', description: 'Chọn hạt giống IELTS để gieo trồng' },
  { id: 'fishing', name: 'Cần Câu', icon: '🎣', description: 'Bến sông luyện Nghe & Chép chính tả' },
  { id: 'pickaxe', name: 'Hầm Mỏ', icon: '💎', description: 'Khai phá Đọc hiểu & Tư duy phản biện' },
  { id: 'backpack', name: 'Balo', icon: '🎒', description: 'Kho chứa nông sản & Thùng xuất khẩu' },
  { id: 'quests', name: 'Bảng Tin', icon: '📜', description: 'Nhiệm vụ thị trấn từ Cô Oanh' }
];

export default function HarvestToolbar({
  activeTool,
  onSelectTool,
  onOpenSeedPouch,
  onOpenBackpack,
  onOpenBulletin,
  onOpenFishing,
  onOpenMines,
  unclaimedQuestsCount = 0,
  shippingCount = 0
}) {
  const handleToolClick = (toolId) => {
    sounds.playClick();
    onSelectTool(toolId);

    if (toolId === 'seeds' && onOpenSeedPouch) onOpenSeedPouch();
    if (toolId === 'backpack' && onOpenBackpack) onOpenBackpack();
    if (toolId === 'quests' && onOpenBulletin) onOpenBulletin();
    if (toolId === 'fishing' && onOpenFishing) onOpenFishing();
    if (toolId === 'pickaxe' && onOpenMines) onOpenMines();
  };

  return (
    <div className="fixed bottom-2 inset-x-0 mx-auto max-w-xl px-2 z-30 pointer-events-none select-none">
      <div className="harvest-panel-dark p-1.5 sm:p-2 pointer-events-auto flex items-center justify-between gap-1 shadow-2xl backdrop-blur-md">
        
        {TOOLS_LIST.map((tool, idx) => {
          const isActive = activeTool === tool.id;
          const isQuests = tool.id === 'quests';
          const isBackpack = tool.id === 'backpack';

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool.id)}
              className={`relative flex-1 py-1 sm:py-1.5 flex flex-col items-center justify-center rounded-xl transition cursor-pointer border ${
                isActive 
                  ? 'bg-amber-500 text-[#3E2723] border-amber-300 shadow-md scale-105 font-black' 
                  : 'bg-[#4E342E]/70 hover:bg-[#5D4037] text-amber-100 border-[#6D4C41] active:scale-95'
              }`}
              title={`${tool.name} (Phím ${idx + 1}): ${tool.description}`}
            >
              {/* Hotkey Number Badge */}
              <span className={`absolute top-0.5 left-1 text-[8px] font-mono leading-none ${
                isActive ? 'text-[#3E2723]' : 'text-amber-200/60'
              }`}>
                {idx + 1}
              </span>

              {/* Notification Badges */}
              {isQuests && unclaimedQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce border border-white">
                  {unclaimedQuestsCount}
                </span>
              )}

              {isBackpack && shippingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[#3E2723] text-[9px] font-black flex items-center justify-center border border-white">
                  {shippingCount}
                </span>
              )}

              <span className="text-lg sm:text-xl filter drop-shadow">
                {tool.icon}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold leading-tight mt-0.5 hidden xs:inline truncate max-w-full">
                {tool.name}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
