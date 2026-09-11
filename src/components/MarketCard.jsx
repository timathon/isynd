import React from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, Info } from 'lucide-react';

export default function MarketCard({ item, onClick }) {
  const isPositive = item.change > 0;
  const isNegative = item.change < 0;
  const isNeutral = item.change === 0 || item.change === null;

  const trendClass = isPositive ? 'is-up' : isNegative ? 'is-down' : 'is-neutral';
  const badgeClass = isPositive ? 'up' : isNegative ? 'down' : 'neutral';

  const formatPrice = (val, symbol) => {
    if (val === null || val === undefined) return '--.--';
    if (symbol && symbol.includes('VNINDEX')) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (val) => {
    if (val === null || val === undefined) return '0.00';
    const prefix = val > 0 ? '+' : '';
    return `${prefix}${val.toFixed(2)}`;
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined) return '0.00%';
    const prefix = val > 0 ? '+' : '';
    return `${prefix}${val.toFixed(2)}%`;
  };

  return (
    <div className={`market-card ${trendClass}`} onClick={() => onClick(item)} role="button" tabIndex={0}>
      <div>
        <div className="card-top">
          <div className="card-badge-group">
            <span className="category-tag">{item.category}</span>
            <span className="card-symbol">{item.symbol}</span>
          </div>
          <div className="inspect-pill" title="Click to view data source">
            <Info size={13} />
            <span>Source</span>
          </div>
        </div>

        <h3 className="card-title">{item.displayName}</h3>
        <p className="card-desc">{item.description}</p>
      </div>

      <div>
        <div className="card-price-row">
          <div className="card-price">
            {formatPrice(item.price, item.symbol)}
            <span className="card-unit">{item.unit || item.currency}</span>
          </div>

          <div className={`change-badge ${badgeClass}`}>
            {isPositive && <TrendingUp size={14} />}
            {isNegative && <TrendingDown size={14} />}
            {isNeutral && <Minus size={14} />}
            <span>{formatPercent(item.changePercent)}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="source-label">
            <span>vs Prev Day: {formatChange(item.change)}</span>
          </div>
          <div className="source-label" style={{ color: 'var(--text-muted)' }}>
            <span>Source: {item.source?.provider ? item.source.provider.split('/')[0].trim() : 'Live Feed'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
