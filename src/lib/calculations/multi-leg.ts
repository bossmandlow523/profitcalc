/**
 * Multi-Leg Strategy Calculator
 * Handles calculations for complex options strategies with multiple legs
 */

import { OptionType, Position, OptionLeg } from '../types';
import { CONTRACT_MULTIPLIER } from '../constants/defaults';
import { calcLegPL } from './basic-pl';
import { CalculationError, ErrorCode } from '../types/errors';

/**
 * Calculate total profit/loss across all legs at a given stock price
 *
 * @param legs - Array of option legs
 * @param stockPrice - Stock price to evaluate at
 * @returns Total P/L in dollars
 *
 * @example
 * const legs = [
 *   { optionType: CALL, position: LONG, strike: 50, premium: 3, quantity: 1, ... },
 *   { optionType: CALL, position: SHORT, strike: 55, premium: 1, quantity: 1, ... }
 * ];
 * calcTotalPL(legs, 60); // Bull call spread profit
 */
export function calcTotalPL(legs: OptionLeg[], stockPrice: number): number {
  if (legs.length === 0) {
    return 0;
  }

  return legs.reduce((total, leg) => {
    return total + calcLegPL(leg, stockPrice);
  }, 0);
}

/**
 * Calculate initial cost/credit for a strategy
 * Negative = net debit (cost to enter)
 * Positive = net credit (receive premium)
 *
 * @param legs - Array of option legs
 * @returns Initial cost (negative) or credit (positive) in dollars
 *
 * @example
 * // Bull call spread: Buy $50 call for $3, Sell $55 call for $1
 * // Net debit = -$200
 * calcInitialCost(legs); // returns -200
 */
export function calcInitialCost(legs: OptionLeg[]): number {
  return legs.reduce((total, leg) => {
    const premium = leg.premium * CONTRACT_MULTIPLIER * leg.quantity;

    // Long positions cost money (negative)
    // Short positions credit money (positive)
    return total + (leg.position === Position.LONG ? -premium : premium);
  }, 0);
}

/**
 * Calculate maximum profit for a strategy
 * Returns null if profit is unlimited
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price for price range estimation
 * @returns Maximum profit in dollars, or null if unlimited
 *
 * @example
 * // Bull call spread has limited max profit
 * calcMaxProfit(legs, 100); // returns 300
 *
 * // Long call has unlimited profit
 * calcMaxProfit([longCall], 100); // returns null
 */
export function calcMaxProfit(
  legs: OptionLeg[],
  currentStockPrice: number
): number | null {
  if (legs.length === 0) {
    return 0;
  }

  // Check for unlimited profit potential
  if (hasUnlimitedProfit(legs)) {
    return null;
  }

  // Generate strategic price points to test
  const pricePoints = generateStrategicPricePoints(currentStockPrice, legs);

  // Calculate P/L at each price point and find maximum
  const profits = pricePoints.map((price) => calcTotalPL(legs, price));

  return Math.max(...profits);
}

/**
 * Calculate maximum loss for a strategy
 * Returns null if loss is unlimited
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price for price range estimation
 * @returns Maximum loss in dollars (negative), or null if unlimited
 *
 * @example
 * // Bull call spread has limited max loss
 * calcMaxLoss(legs, 100); // returns -200
 *
 * // Short call has unlimited loss
 * calcMaxLoss([shortCall], 100); // returns null
 */
export function calcMaxLoss(
  legs: OptionLeg[],
  currentStockPrice: number
): number | null {
  if (legs.length === 0) {
    return 0;
  }

  // Check for unlimited loss potential
  if (hasUnlimitedLoss(legs)) {
    return null;
  }

  // Generate strategic price points to test
  const pricePoints = generateStrategicPricePoints(currentStockPrice, legs);

  // Calculate P/L at each price point and find minimum (most negative)
  const profits = pricePoints.map((price) => calcTotalPL(legs, price));

  return Math.min(...profits);
}

/**
 * Check if strategy has unlimited profit potential
 * A strategy has unlimited profit if it has uncovered long calls
 *
 * @param legs - Array of option legs
 * @returns True if profit is unlimited
 */
