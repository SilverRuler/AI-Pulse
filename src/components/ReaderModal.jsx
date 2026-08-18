import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, Heart, Eye, ExternalLink, Sparkles } from 'lucide-react';

export default function ReaderModal({ issue, onClose, onShare, userLikes = [], onToggleLike }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  const isLiked = userLikes.includes(issue.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tag accent">Issue #{issue.issueNumber}</span>
            <span className="tag">{issue.categoryName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Like Button */}
            <button
              onClick={() => onToggleLike && onToggleLike(issue.id)}
              title={isLiked ? '좋아요 취소' : '좋아요'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: isLiked ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-subtle)',
                border: isLiked ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Heart
                size={15}
                style={{
                  color: '#ef4444',
                  fill: isLiked ? '#ef4444' : 'none',
                  stroke: '#ef4444',
                  strokeWidth: 2,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{issue.likes}</span>
            </button>

            {/* Share Deep-link Button */}
            <button
              onClick={() => onShare(issue)}
              className="icon-button"
              title="이 아티클 공유하기"
            >
              <Share2 size={16} />
            </button>

            <button onClick={onClose} className="icon-button" title="닫기" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <h1 className="article-title">{issue.title}</h1>

          <div className="article-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {issue.date}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> {issue.readTime}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} /> 조회수 {issue.views}
            </span>
          </div>

          {/* AI Executive Summary Callout */}
          {issue.content?.tldr && (
            <div className="article-callout">
              <h4>
                <Sparkles size={16} />
                <span>AI 3줄 핵심 요약 (TL;DR)</span>
              </h4>
              <p>{issue.content.tldr}</p>
            </div>
          )}

          {/* Article Main Sections */}
          {issue.content?.sections?.map((section, idx) => (
            <div key={idx} className="article-section">
              <h3>{section.heading}</h3>
              <p>{section.text}</p>
            </div>
          ))}

          {/* Sources */}
          {issue.content?.sources && (
            <div className="sources-box">
              <h4>참고 출처 및 원문 링크</h4>
              {issue.content.sources.map((source, sIdx) => (
                <div key={sIdx} className="source-item">
                  <span>{source.name}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="source-link"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>원문 보기</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
