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
    active: "bg-[#4A5D4E] text-white shadow-sm",
    badgeActive: "bg-[#3D4E41] text-[#E0EAE1]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  education: {
    active: "bg-[#B08050] text-white shadow-sm",
    badgeActive: "bg-[#946A3E] text-[#FDF4EB]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  technology: {
    active: "bg-[#55696E] text-white shadow-sm",
    badgeActive: "bg-[#435458] text-[#E7EFF1]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  environment: {
    active: "bg-[#566B50] text-white shadow-sm",
    badgeActive: "bg-[#43543E] text-[#ECF4EB]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  transport: {
    active: "bg-[#4F6A6E] text-white shadow-sm",
    badgeActive: "bg-[#3E5558] text-[#E6F0F2]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  health: {
    active: "bg-[#B06352] text-white shadow-sm",
    badgeActive: "bg-[#935041] text-[#FCEEEA]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  work_career: {
    active: "bg-[#546073] text-white shadow-sm",
    badgeActive: "bg-[#424D5E] text-[#EAEEF5]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  business: {
    active: "bg-[#7A6150] text-white shadow-sm",
    badgeActive: "bg-[#624D3E] text-[#F4EDE7]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  society_family: {
    active: "bg-[#7E5C6A] text-white shadow-sm",
    badgeActive: "bg-[#664955] text-[#F5ECEF]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  crime_law: {
    active: "bg-[#8A5852] text-white shadow-sm",
    badgeActive: "bg-[#714540] text-[#F7ECEB]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
  },
  culture_arts: {
    active: "bg-[#AD6D49] text-white shadow-sm",
    badgeActive: "bg-[#8E5637] text-[#FAF0EA]",
    badgeInactive: "bg-[#E8E2D8] text-[#736C63]"
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
                    : "bg-white hover:bg-[#FAF8F5] text-[#6E675E] hover:text-[#2B2826] border border-[#E7E2D9] shadow-sm"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer select-none shrink-0 shadow-sm ${
                isSelected
                  ? "bg-[#4A5D4E] text-white shadow-sm ring-1 ring-[#3D4E41]"
                  : "bg-white hover:bg-[#FAF8F5] text-[#6E675E] hover:text-[#2B2826] border border-[#E7E2D9]"
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
          className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-[#655243] hover:bg-[#544436] text-white shadow-sm transition cursor-pointer select-none shrink-0 flex items-center gap-1.5"
          title="Chọn chủ đề ngẫu nhiên trong nhóm này"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* Prominent, Legible IELTS Prompt Card (Larger Font & Task 1 Bar Chart Action) */}
      {selectedTopic && (
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-[#E7E2D9] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                activeTask === 'task1'
                  ? 'bg-[#EDF3EE] text-[#3D5240] border-[#CAD8C8]'
                  : 'bg-[#EDF3EE] text-[#3D5240] border-[#CAD8C8]'
              }`}>
                {activeTask === 'task1' ? 'Đề bài Task 1' : 'Đề bài Task 2'}
              </span>
              {selectedTopic.categoryVietnameseName && activeTask === 'task2' && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5EFE7] text-[#755940] border border-[#E5DACF] font-bold">
                  {selectedTopic.categoryVietnameseName}
                </span>
              )}
              <span className="text-xs font-semibold text-[#5A524A]">
                {selectedTopic.vietnameseName || selectedTopic.name}
              </span>
              {selectedTopic.tag && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F2EFE9] text-[#7A7369] hidden md:inline">
                  {selectedTopic.tag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Layout Switcher for Task 1: 3 Cột song song vs 2 Cột gộp */}
              {activeTask === 'task1' && onToggleTask1Layout && (
                <div className="flex items-center bg-[#EFECE5] p-0.5 rounded-xl border border-[#DDD6CB] text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleTask1Layout('three-col')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      task1Layout === 'three-col'
                        ? 'bg-[#4A5D4E] text-white shadow-sm'
                        : 'text-[#6E675E] hover:text-[#2B2826]'
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
                        ? 'bg-[#4A5D4E] text-white shadow-sm'
                        : 'text-[#6E675E] hover:text-[#2B2826]'
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
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDF3EE] hover:bg-[#E2ECE3] text-[#344837] border border-[#CAD8C8] text-xs font-bold transition cursor-pointer shrink-0 shadow-sm"
                  title="Mở biểu đồ số liệu toàn màn hình"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#4A5D4E]" />
                  <span>Phóng to</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt description - Large, clear font, no truncation */}
          <p className="text-sm sm:text-[15px] font-medium text-[#2B2826] leading-relaxed font-sans select-text">
            "{selectedTopic.ieltsPrompt}"
          </p>
        </div>
      )}
    </div>
  );
}