export function hasUnlimitedProfit(legs: OptionLeg[]): boolean {
  // Get all long calls
  const longCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.LONG
  );

  // Get all short calls
  const shortCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.SHORT
  );

  // Calculate net long call quantity
  const longCallQuantity = longCalls.reduce((sum, leg) => sum + leg.quantity, 0);
  const shortCallQuantity = shortCalls.reduce((sum, leg) => sum + leg.quantity, 0);

  // If we have more long calls than short calls, profit is unlimited
  // (assuming long calls have lower or equal strikes)
  if (longCallQuantity > shortCallQuantity) {
    // Check if long calls are truly uncovered
    return !areAllCallsCovered(legs);
  }

  return false;
}

/**
 * Check if strategy has unlimited loss potential
 * A strategy has unlimited loss if it has uncovered short calls
 *
 * @param legs - Array of option legs
 * @returns True if loss is unlimited
 */
export function hasUnlimitedLoss(legs: OptionLeg[]): boolean {
  // Get all short calls
  const shortCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.SHORT
  );

  if (shortCalls.length === 0) {
    return false;
  }

  // Get all long calls
  const longCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.LONG
  );

  // Calculate net short call quantity
  const shortCallQuantity = shortCalls.reduce((sum, leg) => sum + leg.quantity, 0);
  const longCallQuantity = longCalls.reduce((sum, leg) => sum + leg.quantity, 0);

  // If we have more short calls than long calls, loss is unlimited
  if (shortCallQuantity > longCallQuantity) {
    return !areAllCallsCovered(legs);
  }

  return false;
}

/**
 * Check if all short calls are covered by long calls
 *
 * @param legs - Array of option legs
 * @returns True if all short calls are covered
 */
function areAllCallsCovered(legs: OptionLeg[]): boolean {
  const shortCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.SHORT
  );

  const longCalls = legs.filter(
    (leg) => leg.optionType === OptionType.CALL && leg.position === Position.LONG
  );

  // Each short call must be covered by a long call at equal or lower strike
  return shortCalls.every((shortCall) => {
    // Find long calls that can cover this short call
    const coveringLongCalls = longCalls.filter(
      (longCall) => longCall.strikePrice <= shortCall.strikePrice
    );

    // Sum up covering quantity
    const coveringQuantity = coveringLongCalls.reduce(
      (sum, leg) => sum + leg.quantity,
      0
    );

    return coveringQuantity >= shortCall.quantity;
  });
}

/**
 * Generate strategic price points for max profit/loss analysis
 * Includes strikes, current price, and boundary points
 *
 * @param currentPrice - Current stock price
 * @param legs - Array of option legs
 * @returns Array of prices to test
 */
export function generateStrategicPricePoints(
  currentPrice: number,
  legs: OptionLeg[]
): number[] {
  const strikes = legs.map((leg) => leg.strikePrice);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  const points = new Set<number>([
    0, // Stock goes to zero (for puts)
    minStrike * 0.5, // Well below min strike
    ...strikes, // All strike prices
    currentPrice, // Current price
    maxStrike * 1.5, // Well above max strike
    maxStrike * 2, // Very high price (for calls)
  ]);

  // Add midpoints between consecutive strikes
  const sortedStrikes = Array.from(new Set(strikes)).sort((a, b) => a - b);
  for (let i = 0; i < sortedStrikes.length - 1; i++) {
    const midpoint = (sortedStrikes[i] + sortedStrikes[i + 1]) / 2;
    points.add(midpoint);
  }

  // Convert to sorted array and filter out negative prices
  return Array.from(points)
    .filter((price) => price >= 0)
    .sort((a, b) => a - b);
}

/**
 * Determine if a strategy is delta neutral
 * A strategy is approximately delta neutral if total delta is near zero
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price
 * @param tolerance - Tolerance for delta neutrality (default 0.1)
 * @returns True if strategy is approximately delta neutral
 *
 * Note: This is a simple check. For accurate delta, use Greeks calculations.
 */
