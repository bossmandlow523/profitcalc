"""
Stock API Routes
Endpoints for stock quotes, volatility, and symbol search
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.yfinance_service import YFinanceService

router = APIRouter()
yf_service = YFinanceService()


@router.get("/{symbol}/quote")
async def get_stock_quote(symbol: str, includeExtendedHours: Optional[bool] = False):
    """
    Get current stock quote

    - **symbol**: Stock ticker symbol (e.g., AAPL)
    - **includeExtendedHours**: Include extended hours trading data (not implemented yet)

    Returns stock price, change, volume, and other quote data
    """
    try:
        data = yf_service.get_stock_quote(symbol.upper())
        return {
            "data": data,
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "cached": False
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{symbol}/volatility")
async def get_volatility(
    symbol: str,
    period: Optional[int] = Query(30, ge=1, le=365, description="Days for HV calculation")
):
    """
    Get volatility metrics for a symbol

    - **symbol**: Stock ticker symbol
    - **period**: Number of days for historical volatility calculation (1-365)

    Returns IV, HV, IV Rank, and IV Percentile
    """
    try:
        data = yf_service.get_volatility(symbol.upper(), period)
        return {
            "data": data,
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "cached": False
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{symbol}/validate")
async def validate_symbol(symbol: str):
    """
    Validate if a symbol exists and is optionable

    - **symbol**: Stock ticker symbol

    Returns validation status and basic info
    """
    try:
        data = yf_service.validate_symbol(symbol.upper())
        return {
            "data": data,
            "status": "success",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/search")
async def search_symbols(q: str = Query(..., min_length=1, max_length=10)):
    """
    Search for stock symbols

    - **q**: Search query (1-10 characters)

    Returns list of matching symbols with names
    """
    try:
        results = yf_service.search_symbols(q.upper())
        return {
            "data": results,
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "cached": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
