import React from 'react';
import { Building2, MapPin, Phone, CheckCircle2, ArrowLeft, HeartPulse, Sparkles, Shield, Clock, Car, Award } from 'lucide-react';

export default function AboutCenter({ onGoHome, onOpenConsultModal }) {
  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '900px' }}>
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

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-pill" style={{ margin: '0 auto 16px' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>시흥 정왕동 최고 시설의 어르신 주간보호센터</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          11재활통합주간보호센터
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
          어르신의 신체 재활과 인지 회복을 최우선으로, <br />
          매일 웃음과 활력이 넘치는 행복한 하루를 선물해 드립니다.
        </p>
      </div>

      {/* Center Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Award size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>맞춤형 신체·보행 재활</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            바디스파이더, 슬링, 워커 등 최신 재활 기구를 갖추고 전문 물리치료 및 개별 기능 강화 운동을 매일 체계적으로 진행합니다.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <HeartPulse size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>두뇌 활력 인지 프로그램</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            미술치료, 음악회상, 원예활동, 실버 레크리에이션 등 치매 예방과 정서적 안정을 돕는 다채로운 프로그램을 운영합니다.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Car size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>안심 도어-투-도어 송영</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            시흥 전 지역 및 인근 지역까지 안전 요원이 동승한 전용 셔틀 차량으로 자택 앞까지 편안하고 안전하게 모셔옵니다.
          </p>
        </div>
      </div>

      {/* Facility & Location Info */}
      <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>센터 상세 안내 & 위치</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={18} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>위치 주소: </strong>
              <span>경기도 시흥시 정왕동 중심상가 인근 (11재활통합주간보호센터)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Clock size={18} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>이용 시간: </strong>
              <span>월요일 ~ 토요일 (오전 08:30 ~ 오후 17:30 / 맞춤형 시간 조율 가능)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Phone size={18} style={{ color: 'var(--accent-primary)', marginTop: '3px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>상담 및 입소 문의: </strong>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>010-8963-5166</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://map.naver.com/p/entry/place/1481968614?c=15.00,0,0,0,dh"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ padding: '10px 20px', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            <MapPin size={16} />
            <span>네이버 지도에서 위치 보기</span>
          </a>

          <button
            onClick={onOpenConsultModal}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <Phone size={16} />
            <span>무료 등급 신청 상담하기</span>
          </button>
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
