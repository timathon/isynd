// Cloudflare Pages Function: /api/market
// Handles market data aggregation for WTI, XAU, VNI, and US Stock Indices

const SYMBOL_MAP = {
  'ES': { ySymbol: 'ES=F', name: 'S&P Futures', category: 'US Futures', unit: 'USD Pts', desc: 'E-mini S&P 500 Active Futures Contract' },
  'YM': { ySymbol: 'YM=F', name: 'Dow Futures', category: 'US Futures', unit: 'USD Pts', desc: 'E-mini Dow ($5) Active Futures Contract' },
  'NQ': { ySymbol: 'NQ=F', name: 'Nasdaq Futures', category: 'US Futures', unit: 'USD Pts', desc: 'E-mini Nasdaq 100 Active Futures Contract' },
  'WTI': { ySymbol: 'CL=F', name: 'WTI Crude Oil Futures', category: 'Commodities', unit: 'USD/bbl', desc: 'Light Sweet Crude Oil Active Futures Contract' },
  'XAU': { ySymbol: 'GC=F', altSymbol: 'GC=F', name: 'Gold Futures (GC)', category: 'Commodities', unit: 'USD/t.oz', desc: 'Gold COMEX Active Month Futures Contract' },
  'VNI': { ySymbol: '^VNINDEX.VN', name: 'VN-Index (Vietnam)', category: 'Asian Indices', unit: 'VND Pts', desc: 'Ho Chi Minh Stock Exchange Composite Index' }
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=30, s-maxage=60'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const symbolsList = Object.values(SYMBOL_MAP).map(item => item.ySymbol).join(',');
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsList)}`;

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream Yahoo Finance API responded with status ${response.status}`);
    }

    const data = await response.json();
    const quotes = data?.quoteResponse?.result || [];

    const quoteMap = {};
    quotes.forEach(q => {
      quoteMap[q.symbol] = q;
    });

    const results = Object.entries(SYMBOL_MAP).map(([key, meta]) => {
      const q = quoteMap[meta.ySymbol] || {};
      const regularMarketPrice = q.regularMarketPrice ?? null;
      const regularMarketPreviousClose = q.regularMarketPreviousClose ?? null;
      const regularMarketChange = q.regularMarketChange ?? (regularMarketPrice !== null && regularMarketPreviousClose !== null ? regularMarketPrice - regularMarketPreviousClose : null);
      const regularMarketChangePercent = q.regularMarketChangePercent ?? (regularMarketPrice !== null && regularMarketPreviousClose !== null && regularMarketPreviousClose !== 0 ? ((regularMarketPrice - regularMarketPreviousClose) / regularMarketPreviousClose) * 100 : null);

      return {
        id: key,
        symbol: meta.ySymbol,
        displayName: meta.name,
        category: meta.category,
        unit: meta.unit,
        description: meta.desc,
        price: regularMarketPrice,
        prevClose: regularMarketPreviousClose,
        change: regularMarketChange,
        changePercent: regularMarketChangePercent,
        dayHigh: q.regularMarketDayHigh ?? null,
        dayLow: q.regularMarketDayLow ?? null,
        fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
        currency: q.currency || 'USD',
        marketState: q.marketState || 'REGULAR',
        exchange: q.exchange || q.fullExchangeName || 'Global',
        lastUpdatedTime: q.regularMarketTime ? new Date(q.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
        source: {
          provider: 'Yahoo Finance Market Data Engine',
          feed: `Yahoo Finance Quote API [${meta.ySymbol}]`,
          endpoint: `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(meta.ySymbol)}`,
          portalUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(meta.ySymbol)}`,
          attribution: 'Public Market Data Feeds & Exchanges (CME, NYMEX, HOSE, NYSE, NASDAQ)'
        }
      };
    });

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      items: results
    }), { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch market data',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
