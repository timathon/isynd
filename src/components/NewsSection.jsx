import React, { useState } from 'react';
import { Newspaper, ExternalLink, Globe, Sparkles, Compass } from 'lucide-react';

const REALMS = [
  { id: 'all', label: 'All Realms' },
  { id: 'macro', label: 'Global Macro' },
  { id: 'commodities', label: 'Energy & Metals' },
  { id: 'asia', label: 'Asian Markets' },
  { id: 'tech', label: 'US Tech & Indices' }
];

const INITIAL_NEWS = [
  {
    id: 1,
    realm: 'commodities',
    realmLabel: 'Energy & Metals',
    title: 'Crude Oil Benchmarks Fluctuate Amid OPEC+ Production Policy Adjustments',
    snippet: 'WTI and Brent futures steady as traders evaluate global inventory draws and shifting output trajectories.',
    source: 'Reuters / Energy Intelligence',
    time: '2 hours ago',
    url: 'https://finance.yahoo.com/topic/oil-energy'
  },
  {
    id: 2,
    realm: 'macro',
    realmLabel: 'Global Macro',
    title: 'Central Banks Gauge Inflation Trends & Rate Trajectory Ahead of Next Policy Meet',
    snippet: 'Treasury yields and currency indices recalibrate as market participants price in rate-cut probabilities.',
    source: 'Bloomberg / Federal Reserve Feeds',
    time: '3 hours ago',
    url: 'https://finance.yahoo.com/news'
  },
  {
    id: 3,
    realm: 'asia',
    realmLabel: 'Asian Markets',
    title: 'Vietnam VN-Index Consolidates Around Key Resistance with Strong Domestic Inflows',
    snippet: 'Banking and manufacturing tickers lead Ho Chi Minh City trading volume with heightened foreign portfolio interest.',
    source: 'VnExpress International / HOSE',
    time: '4 hours ago',
    url: 'https://finance.yahoo.com/quote/%5EVNINDEX.VN'
  },
  {
    id: 4,
    realm: 'tech',
    realmLabel: 'US Tech & Indices',
    title: 'Wall Street Indices Buoyed by AI Hardware Demand and Enterprise Cloud Growth',
    snippet: 'S&P 500 and NASDAQ maintain steady momentum as mega-cap tech earnings reinforce digital infrastructure expansion.',
    source: 'MarketWatch / WSJ',
    time: '5 hours ago',
    url: 'https://finance.yahoo.com/quote/%5EIXIC'
  }
];

export default function NewsSection() {
  const [selectedRealm, setSelectedRealm] = useState('all');

  const filteredNews = selectedRealm === 'all'
    ? INITIAL_NEWS
    : INITIAL_NEWS.filter(item => item.realm === selectedRealm);

  return (
    <section className="news-section-wrap">
      <div className="news-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Newspaper size={20} style={{ color: 'var(--accent-cyan)' }} />
            Multi-Realm Internet Feeds
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Categorized market intelligence gathered across international news realms
          </p>
        </div>

        <div className="realm-tabs">
          {REALMS.map(realm => (
            <button
              key={realm.id}
              className={`realm-tab ${selectedRealm === realm.id ? 'active' : ''}`}
              onClick={() => setSelectedRealm(realm.id)}
            >
              {realm.label}
            </button>
          ))}
        </div>
      </div>

      <div className="news-grid">
        {filteredNews.map(item => (
          <article key={item.id} className="news-card">
            <div>
              <div className="news-card-meta">
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.realmLabel}</span>
                <span>{item.time}</span>
              </div>
              <h4 className="news-card-title">{item.title}</h4>
              <p className="news-card-snippet">{item.snippet}</p>
            </div>

            <div className="news-card-footer">
              <span>Source: {item.source}</span>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}
              >
                <span>Read</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
