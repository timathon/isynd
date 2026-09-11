import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Database, Copy, Check, ShieldCheck, Clock, Layers } from 'lucide-react';

export default function SourceModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleCopyEndpoint = () => {
    if (item.source?.endpoint) {
      navigator.clipboard.writeText(item.source.endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Database size={20} style={{ color: 'var(--accent-indigo)' }} />
            Data Source & Metadata
          </h2>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>
              {item.displayName} ({item.symbol})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {item.description}
            </p>
          </div>

          <div className="detail-section-title">Trading Metrics & Benchmark</div>
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-label">Latest Price</div>
              <div className="metric-val">{item.price !== null ? item.price.toLocaleString() : 'N/A'} {item.unit}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Previous Close (Prior Trade Day)</div>
              <div className="metric-val">{item.prevClose !== null ? item.prevClose.toLocaleString() : 'N/A'} {item.unit}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Day High / Low</div>
              <div className="metric-val">
                {item.dayHigh ? item.dayHigh.toLocaleString() : '--'} / {item.dayLow ? item.dayLow.toLocaleString() : '--'}
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Market State / Exchange</div>
              <div className="metric-val" style={{ fontSize: '0.92rem' }}>
                {item.marketState || 'REGULAR'} ({item.exchange || 'Global'})
              </div>
            </div>
          </div>

          <div className="detail-section-title">Source Provenance & Internet Feed</div>
          <div className="source-box">
            <div className="source-row">
              <span className="source-key">Primary Provider / Publisher:</span>
              <span className="source-val" style={{ color: '#67e8f9' }}>
                {item.source?.provider || 'Global Financial Feed'}
              </span>
            </div>

            <div className="source-row">
              <span className="source-key">Origin Feed & Ticker:</span>
              <span className="source-val">
                {item.source?.feed || item.symbol}
              </span>
            </div>

            <div className="source-row">
              <span className="source-key">Exchange Attribution:</span>
              <span className="source-val" style={{ color: '#a5b4fc' }}>
                {item.source?.attribution || 'Licensed Financial Exchanges'}
              </span>
            </div>

            <div className="source-row">
              <span className="source-key">Raw Upstream Endpoint:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                <span className="source-val" style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', flex: 1, fontSize: '0.75rem' }}>
                  {item.source?.endpoint || 'N/A'}
                </span>
                {item.source?.endpoint && (
                  <button 
                    onClick={handleCopyEndpoint} 
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: copied ? '#10b981' : 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    title="Copy API Endpoint"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>

            {item.source?.portalUrl && (
              <div className="source-row" style={{ marginTop: '10px' }}>
                <a 
                  href={item.source.portalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="source-link"
                >
                  <span>Verify on Yahoo Finance Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>Last fetched from internet: {new Date(item.lastUpdatedTime || Date.now()).toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-action" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
