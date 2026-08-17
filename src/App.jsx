import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedIssue from './components/FeaturedIssue';
import ArchiveFeed from './components/ArchiveFeed';
import ReaderModal from './components/ReaderModal';
import SubscribeModal from './components/SubscribeModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { newsletters } from './data/newsletters';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  
  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login'); // 'login' | 'signup'

  // Admin DB modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Load saved user session from localStorage
    try {
      const savedUser = localStorage.getItem('11daycare_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('11daycare_current_user');
      setCurrentUser(null);
    }
  };

  const handleHeroSubscribeSuccess = (email) => {
    setSubscribedEmail(email);
    setIsSubscribeModalOpen(true);
  };

  const handleOpenSubscribeModal = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다. 먼저 로그인 또는 회원가입을 진행해 주세요.');
      handleOpenAuth('login');
      return;
    }
    setSubscribedEmail('');
    setIsSubscribeModalOpen(true);
  };

  const handleShare = (issue) => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  const featuredIssue = newsletters.find((n) => n.featured) || newsletters[0];

  return (
    <div className="app">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <main>
        <Hero
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSubscribeSuccess={handleHeroSubscribeSuccess}
        />
        <FeaturedIssue issue={featuredIssue} onOpenReader={setSelectedIssue} />
        <ArchiveFeed newsletters={newsletters} onOpenReader={setSelectedIssue} />
      </main>

      <Footer
        currentUser={currentUser}
        onSubscribeClick={handleOpenSubscribeModal}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Full Article Reader Modal */}
      <ReaderModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onShare={handleShare}
      />

      {/* Subscribe Confirmation Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        subscribedEmail={subscribedEmail}
      />

      {/* Auth Modal (Login / Signup with 3-Level Address Dropdowns) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* Admin SQLite DB Console Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
