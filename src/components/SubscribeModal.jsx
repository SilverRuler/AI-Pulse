import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Mail, Send } from 'lucide-react';
import { categories } from '../data/newsletters';

export default function SubscribeModal({ isOpen, onClose, subscribedEmail, onDirectSubscribe }) {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(['llm', 'opensource']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleTopic = (topicId) => {
    if (topicId === 'all') return;
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalEmail = subscribedEmail || email;
    if (!finalEmail) return;

    setIsSuccess(true);
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

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                <Send size={16} />
                <span>구독 시작하기</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
