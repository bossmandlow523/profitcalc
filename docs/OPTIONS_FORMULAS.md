# Options Pricing Formulas - Implementation Guide

This document contains all the mathematical formulas needed to rebuild the options calculator, with detailed explanations and implementation notes.

## Table of Contents
1. [Basic Concepts](#basic-concepts)
2. [Simple Profit/Loss Calculations](#simple-profitloss-calculations)
3. [Break-Even Calculations](#break-even-calculations)
4. [Black-Scholes Model](#black-scholes-model)
5. [The Greeks](#the-greeks)
6. [Multi-Leg Strategies](#multi-leg-strategies)
7. [Helper Functions](#helper-functions)

---

## Basic Concepts

### Contract Multiplier
- Each option contract typically represents **100 shares**
- Premium is quoted per share, but paid per contract
- Example: Premium of $2.50 = $250 per contract (2.50 × 100)

### Long vs Short Positions
- **Long (Buy)**: You pay premium, have the right to exercise
- **Short (Sell/Write)**: You receive premium, have the obligation if assigned

### Call vs Put Options
- **Call**: Right to BUY stock at strike price
- **Put**: Right to SELL stock at strike price

---

## Simple Profit/Loss Calculations

These formulas calculate the profit/loss at expiration (ignoring time value and Greeks).

### Long Call

**Description**: Buying a call option - bullish strategy

**Inputs**:
- `stockPrice`: Current/future stock price at expiration
- `strikePrice`: The strike price of the option
- `premium`: Premium paid per share
- `quantity`: Number of contracts (default 1)

**Formulas**:
```javascript
/**
 * Calculate profit/loss for a long call position
 * @param {number} stockPrice - Stock price at expiration
 * @param {number} strikePrice - Strike price of the call
 * @param {number} premium - Premium paid per share
 * @param {number} quantity - Number of contracts
 * @returns {number} Profit or loss in dollars
 */
function calcLongCall(stockPrice, strikePrice, premium, quantity = 1) {
  // Intrinsic value at expiration
  const intrinsicValue = Math.max(0, stockPrice - strikePrice);

  // Profit/Loss = (Intrinsic Value - Premium Paid) × 100 × Quantity
  const profitLoss = (intrinsicValue - premium) * 100 * quantity;

  return profitLoss;
}

// Break-even point
const breakEvenLongCall = (strikePrice, premium) => strikePrice + premium;

// Maximum profit (unlimited)
const maxProfitLongCall = Infinity;

// Maximum loss (premium paid)
const maxLossLongCall = (premium, quantity) => -premium * 100 * quantity;
```

**Example**:
- Buy 1 call at $50 strike for $2.00 premium
- Stock at expiration: $55
- Profit = (55 - 50 - 2) × 100 = $300

### Long Put

**Description**: Buying a put option - bearish strategy

**Formulas**:
```javascript
/**
 * Calculate profit/loss for a long put position
 * @param {number} stockPrice - Stock price at expiration
 * @param {number} strikePrice - Strike price of the put
 * @param {number} premium - Premium paid per share
 * @param {number} quantity - Number of contracts
 * @returns {number} Profit or loss in dollars
 */
function calcLongPut(stockPrice, strikePrice, premium, quantity = 1) {
  // Intrinsic value at expiration
  const intrinsicValue = Math.max(0, strikePrice - stockPrice);

  // Profit/Loss = (Intrinsic Value - Premium Paid) × 100 × Quantity
  const profitLoss = (intrinsicValue - premium) * 100 * quantity;

  return profitLoss;
}

// Break-even point
const breakEvenLongPut = (strikePrice, premium) => strikePrice - premium;

// Maximum profit (strike price minus premium)
const maxProfitLongPut = (strikePrice, premium, quantity) =>
  (strikePrice - premium) * 100 * quantity;

// Maximum loss (premium paid)
const maxLossLongPut = (premium, quantity) => -premium * 100 * quantity;
```

**Example**:
- Buy 1 put at $50 strike for $2.00 premium
- Stock at expiration: $45
- Profit = (50 - 45 - 2) × 100 = $300

### Short Call

**Description**: Selling/writing a call option - bearish/neutral strategy

**Formulas**:
```javascript
/**
 * Calculate profit/loss for a short call position
 * @param {number} stockPrice - Stock price at expiration
 * @param {number} strikePrice - Strike price of the call
 * @param {number} premium - Premium received per share
 * @param {number} quantity - Number of contracts
 * @returns {number} Profit or loss in dollars
 */
function calcShortCall(stockPrice, strikePrice, premium, quantity = 1) {
  // Intrinsic value at expiration (your obligation)
  const intrinsicValue = Math.max(0, stockPrice - strikePrice);

  // Profit/Loss = (Premium Received - Intrinsic Value) × 100 × Quantity
  const profitLoss = (premium - intrinsicValue) * 100 * quantity;

  return profitLoss;
}

// Break-even point
const breakEvenShortCall = (strikePrice, premium) => strikePrice + premium;

// Maximum profit (premium received)
const maxProfitShortCall = (premium, quantity) => premium * 100 * quantity;

// Maximum loss (unlimited)
const maxLossShortCall = -Infinity;
```

**Example**:
- Sell 1 call at $50 strike for $2.00 premium
- Stock at expiration: $55
- Loss = (2 - (55 - 50)) × 100 = -$300

### Short Put

**Description**: Selling/writing a put option - bullish/neutral strategy

**Formulas**:
```javascript
/**
 * Calculate profit/loss for a short put position
 * @param {number} stockPrice - Stock price at expiration
 * @param {number} strikePrice - Strike price of the put
 * @param {number} premium - Premium received per share
 * @param {number} quantity - Number of contracts
 * @returns {number} Profit or loss in dollars
 */
function calcShortPut(stockPrice, strikePrice, premium, quantity = 1) {
  // Intrinsic value at expiration (your obligation)
  const intrinsicValue = Math.max(0, strikePrice - stockPrice);

  // Profit/Loss = (Premium Received - Intrinsic Value) × 100 × Quantity
  const profitLoss = (premium - intrinsicValue) * 100 * quantity;

  return profitLoss;
}

// Break-even point
const breakEvenShortPut = (strikePrice, premium) => strikePrice - premium;

// Maximum profit (premium received)
const maxProfitShortPut = (premium, quantity) => premium * 100 * quantity;

// Maximum loss (strike price minus premium)
const maxLossShortPut = (strikePrice, premium, quantity) =>
  -(strikePrice - premium) * 100 * quantity;
```

**Example**:
- Sell 1 put at $50 strike for $2.00 premium
- Stock at expiration: $45
- Loss = (2 - (50 - 45)) × 100 = -$300

---

## Break-Even Calculations

Break-even price is where profit/loss equals zero.

### Single Option Break-Even

```javascript
/**
 * Calculate break-even price for a single option
 * @param {string} optionType - 'call' or 'put'
 * @param {string} position - 'long' or 'short'
 * @param {number} strikePrice - Strike price
 * @param {number} premium - Premium per share
 * @returns {number} Break-even stock price
 */
function calcBreakEven(optionType, position, strikePrice, premium) {
  if (optionType === 'call') {
    // For both long and short calls
    return strikePrice + premium;
  } else if (optionType === 'put') {
    // For both long and short puts
    return strikePrice - premium;
  }
}
```

### Multi-Leg Break-Even

For strategies with multiple legs, solve for stock price where total P/L = 0.

```javascript
/**
 * Find break-even point(s) for multi-leg strategy
 * Uses numerical method to find where total P/L crosses zero
 * @param {Array} legs - Array of leg objects
 * @param {number} minPrice - Minimum price to search
 * @param {number} maxPrice - Maximum price to search
 * @returns {Array} Array of break-even prices
 */
function findBreakEvens(legs, minPrice, maxPrice) {
  const breakEvens = [];
  const step = 0.01; // Price increment

  let prevPL = calcTotalPL(legs, minPrice);

  for (let price = minPrice + step; price <= maxPrice; price += step) {
    const currentPL = calcTotalPL(legs, price);

    // Check if P/L crossed zero
    if ((prevPL < 0 && currentPL >= 0) || (prevPL > 0 && currentPL <= 0)) {
      breakEvens.push(price);
    }

    prevPL = currentPL;
  }

  return breakEvens;
}
```

---

## Black-Scholes Model

The Black-Scholes model prices European-style options using theoretical pricing.

### Required Helper Functions

```javascript
/**
 * Cumulative standard normal distribution function
 * Approximation of the normal CDF
 * @param {number} x - Input value
 * @returns {number} Probability
 */
function normalCDF(x) {
  // Constants for approximation
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  // Save the sign of x
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x) / Math.sqrt(2);

  // A&S formula 7.1.26
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

/**
 * Probability density function for standard normal distribution
 * φ(x) = (1/√(2π)) × e^(-x²/2)
 * @param {number} x - Input value
 * @returns {number} Probability density
 */
function normalPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}
```

### Black-Scholes Option Pricing

```javascript
/**
 * Calculate option price using Black-Scholes model
 * @param {string} optionType - 'call' or 'put'
 * @param {number} stockPrice - Current stock price (S)
 * @param {number} strikePrice - Strike price (K)
 * @param {number} timeToExpiry - Time to expiration in years (T)
 * @param {number} riskFreeRate - Risk-free interest rate (r) as decimal
 * @param {number} volatility - Implied volatility (σ) as decimal
 * @returns {number} Theoretical option price
 */
function blackScholes(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  // Handle edge cases
  if (timeToExpiry <= 0) {
    // At expiration, return intrinsic value
    if (optionType === 'call') {
      return Math.max(0, stockPrice - strikePrice);
    } else {
      return Math.max(0, strikePrice - stockPrice);
    }
  }

  // Calculate d1 and d2
  // d1 = [ln(S/K) + (r + σ²/2) × T] / (σ × √T)
  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));

  // d2 = d1 - σ × √T
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  // Calculate option price
  if (optionType === 'call') {
    // Call = S × N(d1) - K × e^(-r×T) × N(d2)
    return stockPrice * normalCDF(d1) -
           strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  } else if (optionType === 'put') {
    // Put = K × e^(-r×T) × N(-d2) - S × N(-d1)
    return strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) -
           stockPrice * normalCDF(-d1);
  }
}
```

### Time to Expiry Calculation

```javascript
/**
 * Calculate time to expiry in years
 * @param {Date|string} expiryDate - Expiration date
 * @returns {number} Years until expiration
 */
function calcTimeToExpiry(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);

  // Milliseconds to years (365.25 days per year)
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const timeToExpiry = (expiry - now) / msPerYear;

  // Return at least 1 day to avoid division by zero
  return Math.max(timeToExpiry, 1 / 365.25);
}
```

---

## The Greeks

Greeks measure the sensitivity of option prices to various factors.

### Delta

**Definition**: Rate of change of option price with respect to stock price

```javascript
/**
 * Calculate Delta - first derivative with respect to stock price
 * Delta shows how much the option price changes per $1 move in stock
 * @param {string} optionType - 'call' or 'put'
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time in years
 * @param {number} riskFreeRate - Interest rate as decimal
 * @param {number} volatility - Volatility as decimal
 * @returns {number} Delta value
 */
function calcDelta(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  if (timeToExpiry <= 0) {
    // At expiration
    if (optionType === 'call') {
      return stockPrice >= strikePrice ? 1 : 0;
    } else {
      return stockPrice <= strikePrice ? -1 : 0;
    }
  }

  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));

  if (optionType === 'call') {
    return normalCDF(d1);
  } else {
    return normalCDF(d1) - 1;
  }
}
```

**Interpretation**:
- Call Delta: 0 to 1
- Put Delta: -1 to 0
- Delta of 0.50 means option moves $0.50 for every $1 move in stock

### Gamma

**Definition**: Rate of change of Delta with respect to stock price

```javascript
/**
 * Calculate Gamma - second derivative with respect to stock price
 * Gamma shows how much Delta changes per $1 move in stock
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time in years
 * @param {number} riskFreeRate - Interest rate as decimal
 * @param {number} volatility - Volatility as decimal
 * @returns {number} Gamma value
 */
function calcGamma(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  if (timeToExpiry <= 0) return 0;

  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));

  // Gamma = φ(d1) / (S × σ × √T)
  return normalPDF(d1) / (stockPrice * volatility * Math.sqrt(timeToExpiry));
}
```

**Interpretation**:
- Same for both calls and puts
- Highest at-the-money, lower in/out-of-the-money
- Increases as expiration approaches

### Theta

**Definition**: Rate of change of option price with respect to time (time decay)

```javascript
/**
 * Calculate Theta - time decay (per day)
 * Theta shows how much value the option loses per day
 * @param {string} optionType - 'call' or 'put'
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time in years
 * @param {number} riskFreeRate - Interest rate as decimal
 * @param {number} volatility - Volatility as decimal
 * @returns {number} Theta value (per day)
 */
function calcTheta(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  if (timeToExpiry <= 0) return 0;

  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  // Common term
  const term1 = -(stockPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry));

  if (optionType === 'call') {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
    // Convert to per-day by dividing by 365
    return (term1 - term2) / 365;
  } else {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
    return (term1 + term2) / 365;
  }
}
```

**Interpretation**:
- Usually negative (options lose value over time)
- Accelerates as expiration approaches
- Higher for at-the-money options

### Vega

**Definition**: Rate of change of option price with respect to volatility

```javascript
/**
 * Calculate Vega - sensitivity to volatility changes
 * Vega shows how much option price changes per 1% change in volatility
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time in years
 * @param {number} riskFreeRate - Interest rate as decimal
 * @param {number} volatility - Volatility as decimal
 * @returns {number} Vega value
 */
function calcVega(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  if (timeToExpiry <= 0) return 0;

  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));

  // Vega = S × φ(d1) × √T / 100
  // Divide by 100 to show impact of 1 percentage point change
  return stockPrice * normalPDF(d1) * Math.sqrt(timeToExpiry) / 100;
}
```

**Interpretation**:
- Same for both calls and puts
- Higher for longer-dated options
- Highest for at-the-money options

### Rho

**Definition**: Rate of change of option price with respect to interest rate

```javascript
/**
 * Calculate Rho - sensitivity to interest rate changes
 * Rho shows how much option price changes per 1% change in interest rates
 * @param {string} optionType - 'call' or 'put'
 * @param {number} stockPrice - Current stock price
 * @param {number} strikePrice - Strike price
 * @param {number} timeToExpiry - Time in years
 * @param {number} riskFreeRate - Interest rate as decimal
 * @param {number} volatility - Volatility as decimal
 * @returns {number} Rho value
 */
function calcRho(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility) {
  if (timeToExpiry <= 0) return 0;

  const d1 = (Math.log(stockPrice / strikePrice) +
              (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
             (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  if (optionType === 'call') {
    // Call Rho = K × T × e^(-r×T) × N(d2) / 100
    return strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2) / 100;
  } else {
    // Put Rho = -K × T × e^(-r×T) × N(-d2) / 100
    return -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) / 100;
  }
}
```

**Interpretation**:
- Call Rho is positive (calls benefit from higher rates)
- Put Rho is negative (puts benefit from lower rates)
- Less significant for most retail traders

---

## Multi-Leg Strategies

For complex strategies, calculate each leg independently and sum the results.

### Strategy Calculator

```javascript
/**
 * Represents a single option leg
 */
class OptionLeg {
  constructor(params) {
    this.optionType = params.optionType; // 'call' or 'put'
    this.position = params.position;     // 'long' or 'short'
    this.strikePrice = params.strikePrice;
    this.premium = params.premium;
    this.quantity = params.quantity || 1;
    this.expiryDate = params.expiryDate;
  }

  /**
   * Calculate P/L for this leg at a given stock price
   */
  calcPL(stockPrice) {
    let intrinsicValue;

    if (this.optionType === 'call') {
      intrinsicValue = Math.max(0, stockPrice - this.strikePrice);
    } else {
      intrinsicValue = Math.max(0, this.strikePrice - stockPrice);
    }

    let pl;
    if (this.position === 'long') {
      pl = (intrinsicValue - this.premium) * 100 * this.quantity;
    } else {
      pl = (this.premium - intrinsicValue) * 100 * this.quantity;
    }

    return pl;
  }
}

/**
 * Calculate total P/L for multi-leg strategy
 * @param {Array<OptionLeg>} legs - Array of option legs
 * @param {number} stockPrice - Stock price to evaluate
 * @returns {number} Total profit/loss
 */
function calcTotalPL(legs, stockPrice) {
  return legs.reduce((total, leg) => total + leg.calcPL(stockPrice), 0);
}

/**
 * Generate P/L data for charting
 * @param {Array<OptionLeg>} legs - Array of option legs
 * @param {number} currentPrice - Current stock price
 * @param {number} range - Percentage range (e.g., 0.5 for ±50%)
 * @param {number} points - Number of data points
 * @returns {Array} Array of {stockPrice, profitLoss} objects
 */
function generatePLData(legs, currentPrice, range = 0.5, points = 100) {
  const minPrice = currentPrice * (1 - range);
  const maxPrice = currentPrice * (1 + range);
  const step = (maxPrice - minPrice) / points;

  const data = [];
  for (let price = minPrice; price <= maxPrice; price += step) {
    data.push({
      stockPrice: Math.round(price * 100) / 100,
      profitLoss: calcTotalPL(legs, price)
    });
  }

  return data;
}
```

---

## Helper Functions

### Format Currency

```javascript
/**
 * Format number as currency
 * @param {number} value - Dollar amount
 * @param {boolean} showCents - Include cents
 * @returns {string} Formatted string
 */
function formatCurrency(value, showCents = true) {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  if (showCents) {
    return sign + '$' + absValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return sign + '$' + Math.round(absValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
```

### Input Validation

```javascript
/**
 * Validate option calculator inputs
 * @param {Object} inputs - Input parameters
 * @returns {Object} {isValid: boolean, errors: Array<string>}
 */
function validateInputs(inputs) {
  const errors = [];

  if (!inputs.stockPrice || inputs.stockPrice <= 0) {
    errors.push('Stock price must be greater than 0');
  }

  if (!inputs.strikePrice || inputs.strikePrice <= 0) {
    errors.push('Strike price must be greater than 0');
  }

  if (!inputs.premium || inputs.premium < 0) {
    errors.push('Premium must be 0 or greater');
  }

  if (!inputs.quantity || inputs.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }

  if (!inputs.expiryDate) {
    errors.push('Expiration date is required');
  } else {
    const expiry = new Date(inputs.expiryDate);
    const now = new Date();
    if (expiry <= now) {
      errors.push('Expiration date must be in the future');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## Constants and Defaults

```javascript
// Default values
const DEFAULT_RISK_FREE_RATE = 0.05;  // 5% annual
const DEFAULT_VOLATILITY = 0.30;       // 30% annualized
const CONTRACT_MULTIPLIER = 100;       // Shares per contract

// For charting
const DEFAULT_PRICE_RANGE = 0.5;       // ±50% from current price
const DEFAULT_CHART_POINTS = 100;      // Data points in chart

// Greeks display thresholds
const THETA_DISPLAY_SCALE = 1;         // Show per day
const VEGA_DISPLAY_SCALE = 0.01;       // Show per 1% volatility change
const RHO_DISPLAY_SCALE = 0.01;        // Show per 1% interest rate change
```

---

## References

- **Black, Fischer; Myron Scholes (1973)**. "The Pricing of Options and Corporate Liabilities". Journal of Political Economy.
- **Hull, John C. (2017)**. "Options, Futures, and Other Derivatives" (10th ed.). Pearson.
- **Natenberg, Sheldon (1994)**. "Option Volatility and Pricing". McGraw-Hill.

---

## Implementation Notes

### Accuracy Considerations
1. The normal CDF approximation is accurate to 6 decimal places
2. Time calculations should account for market hours vs calendar days
3. Interest rates vary - use current Treasury yields for accuracy
4. Implied volatility should be stock-specific when available

### Performance Optimization
1. Cache Greek calculations if inputs haven't changed
2. Throttle real-time calculations on input changes
3. Use Web Workers for heavy calculations
4. Pre-calculate common strike prices

### Edge Cases to Handle
1. **Time = 0**: Option expires, only intrinsic value remains
2. **Volatility = 0**: Can cause division by zero in Black-Scholes
3. **Very deep ITM/OTM**: CDF values approach 0 or 1
4. **Negative prices**: Theoretical but impossible, validate inputs
