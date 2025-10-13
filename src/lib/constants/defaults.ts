/**
 * Default Constants and Configuration Values
 */

/**
 * Number of shares per option contract
 */
export const CONTRACT_MULTIPLIER = 100;

/**
 * Days in a year for financial calculations (accounting for leap years)
 */
export const DAYS_PER_YEAR = 365.25;

/**
 * Default risk-free interest rate (5%)
 * Based on typical U.S. Treasury rates
 */
export const DEFAULT_RISK_FREE_RATE = 0.05;

/**
 * Default implied volatility (30%)
 * Typical for many equities
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
 * Precision for break-even calculations (in dollars)
 */
export const BREAK_EVEN_PRECISION = 0.001;

/**
 * Tolerance for numerical comparisons
 */
export const NUMERICAL_TOLERANCE = 1e-10;

/**
 * Maximum number of iterations for numerical methods
 */
export const MAX_ITERATIONS = 1000;

/**
 * Minimum time to expiry to avoid division by zero (1 day)
 */
export const MIN_TIME_TO_EXPIRY = 1 / DAYS_PER_YEAR;

/**
 * Display scaling factors for Greeks
 */
export const GREEK_DISPLAY_SCALES = {
  DELTA: 1,        // Show as-is (0 to 1 or -1 to 0)
  GAMMA: 1,        // Show as-is
  THETA: 1,        // Already calculated per day
  VEGA: 1,         // Already scaled for 1% volatility change
  RHO: 1,          // Already scaled for 1% rate change
};
