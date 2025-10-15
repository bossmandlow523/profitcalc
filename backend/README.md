# Options Calculator Backend API

FastAPI backend for fetching real-time stock and options data using Yahoo Finance (yfinance).

## Features

- 📈 **Real-time Stock Quotes** - Current price, change, volume, 52-week high/low
- 📅 **Options Expiry Dates** - Weekly, monthly, quarterly, and LEAPS
- 🔗 **Options Chains** - Complete calls/puts data with strikes, bids, asks, IV
- 📊 **Volatility Metrics** - Implied and historical volatility
- 🔍 **Symbol Search** - Autocomplete symbol lookup
- ⚡ **Fast & Cached** - 15-minute delayed data with smart caching
- 🌐 **CORS Enabled** - Ready for Vercel deployment

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Development Server

```bash
# From the backend directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 3. View API Documentation

Once running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### Stock Endpoints

#### Get Stock Quote
```
GET /api/stocks/{symbol}/quote
```

**Example:**
```bash
curl http://localhost:8000/api/stocks/AAPL/quote
```

**Response:**
```json
{
  "data": {
    "symbol": "AAPL",
    "price": 178.50,
    "change": 2.30,
    "changePercent": 1.31,
    "volume": 45678900,
    "previousClose": 176.20
  },
  "status": "success",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### Get Volatility
```
GET /api/stocks/{symbol}/volatility?period=30
```

#### Search Symbols
```
GET /api/stocks/search?q=AAPL
```

#### Validate Symbol
```
GET /api/stocks/{symbol}/validate
```

### Options Endpoints

#### Get Expiry Dates
```
GET /api/options/{symbol}/expiries
```

**Example:**
```bash
curl http://localhost:8000/api/options/AAPL/expiries
```

**Response:**
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

#### Get Options Chain
```
GET /api/options/{symbol}/chain?expiryDate=2025-01-17&minStrike=170&maxStrike=180
```

**Example:**
```bash
curl "http://localhost:8000/api/options/AAPL/chain?expiryDate=2025-01-17"
```

**Response:**
```json
{
  "data": {
    "underlying": "AAPL",
    "underlyingPrice": 178.50,
    "calls": [...],
    "puts": [...],
    "strikes": [170, 175, 180]
  }
}
```

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── requirements.txt             # Python dependencies
├── vercel.json                  # Vercel deployment config
├── services/
│   ├── __init__.py
│   └── yfinance_service.py      # Yahoo Finance data fetching
└── routes/
    ├── __init__.py
    ├── stocks.py                # Stock-related endpoints
    └── options.py               # Options-related endpoints
```

## Environment Variables

None required for local development. Yahoo Finance API is free and doesn't need API keys.

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

From the project root:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Scope? Select your account
- Link to existing project? **N**
- Project name? `options-calculator` (or your choice)
- Directory? `./` (root)

### 4. Update Frontend API URL

After deployment, update your frontend `.env` file:

```env
VITE_API_URL=https://your-app.vercel.app/api
```

## Data Limitations

### Yahoo Finance (yfinance)
- ✅ **Free** - No API key required
- ✅ **Comprehensive** - Stocks, options, historical data
- ⚠️ **15-minute delay** - Not real-time
- ⚠️ **No Greeks** - Delta, gamma, theta not provided
- ⚠️ **Rate limits** - Be reasonable with requests
- ❌ **No official support** - Uses web scraping

### Data Update Frequency
- Stock prices: 15-minute delay
- Options data: Updated periodically
- Cache duration: 30 seconds (configurable)

## Troubleshooting

### "No module named 'yfinance'"
```bash
pip install yfinance
```

### "Module not found" errors
Make sure you're running from the backend directory or adjust PYTHONPATH:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python main.py
```

### CORS errors
Update the CORS origins in `main.py`:
```python
allow_origins=[
    "http://localhost:5173",
    "https://your-domain.vercel.app",
]
```

### Vercel deployment fails
1. Check Python version (should be 3.9+)
2. Verify `vercel.json` is in the correct location
3. Check Vercel logs: `vercel logs`

## Development Tips

### Enable Debug Logging
In `main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test Endpoints Quickly
Use the built-in Swagger UI at `http://localhost:8000/docs` - you can test all endpoints interactively.

### Clear yfinance Cache
If data seems stale:
```python
import yfinance as yf
ticker = yf.Ticker("AAPL")
ticker.history(period="1d", cache=False)
```

## Performance Optimization

### Caching Strategy
- Stock quotes: 30 seconds cache
- Options chains: 30 seconds cache
- Expiry dates: 5 minutes cache
- Symbol search: No cache (instant results)

### Rate Limiting
Consider adding rate limiting for production:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/stocks/{symbol}/quote")
@limiter.limit("60/minute")
async def get_stock_quote(symbol: str):
    ...
```

## Future Enhancements

- [ ] Add Redis caching for distributed caching
- [ ] Implement websocket for real-time updates
- [ ] Add database for historical data storage
- [ ] Integrate additional data providers (Alpha Vantage, Polygon.io)
- [ ] Calculate Greeks using Black-Scholes model
- [ ] Add authentication for rate limiting per user
- [ ] Implement request queuing for high traffic

## License

MIT

## Support

For issues or questions:
1. Check the [API documentation](http://localhost:8000/docs)
2. Review [yfinance documentation](https://github.com/ranaroussi/yfinance)
3. Open an issue on GitHub
