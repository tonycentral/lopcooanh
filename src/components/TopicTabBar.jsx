import React, { useState, useMemo } from 'react';
import { 
  Shuffle, 
  BarChart3, 
  Columns3, 
  Columns2, 
  Layers,
  GraduationCap,
  Cpu,
  Leaf,
  Car,
  HeartPulse,
  Briefcase,
  TrendingUp,
  Users,
  Scale,
  Landmark
} from 'lucide-react';
import { MASTER_TOPIC_CATEGORIES, getMasterCategoryId } from '../data/topicCategories';

const CATEGORY_ICONS = {
  Layers,
  GraduationCap,
  Cpu,
  Leaf,
  Car,
  HeartPulse,
  Briefcase,
  TrendingUp,
  Users,
  Scale,
  Landmark
};

const CATEGORY_STYLES = {
  ALL: {
    active: "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400",
    badgeActive: "bg-blue-500/40 text-blue-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  education: {
    active: "bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400",
    badgeActive: "bg-amber-500/40 text-amber-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  technology: {
    active: "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400",
    badgeActive: "bg-cyan-500/40 text-cyan-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  environment: {
    active: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400",
    badgeActive: "bg-emerald-500/40 text-emerald-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  transport: {
    active: "bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400",
    badgeActive: "bg-teal-500/40 text-teal-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  health: {
    active: "bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400",
    badgeActive: "bg-rose-500/40 text-rose-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  work_career: {
    active: "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400",
    badgeActive: "bg-indigo-500/40 text-indigo-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  business: {
    active: "bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400",
    badgeActive: "bg-violet-500/40 text-violet-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  society_family: {
    active: "bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400",
    badgeActive: "bg-purple-500/40 text-purple-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  crime_law: {
    active: "bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400",
    badgeActive: "bg-red-500/40 text-red-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  },
  culture_arts: {
    active: "bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400",
    badgeActive: "bg-orange-500/40 text-orange-100",
    badgeInactive: "bg-slate-800 text-slate-400"
  }
};

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
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Compute topic counts for each of the 10 master categories
  const categoryCounts = useMemo(() => {
    if (activeTask === 'task1') return {};
    const counts = { ALL: list.length };
    MASTER_TOPIC_CATEGORIES.forEach(cat => {
      if (cat.id !== 'ALL') counts[cat.id] = 0;
    });
    list.forEach(t => {
      const catId = t.topicCategory || getMasterCategoryId(t);
      if (counts[catId] !== undefined) {
        counts[catId]++;
      } else {
        counts['society_family'] = (counts['society_family'] || 0) + 1;
      }
    });
    return counts;
  }, [list, activeTask]);

  // Filter topics purely by selected master category
  const displayTopics = useMemo(() => {
    if (activeTask === 'task1' || selectedCategory === 'ALL') return list;
    return list.filter(t => (t.topicCategory || getMasterCategoryId(t)) === selectedCategory);
  }, [list, activeTask, selectedCategory]);

  // Handle master category tab click
  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'ALL') return;

    // If currently selected topic is not in the clicked category, auto-select the first topic in that category
    const currentCat = selectedTopic ? (selectedTopic.topicCategory || getMasterCategoryId(selectedTopic)) : null;
    if (currentCat !== catId) {
      const candidates = list.filter(t => (t.topicCategory || getMasterCategoryId(t)) === catId);
      if (candidates.length > 0) {
        onSelectTopic(candidates[0]);
      }
    }
  };

  // Smart random within current filtered view
  const handleRandomClick = () => {
    if (displayTopics.length > 0) {
      const candidates = displayTopics.filter(t => t.id !== selectedTopic?.id);
      const pool = candidates.length > 0 ? candidates : displayTopics;
      const random = pool[Math.floor(Math.random() * pool.length)];
      onSelectTopic(random);
    } else if (onRandomTopic) {
      onRandomTopic();
    }
  };

  return (
    <div className="space-y-2">
      {/* 10 Master Thematic Groups Filter Bar for Task 2 */}
      {activeTask === 'task2' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {MASTER_TOPIC_CATEGORIES.map(cat => {
            const isCatSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            const IconComp = CATEGORY_ICONS[cat.icon] || Layers;
            const style = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.ALL;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none shrink-0 ${
                  isCatSelected
                    ? style.active
                    : "bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                }`}
                title={cat.description}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.shortName}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isCatSelected ? style.badgeActive : style.badgeInactive
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Horizontal Topic Tabs + Random Tab */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {displayTopics.map((topic) => {
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
              <span>{label}</span>
            </button>
          );
        })}

        {/* Dedicated Random Topic Tab */}
        <button
          type="button"
          onClick={handleRandomClick}
          className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25 transition cursor-pointer select-none shrink-0 flex items-center gap-1.5"
          title="Chọn chủ đề ngẫu nhiên trong nhóm này"
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
              {selectedTopic.categoryVietnameseName && activeTask === 'task2' && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                  {selectedTopic.categoryVietnameseName}
                </span>
              )}
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
