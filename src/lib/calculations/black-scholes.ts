/**
 * Black-Scholes Option Pricing Model
 * Calculates theoretical option prices using the Black-Scholes formula
 */

import { OptionType, BlackScholesParams, BlackScholesResult } from '../types';
import { CalculationError, ErrorCode, checkDivisionByZero } from '../types/errors';
import { normalCDF, calculateD1, calculateD2 } from './helpers';
import { calcIntrinsicValue } from './basic-pl';

/**
 * Calculate option price using Black-Scholes model
 *
 * Black-Scholes formula:
 * Call: C = S₀N(d₁) - Ke^(-rT)N(d₂)
 * Put: P = Ke^(-rT)N(-d₂) - S₀N(-d₁)
 *
 * Where:
 * - d₁ = [ln(S₀/K) + (r + σ²/2)T] / (σ√T)
 * - d₂ = d₁ - σ√T
 * - N(x) = cumulative standard normal distribution
 *
 * @param params - Black-Scholes parameters
 * @returns Option price, d1, and d2 values
 *
 * @throws {CalculationError} If parameters are invalid
 *
 * @example
 * const result = blackScholes({
 *   optionType: OptionType.CALL,
 *   stockPrice: 100,
 *   strikePrice: 100,
 *   timeToExpiry: 0.25, // 3 months
 *   riskFreeRate: 0.05,
 *   volatility: 0.30
 * });
 * console.log(result.optionPrice); // ~7.97
 */
export function blackScholes(params: BlackScholesParams): BlackScholesResult {
  const { optionType, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;

  // Validate inputs
  validateBlackScholesInputs(params);

  // Handle edge case: at or past expiration
  if (timeToExpiry <= 0) {
    const intrinsicValue = calcIntrinsicValue(optionType, stockPrice, strikePrice);
    return {
      optionPrice: intrinsicValue,
      d1: 0,
      d2: 0,
    };
  }

  // Handle edge case: zero volatility
  if (volatility === 0) {
    const intrinsicValue = calcIntrinsicValue(optionType, stockPrice, strikePrice);
    const presentValueStrike = strikePrice * Math.exp(-riskFreeRate * timeToExpiry);

    if (optionType === OptionType.CALL) {
      return {
        optionPrice: Math.max(0, stockPrice - presentValueStrike),
        d1: stockPrice > strikePrice ? Infinity : -Infinity,
        d2: stockPrice > strikePrice ? Infinity : -Infinity,
      };
    } else {
      return {
        optionPrice: Math.max(0, presentValueStrike - stockPrice),
        d1: stockPrice < strikePrice ? -Infinity : Infinity,
        d2: stockPrice < strikePrice ? -Infinity : Infinity,
      };
    }
  }

  // Calculate d1 and d2
  let d1: number;
  let d2: number;

  try {
    d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
    d2 = calculateD2(d1, volatility, timeToExpiry);
  } catch (error) {
    throw new CalculationError(
      'Failed to calculate d1/d2 in Black-Scholes model',
      ErrorCode.CALCULATION_FAILED,
      { error: error instanceof Error ? error.message : String(error), params }
    );
  }

  // Calculate option price based on type
  let optionPrice: number;

  try {
    if (optionType === OptionType.CALL) {
      // Call option: C = S₀N(d₁) - Ke^(-rT)N(d₂)
      const term1 = stockPrice * normalCDF(d1);
      const term2 = strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
      optionPrice = term1 - term2;
    } else {
      // Put option: P = Ke^(-rT)N(-d₂) - S₀N(-d₁)
      const term1 = strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2);
      const term2 = stockPrice * normalCDF(-d1);
      optionPrice = term1 - term2;
    }
  } catch (error) {
    throw new CalculationError(
      'Failed to calculate option price in Black-Scholes model',
      ErrorCode.CALCULATION_FAILED,
      { error: error instanceof Error ? error.message : String(error), params }
    );
  }

  // Ensure non-negative price
  optionPrice = Math.max(0, optionPrice);

  return {
    optionPrice,
    d1,
    d2,
  };
}

/**
 * Calculate option price for a call using Black-Scholes
 * Convenience wrapper for blackScholes with CALL type
 *
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Call option price
 */
export function blackScholesCall(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  const result = blackScholes({
    optionType: OptionType.CALL,
    stockPrice,
    strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility,
  });
  return result.optionPrice;
}

/**
 * Calculate option price for a put using Black-Scholes
 * Convenience wrapper for blackScholes with PUT type
 *
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Put option price
 */
export function blackScholesPut(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  const result = blackScholes({
    optionType: OptionType.PUT,
    stockPrice,
    strikePrice,
    timeToExpiry,
    riskFreeRate,
    volatility,
  });
  return result.optionPrice;
}

/**
 * Calculate time value of an option
 * Time value = Option price - Intrinsic value
 *
 * @param optionPrice - Theoretical option price (from Black-Scholes)
 * @param intrinsicValue - Intrinsic value of option
 * @returns Time value (always >= 0)
 *
 * @example
 * const optionPrice = 7.97;
 * const intrinsicValue = 5;
 * calcTimeValue(optionPrice, intrinsicValue); // returns 2.97
 */
export function calcTimeValue(optionPrice: number, intrinsicValue: number): number {
  return Math.max(0, optionPrice - intrinsicValue);
}

/**
 * Verify put-call parity relationship
 * Put-Call Parity: C - P = S - K*e^(-rT)
 *
 * This can be used to verify Black-Scholes calculations
 *
 * @param callPrice - Call option price
 * @param putPrice - Put option price
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param tolerance - Tolerance for equality check (default 0.01)
 * @returns True if put-call parity holds within tolerance
 *
 * @example
 * const callPrice = blackScholesCall(...);
 * const putPrice = blackScholesPut(...);
 * verifyPutCallParity(callPrice, putPrice, 100, 100, 0.25, 0.05); // returns true
 */
export function verifyPutCallParity(
  callPrice: number,
  putPrice: number,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  tolerance: number = 0.01
): boolean {
  const leftSide = callPrice - putPrice;
  const rightSide = stockPrice - strikePrice * Math.exp(-riskFreeRate * timeToExpiry);

  return Math.abs(leftSide - rightSide) < tolerance;
}

/**
 * Validate Black-Scholes inputs
 * @throws {CalculationError} If any input is invalid
 */
function validateBlackScholesInputs(params: BlackScholesParams): void {
  const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = params;

  if (stockPrice <= 0) {
    throw new CalculationError(
      'Stock price must be greater than 0',
      ErrorCode.INVALID_INPUT,
      { stockPrice }
    );
  }

  if (strikePrice <= 0) {
    throw new CalculationError(
      'Strike price must be greater than 0',
      ErrorCode.INVALID_INPUT,
      { strikePrice }
    );
  }

  if (timeToExpiry < 0) {
    throw new CalculationError(
      'Time to expiry cannot be negative',
      ErrorCode.INVALID_INPUT,
      { timeToExpiry }
    );
  }

  if (volatility < 0) {
    throw new CalculationError(
      'Volatility cannot be negative',
      ErrorCode.INVALID_INPUT,
      { volatility }
    );
  }

  if (volatility > 5) {
    throw new CalculationError(
      'Volatility seems unreasonably high (> 500%)',
      ErrorCode.INVALID_INPUT,
      { volatility }
    );
  }

  if (Math.abs(riskFreeRate) > 1) {
    throw new CalculationError(
      'Risk-free rate seems unreasonable (> 100% or < -100%)',
      ErrorCode.INVALID_INPUT,
      { riskFreeRate }
    );
  }
}
