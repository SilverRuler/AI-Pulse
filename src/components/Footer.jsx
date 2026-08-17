import React from 'react';
import { Zap, Github, Twitter, Mail, Rss, ArrowUp } from 'lucide-react';

export default function Footer({ onSubscribeClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="about" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand" style={{ marginBottom: '8px' }}>
              <div className="brand-icon">
                <Zap size={18} />
              </div>
              <span>AI Pulse</span>
            </a>
            <p>
              AI가 전 세계 최신 테크 기사를 크롤링하고 요약하여,
              개발자와 기획자에게 매일 아침 무료로 배달합니다.
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
            <h5>서비스</h5>
            <ul className="footer-links">
              <li><a href="#about">서비스 소개</a></li>
              <li><a href="#archive">지난 아카이브</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onSubscribeClick(); }}>무료 구독 신청</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub 저장소</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AI Pulse. All rights reserved. Powered by AI Automation.</span>
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
