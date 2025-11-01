# Next Steps - Connect Frontend to Backend

## Backend Successfully Deployed!

Your backend is now live at:
**https://backend-drv9la95r-app74s-projects.vercel.app**

Test it:
- Health: https://backend-drv9la95r-app74s-projects.vercel.app/
- API Health: https://backend-drv9la95r-app74s-projects.vercel.app/api/health
- Stock Quote: https://backend-drv9la95r-app74s-projects.vercel.app/api/stocks/AAPL/quote

## IMPORTANT: You Must Complete These Steps

### Step 1: Add Environment Variable to Frontend in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your **calc** project (the frontend)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add this variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://backend-drv9la95r-app74s-projects.vercel.app/api`
   - **Environments**: Check all three boxes (Production, Preview, Development)
6. Click **Save**

### Step 2: Redeploy Your Frontend

Option A - Via Dashboard:
1. Go to your frontend project in Vercel dashboard
2. Click **Deployments** tab
3. Find the latest deployment
4. Click the three dots menu (•••)
5. Click **Redeploy**

Option B - Via CLI (Recommended):
```bash
# In your project root folder (not backend folder)
cd c:\Users\nicks\OneDrive\Desktop\calc
vercel --prod
```

Option C - Via Git:
```bash
# Make a small change and push
git add .
git commit -m "Update API configuration"
git push
```

### Step 3: Verify It Works

1. Visit your production site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try using the app - search for a stock (e.g., AAPL)
5. Check Network tab - you should see requests to your backend URL
6. No CORS errors should appear

## Troubleshooting

### If you get CORS errors:
The backend is already configured with `https://*.vercel.app` wildcard, so it should work. But if you still get CORS errors:

1. Note your exact frontend URL (e.g., https://calc-jade-sigma.vercel.app)
2. Update `backend/main.py` line 32 to include your exact URL
3. Redeploy backend: `cd backend && vercel --prod`

### If API calls fail:
1. Check browser console for error messages
2. Verify the environment variable is set correctly in Vercel
3. Try accessing the API directly in your browser: https://backend-drv9la95r-app74s-projects.vercel.app/api/stocks/AAPL/quote
4. Check Vercel logs: `cd backend && vercel logs`

### If environment variable doesn't work:
1. Make sure you redeployed the frontend AFTER adding the variable
2. Environment variables only take effect after a new deployment
3. Clear your browser cache and try again

## Quick Verification Commands

Test backend is alive:
```bash
curl https://backend-drv9la95r-app74s-projects.vercel.app/
```

Test API endpoint:
```bash
curl https://backend-drv9la95r-app74s-projects.vercel.app/api/stocks/AAPL/quote
```

## Summary

✅ Backend deployed: https://backend-drv9la95r-app74s-projects.vercel.app
✅ API working: Tested with AAPL stock quote
✅ CORS configured: Allows all Vercel domains
⏳ **YOU NEED TO DO**: Add `VITE_API_URL` environment variable to frontend
⏳ **YOU NEED TO DO**: Redeploy frontend

After you complete these steps, your app should work in production!
