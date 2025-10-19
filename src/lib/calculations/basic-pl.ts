/**
 * Basic Profit/Loss Calculations for Options
 * Calculates P/L at expiration (intrinsic value only, no time value)
 */

import { OptionType, Position, OptionLeg, ErrorCode } from '../types';
import { CONTRACT_MULTIPLIER } from '../constants/defaults';
import { CalculationError } from '../types/errors';
import { callPayoffLong, callPayoffShort, putPayoffLong, putPayoffShort, toContractPayoff } from './payoff-helpers';

/**
 * Calculate profit/loss for a long call option
 *
 * Formula: P/L = (max(0, S - K) × 100 - premium) × quantity
 *
 * @param stockPrice - Stock price at evaluation
 * @param strikePrice - Strike price of the option
 * @param premium - Premium paid per contract (total contract cost)
 * @param quantity - Number of contracts (default 1)
 * @returns Profit or loss in dollars
 *
 * @example
 * // Buy 1 call at $50 strike for $200 premium, stock at $55
 * calcLongCall(55, 50, 200, 1); // returns 300
 */
export function calcLongCall(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  validateInputs(stockPrice, strikePrice, premium, quantity);

  // Premium is per-contract, convert to per-share for helper
  const premiumPerShare = premium / CONTRACT_MULTIPLIER;
  const perSharePL = callPayoffLong(stockPrice, strikePrice, premiumPerShare);
  return toContractPayoff(perSharePL, quantity, CONTRACT_MULTIPLIER);
}

/**
 * Calculate profit/loss for a long put option
 *
 * Formula: P/L = (max(0, K - S) × 100 - premium) × quantity
 *
 * @param stockPrice - Stock price at evaluation
 * @param strikePrice - Strike price of the option
 * @param premium - Premium paid per contract (total contract cost)
 * @param quantity - Number of contracts (default 1)
 * @returns Profit or loss in dollars
 *
 * @example
 * // Buy 1 put at $50 strike for $200 premium, stock at $45
 * calcLongPut(45, 50, 200, 1); // returns 300
 */
export function calcLongPut(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  validateInputs(stockPrice, strikePrice, premium, quantity);

  // Premium is per-contract, convert to per-share for helper
  const premiumPerShare = premium / CONTRACT_MULTIPLIER;
  const perSharePL = putPayoffLong(stockPrice, strikePrice, premiumPerShare);
  return toContractPayoff(perSharePL, quantity, CONTRACT_MULTIPLIER);
}

/**
 * Calculate profit/loss for a short call option
 *
 * Formula: P/L = (premium - max(0, S - K) × 100) × quantity
 *
 * @param stockPrice - Stock price at evaluation
 * @param strikePrice - Strike price of the option
 * @param premium - Premium received per contract (total contract credit)
 * @param quantity - Number of contracts (default 1)
 * @returns Profit or loss in dollars
 *
 * @example
 * // Sell 1 call at $50 strike for $200 premium, stock at $55
 * calcShortCall(55, 50, 200, 1); // returns -300
 */
export function calcShortCall(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  validateInputs(stockPrice, strikePrice, premium, quantity);

  // Premium is per-contract, convert to per-share for helper
  const premiumPerShare = premium / CONTRACT_MULTIPLIER;
  const perSharePL = callPayoffShort(stockPrice, strikePrice, premiumPerShare);
  return toContractPayoff(perSharePL, quantity, CONTRACT_MULTIPLIER);
}

/**
 * Calculate profit/loss for a short put option
 *
 * Formula: P/L = (premium - max(0, K - S) × 100) × quantity
 *
 * @param stockPrice - Stock price at evaluation
 * @param strikePrice - Strike price of the option
 * @param premium - Premium received per contract (total contract credit)
 * @param quantity - Number of contracts (default 1)
 * @returns Profit or loss in dollars
 *
 * @example
 * // Sell 1 put at $50 strike for $200 premium, stock at $45
 * calcShortPut(45, 50, 200, 1); // returns -300
 */
export function calcShortPut(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number = 1
): number {
  validateInputs(stockPrice, strikePrice, premium, quantity);

  // Premium is per-contract, convert to per-share for helper
  const premiumPerShare = premium / CONTRACT_MULTIPLIER;
  const perSharePL = putPayoffShort(stockPrice, strikePrice, premiumPerShare);
  return toContractPayoff(perSharePL, quantity, CONTRACT_MULTIPLIER);
}

/**
 * Calculate P/L for a single option leg
 * Dispatches to the appropriate calculation based on option type and position
 *
 * @param leg - Option leg to calculate P/L for
 * @param stockPrice - Stock price at evaluation
 * @returns Profit or loss in dollars
 *
 * @throws {CalculationError} If option type or position is invalid
 *
 * @example
 * const leg = {
 *   optionType: OptionType.CALL,
 *   position: Position.LONG,
 *   strikePrice: 50,
 *   premium: 2,
 *   quantity: 1,
 *   // ... other fields
 * };
 * calcLegPL(leg, 55); // returns 300
 */
