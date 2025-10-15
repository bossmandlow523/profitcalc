# Options Calculator API Infrastructure

A comprehensive API infrastructure for fetching stock prices, options chains, and expiry dates, modeled after the architecture found in the downloadsite analysis.

## 📁 File Structure

```
src/lib/
├── types/
│   └── market-data.ts          # API type definitions
├── services/
│   ├── api-client.ts           # Core API client with request management
│   ├── market-data-service.ts  # High-level market data service
│   └── IMPLEMENTATION_GUIDE.md # Detailed implementation guide
├── hooks/
│   └── use-market-data.ts      # React hooks for API calls
├── store/
│   ├── calculator-store.ts     # Existing calculator store
│   └── market-data-store.ts    # New market data store
└── mocks/
    └── mock-api-server.ts      # Mock server for development

src/components/examples/
└── MarketDataExample.tsx       # Usage examples
```

## 🚀 Quick Start

### 1. Using React Hooks (Component-level state)

```tsx
import { useStockPrice, useOptionsChain, useExpiryDates } from '@/lib/hooks/use-market-data';

function MyComponent() {
  const { data, isLoading, error, refetch } = useStockPrice(
    { symbol: 'AAPL' },
    true // auto-fetch
  );

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data && <p>{data.symbol}: ${data.price}</p>}
    </div>
  );
}
```

### 2. Using Zustand Store (Global state)

```tsx
import { useMarketDataStore } from '@/lib/store/market-data-store';

function MyComponent() {
  const {
    stockQuote,
    fetchStockQuote,
    optionsChain,
    fetchOptionsChain,
  } = useMarketDataStore();

  useEffect(() => {
    fetchStockQuote('AAPL');
  }, []);

  return (
    <div>
      {stockQuote.isLoading && <p>Loading...</p>}
      {stockQuote.data && <p>${stockQuote.data.price}</p>}
    </div>
  );
}
```

### 3. Direct Service Usage

```tsx
import { marketDataService } from '@/lib/services/market-data-service';

async function fetchData() {
  try {
    const response = await marketDataService.getStockPrice({ symbol: 'AAPL' });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

## 📚 Features

### ✅ Request Management
- **Duplicate detection** - Prevents identical requests within 1 second
- **Timeout handling** - Configurable timeouts per endpoint
  - `getStockPrice`: 15 seconds
  - `getOptionsChain`: 30 seconds
  - `calculate`: 30 seconds
- **Automatic retries** - Retries failed requests with exponential backoff
- **Request tracking** - Tracks all pending requests with status

### ✅ Caching
- **In-memory cache** - Reduces API calls
- **Configurable TTL** - Default 30 seconds
- **Cache invalidation** - Auto-cleanup of expired entries
- **Cache bypass** - Option to skip cache per request

### ✅ Error Handling
- **Typed errors** - Structured error responses
- **Error recovery** - Automatic retry on transient errors
- **User-friendly messages** - Clear error messages for UI

### ✅ Type Safety
- **Full TypeScript** - Complete type definitions
- **IntelliSense support** - Auto-complete in IDE
- **Runtime validation** - Type-safe API responses

## 🔌 Available APIs

### Stock Quote
```typescript
const quote = await marketDataService.getStockPrice({
  symbol: 'AAPL',
  includeExtendedHours: true,
});
// Returns: StockQuote with price, change, volume, etc.
```

### Options Chain
```typescript
const chain = await marketDataService.getOptionsChain({
  symbol: 'AAPL',
  expiryDate: '2025-01-17',
  includeGreeks: true,
  minStrike: 140,
  maxStrike: 160,
});
// Returns: OptionsChain with calls, puts, strikes, expiries
```

### Expiry Dates
```typescript
const expiries = await marketDataService.getExpiryDates({
  symbol: 'AAPL',
  includeWeeklies: true,
  includeMonthlies: true,
  minDaysOut: 0,
  maxDaysOut: 365,
});
// Returns: ExpiryDatesResponse with available expiry dates
```

### Volatility Data
```typescript
const volatility = await marketDataService.getVolatility({
  symbol: 'AAPL',
  period: 30,
});
// Returns: VolatilityData with IV, HV, IV Rank
```

## 🎯 React Hooks API

### useStockPrice
```typescript
const {
  data,          // StockQuote | null
  isLoading,     // boolean
  isSuccess,     // boolean
  isError,       // boolean
  error,         // ApiError | null
  timestamp,     // Date | null
  refetch,       // () => Promise<void>
} = useStockPrice({ symbol: 'AAPL' }, autoFetch);
```

### useOptionsChain
```typescript
const {
  data,          // OptionsChain | null
  isLoading,     // boolean
  error,         // ApiError | null
  refetch,       // () => Promise<void>
} = useOptionsChain({
  symbol: 'AAPL',
  expiryDate: '2025-01-17',
  includeGreeks: true,
}, autoFetch);
```

### useExpiryDates
```typescript
const {
  data,          // ExpiryDatesResponse | null
  isLoading,     // boolean
  refetch,       // () => Promise<void>
} = useExpiryDates({
  symbol: 'AAPL',
  includeWeeklies: true,
}, autoFetch);
```

### useSymbolSearch (with debouncing)
```typescript
const {
  results,       // { symbol: string; name: string }[]
  isLoading,     // boolean
  search,        // (query: string) => void
} = useSymbolSearch(300); // 300ms debounce

