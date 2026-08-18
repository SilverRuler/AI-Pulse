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

// Helper to normalize and auto-assign unique issue numbers if they are duplicate or 1
function normalizeNewsletters(rawList, globalCounts = { views: {}, likes: {} }) {
  if (!Array.isArray(rawList) || rawList.length === 0) return defaultNewsletters;

  const total = rawList.length;
  // Check if all issue numbers are identical (e.g. all 1)
  const allSameNumber = rawList.every((item) => item.issueNumber === rawList[0].issueNumber);

  return rawList.map((item, index) => {
    // If all are same, assign descending Issue number (e.g. Issue #20 down to #1)
    const issueNum = allSameNumber ? total - index : (item.issueNumber || (total - index));
    
    // Ensure views and likes have valid numbers
    let views = item.views ? (typeof item.views === 'number' ? item.views : parseInt(String(item.views).replace(/[^0-9]/g, '')) || 120 + index * 15) : (150 + (total - index) * 23);
    let likes = typeof item.likes === 'number' ? item.likes : (12 + (index % 7));

    // Add global counts from Redis
    if (globalCounts.views && globalCounts.views[item.id]) {
      views += parseInt(globalCounts.views[item.id] || 0);
    }
    if (globalCounts.likes && globalCounts.likes[item.id]) {
      likes += parseInt(globalCounts.likes[item.id] || 0);
    }

    return {
      ...item,
      issueNumber: issueNum,
      views,
      likes,
      featured: index === 0 ? true : false // Make the latest article featured
    };
  });
}

