import React, { useState, useEffect } from 'react';
import { HeartPulse, ArrowUp, Database, X, Users } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export default function Footer({ currentUser, onOpenConsultModal, onOpenAdmin, onSelectCategory, onSubscribeClick }) {
  const [showUnsub, setShowUnsub] = useState(false);
  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubLoading, setUnsubLoading] = useState(false);
  const [unsubMsg, setUnsubMsg] = useState('');
  const [visitors, setVisitors] = useState({ today: 0, total: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/visitors`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVisitors({ today: data.today, total: data.total });
        }
      })
      .catch(err => console.error('Failed to load visitors', err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentUser?.hasCareGrade === '관리자' || currentUser?.id === 'sr' || currentUser?.id === 'admin';

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!unsubEmail.includes('@')) {
      setUnsubMsg('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    setUnsubLoading(true);
    setUnsubMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unsubEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setUnsubMsg('✅ 구독이 성공적으로 취소되었습니다.');
        setUnsubEmail('');
      } else if (data.notFound) {
        setUnsubMsg('❌ 해당 이메일로 등록된 구독 정보를 찾을 수 없습니다.');
      } else {
        setUnsubMsg(data.message || '처리 중 오류가 발생했습니다.');
      }
    } catch {
      setUnsubMsg('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setUnsubLoading(false);
    }
  };

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
              <li><a href="#archive-care">어르신 돌봄</a></li>
              <li><a href="#archive-nursing">어르신 요양케어</a></li>
              <li><a href="#archive-info">노인정보 관리</a></li>
              <li><a href="#archive-health">건강 관리법</a></li>
              <li><a href="#archive-policy">복지정책</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>서비스 &amp; 소개</h5>
            <ul className="footer-links">
              <li><a href="#aboutcenter">11재활통합주간보호 소개</a></li>
              <li><a href="#aboutceo">센터 원장 소개</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenConsultModal(); }}>무료 등급 신청 상담</a></li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setShowUnsub(v => !v); setUnsubMsg(''); }}
                  style={{ color: 'var(--text-muted)' }}
                >
                  구독 취소
                </a>
              </li>
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

            {/* 구독 취소 인라인 폼 */}
            {showUnsub && (
              <div style={{
                marginTop: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>구독 취소</span>
                  <button
                    onClick={() => { setShowUnsub(false); setUnsubMsg(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleUnsubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="구독 이메일 입력"
                    value={unsubEmail}
                    onChange={e => setUnsubEmail(e.target.value)}
                    required
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={unsubLoading}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: '#ef4444',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: unsubLoading ? 'not-allowed' : 'pointer',
                      opacity: unsubLoading ? 0.7 : 1,
                    }}
                  >
                    {unsubLoading ? '처리 중…' : '구독 취소 확인'}
                  </button>
                  {unsubMsg && (
                    <p style={{ margin: 0, fontSize: '0.78rem', color: unsubMsg.startsWith('✅') ? '#16a34a' : '#ef4444' }}>
                      {unsubMsg}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Users size={14} />
              <span>오늘 방문자: <strong>{visitors.today.toLocaleString()}</strong></span>
              <span style={{ margin: '0 4px', opacity: 0.5 }}>|</span>
              <span>전체 방문자: <strong>{visitors.total.toLocaleString()}</strong></span>
            </div>
            <span style={{ fontSize: '0.85rem' }}>
              © 2026 11 DayCare Letter. All rights reserved. <span className="powered-by">Powered by AI Health Automation.</span>
            </span>
          </div>
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
