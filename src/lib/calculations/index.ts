/**
 * Calculations Module - Public API
 * Exports all calculation functions for options pricing and analysis
 */

// Basic P/L calculations
export {
  calcLongCall,
  calcLongPut,
  calcShortCall,
  calcShortPut,
  calcLegPL,
  calcIntrinsicValue,
  calcSingleOptionBreakEven,
  calcMaxProfit,
  calcMaxLoss,
} from './basic-pl';

// Black-Scholes pricing
export {
  blackScholes,
  blackScholesCall,
  blackScholesPut,
  calcTimeValue,
  verifyPutCallParity,
} from './black-scholes';

// Greeks calculations
export {
  calcDelta,
  calcGamma,
  calcTheta,
  calcVega,
  calcRho,
  calcLegGreeks,
  calcAggregateGreeks,
  interpretDelta,
  interpretTheta,
} from './greeks';

// Multi-leg strategies
export {
  calcTotalPL,
  calcInitialCost,
  calcMaxProfit as calcStrategyMaxProfit,
  calcMaxLoss as calcStrategyMaxLoss,
  hasUnlimitedProfit,
  hasUnlimitedLoss,
  generateStrategicPricePoints,
  isDeltaNeutral,
  classifyStrategy,
  validateLegs,
} from './multi-leg';

// Break-even calculations
export {
  findBreakEvens,
  bisectionMethod,
  estimateBreakEvenCount,
  validateBreakEvenInputs,
  formatBreakEvens,
} from './break-even';

// Chart data generation
export {
  generatePLData,
  generateAdaptivePLData,
  addBreakEvenMarkers,
  calculateChartStatistics,
  sampleChartData,
  createChartConfig,
} from './chart-data';

// Helper functions
export {
  normalCDF,
  normalPDF,
  calculateTimeToExpiry,
  calculateDaysToExpiry,
  calculateD1,
  calculateD2,
  roundTo,
  clamp,
  isApproximatelyEqual,
} from './helpers';

// Validators
export {
  validateInputs,
  validateLeg,
  isValidExpiryDate,
  sanitizeNumber,
  sanitizeDate,
  validateStrategyConsistency,
  assertValidInputs,
  createError,
  combineValidationResults,
} from './validators';
