# Yahoo Finance API Integration - Setup Guide

Complete guide to get your Options Calculator running with real-time market data from Yahoo Finance.

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Backend Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Start Frontend

Open a new terminal:

```bash
npm run dev
```

### Step 4: Test the Integration

1. Open http://localhost:5173 in your browser
2. You should see the Options Calculator
3. The backend API is now proxied through Vite to `/api/*`

## 📁 What Was Added

### Backend (Python/FastAPI)
```
backend/
├── main.py                    # FastAPI app with CORS
├── requirements.txt           # Python dependencies
├── vercel.json               # Vercel deployment config
├── services/
│   └── yfinance_service.py   # Yahoo Finance wrapper
└── routes/
    ├── stocks.py             # Stock endpoints
    └── options.py            # Options endpoints
```

### Frontend Components
```
src/components/calculator/
├── SymbolSearchInput.tsx     # Symbol autocomplete search
├── ExpiryDateSelector.tsx    # Dynamic expiry dropdown
└── OptionsChainViewer.tsx    # Options chain table

src/components/ui/
└── combobox.tsx              # Autocomplete component
```

### Updated Files
- `vite.config.ts` - Added proxy for `/api` → `http://localhost:8000`
- `StockPriceInput.tsx` - Auto-populates from API with live indicators
- `.env` - API URL configuration

## 🎯 Using the New Components

### 1. Symbol Search with Autocomplete

```tsx
import { SymbolSearchInput } from '@/components/calculator/SymbolSearchInput'

function MyComponent() {
  const handleSymbolSelect = (symbol: string) => {
    console.log('Selected:', symbol)
    // Automatically fetches stock price and expiry dates
  }

  return (
    <SymbolSearchInput
      onSymbolSelect={handleSymbolSelect}
      label="Search Stock Symbol"
      placeholder="Type to search..."
    />
  )
}
```

**Features:**
- 300ms debounced search
- Autocomplete dropdown
- Automatically fetches stock data on selection
- Shows symbol + company name

### 2. Expiry Date Selector

```tsx
import { ExpiryDateSelector } from '@/components/calculator/ExpiryDateSelector'

function MyComponent() {
  return (
    <ExpiryDateSelector
      onExpirySelect={(date) => console.log('Selected:', date)}
    />
  )
}
```

**Features:**
- Dynamic dropdown populated from API
- Shows days until expiry
- Badges for monthly/LEAP options
- Loading and error states
- Automatically fetches options chain on selection

### 3. Options Chain Viewer

```tsx
import { OptionsChainViewer } from '@/components/calculator/OptionsChainViewer'

function MyComponent() {
  return (
    <OptionsChainViewer
      onOptionSelect={(option) => console.log('Selected option:', option)}
    />
  )
}
```

**Features:**
- Tabs for calls/puts
- Shows bid/ask/last/volume/OI/IV
- Highlights ITM options
- Shows ATM badge
- Filters to ±15% of current price
- Click to select strike

### 4. Enhanced Stock Price Input

The existing `StockPriceInput` now:
- ✅ Auto-populates from API
- ✅ Shows live price change (+/-%)
- ✅ Refresh button for manual updates
- ✅ Loading/error states
- ✅ Visual indicators (trending up/down icons)

## 🔌 API Endpoints Available

### Stock Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/stocks/{symbol}/quote` | Current price & quote data | `/api/stocks/AAPL/quote` |
| `GET /api/stocks/{symbol}/volatility` | IV, HV, IV Rank | `/api/stocks/AAPL/volatility?period=30` |
| `GET /api/stocks/{symbol}/validate` | Check if symbol exists | `/api/stocks/AAPL/validate` |
| `GET /api/stocks/search` | Search symbols | `/api/stocks/search?q=apple` |

### Options Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /api/options/{symbol}/expiries` | Available expiry dates | `/api/options/AAPL/expiries` |
| `GET /api/options/{symbol}/chain` | Full options chain | `/api/options/AAPL/chain?expiryDate=2025-01-17` |

## 📊 Example Integration in Calculator Page

Here's how to add all components to your calculator page:

```tsx
import { SymbolSearchInput } from '@/components/calculator/SymbolSearchInput'
import { StockPriceInput } from '@/components/calculator/StockPriceInput'
import { ExpiryDateSelector } from '@/components/calculator/ExpiryDateSelector'
import { OptionsChainViewer } from '@/components/calculator/OptionsChainViewer'
import { useMarketDataStore } from '@/lib/store/market-data-store'

export function CalculatorPage() {
  const { currentSymbol } = useMarketDataStore()

  return (
    <div className="space-y-6 p-6">
      {/* Symbol Search */}
      <SymbolSearchInput
        onSymbolSelect={(symbol) => console.log('Selected:', symbol)}
      />

      {/* Stock Price - Auto-populates */}
      <StockPriceInput />

      {/* Expiry Date Selector - Shows when symbol selected */}
      {currentSymbol && (
        <ExpiryDateSelector
          onExpirySelect={(date) => console.log('Expiry:', date)}
        />
      )}

      {/* Options Chain - Shows when symbol + expiry selected */}
      <OptionsChainViewer
        onOptionSelect={(option) => {
          console.log('Selected strike:', option.strikePrice)
          console.log('Type:', option.optionType)
          console.log('Premium:', option.mark)
        }}
      />
    </div>
  )
}
```

