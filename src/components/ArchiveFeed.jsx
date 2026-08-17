import React, { useState } from 'react';
import { Archive, Clock, Search, BookOpen, Heart, Eye } from 'lucide-react';
import { categories } from '../data/newsletters';

export default function ArchiveFeed({ newsletters, onOpenReader }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNewsletters = newsletters.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="archive" style={{ marginBottom: '80px' }}>
      <div className="container">
        <div className="section-label" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div className="section-title">
            <Archive size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>지난 뉴스레터 아카이브</span>
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
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Archive Cards Grid */}
        <div className="archive-grid">
          {filteredNewsletters.length > 0 ? (
            filteredNewsletters.map((item) => (
              <article key={item.id} className="archive-card" onClick={() => onOpenReader(item)}>
                <div className="archive-card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="tag">{item.categoryName}</span>
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} /> {item.views}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={13} style={{ color: '#ec4899' }} /> {item.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              검색 조건에 해당하는 뉴스레터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
