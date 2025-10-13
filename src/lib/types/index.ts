/**
 * Core Type Definitions for Options Profit Calculator
 * All interfaces and types used across the calculation engine
 */

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
  priceRange?: number;           // Percentage range for chart
  points?: number;               // Number of data points
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
