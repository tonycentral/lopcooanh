import React, { useState } from 'react';
import { BookOpen, Volume2, Sparkles, ChevronLeft, Layers, ArrowRight } from 'lucide-react';
import VocabularyList from './VocabularyList';
import VocabularyStudio from './VocabularyStudio';
import TopicTabBar from './TopicTabBar';

export default function MobileVocabWorkspace({
  topics = [],
  selectedTopic,
  onSelectTopic,
  onRandomTopic,
  activeTask = 'task2',
  selectedVocab,
  onSelectVocab,
  studentEmail,
  onOpenFlashcard,
  onOpenSourcesModal,
  onNextTopic
}) {
  // Active mobile subview: 'list' (Danh sách từ) | 'detail' (Chi tiết phát âm & collocations)
  const [mobileTab, setMobileTab] = useState('list');

  const handleSelectWordAndOpenDetail = (vocab) => {
    if (onSelectVocab) onSelectVocab(vocab);
    setMobileTab('detail');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F8F6F1] text-[#24211E] pb-20">
      
      {/* 1. Topic Tab Bar (Chủ đề 10 nhóm chuẩn) */}
      <div className="px-3 pt-2 shrink-0">
        <TopicTabBar
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={(t) => {
            onSelectTopic(t);
            setMobileTab('list');
          }}
          onRandomTopic={onRandomTopic}
          activeTask={activeTask}
          hidePromptCard={true}
        />
      </div>

      {/* 2. Mobile Segmented View Switcher */}
      <div className="px-3 py-2 shrink-0">
        <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-[#E6E2D8] rounded-2xl shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'list'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Danh sách ({selectedTopic?.vocabularies?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('detail')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              mobileTab === 'detail'
                ? "bg-[#3E4F42] text-white shadow-xs"
                : "text-[#7A7369] hover:text-[#24211E] hover:bg-[#FAF8F5]"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {selectedVocab?.word ? `Chi tiết: ${selectedVocab.word}` : "Chi tiết & Phát âm"}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="flex-1 min-h-0 px-3 overflow-hidden">
        {mobileTab === 'list' ? (
          <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
            <VocabularyList
              vocabularies={selectedTopic?.vocabularies || []}
              selectedVocab={selectedVocab}
              onSelectVocab={onSelectVocab}
              studentEmail={studentEmail}
              onStartPractice={handleSelectWordAndOpenDetail}
              onOpenFlashcard={onOpenFlashcard}
              onNextTopic={onNextTopic}
              onOpenSourcesModal={onOpenSourcesModal}
              isMobileView={true}
            />
          </div>
        ) : (
          <div className="h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden shadow-xs">
            {/* Back to list button */}
            <div className="pb-2 mb-2 border-b border-[#E6E2D8] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3E4F42] hover:text-[#24211E] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại danh sách từ</span>
              </button>
              
              {onOpenFlashcard && (
                <button
                  type="button"
                  onClick={onOpenFlashcard}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A67C52] hover:text-[#3E4F42] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mở Flashcard</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <VocabularyStudio
                selectedVocab={selectedVocab}
                topic={selectedTopic}
                onOpenFlashcard={onOpenFlashcard}
                studentEmail={studentEmail}
                isMobileView={true}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
