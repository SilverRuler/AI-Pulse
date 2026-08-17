import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedIssue from './components/FeaturedIssue';
import ArchiveFeed from './components/ArchiveFeed';
import ReaderModal from './components/ReaderModal';
import SubscribeModal from './components/SubscribeModal';
import ConsultModal from './components/ConsultModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import AboutCenter from './components/AboutCenter';
import AboutCeo from './components/AboutCeo';
import Footer from './components/Footer';
import { newsletters as defaultNewsletters } from './data/newsletters';
import { API_BASE_URL } from './utils/api';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [newslettersList, setNewslettersList] = useState(defaultNewsletters);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  
  // Page view state: 'home' | 'aboutcenter' | 'aboutceo'
  const [currentView, setCurrentView] = useState('home');

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login'); // 'login' | 'signup'
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Hash-based view synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#aboutcenter') {
        setCurrentView('aboutcenter');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#aboutceo') {
        setCurrentView('aboutceo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

    // Fetch latest newsletters from Redis API
    fetch(`${API_BASE_URL}/api/newsletters`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.newsletters) && data.newsletters.length > 0) {
          setNewslettersList(data.newsletters);
        }
      })
      .catch((err) => console.error('Failed to load newsletters from API', err));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleOpenConsultModal = () => {
    setIsConsultModalOpen(true);
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

  const featuredIssue = newslettersList.find((n) => n.featured) || newslettersList[0];

  return (
    <div className="app">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      <main>
        {currentView === 'aboutcenter' ? (
          <AboutCenter
            onGoHome={handleGoHome}
            onOpenConsultModal={handleOpenConsultModal}
          />
        ) : currentView === 'aboutceo' ? (
          <AboutCeo
            onGoHome={handleGoHome}
            onOpenConsultModal={handleOpenConsultModal}
          />
        ) : (
          <>
            <Hero
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onSubscribeSuccess={handleHeroSubscribeSuccess}
            />
            <FeaturedIssue issue={featuredIssue} onOpenReader={setSelectedIssue} />
            <ArchiveFeed newsletters={newslettersList} onOpenReader={setSelectedIssue} />
          </>
        )}
      </main>

      <Footer
        currentUser={currentUser}
        onSubscribeClick={handleOpenSubscribeModal}
        onOpenConsultModal={handleOpenConsultModal}
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

      {/* Free Care Grade Consultation Modal */}
      <ConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth Modal (Login / Signup with 3-Level Address Dropdowns) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authInitialMode}
      />

      {/* Admin Redis DB Console Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
