import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MarketCard from './components/MarketCard';
import SourceModal from './components/SourceModal';
import NewsSection from './components/NewsSection';
import { fetchMarketData } from './services/marketApi';
import { TrendingUp, BarChart2, ShieldCheck, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All Assets', 'Commodities', 'Asian Indices', 'US Futures'];

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMarketData();
      if (data && data.items) {
        setItems(data.items);
        setLastUpdated(data.timestamp);
      }
    } catch (err) {
      console.error('Failed to load market data', err);
      setError('Unable to fetch latest market data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load only occurs on page mount / refresh as requested
  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = selectedCategory === 'All Assets'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="app-container">
      <Header 
        lastUpdated={lastUpdated} 
        onRefresh={loadData} 
        loading={loading} 
      />

      <main>
        {/* Section Header */}
        <div className="section-head">
          <div>
            <h2 className="section-title">
              <TrendingUp size={22} style={{ color: 'var(--accent-indigo)' }} />
              Financial Market Benchmarks
            </h2>
            <p className="section-hint">
              Quotes & change % calculated against the previous trading day. Click any asset card to inspect the origin data source.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market Data Grid */}
        {error && (
          <div className="status-pill" style={{ borderColor: 'var(--down-border)', color: 'var(--down-color)', marginBottom: '20px' }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="loading-box">
            <div className="status-dot" style={{ width: '12px', height: '12px' }}></div>
            <p>Gathering latest market benchmarks from internet feeds...</p>
          </div>
        ) : (
          <div className="market-grid">
            {filteredItems.map(item => (
              <MarketCard 
                key={item.id} 
                item={item} 
                onClick={setSelectedItem} 
              />
            ))}
          </div>
        )}

        {/* Modular Multi-Realm News Section */}
        <NewsSection />
      </main>

      {/* Source Detail Modal on Card Click */}
      {selectedItem && (
        <SourceModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
