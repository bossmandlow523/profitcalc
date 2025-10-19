/**
 * Strategy Pattern Detection
 *
 * Analyzes option leg configurations to identify which strategy is being used.
 * This allows for optimized calculations using strategy-specific formulas.
 */

import { OptionType, Position, OptionLeg } from '../types';

/**
 * Supported strategy types
 */
export enum StrategyType {
  // Basic strategies
  LONG_CALL = 'LONG_CALL',
  LONG_PUT = 'LONG_PUT',
  COVERED_CALL = 'COVERED_CALL',
  CASH_SECURED_PUT = 'CASH_SECURED_PUT',
  NAKED_CALL = 'NAKED_CALL',
  NAKED_PUT = 'NAKED_PUT',

  // Credit spreads
  BULL_PUT_SPREAD = 'BULL_PUT_SPREAD',
  BEAR_CALL_SPREAD = 'BEAR_CALL_SPREAD',

  // Debit spreads
  BULL_CALL_SPREAD = 'BULL_CALL_SPREAD',
  BEAR_PUT_SPREAD = 'BEAR_PUT_SPREAD',

  // Time-based spreads
  PMCC = 'PMCC',
  CALENDAR_CALL = 'CALENDAR_CALL',
  CALENDAR_PUT = 'CALENDAR_PUT',
  DIAGONAL_CALL = 'DIAGONAL_CALL',
  DIAGONAL_PUT = 'DIAGONAL_PUT',
  DOUBLE_DIAGONAL = 'DOUBLE_DIAGONAL',

  // Ratio spreads
  CALL_RATIO_BACKSPREAD = 'CALL_RATIO_BACKSPREAD',
  PUT_RATIO_BACKSPREAD = 'PUT_RATIO_BACKSPREAD',

  // Complex strategies
  IRON_CONDOR = 'IRON_CONDOR',
  BUTTERFLY = 'BUTTERFLY',
  COLLAR = 'COLLAR',
  LONG_STRADDLE = 'LONG_STRADDLE',
  SHORT_STRADDLE = 'SHORT_STRADDLE',
  LONG_STRANGLE = 'LONG_STRANGLE',
  SHORT_STRANGLE = 'SHORT_STRANGLE',
  COVERED_STRANGLE = 'COVERED_STRANGLE',
  SYNTHETIC_LONG_PUT = 'SYNTHETIC_LONG_PUT',
  REVERSE_CONVERSION = 'REVERSE_CONVERSION',

