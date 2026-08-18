import React, { useState } from 'react';
import { Archive, Clock, Search, Heart, Eye, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { categories } from '../data/newsletters';

export default function ArchiveFeed({
  newsletters = [],
  onOpenReader,
  isFullPage = false,
  onGoHome,
  userLikes = [],
  onToggleLike
}) {
  // ArchiveFeed manages its OWN category state internally.
  // No dependency on parent for filtering -- avoids sync bugs entirely.
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter strictly by item.category field
  const filteredNewsletters = newsletters.filter((item) => {
    const matchesCategory = selectedTab === 'all' ? true : item.category === selectedTab;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const displayedNewsletters = isFullPage ? filteredNewsletters : filteredNewsletters.slice(0, 12);
  const showMoreButton = !isFullPage && filteredNewsletters.length > 12;

  return (
    <section id="archive" style={{ marginBottom: isFullPage ? '40px' : '80px', padding: isFullPage ? '40px 0 80px' : '0' }}>
      <div className="container">
        {isFullPage && (
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
        )}

        <div className="section-label" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div className="section-title">
            <Archive size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>
              {isFullPage ? '지난 뉴스레터 아카이브 전체보기' : '지난 뉴스레터 아카이브'}
            </span>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="뉴스레터 주제 검색..."
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px 8px 36px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedTab(cat.id)}
              className={`filter-btn ${selectedTab === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Archive Cards Grid */}
        <div className="archive-grid">
          {displayedNewsletters.length > 0 ? (
            displayedNewsletters.map((item, idx) => {
              const isLiked = userLikes.includes(item.id);
              return (
                <article key={`${item.id}-${idx}`} className="archive-card" onClick={() => onOpenReader(item)}>
                  <div className="archive-card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="tag accent" style={{ fontSize: '0.72rem' }}>Issue #{item.issueNumber}</span>
                        <span className="tag" style={{ fontSize: '0.72rem' }}>{item.categoryName}</span>
                      </div>
                      <span className="archive-date">{item.date}</span>
                    </div>
                    <h3 className="archive-title">{item.title}</h3>
                    <p className="archive-summary">{item.summary}</p>
                  </div>

                  <div className="archive-card-footer">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {item.readTime}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="조회수">
                        <Eye size={13} /> {item.views}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike && onToggleLike(item.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--text-muted)',
                          padding: 0,
                          fontSize: 'inherit'
                        }}
                        title={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        <Heart
                          size={13}
                          style={{
                            color: '#ef4444',
                            fill: isLiked ? '#ef4444' : 'none',
                            stroke: '#ef4444',
                            strokeWidth: 2,
                          }}
                        />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem', marginBottom: '12px' }}>
                선택하신 <strong>'{categories.find((c) => c.id === selectedTab)?.name || selectedTab}'</strong> 카테고리에 등록된 기사가 없습니다.
              </p>
              <button
                onClick={() => setSelectedTab('all')}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} />
                <span>전체 이슈 보기</span>
              </button>
            </div>
          )}
        </div>

        {/* Load More Button on Home page */}
        {showMoreButton && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => { window.location.hash = '#archive'; }}
              className="btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '0.98rem',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '2px solid var(--accent-primary)',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.12)',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              <span>지난 뉴스레터 아카이브 전체보기</span>
              <ArrowRight size={18} style={{ color: 'var(--accent-primary)' }} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
