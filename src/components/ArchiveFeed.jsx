import React, { useState, useEffect } from 'react';
import { Archive, Clock, Search, Heart, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { categories } from '../data/newsletters';

export default function ArchiveFeed({
  newsletters,
  onOpenReader,
  isFullPage = false,
  onGoHome,
  activeCategory,
  onSelectCategory,
  userLikes = [],
  onToggleLike
}) {
  const [currentCategory, setCurrentCategory] = useState(activeCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeCategory) {
      setCurrentCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleCategoryChange = (catId) => {
    setCurrentCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  // Robust Category & Search Filter
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
  const hasMore = !isFullPage && filteredNewsletters.length > 12;

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
              {isFullPage ? `지난 뉴스레터 아카이브 전체보기 (총 ${newsletters.length}개)` : '지난 뉴스레터 아카이브'}
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
              onClick={() => handleCategoryChange(cat.id)}
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: isLiked ? '#ec4899' : 'var(--text-muted)',
                          padding: 0,
                          fontSize: 'inherit'
                        }}
                        title={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        <Heart
                          size={13}
                          style={{
                            color: isLiked ? '#ec4899' : 'var(--text-muted)',
                            fill: isLiked ? '#ec4899' : 'none'
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
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              검색 조건에 해당하는 뉴스레터가 없습니다.
            </div>
          )}
        </div>

        {/* Load More Button on Home page if more than 12 articles */}
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <a
              href="#archive"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#archive';
              }}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '0.95rem',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-active)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>더 많은 지난 뉴스레터 전체보기 (+{filteredNewsletters.length - 12}개 더보기)</span>
              <ArrowRight size={16} style={{ color: 'var(--accent-primary)' }} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
