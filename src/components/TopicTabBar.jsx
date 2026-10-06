import React from 'react';
import { Shuffle } from 'lucide-react';

export default function TopicTabBar({ 
  topics, 
  selectedTopic, 
  onSelectTopic, 
  onRandomTopic 
}) {
  const list = topics && topics.length > 0 ? topics : [];

  return (
    <div className="space-y-1.5">
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
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
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
          className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/25 transition cursor-pointer select-none shrink-0 flex items-center gap-1.5"
          title="Chọn chủ đề ngẫu nhiên"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* Compact IELTS Prompt Bar */}
      {selectedTopic && (
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-baseline gap-2">
          <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] shrink-0">
            Đề bài:
          </span>
          <p className="text-slate-300 italic truncate font-mono text-xs">
            "{selectedTopic.ieltsPrompt}"
          </p>
        </div>
      )}
    </div>
  );
}
