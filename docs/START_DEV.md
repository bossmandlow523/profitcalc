# 🚀 Quick Start Guide

## First Time Setup

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Install Frontend Dependencies (if not already done)
```bash
npm install
```

## Running the Application

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

Wait for:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:5173/
```

### Option 2: Windows PowerShell Script

Create a file `start-dev.ps1`:
```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python main.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Started backend and frontend servers!"
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
```

Then run:
```bash
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

## Testing the API

### Option 1: Use Test Script
```bash
cd backend
python test_api.py
```

### Option 2: Use Browser
1. Backend API Docs: http://localhost:8000/docs
2. Test a stock quote: http://localhost:8000/api/stocks/AAPL/quote

### Option 3: Use curl
```bash
# Test stock quote
curl http://localhost:8000/api/stocks/AAPL/quote

# Test search
curl "http://localhost:8000/api/stocks/search?q=apple"

# Test expiry dates
curl http://localhost:8000/api/options/AAPL/expiries
```

## Open the Application

Once both servers are running:

👉 **Open http://localhost:5173 in your browser**

## Verify Everything Works

1. ✅ Search for a symbol (e.g., "AAPL")
2. ✅ Stock price should auto-populate
3. ✅ Select an expiry date
4. ✅ View options chain

## Stopping the Servers

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

## Troubleshooting

### Backend won't start - "Address already in use"
Port 8000 is busy. Find and kill the process:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in backend/main.py:
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend won't start - Port 5173 busy
```bash
# Kill process or change port
npm run dev -- --port 3000
```

### "Module not found" errors
```bash
# Reinstall backend dependencies
cd backend
pip install -r requirements.txt --force-reinstall

# Reinstall frontend dependencies
npm install
```

### CORS errors in browser
1. Make sure backend is running on port 8000
2. Check vite.config.ts proxy settings
3. Check CORS in backend/main.py

### API returns errors
1. Check backend terminal for error messages
2. Test API directly at http://localhost:8000/docs
3. Try a different symbol (MSFT, GOOGL, TSLA)

## Next Steps

Once running:
1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for component usage
2. Check [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) for API details
3. Review [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) for features

## Quick Commands Reference

```bash
# Start backend
cd backend && python main.py

# Start frontend
npm run dev

# Test API
cd backend && python test_api.py

# View API docs
# Open: http://localhost:8000/docs

# Build for production
npm run build

# Deploy to Vercel
vercel
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/api/health

---

🎉 **You're all set! Happy trading!** 📈
