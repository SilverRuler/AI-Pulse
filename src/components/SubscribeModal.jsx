import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Mail, Send } from 'lucide-react';
import { categories } from '../data/newsletters';

import { API_BASE_URL } from '../utils/api';

export default function SubscribeModal({ isOpen, onClose, subscribedEmail, onDirectSubscribe, currentUser }) {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(categories.filter(c => c.id !== 'all').map(c => c.id));
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleToggleTopic = (topicId) => {
    if (topicId === 'all') return;
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalEmail = subscribedEmail || email;
    if (!finalEmail) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail,
          userId: currentUser?.id || 'guest',
          topics: selectedTopics.map(t => categories.find(c => c.id === t)?.name || t)
        }),
      });
      const data = await res.json();
      if (data.alreadySubscribed) {
        alert('이미 구독 중인 이메일입니다. 😊\n구독 취소는 하단 푸터의 "구독 취소" 버튼을 이용해 주세요.');
        onClose();
      } else if (data.success) {
        setIsSuccess(true);
      } else {
        alert(data.message || '구독 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700 }}>11 DayCare Letter 무료 구독</span>
          </div>
          <button onClick={onClose} className="icon-button">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <div className="success-box">
              <div className="success-icon">
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
                구독이 완료되었습니다! 🎉
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                <strong>{subscribedEmail || email}</strong>(으)로<br />
                내일 아침 8시 첫 번째 AI 요약 뉴스레터가 발송됩니다.
              </p>
              <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                확인
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {!subscribedEmail && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {subscribedEmail && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>구독 대상: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{subscribedEmail}</strong>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  관심 있는 토픽 선택 (선택 사항)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleToggleTopic(cat.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: selectedTopics.includes(cat.id) ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: selectedTopics.includes(cat.id) ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-subtle)',
                        color: selectedTopics.includes(cat.id) ? '#818cf8' : 'var(--text-secondary)'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: isLoading ? 0.7 : 1 }}>
                <Send size={16} />
                <span>{isLoading ? '처리 중...' : '구독 완료하기'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
