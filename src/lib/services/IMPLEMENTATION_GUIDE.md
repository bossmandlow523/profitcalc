# Market Data API Implementation Guide

This guide explains how to implement real market data APIs to replace the mock server.

## Table of Contents

1. [API Options](#api-options)
2. [Implementation Examples](#implementation-examples)
3. [Usage in Components](#usage-in-components)
4. [Backend Server Setup](#backend-server-setup)
5. [Rate Limiting & Caching](#rate-limiting--caching)

---

## API Options

### 1. Yahoo Finance (Recommended for Free Usage)

**Pros:**
- Free, no API key required
- Real-time stock prices
- Options chain data
- Historical data

**Cons:**
- Unofficial API (web scraping)
- Can be rate-limited
- No official support

**Libraries:**
- `yahoo-finance2` (Node.js)
- `yfinance` (Python)

### 2. Alpha Vantage

**Pros:**
- Official API with free tier
- 5 API requests per minute (free)
- 500 requests per day (free)
- Good documentation

**Cons:**
- Limited free tier
- No options chain in free tier

**Get API Key:** https://www.alphavantage.co/support/#api-key

### 3. Polygon.io

**Pros:**
- Excellent options data
- WebSocket support
- Good free tier

**Cons:**
- Options data requires paid plan
- Complex API structure

**Get API Key:** https://polygon.io

### 4. IEX Cloud

**Pros:**
- Clean REST API
- Good free tier
- Official support

**Cons:**
- Limited options data
- Credits-based pricing

**Get API Key:** https://iexcloud.io

### 5. TD Ameritrade API

**Pros:**
- Completely free with account
- Full options chain data
- Real-time quotes
- No rate limits

**Cons:**
- Requires TD Ameritrade account
- OAuth authentication required

**Get API Key:** https://developer.tdameritrade.com

---

## Implementation Examples

### Yahoo Finance Implementation (Node.js Backend)

```typescript
// backend/services/yahoo-finance-service.ts
import yahooFinance from 'yahoo-finance2';

export async function getStockQuote(symbol: string) {
  const quote = await yahooFinance.quote(symbol);

  return {
    symbol: quote.symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    volume: quote.regularMarketVolume,
    marketCap: quote.marketCap,
    high52Week: quote.fiftyTwoWeekHigh,
    low52Week: quote.fiftyTwoWeekLow,
    previousClose: quote.regularMarketPreviousClose,
    timestamp: new Date(quote.regularMarketTime * 1000),
  };
}

export async function getOptionsChain(symbol: string, expiryDate?: string) {
  const options = await yahooFinance.options(symbol, {
    date: expiryDate ? new Date(expiryDate) : undefined,
  });

  return {
    underlying: symbol,
    underlyingPrice: options.underlyingSymbol?.regularMarketPrice || 0,
    timestamp: new Date(),
    expiryDates: options.expirationDates.map(d =>
      new Date(d * 1000).toISOString().split('T')[0]
    ),
    strikes: options.strikes,
    calls: options.calls.map(convertYahooOption),
    puts: options.puts.map(convertYahooOption),
  };
}

function convertYahooOption(opt: any) {
  return {
    symbol: opt.contractSymbol,
    underlying: opt.underlyingSymbol,
    strikePrice: opt.strike,
    expiryDate: new Date(opt.expiration * 1000).toISOString().split('T')[0],
    optionType: opt.optionType === 'call' ? 'call' : 'put',
    bid: opt.bid,
    ask: opt.ask,
    lastPrice: opt.lastPrice,
    mark: (opt.bid + opt.ask) / 2,
    volume: opt.volume,
    openInterest: opt.openInterest,
    impliedVolatility: opt.impliedVolatility,
    inTheMoney: opt.inTheMoney,
    intrinsicValue: opt.intrinsicValue,
    extrinsicValue: opt.extrinsicValue,
    timestamp: new Date(),
  };
}
```

### Alpha Vantage Implementation

```typescript
// backend/services/alpha-vantage-service.ts
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function getStockQuote(symbol: string) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  const quote = data['Global Quote'];

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    volume: parseInt(quote['06. volume']),
    previousClose: parseFloat(quote['08. previous close']),
    timestamp: new Date(quote['07. latest trading day']),
  };
}
```

### TD Ameritrade Implementation

```typescript
// backend/services/td-ameritrade-service.ts
const API_KEY = process.env.TD_AMERITRADE_API_KEY;

export async function getOptionsChain(symbol: string, expiryDate?: string) {
  const params = new URLSearchParams({
    apikey: API_KEY,
    symbol: symbol,
    contractType: 'ALL',
    includeQuotes: 'TRUE',
    ...(expiryDate && { fromDate: expiryDate, toDate: expiryDate }),
  });

  const url = `https://api.tdameritrade.com/v1/marketdata/chains?${params}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    underlying: data.symbol,
    underlyingPrice: data.underlyingPrice,
    timestamp: new Date(),
    expiryDates: extractExpiryDates(data),
    strikes: extractStrikes(data),
    calls: convertTDOptions(data.callExpDateMap),
    puts: convertTDOptions(data.putExpDateMap),
  };
}
```

---

## Usage in Components

### Using React Hooks

```tsx
import { useStockPrice, useOptionsChain, useExpiryDates } from '@/lib/hooks/use-market-data';

function OptionsCalculator() {
  const [symbol, setSymbol] = useState('AAPL');

  // Fetch stock price
  const { data: stockData, isLoading: loadingStock } = useStockPrice(
    { symbol },
    true // auto-fetch
  );

  // Fetch expiry dates
  const { data: expiryData, isLoading: loadingExpiries } = useExpiryDates(
    { symbol, includeWeeklies: true, includeMonthlies: true },
    true
  );

  // Fetch options chain
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);
  const { data: optionsData, isLoading: loadingOptions } = useOptionsChain(
    selectedExpiry ? { symbol, expiryDate: selectedExpiry, includeGreeks: true } : null,
    true
  );

  return (
    <div>
      <h2>{symbol} - ${stockData?.price}</h2>

      {expiryData?.expiryDates.map(expiry => (
        <button key={expiry.date} onClick={() => setSelectedExpiry(expiry.date)}>
          {expiry.date}
        </button>
      ))}

      {optionsData?.calls.map(call => (
        <div key={call.symbol}>
          Strike: ${call.strikePrice} | Premium: ${call.mark}
        </div>
      ))}
    </div>
  );
}
```

### Using Zustand Store

```tsx
import { useMarketDataStore } from '@/lib/store/market-data-store';

function OptionsCalculator() {
  const {
    stockQuote,
    optionsChain,
    expiryDates,
    fetchStockQuote,
    fetchOptionsChain,
    fetchExpiryDates,
    setSelectedExpiryDate,
  } = useMarketDataStore();

  useEffect(() => {
    fetchStockQuote('AAPL');
    fetchExpiryDates('AAPL');
  }, []);

  const handleExpirySelect = (date: string) => {
    setSelectedExpiryDate(date);
    // This will automatically fetch the options chain
  };

  return (
    <div>
      {stockQuote.isLoading && <p>Loading...</p>}
      {stockQuote.data && (
        <h2>{stockQuote.data.symbol} - ${stockQuote.data.price}</h2>
      )}
    </div>
  );
}
```

---

## Backend Server Setup

### Express.js Backend Example

```typescript
// backend/server.ts
import express from 'express';
import cors from 'cors';
import { getStockQuote, getOptionsChain, getExpiryDates } from './services/yahoo-finance-service';

const app = express();

app.use(cors());
app.use(express.json());

// Stock quote endpoint
app.get('/api/stocks/:symbol/quote', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockQuote(symbol);

    res.json({
      data,
      status: 'success',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

// Options chain endpoint
app.get('/api/options/:symbol/chain', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { expiryDate } = req.query;

    const data = await getOptionsChain(symbol, expiryDate as string);

    res.json({
      data,
      status: 'success',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

// Expiry dates endpoint
app.get('/api/options/:symbol/expiries', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getExpiryDates(symbol);

    res.json({
      data,
      status: 'success',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      status: 'error',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});
```

### Update Frontend Config

```typescript
// src/lib/services/api-client.ts
export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  retryAttempts: 2,
  cacheEnabled: true,
  cacheDuration: 30000,
});
```

---

## Rate Limiting & Caching

### Backend Caching with Redis

```typescript
import Redis from 'ioredis';

const redis = new Redis();

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Save to cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage:
export async function getStockQuote(symbol: string) {
  return getCachedOrFetch(
    `stock:${symbol}`,
    () => fetchFromYahooFinance(symbol),
    30 // Cache for 30 seconds
  );
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

---

## Next Steps

1. Choose your API provider (recommend Yahoo Finance for free or TD Ameritrade for best data)
2. Set up a backend server (Express.js recommended)
3. Implement the API endpoints using the examples above
4. Update `api-client.ts` with your backend URL
5. Test with real data!

For development, you can continue using the mock server by not providing a backend URL.
