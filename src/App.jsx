import React, { useState, useEffect } from 'react';
import { GameContainer } from './features/farm';
import AuthModal from './components/AuthModal';
import { 
  getCurrentUser, 
  onAuthStateChange, 
  signOut 
} from './services/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Supabase Auth listener
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });

    const sub = onAuthStateChange((_event, user) => {
      setCurrentUser(user || null);
    });

    return () => {
      if (sub?.unsubscribe) sub.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Standalone 2D Farm Simulation Viewport */}
      <GameContainer
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Cloud Authentication Modal (Optional for Cloud Sync) */}
      <AuthModal
        isOpen={isAuthModalOpen && !currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        isRequired={false}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />
    </main>
  );
}
