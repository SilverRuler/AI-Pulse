import React from 'react';
import { Sparkles, Calendar, Clock, ArrowRight, CheckCircle2, Eye, Heart } from 'lucide-react';

export default function FeaturedIssue({ issue, onOpenReader }) {
  if (!issue) return null;

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-label">
          <div className="section-title">
            <Sparkles size={20} style={{ color: '#a855f7' }} />
            <span>오늘의 AI 큐레이션 (Featured Issue)</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {issue.date} 발행 • Issue #{issue.issueNumber}
          </span>
        </div>

        <div className="featured-card" onClick={() => onOpenReader(issue)}>
          <div className="featured-header">
            <div className="tag-list">
              <span className="tag accent">🔥 HOT TOPIC</span>
              <span className="tag">{issue.categoryName}</span>
            </div>
            <div className="meta-info">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> {issue.readTime}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={14} /> {issue.views}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Heart size={14} style={{ color: '#ec4899' }} /> {issue.likes}
              </span>
            </div>
          </div>

          <h2 className="featured-heading">{issue.title}</h2>

          <ul className="featured-bullets">
            {issue.bullets.map((bullet, idx) => (
              <li key={idx}>
                <CheckCircle2 size={18} className="bullet-icon" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="featured-footer">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              AI 요약 + 원문 출처 포함
            </span>
            <button className="read-more-btn" type="button">
              <span>전문 읽기</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
