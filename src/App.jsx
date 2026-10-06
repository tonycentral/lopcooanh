import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BandSelectorModal from './components/BandSelectorModal';
import TopicSelector from './components/TopicSelector';
import VocabularyList from './components/VocabularyList';
import SentencePractice from './components/SentencePractice';
import HistoryDrawer from './components/HistoryDrawer';
import DeploymentGuideModal from './components/DeploymentGuideModal';
import SettingsModal from './components/SettingsModal';
import CohesiveGuideModal from './components/CohesiveGuideModal';

import { IELTS_TOPICS } from './data/topicsData';
import { 
  getStoredTargetBand, 
  saveTargetBand, 
  getStoredApiKey, 
  saveApiKey, 
  getStoredStats 
} from './services/storage';
import { 
  BookOpen, 
  Target, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Shuffle, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';

export default function App() {
  // Stored preferences
  const [targetBand, setTargetBand] = useState(() => getStoredTargetBand());
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [stats, setStats] = useState(() => getStoredStats());

  // Topic & Vocab State
  const [selectedTopic, setSelectedTopic] = useState(IELTS_TOPICS[0]);
  const [selectedVocab, setSelectedVocab] = useState(IELTS_TOPICS[0].vocabularies[0]);

  // Modal States
  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCohesiveGuideOpen, setIsCohesiveGuideOpen] = useState(false);

  // Update target band and persist
  const handleUpdateTargetBand = (newBand) => {
    setTargetBand(newBand);
    saveTargetBand(newBand);
    setIsBandModalOpen(false);
  };

  // Update API Key and persist
  const handleUpdateApiKey = (newKey) => {
    setApiKey(newKey);
    saveApiKey(newKey);
  };

  // Pick random topic
  const handleRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * IELTS_TOPICS.length);
    const randomTopic = IELTS_TOPICS[randomIndex];
    setSelectedTopic(randomTopic);
    setSelectedVocab(randomTopic.vocabularies[0] || null);
  };

  // When user selects a topic
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedVocab(topic.vocabularies[0] || null);
  };

  // Refresh stats after sentence grading
  const handleRefreshStats = () => {
    setStats(getStoredStats());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navigation Bar */}
      <Header
        targetBand={targetBand}
        onOpenBandModal={() => setIsBandModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Phương Pháp Luyện Viết Theo Cặp Câu Chuẩn IELTS Task 2</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Luyện Viết Câu, Paraphrase Từ Vựng &amp; Chấm Điểm Coherence
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Nâng cấp câu văn lên đúng tiêu chuẩn <strong>Band {targetBand}</strong> mục tiêu. Tập dùng từ đồng nghĩa C1/C2, nhận diện câu phức và rèn luyện kỹ thuật móc nối ý giữa 2 câu văn liên tiếp.
              </p>
            </div>

            {/* Quick Actions in Hero */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsCohesiveGuideOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition shadow-md cursor-pointer"
              >
                <Layers className="w-4 h-4 text-pink-400" />
                <span>Sổ Tay Cohesive Devices</span>
              </button>

              <button
                onClick={handleRandomTopic}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/25 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                <span>Random Chủ Đề Mới</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 1: Topic Selection */}
        <section className="space-y-4">
          <TopicSelector
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            onRandomTopic={handleRandomTopic}
          />
        </section>

        {/* Current Active Topic Banner */}
        {selectedTopic && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Đang Luyện Chủ Đề:
                </span>
                <span className="font-extrabold text-white text-base">
                  {selectedTopic.name}
                </span>
                <span className="text-xs text-indigo-400 font-medium">
                  ({selectedTopic.vietnameseName})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBandModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-indigo-300 underline"
                >
                  Mục tiêu hiện tại: Band {targetBand} (Thay đổi)
                </button>
              </div>
            </div>

            {/* Essay Prompt Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <span className="font-bold text-slate-300 mr-1.5 uppercase tracking-wider text-[11px] text-indigo-400">
                Đề bài IELTS Task 2:
              </span>
              <span className="text-slate-200 font-mono italic">
                "{selectedTopic.ieltsPrompt}"
              </span>
            </div>
          </div>
        )}

        {/* Section 2: Vocabulary List */}
        {selectedTopic && (
          <section className="space-y-4">
            <VocabularyList
              vocabularies={selectedTopic.vocabularies}
              selectedVocab={selectedVocab}
              onSelectVocab={(vocab) => setSelectedVocab(vocab)}
            />
          </section>
        )}

        {/* Section 3: Interactive Writing Pad (Step 1 & Step 2) */}
        {selectedTopic && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Khu Vực Luyện Viết &amp; Chấm Điểm
                </h2>
                <p className="text-xs text-slate-400">
                  Viết câu theo yêu cầu và nhận chấm điểm ngữ pháp, từ vựng và Coherence theo tiêu chuẩn Band {targetBand}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Chấm điểm thông minh thời gian thực</span>
              </div>
            </div>

            <SentencePractice
              topic={selectedTopic}
              targetBand={targetBand}
              selectedVocab={selectedVocab}
              onSelectVocab={(vocab) => setSelectedVocab(vocab)}
              apiKey={apiKey}
              onSentenceGraded={handleRefreshStats}
            />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © IELTS WriteMaster Pro • Thiết kế cho lớp học IELTS cô Oanh • Lưu trữ dữ liệu ngoại tuyến an toàn
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" /> Đưa lên Online miễn phí
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Cài đặt
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BandSelectorModal
        isOpen={isBandModalOpen}
        onClose={() => setIsBandModalOpen(false)}
        currentBand={targetBand}
        onSelectBand={handleUpdateTargetBand}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRefreshStats={handleRefreshStats}
      />

      <DeploymentGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        targetBand={targetBand}
        onSelectBand={handleUpdateTargetBand}
        apiKey={apiKey}
        onSaveApiKey={handleUpdateApiKey}
        onResetData={handleRefreshStats}
      />

      <CohesiveGuideModal
        isOpen={isCohesiveGuideOpen}
        onClose={() => setIsCohesiveGuideOpen(false)}
      />

    </div>
  );
}
