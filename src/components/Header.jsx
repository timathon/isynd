import React from 'react';
import { RefreshCw, Activity, Layers } from 'lucide-react';

export default function Header({ lastUpdated, onRefresh, loading }) {
  const formattedTime = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Waiting for refresh';

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">
          <Layers size={24} />
        </div>
        <div className="brand-info">
          <h1>Isynd</h1>
          <p>Real-time internet feeds, global market benchmarks & aggregated intelligence</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="status-pill">
          <span className="status-dot"></span>
          <span>Last sync: {formattedTime}</span>
        </div>

        <button 
          className="btn-refresh" 
          onClick={onRefresh} 
          disabled={loading}
          title="Refresh market data"
        >
          <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          <span>{loading ? 'Fetching...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
}
