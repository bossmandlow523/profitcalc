# API Quick Reference

## 🚀 Start Servers

```bash
# Terminal 1: Backend
cd backend && python main.py

# Terminal 2: Frontend
npm run dev
```

## 📡 Base URLs

- **Local Backend**: http://localhost:8000
- **Local Frontend**: http://localhost:5173
- **API Proxy**: http://localhost:5173/api (auto-proxied to backend)

## 🔌 API Endpoints

### Stock Endpoints

```bash
# Get stock quote
GET /api/stocks/{symbol}/quote
curl http://localhost:8000/api/stocks/AAPL/quote

# Get volatility
GET /api/stocks/{symbol}/volatility?period=30
curl http://localhost:8000/api/stocks/AAPL/volatility

# Search symbols
GET /api/stocks/search?q={query}
curl "http://localhost:8000/api/stocks/search?q=apple"

# Validate symbol
GET /api/stocks/{symbol}/validate
curl http://localhost:8000/api/stocks/AAPL/validate
```

### Options Endpoints

```bash
# Get expiry dates
GET /api/options/{symbol}/expiries
curl http://localhost:8000/api/options/AAPL/expiries

# Get options chain
GET /api/options/{symbol}/chain?expiryDate={date}&minStrike={min}&maxStrike={max}
curl "http://localhost:8000/api/options/AAPL/chain?expiryDate=2025-01-17"

# With filters
curl "http://localhost:8000/api/options/AAPL/chain?expiryDate=2025-01-17&minStrike=170&maxStrike=180"
```

## 🎨 Components

### SymbolSearchInput
```tsx
import { SymbolSearchInput } from '@/components/calculator/SymbolSearchInput'

<SymbolSearchInput
  onSymbolSelect={(symbol) => console.log(symbol)}
  label="Search Stock Symbol"
  placeholder="Type to search..."
/>
```

### StockPriceInput
```tsx
import { StockPriceInput } from '@/components/calculator/StockPriceInput'

<StockPriceInput />
// Auto-populates from store, shows live price changes
```

### ExpiryDateSelector
```tsx
import { ExpiryDateSelector } from '@/components/calculator/ExpiryDateSelector'

<ExpiryDateSelector
  onExpirySelect={(date) => console.log(date)}
/>
```

### OptionsChainViewer
```tsx
import { OptionsChainViewer } from '@/components/calculator/OptionsChainViewer'

<OptionsChainViewer
  onOptionSelect={(option) => console.log(option)}
/>
```

## 🗄️ Store Usage

```tsx
import { useMarketDataStore } from '@/lib/store/market-data-store'

const {
  // State
  currentSymbol,
  stockQuote,           // { data, isLoading, isError, error }
  optionsChain,
  expiryDates,
  selectedExpiryDate,

  // Actions
  setCurrentSymbol,
  fetchStockQuote,
  fetchOptionsChain,
  fetchExpiryDates,
  setSelectedExpiryDate,
  clearMarketData,
} = useMarketDataStore()

// Fetch data
await fetchStockQuote('AAPL')
await fetchExpiryDates('AAPL')
await fetchOptionsChain('AAPL', '2025-01-17')
```

## 📊 Response Examples

### Stock Quote
```json
{
  "data": {
    "symbol": "AAPL",
    "price": 178.50,
    "change": 2.30,
    "changePercent": 1.31,
    "volume": 45678900,
    "previousClose": 176.20,
    "high52Week": 199.62,
    "low52Week": 164.08
  },
  "status": "success",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Expiry Dates
```json
{
  "data": {
    "symbol": "AAPL",
    "expiryDates": [
      {
        "date": "2025-01-17",
        "type": "monthly",
        "daysUntilExpiry": 2,
        "isStandard": true
      }
    ]
  }
}
```

### Options Chain
```json
{
  "data": {
    "underlying": "AAPL",
    "underlyingPrice": 178.50,
    "calls": [
      {
        "symbol": "AAPL250117C00175000",
        "strikePrice": 175.00,
        "bid": 4.20,
        "ask": 4.30,
        "lastPrice": 4.25,
        "mark": 4.25,
        "volume": 1234,
        "openInterest": 5678,
        "impliedVolatility": 0.28,
        "inTheMoney": true
      }
    ],
    "puts": [...]
  }
}
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Vite Proxy (vite.config.ts)
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### API Client Config
```typescript
// In src/lib/services/api-client.ts
apiClient.updateConfig({
  timeout: 15000,
  cacheDuration: 30000,
  retryAttempts: 2
})
```

## 🔥 Common Workflows

### Complete Symbol → Options Flow
```tsx
// 1. User searches and selects symbol
<SymbolSearchInput onSymbolSelect={handleSelect} />

// 2. Auto-fetches:
// - Stock quote → populates StockPriceInput
// - Expiry dates → populates ExpiryDateSelector

// 3. User selects expiry
<ExpiryDateSelector onExpirySelect={handleExpirySelect} />

// 4. Auto-fetches:
// - Options chain → displays in OptionsChainViewer

// 5. User views/selects option
<OptionsChainViewer onOptionSelect={handleOptionSelect} />
```

## 🚀 Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel

# Set environment variables in dashboard
VITE_API_URL=https://your-app.vercel.app/api
```

## 🐛 Debug Checklist

- [ ] Backend running on port 8000?
- [ ] Frontend running on port 5173?
- [ ] Check browser console for errors
- [ ] Check Network tab for API calls
- [ ] Verify proxy in vite.config.ts
- [ ] Check CORS settings in backend/main.py
- [ ] Try API directly: http://localhost:8000/docs

## 📚 Documentation Links

- **Backend README**: [backend/README.md](backend/README.md)
- **Setup Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Docs**: http://localhost:8000/docs (when running)
- **Original API Spec**: [api.md](api.md)

## 💡 Tips

1. Use Swagger UI at `/docs` for testing endpoints
2. Check Zustand DevTools in browser for store state
3. Symbol search has limited symbols - add more in yfinance_service.py
4. Data is 15-minute delayed from Yahoo Finance
5. Greeks are not available via yfinance
6. Cache duration is 30 seconds by default
