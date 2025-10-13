# Options Profit Calculator - Calculation Engine

A complete, type-safe TypeScript library for options pricing and profit/loss calculations.

## Features

- **Basic P/L Calculations**: Long/short calls and puts
- **Black-Scholes Pricing**: Theoretical option pricing
- **Greeks**: Delta, Gamma, Theta, Vega, Rho
- **Multi-Leg Strategies**: Support for complex multi-leg strategies
- **Break-Even Analysis**: Find break-even points using bisection method
- **Chart Data Generation**: Generate data for P/L visualization
- **Strategy Templates**: Pre-configured templates for common strategies
- **Comprehensive Validation**: Input validation with detailed error messages

## Installation

```bash
# This is a TypeScript library included in the project
# No separate installation required
```

## Quick Start

```typescript
import {
  calcLongCall,
  calcTotalPL,
  findBreakEvens,
  generatePLData,
  OptionType,
  Position,
} from '@/lib/calculations';

// Calculate single option P/L
const profit = calcLongCall(
  110,  // stock price
  100,  // strike price
  5,    // premium paid
  1     // quantity
);
console.log(profit); // 500 (profit at stock=$110)

// Calculate multi-leg strategy
const legs = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
    expiryDate: new Date('2025-12-31'),
  },
  {
    id: '2',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 105,
    premium: 2,
    quantity: 1,
    expiryDate: new Date('2025-12-31'),
  },
];

const totalPL = calcTotalPL(legs, 110);
console.log(totalPL); // 200 (bull call spread profit)

// Find break-even points
const breakEvens = findBreakEvens(legs, 100);
console.log(breakEvens); // [103]

// Generate chart data
const chartData = generatePLData(legs, 100, {
  priceRange: 0.5,
  points: 100,
});
```

## API Reference

### Basic P/L Functions

#### `calcLongCall(stockPrice, strikePrice, premium, quantity)`
Calculate profit/loss for a long call option.

**Parameters:**
- `stockPrice`: Current/future stock price
- `strikePrice`: Strike price of the option
- `premium`: Premium paid per share
- `quantity`: Number of contracts (default 1)

**Returns:** Profit or loss in dollars

**Example:**
```typescript
const profit = calcLongCall(110, 100, 5, 1);
// Returns: 500 (stock at $110, strike $100, paid $5 premium)
```

#### `calcLongPut(stockPrice, strikePrice, premium, quantity)`
Calculate profit/loss for a long put option.

#### `calcShortCall(stockPrice, strikePrice, premium, quantity)`
Calculate profit/loss for a short call option.

#### `calcShortPut(stockPrice, strikePrice, premium, quantity)`
Calculate profit/loss for a short put option.

#### `calcLegPL(leg, stockPrice)`
Calculate P/L for a single option leg. Automatically dispatches to appropriate function based on option type and position.

### Black-Scholes Functions

#### `blackScholes(params)`
Calculate theoretical option price using Black-Scholes model.

**Parameters:**
```typescript
{
  optionType: OptionType;
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;  // years
  riskFreeRate: number;  // decimal (0.05 = 5%)
  volatility: number;    // decimal (0.30 = 30%)
}
```

**Returns:**
```typescript
{
  optionPrice: number;
  d1: number;
  d2: number;
}
```

**Example:**
```typescript
const result = blackScholes({
  optionType: OptionType.CALL,
  stockPrice: 100,
  strikePrice: 100,
  timeToExpiry: 0.25,  // 3 months
  riskFreeRate: 0.05,
  volatility: 0.30,
});
console.log(result.optionPrice); // ~5.97
```

### Greeks Functions

#### `calcDelta(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)`
Calculate delta - sensitivity to stock price changes.

**Returns:** Delta value (0 to 1 for calls, -1 to 0 for puts)

#### `calcGamma(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)`
Calculate gamma - rate of change of delta.

#### `calcTheta(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)`
Calculate theta - time decay per day.

#### `calcVega(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)`
Calculate vega - sensitivity to volatility changes.

#### `calcRho(optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility)`
Calculate rho - sensitivity to interest rate changes.

#### `calcAggregateGreeks(legs, stockPrice, riskFreeRate, volatility)`
Calculate aggregate Greeks for a multi-leg strategy.

