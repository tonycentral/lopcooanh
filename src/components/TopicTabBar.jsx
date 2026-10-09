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

const UNIFIED_CATEGORY_STYLE = {
  active: "bg-[#3E4F42] text-white shadow-xs",
  badgeActive: "bg-white/20 text-white",
  badgeInactive: "bg-[#F4EFEA] text-[#7A7369]"
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

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer select-none shrink-0 ${
                  isCatSelected
                    ? UNIFIED_CATEGORY_STYLE.active
                    : "bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
                }`}
                title={cat.description}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.shortName}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isCatSelected ? UNIFIED_CATEGORY_STYLE.badgeActive : UNIFIED_CATEGORY_STYLE.badgeInactive
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
          const label = topic.vietnameseName ? topic.vietnameseName.split('&')[0].trim() : topic.name;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onSelectTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer select-none shrink-0 ${
                isSelected
                  ? "bg-[#3E4F42] text-white shadow-xs"
                  : "bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
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
          className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap bg-white hover:bg-[#FAF8F5] text-[#3E4F42] border border-[#D1DDD3] transition cursor-pointer select-none shrink-0 flex items-center gap-1.5"
          title="Chọn chủ đề ngẫu nhiên"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* Prominent, Legible IELTS Prompt Card - Clean & Minimalist */}
      {selectedTopic && (
        <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                {activeTask === 'task1' ? 'Task 1' : 'Task 2'}
              </span>
              <span className="text-xs font-medium text-[#24211E]">
                {selectedTopic.vietnameseName || selectedTopic.name}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Layout Switcher for Task 1 */}
              {activeTask === 'task1' && onToggleTask1Layout && (
                <div className="flex items-center bg-[#F4EFEA] p-0.5 rounded-xl border border-[#E6E2D8] text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleTask1Layout('three-col')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      task1Layout === 'three-col'
                        ? 'bg-[#3E4F42] text-white shadow-xs'
                        : 'text-[#7A7369] hover:text-[#24211E]'
                    }`}
                    title="3 Cột song song"
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                    <span>3 Cột</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleTask1Layout('stacked')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      task1Layout === 'stacked'
                        ? 'bg-[#3E4F42] text-white shadow-xs'
                        : 'text-[#7A7369] hover:text-[#24211E]'
                    }`}
                    title="2 Cột gộp"
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
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#3E4F42] border border-[#D1DDD3] text-xs font-medium transition cursor-pointer shrink-0"
                  title="Phóng to biểu đồ"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt text */}
          <p className="text-sm sm:text-[15px] text-[#24211E] leading-relaxed select-text font-serif">
            "{selectedTopic.ieltsPrompt}"
          </p>
        </div>
      )}
    </div>
  );
}
