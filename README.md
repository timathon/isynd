# Isynd - Internet Intelligence & Market Feeds

A high-performance market and news dashboard hosted on **Cloudflare Pages**.

## Key Features

- **Financial Market Benchmarks**:
  - **Commodities**: WTI Crude Oil Futures (`CL=F`), Gold COMEX Futures (`GC=F`)
  - **Asian Markets**: Vietnam VN-Index (`^VNINDEX.VN` / `HOSE`)
  - **US Futures**: S&P Futures (`ES=F`), Nasdaq Futures (`NQ=F`), Dow Futures (`YM=F`)
- **Daily Performance Metrics**: Latest price, nominal change, and percentage change calculated against the previous trading day.
- **Data Source Inspector**: Click any asset card to inspect the exact data provider, raw upstream endpoint, exchange attribution, and direct portal link.
- **Refresh Strategy**: Updates purely on page load/refresh, with a manual refresh control.
- **Cloudflare Pages Functions**: Serverless edge endpoint in `/functions/api/market.js` aggregating financial data without CORS limitations.
- **Multi-Realm News Feeds**: Categorized news feeds prepared across global macro, energy & metals, Asian markets, and US tech realms.

## Deployment on Cloudflare Pages

1. Connect your repository to **Cloudflare Pages**.
2. Set the build settings:
   - **Framework preset**: `Vite` (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
3. Cloudflare Pages will automatically deploy the frontend from `dist/` and attach the edge function from `/functions/api/market.js`.

## Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle
npm run build
```