// Usage in component:
<input onChange={(e) => search(e.target.value)} />
```

## 🏪 Zustand Store API

### State
```typescript
{
  currentSymbol: string | null;
  stockQuote: RequestState<StockQuote>;
  optionsChain: RequestState<OptionsChain>;
  expiryDates: RequestState<ExpiryDatesResponse>;
  volatility: RequestState<VolatilityData>;
  selectedExpiryDate: string | null;
}
```

### Actions
```typescript
{
  setCurrentSymbol: (symbol: string) => void;
  fetchStockQuote: (symbol: string) => Promise<void>;
  fetchOptionsChain: (symbol: string, expiryDate?: string) => Promise<void>;
  fetchExpiryDates: (symbol: string) => Promise<void>;
  fetchVolatility: (symbol: string, period?: number) => Promise<void>;
  setSelectedExpiryDate: (date: string | null) => void;
  clearMarketData: () => void;
}
```

## ⚙️ Configuration

### API Client Configuration
```typescript
import { apiClient } from '@/lib/services/api-client';

apiClient.updateConfig({
  baseUrl: 'http://localhost:3001/api',
  timeout: 15000,
  retryAttempts: 2,
  retryDelay: 1000,
  cacheEnabled: true,
  cacheDuration: 30000,
});
```

### Environment Variables
```bash
# .env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Development Mode (Mock Server)

The mock server provides realistic data for development without requiring a backend:

```typescript
import {
  mockGetStockQuote,
  mockGetOptionsChain,
  mockGetExpiryDates,
  mockGetVolatility,
} from '@/lib/mocks/mock-api-server';

// Use directly in development
const quote = await mockGetStockQuote('AAPL');
const chain = await mockGetOptionsChain('AAPL', '2025-01-17');
```

## 🌐 Backend Implementation

See `IMPLEMENTATION_GUIDE.md` for detailed instructions on:
- Yahoo Finance integration (recommended for free)
- Alpha Vantage integration
- TD Ameritrade integration
- Polygon.io integration
- Setting up Express.js backend
- Rate limiting and caching strategies

## 📊 Comparison with Downloadsite Pattern

| Feature | Downloadsite | Our Implementation |
|---------|--------------|-------------------|
| Request Management | ✅ ajaxRequest | ✅ ApiClient |
| Duplicate Detection | ✅ 1 second window | ✅ 1 second window |
| Timeouts | ✅ Per-command | ✅ Per-endpoint |
| Retry Logic | ❌ | ✅ Automatic retries |
| Caching | ❌ | ✅ In-memory cache |
| Type Safety | ❌ JavaScript | ✅ TypeScript |
| React Integration | ❌ jQuery | ✅ Hooks + Zustand |
| Error Handling | ✅ Basic | ✅ Comprehensive |

## 📝 Next Steps

1. **Review the code** - Check out the example components in `src/components/examples/`
2. **Choose an API** - See `IMPLEMENTATION_GUIDE.md` for options
3. **Set up backend** - Implement server endpoints
4. **Test with real data** - Update `baseUrl` and test
5. **Customize** - Adjust timeouts, cache duration, etc.

## 🤝 Usage Examples

See `src/components/examples/MarketDataExample.tsx` for:
- Complete working examples
- Both hooks and store usage
- UI components integration
- Error handling patterns
- Loading states

## 💡 Tips

1. **Use hooks for component-specific data** - When data is only needed in one component
2. **Use store for shared data** - When multiple components need the same data
3. **Enable caching in production** - Reduces API calls and costs
4. **Implement rate limiting** - On the backend to prevent API quota exhaustion
5. **Monitor API usage** - Track requests to optimize caching

## 🐛 Troubleshooting

### CORS Errors
Add CORS headers to your backend or use a proxy in development

### Timeout Errors
Increase timeout values in `api-client.ts` configuration

### Cache Issues
Clear cache with `apiClient.clearCache()` or disable caching temporarily

---

Built with TypeScript, React, and Zustand 🚀
