/**
 * Strategy-Specific Formula Implementations
 *
 * Optimized P/L calculations for each of the 23 supported options strategies.
 * Based on FormulaIM reference formulas.
 *
 * All functions return per-share P/L unless otherwise noted.
 * For contract-level calculations, multiply by CONTRACT_MULTIPLIER (100) and quantity.
 */

import {
  callPayoffLong,
  callPayoffShort,
  putPayoffLong,
  putPayoffShort,
  stockPayoff,
} from './payoff-helpers';

// Import Black-Scholes functions for time-based strategies
import { blackScholesCall, blackScholesPut } from './black-scholes';

// ============================================================================
// BASIC STRATEGIES (1-6)
// ============================================================================

/**
 * 1) Long Call
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param premium - Premium paid per share
 * @returns P/L per share
 */
export function longCallPnl(S: number, K: number, premium: number): number {
  return callPayoffLong(S, K, premium);
}

/**
 * 2) Long Put
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param premium - Premium paid per share
 * @returns P/L per share
 */
export function longPutPnl(S: number, K: number, premium: number): number {
  return putPayoffLong(S, K, premium);
}

/**
 * 3) Covered Call (long stock + short call)
 *
 * @param S - Current stock price
 * @param S0 - Stock purchase price
 * @param Kc - Call strike price
 * @param premC - Call premium received per share
 * @returns P/L per share
 */
export function coveredCallPnl(
  S: number,
  S0: number,
  Kc: number,
  premC: number
): number {
  const stock = stockPayoff(S, S0, true);
  const shortCall = callPayoffShort(S, Kc, premC);
  return stock + shortCall;
}

/**
 * 4) Cash-Secured Put (short put)
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param premium - Premium received per share
 * @returns P/L per share
 */
export function cashSecuredPutPnl(S: number, K: number, premium: number): number {
  return putPayoffShort(S, K, premium);
}

/**
 * 5) Naked (Short) Call
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param premium - Premium received per share
 * @returns P/L per share
 */
export function nakedCallPnl(S: number, K: number, premium: number): number {
  return callPayoffShort(S, K, premium);
}

/**
 * 6) Naked (Short) Put
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price
 * @param premium - Premium received per share
 * @returns P/L per share
 */
export function nakedPutPnl(S: number, K: number, premium: number): number {
  return putPayoffShort(S, K, premium);
}

// ============================================================================
// CREDIT SPREADS (7a, 7b)
// ============================================================================

/**
 * 7a) Bull Put Credit Spread (short put Kh, long put Kl < Kh)
 *
 * @param S - Stock price at evaluation
 * @param Kh - Higher strike (short put)
 * @param Kl - Lower strike (long put)
 * @param premShort - Premium received for short put per share
 * @param premLong - Premium paid for long put per share
 * @returns P/L per share
 */
export function bullPutSpreadPnl(
  S: number,
  Kh: number,
  Kl: number,
  premShort: number,
  premLong: number
): number {
  const shortPut = putPayoffShort(S, Kh, premShort);
  const longPut = putPayoffLong(S, Kl, premLong);
  return shortPut + longPut;
}

/**
 * 7b) Bear Call Credit Spread (short call Kl, long call Kh > Kl)
 *
 * @param S - Stock price at evaluation
 * @param Kl - Lower strike (short call)
 * @param Kh - Higher strike (long call)
 * @param premShort - Premium received for short call per share
 * @param premLong - Premium paid for long call per share
 * @returns P/L per share
 */
export function bearCallSpreadPnl(
  S: number,
  Kl: number,
  Kh: number,
  premShort: number,
  premLong: number
): number {
  const shortCall = callPayoffShort(S, Kl, premShort);
  const longCall = callPayoffLong(S, Kh, premLong);
  return shortCall + longCall;
}

// ============================================================================
// DEBIT SPREADS (8, 9)
// ============================================================================

/**
 * 8) Bull Call (Debit) Spread (long Kl, short Kh)
 *
 * @param S - Stock price at evaluation
 * @param Kl - Lower strike (long call)
 * @param Kh - Higher strike (short call)
 * @param premLong - Premium paid for long call per share
 * @param premShort - Premium received for short call per share
 * @returns P/L per share
 */
