# Backend Deployment Guide

## Overview
This guide walks you through deploying the FastAPI backend to Vercel so your production frontend can connect to it.

## Prerequisites
- [Vercel CLI](https://vercel.com/download) installed (`npm i -g vercel`)
- Vercel account
- Python 3.9+ locally (for testing)

## Current Setup
- **Backend**: FastAPI (Python) in `/backend` folder
- **Framework**: FastAPI + Uvicorn
- **Dependencies**: yfinance, python-dateutil
- **Deployment config**: `backend/vercel.json` (already configured)

## Deployment Steps

### Step 1: Test Backend Locally (Optional but Recommended)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# OR
uvicorn main:app --reload --port 8000
```

Test endpoints:
- Health check: http://localhost:8000/
- API health: http://localhost:8000/api/health
- Stock quote: http://localhost:8000/api/stocks/AAPL/quote
- Options expiries: http://localhost:8000/api/options/AAPL/expiries

### Step 2: Deploy Backend to Vercel

```bash
# Navigate to backend folder
cd backend

# Login to Vercel (if not already logged in)
vercel login

# Deploy (first time - will ask questions)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? (e.g., "calc-backend" or "options-calc-api")
# - In which directory is your code located? ./ (just press Enter)
# - Want to modify settings? N

# For production deployment
vercel --prod
```

**Important**: Save the deployment URL! It will look like:
- `https://calc-backend.vercel.app` (production)
- `https://calc-backend-xxx.vercel.app` (preview)

### Step 3: Test Deployed Backend

Test your deployed endpoints:

```bash
# Replace with your actual deployment URL
curl https://your-backend-url.vercel.app/
curl https://your-backend-url.vercel.app/api/health
curl https://your-backend-url.vercel.app/api/stocks/AAPL/quote
```

### Step 4: Update Frontend Environment Variables

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your frontend project (calc)

2. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend-url.vercel.app/api` (note the `/api` suffix)
     - **Environments**: Production, Preview, Development (select all)

3. **Redeploy Frontend**
   ```bash
   # In the root project folder (not backend)
   cd ..
   vercel --prod
   ```

   OR just push to your GitHub repo if you have auto-deployment enabled.

### Step 5: Update CORS if Needed

If you get CORS errors, update `backend/main.py` to include your specific frontend URL:

```python
allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://your-specific-frontend.vercel.app",  # Add your exact URL
]
```

Then redeploy backend:
```bash
cd backend
vercel --prod
```

## Verification Checklist

- [ ] Backend health endpoint responds: `https://your-backend.vercel.app/`
- [ ] API endpoints work: `https://your-backend.vercel.app/api/stocks/AAPL/quote`
- [ ] Frontend environment variable is set in Vercel dashboard
- [ ] Frontend can fetch data (check browser console for errors)
- [ ] No CORS errors in browser console

## Troubleshooting

### Issue: "Module not found" or import errors
- Check `backend/requirements.txt` has all dependencies
- Vercel automatically installs from requirements.txt

### Issue: CORS errors
- Verify frontend URL is in the `allow_origins` list
- Use wildcard `https://*.vercel.app` for all Vercel deployments
- Check browser console for exact error message

### Issue: API returns 404
- Verify the API URL in frontend includes `/api` prefix
- Example: `https://backend.vercel.app/api` NOT just `https://backend.vercel.app`

### Issue: Function timeout
- Vercel serverless functions have 10s timeout on free tier
- If yfinance requests are slow, consider caching or upgrading plan

### Issue: Python version mismatch
- Vercel uses Python 3.9 by default
- Add `runtime.txt` if you need a specific version:
  ```
  python-3.11
  ```

## Alternative: Environment-Based Configuration

Create `.env.production.local` in frontend root (don't commit):
```bash
VITE_API_URL=https://your-backend.vercel.app/api
```

This is useful for local testing with production backend.

## Monitoring and Logs

View backend logs:
```bash
cd backend
vercel logs
```

Or view in Vercel Dashboard → Your Project → Logs

## Rolling Back

If deployment fails:
```bash
cd backend
vercel rollback
```

## Production Best Practices

1. **Use environment-specific domains**
   - Development: `dev-api.yourdomain.com`
   - Production: `api.yourdomain.com`

2. **Add custom domain** (optional)
   - In Vercel dashboard → Settings → Domains
   - Add: `api.yourdomain.com`

3. **Set up monitoring**
   - Use Vercel Analytics
   - Monitor function invocations and errors

4. **Rate limiting**
   - Consider adding rate limiting middleware for production
   - yfinance has rate limits - cache responses when possible

## Quick Reference

### Backend Deployment
```bash
cd backend && vercel --prod
```

### Frontend Redeploy
```bash
cd .. && vercel --prod
```

### View Logs
```bash
cd backend && vercel logs --follow
```

### Environment Variables
- Set in Vercel Dashboard → Project → Settings → Environment Variables
- OR use `vercel env add VITE_API_URL`

## Next Steps After Deployment

1. Test all API endpoints from production frontend
2. Monitor error rates in Vercel dashboard
3. Set up custom domain (optional)
4. Add caching layer if needed (Redis, Vercel KV)
5. Consider CI/CD with GitHub Actions for automatic deployments

## Support

- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- yfinance Issues: https://github.com/ranaroussi/yfinance/issues