export function calcLegPL(leg: OptionLeg, stockPrice: number): number {
  const { optionType, position, strikePrice, premium, quantity } = leg;

  if (optionType === OptionType.CALL && position === Position.LONG) {
    return calcLongCall(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.CALL && position === Position.SHORT) {
    return calcShortCall(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.PUT && position === Position.LONG) {
    return calcLongPut(stockPrice, strikePrice, premium, quantity);
  }
  if (optionType === OptionType.PUT && position === Position.SHORT) {
    return calcShortPut(stockPrice, strikePrice, premium, quantity);
  }

  throw new CalculationError(
    'Invalid option type or position',
    ErrorCode.INVALID_INPUT,
    { optionType, position }
  );
}

/**
 * Calculate intrinsic value for an option
 * Intrinsic value is the value if exercised immediately
 *
 * @param optionType - Call or Put
 * @param stockPrice - Current stock price
 * @param strikePrice - Strike price of option
 * @returns Intrinsic value (always >= 0)
 *
 * @example
 * calcIntrinsicValue(OptionType.CALL, 55, 50); // returns 5
 * calcIntrinsicValue(OptionType.PUT, 45, 50); // returns 5
 * calcIntrinsicValue(OptionType.CALL, 45, 50); // returns 0
 */
export function calcIntrinsicValue(
  optionType: OptionType,
  stockPrice: number,
  strikePrice: number
): number {
  if (optionType === OptionType.CALL) {
    return Math.max(0, stockPrice - strikePrice);
  } else if (optionType === OptionType.PUT) {
    return Math.max(0, strikePrice - stockPrice);
  }
  return 0;
}

/**
 * Calculate break-even price for a single option
 *
 * For calls: Break-even = Strike + Premium
 * For puts: Break-even = Strike - Premium
 *
 * @param optionType - Call or Put
 * @param strikePrice - Strike price
 * @param premium - Premium paid (for long) or received (for short)
 * @returns Break-even stock price
 *
 * @example
 * calcSingleOptionBreakEven(OptionType.CALL, 50, 2); // returns 52
 * calcSingleOptionBreakEven(OptionType.PUT, 50, 2); // returns 48
 */
export function calcSingleOptionBreakEven(
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

/**
 * Calculate maximum profit for a single option position
 *
 * @param optionType - Call or Put
 * @param position - Long or Short
 * @param strikePrice - Strike price
 * @param premium - Premium per contract (total contract cost/credit)
 * @param quantity - Number of contracts
 * @returns Maximum profit (null if unlimited)
 *
 * @example
 * // Long call - unlimited profit potential
 * calcMaxProfit(OptionType.CALL, Position.LONG, 50, 200, 1); // returns null
 *
 * // Short call - limited to premium received
 * calcMaxProfit(OptionType.CALL, Position.SHORT, 50, 200, 1); // returns 200
 */
export function calcMaxProfit(
  optionType: OptionType,
  position: Position,
  strikePrice: number,
  premium: number,
  quantity: number
): number | null {
  // Long Call - unlimited profit potential
  if (optionType === OptionType.CALL && position === Position.LONG) {
    return null;
  }

  // Short Call - max profit is premium received
  if (optionType === OptionType.CALL && position === Position.SHORT) {
    return premium * quantity;
  }

  // Long Put - max profit when stock goes to $0
  if (optionType === OptionType.PUT && position === Position.LONG) {
    return (strikePrice * CONTRACT_MULTIPLIER - premium) * quantity;
  }

  // Short Put - max profit is premium received
  if (optionType === OptionType.PUT && position === Position.SHORT) {
    return premium * quantity;
  }

  return null;
}

/**
 * Calculate maximum loss for a single option position
 *
 * @param optionType - Call or Put
 * @param position - Long or Short
 * @param strikePrice - Strike price
 * @param premium - Premium per contract (total contract cost/credit)
 * @param quantity - Number of contracts
 * @returns Maximum loss (null if unlimited)
 *
 * @example
 * // Long call - max loss is premium paid
 * calcMaxLoss(OptionType.CALL, Position.LONG, 50, 200, 1); // returns -200
 *
 * // Short call - unlimited loss potential
 * calcMaxLoss(OptionType.CALL, Position.SHORT, 50, 200, 1); // returns null
 */
export function calcMaxLoss(
  optionType: OptionType,
  position: Position,
  strikePrice: number,
  premium: number,
  quantity: number
): number | null {
  // Long Call - max loss is premium paid
  if (optionType === OptionType.CALL && position === Position.LONG) {
    return -premium * quantity;
  }

  // Short Call - unlimited loss potential
  if (optionType === OptionType.CALL && position === Position.SHORT) {
    return null;
  }

  // Long Put - max loss is premium paid
  if (optionType === OptionType.PUT && position === Position.LONG) {
    return -premium * quantity;
  }

  // Short Put - max loss when stock goes to $0
  if (optionType === OptionType.PUT && position === Position.SHORT) {
    return -(strikePrice * CONTRACT_MULTIPLIER - premium) * quantity;
  }

  return null;
}

/**
 * Validate inputs for P/L calculations
 * @throws {CalculationError} If any input is invalid
 */
function validateInputs(
  stockPrice: number,
  strikePrice: number,
  premium: number,
  quantity: number
): void {
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

  if (premium < 0) {
    throw new CalculationError(
      'Premium cannot be negative',
      ErrorCode.INVALID_INPUT,
      { premium }
    );
  }

  if (quantity < 1 || !Number.isInteger(quantity)) {
    throw new CalculationError(
      'Quantity must be a positive integer',
      ErrorCode.INVALID_INPUT,
      { quantity }
    );
  }
}