export function bullCallSpreadPnl(
  S: number,
  Kl: number,
  Kh: number,
  premLong: number,
  premShort: number
): number {
  const longCall = callPayoffLong(S, Kl, premLong);
  const shortCall = callPayoffShort(S, Kh, premShort);
  return longCall + shortCall;
}

/**
 * 9) Bear Put (Debit) Spread (long Kh, short Kl)
 *
 * @param S - Stock price at evaluation
 * @param Kh - Higher strike (long put)
 * @param Kl - Lower strike (short put)
 * @param premLong - Premium paid for long put per share
 * @param premShort - Premium received for short put per share
 * @returns P/L per share
 */
export function bearPutSpreadPnl(
  S: number,
  Kh: number,
  Kl: number,
  premLong: number,
  premShort: number
): number {
  const longPut = putPayoffLong(S, Kh, premLong);
  const shortPut = putPayoffShort(S, Kl, premShort);
  return longPut + shortPut;
}

// ============================================================================
// TIME-BASED SPREADS (10, 11, 16, 17) - REQUIRE BLACK-SCHOLES
// ============================================================================

/**
 * 10) Poor Man's Covered Call (PMCC)
 * At near-term expiry t1, short call expires; long call still has T_rem left.
 *
 * @param S - Stock price at short call expiry
 * @param KLong - Long call strike (deep ITM LEAPS)
 * @param premLong - Premium paid for long call per share
 * @param KShort - Short call strike (near-term OTM)
 * @param premShort - Premium received for short call per share
 * @param r - Risk-free rate (decimal)
 * @param sigma - Volatility (decimal)
 * @param TRemaining - Time remaining on long call (years)
 * @returns P/L per share at short call expiry
 */
export function pmccPnlAtShortExpiry(
  S: number,
  KLong: number,
  premLong: number,
  KShort: number,
  premShort: number,
  r: number,
  sigma: number,
  TRemaining: number
): number {
  const debit = premLong - premShort;
  const shortLeg = callPayoffShort(S, KShort, premShort);
  const longLegValue = blackScholesCall(S, KLong, TRemaining, r, sigma);
  return -debit + shortLeg + longLegValue;
}

/**
 * 11a) Calendar Call Spread
 * At near expiry t1, short dies; you hold the longer option.
 *
 * @param S - Stock price at near expiry
 * @param K - Strike price (same for both)
 * @param premLong - Premium paid for long call per share
 * @param premShort - Premium received for short call per share
 * @param r - Risk-free rate (decimal)
 * @param sigma - Volatility (decimal)
 * @param TRemaining - Time remaining on long call (years)
 * @returns P/L per share at near expiry
 */
export function calendarCallPnlAtNearExpiry(
  S: number,
  K: number,
  premLong: number,
  premShort: number,
  r: number,
  sigma: number,
  TRemaining: number
): number {
  const netDebit = premLong - premShort;
  const remaining = blackScholesCall(S, K, TRemaining, r, sigma);
  return -netDebit + remaining;
}

/**
 * 11b) Calendar Put Spread
 *
 * @param S - Stock price at near expiry
 * @param K - Strike price (same for both)
 * @param premLong - Premium paid for long put per share
 * @param premShort - Premium received for short put per share
 * @param r - Risk-free rate (decimal)
 * @param sigma - Volatility (decimal)
 * @param TRemaining - Time remaining on long put (years)
 * @returns P/L per share at near expiry
 */
export function calendarPutPnlAtNearExpiry(
  S: number,
  K: number,
  premLong: number,
  premShort: number,
  r: number,
  sigma: number,
  TRemaining: number
): number {
  const netDebit = premLong - premShort;
  const remaining = blackScholesPut(S, K, TRemaining, r, sigma);
  return -netDebit + remaining;
}

/**
 * 16a) Diagonal Call Spread (different strikes)
 * At near expiry t1: settle short; value long by BS with T_rem.
 *
 * @param S - Stock price at near expiry
 * @param KLong - Long call strike
 * @param premLong - Premium paid for long call per share
 * @param KShort - Short call strike
 * @param premShort - Premium received for short call per share
 * @param r - Risk-free rate (decimal)
 * @param sigma - Volatility (decimal)
 * @param TRemaining - Time remaining on long call (years)
 * @returns P/L per share at near expiry
 */
