/**
 * Break-Even Point Calculator
 * Finds stock prices where strategy P/L equals zero
 */

import { OptionLeg, ErrorCode, OptionType, Position } from '../types';
import { calcTotalPL, generateStrategicPricePoints } from './multi-leg';
import { calcSingleOptionBreakEven } from './basic-pl';
import { BREAK_EVEN_PRECISION, MAX_ITERATIONS, CONTRACT_MULTIPLIER } from '../constants/defaults';
import { CalculationError } from '../types/errors';
import { roundTo } from './helpers';
import { detectStrategy, StrategyType } from './strategy-detector';

/**
 * Find all break-even points for a multi-leg strategy
 * Uses a combination of strategic price points and bisection method
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price (used for price range)
 * @param priceRange - Percentage range to search (+/- from current price, default 0.5)
 * @param precision - Precision for break-even prices (default BREAK_EVEN_PRECISION)
 * @returns Array of break-even stock prices, sorted ascending
 *
 * @example
 * const legs = [longCall, shortCall]; // Bull call spread
 * const breakEvens = findBreakEvens(legs, 100, 0.5);
 * // Returns [52.0, 55.0] if those are the break-even prices
 */
export function findBreakEvens(
  legs: OptionLeg[],
  currentStockPrice: number,
  priceRange: number = 0.5,
  precision: number = BREAK_EVEN_PRECISION
): number[] {
  if (legs.length === 0) {
    return [];
  }

  // For single leg strategies, use analytical formula
  if (legs.length === 1 && legs[0]) {
    const leg = legs[0];
    const premiumPerShare = leg.premium / CONTRACT_MULTIPLIER;
    const breakEven = calcSingleOptionBreakEven(
      leg.optionType,
      leg.strikePrice,
      premiumPerShare
    );
    return [roundTo(breakEven, 2)];
  }

  // Try analytical formulas for known strategies
  const analyticalBreakEvens = tryAnalyticalBreakEvens(legs);
  if (analyticalBreakEvens !== null) {
    return analyticalBreakEvens.map((be) => roundTo(be, 2));
  }

  // Define search range
  const minPrice = Math.max(0, currentStockPrice * (1 - priceRange));
  const maxPrice = currentStockPrice * (1 + priceRange);

  // Find break-even points using scan and bisection
  return findBreakEvensByScan(legs, minPrice, maxPrice, precision);
}

/**
 * Try to calculate break-evens analytically for known strategies
 * Returns null if strategy doesn't have analytical solution
 */
function tryAnalyticalBreakEvens(legs: OptionLeg[]): number[] | null {
  const detection = detectStrategy(legs);

  // Only use analytical formulas if we're confident
  if (detection.confidence < 0.8) {
    return null;
  }

  try {
    switch (detection.type) {
      case StrategyType.BULL_CALL_SPREAD:
      case StrategyType.BEAR_CALL_SPREAD: {
        // Vertical call spread: B/E = lower strike + net debit
        const longLeg = legs.find((l) => l.position === Position.LONG)!;
        const shortLeg = legs.find((l) => l.position === Position.SHORT)!;
        const netDebit = (longLeg.premium - shortLeg.premium) / CONTRACT_MULTIPLIER;
        const lowerStrike = Math.min(longLeg.strikePrice, shortLeg.strikePrice);
        return [lowerStrike + netDebit];
      }

      case StrategyType.BULL_PUT_SPREAD:
      case StrategyType.BEAR_PUT_SPREAD: {
        // Vertical put spread: B/E = higher strike - net debit
        const longLeg = legs.find((l) => l.position === Position.LONG)!;
        const shortLeg = legs.find((l) => l.position === Position.SHORT)!;
        const netDebit = (longLeg.premium - shortLeg.premium) / CONTRACT_MULTIPLIER;
        const higherStrike = Math.max(longLeg.strikePrice, shortLeg.strikePrice);
        return [higherStrike - Math.abs(netDebit)];
      }

      case StrategyType.LONG_STRADDLE: {
        // Long straddle: two break-evens at K ± total premium
        const call = legs.find((l) => l.optionType === OptionType.CALL)!;
        const put = legs.find((l) => l.optionType === OptionType.PUT)!;
        const totalPremium = (call.premium + put.premium) / CONTRACT_MULTIPLIER;
        const K = call.strikePrice;
        return [K - totalPremium, K + totalPremium].sort((a, b) => a - b);
      }

      case StrategyType.LONG_STRANGLE: {
        // Long strangle: two break-evens
        const call = legs.find((l) => l.optionType === OptionType.CALL)!;
        const put = legs.find((l) => l.optionType === OptionType.PUT)!;
        const totalPremium = (call.premium + put.premium) / CONTRACT_MULTIPLIER;
        return [put.strikePrice - totalPremium, call.strikePrice + totalPremium].sort((a, b) => a - b);
      }

      case StrategyType.SHORT_STRADDLE: {
        // Short straddle: two break-evens at K ± total premium
        const call = legs.find((l) => l.optionType === OptionType.CALL)!;
        const put = legs.find((l) => l.optionType === OptionType.PUT)!;
        const totalPremium = (call.premium + put.premium) / CONTRACT_MULTIPLIER;
        const K = call.strikePrice;
        return [K - totalPremium, K + totalPremium].sort((a, b) => a - b);
      }

      case StrategyType.SHORT_STRANGLE: {
        // Short strangle: two break-evens
        const call = legs.find((l) => l.optionType === OptionType.CALL)!;
        const put = legs.find((l) => l.optionType === OptionType.PUT)!;
        const totalPremium = (call.premium + put.premium) / CONTRACT_MULTIPLIER;
        return [put.strikePrice - totalPremium, call.strikePrice + totalPremium].sort((a, b) => a - b);
      }

      case StrategyType.IRON_CONDOR: {
        // Iron condor: two break-evens
        const puts = legs.filter((l) => l.optionType === OptionType.PUT);
        const calls = legs.filter((l) => l.optionType === OptionType.CALL);
        const shortPut = puts.find((l) => l.position === Position.SHORT)!;
        const shortCall = calls.find((l) => l.position === Position.SHORT)!;

        const netCredit = legs.reduce((sum, leg) => {
          return sum + (leg.position === Position.SHORT ? leg.premium : -leg.premium);
        }, 0) / CONTRACT_MULTIPLIER;

        return [
          shortPut.strikePrice - netCredit,
          shortCall.strikePrice + netCredit
        ].sort((a, b) => a - b);
      }

      case StrategyType.BUTTERFLY: {
        // Butterfly: typically one break-even on each side of center strike
        // For simplicity, use numerical method (complex analytical formula)
        return null;
      }

      default:
        return null;
    }
  } catch (error) {
    console.warn('Analytical break-even calculation failed:', error);
    return null;
  }
}

