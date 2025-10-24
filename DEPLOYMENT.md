# Deployment Guide

## Overview
This options calculator application is ready for deployment to Vercel. The frontend is built with React, Vite, and TypeScript.

## Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Vercel account (for deployment)

## Local Production Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build:prod
```

This will create an optimized production build in the `dist` directory.

### 3. Preview Production Build Locally
```bash
npm run preview
```

The application will be available at `http://localhost:4173`

## Vercel Deployment

### Quick Deploy

1. **Install Vercel CLI** (optional, for CLI deployment)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```

3. **Deploy via GitHub** (recommended)
   - Push your code to GitHub
   - Import the repository in Vercel dashboard
   - Vercel will auto-detect the configuration from `vercel.json`

### Environment Variables

If you need to configure API endpoints or other environment variables:

1. In Vercel Dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `VITE_API_URL` - Your backend API URL (if using external API)
   - `VITE_GA_TRACKING_ID` - Google Analytics tracking ID (optional)

### Configuration

The project includes a `vercel.json` configuration file with:
- Build command: `npm run build:prod`
- Output directory: `dist`
- SPA routing configuration
- Cache headers for static assets

## Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build for production
- `npm run build:prod` - Build for production (skip type checking)
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
calc/
├── src/               # Source files
│   ├── components/    # React components
│   ├── lib/          # Utility functions and calculations
│   └── App.tsx       # Main application component
├── public/           # Static assets
├── dist/             # Production build output
├── docs/             # Documentation
├── backend/          # Python backend (separate deployment)
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies and scripts
```

## Backend API

The application can work with a Python FastAPI backend. The backend should be deployed separately:

### Option 1: Deploy Backend to Vercel
The `backend/` directory contains a Python FastAPI application that can be deployed to Vercel using serverless functions.

### Option 2: Deploy Backend Elsewhere
Deploy the Python backend to:
- Heroku
- Railway
- Google Cloud Run
- AWS Lambda

Then update the `VITE_API_URL` environment variable to point to your backend URL.

## Performance Optimization

The build is optimized with:
- Code splitting for React, UI libraries, and charts
- Terser minification
- Asset caching headers
- Gzip compression

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 18.x or higher)

### TypeScript Errors
- The production build uses `build:prod` which skips strict type checking
- To check types: `npm run typecheck`
- To fix type errors, see the TypeScript output and update code accordingly

### Large Bundle Size
The main bundle is ~542 KB minified. This is acceptable for a feature-rich application, but can be optimized further by:
- Lazy loading routes with React.lazy()
- Removing unused dependencies
- Tree-shaking unused code

## Post-Deployment

After deploying to Vercel:

1. **Test the Application**
   - Verify all routes work correctly
   - Test calculator functionality
   - Check responsive design on mobile

2. **Configure Custom Domain** (optional)
   - Add your custom domain in Vercel dashboard
   - Update DNS records as instructed

3. **Monitor Performance**
   - Use Vercel Analytics
   - Set up Google Analytics (update tracking ID in code)

4. **Set up CI/CD**
   - Enable automatic deployments from your main branch
   - Configure preview deployments for pull requests

## Support

For issues or questions:
- Check the documentation in the `docs/` folder
- Review Vercel deployment logs
- Check browser console for client-side errors
