import React, { useState, useEffect } from 'react';
import { X, Database, Users, Mail, RefreshCw, Download, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export default function AdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'subscriptions'
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`),
        fetch(`${API_BASE_URL}/api/admin/subscriptions`)
      ]);
      const uData = await uRes.json();
      const sData = await sRes.json();
      if (uData.success) setUsers(uData.users || []);
      if (sData.success) setSubscriptions(sData.subscriptions || []);
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700 }}>운영자 SQLite DB 관리자 콘솔</span>
            <span className="tag accent" style={{ fontSize: '0.75rem' }}>Local Server DB</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={fetchData} className="icon-button" title="새로고침">
              <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            </button>
            <button onClick={onClose} className="icon-button" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <button
              onClick={() => setActiveTab('users')}
              className={`filter-btn ${activeTab === 'users' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={15} />
              <span>가입 회원 목록 ({users.length}명)</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`filter-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Mail size={15} />
              <span>구독 신청 목록 ({subscriptions.length}건)</span>
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              데이터베이스 조회 중...
            </div>
          ) : activeTab === 'users' ? (
            /* ================= USERS TABLE ================= */
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                📁 저장 경로: <code>/root/ai-newsletter-web/data/database.sqlite</code> (users 테이블)
              </p>
              {users.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  아직 가입된 회원이 없습니다. 상단에서 회원가입을 테스트해 보세요.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                        <th style={{ padding: '10px' }}>아이디</th>
                        <th style={{ padding: '10px' }}>휴대폰</th>
                        <th style={{ padding: '10px' }}>거주 주소지</th>
                        <th style={{ padding: '10px' }}>장기요양 등급</th>
                        <th style={{ padding: '10px' }}>가입일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{u.id}</td>
                          <td style={{ padding: '10px' }}>{u.phone}</td>
                          <td style={{ padding: '10px' }}>{u.address}</td>
                          <td style={{ padding: '10px' }}>
                            <span className="tag" style={{ fontSize: '0.75rem', color: u.has_care_grade?.includes('예') ? '#059669' : 'var(--text-muted)' }}>
                              {u.has_care_grade}
                            </span>
                          </td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleString('ko-KR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* ================= SUBSCRIPTIONS TABLE ================= */
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                📁 저장 경로: <code>/root/ai-newsletter-web/data/database.sqlite</code> (subscriptions 테이블)
              </p>
              {subscriptions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  아직 구독 신청 내역이 없습니다.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>구독 이메일</th>
                        <th style={{ padding: '10px' }}>회원 ID</th>
                        <th style={{ padding: '10px' }}>관심 토픽</th>
                        <th style={{ padding: '10px' }}>신청일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((s, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px' }}>#{s.id}</td>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{s.email}</td>
                          <td style={{ padding: '10px' }}>{s.user_id || '(비회원)'}</td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{s.topics}</td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {s.created_at ? new Date(s.created_at).toLocaleString('ko-KR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
