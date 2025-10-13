# Phase 1: Analysis & Extraction Summary

## Project Overview
Rebuilding optionsprofitcalculator.com with a modern UI while preserving all functionality.

## Key Finding: Server-Side Architecture

After analyzing the downloaded site files, we discovered that **the original calculator performs all calculations server-side via API calls**. The downloaded HTML/JS/CSS files contain:

- ✅ UI structure and layout
- ✅ User interaction handling
- ✅ Data formatting utilities
- ❌ **NO actual calculation formulas**

### What We Found

#### API Architecture
The site makes AJAX calls to:
- `https://www.optionsprofitcalculator.com/ajax/calculate` - Main calculations
- `https://www.optionsprofitcalculator.com/ajax/getOptions` - Options chain data
- `https://www.optionsprofitcalculator.com/ajax/getStockPrice` - Stock prices

#### Constants Identified
```javascript
var OP_TYPE_CALL = 0;  // Call option identifier
var OP_TYPE_PUT = 1;   // Put option identifier
var REQ_PENDING = 1;   // Request status
var REQ_OK = 2;        // Success status
var REQ_ERROR = 3;     // Error status
```

#### Utility Functions Found
- `formatPrice(value, hideSymbol)` - Formats currency with $ symbol
- `roundTo(value, decimals, showDecimals, hideTrailingZeros)` - Number rounding
- Date/time formatting functions for expiration dates

## What We Need to Implement

Since the calculation logic is proprietary and server-side, we need to implement standard options pricing formulas ourselves.

### Core Calculation Formulas Required

#### 1. Basic Options Profit/Loss (Simple Payoff)

**Long Call:**
```
Profit/Loss = Max(0, Stock Price - Strike Price) × 100 - Premium Paid
Break-even = Strike Price + (Premium Paid / 100)
Max Profit = Unlimited
Max Loss = Premium Paid
```

**Long Put:**
```
Profit/Loss = Max(0, Strike Price - Stock Price) × 100 - Premium Paid
Break-even = Strike Price - (Premium Paid / 100)
Max Profit = (Strike Price × 100) - Premium Paid
Max Loss = Premium Paid
```

**Short Call:**
```
Profit/Loss = Premium Received - Max(0, Stock Price - Strike Price) × 100
Break-even = Strike Price + (Premium Received / 100)
Max Profit = Premium Received
Max Loss = Unlimited
```

**Short Put:**
```
Profit/Loss = Premium Received - Max(0, Strike Price - Stock Price) × 100
Break-even = Strike Price - (Premium Received / 100)
Max Profit = Premium Received
Max Loss = (Strike Price × 100) - Premium Received
```

#### 2. Black-Scholes Option Pricing Model

For theoretical option pricing and Greeks calculations:

**Variables:**
- S = Current stock price
- K = Strike price
- T = Time to expiration (in years)
- r = Risk-free interest rate
- σ (sigma) = Implied volatility
- N(x) = Cumulative standard normal distribution function

**Formulas:**
```
d1 = [ln(S/K) + (r + σ²/2) × T] / (σ × √T)
d2 = d1 - σ × √T

Call Price = S × N(d1) - K × e^(-r×T) × N(d2)
Put Price = K × e^(-r×T) × N(-d2) - S × N(-d1)
```

**Put-Call Parity:**
```
Call Price - Put Price = S - K × e^(-r×T)
```

#### 3. The Greeks (Risk Measures)

**Delta** - Rate of change of option price with respect to stock price:
```
Call Delta = N(d1)
Put Delta = N(d1) - 1
```

**Gamma** - Rate of change of Delta:
```
Gamma = φ(d1) / (S × σ × √T)
where φ(x) = (1/√(2π)) × e^(-x²/2)
```

**Theta** - Time decay (per day):
```
Call Theta = [-S × φ(d1) × σ / (2√T) - r × K × e^(-r×T) × N(d2)] / 365
Put Theta = [-S × φ(d1) × σ / (2√T) + r × K × e^(-r×T) × N(-d2)] / 365
```