**Example:**
```typescript
const greeks = calcAggregateGreeks(legs, 100, 0.05, 0.30);
console.log(greeks);
// {
//   delta: 0.54,
//   gamma: 0.019,
//   theta: -0.027,
//   vega: 0.199,
//   rho: 0.125
// }
```

### Multi-Leg Functions

#### `calcTotalPL(legs, stockPrice)`
Calculate total profit/loss across all legs at a given stock price.

#### `calcInitialCost(legs)`
Calculate initial cost/credit for a strategy.
- Returns negative value for net debit (cost to enter)
- Returns positive value for net credit (receive premium)

#### `calcStrategyMaxProfit(legs, currentStockPrice)`
Calculate maximum profit for a strategy. Returns `null` if unlimited.

#### `calcStrategyMaxLoss(legs, currentStockPrice)`
Calculate maximum loss for a strategy. Returns `null` if unlimited.

### Break-Even Functions

#### `findBreakEvens(legs, currentStockPrice, priceRange, precision)`
Find all break-even points for a multi-leg strategy.

**Parameters:**
- `legs`: Array of option legs
- `currentStockPrice`: Current stock price
- `priceRange`: Percentage range to search (default 0.5 = ±50%)
- `precision`: Precision for break-even prices (default 0.001)

**Returns:** Array of break-even stock prices, sorted ascending

**Example:**
```typescript
const breakEvens = findBreakEvens(legs, 100, 0.5);
console.log(breakEvens); // [52.0, 105.0]
```

### Chart Data Functions

#### `generatePLData(legs, currentStockPrice, config)`
Generate chart data points for P/L visualization.

**Config Options:**
```typescript
{
  priceRange?: number;     // +/- percentage (default 0.5)
  points?: number;         // number of data points (default 100)
  showTimeValue?: boolean; // show current vs expiration (default false)
}
```

**Returns:**
```typescript
Array<{
  stockPrice: number;
  profitLoss: number;
  breakevenPoint?: boolean;
}>
```

**Example:**
```typescript
const chartData = generatePLData(legs, 100, {
  priceRange: 0.5,  // ±50%
  points: 100
});

// Use with Recharts
<LineChart data={chartData}>
  <Line dataKey="profitLoss" />
</LineChart>
```

### Validation Functions

#### `validateInputs(inputs)`
Validate complete calculation inputs.

**Returns:**
```typescript
{
  isValid: boolean;
  errors: Array<{ field: string; message: string; }>
}
```

**Example:**
```typescript
const validation = validateInputs({
  currentStockPrice: 100,
  legs: [...],
});

if (!validation.isValid) {
  console.error(validation.errors);
}
```

### Utility Functions

#### Formatters
- `formatCurrency(value, options)` - Format as currency ($1,234.56)
- `formatPercentage(value, decimals)` - Format as percentage (25.34%)
- `formatProfitLoss(value)` - Format P/L with color indication
- `formatDate(date, format)` - Format date string
- `formatGreek(greekName, value)` - Format Greek value

#### Time Functions
- `addDays(date, days)` - Add days to a date
- `addMonths(date, months)` - Add months to a date
- `getNextExpiryDate(fromDate)` - Get next option expiry (3rd Friday)
- `isWeekend(date)` - Check if date is weekend
- `getThirdFriday(year, month)` - Get 3rd Friday of month

## Constants

### Contract Multiplier
```typescript
import { CONTRACT_MULTIPLIER } from '@/lib/constants/defaults';
// 100 shares per contract
```

### Default Values
```typescript
import {
  DEFAULT_RISK_FREE_RATE,  // 0.05 (5%)
  DEFAULT_VOLATILITY,      // 0.30 (30%)
  DEFAULT_PRICE_RANGE,     // 0.5 (±50%)
  DEFAULT_CHART_POINTS,    // 100 points
} from '@/lib/constants/defaults';
```

### Strategy Templates
```typescript
import { STRATEGY_TEMPLATES, getStrategyTemplate } from '@/lib/constants/strategies';

const template = getStrategyTemplate(StrategyType.BULL_CALL_SPREAD);
console.log(template.name); // "Bull Call Spread"
console.log(template.explanation); // Full explanation
console.log(template.advantages); // Array of advantages
```

