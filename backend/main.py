"""
FastAPI Backend for Options Calculator
Provides stock prices, options chains, and market data via Yahoo Finance (yfinance)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging

# Import routes
from routes import stocks, options

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Options Calculator API",
    description="Real-time stock and options data via Yahoo Finance",
    version="1.0.0"
)

# CORS Configuration for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "https://optionsprofitcalc.net",  # Custom domain (production)
        "https://www.optionsprofitcalc.net",  # Custom domain with www
        "http://optionsprofitcalc.net",  # HTTP version
        "http://www.optionsprofitcalc.net",  # HTTP www version
        "https://profitcalc-6mar4clzm-app74s-projects.vercel.app",  # Vercel production
        "https://profitcalc-git-master-app74s-projects.vercel.app",  # Vercel git master
        "https://calc-jade-sigma.vercel.app",  # Alternative frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(options.router, prefix="/api/options", tags=["options"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Options Calculator API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """API health check"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
