import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedIssue from './components/FeaturedIssue';
import ArchiveFeed from './components/ArchiveFeed';
import ReaderModal from './components/ReaderModal';
import SubscribeModal from './components/SubscribeModal';
import Footer from './components/Footer';
import { newsletters } from './data/newsletters';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleHeroSubscribeSuccess = (email) => {
    setSubscribedEmail(email);
    setIsSubscribeModalOpen(true);
  };

  const handleOpenSubscribeModal = () => {
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
        onSubscribeClick={handleOpenSubscribeModal}
      />

      <main>
        <Hero onSubscribeSuccess={handleHeroSubscribeSuccess} />
        <FeaturedIssue issue={featuredIssue} onOpenReader={setSelectedIssue} />
        <ArchiveFeed newsletters={newsletters} onOpenReader={setSelectedIssue} />
      </main>

      <Footer onSubscribeClick={handleOpenSubscribeModal} />

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
    </div>
  );
}
