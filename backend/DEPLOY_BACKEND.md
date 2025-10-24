# Backend Deployment Guide

## Quick Deploy to Vercel

Your Python FastAPI backend needs to be deployed separately from the frontend.

### Option 1: Deploy Backend via Vercel CLI (Recommended)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Copy the deployment URL** (e.g., `https://your-backend.vercel.app`)

4. **Update frontend environment variable:**
   - Go to your frontend project in Vercel Dashboard
   - Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.vercel.app/api`
   - Redeploy frontend

### Option 2: Deploy Backend via GitHub

1. **Create separate GitHub repository for backend:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/backend-repo.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to Vercel Dashboard
   - New Project
   - Import the backend repository
   - Deploy

3. **Update frontend environment variable** (same as above)

### Option 3: Use Alternative Backend Hosting

If Vercel doesn't work well for Python:

**Railway.app (Recommended for Python):**
1. Go to https://railway.app
2. New Project > Deploy from GitHub
3. Select backend repository
4. Add Procfile: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Get deployment URL

**Render.com:**
1. Go to https://render.com
2. New Web Service
3. Connect repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Current Issue

Your frontend is deployed at Vercel, but it's trying to connect to:
- `http://localhost:8000/api` (only works locally)

You need to:
1. Deploy the backend
2. Set `VITE_API_URL` environment variable in frontend Vercel project
3. Redeploy frontend

## Testing Backend Locally

Before deploying, test locally:

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Visit: http://localhost:8000
Should see: `{"status": "healthy", ...}`

## After Backend Deployment

1. **Test backend health:**
   ```bash
   curl https://your-backend-url.vercel.app/
   ```

2. **Update frontend:**
   - Vercel Dashboard > Your Frontend Project
   - Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.vercel.app/api`
   - Deployments > Redeploy

3. **Test full stack:**
   - Visit your frontend URL
   - Try to fetch stock prices
   - Should now work!

## CORS Configuration

The backend is already configured to accept requests from Vercel domains:
- `https://*.vercel.app` is allowed in CORS

## Troubleshooting

**Error: "Unexpected token '<', "<!DOCTYPE "..."**
- Backend is not deployed or URL is wrong
- Check `VITE_API_URL` environment variable

**Error: "CORS policy"**
- Update backend CORS to include your frontend domain
- Add specific domain to `allow_origins` in main.py

**Error: "Failed to fetch"**
- Backend is down or unreachable
- Check backend deployment logs