export function diagonalCallPnlAtNearExpiry(
  S: number,
  KLong: number,
  premLong: number,
  KShort: number,
  premShort: number,
  r: number,
  sigma: number,
  TRemaining: number
): number {
  const shortLeg = callPayoffShort(S, KShort, premShort);
  const remaining = blackScholesCall(S, KLong, TRemaining, r, sigma);
  const debit = premLong - premShort;
  return -debit + shortLeg + remaining;
}

/**
 * 16b) Diagonal Put Spread
 *
 * @param S - Stock price at near expiry
 * @param KLong - Long put strike
 * @param premLong - Premium paid for long put per share
 * @param KShort - Short put strike
 * @param premShort - Premium received for short put per share
 * @param r - Risk-free rate (decimal)
 * @param sigma - Volatility (decimal)
 * @param TRemaining - Time remaining on long put (years)
 * @returns P/L per share at near expiry
 */
export function diagonalPutPnlAtNearExpiry(
  S: number,
  KLong: number,
  premLong: number,
  KShort: number,
  premShort: number,
  r: number,
  sigma: number,
  TRemaining: number
): number {
  const shortLeg = putPayoffShort(S, KShort, premShort);
  const remaining = blackScholesPut(S, KLong, TRemaining, r, sigma);
  const debit = premLong - premShort;
  return -debit + shortLeg + remaining;
}

/**
 * 17) Double Diagonal (sell near strangle; buy farther strangle)
 * At near expiry t1: shorts die; longs remain (valued by BS).
 *
 * @param S - Stock price at near expiry
 * @param KpLong - Long put strike
 * @param KpShort - Short put strike
 * @param KcShort - Short call strike
 * @param KcLong - Long call strike
 * @param premPLong - Premium paid for long put per share
 * @param premPShort - Premium received for short put per share
 * @param premCShort - Premium received for short call per share
 * @param premCLong - Premium paid for long call per share
 * @param r - Risk-free rate (decimal)
 * @param sigmaPut - Volatility for put (decimal)
 * @param sigmaCall - Volatility for call (decimal)
 * @param TRemaining - Time remaining on long options (years)
 * @returns P/L per share at near expiry
 */
export function doubleDiagonalPnlAtNearExpiry(
  S: number,
  KpLong: number,
  KpShort: number,
  KcShort: number,
  KcLong: number,
  premPLong: number,
  premPShort: number,
  premCShort: number,
  premCLong: number,
  r: number,
  sigmaPut: number,
  sigmaCall: number,
  TRemaining: number
): number {
  const shortPut = putPayoffShort(S, KpShort, premPShort);
  const shortCall = callPayoffShort(S, KcShort, premCShort);
  const longPutVal = blackScholesPut(S, KpLong, TRemaining, r, sigmaPut);
  const longCallVal = blackScholesCall(S, KcLong, TRemaining, r, sigmaCall);
  const netDebit = premPLong + premCLong - (premPShort + premCShort);
  return -netDebit + shortPut + shortCall + longPutVal + longCallVal;
}

// ============================================================================
// RATIO SPREADS (12a, 12b)
// ============================================================================

/**
 * 12a) Call Ratio Backspread (sell 1 @ Ks, buy n≥2 @ Kl > Ks)
 *
 * @param S - Stock price at evaluation
 * @param KShort - Short call strike
 * @param premShort - Premium received for short call per share
 * @param KLong - Long call strike
 * @param premLong - Premium paid per long call per share
 * @param nLong - Number of long calls per short call (default 2)
 * @returns P/L per share
 */
export function callRatioBackspreadPnl(
  S: number,
  KShort: number,
  premShort: number,
  KLong: number,
  premLong: number,
  nLong: number = 2
): number {
  const shortCall = callPayoffShort(S, KShort, premShort);
  const longCalls = nLong * callPayoffLong(S, KLong, premLong);
  return shortCall + longCalls;
}