**Vega** - Sensitivity to volatility changes:
```
Vega = S × φ(d1) × √T / 100
```

**Rho** - Sensitivity to interest rate changes:
```
Call Rho = K × T × e^(-r×T) × N(d2) / 100
Put Rho = -K × T × e^(-r×T) × N(-d2) / 100
```

#### 4. Multi-Leg Strategies

For spreads and complex strategies, calculate each leg separately and sum the results:

**General Formula:**
```
Total P/L = Σ(Leg P/L) for all legs
where each leg has:
- Position type (long/short)
- Option type (call/put)
- Strike price
- Premium
- Quantity
```

### Supported Strategies from Original Site

Based on the HTML structure, the site supports:

**Basic:**
1. Long Call (bullish)
2. Long Put (bearish)
3. Covered Call
4. Cash Secured Put
5. Naked Call (bearish)
6. Naked Put (bullish)

**Spreads:**
1. Credit Spread
2. Call Spread
3. Put Spread
4. Poor Man's Covered Call (PMCC)
5. Calendar Spread
6. Ratio Back Spread

**Advanced:**
1. Iron Condor
2. Butterfly Spread
3. Collar
4. Diagonal Spread
5. Double Diagonal Spread
6. Straddle
7. Strangle
8. Covered Strangle
9. Synthetic Put
10. Reverse Conversion

**Custom:**
- 2-8 leg custom strategies

### Input Parameters Needed

Based on the analysis, typical inputs are:
- **Stock Symbol** - For fetching current price and options data
- **Current Stock Price** - Underlying asset price
- **Strike Price(s)** - For each option leg
- **Premium** - Cost/credit per contract
- **Expiration Date** - Option expiry
- **Quantity** - Number of contracts
- **Position** - Long (buy) or Short (sell)
- **Option Type** - Call or Put
- **Volatility** - For theoretical pricing (optional)
- **Interest Rate** - For Black-Scholes (optional, default ~5%)

### Output Requirements

The calculator should display:

1. **Profit/Loss Chart**
   - X-axis: Stock price range (typically ±50% from current)
   - Y-axis: Profit/Loss in dollars
   - Multiple lines for different dates (if time value shown)

2. **Key Metrics**
   - Maximum Profit
   - Maximum Loss
   - Break-even Price(s)
   - Initial Cost/Credit
   - Return on Investment (ROI)

3. **Data Table**
   - Stock price points
   - P/L at each price point
   - P/L at expiration
   - Current value (if using Black-Scholes)

4. **Greeks** (optional, for advanced users)
   - Delta
   - Gamma
   - Theta
   - Vega
   - Rho

## Implementation Libraries to Consider

### JavaScript/TypeScript:
- **black-scholes** - NPM package for option pricing
- **finance.js** - Financial calculations
- **mathjs** - Advanced math operations
- **d3.js** or **Recharts** - Charting (we'll use Recharts per requirements)

### Math Functions Needed:
- Natural logarithm: `Math.log()`
- Exponential: `Math.exp()`
- Square root: `Math.sqrt()`
- Normal distribution function (needs custom implementation or library)

## Recommended Approach for Phase 2

1. **Start Simple**: Implement basic long call/put calculations first
2. **Add Visualization**: Get the chart working with simple data
3. **Enhance Calculations**: Add Black-Scholes and Greeks
4. **Build Multi-Leg Support**: Enable spreads and complex strategies
5. **Add Real Data**: Integrate with a market data API if desired

## Phase 1 Conclusion

✅ **Analysis Complete**
- Downloaded site uses server-side calculations
- No proprietary formulas available in client code
- Standard options math formulas identified and documented

➡️ **Ready for Phase 2**
- We have all the mathematical formulas needed
- We understand the input/output requirements
- We know the supported strategies
- Time to build the modern React application!

---

## Next Steps

1. Set up React project with TypeScript
2. Install dependencies (Tailwind CSS, Recharts, etc.)
3. Implement options calculation library
4. Build UI components
5. Create interactive calculator
