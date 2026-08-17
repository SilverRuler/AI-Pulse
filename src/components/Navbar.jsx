import React from 'react';
import { HeartPulse, Moon, Sun, User, LogOut } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, currentUser, onOpenAuth, onLogout, onGoHome }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#" onClick={(e) => { e.preventDefault(); onGoHome && onGoHome(); }} className="brand">
          <div className="brand-icon">
            <HeartPulse size={20} />
          </div>
          <span>11 DayCare Letter</span>
          <span className="brand-badge">Health</span>
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

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '5px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <User size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}><strong>{currentUser.id}</strong>님</span>
              </div>
              <button
                onClick={onLogout}
                className="icon-button"
                title="로그아웃"
                style={{ width: '34px', height: '34px' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-primary"
              style={{ padding: '7px 12px', fontSize: '0.82rem' }}
            >
              <User size={15} />
              <span>로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