/**
 * Find break-even points by scanning price range
 * Detects zero crossings and refines with bisection method
 *
 * @param legs - Array of option legs
 * @param minPrice - Minimum price to scan
 * @param maxPrice - Maximum price to scan
 * @param precision - Desired precision for break-even prices
 * @returns Array of break-even prices
 */
function findBreakEvensByScan(
  legs: OptionLeg[],
  minPrice: number,
  maxPrice: number,
  precision: number
): number[] {
  const breakEvens: number[] = [];
  const step = 0.1; // Scan in $0.10 increments for initial detection

  let prevPrice = minPrice;
  let prevPL = calcTotalPL(legs, prevPrice);

  // Scan through price range looking for zero crossings
  for (let price = minPrice + step; price <= maxPrice; price += step) {
    const currentPL = calcTotalPL(legs, price);

    // Check if P/L crossed zero
    if (hasZeroCrossing(prevPL, currentPL)) {
      // Refine using bisection method
      try {
        const refinedBreakEven = bisectionMethod(
          legs,
          prevPrice,
          price,
          precision
        );

        // Only add if it's not too close to an existing break-even
        if (!isDuplicate(breakEvens, refinedBreakEven, precision * 10)) {
          breakEvens.push(refinedBreakEven);
        }
      } catch (error) {
        // If bisection fails, skip this crossing
        console.warn('Bisection failed for crossing at', price, error);
      }
    }

    prevPrice = price;
    prevPL = currentPL;
  }

  // Also check strategic price points (strikes, etc.)
  const strategicPoints = generateStrategicPricePoints(
    (minPrice + maxPrice) / 2,
    legs
  ).filter((p) => p >= minPrice && p <= maxPrice);

  // Check around each strategic point for break-evens we might have missed
  for (const point of strategicPoints) {
    const checkRange = 5; // Check $5 around each strategic point
    const localMin = Math.max(minPrice, point - checkRange);
    const localMax = Math.min(maxPrice, point + checkRange);

    const localBreakEvens = findBreakEvensByScan(
      legs,
      localMin,
      localMax,
      precision
    );

    for (const be of localBreakEvens) {
      if (!isDuplicate(breakEvens, be, precision * 10)) {
        breakEvens.push(be);
      }
    }
  }

  // Sort and return
  return breakEvens.sort((a, b) => a - b).map((be) => roundTo(be, 2));
}

/**
 * Check if P/L crossed zero between two points
 *
 * @param pl1 - P/L at first point
 * @param pl2 - P/L at second point
 * @returns True if zero crossing occurred
 */
function hasZeroCrossing(pl1: number, pl2: number): boolean {
  // Check if signs are different (one positive, one negative)
  return (pl1 < 0 && pl2 >= 0) || (pl1 > 0 && pl2 <= 0) || pl1 === 0 || pl2 === 0;
}

/**
 * Bisection method to find exact break-even point
 * Refines the break-even price to desired precision
 *
 * @param legs - Array of option legs
 * @param low - Lower bound price
 * @param high - Upper bound price
 * @param precision - Desired precision (default BREAK_EVEN_PRECISION)
 * @returns Refined break-even price
 *
 * @throws {CalculationError} If max iterations reached or invalid inputs
 */
