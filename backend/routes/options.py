"""
Options API Routes
Endpoints for options chains and expiry dates
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


@router.get("/{symbol}/expiries")
async def get_expiry_dates(
    symbol: str,
    includeWeeklies: Optional[bool] = True,
    includeMonthlies: Optional[bool] = True,
    includeQuarterlies: Optional[bool] = True,
    includeLeaps: Optional[bool] = True,
    minDaysOut: Optional[int] = None,
    maxDaysOut: Optional[int] = None
):
    """
    Get available options expiry dates

    - **symbol**: Stock ticker symbol
    - **includeWeeklies**: Include weekly expiries
    - **includeMonthlies**: Include monthly expiries
    - **includeQuarterlies**: Include quarterly expiries
    - **includeLeaps**: Include LEAPS (>1 year)
    - **minDaysOut**: Minimum days until expiry
    - **maxDaysOut**: Maximum days until expiry

    Returns list of available expiry dates with metadata
    """
    try:
        all_expiries = yf_service.get_expiry_dates(symbol.upper())

        # Filter by type
        filtered = []
        for expiry in all_expiries:
            if expiry['type'] == 'weekly' and not includeWeeklies:
                continue
            if expiry['type'] == 'monthly' and not includeMonthlies:
                continue
            if expiry['type'] == 'quarterly' and not includeQuarterlies:
                continue
            if expiry['type'] == 'leaps' and not includeLeaps:
                continue

            # Filter by days out
            days = expiry['daysUntilExpiry']
            if minDaysOut is not None and days < minDaysOut:
                continue
            if maxDaysOut is not None and days > maxDaysOut:
                continue

            filtered.append(expiry)

        response_data = {
            "symbol": symbol.upper(),
            "expiryDates": filtered,
            "timestamp": datetime.now().isoformat()
        }

        return {
            "data": response_data,
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "cached": False
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{symbol}/chain")
async def get_options_chain(
    symbol: str,
    expiryDate: Optional[str] = Query(None, description="Expiry date (YYYY-MM-DD)"),
    minStrike: Optional[float] = Query(None, description="Minimum strike price"),
    maxStrike: Optional[float] = Query(None, description="Maximum strike price"),
    includeGreeks: Optional[bool] = Query(True, description="Include Greeks (not available via yfinance)")
):
    """
    Get options chain data

    - **symbol**: Stock ticker symbol
    - **expiryDate**: Specific expiry date (YYYY-MM-DD) or nearest if not provided
    - **minStrike**: Minimum strike price to include
    - **maxStrike**: Maximum strike price to include
    - **includeGreeks**: Include Greeks in response (note: yfinance doesn't provide Greeks)

    Returns options chain with calls, puts, strikes, and underlying price
    """
    try:
        data = yf_service.get_options_chain(
            symbol.upper(),
            expiry_date=expiryDate,
            min_strike=minStrike,
            max_strike=maxStrike
        )

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
