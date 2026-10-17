import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import ContactModal from './components/ContactModal';
import BandSelectorModal from './components/BandSelectorModal';
import TopicTabBar from './components/TopicTabBar';
import VocabularyList from './components/VocabularyList';
import VocabularyStudio from './components/VocabularyStudio';
import SentencePractice from './components/SentencePractice';
import HistoryDrawer from './components/HistoryDrawer';
import CohesiveGuideModal from './components/CohesiveGuideModal';
import Task1Visualizer from './components/Task1Visualizer';
import Task1ChartModal from './components/Task1ChartModal';
import AdminDashboard from './components/AdminDashboard';
import FlashcardPage from './components/flashcards/FlashcardPage';
import SourcesDatabankModal from './components/SourcesDatabankModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import FullEssayWorkspace from './components/FullEssayWorkspace';
import ReadingWorkspace from './components/reading/ReadingWorkspace';
import MobileBottomNav from './components/MobileBottomNav';
import MobileDesktopNotice from './components/MobileDesktopNotice';
import MobileVocabWorkspace from './components/MobileVocabWorkspace';
import { useIsMobile } from './hooks/useIsMobile';


import { 
  IELTS_TOPICS, 
  IELTS_TASK1_TOPICS, 
  IELTS_TASK2_TOPICS 
} from './data/topicsData';

import { 
  getStoredTargetBand, 
  saveTargetBand, 
  getStoredApiKey, 
  saveApiKey,
  getStoredStats,
  getAverageScoreLast7Days
} from './services/storage';

import { 
  getSavedEmail, 
  getProfileByEmail, 
  saveCurrentEmail, 
  updateSettingsForEmail,
  recordUserVisit,
  shouldShowWelcomePage,
  saveLastActiveLocation,
  getLastActiveLocation
} from './services/userService';

import { 
  getCurrentUser, 
  onAuthStateChange, 
  signOut, 
  upsertCloudProfile, 
  fetchCloudProfile 
} from './services/authService';
import { supabase } from './services/supabaseClient';

