import React from 'react';
import { Zap, Moon, Sun, Search, Mail } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, onSubscribeClick }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="/" className="brand">
          <div className="brand-icon">
            <Zap size={20} />
          </div>
          <span>AI Pulse</span>
          <span className="brand-badge">Daily</span>
        </a>

        <div className="nav-actions">
          <a href="#archive" className="nav-link">지난 뉴스레터</a>
          <a href="#about" className="nav-link">소개</a>

          <button
            onClick={toggleTheme}
            className="icon-button"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="Theme toggle"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={onSubscribeClick} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            <Mail size={16} />
            <span>무료 구독</span>
          </button>
        </div>
      </div>
    </header>
  );
}
