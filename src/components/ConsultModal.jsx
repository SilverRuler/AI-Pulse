import React, { useState } from 'react';
import { X, Phone, Heart, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ConsultModal({ isOpen, onClose, currentUser, onOpenAuth }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleApplyClick = () => {
    // 1. Check login
    if (!currentUser) {
      alert('로그인이 필요합니다. 먼저 로그인 또는 회원가입을 진행해 주세요.');
      onClose();
      onOpenAuth('login');
      return;
    }

    // 2. Confirm sending mail to director
    const confirmed = window.confirm('센터 원장님에게 상담 요청 메일을 보내시겠습니까?');
    if (confirmed) {
      setIsSuccess(true);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setNote('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} style={{ color: '#ec4899' }} />
            <span style={{ fontWeight: 700 }}>무료 장기요양 등급 신청 상담</span>
          </div>
          <button onClick={handleResetAndClose} className="icon-button" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '28px 24px', textAlign: 'center' }}>
          {isSuccess ? (
            <div className="success-box" style={{ padding: '10px 0' }}>
              <div className="success-icon">
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
                상담 요청이 원장님께 전달되었습니다! 🎉
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                <strong>{currentUser?.id}</strong>님의 연락처(<strong>{currentUser?.phone}</strong>)로<br />
                센터 원장님이 직접 확인 후 빠른 시일 내에 친절히 상담 전화를 드리겠습니다.
              </p>
              <button
                onClick={handleResetAndClose}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                확인
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <HelpCircle size={28} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.35 }}>
                장기요양 등급 신청이 어려우신가요?
              </h2>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                성심성의껏 도와드리겠습니다.<br />
                부담 없이 편하게 연락주세요.
              </p>

              {/* Phone Highlight Banner */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  원장 직통 상담 전화
                </span>
                <a
                  href="tel:010-8963-5166"
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Phone size={20} />
                  <span>010-8963-5166</span>
                </a>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#ec4899', fontWeight: 700, marginBottom: '22px' }}>
                💖 "어르신을 정성과 사랑으로 모십니다"
              </p>

              {currentUser ? (
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'left' }}>
                  <span style={{ color: 'var(--text-muted)' }}>신청자 정보: </span>
                  <strong>{currentUser.id}</strong> ({currentUser.phone || '연락처 등록됨'})
                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  💡 온라인 상담 신청을 위해 로그인이 필요합니다.
                </p>
              )}

              <button
                onClick={handleApplyClick}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.98rem' }}
              >
                <Send size={16} />
                <span>상담 신청하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