## Error Handling

The library uses custom error classes with error codes:

```typescript
import { CalculationError, ErrorCode } from '@/lib/types/errors';

try {
  const result = calcLongCall(-10, 100, 5, 1); // Invalid stock price
} catch (error) {
  if (error instanceof CalculationError) {
    console.log(error.code); // ErrorCode.INVALID_INPUT
    console.log(error.message); // "Stock price must be greater than 0"
    console.log(error.context); // { stockPrice: -10 }
  }
}
```

**Error Codes:**
- `INVALID_INPUT` - Invalid input values
- `CALCULATION_FAILED` - Calculation error
- `EXPIRED_OPTION` - Option has expired
- `INVALID_DATE` - Invalid date format
- `DIVISION_BY_ZERO` - Division by zero detected
- `NUMERICAL_INSTABILITY` - Numerical method failed to converge

## Examples

### Example 1: Long Call

```typescript
import { calcLongCall, calcSingleOptionBreakEven } from '@/lib/calculations';

const stockPrice = 110;
const strikePrice = 100;
const premium = 5;
const quantity = 1;

// Calculate P/L at current stock price
const profitLoss = calcLongCall(stockPrice, strikePrice, premium, quantity);
console.log(`P/L: $${profitLoss}`); // P/L: $500

// Calculate break-even
const breakEven = calcSingleOptionBreakEven(OptionType.CALL, strikePrice, premium);
console.log(`Break-Even: $${breakEven}`); // Break-Even: $105
```

### Example 2: Bull Call Spread

```typescript
import {
  calcTotalPL,
  calcInitialCost,
  findBreakEvens,
  generatePLData,
  OptionType,
  Position,
} from '@/lib/calculations';

const legs = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
    expiryDate: new Date('2025-12-31'),
  },
  {
    id: '2',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 105,
    premium: 2,
    quantity: 1,
    expiryDate: new Date('2025-12-31'),
  },
];

// Initial cost
const cost = calcInitialCost(legs);
console.log(`Initial Cost: $${cost}`); // -300 (net debit)

// P/L at various prices
console.log(`P/L at $95: $${calcTotalPL(legs, 95)}`);   // -300 (max loss)
console.log(`P/L at $103: $${calcTotalPL(legs, 103)}`); // 0 (break-even)
console.log(`P/L at $110: $${calcTotalPL(legs, 110)}`); // 200 (max profit)

// Break-even
const breakEvens = findBreakEvens(legs, 100);
console.log(`Break-Even: $${breakEvens[0]}`); // 103

// Generate chart data
const chartData = generatePLData(legs, 100);
// Use with charting library
```

### Example 3: Black-Scholes with Greeks

```typescript
import {
  blackScholes,
  calcAggregateGreeks,
  OptionType,
} from '@/lib/calculations';

// Price an ATM call option
const price = blackScholes({
  optionType: OptionType.CALL,
  stockPrice: 100,
  strikePrice: 100,
  timeToExpiry: 0.25,  // 3 months
  riskFreeRate: 0.05,
  volatility: 0.30,
});

console.log(`Option Price: $${price.optionPrice.toFixed(2)}`);

// Calculate Greeks for strategy
const greeks = calcAggregateGreeks(legs, 100, 0.05, 0.30);
console.log(`Delta: ${greeks.delta.toFixed(2)}`);
console.log(`Theta: ${greeks.theta.toFixed(2)} per day`);
```

## Testing

Run the test suite:

```bash
ts-node src/lib/__tests__/calculations.test.ts
```

The test suite includes:
- Basic P/L calculations (8 tests)
- Helper functions (3 tests)
- Black-Scholes pricing (4 tests)
- Greeks calculations (5 tests)
- Multi-leg strategies (4 tests)

## License

This library is part of the Options Profit Calculator project.

## Contributing

When adding new calculations:
1. Add TypeScript types to `src/lib/types/`
2. Implement calculation in appropriate module
3. Add exports to `src/lib/calculations/index.ts`
4. Add tests to verify correctness
5. Update this README with documentation
