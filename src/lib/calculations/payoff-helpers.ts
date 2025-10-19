/**
 * Core Payoff Helper Functions
 *
 * Per-share payoff calculations for options at expiration.
 * These match the FormulaIM reference document formulas.
 *
 * All functions return per-share P/L (not per-contract).
 * Multiply by CONTRACT_MULTIPLIER (100) and quantity for contract-level calculations.
 */

/**
 * Long call payoff at expiration (per share)
 *
 * Formula: max(S - K, 0) - premium
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param prem - Premium paid per share
 * @returns Profit/loss per share
 *
 * @example
 * // Stock at $55, strike $50, paid $2 per share
 * callPayoffLong(55, 50, 2); // returns 3 (per share)
 */
export function callPayoffLong(S: number, K: number, prem: number): number {
  return Math.max(S - K, 0) - prem;
}

/**
 * Short call payoff at expiration (per share)
 *
 * Formula: premium - max(S - K, 0)
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param prem - Premium received per share
 * @returns Profit/loss per share
 *
 * @example
 * // Stock at $55, strike $50, received $2 per share
 * callPayoffShort(55, 50, 2); // returns -3 (per share)
 */
export function callPayoffShort(S: number, K: number, prem: number): number {
  return prem - Math.max(S - K, 0);
}

/**
 * Long put payoff at expiration (per share)
 *
 * Formula: max(K - S, 0) - premium
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param prem - Premium paid per share
 * @returns Profit/loss per share
 *
 * @example
 * // Stock at $45, strike $50, paid $2 per share
 * putPayoffLong(45, 50, 2); // returns 3 (per share)
 */
export function putPayoffLong(S: number, K: number, prem: number): number {
  return Math.max(K - S, 0) - prem;
}

/**
 * Short put payoff at expiration (per share)
 *
 * Formula: premium - max(K - S, 0)
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param prem - Premium received per share
 * @returns Profit/loss per share
 *
 * @example
 * // Stock at $45, strike $50, received $2 per share
 * putPayoffShort(45, 50, 2); // returns -3 (per share)
 */
export function putPayoffShort(S: number, K: number, prem: number): number {
  return prem - Math.max(K - S, 0);
}

/**
 * Stock position payoff (per share)
 *
 * Long stock: S - S0 (bought at S0)
 * Short stock: S0 - S (sold at S0)
 *
 * @param S - Current stock price
 * @param S0 - Entry stock price
 * @param isLong - True for long position, false for short
 * @returns Profit/loss per share
 *
 * @example
 * // Long stock bought at $100, now at $105
 * stockPayoff(105, 100, true); // returns 5
 *
 * // Short stock sold at $100, now at $105
 * stockPayoff(105, 100, false); // returns -5
 */
export function stockPayoff(S: number, S0: number, isLong: boolean = true): number {
  return isLong ? (S - S0) : (S0 - S);
}

/**
 * Convert per-share payoff to per-contract payoff
 *
 * @param perSharePayoff - Payoff per share
 * @param quantity - Number of contracts
 * @param contractMultiplier - Shares per contract (default 100)
 * @returns Total payoff for position
 *
 * @example
 * // 2 contracts with $3 per-share profit
 * toContractPayoff(3, 2, 100); // returns 600
 */
export function toContractPayoff(
  perSharePayoff: number,
  quantity: number,
  contractMultiplier: number = 100
): number {
  return perSharePayoff * quantity * contractMultiplier;
}

/**
 * Standard normal cumulative distribution function
 * Used in Black-Scholes calculations
 *
 * @param x - Input value
 * @returns Probability that a standard normal random variable is less than x
 */
export function phi(x: number): number {
  return 0.5 * (1.0 + erf(x / Math.sqrt(2.0)));
}

/**
 * Error function approximation
 * Used by phi (standard normal CDF)
 *
 * @param x - Input value
 * @returns Error function of x
 */
function erf(x: number): number {
  // Save the sign of x
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