## 🎨 Workflow Example

1. **User searches for symbol**: "AAPL"
   - SymbolSearchInput shows autocomplete results
   - User selects "AAPL - Apple Inc."

2. **Automatic data fetching**:
   - Stock quote fetched → StockPriceInput auto-populates
   - Expiry dates fetched → ExpiryDateSelector populates

3. **User selects expiry**: "Jan 17, 2025"
   - Options chain fetched automatically
   - OptionsChainViewer displays calls/puts

4. **User views/selects options**:
   - Click on any strike to select
   - Use option data in calculator

## 🔧 Configuration

### Change API URL

Edit `.env`:
```env
# Local development
VITE_API_URL=http://localhost:8000/api

# Production
VITE_API_URL=https://your-app.vercel.app/api
```

### Adjust Cache Duration

Edit `src/lib/services/api-client.ts`:
```typescript
this.config = {
  baseUrl: '/api',
  timeout: 15000,
  retryAttempts: 2,
  cacheEnabled: true,
  cacheDuration: 30000, // 30 seconds (adjust here)
}
```

### Customize Proxy

Edit `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',  // Change port if needed
      changeOrigin: true,
    },
  },
}
```

## 🚀 Deploying to Vercel

### Option 1: Monorepo (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment:
- In Vercel dashboard, set `VITE_API_URL` to your production URL

### Option 2: Separate Deployments

**Backend:**
```bash
cd backend
vercel
```

**Frontend:**
```bash
vercel
```

Then update frontend `.env` with backend URL.

## 🧪 Testing the API

### Using curl

```bash
# Test stock quote
curl http://localhost:8000/api/stocks/AAPL/quote

# Test expiry dates
curl http://localhost:8000/api/options/AAPL/expiries

# Test options chain
curl "http://localhost:8000/api/options/AAPL/chain?expiryDate=2025-01-17"

# Search symbols
curl "http://localhost:8000/api/stocks/search?q=tesla"
```

### Using Browser

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## 📝 State Management

All market data is managed globally via Zustand store:

```typescript
import { useMarketDataStore } from '@/lib/store/market-data-store'

const {
  currentSymbol,         // Currently selected symbol
  stockQuote,           // Stock price data + state
  optionsChain,         // Options chain data + state
  expiryDates,          // Expiry dates + state
  selectedExpiryDate,   // Selected expiry

  // Actions
  setCurrentSymbol,
  fetchStockQuote,
  fetchOptionsChain,
  fetchExpiryDates,
  setSelectedExpiryDate,
} = useMarketDataStore()
```

All components use this store, so data is synchronized across your app.

## 🎯 Next Steps

1. **Add to your calculator page**: Import and use the components
2. **Customize styling**: Modify Tailwind classes to match your theme
3. **Add features**:
   - Save favorite symbols
   - Compare multiple options
   - Show historical data charts
   - Add alerts/notifications

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS errors in browser
1. Check backend is running on port 8000
2. Verify proxy in `vite.config.ts`
3. Check CORS origins in `backend/main.py`

### "Module not found" errors
```bash
# From backend directory
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python main.py
```

### Components not showing data
1. Open browser console (F12)
2. Check Network tab for API calls
3. Verify responses in `/api/stocks/*` endpoints
4. Check Redux DevTools for store state

### Symbol search returns no results
The backend has a small list of common symbols. To add more:

Edit `backend/services/yfinance_service.py`:
```python
common_symbols = {
    "AAPL": "Apple Inc.",
    "YOUR_SYMBOL": "Company Name",
    # Add more here
}
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [yfinance Documentation](https://github.com/ranaroussi/yfinance)
- [Vercel Python Documentation](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)
- [Vite Proxy Documentation](https://vitejs.dev/config/server-options.html#server-proxy)

## 🎉 You're All Set!

Your Options Calculator now has:
- ✅ Real-time stock prices (15-min delay)
- ✅ Live options chains
- ✅ Symbol search with autocomplete
- ✅ Dynamic expiry date selection
- ✅ Interactive options chain viewer
- ✅ Auto-populating inputs
- ✅ Loading states and error handling
- ✅ Ready for Vercel deployment

Happy trading! 📈