/**
 * 12b) Put Ratio Backspread (sell 1 @ Ks, buy n≥2 @ Kl < Ks)
 *
 * @param S - Stock price at evaluation
 * @param KShort - Short put strike
 * @param premShort - Premium received for short put per share
 * @param KLong - Long put strike
 * @param premLong - Premium paid per long put per share
 * @param nLong - Number of long puts per short put (default 2)
 * @returns P/L per share
 */
export function putRatioBackspreadPnl(
  S: number,
  KShort: number,
  premShort: number,
  KLong: number,
  premLong: number,
  nLong: number = 2
): number {
  const shortPut = putPayoffShort(S, KShort, premShort);
  const longPuts = nLong * putPayoffLong(S, KLong, premLong);
  return shortPut + longPuts;
}

// ============================================================================
// COMPLEX STRATEGIES (13-15, 18-22)
// ============================================================================

/**
 * 13) Iron Condor (short put Kps, long put Kpl, short call Kcs, long call Kcl)
 *
 * @param S - Stock price at evaluation
 * @param KpLong - Long put strike (lowest)
 * @param KpShort - Short put strike
 * @param KcShort - Short call strike
 * @param KcLong - Long call strike (highest)
 * @param premPLong - Premium paid for long put per share
 * @param premPShort - Premium received for short put per share
 * @param premCShort - Premium received for short call per share
 * @param premCLong - Premium paid for long call per share
 * @returns P/L per share
 */
export function ironCondorPnl(
  S: number,
  KpLong: number,
  KpShort: number,
  KcShort: number,
  KcLong: number,
  premPLong: number,
  premPShort: number,
  premCShort: number,
  premCLong: number
): number {
  const longPut = putPayoffLong(S, KpLong, premPLong);
  const shortPut = putPayoffShort(S, KpShort, premPShort);
  const shortCall = callPayoffShort(S, KcShort, premCShort);
  const longCall = callPayoffLong(S, KcLong, premCLong);
  return longPut + shortPut + shortCall + longCall;
}

/**
 * 14) Long Call Butterfly (buy K1, sell 2×K2, buy K3, K1 < K2 < K3)
 *
 * @param S - Stock price at evaluation
 * @param K1 - Lower strike (long call)
 * @param K2 - Middle strike (2 short calls)
 * @param K3 - Higher strike (long call)
 * @param prem1 - Premium for K1 call per share
 * @param prem2 - Premium for K2 call per share
 * @param prem3 - Premium for K3 call per share
 * @returns P/L per share
 */
export function longCallButterflyPnl(
  S: number,
  K1: number,
  K2: number,
  K3: number,
  prem1: number,
  prem2: number,
  prem3: number
): number {
  const long1 = callPayoffLong(S, K1, prem1);
  const short2x = 2.0 * callPayoffShort(S, K2, prem2); // selling two calls at K2
  const long3 = callPayoffLong(S, K3, prem3);
  return long1 + short2x + long3;
}

/**
 * 15) Collar (long stock @ S0 + long put Kp + short call Kc)
 *
 * @param S - Current stock price
 * @param S0 - Stock purchase price
 * @param Kp - Put strike price
 * @param premPut - Premium paid for put per share
 * @param Kc - Call strike price
 * @param premCall - Premium received for call per share
 * @returns P/L per share
 */
export function collarPnl(
  S: number,
  S0: number,
  Kp: number,
  premPut: number,
  Kc: number,
  premCall: number
): number {
  const stock = stockPayoff(S, S0, true);
  const putLeg = putPayoffLong(S, Kp, premPut);
  const callLeg = callPayoffShort(S, Kc, premCall);
  return stock + putLeg + callLeg;
}

/**
 * 18) Long Straddle (long call K + long put K)
 *
 * @param S - Stock price at evaluation
 * @param K - Strike price (same for call and put)
 * @param premCall - Premium paid for call per share
 * @param premPut - Premium paid for put per share
 * @returns P/L per share
 */
export function longStraddlePnl(
  S: number,
  K: number,
  premCall: number,
  premPut: number
): number {
  return callPayoffLong(S, K, premCall) + putPayoffLong(S, K, premPut);
}

/**
 * 19) Long Strangle (long call Kc + long put Kp, with Kp < Kc)
 *
 * @param S - Stock price at evaluation
 * @param Kc - Call strike price
 * @param premC - Premium paid for call per share
 * @param Kp - Put strike price
 * @param premP - Premium paid for put per share
 * @returns P/L per share
 */
