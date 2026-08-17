import React from 'react';
import { HeartPulse, ArrowUp, Database } from 'lucide-react';

export default function Footer({ currentUser, onSubscribeClick, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentUser?.hasCareGrade === '관리자' || currentUser?.id === 'sr' || currentUser?.id === 'admin';

  return (
    <footer id="about" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand" style={{ marginBottom: '8px' }}>
              <div className="brand-icon">
                <HeartPulse size={18} />
              </div>
              <span>11 DayCare Letter</span>
            </a>
            <p>
              AI가 매일 국내 500+ 보건/건강 기사를 스캔하고 요약하여,
              어르신 보호자와 현대인에게 매일 아침 무료로 배달합니다.
            </p>
          </div>

          <div className="footer-col">
            <h5>카테고리</h5>
            <ul className="footer-links">
              <li><a href="#archive">LLM & 파운데이션 모델</a></li>
              <li><a href="#archive">오픈소스 AI & 개발툴</a></li>
              <li><a href="#archive">글로벌 테크 비즈니스</a></li>
              <li><a href="#archive">최신 AI 리서치 논문</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>서비스 & 소개</h5>
            <ul className="footer-links">
              <li><a href="#about">11재활통합주간보호 소개</a></li>
              <li><a href="#about">센터 원장 소개</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSubscribeClick(); }}>무료 등급 신청 상담</a></li>
              {isAdmin && (
                <li style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border-subtle)' }}>
                  <button
                    onClick={onOpenAdmin}
                    style={{
                      background: 'rgba(79, 70, 229, 0.12)',
                      border: '1px solid var(--accent-primary)',
                      color: 'var(--accent-primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.82rem'
                    }}
                  >
                    <Database size={14} />
                    <span>🛠️ 운영자 DB 콘솔 (Redis)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 11 DayCare Letter. All rights reserved. Powered by AI Health Automation.</span>
          <button
            onClick={scrollToTop}
            className="icon-button"
            title="맨 위로 가기"
            style={{ width: '32px', height: '32px' }}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
