import React from 'react';
import { FARM_AREAS } from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';
import { Compass } from 'lucide-react';

export default function FarmAreaNavSidebar({
  activeAreaId,
  onSelectArea
}) {
  return (
    <aside className="h-full shrink-0 bg-[#1A0C05] text-[#FFF8E7] border-r-4 border-[#0F0502] shadow-2xl flex flex-col justify-between p-2 sm:p-2.5 z-20 select-none font-sans w-14 xs:w-16 sm:w-48 lg:w-52 transition-all">
      
      {/* Top Header */}
      <div className="shrink-0 mb-2">
        <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-[#261207] border border-[#4A2610]">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-300 shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="hidden sm:block min-w-0">
            <div className="font-pixel text-[11px] font-bold text-amber-300 leading-tight truncate">
              KHU VỰC
            </div>
            <div className="text-[9px] text-amber-200/60 leading-tight font-medium">
              5 Kỹ Năng IELTS
            </div>
          </div>
        </div>
      </div>

      {/* 5 Area Navigation Buttons */}
      <nav className="flex-1 flex flex-col gap-2 justify-center">
        {FARM_AREAS.map(area => {
          const isActive = activeAreaId === area.id;

          return (
            <button
              key={area.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                if (onSelectArea) onSelectArea(area.id);
              }}
              className={`relative w-full p-1.5 sm:p-2 rounded-xl transition cursor-pointer flex items-center gap-2 sm:gap-2.5 border-2 text-left group ${
                isActive
                  ? 'bg-amber-400 text-[#201007] border-yellow-200 shadow-xl font-black scale-[1.03] ring-2 ring-amber-400/50'
                  : 'bg-[#261207] text-amber-200/90 border-[#3D1E0C] hover:bg-[#381B0C] hover:text-white hover:border-amber-500/60'
              }`}
              title={`${area.name} — ${area.skillTitle}: ${area.description}`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r bg-yellow-300 shadow-sm" />
              )}

              {/* Icon */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xl shrink-0 transition ${
                isActive 
                  ? 'bg-[#201007]/15 filter drop-shadow' 
                  : 'bg-[#180A04] group-hover:scale-110'
              }`}>
                {area.icon}
              </div>

              {/* Area Name & Skill Badge (Desktop) */}
              <div className="hidden sm:flex flex-col min-w-0 flex-1">
                <span className={`font-pixel text-xs truncate leading-tight ${
                  isActive ? 'text-[#201007] font-bold' : 'text-amber-100 group-hover:text-amber-300'
                }`}>
                  {area.name}
                </span>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[8px] px-1.5 py-0.2 rounded font-sans uppercase font-black tracking-wide leading-none ${
                    isActive 
                      ? 'bg-[#201007] text-amber-300' 
                      : 'bg-[#140702] text-amber-400 border border-amber-500/30'
                  }`}>
                    {area.skillName}
                  </span>
                </div>
              </div>

              {/* Mobile Short Skill Label */}
              <span className={`sm:hidden text-[7px] font-pixel block text-center truncate uppercase leading-none font-bold ${
                isActive ? 'text-[#201007]' : 'text-amber-300/80'
              }`}>
                {area.skillName.slice(0, 4)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info Hint */}
      <div className="shrink-0 mt-2 hidden sm:block">
        <div className="p-1.5 rounded-xl bg-[#140702] border border-[#301608] text-[9px] text-amber-200/60 text-center font-pixel leading-tight">
          Click để dịch chuyển
        </div>
      </div>

    </aside>
  );
}
