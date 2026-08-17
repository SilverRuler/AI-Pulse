import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Clock, Users, Sparkles } from 'lucide-react';

export default function Hero({ onSubscribeSuccess }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    // Simulate instant backend subscription API call
    setTimeout(() => {
      setIsLoading(false);
      onSubscribeSuccess(email);
      setEmail('');
    }, 600);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-pill">
          <span className="hero-pill-dot"></span>
          <span>AI가 매일 전 세계 10,000+개 기사를 스캔합니다</span>
        </div>

        <h1 className="hero-title">
          매일 아침 8시, <br />
          <span className="gradient-text">AI 핵심 테크 뉴스</span>를 3분 요약으로.
        </h1>

        <p className="hero-desc">
          바쁜 개발자, 기획자, 연구원을 위해 AI가 노이즈를 걷어내고<br />
          가장 중요한 기술 동향과 실무 인사이트만 엄선하여 이메일로 보내드립니다.
        </p>

        <div className="subscribe-form-wrapper">
          <form onSubmit={handleSubmit} className="subscribe-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="뉴스레터를 받을 이메일 주소 입력..."
              required
              className="subscribe-input"
            />
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <span>구독 처리 중...</span>
              ) : (
                <>
                  <span>무료로 구독하기</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <Users size={16} style={{ color: 'var(--accent-success)' }} />
            <span><strong>1,850+</strong>명 구독 중</span>
          </div>
          <span>•</span>
          <div className="stat-item">
            <Clock size={16} />
            <span>매일 아침 8:00 발송</span>
          </div>
          <span>•</span>
          <div className="stat-item">
            <ShieldCheck size={16} />
            <span>완전 무료 • 원클릭 수신거부</span>
          </div>
        </div>
      </div>
    </section>
  );
}