export function longStranglePnl(
  S: number,
  Kc: number,
  premC: number,
  Kp: number,
  premP: number
): number {
  return callPayoffLong(S, Kc, premC) + putPayoffLong(S, Kp, premP);
}

/**
 * 20) Covered Strangle (long stock @ S0 + short OTM call Kc + short OTM put Kp)
 *
 * @param S - Current stock price
 * @param S0 - Stock purchase price
 * @param Kc - Call strike price
 * @param premC - Premium received for call per share
 * @param Kp - Put strike price
 * @param premP - Premium received for put per share
 * @returns P/L per share
 */
export function coveredStranglePnl(
  S: number,
  S0: number,
  Kc: number,
  premC: number,
  Kp: number,
  premP: number
): number {
  const stock = stockPayoff(S, S0, true);
  const shortCall = callPayoffShort(S, Kc, premC);
  const shortPut = putPayoffShort(S, Kp, premP);
  return stock + shortCall + shortPut;
}

/**
 * 21) Synthetic Long Put (short stock @ S0 + long call K)
 *
 * @param S - Current stock price
 * @param S0Short - Stock short sale price
 * @param K - Call strike price
 * @param premCall - Premium paid for call per share
 * @returns P/L per share
 */
export function syntheticLongPutPnl(
  S: number,
  S0Short: number,
  K: number,
  premCall: number
): number {
  const shortStock = stockPayoff(S, S0Short, false);
  const longCall = callPayoffLong(S, K, premCall);
  return shortStock + longCall;
}

/**
 * 22) Reverse Conversion / Reversal (short stock + long call K + short put K)
 *
 * @param S - Current stock price
 * @param S0Short - Stock short sale price
 * @param K - Strike price (same for call and put)
 * @param premCall - Premium paid for call per share
 * @param premPut - Premium received for put per share
 * @returns P/L per share at expiry
 */
export function reverseConversionPnlAtExpiry(
  S: number,
  S0Short: number,
  K: number,
  premCall: number,
  premPut: number
): number {
  const shortStock = stockPayoff(S, S0Short, false);
  const longCall = callPayoffLong(S, K, premCall);
  const shortPut = putPayoffShort(S, K, premPut);
  return shortStock + longCall + shortPut;
}

// ============================================================================
// GENERIC N-LEG ENGINE (23)
// ============================================================================

/**
 * Generic leg type for multi-leg engine
 */
export interface GenericLeg {
  kind: 'call' | 'put' | 'stock';
  side: 'long' | 'short';
  KOrS0: number; // Strike for options, entry price for stock
  premium: number; // Premium per share (0 for stock)
  qty: number; // Quantity
}

/**
 * 23) Generic N-leg engine (sum of any legs)
 * Pass tuples for each leg.
 *
 * @param S - Stock price at evaluation
 * @param legs - Array of leg definitions
 * @returns Total P/L per share
 *
 * @example
 * const legs = [
 *   { kind: 'call', side: 'long', KOrS0: 50, premium: 3, qty: 1 },
 *   { kind: 'call', side: 'short', KOrS0: 55, premium: 1, qty: 1 }
 * ];
 * multiLegPnl(60, legs); // Bull call spread
 */
export function multiLegPnl(S: number, legs: GenericLeg[]): number {
  let total = 0.0;

  for (const leg of legs) {
    let legPayoff = 0;

    if (leg.kind === 'call') {
      legPayoff = leg.side === 'long'
        ? callPayoffLong(S, leg.KOrS0, leg.premium)
        : callPayoffShort(S, leg.KOrS0, leg.premium);
    } else if (leg.kind === 'put') {
      legPayoff = leg.side === 'long'
        ? putPayoffLong(S, leg.KOrS0, leg.premium)
        : putPayoffShort(S, leg.KOrS0, leg.premium);
    } else if (leg.kind === 'stock') {
      // Premium ignored; KOrS0 is entry price
      legPayoff = stockPayoff(S, leg.KOrS0, leg.side === 'long');
    } else {
      throw new Error(`Unknown leg kind: ${leg.kind}`);
    }

    total += leg.qty * legPayoff;
  }

  return total;
}
