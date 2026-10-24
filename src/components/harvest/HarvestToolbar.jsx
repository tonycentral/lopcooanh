import React from 'react';
import { sounds } from '../../services/soundEffects';

export const TOOLS_LIST = [
  { id: 'almanac', name: 'Almanac', icon: '📖', description: 'Mở Cuốn Niên Giám Học Tập Morning Almanac' },
  { id: 'hoe', name: 'Cuốc Đất', icon: '⛏️', description: 'Xới đất chuẩn bị luống trồng từ vựng' },
  { id: 'water', name: 'Tưới Nước', icon: '💧', description: 'Tưới nước & ôn tập củng cố cây trồng' },
  { id: 'scythe', name: 'Gặt Cây', icon: '🌾', description: 'Thu hoạch cây chín rộ & lưu Heirloom' },
  { id: 'kitchen', name: 'Nhà Bếp', icon: '🍳', description: 'Nấu các món ăn Collocations học thuật' },
  { id: 'pasture', name: 'Chuồng Nuôi', icon: '🐔', description: 'Chăm bón vật nuôi ngữ pháp (Gà, Bò, Cừu)' },
  { id: 'backpack', name: 'Túi Đồ', icon: '🎒', description: 'Kho chứa nông sản & Thùng xuất khẩu' },
  { id: 'quests', name: 'Bảng Tin', icon: '📜', description: 'Nhiệm vụ thị trấn từ Cô Oanh' }
];

export default function HarvestToolbar({
  activeTool,
  onSelectTool,
  onOpenAlmanac,
  onOpenKitchen,
  onOpenPasture,
  onOpenSeedPouch,
  onOpenBackpack,
  onOpenBulletin,
  unclaimedQuestsCount = 0,
  shippingCount = 0
}) {
  const handleToolClick = (toolId) => {
    sounds.playClick();
    onSelectTool(toolId);

    if (toolId === 'almanac' && onOpenAlmanac) onOpenAlmanac();
    if (toolId === 'kitchen' && onOpenKitchen) onOpenKitchen();
    if (toolId === 'pasture' && onOpenPasture) onOpenPasture();
    if (toolId === 'backpack' && onOpenBackpack) onOpenBackpack();
    if (toolId === 'quests' && onOpenBulletin) onOpenBulletin();
  };

  return (
    <div className="fixed bottom-2 inset-x-0 mx-auto max-w-xl px-2 z-30 pointer-events-none select-none font-sans">
      <div className="pixel-panel p-1.5 sm:p-2 pointer-events-auto flex items-center justify-between gap-1 shadow-2xl backdrop-blur-md">
        
        {TOOLS_LIST.map((tool, idx) => {
          const isActive = activeTool === tool.id;
          const isQuests = tool.id === 'quests';
          const isBackpack = tool.id === 'backpack';

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool.id)}
              className={`relative flex-1 py-1 sm:py-1.5 flex flex-col items-center justify-center rounded-lg transition cursor-pointer border-2 ${
                isActive 
                  ? 'bg-amber-400 text-[#2D1A0D] border-amber-200 shadow-md scale-105 font-bold' 
                  : 'bg-[#2D1A0D] hover:bg-[#4A2B11] text-amber-100 border-[#140804] active:scale-95'
              }`}
              title={`${tool.name} (Phím ${idx + 1}): ${tool.description}`}
            >
              {/* Hotkey Number Badge */}
              <span className={`absolute top-0.5 left-1 text-[8px] font-pixel leading-none ${
                isActive ? 'text-[#2D1A0D]' : 'text-amber-300/60'
              }`}>
                {idx + 1}
              </span>

              {/* Notification Badges */}
              {isQuests && unclaimedQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-pixel text-[8px] font-black flex items-center justify-center animate-bounce border border-white">
                  {unclaimedQuestsCount}
                </span>
              )}

              {isBackpack && shippingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[#2D1A0D] font-pixel text-[8px] font-black flex items-center justify-center border border-white">
                  {shippingCount}
                </span>
              )}

              <span className="text-base sm:text-xl filter drop-shadow">
                {tool.icon}
              </span>
              <span className="text-[9px] font-pixel leading-tight mt-0.5 hidden xs:inline truncate max-w-full">
                {tool.name}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
