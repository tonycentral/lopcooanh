import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import BandSelectorModal from './components/BandSelectorModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import MochiFarmView from './components/harvest/MochiFarmView';
import { recordLearningToFarm } from './services/harvestTownService';
import { useIsMobile } from './hooks/useIsMobile';

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
  recordUserVisit
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
  // MochiFarm Harvest Town là trung tâm duy nhất của toàn bộ nền tảng.
  // Chỉ hỗ trợ view 'farm' và màn hình bí mật 'admin'.
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
    return 'farm';
  });

  const isMobile = useIsMobile();

  // Supabase Auth & Cloud User State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Student Email State
  const [studentEmail, setStudentEmail] = useState(() => getSavedEmail());

  // Lắng nghe link bí mật Admin (#admin) hoặc phím tắt Ctrl + Shift + A
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

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'farm' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Ghi nhận lượt truy cập
    recordUserVisit();

    return () => {
      window.removeEventListener('hashchange', checkSecretAdminAccess);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleExitAdmin = () => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setCurrentView('farm');
  };

  // Lắng nghe thay đổi trạng thái đăng nhập từ Supabase
  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user);
        if (user.email) setStudentEmail(user.email);
        fetchCloudProfile(user.id).then(profile => {
          if (profile) {
            if (profile.target_band) setTargetBand(profile.target_band);
          }
        });
      }
      setCurrentView(prev => (prev === 'admin' ? 'admin' : 'farm'));
    });

    const sub = onAuthStateChange(async (event, user) => {
      setCurrentUser(user);
      if (user?.email) {
        setStudentEmail(user.email);
        const profile = await fetchCloudProfile(user.id);
        if (profile) {
          if (profile.target_band) setTargetBand(profile.target_band);
        }
      }
      setCurrentView(prev => (prev === 'admin' ? 'admin' : 'farm'));
    });

    return () => {
      if (sub?.unsubscribe) sub.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    setCurrentView('farm');
    setIsAuthModalOpen(true);
  };

  // 7-Day Average Status Score & Target Band
  const [current7DayScore, setCurrent7DayScore] = useState(() => getAverageScoreLast7Days(studentEmail));
  const initialProfile = studentEmail ? getProfileByEmail(studentEmail) : null;
  const [targetBand, setTargetBand] = useState(() => initialProfile?.targetBand || getStoredTargetBand() || "7.0");

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
        target_band: targetBand
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

  // Modal Band Target
  const [isBandModalOpen, setIsBandModalOpen] = useState(false);
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

  // Refresh stats sau khi làm bài tập tưới cây
  const handleRefreshStats = (score = 80) => {
    setStats(getStoredStats());
    setCurrent7DayScore(getAverageScoreLast7Days(studentEmail));
    recordLearningToFarm('vocab', typeof score === 'number' ? score : 80, studentEmail);
  };

  return (
    <div className={`bg-[#2D1B13] text-[#FFF8E1] selection:bg-amber-400 selection:text-[#3E2723] ${
      isMobile ? "h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col" : "h-screen max-h-screen overflow-hidden flex flex-col"
    }`}>
      
      {/* Khung hiển thị chính: Admin hoặc Game Nông Trại MochiFarm duy nhất */}
      {currentView === 'admin' ? (
        <div className="h-full flex flex-col overflow-hidden bg-[#FAF8F5]">
          <AdminDashboard 
            onExitAdmin={handleExitAdmin} 
            currentUser={currentUser}
            studentEmail={studentEmail}
          />
        </div>
      ) : (
        <div className="h-full flex flex-col overflow-hidden bg-[#E8F5E9]/20">
          <MochiFarmView
            studentEmail={studentEmail}
            currentUser={currentUser}
            onOpenTargetBandModal={() => setIsBandModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onSignOut={handleSignOut}
          />
        </div>
      )}

      {/* Target Band Modal */}
      <BandSelectorModal
        isOpen={isBandModalOpen}
        onClose={() => setIsBandModalOpen(false)}
        currentBand={targetBand}
        onSelectBand={handleUpdateTargetBand}
      />

      {/* Cài đặt tài khoản & AI (Gemini Key, hồ sơ học viên, target band, reset data) */}
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
        onGoView={() => setIsSettingsModalOpen(false)}
      />

      {/* Đăng Nhập / Tạo Tài Khoản Vào Nông Trại MochiFarm */}
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
          setCurrentView('farm');
        }}
      />
    </div>
  );
}
