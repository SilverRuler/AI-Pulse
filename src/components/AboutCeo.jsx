import React from 'react';
import { UserCheck, Heart, Award, ArrowLeft, Phone, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutCeo({ onGoHome, onOpenConsultModal }) {
  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '850px' }}>
      {/* Top Back Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={onGoHome}
          className="btn-primary"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '8px 16px',
            fontSize: '0.88rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>홈으로 돌아가기</span>
        </button>
      </div>

      {/* CEO Profile Header */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '36px 30px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', alignItems: 'center' }}>
          
          {/* Photo Placeholder Frame */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '220px',
                height: '260px',
                margin: '0 auto',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.15) 100%)',
                border: '2px dashed var(--border-active)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: 'var(--accent-primary)' }}>
                <UserCheck size={36} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>센터 원장 프로필 사진</span>
              <span style={{ fontSize: '0.78rem', marginTop: '4px' }}>[원장 사진 삽입 영역]</span>
            </div>
          </div>

          {/* CEO Introduction Copy */}
          <div>
            <div className="hero-pill" style={{ marginBottom: '12px' }}>
              <Heart size={14} style={{ color: '#ec4899' }} />
              <span>정성과 사랑의 10년 노인복지 전문가</span>
            </div>
            
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
              "어르신을 내 부모님처럼 모십니다"
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '16px' }}>
              11재활통합주간보호센터 원장 인사말
            </p>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
              안녕하십니까. 11재활통합주간보호센터 원장입니다.<br /><br />
              노인 복지 및 어르신 요양·재활 업계에서 <strong>10년 이상</strong> 한결같은 마음으로 수많은 어르신과 가족분들을 만나왔습니다.
              어르신 한 분 한 분의 살아오신 삶의 궤적을 깊이 존중하며, 단순한 돌봄을 넘어 <strong>신체적 재활과 정서적 행복</strong>을 함께 지켜드리는 따뜻한 보금자리를 만들고 있습니다.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
                <span>노인 복지 및 시니어 재활 케어 10년+ 전문 경력</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
                <span>국민건강보험공단 장기요양 등급 신청 무료 1:1 맞춤 컨설팅</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
                <span>시흥시 정왕동 지역 사회 밀착형 어르신 케어 네트워크 구축</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '30px', marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>원장의 3대 운영 철학</span>
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '6px' }}>1. 진심을 담은 사랑</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              형식적인 돌봄이 아닌, 눈을 맞추고 손을 잡아드리는 따뜻한 가족 같은 정성을 다합니다.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: '#10b981', display: 'block', marginBottom: '6px' }}>2. 전문적인 재활</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              10년의 노하우를 바탕으로 어르신의 신체 기능 유지와 치매 인지 케어를 과학적으로 지원합니다.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <strong style={{ color: '#ec4899', display: 'block', marginBottom: '6px' }}>3. 가족의 든든한 쉼표</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              보호자분들께서 안심하고 경제활동과 일상생활에 전념하실 수 있도록 든든한 버팀목이 됩니다.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center', padding: '16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>등급 신청 및 입소에 관해 궁금한 점이 있으시다면 언제든 원장에게 직접 문의해 주세요.</span>
          <div style={{ marginTop: '8px' }}>
            <button
              onClick={onOpenConsultModal}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              <Phone size={15} />
              <span>원장 1:1 무료 상담 신청</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Home Button */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={onGoHome} className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem' }}>
          <ArrowLeft size={18} />
          <span>홈으로 돌아가기 (뉴스레터 메인)</span>
        </button>
      </div>
    </div>
  );
}
