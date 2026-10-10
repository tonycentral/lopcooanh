import React, { useMemo } from 'react';
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

// 10 Classified Master Topics ONLY (excluding 'ALL') - Unified for Task 1, Task 2 & Vocab
const CLASSIFIED_10_TOPICS = MASTER_TOPIC_CATEGORIES.filter(cat => cat.id !== 'ALL');

export default function TopicTabBar({ 
  topics, 
  selectedTopic, 
  onSelectTopic, 
  onRandomTopic,
  activeTask,
  onOpenChartModal,
  task1Layout = 'three-col',
  onToggleTask1Layout,
  hidePromptCard = false
}) {
  const list = topics && topics.length > 0 ? topics : [];

  // Determine current active category ID matching the 10 master categories
  const activeCatId = useMemo(() => {
    if (!selectedTopic) return 'education';
    if (selectedTopic.topicCategory) return selectedTopic.topicCategory;
    if (selectedTopic.id && CLASSIFIED_10_TOPICS.some(c => c.id === selectedTopic.id)) {
      return selectedTopic.id;
    }
    return getMasterCategoryId(selectedTopic) || 'education';
  }, [selectedTopic]);

  // Matching prompts/charts for the currently active category
  const currentCategoryPrompts = useMemo(() => {
    return list.filter(t => 
      t.id === activeCatId || 
      t.topicCategory === activeCatId || 
      getMasterCategoryId(t) === activeCatId
    );
  }, [list, activeCatId]);

  // Current prompt index within the category
  const currentPromptIndex = useMemo(() => {
    if (!selectedTopic || currentCategoryPrompts.length === 0) return 0;
    const idx = currentCategoryPrompts.findIndex(t => t.id === selectedTopic.id);
    return idx >= 0 ? idx : 0;
  }, [selectedTopic, currentCategoryPrompts]);

  // Handle click on one of the 10 classified master topics
  const handleCategoryClick = (catId) => {
    const matching = list.filter(t => 
      t.id === catId || 
      t.topicCategory === catId || 
      getMasterCategoryId(t) === catId
    );
    if (matching.length === 0) return;

    // If clicking the category that is already active, cycle through prompts/charts in this category
    if (activeCatId === catId && matching.length > 1) {
      const currentIdx = matching.findIndex(t => t.id === selectedTopic?.id);
      const nextIdx = (currentIdx + 1) % matching.length;
      onSelectTopic(matching[nextIdx]);
    } else {
      // Select the primary or first prompt/chart of this category
      const primary = matching.find(t => t.id === catId) || matching[0];
      onSelectTopic(primary);
    }
  };

  // Next prompt/chart in the same category
  const handleNextPromptInCategory = () => {
    if (currentCategoryPrompts.length <= 1) return;
    const nextIdx = (currentPromptIndex + 1) % currentCategoryPrompts.length;
    onSelectTopic(currentCategoryPrompts[nextIdx]);
  };

  // Smart random topic selector across the 10 classified master topics
  const handleRandomClick = () => {
    const candidates = CLASSIFIED_10_TOPICS.filter(c => c.id !== activeCatId);
    const pool = candidates.length > 0 ? candidates : CLASSIFIED_10_TOPICS;
    const randomCat = pool[Math.floor(Math.random() * pool.length)];
    if (randomCat) {
      handleCategoryClick(randomCat.id);
    } else if (onRandomTopic) {
      onRandomTopic();
    }
  };

  return (
    <div className="space-y-2">
      {/* Single clean row of 10 Classified Topic Tabs - Unified across Task 1, Task 2 & Vocab */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {CLASSIFIED_10_TOPICS.map((cat) => {
          const isSelected = activeCatId === cat.id;
          const IconComp = CATEGORY_ICONS[cat.icon] || Layers;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer select-none shrink-0 ${
                isSelected
                  ? "bg-[#3E4F42] text-white shadow-xs font-semibold"
                  : "bg-white hover:bg-[#FAF8F5] text-[#7A7369] hover:text-[#24211E] border border-[#E6E2D8]"
              }`}
              title={cat.description}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.shortName}</span>
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

      {/* Clean Topic Header for Vocabulary Practice - NO Task badge, NO IELTS exam prompt */}
      {hidePromptCard && selectedTopic && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider shrink-0">
              Chủ đề:
            </span>
            <span className="font-bold text-xs sm:text-sm text-[#24211E] truncate">
              {selectedTopic.vietnameseName || selectedTopic.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-[#7A7369]">
            <span className="text-[11px] font-medium bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E6E2D8]">
              {selectedTopic.vocabularies?.length || 0} từ vựng trọng tâm
            </span>
          </div>
        </div>
      )}

      {/* Prominent, Legible IELTS Prompt Card - Clean & Minimalist (Chỉ hiển thị khi làm bài Task) */}
      {!hidePromptCard && selectedTopic && (
        <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6E2D8] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDF3EE] text-[#3E4F42] border border-[#D1DDD3]">
                {activeTask === 'task1' ? 'Task 1' : activeTask === 'vocab' ? 'Từ vựng' : 'Task 2'}
              </span>
              <span className="text-xs font-medium text-[#24211E]">
                {selectedTopic.vietnameseName || selectedTopic.name}
              </span>

              {/* Cycle through other prompts / charts in the same category */}
              {currentCategoryPrompts.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPromptInCategory}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#7A7369] hover:text-[#3E4F42] bg-[#FAF8F5] hover:bg-[#EDF3EE] px-2 py-0.5 rounded-lg border border-[#E6E2D8] transition cursor-pointer"
                  title="Đổi đề khác trong cùng chủ đề này"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Đổi đề ({currentPromptIndex + 1}/{currentCategoryPrompts.length})</span>
                </button>
              )}
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
            "{activeTask === 'vocab' ? `Bộ từ vựng học thuật C1-C2 và collocations đắt giá theo chủ đề ${selectedTopic.vietnameseName || selectedTopic.name}` : selectedTopic.ieltsPrompt}"
          </p>
        </div>
      )}
    </div>
  );
}
