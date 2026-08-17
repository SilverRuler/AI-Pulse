import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, Heart, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

export default function ReaderModal({ issue, onClose, onShare }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tag accent">Issue #{issue.issueNumber}</span>
            <span className="tag">{issue.categoryName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onShare(issue)}
              className="icon-button"
              title="공유하기"
            >
              <Share2 size={16} />
            </button>
            <button onClick={onClose} className="icon-button" title="닫기">
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
            <span>AI Daily Briefing</span>
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
