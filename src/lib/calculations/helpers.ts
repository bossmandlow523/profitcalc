/**
 * Helper Functions for Options Calculations
 * Mathematical utilities used across calculation modules
 */

import { DAYS_PER_YEAR, MIN_TIME_TO_EXPIRY } from '../constants/defaults';

/**
 * Cumulative standard normal distribution function (CDF)
 * Uses Abramowitz and Stegun approximation (accurate to ~6 decimal places)
 *
 * @param x - Input value
 * @returns Probability that a standard normal random variable is less than or equal to x
 *
 * @example
 * normalCDF(0) // returns 0.5
 * normalCDF(1.96) // returns ~0.975
 */
export function normalCDF(x: number): number {
  // Constants for Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x) / Math.sqrt(2);

  // A&S formula 7.1.26
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

/**
 * Probability density function for standard normal distribution (PDF)
 * φ(x) = (1/√(2π)) × e^(-x²/2)
 *
 * @param x - Input value
 * @returns Probability density at x
 *
 * @example
 * normalPDF(0) // returns ~0.3989 (peak of bell curve)
 * normalPDF(1) // returns ~0.2420
 */
export function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Calculate time to expiry in years
 * Uses DAYS_PER_YEAR constant to account for leap years
 * Returns minimum of MIN_TIME_TO_EXPIRY to avoid division by zero
 *
 * @param expiryDate - Expiration date of the option
 * @returns Time to expiry in years (minimum MIN_TIME_TO_EXPIRY)
 *
 * @example
 * const expiry = new Date('2025-12-31');
 * const timeToExpiry = calculateTimeToExpiry(expiry);
 */
export function calculateTimeToExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);

  // Calculate time difference in milliseconds
  const msPerYear = DAYS_PER_YEAR * 24 * 60 * 60 * 1000;
  const timeToExpiry = (expiry.getTime() - now.getTime()) / msPerYear;

  // Return minimum of MIN_TIME_TO_EXPIRY to avoid division by zero
  // This handles both expired options and options very close to expiration
  return Math.max(timeToExpiry, MIN_TIME_TO_EXPIRY);
}

/**
 * Calculate days until expiry
 * Returns 0 if option has expired
 *
 * @param expiryDate - Expiration date of the option
 * @returns Number of days until expiration (0 if expired)
 *
 * @example
 * const expiry = new Date('2025-12-31');
 * const days = calculateDaysToExpiry(expiry);
 */
export function calculateDaysToExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((expiry.getTime() - now.getTime()) / msPerDay);

  return Math.max(days, 0);
}

/**
 * Calculate d1 parameter for Black-Scholes formula
 * d1 = [ln(S/K) + (r + σ²/2) × T] / (σ × √T)
 *
 * @param stockPrice - Current stock price (S)
 * @param strikePrice - Strike price (K)
 * @param timeToExpiry - Time to expiration in years (T)
 * @param riskFreeRate - Risk-free rate (r)
 * @param volatility - Volatility (σ)
 * @returns d1 value
 *
 * @throws {Error} If denominator is zero (volatility * sqrt(T) = 0)
 */
export function calculateD1(
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
    throw new Error('Division by zero in d1 calculation: volatility * sqrt(T) = 0');
  }

  return numerator / denominator;
}

/**
 * Calculate d2 parameter for Black-Scholes formula
 * d2 = d1 - σ × √T
 *
 * @param d1 - The d1 value from calculateD1
 * @param volatility - Volatility (σ)
 * @param timeToExpiry - Time to expiration in years (T)
 * @returns d2 value
 */
export function calculateD2(d1: number, volatility: number, timeToExpiry: number): number {
  return d1 - volatility * Math.sqrt(timeToExpiry);
}

/**
 * Round number to specified decimal places
 *
 * @param value - Number to round
 * @param decimals - Number of decimal places (default 2)
 * @returns Rounded number
 *
 * @example
 * roundTo(1.2345, 2) // returns 1.23
 * roundTo(1.2345, 4) // returns 1.2345
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Clamp a number between min and max values
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 *
 * @example
 * clamp(5, 0, 10) // returns 5
 * clamp(-5, 0, 10) // returns 0
 * clamp(15, 0, 10) // returns 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if two numbers are approximately equal within tolerance
 *
 * @param a - First number
 * @param b - Second number
 * @param tolerance - Tolerance for comparison (default 1e-10)
 * @returns True if numbers are approximately equal
 *
 * @example
 * isApproximatelyEqual(0.1 + 0.2, 0.3) // returns true (despite floating point issues)
 */
export function isApproximatelyEqual(a: number, b: number, tolerance: number = 1e-10): boolean {
  return Math.abs(a - b) < tolerance;
}
