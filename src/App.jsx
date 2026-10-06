import React, { useState } from 'react';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import ContactModal from './components/ContactModal';
import EmailModal from './components/EmailModal';
import BandSelectorModal from './components/BandSelectorModal';
import TopicTabBar from './components/TopicTabBar';
import VocabularyList from './components/VocabularyList';
import SentencePractice from './components/SentencePractice';
import HistoryDrawer from './components/HistoryDrawer';
import CohesiveGuideModal from './components/CohesiveGuideModal';

import { 
  IELTS_TOPICS, 
  IELTS_TASK1_TOPICS, 
  IELTS_TASK2_TOPICS 
} from './data/topicsData';

import { 
  getStoredTargetBand, 
  saveTargetBand, 
  getStoredApiKey, 
  getStoredStats,
  getAverageScoreLast7Days
} from './services/storage';

import { 
  getSavedEmail, 
  getProfileByEmail, 
  saveCurrentEmail, 
  updateSettingsForEmail 
} from './services/userService';

export default function App() {
  // Current view: 'welcome' (Trang chào mừng) or 'practice' (Phòng luyện viết)
  const [currentView, setCurrentView] = useState('welcome');

  // Student Email State: Pop-up automatically if not found
  const [studentEmail, setStudentEmail] = useState(() => getSavedEmail());
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(() => !getSavedEmail());

  // 7-Day Average Status Score
  const [current7DayScore, setCurrent7DayScore] = useState(() => getAverageScoreLast7Days(studentEmail));

  // Initial student profile based on saved email
  const initialProfile = studentEmail ? getProfileByEmail(studentEmail) : null;

  // Stored target band & active task (Task 1 or Task 2)
  const [targetBand, setTargetBand] = useState(() => initialProfile?.targetBand || getStoredTargetBand() || "7.0");
  const [activeTask, setActiveTask] = useState(() => initialProfile?.selectedTask || 'task2');
  
  // API key & grading stats
  const [apiKey] = useState(() => getStoredApiKey());
  const [, setStats] = useState(() => getStoredStats());

  // Available topics based on selected task
  const currentTopics = activeTask === 'task1' ? IELTS_TASK1_TOPICS : IELTS_TASK2_TOPICS;

  // Topic & Vocab State
  const [selectedTopic, setSelectedTopic] = useState(() => currentTopics[0] || IELTS_TOPICS[0]);
  const [selectedVocab, setSelectedVocab] = useState(() => currentTopics[0]?.vocabularies[0] || null);

  // Modal States
  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCohesiveGuideOpen, setIsCohesiveGuideOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Handle saving email from mandatory first-time pop-up
  const handleSaveEmail = (email) => {
    const profile = saveCurrentEmail(email);
    setStudentEmail(email);
    setCurrent7DayScore(getAverageScoreLast7Days(email));

    if (profile) {
      const band = profile.targetBand || "7.0";
      const task = profile.selectedTask || "task2";
      setTargetBand(band);
      setActiveTask(task);
      saveTargetBand(band);

      const topics = task === 'task1' ? IELTS_TASK1_TOPICS : IELTS_TASK2_TOPICS;
      if (topics && topics.length > 0) {
        setSelectedTopic(topics[0]);
        setSelectedVocab(topics[0].vocabularies[0] || null);
      }
    }
    setIsEmailModalOpen(false);
  };

  // Handle settings change from Welcome Page (auto-saved per email)
  const handleSettingsChange = ({ targetBand: newBand, selectedTask: newTask }) => {
    if (newBand && newBand !== targetBand) {
      setTargetBand(newBand);
      saveTargetBand(newBand);
    }
    if (newTask && newTask !== activeTask) {
      setActiveTask(newTask);
      const topics = newTask === 'task1' ? IELTS_TASK1_TOPICS : IELTS_TASK2_TOPICS;
      if (topics && topics.length > 0) {
        setSelectedTopic(topics[0]);
        setSelectedVocab(topics[0].vocabularies[0] || null);
      }
    }
    if (studentEmail) {
      updateSettingsForEmail(studentEmail, { targetBand: newBand, selectedTask: newTask });
    }
  };

  // Update target band from modal and persist
  const handleUpdateTargetBand = (newBand) => {
    setTargetBand(newBand);
    saveTargetBand(newBand);
    if (studentEmail) {
      updateSettingsForEmail(studentEmail, { targetBand: newBand });
    }
    setIsBandModalOpen(false);
  };

  // Update task 1 / task 2
  const handleToggleTask = (task) => {
    setActiveTask(task);
    if (studentEmail) {
      updateSettingsForEmail(studentEmail, { selectedTask: task });
    }
    const topics = task === 'task1' ? IELTS_TASK1_TOPICS : IELTS_TASK2_TOPICS;
    if (topics && topics.length > 0) {
      setSelectedTopic(topics[0]);
      setSelectedVocab(topics[0].vocabularies[0] || null);
    }
  };

  // Pick random topic within current task
  const handleRandomTopic = () => {
    const list = currentTopics.length > 0 ? currentTopics : IELTS_TOPICS;
    const remaining = list.filter(t => t.id !== selectedTopic?.id);
    const candidateList = remaining.length > 0 ? remaining : list;
    const randomIndex = Math.floor(Math.random() * candidateList.length);
    const randomTopic = candidateList[randomIndex];
    setSelectedTopic(randomTopic);
    setSelectedVocab(randomTopic?.vocabularies[0] || null);
  };

  // When user selects a topic
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedVocab(topic?.vocabularies[0] || null);
  };

  // Refresh stats & 7-day average after sentence grading
  const handleRefreshStats = () => {
    setStats(getStoredStats());
    setCurrent7DayScore(getAverageScoreLast7Days(studentEmail));
  };

  return (
    <div className="bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* If view is 'welcome', render WelcomePage */}
      {currentView === 'welcome' ? (
        <WelcomePage
          studentEmail={studentEmail}
          targetBand={targetBand}
          selectedTask={activeTask}
          onSettingsChange={handleSettingsChange}
          onChangeEmail={() => setIsEmailModalOpen(true)}
          onStartPractice={() => setCurrentView('practice')}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />
      ) : (
        /* Single-Screen Practice Workspace View (No Page Scroll) */
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
          
          {/* Compact Top Navigation Bar */}
          <Header
            targetBand={targetBand}
            current7DayScore={current7DayScore}
            onOpenBandModal={() => setIsBandModalOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenContact={() => setIsContactModalOpen(true)}
            onChangeEmail={() => setIsEmailModalOpen(true)}
            onGoWelcome={() => setCurrentView('welcome')}
            studentEmail={studentEmail}
            activeTask={activeTask}
            onToggleTask={handleToggleTask}
            currentView={currentView}
          />

          {/* Section 1: Chọn Chủ Đề (Horizontal Tabs + Random Tab + Prompt) */}
          <section className="px-3 sm:px-4 pt-2 shrink-0">
            <TopicTabBar
              topics={currentTopics}
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              onRandomTopic={handleRandomTopic}
            />
          </section>

          {/* Section 2: Main Workspace (Split Grid: Left Vocab with IPA, Right Practice Pad) */}
          <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
            
            {/* Left Column: Vocabulary List with IPA (Takes 5 cols on desktop) */}
            <div className="md:col-span-5 h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col overflow-hidden shadow-lg">
              <VocabularyList
                vocabularies={selectedTopic?.vocabularies || []}
                selectedVocab={selectedVocab}
                onSelectVocab={setSelectedVocab}
              />
            </div>

            {/* Right Column: Interactive Sentence Practice & Instant Scoring (Takes 7 cols on desktop) */}
            <div className="md:col-span-7 h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col overflow-hidden shadow-lg">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                <SentencePractice
                  topic={selectedTopic}
                  targetBand={targetBand}
                  selectedVocab={selectedVocab}
                  onSelectVocab={setSelectedVocab}
                  apiKey={apiKey}
                  studentEmail={studentEmail}
                  onSentenceGraded={handleRefreshStats}
                />
              </div>
            </div>

          </main>
        </div>
      )}

      {/* Mandatory First-Time Email Pop-Up Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onSaveEmail={handleSaveEmail}
      />

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

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

      <CohesiveGuideModal
        isOpen={isCohesiveGuideOpen}
        onClose={() => setIsCohesiveGuideOpen(false)}
      />

    </div>
  );
}
