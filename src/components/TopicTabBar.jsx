import React from 'react';
import { Shuffle, BarChart3, Columns3, Columns2 } from 'lucide-react';

export default function TopicTabBar({ 
  topics, 
  selectedTopic, 
  onSelectTopic, 
  onRandomTopic,
  activeTask,
  onOpenChartModal,
  task1Layout = 'three-col',
  onToggleTask1Layout
}) {
  const list = topics && topics.length > 0 ? topics : [];

  return (
    <div className="space-y-2">
      {/* Horizontal Topic Tabs + Random Tab */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {list.map((topic) => {
          const isSelected = selectedTopic?.id === topic.id;
          // Short label prioritizing Vietnamese name
          const label = topic.vietnameseName ? topic.vietnameseName.split('&')[0].trim() : topic.name;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer select-none shrink-0 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {label}
            </button>
          );
        })}

        {/* Dedicated Random Topic Tab */}
        <button
          type="button"
          onClick={onRandomTopic}
          className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25 transition cursor-pointer select-none shrink-0 flex items-center gap-1.5"
          title="Chọn chủ đề ngẫu nhiên"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* Prominent, Legible IELTS Prompt Card (Larger Font & Task 1 Bar Chart Action) */}
      {selectedTopic && (
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                activeTask === 'task1'
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  : 'bg-blue-600/15 text-blue-300 border-blue-500/30'
              }`}>
                {activeTask === 'task1' ? 'Đề bài Task 1' : 'Đề bài Task 2'}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {selectedTopic.vietnameseName || selectedTopic.name}
              </span>
              {selectedTopic.tag && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 hidden md:inline">
                  {selectedTopic.tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Layout Switcher for Task 1: 3 Cột song song vs 2 Cột gộp */}
              {activeTask === 'task1' && onToggleTask1Layout && (
                <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleTask1Layout('three-col')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      task1Layout === 'three-col'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-1 ring-blue-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ 3 Cột song song: Luôn thấy Đề/Biểu đồ & Từ vựng & Luyện tập"
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                    <span>3 Cột</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleTask1Layout('stacked')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      task1Layout === 'stacked'
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-1 ring-blue-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ Cột trái 2 tầng: Nửa trên Biểu đồ, nửa dưới Từ vựng"
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    <span>2 Cột</span>
                  </button>
                </div>
              )}

              {/* Quick Chart modal button for Task 1 */}
              {activeTask === 'task1' && onOpenChartModal && (
                <button
                  type="button"
                  onClick={onOpenChartModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition cursor-pointer shrink-0 shadow-sm"
                  title="Mở biểu đồ số liệu toàn màn hình"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Phóng to</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt description - Large, clear font, no truncation */}
          <p className="text-sm sm:text-[15px] font-medium text-slate-100 leading-snug font-sans select-text">
            "{selectedTopic.ieltsPrompt}"
          </p>
        </div>
      )}
    </div>
  );
}
