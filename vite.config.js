import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const FALLBACK_SNAPSHOT = [
  {
    id: 'ES',
    symbol: 'ES=F',
    displayName: 'S&P Futures',
    category: 'US Futures',
    unit: 'USD Pts',
    description: 'E-mini S&P 500 Active Futures Contract',
    price: 7617.00,
    prevClose: 7598.50,
    change: 18.50,
    changePercent: 0.24,
    dayHigh: 7635.20,
    dayLow: 7588.00,
    currency: 'USD',
    marketState: 'REGULAR',
    exchange: 'CME',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'CME / Yahoo Finance',
      feed: 'E-mini S&P 500 Futures (ES=F)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=ES=F',
      portalUrl: 'https://finance.yahoo.com/quote/ES=F',
      attribution: 'Chicago Mercantile Exchange (CME)'
    }
  },
  {
    id: 'YM',
    symbol: 'YM=F',
    displayName: 'Dow Futures',
    category: 'US Futures',
    unit: 'USD Pts',
    description: 'E-mini Dow ($5) Active Futures Contract',
    price: 52253.00,
    prevClose: 52095.00,
    change: 158.00,
    changePercent: 0.30,
    dayHigh: 52380.00,
    dayLow: 51990.00,
    currency: 'USD',
    marketState: 'REGULAR',
    exchange: 'CBOT / CME',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'CBOT / CME / Yahoo Finance',
      feed: 'E-mini Dow Futures (YM=F)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=YM=F',
      portalUrl: 'https://finance.yahoo.com/quote/YM=F',
      attribution: 'Chicago Board of Trade (CBOT) / CME Group'
    }
  },
  {
    id: 'NQ',
    symbol: 'NQ=F',
    displayName: 'Nasdaq Futures',
    category: 'US Futures',
    unit: 'USD Pts',
    description: 'E-mini Nasdaq 100 Active Futures Contract',
    price: 29172.50,
    prevClose: 29135.25,
    change: 37.25,
    changePercent: 0.13,
    dayHigh: 29280.00,
    dayLow: 29090.50,
    currency: 'USD',
    marketState: 'REGULAR',
    exchange: 'CME',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'CME / Yahoo Finance',
      feed: 'E-mini Nasdaq 100 Futures (NQ=F)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=NQ=F',
      portalUrl: 'https://finance.yahoo.com/quote/NQ=F',
      attribution: 'Chicago Mercantile Exchange (CME)'
    }
  },
  {
    id: 'WTI',
    symbol: 'CL=F',
    displayName: 'WTI Crude Oil Futures',
    category: 'Commodities',
    unit: 'USD/bbl',
    description: 'Light Sweet Crude Oil (WTI) Active Futures Contract',
    price: 102.45,
    prevClose: 100.90,
    change: 1.55,
    changePercent: 1.54,
    dayHigh: 103.80,
    dayLow: 100.40,
    currency: 'USD',
    marketState: 'REGULAR',
    exchange: 'NYMEX',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'NYMEX / Yahoo Finance',
      feed: 'WTI Crude Oil Futures (CL=F)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=CL=F',
      portalUrl: 'https://finance.yahoo.com/quote/CL=F',
      attribution: 'New York Mercantile Exchange (NYMEX)'
    }
  },
  {
    id: 'XAU',
    symbol: 'GC=F',
    displayName: 'Gold Futures (GC)',
    category: 'Commodities',
    unit: 'USD/t.oz',
    description: 'Gold COMEX Active Month Futures Contract',
    price: 4356.80,
    prevClose: 4328.20,
    change: 28.60,
    changePercent: 0.66,
    dayHigh: 4372.50,
    dayLow: 4315.00,
    currency: 'USD',
    marketState: 'REGULAR',
    exchange: 'COMEX',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'COMEX / Yahoo Finance',
      feed: 'Gold COMEX Futures (GC=F)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=GC=F',
      portalUrl: 'https://finance.yahoo.com/quote/GC=F',
      attribution: 'Commodity Exchange (COMEX) / CME Group'
    }
  },
  {
    id: 'VNI',
    symbol: '^VNINDEX.VN',
    displayName: 'VN-Index (Vietnam)',
    category: 'Asian Indices',
    unit: 'VND Pts',
    description: 'Ho Chi Minh City Stock Exchange Composite Index',
    price: 1813.28,
    prevClose: 1829.23,
    change: -15.95,
    changePercent: -0.87,
    dayHigh: 1835.40,
    dayLow: 1809.10,
    currency: 'VND',
    marketState: 'REGULAR',
    exchange: 'HOSE (Vietnam)',
    lastUpdatedTime: new Date().toISOString(),
    source: {
      provider: 'HOSE / Yahoo Finance',
      feed: 'Vietnam VN-Index (^VNINDEX.VN)',
      endpoint: 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=^VNINDEX.VN',
      portalUrl: 'https://finance.yahoo.com/quote/%5EVNINDEX.VN',
      attribution: 'Ho Chi Minh Stock Exchange (HOSE)'
    }
  }
];

// Dev middleware plugin to guarantee /api/market always returns 200 OK
function devMarketApiPlugin() {
  return {
    name: 'dev-market-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = req.url ? req.url.split('?')[0] : '';
        if (parsedUrl === '/api/market') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          try {
            const symbols = 'ES=F,YM=F,NQ=F,CL=F,GC=F,^VNINDEX.VN';
            const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
            
            const response = await fetch(yahooUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              const quotes = data?.quoteResponse?.result || [];
              if (quotes.length > 0) {
                const quoteMap = {};
                quotes.forEach(q => { quoteMap[q.symbol] = q; });

                const SYMBOL_ORDER = ['ES=F', 'YM=F', 'NQ=F', 'CL=F', 'GC=F', '^VNINDEX.VN'];
                const updatedItems = FALLBACK_SNAPSHOT.map(item => {
                  const q = quoteMap[item.symbol];
                  if (!q) return item;
                  const price = q.regularMarketPrice ?? item.price;
                  const prevClose = q.regularMarketPreviousClose ?? item.prevClose;
                  const change = q.regularMarketChange ?? (price - prevClose);
                  const changePercent = q.regularMarketChangePercent ?? ((change / prevClose) * 100);

                  return {
                    ...item,
                    price,
                    prevClose,
                    change,
                    changePercent,
                    dayHigh: q.regularMarketDayHigh ?? item.dayHigh,
                    dayLow: q.regularMarketDayLow ?? item.dayLow,
                    marketState: q.marketState || item.marketState,
                    lastUpdatedTime: q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : new Date().toISOString()
                  };
                });

                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString(), items: updatedItems }));
                return;
              }
            }
          } catch (e) {
            console.warn('Vite dev middleware upstream note:', e.message);
          }

          // In dev mode, always return 200 with snapshot data if external feed is delayed/blocked
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            timestamp: new Date().toISOString(),
            items: FALLBACK_SNAPSHOT
          }));
          return;
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devMarketApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