export default function App() {
  // Current view: 'welcome' | 'vocab_practice' | 'full_essay' | 'reading' | 'flashcard' | 'admin'
  // Khởi tạo view thông minh:
  // 1. Nếu có link admin bí mật (#admin, ?admin=true) -> 'admin'
  // 2. Nếu > 7 ngày chưa vào hoặc người dùng mới -> 'welcome'
  // 3. Nếu là học viên quay lại / nhấn refresh (F5) -> Khôi phục chính xác vị trí cuối cùng đang học (reading, full_essay, flashcard, vocab_practice)
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (
      hash === '#admin' || 
      hash === '#admin-cooanh' || 
      search.includes('admin=true') ||
      search.includes('admin=cooanh') ||
      path.endsWith('/admin')
    ) {
      return 'admin';
    }
    if (shouldShowWelcomePage()) {
      return 'welcome';
    }
    const lastLoc = getLastActiveLocation();
    if (lastLoc?.view && ['reading', 'full_essay', 'vocab_practice', 'flashcard'].includes(lastLoc.view)) {
      return lastLoc.view;
    }
    return 'vocab_practice';
  });

  // Phát hiện giao diện điện thoại (< 768px) để phân chia trải nghiệm chuyên biệt
  const isMobile = useIsMobile();
  const [bypassMobileNotice, setBypassMobileNotice] = useState(false);

  // Lắng nghe link ẩn bí mật vào Admin Dashboard (URL #admin, #admin-cooanh, ?admin=true) hoặc Ctrl+Shift+A
  useEffect(() => {
    const checkSecretAdminAccess = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash === '#admin' || 
        hash === '#admin-cooanh' || 
        search.includes('admin=true') ||
        search.includes('admin=cooanh') ||
        path.endsWith('/admin')
      ) {
        setCurrentView('admin');
      }
    };

    checkSecretAdminAccess();
    window.addEventListener('hashchange', checkSecretAdminAccess);

    // Phím tắt bí mật: Ctrl + Shift + A
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'vocab_practice' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Ghi nhận mốc thời gian truy cập hiện tại
    recordUserVisit();

    return () => {
      window.removeEventListener('hashchange', checkSecretAdminAccess);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleExitAdmin = () => {
    // Xóa dấu vết hash trên thanh địa chỉ trình duyệt khi thoát
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setCurrentView('vocab_practice');
  };

  // Supabase Auth & Cloud User State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Student Email State
  const [studentEmail, setStudentEmail] = useState(() => getSavedEmail());

  // Lắng nghe thay đổi trạng thái đăng nhập từ Supabase & đồng bộ hồ sơ Cloud
  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user);
        if (user.email) setStudentEmail(user.email);
        fetchCloudProfile(user.id).then(profile => {
          if (profile) {
            if (profile.target_band) setTargetBand(profile.target_band);
            if (profile.selected_task) setActiveTask(profile.selected_task);
          }
        });

        // Khôi phục vị trí học gần nhất của user nếu đang ở màn hình welcome
        setCurrentView(prev => {
          if (prev === 'admin') return 'admin';
          if (prev === 'welcome' && !shouldShowWelcomePage()) {
            const lastLoc = getLastActiveLocation(user.email);
            if (lastLoc?.view && ['reading', 'full_essay', 'vocab_practice', 'flashcard'].includes(lastLoc.view)) {
              if (lastLoc.practiceActivePart) setPracticeActivePart(lastLoc.practiceActivePart);
              if (lastLoc.activeTask) setActiveTask(lastLoc.activeTask);
              if (lastLoc.readingMode) setReadingInitialMode(lastLoc.readingMode);
              return lastLoc.view;
            }
          }
          return prev;
        });
      } else {
        // Chưa đăng nhập: Học viên bắt buộc phải ở màn hình Chào Mừng & Đăng Nhập
        setCurrentView(prev => (prev === 'admin' ? 'admin' : 'welcome'));
      }
    });

    const sub = onAuthStateChange(async (event, user) => {
      setCurrentUser(user);
      if (user?.email) {
        setStudentEmail(user.email);
        const profile = await fetchCloudProfile(user.id);
        if (profile) {
          if (profile.target_band) setTargetBand(profile.target_band);
          if (profile.selected_task) setActiveTask(profile.selected_task);
        }
        if (event === 'SIGNED_IN') {
          const lastLoc = getLastActiveLocation(user.email);
          if (lastLoc?.view && ['reading', 'full_essay', 'vocab_practice', 'flashcard'].includes(lastLoc.view)) {
            setCurrentView(lastLoc.view);
            if (lastLoc.practiceActivePart) setPracticeActivePart(lastLoc.practiceActivePart);
            if (lastLoc.activeTask) setActiveTask(lastLoc.activeTask);
            if (lastLoc.readingMode) setReadingInitialMode(lastLoc.readingMode);
          }
        }
      } else {
        setCurrentView(prev => (prev === 'admin' ? 'admin' : 'welcome'));
      }
    });

    return () => {
      if (sub?.unsubscribe) sub.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    setCurrentView('welcome');
    setIsAuthModalOpen(true);
  };

  // 7-Day Average Status Score
  const [current7DayScore, setCurrent7DayScore] = useState(() => getAverageScoreLast7Days(studentEmail));

  // Initial student profile based on saved email
  const initialProfile = studentEmail ? getProfileByEmail(studentEmail) : null;

  // Stored target band & active task (Task 1 or Task 2)
  const [targetBand, setTargetBand] = useState(() => initialProfile?.targetBand || getStoredTargetBand() || "7.0");
  const [activeTask, setActiveTask] = useState(() => {
    const lastLoc = getLastActiveLocation(studentEmail);
    return lastLoc?.activeTask || initialProfile?.selectedTask || 'task2';
  });
  
  // Task 1 Layout Mode: 'three-col' (mặc định: 3 cột song song - Đề & Biểu đồ | Từ vựng | Luyện tập) hoặc 'stacked' (Cột trái 2 tầng)
  const [task1Layout, setTask1Layout] = useState(() => {
    try {
      return localStorage.getItem('lopcooanh_task1_layout') || 'three-col';
    } catch {
      return 'three-col';
    }
  });

  const handleToggleTask1Layout = (layout) => {
    setTask1Layout(layout);
    try {
      localStorage.setItem('lopcooanh_task1_layout', layout);
    } catch (e) {
      console.error(e);
    }
  };

  // Settings Modal & API key
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [, setStats] = useState(() => getStoredStats());

  const handleSaveApiKey = (key) => {
    saveApiKey(key);
    setApiKey(key);
  };

  const handleUpdateFullName = async (newName) => {
    if (!currentUser || !newName.trim()) return;
    try {
      if (supabase) {
        await supabase.auth.updateUser({
          data: { full_name: newName.trim() }
        });
      }
      await upsertCloudProfile(currentUser.id, {
        email: currentUser.email,
        full_name: newName.trim(),
        target_band: targetBand,
        selected_task: activeTask
      });
      setCurrentUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev?.user_metadata,
          full_name: newName.trim()
        }
      }));
    } catch (e) {
      console.error("Lỗi cập nhật tên:", e);
    }
  };

  // Available topics based on selected task + custom added topics
  const [customTask1Topics, setCustomTask1Topics] = useState([]);
  const [customTask2Topics, setCustomTask2Topics] = useState([]);
  const currentTopics = useMemo(() => {
    if (activeTask === 'task1') {
      return [...IELTS_TASK1_TOPICS, ...customTask1Topics];
    } else if (activeTask === 'vocab') {
      return [...IELTS_TASK2_TOPICS, ...IELTS_TASK1_TOPICS];
    } else {
      return [...IELTS_TASK2_TOPICS, ...customTask2Topics];
    }
  }, [activeTask, customTask1Topics, customTask2Topics]);

  // Topic, Vocab & Practice Tab State
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const lastLoc = getLastActiveLocation(studentEmail);
    if (lastLoc?.selectedTopicId) {
      const found = IELTS_TOPICS.find(t => t.id === lastLoc.selectedTopicId);
      if (found) return found;
    }
    return currentTopics[0] || IELTS_TOPICS[0];
  });
  const [selectedVocab, setSelectedVocab] = useState(() => selectedTopic?.vocabularies?.[0] || null);
  const [practiceActivePart, setPracticeActivePart] = useState(() => {
    const lastLoc = getLastActiveLocation(studentEmail);
    return lastLoc?.practiceActivePart || 1;
  });

  const [readingInitialMode, setReadingInitialMode] = useState(() => {
    const lastLoc = getLastActiveLocation(studentEmail);
    return lastLoc?.readingMode || 'practice';
  });

  // Unified 1.1 - 1.4, 2. Reading, 3. Flashcard navigation handler
  const handleSelectWritingStep = (step) => {
    if (step === '1.1') {
      setCurrentView('vocab_practice');
      setPracticeActivePart(1);
    } else if (step === '1.2') {
      setCurrentView('vocab_practice');
      setPracticeActivePart(2);
    } else if (step === '1.3') {
      setCurrentView('vocab_practice');
      setPracticeActivePart(3);
    } else if (step === '1.4') {
      setCurrentView('full_essay');
    } else if (step === '2.1') {
      setReadingInitialMode('practice');
      setCurrentView('reading');
    } else if (step === '2.2') {
      setReadingInitialMode('test');
      setCurrentView('reading');
    } else if (step === '3.0' || step === '2.0') {
      setCurrentView('flashcard');
    }
  };

  const activeWritingStep = currentView === 'reading'
    ? (readingInitialMode === 'test' ? '2.2' : '2.1')
    : currentView === 'full_essay' 
    ? '1.4' 
    : currentView === 'flashcard' 
    ? '3.0' 
    : practiceActivePart === 2 
    ? '1.2' 
    : practiceActivePart === 3 
    ? '1.3' 
    : '1.1';

  // Tự động lưu vị trí học tập gần nhất khi người dùng chuyển view, step, hoặc topic
  useEffect(() => {
    if (currentView && ['reading', 'full_essay', 'vocab_practice', 'flashcard'].includes(currentView)) {
      const existing = getLastActiveLocation(studentEmail) || {};
      saveLastActiveLocation(studentEmail, {
        ...existing,
        view: currentView,
        practiceActivePart,
        activeTask,
        selectedTopicId: selectedTopic?.id,
        activeWritingStep,
        readingMode: readingInitialMode
      });
    }
  }, [currentView, practiceActivePart, activeTask, selectedTopic?.id, activeWritingStep, readingInitialMode, studentEmail]);

  // Handler khôi phục chính xác vị trí học từ WelcomePage
  const handleResumeLastLocation = (loc) => {
    const targetLoc = loc || getLastActiveLocation(studentEmail);
    if (targetLoc?.view) {
      if (targetLoc.activeTask) setActiveTask(targetLoc.activeTask);
      if (targetLoc.practiceActivePart) setPracticeActivePart(targetLoc.practiceActivePart);
      if (targetLoc.readingMode) setReadingInitialMode(targetLoc.readingMode);
      if (targetLoc.selectedTopicId) {
        const found = currentTopics.find(t => t.id === targetLoc.selectedTopicId);
        if (found) {
          setSelectedTopic(found);
          setSelectedVocab(found.vocabularies?.[0] || null);
        }
      }
      setCurrentView(targetLoc.view);
    } else {
      setCurrentView('vocab_practice');
    }
  };

  // Modal States
  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCohesiveGuideOpen, setIsCohesiveGuideOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);


  // Handle settings change from Welcome Page (auto-saved per email)
  const handleSettingsChange = ({ targetBand: newBand, selectedTask: newTask }) => {
    if (newBand && newBand !== targetBand) {
      setTargetBand(newBand);
      saveTargetBand(newBand);
    }
    if (newTask && newTask !== activeTask) {
      setActiveTask(newTask);
      let topics;
      if (newTask === 'task1') {
        topics = [...IELTS_TASK1_TOPICS, ...customTask1Topics];
      } else if (newTask === 'vocab') {
        topics = [...IELTS_TASK2_TOPICS, ...IELTS_TASK1_TOPICS];
      } else {
        topics = [...IELTS_TASK2_TOPICS, ...customTask2Topics];
      }
      if (topics && topics.length > 0) {
        const currentCat = selectedTopic ? (selectedTopic.topicCategory || getMasterCategoryId(selectedTopic)) : null;
        const matchingTopic = currentCat ? topics.find(t => (t.topicCategory || getMasterCategoryId(t)) === currentCat) : null;
        const targetTopic = matchingTopic || topics[0];
        setSelectedTopic(targetTopic);
        setSelectedVocab(targetTopic.vocabularies?.[0] || null);
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
    if (currentUser) {
      upsertCloudProfile(currentUser.id, { targetBand: newBand });
    }
    if (studentEmail) {
      updateSettingsForEmail(studentEmail, { targetBand: newBand });
    }
    setIsBandModalOpen(false);
  };

  // Update task 1 / task 2 / vocab
  const handleToggleTask = (task) => {
    setActiveTask(task);
    if (currentUser) {
      upsertCloudProfile(currentUser.id, { selectedTask: task });
    }
    if (studentEmail) {
      updateSettingsForEmail(studentEmail, { selectedTask: task });
    }
    let topics;
    if (task === 'task1') {
      topics = [...IELTS_TASK1_TOPICS, ...customTask1Topics];
    } else if (task === 'vocab') {
      topics = [...IELTS_TASK2_TOPICS, ...IELTS_TASK1_TOPICS];
    } else {
      topics = [...IELTS_TASK2_TOPICS, ...customTask2Topics];
    }
    if (topics && topics.length > 0) {
      const currentCat = selectedTopic ? (selectedTopic.topicCategory || getMasterCategoryId(selectedTopic)) : null;
      const matchingTopic = currentCat ? topics.find(t => (t.topicCategory || getMasterCategoryId(t)) === currentCat) : null;
      const targetTopic = matchingTopic || topics[0];
      setSelectedTopic(targetTopic);
      setSelectedVocab(targetTopic.vocabularies?.[0] || null);
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
    setPracticeActivePart(1);
  };

  // Next topic action (when topic is completed or skipped)
  const handleNextTopic = () => {
    const list = currentTopics.length > 0 ? currentTopics : IELTS_TOPICS;
    const currentIndex = list.findIndex(t => t.id === selectedTopic?.id);
    const nextIndex = (currentIndex + 1) % list.length;
    const nextTopic = list[nextIndex];
    setSelectedTopic(nextTopic);
    setSelectedVocab(nextTopic?.vocabularies[0] || null);
    setPracticeActivePart(1);
  };

  // Add custom topic from Sources Databank Modal
  const handleAddCustomTopic = (newTopic) => {
    if (newTopic.taskType === 'task1') {
      setCustomTask1Topics(prev => [newTopic, ...prev]);
    } else {
      setCustomTask2Topics(prev => [newTopic, ...prev]);
    }
    setSelectedTopic(newTopic);
    setSelectedVocab(newTopic?.vocabularies?.[0] || null);
    setPracticeActivePart(1);
  };

  // Refresh stats & 7-day average after sentence grading
  const handleRefreshStats = () => {
    setStats(getStoredStats());
    setCurrent7DayScore(getAverageScoreLast7Days(studentEmail));
  };

  return (
    <div className={`bg-[#F8F6F1] text-[#24211E] selection:bg-[#C2DDC8] selection:text-[#17221A] ${
      isMobile ? "h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col" : "min-h-screen"
    }`}>
      
      {/* If view is 'admin', render AdminDashboard (Truy cập qua link ẩn) */}
      {currentView === 'admin' ? (
        <AdminDashboard onExitAdmin={handleExitAdmin} />
      ) : currentView === 'flashcard' ? (
        <FlashcardPage
          currentTopic={selectedTopic}
          task1Topics={IELTS_TASK1_TOPICS}
          task2Topics={IELTS_TASK2_TOPICS}
          onClose={() => setCurrentView('vocab_practice')}
          onGoWritingPractice={(topic) => {
            if (topic) {
              setSelectedTopic(topic);
              setSelectedVocab(topic.vocabularies?.[0] || null);
            }
            setCurrentView('vocab_practice');
          }}
        />
      ) : currentView === 'welcome' ? (
        <WelcomePage
          studentEmail={studentEmail}
          currentUser={currentUser}
          targetBand={targetBand}
          selectedTask={activeTask}
          onSettingsChange={handleSettingsChange}
          isMobile={isMobile}
          onResumeLastLocation={(loc) => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            recordUserVisit();
            handleResumeLastLocation(loc);
          }}
          onChangeEmail={() => setIsAuthModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onSignOut={handleSignOut}
          onStartPractice={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            recordUserVisit();
            setCurrentView('vocab_practice');
          }}
          onStartFullEssay={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            recordUserVisit();
            setCurrentView('full_essay');
          }}
          onStartReading={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            recordUserVisit();
            setCurrentView('reading');
          }}
          onStartFlashcard={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            setCurrentView('flashcard');
          }}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />
      ) : currentView === 'full_essay' ? (
        /* MODE 2: HỌC VIẾT TOÀN BỘ TASK (FULL ESSAY WORKSPACE) */
        <div className={`${isMobile ? "h-full max-h-[100dvh]" : "h-screen"} flex flex-col overflow-hidden bg-[#F8F6F1] text-[#24211E]`}>
          <Header
            targetBand={targetBand}
            current7DayScore={current7DayScore}
            onOpenBandModal={() => setIsBandModalOpen(true)}
            onGoWelcome={() => setCurrentView('welcome')}
            onOpenFlashcard={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('flashcard');
            }}
            onGoVocabPractice={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('vocab_practice');
            }}
            onGoFullEssay={() => setCurrentView('full_essay')}
            onGoPractice={() => setCurrentView('vocab_practice')}
            onGoReading={(mode) => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              if (mode === 'practice' || mode === 'test') {
                setReadingInitialMode(mode);
              }
              setCurrentView('reading');
            }}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSignOut={handleSignOut}
            studentEmail={studentEmail}
            activeTask={activeTask}
            onToggleTask={handleToggleTask}
            currentView={currentView}
            activeWritingStep={activeWritingStep}
            onSelectWritingStep={handleSelectWritingStep}
            isMobile={isMobile}
          />

          {isMobile && !bypassMobileNotice ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <MobileDesktopNotice
                targetModule="writing"
                onGoVocab={() => {
                  setBypassMobileNotice(false);
                  setCurrentView('vocab_practice');
                }}
                onGoFlashcard={() => {
                  setBypassMobileNotice(false);
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setCurrentView('flashcard');
                }}
                onBypass={() => setBypassMobileNotice(true)}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
              <FullEssayWorkspace
                topics={currentTopics}
                selectedTopic={selectedTopic}
                onSelectTopic={handleSelectTopic}
                activeTask={activeTask}
                onToggleTask={handleToggleTask}
                targetBand={targetBand}
                studentEmail={studentEmail}
                onOpenChartModal={() => setIsChartModalOpen(true)}
                onEssayGraded={handleRefreshStats}
              />
            </div>
          )}
        </div>
      ) : currentView === 'reading' ? (
        /* MODE 3: LUYỆN ĐỌC (IELTS READING WORKSPACE - 10 CHỦ ĐỀ • 50 ĐỀ / CHỦ ĐỀ) */
        <div className={`${isMobile ? "h-full max-h-[100dvh]" : "h-screen"} flex flex-col overflow-hidden bg-[#F8F6F1] text-[#24211E]`}>
          <Header
            targetBand={targetBand}
            current7DayScore={current7DayScore}
            onOpenBandModal={() => setIsBandModalOpen(true)}
            onGoWelcome={() => setCurrentView('welcome')}
            onOpenFlashcard={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('flashcard');
            }}
            onGoVocabPractice={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('vocab_practice');
            }}
            onGoFullEssay={() => setCurrentView('full_essay')}
            onGoPractice={() => setCurrentView('vocab_practice')}
            onGoReading={(mode) => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              if (mode === 'practice' || mode === 'test') {
                setReadingInitialMode(mode);
              }
              setCurrentView('reading');
            }}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSignOut={handleSignOut}
            studentEmail={studentEmail}
            activeTask={activeTask}
            onToggleTask={handleToggleTask}
            currentView={currentView}
            activeWritingStep={activeWritingStep}
            onSelectWritingStep={handleSelectWritingStep}
            isMobile={isMobile}
          />

          {isMobile && !bypassMobileNotice ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <MobileDesktopNotice
                targetModule="reading"
                onGoVocab={() => {
                  setBypassMobileNotice(false);
                  setCurrentView('vocab_practice');
                }}
                onGoFlashcard={() => {
                  setBypassMobileNotice(false);
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setCurrentView('flashcard');
                }}
                onBypass={() => setBypassMobileNotice(true)}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-hidden">
              <ReadingWorkspace
                studentEmail={studentEmail}
                targetBand={targetBand}
                initialMode={readingInitialMode}
                onReadingGraded={handleRefreshStats}
                onGoWelcome={() => setCurrentView('welcome')}
                onOpenFlashcard={() => setCurrentView('flashcard')}
              />
            </div>
          )}
        </div>
      ) : (
        /* MODE 1: HỌC TỪ VỰNG (CHỌN TOPIC -> LUYỆN TỪ VỰNG -> LUYỆN CÂU & ĐOẠN) */
        <div className={`${isMobile ? "h-full max-h-[100dvh]" : "h-screen"} flex flex-col overflow-hidden bg-[#F8F6F1] text-[#24211E]`}>
          <Header
            targetBand={targetBand}
            current7DayScore={current7DayScore}
            onOpenBandModal={() => setIsBandModalOpen(true)}
            onGoWelcome={() => setCurrentView('welcome')}
            onOpenFlashcard={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('flashcard');
            }}
            onGoVocabPractice={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              setCurrentView('vocab_practice');
            }}
            onGoFullEssay={() => setCurrentView('full_essay')}
            onGoPractice={() => setCurrentView('vocab_practice')}
            onGoReading={(mode) => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
                return;
              }
              if (mode === 'practice' || mode === 'test') {
                setReadingInitialMode(mode);
              }
              setCurrentView('reading');
            }}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSignOut={handleSignOut}
            studentEmail={studentEmail}
            activeTask={activeTask}
            onToggleTask={handleToggleTask}
            currentView={currentView}
            activeWritingStep={activeWritingStep}
            onSelectWritingStep={handleSelectWritingStep}
            isMobile={isMobile}
          />

          {isMobile ? (
            /* TRÊN ĐIỆN THOẠI: KHÔNG GIAN HỌC TỪ VỰNG CHUYÊN BIỆT (KHÔNG CÓ KHUNG VIẾT CÂU/ĐOẠN) */
            <div className="flex-1 min-h-0 overflow-hidden">
              <MobileVocabWorkspace
                topics={currentTopics}
                selectedTopic={selectedTopic}
                onSelectTopic={handleSelectTopic}
                onRandomTopic={handleRandomTopic}
                activeTask={activeTask}
                selectedVocab={selectedVocab}
                onSelectVocab={setSelectedVocab}
                studentEmail={studentEmail}
                onOpenFlashcard={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setCurrentView('flashcard');
                }}
                onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
                onNextTopic={handleNextTopic}
              />
            </div>
          ) : (
            <>
              {/* Section 1: Thanh chọn nhóm chủ đề & topic */}
              <section className="px-3 sm:px-4 pt-2 shrink-0">
                <TopicTabBar
                  topics={currentTopics}
                  selectedTopic={selectedTopic}
                  onSelectTopic={handleSelectTopic}
                  onRandomTopic={handleRandomTopic}
                  activeTask={activeTask}
                  onOpenChartModal={() => setIsChartModalOpen(true)}
                  task1Layout={task1Layout}
                  onToggleTask1Layout={handleToggleTask1Layout}
                  hidePromptCard={true}
                />
              </section>

              {/* Section 2: Main Workspace */}
              <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-3 p-3 sm:p-4 overflow-hidden">
                {activeTask === 'task1' ? (
                  task1Layout === 'stacked' ? (
                    <>
                      {/* Cột 1: Gộp 2 tầng (Tầng trên: Biểu đồ Task 1, Tầng dưới: Danh sách từ vựng) (5 cols) */}
                      <div className="md:col-span-5 h-full flex flex-col gap-3 overflow-hidden">
                        <div className="h-1/2 bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                          <Task1Visualizer 
                            topic={selectedTopic} 
                            isCompact={true}
                            onExpandChart={() => setIsChartModalOpen(true)}
                          />
                        </div>
                        <div className="h-1/2 bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                          <VocabularyList
                            vocabularies={selectedTopic?.vocabularies || []}
                            selectedVocab={selectedVocab}
                            onSelectVocab={setSelectedVocab}
                            studentEmail={studentEmail}
                            onStartPractice={(vocab) => setSelectedVocab(vocab)}
                            onOpenFlashcard={() => setCurrentView('flashcard')}
                            onGoFullEssay={() => setCurrentView('full_essay')}
                            onNextTopic={handleNextTopic}
                            onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
                          />
                        </div>
                      </div>

                      {/* Cột 2: Luyện viết 3 phần (7 cols) */}
                      <div className="md:col-span-7 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                          <SentencePractice
                            topic={selectedTopic}
                            targetBand={targetBand}
                            selectedVocab={selectedVocab}
                            onSelectVocab={setSelectedVocab}
                            apiKey={apiKey}
                            studentEmail={studentEmail}
                            activeTask={activeTask}
                            onOpenChartModal={() => setIsChartModalOpen(true)}
                            onSentenceGraded={handleRefreshStats}
                            activePart={practiceActivePart}
                            onPartChange={setPracticeActivePart}
                            onGoFullEssay={() => setCurrentView('full_essay')}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Cột 1: Biểu đồ Task 1 & Đề bài (4 cols) */}
                      <div className="md:col-span-4 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                        <Task1Visualizer 
                          topic={selectedTopic} 
                          onExpandChart={() => setIsChartModalOpen(true)}
                        />
                      </div>

                      {/* Cột 2: Danh sách từ vựng theo biểu đồ (3 cols) */}
                      <div className="md:col-span-3 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                        <VocabularyList
                          vocabularies={selectedTopic?.vocabularies || []}
                          selectedVocab={selectedVocab}
                          onSelectVocab={setSelectedVocab}
                          studentEmail={studentEmail}
                          onStartPractice={(vocab) => setSelectedVocab(vocab)}
                          onOpenFlashcard={() => setCurrentView('flashcard')}
                          onGoFullEssay={() => setCurrentView('full_essay')}
                          onNextTopic={handleNextTopic}
                          onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
                        />
                      </div>

                      {/* Cột 3: Luyện viết câu & đoạn (5 cols) */}
                      <div className="md:col-span-5 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                          <SentencePractice
                            topic={selectedTopic}
                            targetBand={targetBand}
                            selectedVocab={selectedVocab}
                            onSelectVocab={setSelectedVocab}
                            apiKey={apiKey}
                            studentEmail={studentEmail}
                            activeTask={activeTask}
                            onOpenChartModal={() => setIsChartModalOpen(true)}
                            onSentenceGraded={handleRefreshStats}
                            activePart={practiceActivePart}
                            onPartChange={setPracticeActivePart}
                            onGoFullEssay={() => setCurrentView('full_essay')}
                          />
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    {/* Cột 1: Danh sách từ vựng theo chủ đề (5 cols) */}
                    <div className="md:col-span-5 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                      <VocabularyList
                        vocabularies={selectedTopic?.vocabularies || []}
                        selectedVocab={selectedVocab}
                        onSelectVocab={setSelectedVocab}
                        studentEmail={studentEmail}
                        onStartPractice={(vocab) => setSelectedVocab(vocab)}
                        onOpenFlashcard={() => setCurrentView('flashcard')}
                        onGoFullEssay={() => setCurrentView('full_essay')}
                        onNextTopic={handleNextTopic}
                        onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
                      />
                    </div>

                    {/* Cột 2: Luyện viết 3 phần (Hiểu từ -> Luyện viết câu -> Luyện viết đoạn văn) (7 cols) */}
                    <div className="md:col-span-7 h-full bg-white border border-[#E6E2D8] rounded-2xl p-3 flex flex-col overflow-hidden shadow-xs">
                      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                        <SentencePractice
                          topic={selectedTopic}
                          targetBand={targetBand}
                          selectedVocab={selectedVocab}
                          onSelectVocab={setSelectedVocab}
                          apiKey={apiKey}
                          studentEmail={studentEmail}
                          activeTask={activeTask}
                          onOpenChartModal={() => setIsChartModalOpen(true)}
                          onSentenceGraded={handleRefreshStats}
                          activePart={practiceActivePart}
                          onPartChange={setPracticeActivePart}
                          onGoFullEssay={() => setCurrentView('full_essay')}
                        />
                      </div>
                    </div>
                  </>
                )}
              </main>
            </>
          )}
        </div>
      )}

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

      {/* Full-Screen / Expanded Task 1 Bar Chart & Visual Modal */}
      <Task1ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        topic={selectedTopic}
      />

      {/* Kho Đề Thi & Nguồn Bổ Sung Cambridge, Simon, AWL */}
      <SourcesDatabankModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
        onAddCustomTopic={handleAddCustomTopic}
        totalTopicsCount={currentTopics.length}
        totalVocabCount={currentTopics.reduce((acc, t) => acc + (t.vocabularies?.length || 0), 0)}
      />

      {/* Cài đặt tài khoản & AI (Gemini Key, hồ sơ học viên, target band) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        studentEmail={studentEmail}
        onUpdateFullName={handleUpdateFullName}
        targetBand={targetBand}
        onSelectBand={handleUpdateTargetBand}
        current7DayScore={current7DayScore}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onResetData={handleRefreshStats}
        onSignOut={handleSignOut}
      />

      {/* Tài Khoản & Đồng Bộ Đám Mây Supabase Auth Modal (Không cho phép Guest Mode) */}
      <AuthModal
        isOpen={isAuthModalOpen && !currentUser}
        onClose={() => {
          if (currentUser) {
            setIsAuthModalOpen(false);
          }
        }}
        isRequired={!currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user?.email) {
            setStudentEmail(user.email);
            saveCurrentEmail(user.email);
          }
          setIsAuthModalOpen(false);

          // Tự động đưa học viên quay về đúng nơi lần cuối đang học
          const lastLoc = getLastActiveLocation(user?.email);
          if (lastLoc?.view && ['reading', 'full_essay', 'vocab_practice', 'flashcard'].includes(lastLoc.view)) {
            setCurrentView(lastLoc.view);
            if (lastLoc.practiceActivePart) setPracticeActivePart(lastLoc.practiceActivePart);
            if (lastLoc.activeTask) setActiveTask(lastLoc.activeTask);
            if (lastLoc.readingMode) setReadingInitialMode(lastLoc.readingMode);
            if (lastLoc.selectedTopicId) {
              const found = currentTopics.find(t => t.id === lastLoc.selectedTopicId);
              if (found) {
                setSelectedTopic(found);
                setSelectedVocab(found.vocabularies?.[0] || null);
              }
            }
          } else {
            setCurrentView('vocab_practice');
          }
        }}
      />

      {/* Thanh điều hướng chân trang cố định trên điện thoại */}
      {isMobile && currentView !== 'admin' && (
        <MobileBottomNav
          currentView={currentView}
          onGoVocab={() => {
            setBypassMobileNotice(false);
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            setCurrentView('vocab_practice');
          }}
          onGoFlashcard={() => {
            setBypassMobileNotice(false);
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            setCurrentView('flashcard');
          }}
          onGoWelcome={() => setCurrentView('welcome')}
        />
      )}

    </div>
  );
}