export function isDeltaNeutral(
  legs: OptionLeg[],
  currentStockPrice: number,
  tolerance: number = 0.1
): boolean {
  // Simple heuristic: check if long and short positions are balanced
  const longCallQuantity = legs
    .filter((leg) => leg.optionType === OptionType.CALL && leg.position === Position.LONG)
    .reduce((sum, leg) => sum + leg.quantity, 0);

  const shortCallQuantity = legs
    .filter((leg) => leg.optionType === OptionType.CALL && leg.position === Position.SHORT)
    .reduce((sum, leg) => sum + leg.quantity, 0);

  const longPutQuantity = legs
    .filter((leg) => leg.optionType === OptionType.PUT && leg.position === Position.LONG)
    .reduce((sum, leg) => sum + leg.quantity, 0);

  const shortPutQuantity = legs
    .filter((leg) => leg.optionType === OptionType.PUT && leg.position === Position.SHORT)
    .reduce((sum, leg) => sum + leg.quantity, 0);

  // Very rough approximation
  const estimatedDelta =
    longCallQuantity * 0.5 -
    shortCallQuantity * 0.5 -
    longPutQuantity * 0.5 +
    shortPutQuantity * 0.5;

  return Math.abs(estimatedDelta) < tolerance;
}

/**
 * Classify strategy type based on legs
 * This is a simple heuristic classification
 *
 * @param legs - Array of option legs
 * @returns Strategy classification string
 */
export function classifyStrategy(legs: OptionLeg[]): string {
  if (legs.length === 0) return 'Empty';
  if (legs.length === 1) return 'Single Leg';

  const callLegs = legs.filter((leg) => leg.optionType === OptionType.CALL);
  const putLegs = legs.filter((leg) => leg.optionType === OptionType.PUT);

  // Straddle/Strangle detection
  if (callLegs.length === 1 && putLegs.length === 1) {
    const call = callLegs[0];
    const put = putLegs[0];

    if (call.position === put.position) {
      if (call.strikePrice === put.strikePrice) {
        return call.position === Position.LONG ? 'Long Straddle' : 'Short Straddle';
      } else {
        return call.position === Position.LONG ? 'Long Strangle' : 'Short Strangle';
      }
    }
  }

  // Vertical spread detection (2 legs, same type, opposite positions)
  if (legs.length === 2 && (callLegs.length === 2 || putLegs.length === 2)) {
    const leg1 = legs[0];
    const leg2 = legs[1];

    if (leg1.optionType === leg2.optionType && leg1.position !== leg2.position) {
      const longLeg = leg1.position === Position.LONG ? leg1 : leg2;
      const shortLeg = leg1.position === Position.SHORT ? leg1 : leg2;

      if (leg1.optionType === OptionType.CALL) {
        if (longLeg.strikePrice < shortLeg.strikePrice) {
          return 'Bull Call Spread';
        } else {
          return 'Bear Call Spread';
        }
      } else {
        if (longLeg.strikePrice > shortLeg.strikePrice) {
          return 'Bear Put Spread';
        } else {
          return 'Bull Put Spread';
        }
      }
    }
  }

  // Iron Condor detection (4 legs)
  if (legs.length === 4 && callLegs.length === 2 && putLegs.length === 2) {
    return 'Iron Condor';
  }

  return 'Custom Strategy';
}

/**
 * Validate that legs array is not empty and contains valid legs
 *
 * @param legs - Array of option legs
 * @throws {CalculationError} If validation fails
 */
export function validateLegs(legs: OptionLeg[]): void {
  if (!Array.isArray(legs)) {
    throw new CalculationError(
      'Legs must be an array',
      ErrorCode.INVALID_INPUT,
      { legs }
    );
  }

  if (legs.length === 0) {
    throw new CalculationError(
      'At least one option leg is required',
      ErrorCode.INVALID_INPUT
    );
  }

  if (legs.length > 8) {
    throw new CalculationError(
      'Maximum 8 option legs supported',
      ErrorCode.INVALID_INPUT,
      { legCount: legs.length }
    );
  }

  // Validate each leg has required fields
  legs.forEach((leg, index) => {
    if (!leg.id) {
      throw new CalculationError(
        `Leg ${index} is missing required field: id`,
        ErrorCode.INVALID_INPUT,
        { index, leg }
      );
    }

    if (!leg.optionType || !Object.values(OptionType).includes(leg.optionType)) {
      throw new CalculationError(
        `Leg ${index} has invalid option type`,
        ErrorCode.INVALID_INPUT,
        { index, optionType: leg.optionType }
      );
    }

    if (!leg.position || !Object.values(Position).includes(leg.position)) {
      throw new CalculationError(
        `Leg ${index} has invalid position`,
        ErrorCode.INVALID_INPUT,
        { index, position: leg.position }
      );
    }
  });
}