export function bisectionMethod(
  legs: OptionLeg[],
  low: number,
  high: number,
  precision: number = BREAK_EVEN_PRECISION
): number {
  if (low >= high) {
    throw new CalculationError(
      'Invalid bounds for bisection: low must be less than high',
      ErrorCode.INVALID_INPUT,
      { low, high }
    );
  }

  let iterations = 0;
  let mid = (low + high) / 2;

  while (high - low > precision && iterations < MAX_ITERATIONS) {
    mid = (low + high) / 2;
    const midPL = calcTotalPL(legs, mid);

    // Check if we found exact break-even
    if (Math.abs(midPL) < precision) {
      return mid;
    }

    // Determine which half to search
    const lowPL = calcTotalPL(legs, low);

    if ((lowPL < 0 && midPL < 0) || (lowPL > 0 && midPL > 0)) {
      // Same sign, search upper half
      low = mid;
    } else {
      // Different sign, search lower half
      high = mid;
    }

    iterations++;
  }

  if (iterations >= MAX_ITERATIONS) {
    throw new CalculationError(
      'Bisection method exceeded maximum iterations',
      ErrorCode.NUMERICAL_INSTABILITY,
      { iterations, low, high, precision }
    );
  }

  return mid;
}

/**
 * Check if a break-even price is a duplicate of existing ones
 *
 * @param existingBreakEvens - Array of existing break-even prices
 * @param newBreakEven - New break-even price to check
 * @param tolerance - Tolerance for considering prices equal (default 0.01)
 * @returns True if newBreakEven is too close to an existing one
 */
function isDuplicate(
  existingBreakEvens: number[],
  newBreakEven: number,
  tolerance: number = 0.01
): boolean {
  return existingBreakEvens.some(
    (existing) => Math.abs(existing - newBreakEven) < tolerance
  );
}

/**
 * Find break-even points using Newton's method (alternative to bisection)
 * More efficient but requires derivative (delta)
 *
 * Note: This is a placeholder for future implementation if needed
 *
 * @param legs - Array of option legs
 * @param initialGuess - Starting price for Newton's method
 * @param precision - Desired precision
 * @returns Break-even price
 */
export function newtonMethod(
  _legs: OptionLeg[],
  _initialGuess: number,
  _precision: number = BREAK_EVEN_PRECISION
): number {
  // TODO: Implement Newton's method using numerical derivative
  // This would be more efficient but requires calculating delta
  // For now, use bisection method instead
  throw new Error('Newton method not yet implemented. Use bisectionMethod instead.');
}

/**
 * Estimate number of break-even points for a strategy
 * Based on strategy structure (heuristic)
 *
 * @param legs - Array of option legs
 * @returns Estimated number of break-even points
 *
 * @example
 * // Single option: 1 break-even
 * estimateBreakEvenCount([longCall]); // returns 1
 *
 * // Vertical spread: 1 break-even
 * estimateBreakEvenCount([longCall, shortCall]); // returns 1
 *
 * // Iron condor: 2 break-evens
 * estimateBreakEvenCount([...ironCondorLegs]); // returns 2
 */
export function estimateBreakEvenCount(legs: OptionLeg[]): number {
  if (legs.length === 0) return 0;
  if (legs.length === 1) return 1;

  // Heuristic: typically one break-even per spread component
  // This is a rough estimate and actual count may vary
  const callLegs = legs.filter((leg) => leg.optionType === 'call');
  const putLegs = legs.filter((leg) => leg.optionType === 'put');

  if (callLegs.length > 0 && putLegs.length > 0) {
    // Strategy involves both calls and puts (e.g., straddle, iron condor)
    return 2;
  }

  // Single type spread
  return 1;
}

/**
 * Validate break-even calculation inputs
 *
 * @param currentStockPrice - Current stock price
 * @param priceRange - Price range percentage
 * @throws {CalculationError} If validation fails
 */
export function validateBreakEvenInputs(
  currentStockPrice: number,
  priceRange: number
): void {
  if (currentStockPrice <= 0) {
    throw new CalculationError(
      'Current stock price must be greater than 0',
      ErrorCode.INVALID_INPUT,
      { currentStockPrice }
    );
  }

  if (priceRange <= 0 || priceRange > 10) {
    throw new CalculationError(
      'Price range must be between 0 and 10 (0-1000%)',
      ErrorCode.INVALID_INPUT,
      { priceRange }
    );
  }
}

/**
 * Format break-even points for display
 *
 * @param breakEvens - Array of break-even prices
 * @returns Formatted string
 *
 * @example
 * formatBreakEvens([52.50, 105.75]); // returns "$52.50, $105.75"
 * formatBreakEvens([]); // returns "None"
 */
export function formatBreakEvens(breakEvens: number[]): string {
  if (breakEvens.length === 0) {
    return 'None';
  }

  return breakEvens.map((be) => `$${be.toFixed(2)}`).join(', ');
}
