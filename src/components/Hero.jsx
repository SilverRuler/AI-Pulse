import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Clock, Users, Sparkles, UserCheck } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export default function Hero({ currentUser, onOpenAuth, onSubscribeSuccess }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check if user is logged in
    if (!currentUser) {
      alert('로그인이 필요합니다. 먼저 로그인 또는 회원가입을 진행해 주세요.');
      onOpenAuth('login');
      return;
    }

    // 2. Validate email
    if (!email || !email.includes('@')) {
      alert('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        userId: currentUser.id,
        topics: ['보건/건강', '복지제도']
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.alreadySubscribed) {
        alert('이미 구독 중인 이메일입니다. 😊\n구독 취소는 하단 푸터의 "구독 취소" 버튼을 이용해 주세요.');
      } else if (data.success) {
        onSubscribeSuccess(email);
        setEmail('');
      } else {
        alert(data.message || '구독 처리 중 오류가 발생했습니다.');
      }
    })
    .catch((err) => {
      console.error(err);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-pill">
          <span className="hero-pill-dot"></span>
          <span>AI가 매일 국내 500+ 보건/건강 기사를 스캔합니다</span>
        </div>

        <h1 className="hero-title">
          매일 아침 8시, <br />
          <span className="gradient-text">AI 핵심 건강 뉴스</span>를 3분 요약으로.
        </h1>

        <p className="hero-desc">
          바쁜 현대인, 어르신 보호자, 직장인을 위해 AI가 노이즈를 걷어내고<br />
          가장 중요한 복지 동향과 핵심 인사이트만 엄선하여 이메일로 보내드립니다.
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
          {!currentUser && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              💡 구독을 위해 먼저 상단 <strong>[회원가입 / 로그인]</strong>이 필요합니다.
            </p>
          )}
          {currentUser && (
            <p style={{ fontSize: '0.82rem', color: 'var(--accent-success)', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <UserCheck size={14} />
              <span><strong>{currentUser.id}</strong>님 로그인됨 ({currentUser.address || '시흥시 정왕동'} • 장기요양: {currentUser.hasCareGrade || '예'})</span>
            </p>
          )}
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