  // Generic/custom
  CUSTOM = 'CUSTOM',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Strategy detection result
 */
export interface StrategyDetectionResult {
  type: StrategyType;
  confidence: number; // 0-1, how confident we are in the detection
  requiresStock: boolean; // Does this strategy need a stock position?
  requiresTimeBasedCalc: boolean; // Does this need Black-Scholes for valuation?
}

/**
 * Detect strategy type from leg configuration
 *
 * @param legs - Array of option legs
 * @param hasStock - Whether there's a stock position involved
 * @returns Strategy detection result
 */
export function detectStrategy(
  legs: OptionLeg[],
  hasStock: boolean = false
): StrategyDetectionResult {
  if (legs.length === 0) {
    return {
      type: StrategyType.UNKNOWN,
      confidence: 1,
      requiresStock: false,
      requiresTimeBasedCalc: false,
    };
  }

  // Single leg strategies
  if (legs.length === 1) {
    const leg = legs[0];
    if (!leg) {
      return {
        type: StrategyType.UNKNOWN,
        confidence: 0,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    }
    return detectSingleLegStrategy(leg, hasStock);
  }

  // Two leg strategies
  if (legs.length === 2) {
    return detectTwoLegStrategy(legs, hasStock);
  }

  // Three leg strategies
  if (legs.length === 3) {
    return detectThreeLegStrategy(legs);
  }

  // Four leg strategies
  if (legs.length === 4) {
    return detectFourLegStrategy(legs);
  }

  // Custom/complex strategies
  return {
    type: StrategyType.CUSTOM,
    confidence: 1,
    requiresStock: hasStock,
    requiresTimeBasedCalc: false,
  };
}

/**
 * Detect single-leg strategies
 */
function detectSingleLegStrategy(
  leg: OptionLeg,
  hasStock: boolean
): StrategyDetectionResult {
  if (leg.optionType === OptionType.CALL) {
    if (leg.position === Position.LONG) {
      return {
        type: StrategyType.LONG_CALL,
        confidence: 1,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    } else {
      // Short call
      if (hasStock) {
        return {
          type: StrategyType.COVERED_CALL,
          confidence: 1,
          requiresStock: true,
          requiresTimeBasedCalc: false,
        };
      } else {
        return {
          type: StrategyType.NAKED_CALL,
          confidence: 0.9, // Could be covered call without stock info
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      }
    }
  } else {
    // Put option
    if (leg.position === Position.LONG) {
      return {
        type: StrategyType.LONG_PUT,
        confidence: 1,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    } else {
      // Short put - could be cash-secured or naked
      return {
        type: StrategyType.CASH_SECURED_PUT,
        confidence: 0.9,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    }
  }
}

/**
 * Detect two-leg strategies
 */
function detectTwoLegStrategy(
  legs: OptionLeg[],
  hasStock: boolean
): StrategyDetectionResult {
  const leg1 = legs[0];
  const leg2 = legs[1];

  if (!leg1 || !leg2) {
    return {
      type: StrategyType.UNKNOWN,
      confidence: 0,
      requiresStock: false,
      requiresTimeBasedCalc: false,
    };
  }

  // Check for straddle/strangle
  if (
    leg1.optionType !== leg2.optionType &&
    leg1.position === leg2.position
  ) {
    const call = legs.find((l) => l.optionType === OptionType.CALL);
    const put = legs.find((l) => l.optionType === OptionType.PUT);

    if (call && put) {
      const isATM = Math.abs(call.strikePrice - put.strikePrice) < 0.01;

      if (leg1.position === Position.LONG) {
        return {
          type: isATM ? StrategyType.LONG_STRADDLE : StrategyType.LONG_STRANGLE,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      } else {
        if (hasStock) {
          return {
            type: StrategyType.COVERED_STRANGLE,
            confidence: 1,
            requiresStock: true,
            requiresTimeBasedCalc: false,
          };
        } else {
          return {
            type: isATM ? StrategyType.SHORT_STRADDLE : StrategyType.SHORT_STRANGLE,
            confidence: 1,
            requiresStock: false,
            requiresTimeBasedCalc: false,
          };
        }
      }
    }
  }

  // Check for collar (need stock + put + call)
  if (hasStock) {
    const longPut = legs.find(
      (l) => l.optionType === OptionType.PUT && l.position === Position.LONG
    );
    const shortCall = legs.find(
      (l) => l.optionType === OptionType.CALL && l.position === Position.SHORT
    );

    if (longPut && shortCall) {
      return {
        type: StrategyType.COLLAR,
        confidence: 1,
        requiresStock: true,
        requiresTimeBasedCalc: false,
      };
    }
  }

  // Check for vertical spreads (same type, opposite positions)
  if (
    leg1.optionType === leg2.optionType &&
    leg1.position !== leg2.position
  ) {
    const longLeg = legs.find((l) => l.position === Position.LONG);
    const shortLeg = legs.find((l) => l.position === Position.SHORT);

    if (!longLeg || !shortLeg) {
      return {
        type: StrategyType.UNKNOWN,
        confidence: 0,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    }

    // Check if they have different expiration dates
    const hasDifferentExpiry =
      leg1.expiryDate.getTime() !== leg2.expiryDate.getTime();
    const hasDifferentStrikes = leg1.strikePrice !== leg2.strikePrice;

    if (hasDifferentExpiry) {
      // Calendar or diagonal spread
      if (leg1.optionType === OptionType.CALL) {
        if (hasDifferentStrikes) {
          // Check if it's a PMCC (long is deep ITM, short is OTM)
          const longItm = longLeg.strikePrice < leg1.strikePrice;
          const shortOtm = shortLeg.strikePrice > leg1.strikePrice;

          if (longItm && shortOtm) {
            return {
              type: StrategyType.PMCC,
              confidence: 0.8,
              requiresStock: false,
              requiresTimeBasedCalc: true,
            };
          }

          return {
            type: StrategyType.DIAGONAL_CALL,
            confidence: 1,
            requiresStock: false,
            requiresTimeBasedCalc: true,
          };
        } else {
          return {
            type: StrategyType.CALENDAR_CALL,
            confidence: 1,
            requiresStock: false,
            requiresTimeBasedCalc: true,
          };
        }
      } else {
        return {
          type: hasDifferentStrikes
            ? StrategyType.DIAGONAL_PUT
            : StrategyType.CALENDAR_PUT,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: true,
        };
      }
    }

    // Regular vertical spreads
    if (leg1.optionType === OptionType.CALL) {
      if (longLeg.strikePrice < shortLeg.strikePrice) {
        return {
          type: StrategyType.BULL_CALL_SPREAD,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      } else {
        return {
          type: StrategyType.BEAR_CALL_SPREAD,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      }
    } else {
      if (longLeg.strikePrice > shortLeg.strikePrice) {
        return {
          type: StrategyType.BEAR_PUT_SPREAD,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      } else {
        return {
          type: StrategyType.BULL_PUT_SPREAD,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      }
    }
  }

  // Check for ratio spreads (unequal quantities)
  if (
    leg1.optionType === leg2.optionType &&
    leg1.position !== leg2.position &&
    leg1.quantity !== leg2.quantity
  ) {
    const longLeg = legs.find((l) => l.position === Position.LONG);
    const shortLeg = legs.find((l) => l.position === Position.SHORT);

    if (longLeg && shortLeg && longLeg.quantity > shortLeg.quantity) {
      return {
        type:
          leg1.optionType === OptionType.CALL
            ? StrategyType.CALL_RATIO_BACKSPREAD
            : StrategyType.PUT_RATIO_BACKSPREAD,
        confidence: 0.9,
        requiresStock: false,
        requiresTimeBasedCalc: false,
      };
    }
  }

  return {
    type: StrategyType.CUSTOM,
    confidence: 0.7,
    requiresStock: hasStock,
    requiresTimeBasedCalc: false,
  };
}

/**
 * Detect three-leg strategies
 */
function detectThreeLegStrategy(legs: OptionLeg[]): StrategyDetectionResult {
  // Check for butterfly (1 long, 2 short, 1 long at different strikes)
  const firstLeg = legs[0];
  if (!firstLeg) {
    return {
      type: StrategyType.UNKNOWN,
      confidence: 0,
      requiresStock: false,
      requiresTimeBasedCalc: false,
    };
  }

  const allSameType = legs.every((l) => l.optionType === firstLeg.optionType);
  const allSameExpiry = legs.every(
    (l) => l.expiryDate.getTime() === firstLeg.expiryDate.getTime()
  );

  if (allSameType && allSameExpiry) {
    const longLegs = legs.filter((l) => l.position === Position.LONG);
    const shortLegs = legs.filter((l) => l.position === Position.SHORT);
    const firstShortLeg = shortLegs[0];

    // Classic butterfly: 1 long + 2 short + 1 long
    if (longLegs.length === 2 && shortLegs.length === 1 && firstShortLeg && firstShortLeg.quantity === 2) {
      const strikes = legs.map((l) => l.strikePrice).sort((a, b) => a - b);
      const strike0 = strikes[0];
      const strike1 = strikes[1];
      const strike2 = strikes[2];

      if (strike0 !== undefined && strike1 !== undefined && strike2 !== undefined) {
        const isEqualSpacing =
          Math.abs(strike1 - strike0 - (strike2 - strike1)) < 0.01;

        if (isEqualSpacing) {
          return {
            type: StrategyType.BUTTERFLY,
            confidence: 1,
            requiresStock: false,
            requiresTimeBasedCalc: false,
          };
        }
      }
    }
  }

  // Could be reverse conversion with stock
  const hasCall = legs.some((l) => l.optionType === OptionType.CALL);
  const hasPut = legs.some((l) => l.optionType === OptionType.PUT);

  if (hasCall && hasPut) {
    return {
      type: StrategyType.REVERSE_CONVERSION,
      confidence: 0.6,
      requiresStock: true,
      requiresTimeBasedCalc: false,
    };
  }

  return {
    type: StrategyType.CUSTOM,
    confidence: 0.7,
    requiresStock: false,
    requiresTimeBasedCalc: false,
  };
}

/**
 * Detect four-leg strategies
 */
function detectFourLegStrategy(legs: OptionLeg[]): StrategyDetectionResult {
  const callLegs = legs.filter((l) => l.optionType === OptionType.CALL);
  const putLegs = legs.filter((l) => l.optionType === OptionType.PUT);

  // Iron condor: 2 calls + 2 puts
  if (callLegs.length === 2 && putLegs.length === 2) {
    const longCall = callLegs.find((l) => l.position === Position.LONG);
    const shortCall = callLegs.find((l) => l.position === Position.SHORT);
    const longPut = putLegs.find((l) => l.position === Position.LONG);
    const shortPut = putLegs.find((l) => l.position === Position.SHORT);

    if (longCall && shortCall && longPut && shortPut) {
      // Check for same expiry
      const firstLeg = legs[0];
      if (!firstLeg) {
        return {
          type: StrategyType.UNKNOWN,
          confidence: 0,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      }

      const allSameExpiry = legs.every(
        (l) => l.expiryDate.getTime() === firstLeg.expiryDate.getTime()
      );

      if (allSameExpiry) {
        return {
          type: StrategyType.IRON_CONDOR,
          confidence: 1,
          requiresStock: false,
          requiresTimeBasedCalc: false,
        };
      } else {
        // Different expiry dates - double diagonal
        return {
          type: StrategyType.DOUBLE_DIAGONAL,
          confidence: 0.9,
          requiresStock: false,
          requiresTimeBasedCalc: true,
        };
      }
    }
  }

  return {
    type: StrategyType.CUSTOM,
    confidence: 0.7,
    requiresStock: false,
    requiresTimeBasedCalc: false,
  };
}

/**
 * Check if strategy matches a specific type
 *
 * @param legs - Array of option legs
 * @param expectedType - Expected strategy type
 * @returns True if strategy matches expected type
 */
export function isStrategyType(
  legs: OptionLeg[],
  expectedType: StrategyType
): boolean {
  const detection = detectStrategy(legs);
  return detection.type === expectedType && detection.confidence >= 0.8;
}

/**
 * Get human-readable strategy name
 *
 * @param type - Strategy type enum
 * @returns Human-readable name
 */
export function getStrategyName(type: StrategyType): string {
  const names: Record<StrategyType, string> = {
    [StrategyType.LONG_CALL]: 'Long Call',
    [StrategyType.LONG_PUT]: 'Long Put',
    [StrategyType.COVERED_CALL]: 'Covered Call',
    [StrategyType.CASH_SECURED_PUT]: 'Cash-Secured Put',
    [StrategyType.NAKED_CALL]: 'Naked Call',
    [StrategyType.NAKED_PUT]: 'Naked Put',
    [StrategyType.BULL_PUT_SPREAD]: 'Bull Put Spread',
    [StrategyType.BEAR_CALL_SPREAD]: 'Bear Call Spread',
    [StrategyType.BULL_CALL_SPREAD]: 'Bull Call Spread',
    [StrategyType.BEAR_PUT_SPREAD]: 'Bear Put Spread',
    [StrategyType.PMCC]: "Poor Man's Covered Call",
    [StrategyType.CALENDAR_CALL]: 'Calendar Call Spread',
    [StrategyType.CALENDAR_PUT]: 'Calendar Put Spread',
    [StrategyType.DIAGONAL_CALL]: 'Diagonal Call Spread',
    [StrategyType.DIAGONAL_PUT]: 'Diagonal Put Spread',
    [StrategyType.DOUBLE_DIAGONAL]: 'Double Diagonal',
    [StrategyType.CALL_RATIO_BACKSPREAD]: 'Call Ratio Backspread',
    [StrategyType.PUT_RATIO_BACKSPREAD]: 'Put Ratio Backspread',
    [StrategyType.IRON_CONDOR]: 'Iron Condor',
    [StrategyType.BUTTERFLY]: 'Butterfly',
    [StrategyType.COLLAR]: 'Collar',
    [StrategyType.LONG_STRADDLE]: 'Long Straddle',
    [StrategyType.SHORT_STRADDLE]: 'Short Straddle',
    [StrategyType.LONG_STRANGLE]: 'Long Strangle',
    [StrategyType.SHORT_STRANGLE]: 'Short Strangle',
    [StrategyType.COVERED_STRANGLE]: 'Covered Strangle',
    [StrategyType.SYNTHETIC_LONG_PUT]: 'Synthetic Long Put',
    [StrategyType.REVERSE_CONVERSION]: 'Reverse Conversion',
    [StrategyType.CUSTOM]: 'Custom Strategy',
    [StrategyType.UNKNOWN]: 'Unknown Strategy',
  };

  return names[type] || 'Unknown Strategy';
}
