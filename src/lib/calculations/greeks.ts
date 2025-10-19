/**
 * Greeks Calculations for Options
 * Calculate Delta, Gamma, Theta, Vega, and Rho
 */

import { OptionType, Position, OptionLeg, GreeksResult, LegGreeks, ErrorCode } from '../types';
import { normalCDF, normalPDF, calculateD1, calculateD2, calculateTimeToExpiry } from './helpers';
import { DAYS_PER_YEAR } from '../constants/defaults';
import { CalculationError } from '../types/errors';

/**
 * Calculate Delta - sensitivity to stock price changes
 *
 * Delta measures how much the option price changes per $1 change in stock price
 * Call Delta: N(d₁) (ranges from 0 to 1)
 * Put Delta: N(d₁) - 1 (ranges from -1 to 0)
 *
 * @param optionType - Call or Put
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Delta value
 *
 * @example
 * // ATM call option
 * calcDelta(OptionType.CALL, 100, 100, 0.25, 0.05, 0.30); // ~0.54
 */
export function calcDelta(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  // At expiration, delta is binary
  if (timeToExpiry <= 0) {
    if (optionType === OptionType.CALL) {
      return stockPrice >= strikePrice ? 1 : 0;
    } else {
      return stockPrice <= strikePrice ? -1 : 0;
    }
  }

  // Handle zero volatility
  if (volatility === 0) {
    if (optionType === OptionType.CALL) {
      return stockPrice > strikePrice ? 1 : 0;
    } else {
      return stockPrice < strikePrice ? -1 : 0;
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
 *
 * Gamma measures how much delta changes per $1 change in stock price
 * Same for both calls and puts: φ(d₁) / (S × σ × √T)
 *
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Gamma value
 *
 * @example
 * // ATM option has highest gamma
 * calcGamma(100, 100, 0.25, 0.05, 0.30); // ~0.0199
 */
export function calcGamma(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;
  if (volatility === 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const denominator = stockPrice * volatility * Math.sqrt(timeToExpiry);

  if (denominator === 0) return 0;

  return normalPDF(d1) / denominator;
}

/**
 * Calculate Theta - time decay (per day)
 *
 * Theta measures how much the option price decreases per day (all else equal)
 * Usually negative for long options (time decay)
 *
 * Call Theta: -[S×φ(d₁)×σ / (2√T)] - r×K×e^(-rT)×N(d₂)
 * Put Theta: -[S×φ(d₁)×σ / (2√T)] + r×K×e^(-rT)×N(-d₂)
 *
 * @param optionType - Call or Put
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Theta value (per day)
 *
 * @example
 * // ATM call option - negative theta (time decay)
 * calcTheta(OptionType.CALL, 100, 100, 0.25, 0.05, 0.30); // ~-0.0276
 */
export function calcTheta(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;
  if (volatility === 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const d2 = calculateD2(d1, volatility, timeToExpiry);

  // First term (common to both calls and puts)
  const sqrtT = Math.sqrt(timeToExpiry);
  const term1 = -(stockPrice * normalPDF(d1) * volatility) / (2 * sqrtT);

  // Second term (different for calls and puts)
  const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);

  if (optionType === OptionType.CALL) {
    const term2 = riskFreeRate * strikePrice * discountFactor * normalCDF(d2);
    // Convert to per-day by dividing by days per year
    return (term1 - term2) / DAYS_PER_YEAR;
  } else {
    const term2 = riskFreeRate * strikePrice * discountFactor * normalCDF(-d2);
    return (term1 + term2) / DAYS_PER_YEAR;
  }
}

/**
 * Calculate Vega - sensitivity to volatility changes
 *
 * Vega measures how much the option price changes per 1% change in volatility
 * Same for both calls and puts: S × φ(d₁) × √T / 100
 *
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Vega value (per 1% volatility change)
 *
 * @example
 * // ATM option with 3 months to expiry
 * calcVega(100, 100, 0.25, 0.05, 0.30); // ~0.1995
 */
export function calcVega(
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;
  if (volatility === 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);

  // Divide by 100 to show impact of 1 percentage point change (not 1% change)
  return (stockPrice * normalPDF(d1) * Math.sqrt(timeToExpiry)) / 100;
}

/**
 * Calculate Rho - sensitivity to interest rate changes
 *
 * Rho measures how much the option price changes per 1% change in interest rates
 *
 * Call Rho: K × T × e^(-rT) × N(d₂) / 100
 * Put Rho: -K × T × e^(-rT) × N(-d₂) / 100
 *
 * @param optionType - Call or Put
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price
 * @param timeToExpiry - Time to expiration in years
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns Rho value (per 1% rate change)
 *
 * @example
 * // Call option - positive rho (benefits from higher rates)
 * calcRho(OptionType.CALL, 100, 100, 0.25, 0.05, 0.30); // ~0.1249
 */
export function calcRho(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number,
  timeToExpiry: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (timeToExpiry <= 0) return 0;
  if (volatility === 0) return 0;

  const d1 = calculateD1(stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility);
  const d2 = calculateD2(d1, volatility, timeToExpiry);

  const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);

  if (optionType === OptionType.CALL) {
    // Divide by 100 to show impact of 1 percentage point change
    return (strikePrice * timeToExpiry * discountFactor * normalCDF(d2)) / 100;
  } else {
    return (-strikePrice * timeToExpiry * discountFactor * normalCDF(-d2)) / 100;
  }
}

/**
 * Calculate all Greeks for an option leg
 *
 * @param leg - Option leg to calculate Greeks for
 * @param stockPrice - Current stock price
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns LegGreeks object with all Greek values
 *
 * @example
 * const leg = {
 *   id: '1',
 *   optionType: OptionType.CALL,
 *   position: Position.LONG,
 *   strikePrice: 100,
 *   premium: 5,
 *   quantity: 2,
 *   expiryDate: new Date('2025-03-31')
 * };
 * const greeks = calcLegGreeks(leg, 100, 0.05, 0.30);
 */
export function calcLegGreeks(
  leg: OptionLeg,
  stockPrice: number,
  riskFreeRate: number,
  volatility: number
): LegGreeks {
  const timeToExpiry = calculateTimeToExpiry(leg.expiryDate);

  try {
    const delta = calcDelta(
      leg.optionType,
      stockPrice,
      leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    );

    const gamma = calcGamma(
      stockPrice,
      leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    );

    const theta = calcTheta(
      leg.optionType,
      stockPrice,
      leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    );

    const vega = calcVega(
      stockPrice,
      leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    );

    const rho = calcRho(
      leg.optionType,
      stockPrice,
      leg.strikePrice,
      timeToExpiry,
      riskFreeRate,
      volatility
    );

    // Adjust for position (short = negative Greeks for directional Greeks)
    const positionMultiplier = leg.position === Position.LONG ? 1 : -1;
    const contractMultiplier = leg.quantity * 100; // Each contract = 100 shares

    return {
      legId: leg.id,
      delta: delta * positionMultiplier * contractMultiplier,
      gamma: gamma * positionMultiplier * contractMultiplier,
      theta: theta * positionMultiplier * contractMultiplier,
      vega: vega * positionMultiplier * contractMultiplier,
      rho: rho * positionMultiplier * contractMultiplier,
    };
  } catch (error) {
    throw new CalculationError(
      'Failed to calculate Greeks for option leg',
      ErrorCode.CALCULATION_FAILED,
      {
        legId: leg.id,
        error: error instanceof Error ? error.message : String(error),
      }
    );
  }
}

/**
 * Calculate aggregate Greeks for a multi-leg strategy
 *
 * @param legs - Array of option legs
 * @param stockPrice - Current stock price
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Volatility (decimal)
 * @returns GreeksResult with summed Greek values
 *
 * @example
 * const legs = [leg1, leg2, leg3];
 * const aggregateGreeks = calcAggregateGreeks(legs, 100, 0.05, 0.30);
 * console.log(aggregateGreeks.delta); // Net delta of entire position
 */
export function calcAggregateGreeks(
  legs: OptionLeg[],
  stockPrice: number,
  riskFreeRate: number,
  volatility: number
): GreeksResult {
  if (legs.length === 0) {
    return {
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0,
    };
  }

  const legGreeksArray = legs.map((leg) =>
    calcLegGreeks(leg, stockPrice, riskFreeRate, volatility)
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
 * Interpret delta as position equivalent
 * Delta can be thought of as share equivalence
 *
 * @param delta - Delta value
 * @returns Interpretation string
 *
 * @example
 * interpretDelta(0.5); // "Acts like 50 shares of stock"
 * interpretDelta(-1.0); // "Acts like -100 shares of stock"
 */
export function interpretDelta(delta: number): string {
  const absShares = Math.abs(Math.round(delta));
  const direction = delta >= 0 ? '' : '-';

  if (absShares === 0) {
    return 'Delta neutral position';
  }

  return `Acts like ${direction}${absShares} shares of stock`;
}

/**
 * Interpret theta as daily P/L impact
 *
 * @param theta - Theta value
 * @returns Interpretation string
 *
 * @example
 * interpretTheta(-25.50); // "Loses $25.50 per day (time decay)"
 * interpretTheta(10.25); // "Gains $10.25 per day (time decay)"
 */
export function interpretTheta(theta: number): string {
  const absTheta = Math.abs(theta).toFixed(2);

  if (theta < 0) {
    return `Loses $${absTheta} per day (time decay)`;
  } else if (theta > 0) {
    return `Gains $${absTheta} per day (time decay)`;
  } else {
    return 'No time decay';
  }
}
