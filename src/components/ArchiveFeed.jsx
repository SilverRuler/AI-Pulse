import React, { useState, useEffect } from 'react';
import { Archive, Clock, Search, Heart, Eye, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { categories } from '../data/newsletters';

export default function ArchiveFeed({
  newsletters = [],
  onOpenReader,
  isFullPage = false,
  onGoHome,
  activeCategory = 'all',
  onSelectCategory,
  userLikes = [],
  onToggleLike
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = activeCategory || 'all';

  const handleTabClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  // Precise category filter logic
  const filteredNewsletters = newsletters.filter((item) => {
    let matchesCategory = false;
    if (currentCategory === 'all') {
      matchesCategory = true;
    } else if (currentCategory === 'care') {
      matchesCategory = item.category === 'care' || item.categoryName?.includes('돌봄');
    } else if (currentCategory === 'nursing') {
      matchesCategory = item.category === 'nursing' || item.categoryName?.includes('요양');
    } else if (currentCategory === 'info') {
      matchesCategory = item.category === 'info' || item.categoryName?.includes('정보');
    } else if (currentCategory === 'health') {
      matchesCategory = item.category === 'health' || item.categoryName?.includes('건강');
    } else if (currentCategory === 'policy') {
      matchesCategory = item.category === 'policy' || item.categoryName?.includes('정책') || item.categoryName?.includes('복지');
    } else {
      matchesCategory = item.category === currentCategory || item.categoryName === currentCategory;
    }

    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Limit 12 (3x4) on Home page, Full on Archive page
  const displayedNewsletters = isFullPage ? filteredNewsletters : filteredNewsletters.slice(0, 12);
  const showMoreButton = !isFullPage && newsletters.length > 12;

  return (
    <section id="archive" style={{ marginBottom: isFullPage ? '40px' : '80px', padding: isFullPage ? '40px 0 80px' : '0' }}>
      <div className="container">
        {/* Full page header with Back button */}
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

        {/* Category Filters */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`filter-btn ${currentCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Archive Cards Grid (3x4 = 12 on home, full on archive view) */}
        <div className="archive-grid">
          {displayedNewsletters.length > 0 ? (
            displayedNewsletters.map((item) => {
              const isLiked = userLikes.includes(item.id);
              return (
                <article key={item.id} className="archive-card" onClick={() => onOpenReader(item)}>
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
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px',
                        }}
                        title={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        <Heart
                          size={24}
                          style={{
                            color: '#ef4444',
                            fill: isLiked ? '#ef4444' : 'rgba(239, 68, 68, 0.1)',
                            stroke: '#ef4444',
                            strokeWidth: 1.5,
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            color: isLiked ? '#ffffff' : '#ef4444',
                            pointerEvents: 'none',
                            marginTop: '-1px'
                          }}
                        >
                          {item.likes > 99 ? '99+' : item.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem', marginBottom: '12px' }}>
                선택하신 <strong>'{categories.find((c) => c.id === currentCategory)?.name || currentCategory}'</strong> 카테고리에 등록된 기사가 없습니다.
              </p>
              <button
                onClick={() => handleTabClick('all')}
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
              onClick={() => {
                window.location.hash = '#archive';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
