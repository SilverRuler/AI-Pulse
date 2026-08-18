import React, { useState, useEffect } from 'react';
import { X, Lock, User, Phone, MapPin, CheckCircle, ArrowRight, Shield, HeartHandshake } from 'lucide-react';
import { KOREA_REGIONS } from '../data/koreaRegions';
import { API_BASE_URL } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupId, setSignupId] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupPwConfirm, setSignupPwConfirm] = useState('');
  const [phone, setPhone] = useState('010-');
  const [sido, setSido] = useState('경기도');
  const [sigungu, setSigungu] = useState('시흥시');
  const [dong, setDong] = useState('정왕동');
  const [hasCareGrade, setHasCareGrade] = useState('yes'); // 'yes' | 'no'
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setLoginError('');
    setSignupError('');
    setSignupSuccess(false);
    setIsLoading(false);
  }, [initialMode, isOpen]);

  // Handle region cascade updates
  const sidoList = Object.keys(KOREA_REGIONS);
  const sigunguList = sido && KOREA_REGIONS[sido] ? Object.keys(KOREA_REGIONS[sido]) : [];
  const dongList = sido && sigungu && KOREA_REGIONS[sido]?.[sigungu] ? KOREA_REGIONS[sido][sigungu] : [];

  const handleSidoChange = (newSido) => {
    setSido(newSido);
    const newSigunguList = Object.keys(KOREA_REGIONS[newSido] || {});
    const firstSigungu = newSigunguList[0] || '';
    setSigungu(firstSigungu);
    const newDongList = firstSigungu && KOREA_REGIONS[newSido]?.[firstSigungu] ? KOREA_REGIONS[newSido][firstSigungu] : [];
    setDong(newDongList[0] || '');
  };

  const handleSigunguChange = (newSigungu) => {
    setSigungu(newSigungu);
    const newDongList = sido && newSigungu && KOREA_REGIONS[sido]?.[newSigungu] ? KOREA_REGIONS[sido][newSigungu] : [];
    setDong(newDongList[0] || '');
  };

  // Phone number auto-formatter (010-XXXX-XXXX)
  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length <= 3) {
      formatted = raw;
    } else if (raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  // Real Server SQLite Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginId.trim() || !loginPw.trim()) {
      setLoginError('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId, pw: loginPw }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('11daycare_current_user', JSON.stringify(result.user));
        onAuthSuccess(result.user);
        onClose();
      } else {
        setLoginError(result.error || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Server SQLite Signup handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupId.trim()) {
      setSignupError('아이디를 입력해 주세요.');
      return;
    }
    if (signupPw.length < 4) {
      setSignupError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (signupPw !== signupPwConfirm) {
      setSignupError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setSignupError('올바른 휴대폰 번호를 입력해 주세요.');
      return;
    }
    if (!sido || !sigungu || !dong) {
      setSignupError('주소 3단계를 모두 선택해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: signupId,
          pw: signupPw,
          phone: phone,
          address: `${sido} ${sigungu} ${dong}`,
          sido,
          sigungu,
          dong,
          hasCareGrade: hasCareGrade === 'yes' ? '예 (등급 있음)' : '아니오 (없음/신청전)',
        }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('11daycare_current_user', JSON.stringify(result.user));
        setSignupSuccess(true);
        setTimeout(() => {
          onAuthSuccess(result.user);
          onClose();
        }, 1200);
      } else {
        setSignupError(result.error || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setSignupError('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700 }}>
              {mode === 'login' ? '로그인' : '간편 회원가입'}
            </span>
          </div>
          <button onClick={onClose} className="icon-button" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px 28px' }}>
          {signupSuccess ? (
            <div className="success-box" style={{ padding: '20px 0' }}>
              <div className="success-icon">
                <CheckCircle size={36} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
                회원가입이 완료되었습니다! 🎉
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                서버 SQLite DB에 안전하게 저장되었습니다.<br />
                <strong>{signupId}</strong>님 환영합니다.
              </p>
            </div>
          ) : mode === 'login' ? (
            /* ================= LOGIN VIEW ================= */
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>
                  {loginError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  아이디
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  비밀번호
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 36px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <span>{isLoading ? '로그인 확인 중...' : '로그인'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setLoginError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  회원가입
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGNUP VIEW ================= */
            <form onSubmit={handleSignupSubmit}>
              {signupError && (
                <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '14px' }}>
                  {signupError}
                </div>
              )}

              {/* ID */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  아이디 (ID) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={signupId}
                  onChange={(e) => setSignupId(e.target.value)}
                  placeholder="사용할 아이디 입력"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Password & Confirm */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    비밀번호 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={signupPw}
                    onChange={(e) => setSignupPw(e.target.value)}
                    placeholder="4자리 이상"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    비밀번호 확인 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={signupPwConfirm}
                    onChange={(e) => setSignupPwConfirm(e.target.value)}
                    placeholder="비밀번호 재입력"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  휴대폰 번호 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    placeholder="010-XXXX-XXXX"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* 3-Level Address Dropdowns */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <MapPin size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>거주 주소지 (시/도 ➔ 시/군/구 ➔ 읍/면/동) <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  {/* Sido */}
                  <select
                    value={sido}
                    onChange={(e) => handleSidoChange(e.target.value)}
                    style={{
                      padding: '8px 4px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.83rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {sidoList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Sigungu */}
                  <select
                    value={sigungu}
                    onChange={(e) => handleSigunguChange(e.target.value)}
                    style={{
                      padding: '8px 4px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.83rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {sigunguList.map((sg) => (
                      <option key={sg} value={sg}>{sg}</option>
                    ))}
                  </select>

                  {/* Dong */}
                  <select
                    value={dong}
                    onChange={(e) => setDong(e.target.value)}
                    style={{
                      padding: '8px 4px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.83rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {dongList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  선택된 주소: <strong>{sido} {sigungu} {dong}</strong>
                </p>
              </div>

              {/* Long-term care insurance grade question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <HeartHandshake size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span>간병중인 어르신께서 장기요양 등급이 있습니까? <span style={{ color: '#ef4444' }}>*</span></span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setHasCareGrade('yes')}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: hasCareGrade === 'yes' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: hasCareGrade === 'yes' ? 'rgba(79, 70, 229, 0.12)' : 'var(--bg-subtle)',
                      color: hasCareGrade === 'yes' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid currentColor', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {hasCareGrade === 'yes' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>}
                    </span>
                    <span>예 (등급 있음)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasCareGrade('no')}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: hasCareGrade === 'no' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: hasCareGrade === 'no' ? 'rgba(79, 70, 229, 0.12)' : 'var(--bg-subtle)',
                      color: hasCareGrade === 'no' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid currentColor', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {hasCareGrade === 'no' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>}
                    </span>
                    <span>아니오 (없음/신청전)</span>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <span>{isLoading ? '가입 처리 중...' : '회원가입 완료'}</span>
                <CheckCircle size={16} />
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setSignupError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  로그인
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
