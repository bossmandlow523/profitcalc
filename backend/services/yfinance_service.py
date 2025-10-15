"""
Yahoo Finance Service
Wrapper around yfinance library with error handling and caching
"""

import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

class YFinanceService:
    """Service for fetching market data from Yahoo Finance"""

    @staticmethod
    def get_stock_quote(symbol: str) -> Dict[str, Any]:
        """
        Get current stock quote data

        Args:
            symbol: Stock ticker symbol (e.g., 'AAPL')

        Returns:
            Dict containing price, change, volume, etc.

        Raises:
            ValueError: If symbol is invalid or data unavailable
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            # Get the most recent price data
            hist = ticker.history(period="1d")

            if hist.empty:
                raise ValueError(f"No data available for symbol: {symbol}")

            current_price = hist['Close'].iloc[-1]
            previous_close = info.get('previousClose', hist['Close'].iloc[-1])

            # Calculate change
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100 if previous_close else 0

            return {
                "symbol": symbol.upper(),
                "price": float(current_price),
                "change": float(change),
                "changePercent": float(change_percent),
                "volume": int(hist['Volume'].iloc[-1]) if 'Volume' in hist else 0,
                "marketCap": info.get('marketCap'),
                "high52Week": info.get('fiftyTwoWeekHigh'),
                "low52Week": info.get('fiftyTwoWeekLow'),
                "previousClose": float(previous_close),
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error fetching stock quote for {symbol}: {str(e)}")
            raise ValueError(f"Failed to fetch data for {symbol}: {str(e)}")

    @staticmethod
    def get_expiry_dates(symbol: str) -> List[Dict[str, Any]]:
        """
        Get available options expiry dates for a symbol

        Args:
            symbol: Stock ticker symbol

        Returns:
            List of expiry dates with metadata
        """
        try:
            ticker = yf.Ticker(symbol)
            expiry_dates = ticker.options

            if not expiry_dates:
                raise ValueError(f"No options available for {symbol}")

            result = []
            today = datetime.now()

            for expiry_str in expiry_dates:
                expiry_date = datetime.strptime(expiry_str, "%Y-%m-%d")
                days_until = (expiry_date - today).days

                # Determine expiry type
                is_monthly = expiry_date.day >= 15 and expiry_date.day <= 21
                is_weekly = not is_monthly
                is_leaps = days_until > 365

                expiry_type = "leaps" if is_leaps else ("monthly" if is_monthly else "weekly")

                result.append({
                    "date": expiry_str,
                    "type": expiry_type,
                    "daysUntilExpiry": days_until,
                    "isStandard": is_monthly
                })

            return result

        except Exception as e:
            logger.error(f"Error fetching expiry dates for {symbol}: {str(e)}")
            raise ValueError(f"Failed to fetch expiry dates: {str(e)}")

    @staticmethod
    def get_options_chain(
        symbol: str,
        expiry_date: Optional[str] = None,
        min_strike: Optional[float] = None,
        max_strike: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Get options chain data for a symbol

        Args:
            symbol: Stock ticker symbol
            expiry_date: Specific expiry date (YYYY-MM-DD) or None for nearest
            min_strike: Minimum strike price filter
            max_strike: Maximum strike price filter

        Returns:
            Dict containing calls, puts, strikes, and underlying price
        """
        try:
            ticker = yf.Ticker(symbol)

            # Get expiry date
            if expiry_date is None:
                expiry_dates = ticker.options
                if not expiry_dates:
                    raise ValueError(f"No options available for {symbol}")
                expiry_date = expiry_dates[0]

            # Get options chain
            chain = ticker.option_chain(expiry_date)
            calls_df = chain.calls
            puts_df = chain.puts

            # Get current stock price
            hist = ticker.history(period="1d")
            underlying_price = float(hist['Close'].iloc[-1]) if not hist.empty else 0

            # Filter by strike range if provided
            if min_strike is not None:
                calls_df = calls_df[calls_df['strike'] >= min_strike]
                puts_df = puts_df[puts_df['strike'] >= min_strike]

            if max_strike is not None:
                calls_df = calls_df[calls_df['strike'] <= max_strike]
                puts_df = puts_df[puts_df['strike'] <= max_strike]

            # Convert to list of dicts
            def process_options(df, option_type: str) -> List[Dict]:
                options = []
                for _, row in df.iterrows():
                    strike = float(row['strike'])
                    last_price = float(row['lastPrice'])

                    # Calculate intrinsic and extrinsic value
                    if option_type == 'call':
                        intrinsic = max(0, underlying_price - strike)
                    else:
                        intrinsic = max(0, strike - underlying_price)

                    extrinsic = max(0, last_price - intrinsic)
                    in_the_money = intrinsic > 0

                    options.append({
                        "symbol": row.get('contractSymbol', ''),
                        "underlying": symbol.upper(),
                        "strikePrice": strike,
                        "expiryDate": expiry_date,
                        "optionType": option_type,
                        "bid": float(row.get('bid', 0)),
                        "ask": float(row.get('ask', 0)),
                        "lastPrice": last_price,
                        "mark": float((row.get('bid', 0) + row.get('ask', 0)) / 2),
                        "volume": int(row.get('volume', 0)),
                        "openInterest": int(row.get('openInterest', 0)),
                        "delta": None,  # yfinance doesn't provide greeks
                        "gamma": None,
                        "theta": None,
                        "vega": None,
                        "rho": None,
                        "impliedVolatility": float(row.get('impliedVolatility', 0)),
                        "inTheMoney": in_the_money,
                        "intrinsicValue": intrinsic,
                        "extrinsicValue": extrinsic,
                        "timestamp": datetime.now().isoformat()
                    })
                return options

            calls = process_options(calls_df, 'call')
            puts = process_options(puts_df, 'put')

            # Get unique strikes
            strikes = sorted(list(set([c['strikePrice'] for c in calls])))

            return {
                "underlying": symbol.upper(),
                "underlyingPrice": underlying_price,
                "timestamp": datetime.now().isoformat(),
                "expiryDates": list(ticker.options),
                "strikes": strikes,
                "calls": calls,
                "puts": puts
            }

        except Exception as e:
            logger.error(f"Error fetching options chain for {symbol}: {str(e)}")
            raise ValueError(f"Failed to fetch options chain: {str(e)}")

    @staticmethod
    def get_volatility(symbol: str, period: int = 30) -> Dict[str, Any]:
        """
        Get volatility metrics for a symbol

        Args:
            symbol: Stock ticker symbol
            period: Days for historical volatility calculation

        Returns:
            Dict containing IV, HV, IV rank, etc.
        """
        try:
            ticker = yf.Ticker(symbol)

            # Get historical data for HV calculation
            hist = ticker.history(period=f"{period}d")

            if hist.empty or len(hist) < 2:
                raise ValueError(f"Insufficient data for volatility calculation")

            # Calculate historical volatility (annualized)
            returns = hist['Close'].pct_change().dropna()
            hv = float(returns.std() * (252 ** 0.5))  # Annualize

            # Get implied volatility from nearest ATM option
            try:
                chain = ticker.option_chain(ticker.options[0])
                current_price = float(hist['Close'].iloc[-1])

                # Find ATM call option
                atm_call = chain.calls.iloc[(chain.calls['strike'] - current_price).abs().argsort()[:1]]
                iv = float(atm_call['impliedVolatility'].iloc[0]) if not atm_call.empty else hv
            except:
                iv = hv  # Fallback to HV if IV unavailable

            # Calculate IV rank (simplified - would need historical IV data for accurate calc)
            iv_rank = min(100, max(0, (iv / hv) * 50))  # Simplified calculation

            return {
                "symbol": symbol.upper(),
                "impliedVolatility": iv,
                "historicalVolatility": hv,
                "ivRank": iv_rank,
                "ivPercentile": iv_rank,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error calculating volatility for {symbol}: {str(e)}")
            raise ValueError(f"Failed to calculate volatility: {str(e)}")

    @staticmethod
    @lru_cache(maxsize=100)
    def search_symbols(query: str) -> List[Dict[str, str]]:
        """
        Search for stock symbols

        Note: This is a simplified version. For production, consider using
        a dedicated symbol search API or maintaining a local database.

        Args:
            query: Search query

        Returns:
            List of matching symbols with names
        """
        # Common symbols for demo - in production, use a proper search API
        common_symbols = {
            "AAPL": "Apple Inc.",
            "MSFT": "Microsoft Corporation",
            "GOOGL": "Alphabet Inc.",
            "AMZN": "Amazon.com Inc.",
            "META": "Meta Platforms Inc.",
            "TSLA": "Tesla Inc.",
            "NVDA": "NVIDIA Corporation",
            "SPY": "SPDR S&P 500 ETF Trust",
            "QQQ": "Invesco QQQ Trust",
            "AMD": "Advanced Micro Devices Inc.",
            "NFLX": "Netflix Inc.",
            "DIS": "The Walt Disney Company",
            "BA": "The Boeing Company",
            "JPM": "JPMorgan Chase & Co.",
            "V": "Visa Inc.",
        }

        query_upper = query.upper()
        results = []

        for symbol, name in common_symbols.items():
            if query_upper in symbol or query_upper.lower() in name.lower():
                results.append({
                    "symbol": symbol,
                    "name": name
                })

        # Try to fetch the symbol directly if not in common list
        if not results and len(query) <= 5:
            try:
                ticker = yf.Ticker(query.upper())
                info = ticker.info
                if info and 'symbol' in info:
                    results.append({
                        "symbol": query.upper(),
                        "name": info.get('longName', query.upper())
                    })
            except:
                pass

        return results[:10]  # Limit to 10 results

    @staticmethod
    def validate_symbol(symbol: str) -> Dict[str, Any]:
        """
        Validate if a symbol exists and is optionable

        Args:
            symbol: Stock ticker symbol

        Returns:
            Dict with validation results
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            # Check if symbol is valid
            valid = 'symbol' in info and info.get('symbol') is not None

            # Check if optionable
            try:
                options = ticker.options
                optionable = len(options) > 0
            except:
                optionable = False

            return {
                "valid": valid,
                "optionable": optionable,
                "name": info.get('longName', symbol.upper()) if valid else ""
            }

        except Exception as e:
            logger.error(f"Error validating symbol {symbol}: {str(e)}")
            return {
                "valid": False,
                "optionable": False,
                "name": ""
            }
