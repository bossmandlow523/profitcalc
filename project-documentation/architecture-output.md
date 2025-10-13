# Options Profit Calculator - Technical Architecture Document

**Version:** 1.0
**Date:** October 12, 2025
**Status:** Design Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [Calculation Engine Design](#calculation-engine-design)
6. [Component Architecture](#component-architecture)
7. [File and Folder Structure](#file-and-folder-structure)
8. [State Management Strategy](#state-management-strategy)
9. [Data Flow Architecture](#data-flow-architecture)
10. [Implementation Phases](#implementation-phases)
11. [Performance Considerations](#performance-considerations)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Architecture](#deployment-architecture)

---

## Executive Summary

This document defines the complete technical architecture for rebuilding optionsprofitcalculator.com as a modern, client-side web application. The architecture prioritizes:

- **Calculation Accuracy**: Implements proven options pricing formulas
- **Performance**: Client-side calculations with no backend dependencies
- **Maintainability**: Clean separation of concerns with TypeScript
- **Extensibility**: Easily add new strategies and features
- **User Experience**: Real-time feedback with responsive design

### Core Principles

1. **Pure Function Architecture**: All calculations are pure functions for testability
2. **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors
3. **Separation of Concerns**: Clear boundaries between calculation, state, and presentation
4. **Mobile-First**: Responsive design from the ground up
5. **Progressive Enhancement**: Basic functionality works, advanced features enhance

---

## Technology Stack

### Frontend Framework

**React 18.3+ with TypeScript 5.5+**

**Justification:**
- Component-based architecture fits calculator's modular nature
- Hooks provide clean state management
- TypeScript ensures type safety for complex calculations
- Large ecosystem and community support

**Build Tool: Vite 6+**
- Fast development server with HMR
- Optimized production builds
- Native ESM support
- Superior TypeScript integration

### Styling

**Tailwind CSS 3.4+**
- Utility-first approach speeds development
- Built-in responsive design utilities
- Easy dark mode implementation
- Minimal CSS bundle with purging

**shadcn/ui Component Library**
- Pre-built accessible components via MCP
- Customizable with Tailwind
- Consistent design system
- Dark mode support out of the box

### State Management

**Zustand 4.5+**

**Justification:**
- Lightweight (~1KB) compared to Redux
- Simple API with hooks
- No boilerplate required
- Perfect for calculator state that needs to be shared across components
- Built-in TypeScript support

**Why not Context API alone?**
- Zustand provides better performance for frequent updates
- Easier to debug and test
- Middleware support for persistence

### Charting

**Recharts 2.12+**
- React-native charting library
- Declarative API matches React patterns
- Responsive charts with minimal configuration
- Customizable for profit/loss visualization
- Built-in animations

### Utilities

**date-fns 3.6+**
- Modern, modular date library
- Tree-shakable (only import what you use)
- Immutable & pure functions
- TypeScript support

**clsx / tailwind-merge**
- Conditional className composition
- Merge Tailwind classes intelligently

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Layout     │  │   Inputs     │  │   Results    │      │
│  │  Components  │  │  Components  │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management Layer                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Zustand Store (Calculator State)         │  │
│  │  - User inputs    - Calculation results              │  │
│  │  - Selected strategy    - Chart data                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Calculation Engine Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Basic P/L  │  │ Black-Scholes│  │   Greeks     │      │
│  │  Calculations│  │    Pricing   │  │ Calculations │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Multi-Leg   │  │    Chart     │                         │
│  │  Strategies  │  │  Generation  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Utility Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Validation  │  │  Formatting  │  │  Constants   │      │
│  │  Functions   │  │  Functions   │  │   & Config   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

**1. Unidirectional Data Flow**
```
User Input → State Update → Calculation → Results Display
```

**2. Pure Calculation Functions**
- All calculations are side-effect free
- Deterministic outputs for given inputs
- Easily testable in isolation

**3. Separation of Concerns**
- **Components**: Presentation logic only
- **Store**: State management and coordination
- **Calculations**: Pure business logic
- **Utils**: Reusable helper functions

---

## Data Models

### Core Type Definitions

```typescript
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Type of option contract
 */
export enum OptionType {
  CALL = 'call',
  PUT = 'put',
}

/**
 * Position direction
 */
export enum Position {
  LONG = 'long',   // Buy option (pay premium)
  SHORT = 'short', // Sell option (receive premium)
}

/**
 * Pre-configured strategy types
 */
export enum StrategyType {
  // Basic
  LONG_CALL = 'long_call',
  LONG_PUT = 'long_put',
  SHORT_CALL = 'short_call',
  SHORT_PUT = 'short_put',
  COVERED_CALL = 'covered_call',
  CASH_SECURED_PUT = 'cash_secured_put',

  // Spreads
  CALL_DEBIT_SPREAD = 'call_debit_spread',
  PUT_DEBIT_SPREAD = 'put_debit_spread',
  CALL_CREDIT_SPREAD = 'call_credit_spread',
  PUT_CREDIT_SPREAD = 'put_credit_spread',
  IRON_CONDOR = 'iron_condor',

  // Volatility
  LONG_STRADDLE = 'long_straddle',
  SHORT_STRADDLE = 'short_straddle',
  LONG_STRANGLE = 'long_strangle',
  SHORT_STRANGLE = 'short_strangle',

  // Advanced
  BUTTERFLY = 'butterfly',
  CALENDAR_SPREAD = 'calendar_spread',
  DIAGONAL_SPREAD = 'diagonal_spread',
  RATIO_SPREAD = 'ratio_spread',

  // Custom
  CUSTOM = 'custom',
}

// ============================================================================
// OPTION LEG MODELS
// ============================================================================

/**
 * Represents a single option leg in a strategy
 */
export interface OptionLeg {
  id: string;                    // Unique identifier for this leg
  optionType: OptionType;        // Call or Put
  position: Position;            // Long (buy) or Short (sell)
  strikePrice: number;           // Strike price in dollars
  premium: number;               // Premium per share in dollars
  quantity: number;              // Number of contracts
  expiryDate: Date;              // Expiration date
}

/**
 * Input for creating a new option leg
 */
export interface OptionLegInput {
  optionType: OptionType;
  position: Position;
  strikePrice: number;
  premium: number;
  quantity: number;
  expiryDate: string;            // ISO date string
}

// ============================================================================
// CALCULATION INPUT MODELS
// ============================================================================

/**
 * All inputs needed for calculations
 */
export interface CalculationInputs {
  // Basic Inputs
  currentStockPrice: number;     // Current underlying price
  legs: OptionLeg[];             // Array of option legs

  // Advanced Inputs (for Black-Scholes)
  volatility?: number;           // Implied volatility (decimal, e.g., 0.30 for 30%)
  riskFreeRate?: number;         // Risk-free interest rate (decimal, e.g., 0.05 for 5%)

  // Chart Configuration
  priceRange?: number;           // Range for chart (+/- percentage from current price)
  chartPoints?: number;          // Number of data points for chart
}

/**
 * Validation result for inputs
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// CALCULATION RESULT MODELS
// ============================================================================

/**
 * Results from profit/loss calculations
 */
export interface CalculationResults {
  // Core Metrics
  maxProfit: number | null;      // Maximum profit (null = unlimited)
  maxLoss: number | null;        // Maximum loss (null = unlimited)
  breakEvenPoints: number[];     // Array of break-even stock prices

  // Cost/Credit
  initialCost: number;           // Total cost (negative) or credit (positive)

  // Current Value (if using theoretical pricing)
  currentValue?: number;         // Current theoretical value
  currentPL?: number;            // Current P/L vs initial cost

  // Greeks (aggregate for all legs)
  greeks?: GreeksResult;

  // Chart Data
  chartData: ChartDataPoint[];

  // Individual Leg Results
  legResults: LegResult[];
}

/**
 * Result for a single leg
 */
export interface LegResult {
  legId: string;
  intrinsicValue: number;        // Current intrinsic value
  timeValue?: number;            // Time value (if using Black-Scholes)
  profitLoss: number;            // Current P/L for this leg
}

/**
 * Greeks calculations
 */
export interface GreeksResult {
  delta: number;                 // Rate of change per $1 stock move
  gamma: number;                 // Rate of change of delta
  theta: number;                 // Time decay per day
  vega: number;                  // Sensitivity to 1% volatility change
  rho: number;                   // Sensitivity to 1% interest rate change
}

/**
 * Individual Greek calculation for a leg
 */
export interface LegGreeks {
  legId: string;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

// ============================================================================
// CHART DATA MODELS
// ============================================================================

/**
 * Single data point for profit/loss chart
 */
export interface ChartDataPoint {
  stockPrice: number;            // Stock price at this point
  profitLoss: number;            // Total P/L at this stock price
  profitLossAtExpiry?: number;   // P/L at expiration (if different from current)
  breakevenPoint?: boolean;      // Is this a break-even point?
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  minPrice: number;              // Minimum stock price to display
  maxPrice: number;              // Maximum stock price to display
  currentPrice: number;          // Current stock price marker
  breakEvenPoints: number[];     // Break-even points to highlight
  showTimeValue: boolean;        // Show current value vs expiration value
}

// ============================================================================
// STRATEGY TEMPLATE MODELS
// ============================================================================

/**
 * Pre-configured strategy template
 */
export interface StrategyTemplate {
  type: StrategyType;
  name: string;
  description: string;
  category: 'basic' | 'spreads' | 'volatility' | 'advanced' | 'custom';
  outlook: 'bullish' | 'bearish' | 'neutral' | 'volatile' | 'range-bound';
  complexity: 'beginner' | 'intermediate' | 'advanced';

  // Template for generating legs
  legTemplate: LegTemplate[];

  // Risk profile
  riskLevel: 'low' | 'medium' | 'high' | 'unlimited';

  // Educational content
  explanation: string;
  advantages: string[];
  disadvantages: string[];
  idealConditions: string;
}

/**
 * Template for creating legs
 */
export interface LegTemplate {
  optionType: OptionType;
  position: Position;
  strikeRelation: 'atm' | 'itm' | 'otm';  // Relationship to current price
  strikeOffset?: number;                   // Offset from current price (e.g., +5)
  quantityMultiplier: number;              // Relative quantity (e.g., 1 or 2)
}

// ============================================================================
// APPLICATION STATE MODELS
// ============================================================================

/**
 * Complete calculator state
 */
export interface CalculatorState {
  // Inputs
  inputs: CalculationInputs;

  // Results
  results: CalculationResults | null;

  // UI State
  selectedStrategy: StrategyType;
  isCalculating: boolean;

  // User Preferences
  preferences: UserPreferences;

  // Actions
  setInputs: (inputs: Partial<CalculationInputs>) => void;
  addLeg: (leg: OptionLegInput) => void;
  updateLeg: (id: string, updates: Partial<OptionLeg>) => void;
  removeLeg: (id: string) => void;
  setStrategy: (strategy: StrategyType) => void;
  calculate: () => void;
  reset: () => void;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultVolatility: number;
  defaultRiskFreeRate: number;
  defaultPriceRange: number;
  defaultChartPoints: number;
  showGreeks: boolean;
  showAdvancedOptions: boolean;
  currencyFormat: 'USD' | 'compact';
}

// ============================================================================
// BLACK-SCHOLES SPECIFIC MODELS
// ============================================================================

/**
 * Parameters for Black-Scholes calculation
 */
export interface BlackScholesParams {
  optionType: OptionType;
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;          // Years
  riskFreeRate: number;          // Decimal (0.05 = 5%)
  volatility: number;            // Decimal (0.30 = 30%)
}

/**
 * Black-Scholes calculation result
 */
export interface BlackScholesResult {
  optionPrice: number;
  d1: number;
  d2: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Date range for calculations
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
  daysUntilExpiry: number;
  yearsUntilExpiry: number;
}

/**
 * Price range for chart generation
 */
export interface PriceRange {
  min: number;
  max: number;
  step: number;
  points: number;
}

/**
 * Formatted display values
 */
export interface FormattedValues {
  price: string;                 // Formatted price (e.g., "$50.25")
  profitLoss: string;            // Formatted P/L (e.g., "+$1,250.00")
  percentage: string;            // Formatted percentage (e.g., "25.5%")
  date: string;                  // Formatted date (e.g., "Dec 15, 2025")
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Custom error for calculation failures
 */
export class CalculationError extends Error {
  code: string;
  context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'CalculationError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Error codes for different failure scenarios
 */
export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  CALCULATION_FAILED = 'CALCULATION_FAILED',
  EXPIRED_OPTION = 'EXPIRED_OPTION',
  INVALID_DATE = 'INVALID_DATE',
  DIVISION_BY_ZERO = 'DIVISION_BY_ZERO',
  NUMERICAL_INSTABILITY = 'NUMERICAL_INSTABILITY',
}
```

---

## Calculation Engine Design

### Architecture Principles

1. **Pure Functions**: All calculations are pure (no side effects)
2. **Modular Design**: Each calculation type in separate module
3. **Error Handling**: Explicit error types for all edge cases
4. **Performance**: Memoization for expensive calculations
5. **Testability**: Easy to unit test in isolation

### Calculation Modules

```typescript
// ============================================================================
// MODULE STRUCTURE
// ============================================================================

src/lib/calculations/
├── basic-pl.ts              # Basic profit/loss calculations
├── black-scholes.ts         # Black-Scholes option pricing
├── greeks.ts                # Greeks calculations
├── multi-leg.ts             # Multi-leg strategy calculations
├── break-even.ts            # Break-even point finder
├── chart-data.ts            # Chart data generation
├── helpers.ts               # Helper functions (normalCDF, etc.)
├── validators.ts            # Input validation
└── index.ts                 # Public API exports
```

### Core Calculation Functions

#### 1. Basic Profit/Loss Module (`basic-pl.ts`)

```typescript
/**
 * Calculate profit/loss for a long call option
 * @param stockPrice - Stock price at evaluation
 * @param strikePrice - Strike price of the option
 * @param premium - Premium paid per share
 * @param quantity - Number of contracts
 * @returns Profit or loss in dollars
 */
export function calculateLongCallPL(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  const intrinsicValue = Math.max(0, stockPrice - strikePrice);
  return (intrinsicValue - premium) * CONTRACT_MULTIPLIER * quantity;
}

/**
 * Calculate profit/loss for a long put option
 */
export function calculateLongPutPL(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  const intrinsicValue = Math.max(0, strikePrice - stockPrice);
  return (intrinsicValue - premium) * CONTRACT_MULTIPLIER * quantity;
}

/**
 * Calculate profit/loss for a short call option
 */
export function calculateShortCallPL(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  const intrinsicValue = Math.max(0, stockPrice - strikePrice);
  return (premium - intrinsicValue) * CONTRACT_MULTIPLIER * quantity;
}

/**
 * Calculate profit/loss for a short put option
 */
export function calculateShortPutPL(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  const intrinsicValue = Math.max(0, strikePrice - stockPrice);
  return (premium - intrinsicValue) * CONTRACT_MULTIPLIER * quantity;
}

/**
 * Calculate P/L for a single option leg
 */
export function calculateLegPL(
  leg: OptionLeg,
  stockPrice: number
): number {
  const { optionType, position, strikePrice, premium, quantity } = leg;

  if (optionType === OptionType.CALL && position === Position.LONG) {
    return calculateLongCallPL(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.CALL && position === Position.SHORT) {
    return calculateShortCallPL(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.PUT && position === Position.LONG) {
    return calculateLongPutPL(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.PUT && position === Position.SHORT) {
    return calculateShortPutPL(stockPrice, strikePrice, premium, quantity);
  }

  throw new CalculationError(
    'Invalid option type or position',
    ErrorCode.INVALID_INPUT,
    { optionType, position }
  );
}
```

#### 2. Black-Scholes Module (`black-scholes.ts`)

```typescript
/**
 * Calculate option price using Black-Scholes model
 */
export function calculateBlackScholes(
  params: BlackScholesParams
): BlackScholesResult {
  const { optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;

  // Handle edge case: at expiration
  if (timeToExpiry <= 0) {
    const intrinsicValue = optionType === OptionType.CALL
      ? Math.max(0, stockPrice - strikePrice)
      : Math.max(0, strikePrice - stockPrice);

    return {
      optionPrice: intrinsicValue,
      d1: 0,
      d2: 0,
    };
  }

  // Calculate d1 and d2
  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  // Calculate option price
  let optionPrice: number;

  if (optionType === OptionType.CALL) {
    optionPrice =
      stockPrice * normalCDF(d1) -
      strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  } else {
    optionPrice =
      strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) -
      stockPrice * normalCDF(-d1);
  }

  return { optionPrice, d1, d2 };
}

/**
 * Calculate d1 parameter for Black-Scholes
 */
function calculateD1(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  const numerator =
    Math.log(stockPrice / strikePrice) +
    (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry;

  const denominator = volatility * Math.sqrt(timeToExpiry);

  if (denominator === 0) {
    throw new CalculationError(
      'Division by zero in Black-Scholes calculation',
      ErrorCode.DIVISION_BY_ZERO,
      { volatility, timeToExpiry }
    );
  }

  return numerator / denominator;
}
```

#### 3. Greeks Module (`greeks.ts`)

```typescript
/**
 * Calculate Delta - sensitivity to stock price changes
 */
export function calculateDelta(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) {
    // At expiration, delta is binary
    if (optionType === OptionType.CALL) {
      return stockPrice >= strikePrice ? 1 : 0;
    } else {
      return stockPrice <= strikePrice ? -1 : 0;
    }
  }

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);

  if (optionType === OptionType.CALL) {
    return normalCDF(d1);
  } else {
    return normalCDF(d1) - 1;
  }
}

/**
 * Calculate Gamma - rate of change of delta
 */
export function calculateGamma(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const denominator = stockPrice * volatility * Math.sqrt(timeToExpiry);

  if (denominator === 0) return 0;

  return normalPDF(d1) / denominator;
}

/**
 * Calculate Theta - time decay (per day)
 */
export function calculateTheta(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  const term1 = -(stockPrice * normalPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry));

  if (optionType === OptionType.CALL) {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
    return (term1 - term2) / DAYS_PER_YEAR;
  } else {
    const term2 = riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
    return (term1 + term2) / DAYS_PER_YEAR;
  }
}

/**
 * Calculate Vega - sensitivity to volatility changes
 */
export function calculateVega(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  return stockPrice * normalPDF(d1) * Math.sqrt(timeToExpiry) / 100;
}

/**
 * Calculate Rho - sensitivity to interest rate changes
 */
export function calculateRho(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  if (optionType === OptionType.CALL) {
    return strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2) / 100;
  } else {
    return -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) / 100;
  }
}

/**
 * Calculate all Greeks for an option leg
 */
export function calculateLegGreeks(
  leg: OptionLeg,
  stockPrice: number,
  riskFreeRate: number,
  volatility: number
): LegGreeks {
  const timeToExpiry = calculateTimeToExpiry(leg.expiryDate);

  const delta = calculateDelta(
    leg.optionType,
    stockPrice,
    leg.strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );

  const gamma = calculateGamma(
    stockPrice,
    leg.strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );

  const theta = calculateTheta(
    leg.optionType,
    stockPrice,
    leg.strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );

  const vega = calculateVega(
    stockPrice,
    leg.strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );

  const rho = calculateRho(
    leg.optionType,
    stockPrice,
    leg.strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility
  );

  // Adjust for position (short = negative Greeks)
  const positionMultiplier = leg.position === Position.LONG ? 1 : -1;
  const quantityMultiplier = leg.quantity * positionMultiplier;

  return {
    legId: leg.id,
    delta: delta * quantityMultiplier,
    gamma: gamma * quantityMultiplier,
    theta: theta * quantityMultiplier,
    vega: vega * quantityMultiplier,
    rho: rho * quantityMultiplier,
  };
}
```

#### 4. Multi-Leg Strategy Module (`multi-leg.ts`)

```typescript
/**
 * Calculate total profit/loss across all legs
 */
export function calculateTotalPL(
  legs: OptionLeg[],
  stockPrice: number
): number {
  return legs.reduce((total, leg) => {
    return total + calculateLegPL(leg, stockPrice);
  }, 0);
}

/**
 * Calculate aggregate Greeks for multi-leg strategy
 */
export function calculateAggregateGreeks(
  legs: OptionLeg[],
  stockPrice: number,
  riskFreeRate: number,
  volatility: number
): GreeksResult {
  const legGreeksArray = legs.map(leg =>
    calculateLegGreeks(leg, stockPrice, riskFreeRate, volatility)
  );

  return {
    delta: legGreeksArray.reduce((sum, g) => sum + g.delta, 0),
    gamma: legGreeksArray.reduce((sum, g) => sum + g.gamma, 0),
    theta: legGreeksArray.reduce((sum, g) => sum + g.theta, 0),
    vega: legGreeksArray.reduce((sum, g) => sum + g.vega, 0),
    rho: legGreeksArray.reduce((sum, g) => sum + g.rho, 0),
  };
}

/**
 * Calculate initial cost/credit for strategy
 */
export function calculateInitialCost(legs: OptionLeg[]): number {
  return legs.reduce((total, leg) => {
    const premium = leg.premium * CONTRACT_MULTIPLIER * leg.quantity;
    // Long positions cost money (negative), short positions credit money (positive)
    return total + (leg.position === Position.LONG ? -premium : premium);
  }, 0);
}

/**
 * Calculate maximum profit for strategy
 * Returns null if unlimited
 */
export function calculateMaxProfit(
  legs: OptionLeg[],
  currentStockPrice: number
): number | null {
  // Check for unlimited profit potential
  const hasUncoveredLongCalls = legs.some(
    leg => leg.optionType === OptionType.CALL && leg.position === Position.LONG
  );
  const hasUncoveredShortPuts = legs.some(
    leg => leg.optionType === OptionType.PUT && leg.position === Position.SHORT
  );

  // Simple check - can be enhanced for specific strategies
  if (hasUncoveredLongCalls && !hasCoveredCall(legs)) {
    return null; // Unlimited profit potential
  }

  // Calculate profit at various price points and return max
  const pricePoints = generatePricePoints(currentStockPrice, legs);
  const profits = pricePoints.map(price => calculateTotalPL(legs, price));

  return Math.max(...profits);
}

/**
 * Calculate maximum loss for strategy
 * Returns null if unlimited
 */
export function calculateMaxLoss(
  legs: OptionLeg[],
  currentStockPrice: number
): number | null {
  // Check for unlimited loss potential
  const hasUncoveredShortCalls = legs.some(
    leg => leg.optionType === OptionType.CALL && leg.position === Position.SHORT
  );

  if (hasUncoveredShortCalls && !hasCoveredCall(legs)) {
    return null; // Unlimited loss potential
  }

  // Calculate loss at various price points and return min (most negative)
  const pricePoints = generatePricePoints(currentStockPrice, legs);
  const profits = pricePoints.map(price => calculateTotalPL(legs, price));

  return Math.min(...profits);
}

/**
 * Generate strategic price points for analysis
 */
function generatePricePoints(
  currentPrice: number,
  legs: OptionLeg[]
): number[] {
  const strikes = legs.map(leg => leg.strikePrice);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  const points = [
    0, // Zero price
    minStrike * 0.5,
    minStrike,
    ...strikes, // All strike prices
    maxStrike,
    maxStrike * 1.5,
    maxStrike * 2,
  ];

  // Add current price
  points.push(currentPrice);

  // Sort and deduplicate
  return Array.from(new Set(points)).sort((a, b) => a - b);
}

/**
 * Check if strategy has a covered call
 */
function hasCoveredCall(legs: OptionLeg[]): boolean {
  const shortCalls = legs.filter(
    leg => leg.optionType === OptionType.CALL && leg.position === Position.SHORT
  );
  const longCalls = legs.filter(
    leg => leg.optionType === OptionType.CALL && leg.position === Position.LONG
  );

  // Check if short calls are covered by long calls at lower strikes
  return shortCalls.every(shortCall =>
    longCalls.some(longCall =>
      longCall.strikePrice <= shortCall.strikePrice &&
      longCall.quantity >= shortCall.quantity
    )
  );
}
```

#### 5. Break-Even Finder Module (`break-even.ts`)

```typescript
/**
 * Find break-even points for a strategy
 * Uses numerical method to find where P/L crosses zero
 */
export function findBreakEvenPoints(
  legs: OptionLeg[],
  currentStockPrice: number,
  priceRange: number = 0.5
): number[] {
  const minPrice = currentStockPrice * (1 - priceRange);
  const maxPrice = currentStockPrice * (1 + priceRange);
  const step = 0.01; // $0.01 precision

  const breakEvens: number[] = [];
  let prevPL = calculateTotalPL(legs, minPrice);

  for (let price = minPrice + step; price <= maxPrice; price += step) {
    const currentPL = calculateTotalPL(legs, price);

    // Check if P/L crossed zero
    if ((prevPL < 0 && currentPL >= 0) || (prevPL > 0 && currentPL <= 0)) {
      // Refine using bisection for better accuracy
      const refinedBreakEven = bisectionMethod(
        legs,
        price - step,
        price,
        0.001 // $0.001 precision
      );
      breakEvens.push(refinedBreakEven);
    }

    prevPL = currentPL;
  }

  return breakEvens;
}

/**
 * Bisection method to find exact break-even point
 */
function bisectionMethod(
  legs: OptionLeg[],
  low: number,
  high: number,
  tolerance: number
): number {
  let mid = (low + high) / 2;

  while (high - low > tolerance) {
    const midPL = calculateTotalPL(legs, mid);

    if (Math.abs(midPL) < tolerance) {
      return mid;
    }

    const lowPL = calculateTotalPL(legs, low);

    if ((lowPL < 0 && midPL < 0) || (lowPL > 0 && midPL > 0)) {
      low = mid;
    } else {
      high = mid;
    }

    mid = (low + high) / 2;
  }

  return mid;
}

/**
 * Calculate break-even for single option
 */
export function calculateSingleOptionBreakEven(
  optionType: OptionType,
  strikePrice: number,
  premium: number
): number {
  if (optionType === OptionType.CALL) {
    return strikePrice + premium;
  } else {
    return strikePrice - premium;
  }
}
```

#### 6. Chart Data Generator (`chart-data.ts`)

```typescript
/**
 * Generate chart data points for visualization
 */
export function generateChartData(
  legs: OptionLeg[],
  currentStockPrice: number,
  config: Partial<ChartConfig> = {}
): ChartDataPoint[] {
  const {
    priceRange = 0.5,
    points = 100,
    showTimeValue = false,
  } = config;

  const minPrice = currentStockPrice * (1 - priceRange);
  const maxPrice = currentStockPrice * (1 + priceRange);
  const step = (maxPrice - minPrice) / points;

  const breakEvens = findBreakEvenPoints(legs, currentStockPrice, priceRange);

  const data: ChartDataPoint[] = [];

  for (let price = minPrice; price <= maxPrice; price += step) {
    const roundedPrice = Math.round(price * 100) / 100;
    const profitLoss = calculateTotalPL(legs, roundedPrice);

    const dataPoint: ChartDataPoint = {
      stockPrice: roundedPrice,
      profitLoss: Math.round(profitLoss * 100) / 100,
      breakevenPoint: breakEvens.some(be => Math.abs(be - roundedPrice) < 0.1),
    };

    // If showing time value, calculate P/L at expiration separately
    if (showTimeValue) {
      // This would use Black-Scholes for current value
      // and simple intrinsic value for expiration
      dataPoint.profitLossAtExpiry = profitLoss; // Simplified for now
    }

    data.push(dataPoint);
  }

  return data;
}

/**
 * Add break-even markers to chart data
 */
export function addBreakEvenMarkers(
  chartData: ChartDataPoint[],
  breakEvenPoints: number[]
): ChartDataPoint[] {
  return chartData.map(point => ({
    ...point,
    breakevenPoint: breakEvenPoints.some(
      be => Math.abs(be - point.stockPrice) < 0.5
    ),
  }));
}
```

#### 7. Helper Functions (`helpers.ts`)

```typescript
/**
 * Cumulative standard normal distribution function
 * Uses Abramowitz and Stegun approximation
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

/**
 * Probability density function for standard normal distribution
 */
export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate time to expiry in years
 */
export function calculateTimeToExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);

  const msPerYear = DAYS_PER_YEAR * 24 * 60 * 60 * 1000;
  const timeToExpiry = (expiry.getTime() - now.getTime()) / msPerYear;

  // Minimum of 1 day to avoid division by zero
  return Math.max(timeToExpiry, 1 / DAYS_PER_YEAR);
}

/**
 * Calculate days until expiry
 */
export function calculateDaysToExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((expiry.getTime() - now.getTime()) / msPerDay);

  return Math.max(days, 0);
}
```

#### 8. Validation Module (`validators.ts`)

```typescript
/**
 * Validate calculation inputs
 */
export function validateInputs(inputs: CalculationInputs): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate stock price
  if (!inputs.currentStockPrice || inputs.currentStockPrice <= 0) {
    errors.push({
      field: 'currentStockPrice',
      message: 'Stock price must be greater than 0',
    });
  }

  // Validate legs
  if (!inputs.legs || inputs.legs.length === 0) {
    errors.push({
      field: 'legs',
      message: 'At least one option leg is required',
    });
  } else {
    inputs.legs.forEach((leg, index) => {
      const legErrors = validateLeg(leg, index);
      errors.push(...legErrors);
    });
  }

  // Validate optional parameters
  if (inputs.volatility !== undefined) {
    if (inputs.volatility < 0 || inputs.volatility > 5) {
      errors.push({
        field: 'volatility',
        message: 'Volatility must be between 0 and 5 (0-500%)',
      });
    }
  }

  if (inputs.riskFreeRate !== undefined) {
    if (inputs.riskFreeRate < 0 || inputs.riskFreeRate > 1) {
      errors.push({
        field: 'riskFreeRate',
        message: 'Risk-free rate must be between 0 and 1 (0-100%)',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a single option leg
 */
function validateLeg(leg: OptionLeg, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `leg[${index}]`;

  if (leg.strikePrice <= 0) {
    errors.push({
      field: `${prefix}.strikePrice`,
      message: 'Strike price must be greater than 0',
    });
  }

  if (leg.premium < 0) {
    errors.push({
      field: `${prefix}.premium`,
      message: 'Premium cannot be negative',
    });
  }

  if (leg.quantity < 1 || !Number.isInteger(leg.quantity)) {
    errors.push({
      field: `${prefix}.quantity`,
      message: 'Quantity must be a positive integer',
    });
  }

  const now = new Date();
  const expiry = new Date(leg.expiryDate);

  if (expiry <= now) {
    errors.push({
      field: `${prefix}.expiryDate`,
      message: 'Expiration date must be in the future',
    });
  }

  return errors;
}

/**
 * Validate that a date is in the future
 */
export function isValidExpiryDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(
  value: unknown,
  min?: number,
  max?: number
): number {
  const num = Number(value);

  if (isNaN(num)) {
    throw new CalculationError(
      'Invalid number input',
      ErrorCode.INVALID_INPUT,
      { value }
    );
  }

  if (min !== undefined && num < min) {
    return min;
  }

  if (max !== undefined && num > max) {
    return max;
  }

  return num;
}
```

### Constants File

```typescript
// src/lib/calculations/constants.ts

/**
 * Number of shares per option contract
 */
export const CONTRACT_MULTIPLIER = 100;

/**
 * Days in a year for financial calculations
 */
export const DAYS_PER_YEAR = 365.25;

/**
 * Default risk-free interest rate (5%)
 */
export const DEFAULT_RISK_FREE_RATE = 0.05;

/**
 * Default implied volatility (30%)
 */
export const DEFAULT_VOLATILITY = 0.30;

/**
 * Default price range for chart (+/- 50%)
 */
export const DEFAULT_PRICE_RANGE = 0.5;

/**
 * Default number of chart data points
 */
export const DEFAULT_CHART_POINTS = 100;

/**
 * Precision for break-even calculations
 */
export const BREAK_EVEN_PRECISION = 0.001;

/**
 * Tolerance for numerical comparisons
 */
export const NUMERICAL_TOLERANCE = 1e-10;
```

---

## Component Architecture

### Component Hierarchy

```
App
├── ThemeProvider
│   └── Layout
│       ├── Header
│       │   ├── Logo
│       │   ├── Navigation
│       │   └── ThemeToggle
│       ├── MainContent
│       │   ├── StrategySelector
│       │   ├── CalculatorPanel
│       │   │   ├── StockPriceInput
│       │   │   ├── OptionLegsList
│       │   │   │   └── OptionLegForm (×N)
│       │   │   ├── AdvancedOptions
│       │   │   └── CalculateButton
│       │   └── ResultsPanel
│       │       ├── MetricsDisplay
│       │       │   ├── MetricCard (×4)
│       │       │   └── GreeksDisplay
│       │       ├── ProfitLossChart
│       │       └── DataTable
│       └── Footer
```

### Core Components

#### 1. Layout Components

```typescript
// src/components/layout/Header.tsx

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('border-b bg-background', className)}>
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <Navigation />
        <ThemeToggle />
      </div>
    </header>
  );
}

// src/components/layout/MainContent.tsx

export function MainContent() {
  return (
    <main className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <StrategySelector />
          <CalculatorPanel />
        </div>
        <div>
          <ResultsPanel />
        </div>
      </div>
    </main>
  );
}

// src/components/layout/Footer.tsx

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Options Profit Calculator. Educational purposes only.</p>
      </div>
    </footer>
  );
}
```

#### 2. Input Components

```typescript
// src/components/calculator/StrategySelector.tsx

export function StrategySelector() {
  const { selectedStrategy, setStrategy } = useCalculatorStore();
  const strategies = useStrategyTemplates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Strategy</CardTitle>
        <CardDescription>
          Choose a pre-configured strategy or build your own
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedStrategy} onValueChange={setStrategy}>
          <SelectTrigger>
            <SelectValue placeholder="Select a strategy" />
          </SelectTrigger>
          <SelectContent>
            {strategies.map(strategy => (
              <SelectItem key={strategy.type} value={strategy.type}>
                {strategy.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

// src/components/calculator/OptionLegForm.tsx

interface OptionLegFormProps {
  leg?: OptionLeg;
  onSave: (leg: OptionLegInput) => void;
  onCancel: () => void;
}

export function OptionLegForm({ leg, onSave, onCancel }: OptionLegFormProps) {
  const [formData, setFormData] = useState<OptionLegInput>({
    optionType: leg?.optionType ?? OptionType.CALL,
    position: leg?.position ?? Position.LONG,
    strikePrice: leg?.strikePrice ?? 0,
    premium: leg?.premium ?? 0,
    quantity: leg?.quantity ?? 1,
    expiryDate: leg?.expiryDate ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Option Type</Label>
          <Select
            value={formData.optionType}
            onValueChange={value => setFormData({ ...formData, optionType: value as OptionType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OptionType.CALL}>Call</SelectItem>
              <SelectItem value={OptionType.PUT}>Put</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Position</Label>
          <Select
            value={formData.position}
            onValueChange={value => setFormData({ ...formData, position: value as Position })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Position.LONG}>Long (Buy)</SelectItem>
              <SelectItem value={Position.SHORT}>Short (Sell)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* More form fields... */}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {leg ? 'Update' : 'Add'} Leg
        </Button>
      </div>
    </form>
  );
}

// src/components/calculator/StockPriceInput.tsx

export function StockPriceInput() {
  const { inputs, setInputs } = useCalculatorStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="stock-price">Current Stock Price</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          id="stock-price"
          type="number"
          step="0.01"
          min="0"
          value={inputs.currentStockPrice}
          onChange={e => setInputs({ currentStockPrice: Number(e.target.value) })}
          className="pl-7"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
```

#### 3. Result Components

```typescript
// src/components/results/MetricsDisplay.tsx

export function MetricsDisplay() {
  const { results } = useCalculatorStore();

  if (!results) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Enter option details and click Calculate to see results
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MetricCard
        title="Max Profit"
        value={results.maxProfit}
        variant="profit"
        unlimited={results.maxProfit === null}
      />
      <MetricCard
        title="Max Loss"
        value={results.maxLoss}
        variant="loss"
        unlimited={results.maxLoss === null}
      />
      <MetricCard
        title="Break-Even"
        value={results.breakEvenPoints}
        variant="neutral"
      />
      <MetricCard
        title="Initial Cost"
        value={results.initialCost}
        variant={results.initialCost < 0 ? 'loss' : 'profit'}
      />
    </div>
  );
}

// src/components/results/MetricCard.tsx

interface MetricCardProps {
  title: string;
  value: number | number[] | null;
  variant: 'profit' | 'loss' | 'neutral';
  unlimited?: boolean;
}

export function MetricCard({ title, value, variant, unlimited }: MetricCardProps) {
  const formatValue = () => {
    if (unlimited) return 'Unlimited';
    if (value === null) return 'N/A';
    if (Array.isArray(value)) {
      return value.map(v => formatCurrency(v)).join(', ');
    }
    return formatCurrency(value);
  };

  const variantStyles = {
    profit: 'text-green-600 dark:text-green-400',
    loss: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variantStyles[variant])}>
          {formatValue()}
        </div>
      </CardContent>
    </Card>
  );
}

// src/components/results/ProfitLossChart.tsx

export function ProfitLossChart() {
  const { results, inputs } = useCalculatorStore();

  if (!results) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss Chart</CardTitle>
        <CardDescription>
          P/L across stock price range at expiration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={results.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="stockPrice"
              label={{ value: 'Stock Price', position: 'insideBottom', offset: -5 }}
              tickFormatter={value => `$${value}`}
            />
            <YAxis
              label={{ value: 'Profit/Loss', angle: -90, position: 'insideLeft' }}
              tickFormatter={value => formatCurrency(value, false)}
            />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={value => `Stock: $${value}`}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <ReferenceLine
              x={inputs.currentStockPrice}
              stroke="hsl(var(--primary))"
              label="Current"
            />
            {results.breakEvenPoints.map(be => (
              <ReferenceLine
                key={be}
                x={be}
                stroke="hsl(var(--warning))"
                strokeDasharray="5 5"
                label="B/E"
              />
            ))}
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// src/components/results/DataTable.tsx

export function DataTable() {
  const { results } = useCalculatorStore();

  if (!results) return null;

  // Sample data points from chart data
  const displayData = results.chartData.filter((_, index) => index % 10 === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Points</CardTitle>
        <CardDescription>
          Profit/loss at selected stock prices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock Price</TableHead>
              <TableHead className="text-right">P/L</TableHead>
              <TableHead className="text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map(point => (
              <TableRow key={point.stockPrice}>
                <TableCell className="font-medium">
                  {formatCurrency(point.stockPrice)}
                </TableCell>
                <TableCell className={cn(
                  'text-right font-medium',
                  point.profitLoss > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(point.profitLoss)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPercentage(
                    (point.profitLoss / Math.abs(results.initialCost)) * 100
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

#### 4. Shared Components

```typescript
// src/components/ui/theme-toggle.tsx

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Additional shadcn/ui components will be added via MCP:
// - Button, Card, Input, Select, Label, Table, etc.
```

### Custom Hooks

```typescript
// src/hooks/useCalculatorStore.ts

export function useCalculatorStore() {
  return useStore();
}

// src/hooks/useCalculation.ts

export function useCalculation() {
  const { inputs, setResults } = useCalculatorStore();

  const calculate = useCallback(() => {
    // Validate inputs
    const validation = validateInputs(inputs);
    if (!validation.isValid) {
      toast.error('Invalid inputs', {
        description: validation.errors[0].message,
      });
      return;
    }

    // Perform calculations
    const results = performCalculations(inputs);
    setResults(results);
  }, [inputs, setResults]);

  return { calculate };
}

// src/hooks/useStrategyTemplates.ts

export function useStrategyTemplates() {
  return STRATEGY_TEMPLATES;
}

// src/hooks/useDebounce.ts

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## File and Folder Structure

```
options-calculator/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── CalculatorPanel.tsx
│   │   │   ├── OptionLegForm.tsx
│   │   │   ├── OptionLegsList.tsx
│   │   │   ├── StockPriceInput.tsx
│   │   │   ├── AdvancedOptions.tsx
│   │   │   └── StrategySelector.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── Logo.tsx
│   │   │   └── Navigation.tsx
│   │   ├── results/
│   │   │   ├── ResultsPanel.tsx
│   │   │   ├── MetricsDisplay.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ProfitLossChart.tsx
│   │   │   ├── ChartTooltip.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── GreeksDisplay.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── theme-toggle.tsx
│   │       └── ... (other shadcn/ui components)
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── basic-pl.ts
│   │   │   ├── black-scholes.ts
│   │   │   ├── greeks.ts
│   │   │   ├── multi-leg.ts
│   │   │   ├── break-even.ts
│   │   │   ├── chart-data.ts
│   │   │   ├── helpers.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── calculator.ts
│   │   │   ├── options.ts
│   │   │   ├── strategies.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatting.ts
│   │   │   ├── date-helpers.ts
│   │   │   └── cn.ts
│   │   └── store/
│   │       └── calculator-store.ts
│   ├── constants/
│   │   ├── strategies.ts
│   │   └── defaults.ts
│   ├── hooks/
│   │   ├── useCalculatorStore.ts
│   │   ├── useCalculation.ts
│   │   ├── useStrategyTemplates.ts
│   │   └── useDebounce.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── components.json         # shadcn/ui config
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## State Management Strategy

### Zustand Store Implementation

```typescript
// src/lib/store/calculator-store.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CalculatorStore extends CalculatorState {
  // State
  inputs: CalculationInputs;
  results: CalculationResults | null;
  selectedStrategy: StrategyType;
  isCalculating: boolean;
  preferences: UserPreferences;

  // Actions
  setInputs: (inputs: Partial<CalculationInputs>) => void;
  addLeg: (leg: OptionLegInput) => void;
  updateLeg: (id: string, updates: Partial<OptionLeg>) => void;
  removeLeg: (id: string) => void;
  setStrategy: (strategy: StrategyType) => void;
  calculate: () => void;
  reset: () => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

const initialState = {
  inputs: {
    currentStockPrice: 0,
    legs: [],
    volatility: DEFAULT_VOLATILITY,
    riskFreeRate: DEFAULT_RISK_FREE_RATE,
    priceRange: DEFAULT_PRICE_RANGE,
    chartPoints: DEFAULT_CHART_POINTS,
  },
  results: null,
  selectedStrategy: StrategyType.CUSTOM,
  isCalculating: false,
  preferences: {
    theme: 'dark' as const,
    defaultVolatility: DEFAULT_VOLATILITY,
    defaultRiskFreeRate: DEFAULT_RISK_FREE_RATE,
    defaultPriceRange: DEFAULT_PRICE_RANGE,
    defaultChartPoints: DEFAULT_CHART_POINTS,
    showGreeks: true,
    showAdvancedOptions: false,
    currencyFormat: 'USD' as const,
  },
};

export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        setInputs: (newInputs) => {
          set((state) => {
            state.inputs = { ...state.inputs, ...newInputs };
          });
        },

        addLeg: (legInput) => {
          set((state) => {
            const newLeg: OptionLeg = {
              id: crypto.randomUUID(),
              ...legInput,
              expiryDate: new Date(legInput.expiryDate),
            };
            state.inputs.legs.push(newLeg);
          });
        },

        updateLeg: (id, updates) => {
          set((state) => {
            const index = state.inputs.legs.findIndex(leg => leg.id === id);
            if (index !== -1) {
              state.inputs.legs[index] = {
                ...state.inputs.legs[index],
                ...updates,
              };
            }
          });
        },

        removeLeg: (id) => {
          set((state) => {
            state.inputs.legs = state.inputs.legs.filter(leg => leg.id !== id);
          });
        },

        setStrategy: (strategy) => {
          set((state) => {
            state.selectedStrategy = strategy;

            // Load strategy template if not custom
            if (strategy !== StrategyType.CUSTOM) {
              const template = STRATEGY_TEMPLATES.find(t => t.type === strategy);
              if (template) {
                // Apply strategy template
                state.inputs.legs = applyStrategyTemplate(
                  template,
                  state.inputs.currentStockPrice
                );
              }
            }
          });
        },

        calculate: () => {
          const { inputs } = get();

          set({ isCalculating: true });

          try {
            // Validate inputs
            const validation = validateInputs(inputs);
            if (!validation.isValid) {
              throw new CalculationError(
                validation.errors[0].message,
                ErrorCode.INVALID_INPUT
              );
            }

            // Perform calculations
            const results = performCalculations(inputs);

            set({ results, isCalculating: false });
          } catch (error) {
            console.error('Calculation failed:', error);
            set({ isCalculating: false });

            if (error instanceof CalculationError) {
              // Handle calculation errors
              toast.error('Calculation Failed', {
                description: error.message,
              });
            } else {
              toast.error('Unexpected Error', {
                description: 'An unexpected error occurred during calculation',
              });
            }
          }
        },

        reset: () => {
          set(initialState);
        },

        setPreferences: (prefs) => {
          set((state) => {
            state.preferences = { ...state.preferences, ...prefs };
          });
        },
      })),
      {
        name: 'calculator-storage',
        partialize: (state) => ({
          preferences: state.preferences,
        }),
      }
    )
  )
);

/**
 * Helper function to apply strategy template
 */
function applyStrategyTemplate(
  template: StrategyTemplate,
  currentPrice: number
): OptionLeg[] {
  return template.legTemplate.map((legTemplate, index) => {
    const strike = calculateStrikeFromTemplate(legTemplate, currentPrice);

    return {
      id: crypto.randomUUID(),
      optionType: legTemplate.optionType,
      position: legTemplate.position,
      strikePrice: strike,
      premium: 0, // User will need to input
      quantity: legTemplate.quantityMultiplier,
      expiryDate: new Date(), // User will need to input
    };
  });
}

/**
 * Calculate strike price from template
 */
function calculateStrikeFromTemplate(
  template: LegTemplate,
  currentPrice: number
): number {
  const offset = template.strikeOffset ?? 0;

  switch (template.strikeRelation) {
    case 'atm':
      return Math.round(currentPrice + offset);
    case 'itm':
      return Math.round(currentPrice - Math.abs(offset));
    case 'otm':
      return Math.round(currentPrice + Math.abs(offset));
    default:
      return Math.round(currentPrice);
  }
}

/**
 * Main calculation orchestrator
 */
function performCalculations(inputs: CalculationInputs): CalculationResults {
  const {
    currentStockPrice,
    legs,
    volatility = DEFAULT_VOLATILITY,
    riskFreeRate = DEFAULT_RISK_FREE_RATE,
    priceRange = DEFAULT_PRICE_RANGE,
    chartPoints = DEFAULT_CHART_POINTS,
  } = inputs;

  // Calculate initial cost
  const initialCost = calculateInitialCost(legs);

  // Calculate max profit and loss
  const maxProfit = calculateMaxProfit(legs, currentStockPrice);
  const maxLoss = calculateMaxLoss(legs, currentStockPrice);

  // Find break-even points
  const breakEvenPoints = findBreakEvenPoints(legs, currentStockPrice, priceRange);

  // Calculate Greeks if advanced options enabled
  let greeks: GreeksResult | undefined;
  if (volatility && riskFreeRate) {
    greeks = calculateAggregateGreeks(legs, currentStockPrice, riskFreeRate, volatility);
  }

  // Generate chart data
  const chartData = generateChartData(legs, currentStockPrice, {
    priceRange,
    points: chartPoints,
  });

  // Calculate individual leg results
  const legResults: LegResult[] = legs.map(leg => ({
    legId: leg.id,
    intrinsicValue: calculateIntrinsicValue(leg, currentStockPrice),
    profitLoss: calculateLegPL(leg, currentStockPrice),
  }));

  return {
    maxProfit,
    maxLoss,
    breakEvenPoints,
    initialCost,
    greeks,
    chartData,
    legResults,
  };
}

/**
 * Calculate intrinsic value for a leg
 */
function calculateIntrinsicValue(leg: OptionLeg, stockPrice: number): number {
  if (leg.optionType === OptionType.CALL) {
    return Math.max(0, stockPrice - leg.strikePrice);
  } else {
    return Math.max(0, leg.strikePrice - stockPrice);
  }
}
```

---

## Data Flow Architecture

### Data Flow Diagram

```
User Input (Component)
        ↓
   Store Action
        ↓
   State Update
        ↓
Calculation Trigger
        ↓
  Validation Layer
        ↓
 Calculation Engine
        ↓
  Results Generation
        ↓
   State Update
        ↓
Re-render Components
        ↓
  Display Results
```

### Detailed Flow

1. **User Input**
   - User enters data in form components
   - Input components call store actions via `setInputs`, `addLeg`, etc.

2. **State Management**
   - Zustand store updates state immutably
   - State changes trigger re-renders of subscribed components

3. **Calculation Trigger**
   - User clicks "Calculate" button
   - `calculate()` action is dispatched

4. **Validation**
   - Inputs are validated using validation module
   - Errors are displayed to user if validation fails

5. **Calculation**
   - Calculation engine performs all calculations
   - Pure functions ensure predictable results
   - Results include P/L, Greeks, chart data

6. **Results Update**
   - Results are stored in Zustand state
   - Components automatically re-render with new data

7. **Visualization**
   - Chart component receives chart data
   - Recharts renders interactive visualization
   - Table component displays detailed breakdowns

### Performance Optimizations

```typescript
// Memoize expensive calculations
const memoizedCalculation = useMemo(() => {
  return performCalculations(inputs);
}, [inputs]);

// Debounce input changes
const debouncedPrice = useDebounce(stockPrice, 300);

// Virtualize large data tables
import { useVirtualizer } from '@tanstack/react-virtual';

// Lazy load non-critical components
const GreeksDisplay = lazy(() => import('./GreeksDisplay'));
```

---

## Implementation Phases

### Phase 1: Foundation & Calculation Engine (Week 1-2)

**Goal**: Build core calculation logic and ensure accuracy

**Tasks**:
1. Project setup
   - Initialize Vite + React + TypeScript
   - Configure Tailwind CSS
   - Set up ESLint and Prettier
   - Install dependencies

2. Implement calculation engine
   - Basic P/L functions for single options
   - Break-even calculator
   - Multi-leg strategy calculator
   - Input validation
   - Write comprehensive unit tests

3. Data models
   - Define all TypeScript interfaces
   - Create constants file
   - Set up error types

**Deliverable**: Fully tested calculation library

**Acceptance Criteria**:
- All calculation functions pass unit tests
- 100% type coverage
- Documentation for all public functions

---

### Phase 2: UI Components & Basic Calculator (Week 3-4)

**Goal**: Build functional single-leg calculator UI

**Tasks**:
1. Set up shadcn/ui
   - Initialize shadcn/ui config
   - Add core components via MCP (Button, Card, Input, Select, Label)
   - Configure theme system

2. Build layout components
   - Header with logo and theme toggle
   - Main content area with responsive grid
   - Footer

3. Build input components
   - Stock price input
   - Single option leg form
   - Calculate button

4. Build basic results display
   - Metrics cards (Max Profit, Max Loss, Break-even, Initial Cost)
   - Simple data table

5. State management
   - Implement Zustand store
   - Connect components to store
   - Add form validation

**Deliverable**: Working single-leg calculator

**Acceptance Criteria**:
- User can enter a long call and see results
- Calculations are accurate
- UI is responsive on mobile and desktop
- Dark mode works correctly

---

### Phase 3: Visualization & Charts (Week 5)

**Goal**: Add interactive profit/loss chart

**Tasks**:
1. Implement chart data generation
   - Generate data points across price range
   - Mark break-even points
   - Add current price marker

2. Build chart component
   - Integrate Recharts
   - Custom tooltip
   - Reference lines for break-even and current price
   - Responsive sizing

3. Enhanced data table
   - Show P/L at multiple price points
   - ROI calculations
   - Sortable columns

**Deliverable**: Visual profit/loss chart

**Acceptance Criteria**:
- Chart displays P/L curve accurately
- Break-even points are marked
- Chart is responsive
- Tooltip shows detailed information

---

### Phase 4: Multi-Leg Strategies (Week 6-7)

**Goal**: Support complex multi-leg strategies

**Tasks**:
1. Strategy templates
   - Define strategy templates (spreads, straddles, etc.)
   - Strategy selector component
   - Auto-populate legs from template

2. Multi-leg input
   - Dynamic leg list component
   - Add/remove legs
   - Edit leg details

3. Strategy-specific calculations
   - Aggregate Greeks
   - Multiple break-even points
   - Complex max profit/loss logic

4. Strategy education
   - Strategy description cards
   - Ideal conditions
   - Risk profile indicators

**Deliverable**: Full multi-leg calculator

**Acceptance Criteria**:
- User can build custom strategies with multiple legs
- Pre-configured strategies work correctly
- All calculations are accurate for complex strategies

---

### Phase 5: Advanced Features (Week 8-9)

**Goal**: Add Black-Scholes pricing and Greeks

**Tasks**:
1. Black-Scholes implementation
   - Option pricing model
   - Helper functions (normalCDF, normalPDF)
   - Time to expiry calculations

2. Greeks calculations
   - Delta, Gamma, Theta, Vega, Rho
   - Aggregate Greeks for strategies
   - Greeks display component

3. Advanced options panel
   - Volatility input
   - Interest rate input
   - Toggle Greeks display

4. Time value visualization
   - Show current value vs expiration value on chart
   - Time decay animation (optional)

**Deliverable**: Full-featured calculator with theoretical pricing

**Acceptance Criteria**:
- Black-Scholes pricing matches industry standards
- Greeks are calculated correctly
- Users can toggle advanced features on/off

---

### Phase 6: Polish & Optimization (Week 10)

**Goal**: Performance, UX, and production readiness

**Tasks**:
1. Performance optimization
   - Memoize calculations
   - Debounce inputs
   - Code splitting
   - Bundle size optimization

2. UX enhancements
   - Loading states
   - Error boundaries
   - Empty states
   - Animations and transitions

3. Accessibility
   - Keyboard navigation
   - Screen reader support
   - ARIA labels
   - Focus management

4. Testing
   - Integration tests
   - E2E tests with Playwright
   - Visual regression tests

5. Documentation
   - User guide
   - API documentation
   - Deployment guide

**Deliverable**: Production-ready application

**Acceptance Criteria**:
- Lighthouse score > 90
- Passes accessibility audit
- All tests passing
- Documentation complete

---

### Phase 7: Deployment (Week 11)

**Goal**: Deploy to production

**Tasks**:
1. Build optimization
   - Production build
   - Asset optimization
   - CDN setup

2. Deployment
   - Deploy to Vercel/Netlify
   - Custom domain setup
   - SSL certificate

3. Monitoring
   - Error tracking (Sentry)
   - Analytics (Plausible/Fathom)
   - Performance monitoring

4. Launch
   - Soft launch for testing
   - Gather feedback
   - Make adjustments
   - Public launch

**Deliverable**: Live application

---

## Performance Considerations

### Calculation Performance

1. **Memoization**
   - Use `useMemo` for expensive calculations
   - Cache results when inputs haven't changed

2. **Debouncing**
   - Debounce input changes (300ms)
   - Prevent excessive recalculations

3. **Web Workers**
   - For very complex calculations (8+ legs)
   - Move calculation to background thread
   - Keep UI responsive

### Rendering Performance

1. **React Optimization**
   - Use `React.memo` for pure components
   - Implement `useCallback` for event handlers
   - Avoid unnecessary re-renders

2. **Virtual Lists**
   - For large data tables
   - Use `@tanstack/react-virtual`
   - Only render visible rows

3. **Code Splitting**
   - Lazy load non-critical components
   - Route-based splitting (if adding multiple pages)
   - Dynamic imports for heavy components

### Bundle Size

1. **Tree Shaking**
   - Import only what you need
   - Avoid wildcard imports
   - Use ES modules

2. **Library Selection**
   - Prefer smaller libraries
   - Check bundle size before adding dependencies
   - Use date-fns instead of moment.js

3. **Build Optimization**
   - Minification and compression
   - Image optimization
   - Font subsetting

---

## Testing Strategy

### Unit Tests

**Framework**: Vitest

**Coverage**: All calculation functions

```typescript
// Example test
describe('calculateLongCallPL', () => {
  it('should calculate profit when stock is above strike + premium', () => {
    const result = calculateLongCallPL(55, 50, 2, 1);
    expect(result).toBe(300); // (55 - 50 - 2) * 100 = 300
  });

  it('should calculate loss when stock is below break-even', () => {
    const result = calculateLongCallPL(48, 50, 2, 1);
    expect(result).toBe(-200); // (0 - 2) * 100 = -200
  });

  it('should handle multiple contracts', () => {
    const result = calculateLongCallPL(55, 50, 2, 2);
    expect(result).toBe(600); // (55 - 50 - 2) * 100 * 2 = 600
  });
});
```

### Integration Tests

**Framework**: React Testing Library

**Coverage**: Component interactions

```typescript
// Example test
describe('Calculator Integration', () => {
  it('should calculate and display results for long call', async () => {
    render(<App />);

    // Enter inputs
    await userEvent.type(screen.getByLabelText('Stock Price'), '100');
    await userEvent.type(screen.getByLabelText('Strike Price'), '95');
    await userEvent.type(screen.getByLabelText('Premium'), '3');
    await userEvent.click(screen.getByText('Calculate'));

    // Check results
    expect(screen.getByText('Break-Even')).toHaveTextContent('$98.00');
    expect(screen.getByText('Max Loss')).toHaveTextContent('$300.00');
  });
});
```

### E2E Tests

**Framework**: Playwright

**Coverage**: Critical user flows

```typescript
// Example test
test('user can create and calculate a spread strategy', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Select strategy
  await page.click('text=Select Strategy');
  await page.click('text=Call Debit Spread');

  // Fill inputs
  await page.fill('[name="stockPrice"]', '100');
  // ... more inputs

  // Calculate
  await page.click('text=Calculate');

  // Verify chart appears
  await expect(page.locator('.recharts-wrapper')).toBeVisible();
});
```

---

## Deployment Architecture

### Hosting

**Platform**: Vercel or Netlify

**Justification**:
- Zero-config deployment
- Automatic CI/CD from Git
- Global CDN
- Serverless functions available (for future features)
- Free tier suitable for this project

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'ui-vendor': ['@radix-ui/react-select', '@radix-ui/react-label'],
        },
      },
    },
  },
});
```

### Environment Variables

```bash
# .env.production
VITE_APP_TITLE=Options Profit Calculator
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
```

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 200KB (gzipped)

---

## Conclusion

This architecture provides a solid foundation for building a modern, performant options profit calculator. The modular design allows for easy testing, maintenance, and future enhancements.

### Key Strengths

1. **Type Safety**: Comprehensive TypeScript coverage prevents runtime errors
2. **Testability**: Pure functions and separation of concerns enable thorough testing
3. **Performance**: Client-side calculations with no backend dependencies
4. **Extensibility**: Easy to add new strategies and features
5. **User Experience**: Modern UI with real-time feedback

### Next Steps

1. Review and approve this architecture
2. Begin Phase 1 implementation
3. Set up project repository
4. Initialize development environment
5. Start building the calculation engine

---

**Document Prepared By**: System Architect Agent
**Review Required**: Senior Backend Engineer, Frontend Engineer
**Status**: Ready for Implementation