// Helper to save global increments
const updateGlobalCounts = (issueId, field, delta) => {
  fetch(`${API_BASE_URL}/api/counts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueId, field, delta })
  }).catch(e => console.error('Failed to update counts', e));
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [newslettersList, setNewslettersList] = useState(() => normalizeNewsletters(defaultNewsletters));
  const [currentUser, setCurrentUser] = useState(null);
  const [userLikes, setUserLikes] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [initialArchiveCategory, setInitialArchiveCategory] = useState('all');

  // Page view state: 'home' | 'aboutcenter' | 'aboutceo' | 'archive'
  const [currentView, setCurrentView] = useState('home');

  // Modal states
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login'); // 'login' | 'signup'
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Load user & user likes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      const savedUser = localStorage.getItem('11daycare_current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        const savedLikes = localStorage.getItem(`11daycare_likes_${user.id}`);
        if (savedLikes) {
          setUserLikes(JSON.parse(savedLikes));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch latest newsletters and global counts from Redis API
    Promise.all([
      fetch(`${API_BASE_URL}/api/newsletters`).then((res) => res.json()).catch(() => ({})),
      fetch(`${API_BASE_URL}/api/counts`).then((res) => res.json()).catch(() => ({}))
    ]).then(([newsData, countsData]) => {
      if (newsData.success && Array.isArray(newsData.newsletters) && newsData.newsletters.length > 0) {
        const globalCounts = countsData?.counts || { views: {}, likes: {} };
        const normalized = normalizeNewsletters(newsData.newsletters, globalCounts);
        setNewslettersList(normalized);
      }
    });
  }, [theme]);

  // Hash & Deep-link Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#aboutcenter') {
        setCurrentView('aboutcenter');
        setSelectedIssue(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#aboutceo') {
        setCurrentView('aboutceo');
        setSelectedIssue(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#archive') {
        setInitialArchiveCategory('all');
        setCurrentView('archive');
        setSelectedIssue(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#archive-')) {
        const cat = hash.replace('#archive-', '');
        setInitialArchiveCategory(cat);
        setCurrentView('archive');
        setSelectedIssue(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#issue=')) {
        const issueId = hash.replace('#issue=', '');
        const matched = newslettersList.find((n) => n.id === issueId || String(n.issueNumber) === issueId);
        if (matched) {
          setSelectedIssue(matched);
        }
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [newslettersList]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGoHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    setSelectedIssue(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    try {
      const savedLikes = localStorage.getItem(`11daycare_likes_${user.id}`);
      if (savedLikes) {
        setUserLikes(JSON.parse(savedLikes));
      } else {
        setUserLikes([]);
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('11daycare_current_user');
      setCurrentUser(null);
      setUserLikes([]);
    }
  };

  // Like Toggle Handler (Members Only)
  const handleToggleLike = (issueId) => {
    if (!currentUser) {
      alert('로그인이 필요합니다. 먼저 로그인 또는 회원가입을 진행해 주세요.');
      handleOpenAuth('login');
      return;
    }

    const isAlreadyLiked = userLikes.includes(issueId);
    const updatedLikes = isAlreadyLiked
      ? userLikes.filter((id) => id !== issueId)
      : [...userLikes, issueId];

    setUserLikes(updatedLikes);
    localStorage.setItem(`11daycare_likes_${currentUser.id}`, JSON.stringify(updatedLikes));

    // Update count in state
    setNewslettersList((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          return {
            ...item,
            likes: Math.max(0, (item.likes || 0) + (isAlreadyLiked ? -1 : 1))
          };
        }
        return item;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => ({
        ...prev,
        likes: Math.max(0, (prev.likes || 0) + (isAlreadyLiked ? -1 : 1))
      }));
    }

    // Persist to global counts via backend
    updateGlobalCounts(issueId, 'likes', isAlreadyLiked ? -1 : 1);
  };

  // Open Reader Modal + Increment View Count
  const handleOpenReader = (issue) => {
    // Increment view count
    setNewslettersList((prev) =>
      prev.map((item) => (item.id === issue.id ? { ...item, views: (item.views || 0) + 1 } : item))
    );

    const updatedIssue = {
      ...issue,
      views: (issue.views || 0) + 1
    };

    setSelectedIssue(updatedIssue);
    
    // Persist to global counts via backend
    updateGlobalCounts(issue.id, 'views', 1);

    // Update hash for deep-link
    window.location.hash = `#issue=${issue.id}`;
  };

  const handleCloseReader = () => {
    setSelectedIssue(null);
    if (window.location.hash.startsWith('#issue=')) {
      window.history.replaceState(null, '', currentView === 'archive' ? '#archive' : window.location.pathname);
    }
  };

  // Deep-link Sharing Handler
  const handleShare = (issue) => {
    const shareUrl = `${window.location.origin}/#issue=${issue.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `[11 DayCare Letter] ${issue.title}`,
          text: issue.summary,
          url: shareUrl
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert(`기사 전용 링크가 클립보드에 복사되었습니다!\n\n🔗 ${shareUrl}`);
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

  // Category select from Footer or Navigation
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (currentView !== 'home' && currentView !== 'archive') {
      setCurrentView('home');
    }
    const archiveElement = document.getElementById('archive');
    if (archiveElement) {
      archiveElement.scrollIntoView({ behavior: 'smooth' });
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
        ) : currentView === 'archive' ? (
          /* Full Archive View with All Articles */
          <ArchiveFeed
            key={initialArchiveCategory}
            newsletters={newslettersList}
            onOpenReader={handleOpenReader}
            isFullPage={true}
            onGoHome={handleGoHome}
            initialCategory={initialArchiveCategory}
            userLikes={userLikes}
            onToggleLike={handleToggleLike}
          />
        ) : (
          /* Home View: Hero + Featured + 12 Archive Cards with More button */
          <>
            <Hero
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onSubscribeSuccess={handleHeroSubscribeSuccess}
            />
            <FeaturedIssue
              issue={featuredIssue}
              onOpenReader={handleOpenReader}
              userLikes={userLikes}
              onToggleLike={handleToggleLike}
            />
            <ArchiveFeed
              newsletters={newslettersList}
              onOpenReader={handleOpenReader}
              isFullPage={false}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              userLikes={userLikes}
              onToggleLike={handleToggleLike}
            />
          </>
        )}
      </main>

      <Footer
        currentUser={currentUser}
        onSubscribeClick={handleOpenSubscribeModal}
        onOpenConsultModal={handleOpenConsultModal}
        onOpenAdmin={() => setIsAdminModalOpen(false || true)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Full Article Reader Modal (with deep link & likes) */}
      <ReaderModal
        issue={selectedIssue}
        onClose={handleCloseReader}
        onShare={handleShare}
        userLikes={userLikes}
        onToggleLike={handleToggleLike}
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
