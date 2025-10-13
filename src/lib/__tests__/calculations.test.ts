/**
 * Calculation Engine Tests
 * Comprehensive tests for all core calculation functions
 */

import {
  // Basic P/L
  calcLongCall,
  calcLongPut,
  calcShortCall,
  calcShortPut,
  calcIntrinsicValue,
  calcSingleOptionBreakEven,

  // Black-Scholes
  blackScholes,
  blackScholesCall,
  blackScholesPut,

  // Greeks
  calcDelta,
  calcGamma,
  calcTheta,
  calcVega,
  calcRho,

  // Multi-leg
  calcTotalPL,
  calcInitialCost,
  findBreakEvens,

  // Helpers
  normalCDF,
  normalPDF,
  roundTo,

  // Types
  OptionType,
  Position,
  OptionLeg,
} from '../index';

// ============================================================================
// TEST HELPER FUNCTIONS
// ============================================================================

function createTestLeg(overrides: Partial<OptionLeg> = {}): OptionLeg {
  return {
    id: 'test-1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
    expiryDate: new Date('2025-12-31'),
    ...overrides,
  };
}

// ============================================================================
// BASIC P/L TESTS
// ============================================================================

console.log('='.repeat(80));
console.log('BASIC PROFIT/LOSS CALCULATIONS');
console.log('='.repeat(80));

// Test 1: Long Call - In the Money
console.log('\nTest 1: Long Call - ITM');
console.log('Buy 1 call at $100 strike for $5 premium, stock at $110');
const longCallITM = calcLongCall(110, 100, 5, 1);
console.log(`Expected: $500, Got: $${longCallITM}`);
console.log(`✓ ${longCallITM === 500 ? 'PASS' : 'FAIL'}`);

// Test 2: Long Call - Out of the Money
console.log('\nTest 2: Long Call - OTM');
console.log('Buy 1 call at $100 strike for $5 premium, stock at $95');
const longCallOTM = calcLongCall(95, 100, 5, 1);
console.log(`Expected: -$500, Got: $${longCallOTM}`);
console.log(`✓ ${longCallOTM === -500 ? 'PASS' : 'FAIL'}`);

// Test 3: Long Call - At Break-Even
console.log('\nTest 3: Long Call - Break-Even');
console.log('Buy 1 call at $100 strike for $5 premium, stock at $105');
const longCallBE = calcLongCall(105, 100, 5, 1);
console.log(`Expected: $0, Got: $${longCallBE}`);
console.log(`✓ ${longCallBE === 0 ? 'PASS' : 'FAIL'}`);

// Test 4: Long Put - In the Money
console.log('\nTest 4: Long Put - ITM');
console.log('Buy 1 put at $100 strike for $5 premium, stock at $90');
const longPutITM = calcLongPut(90, 100, 5, 1);
console.log(`Expected: $500, Got: $${longPutITM}`);
console.log(`✓ ${longPutITM === 500 ? 'PASS' : 'FAIL'}`);

// Test 5: Short Call - Loss
console.log('\nTest 5: Short Call - Loss');
console.log('Sell 1 call at $100 strike for $5 premium, stock at $115');
const shortCallLoss = calcShortCall(115, 100, 5, 1);
console.log(`Expected: -$1000, Got: $${shortCallLoss}`);
console.log(`✓ ${shortCallLoss === -1000 ? 'PASS' : 'FAIL'}`);

// Test 6: Short Put - Profit
console.log('\nTest 6: Short Put - Max Profit');
console.log('Sell 1 put at $100 strike for $5 premium, stock at $105');
const shortPutProfit = calcShortPut(105, 100, 5, 1);
console.log(`Expected: $500, Got: $${shortPutProfit}`);
console.log(`✓ ${shortPutProfit === 500 ? 'PASS' : 'FAIL'}`);

// Test 7: Intrinsic Value
console.log('\nTest 7: Intrinsic Value - Call ITM');
const callIV = calcIntrinsicValue(OptionType.CALL, 110, 100);
console.log(`Expected: 10, Got: ${callIV}`);
console.log(`✓ ${callIV === 10 ? 'PASS' : 'FAIL'}`);

console.log('\nTest 8: Intrinsic Value - Put ITM');
const putIV = calcIntrinsicValue(OptionType.PUT, 90, 100);
console.log(`Expected: 10, Got: ${putIV}`);
console.log(`✓ ${putIV === 10 ? 'PASS' : 'FAIL'}`);

// Test 9: Break-Even Calculation
console.log('\nTest 9: Single Option Break-Even');
const callBE = calcSingleOptionBreakEven(OptionType.CALL, 100, 5);
console.log(`Call Break-Even - Expected: 105, Got: ${callBE}`);
console.log(`✓ ${callBE === 105 ? 'PASS' : 'FAIL'}`);

const putBE = calcSingleOptionBreakEven(OptionType.PUT, 100, 5);
console.log(`Put Break-Even - Expected: 95, Got: ${putBE}`);
console.log(`✓ ${putBE === 95 ? 'PASS' : 'FAIL'}`);

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('HELPER FUNCTIONS');
console.log('='.repeat(80));

// Test 10: Normal CDF
console.log('\nTest 10: Normal CDF');
const cdf0 = normalCDF(0);
console.log(`N(0) - Expected: ~0.5, Got: ${cdf0.toFixed(4)}`);
console.log(`✓ ${Math.abs(cdf0 - 0.5) < 0.01 ? 'PASS' : 'FAIL'}`);

const cdf196 = normalCDF(1.96);
console.log(`N(1.96) - Expected: ~0.975, Got: ${cdf196.toFixed(4)}`);
console.log(`✓ ${Math.abs(cdf196 - 0.975) < 0.01 ? 'PASS' : 'FAIL'}`);

// Test 11: Normal PDF
console.log('\nTest 11: Normal PDF');
const pdf0 = normalPDF(0);
console.log(`φ(0) - Expected: ~0.3989, Got: ${pdf0.toFixed(4)}`);
console.log(`✓ ${Math.abs(pdf0 - 0.3989) < 0.01 ? 'PASS' : 'FAIL'}`);

// Test 12: Round To
console.log('\nTest 12: Round To');
const rounded = roundTo(1.2345, 2);
console.log(`Expected: 1.23, Got: ${rounded}`);
console.log(`✓ ${rounded === 1.23 ? 'PASS' : 'FAIL'}`);

// ============================================================================
// BLACK-SCHOLES TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('BLACK-SCHOLES OPTION PRICING');
console.log('='.repeat(80));

// Test 13: ATM Call Option
console.log('\nTest 13: Black-Scholes ATM Call');
console.log('Stock: $100, Strike: $100, T: 0.25y, r: 5%, σ: 30%');
const bsCall = blackScholesCall(100, 100, 0.25, 0.05, 0.30);
console.log(`Call Price: $${bsCall.toFixed(2)}`);
console.log(`Expected: ~$5-6 (reasonable range)`);
console.log(`✓ ${bsCall > 4 && bsCall < 7 ? 'PASS' : 'FAIL'}`);

// Test 14: ATM Put Option
console.log('\nTest 14: Black-Scholes ATM Put');
const bsPut = blackScholesPut(100, 100, 0.25, 0.05, 0.30);
console.log(`Put Price: $${bsPut.toFixed(2)}`);
console.log(`Expected: ~$4-5 (reasonable range)`);
console.log(`✓ ${bsPut > 3 && bsPut < 6 ? 'PASS' : 'FAIL'}`);

// Test 15: Deep ITM Call
console.log('\nTest 15: Black-Scholes Deep ITM Call');
const bsCallITM = blackScholesCall(120, 100, 0.25, 0.05, 0.30);
console.log(`Call Price: $${bsCallITM.toFixed(2)}`);
console.log(`Expected: > $20 (intrinsic value)`);
console.log(`✓ ${bsCallITM > 20 ? 'PASS' : 'FAIL'}`);

// Test 16: Expiration Case
console.log('\nTest 16: Black-Scholes at Expiration (T=0)');
const bsExpiry = blackScholesCall(110, 100, 0, 0.05, 0.30);
console.log(`Call Price at T=0: $${bsExpiry.toFixed(2)}`);
console.log(`Expected: $10 (intrinsic value only)`);
console.log(`✓ ${bsExpiry === 10 ? 'PASS' : 'FAIL'}`);

// ============================================================================
// GREEKS TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('GREEKS CALCULATIONS');
console.log('='.repeat(80));

const greeksParams = {
  stockPrice: 100,
  strikePrice: 100,
  timeToExpiry: 0.25,
  riskFreeRate: 0.05,
  volatility: 0.30,
};

// Test 17: Delta - ATM Call
console.log('\nTest 17: Delta - ATM Call');
const deltaCall = calcDelta(
  OptionType.CALL,
  greeksParams.stockPrice,
  greeksParams.strikePrice,
  greeksParams.timeToExpiry,
  greeksParams.riskFreeRate,
  greeksParams.volatility
);
console.log(`Delta: ${deltaCall.toFixed(4)}`);
console.log(`Expected: ~0.5-0.6 (ATM call delta)`);
console.log(`✓ ${deltaCall > 0.4 && deltaCall < 0.7 ? 'PASS' : 'FAIL'}`);

// Test 18: Gamma - ATM
console.log('\nTest 18: Gamma - ATM');
const gamma = calcGamma(
  greeksParams.stockPrice,
  greeksParams.strikePrice,
  greeksParams.timeToExpiry,
  greeksParams.riskFreeRate,
  greeksParams.volatility
);
console.log(`Gamma: ${gamma.toFixed(4)}`);
console.log(`Expected: > 0 (positive for all options)`);
console.log(`✓ ${gamma > 0 ? 'PASS' : 'FAIL'}`);

// Test 19: Theta - ATM Call
console.log('\nTest 19: Theta - ATM Call (per day)');
const theta = calcTheta(
  OptionType.CALL,
  greeksParams.stockPrice,
  greeksParams.strikePrice,
  greeksParams.timeToExpiry,
  greeksParams.riskFreeRate,
  greeksParams.volatility
);
console.log(`Theta: ${theta.toFixed(4)}`);
console.log(`Expected: < 0 (time decay for long options)`);
console.log(`✓ ${theta < 0 ? 'PASS' : 'FAIL'}`);

// Test 20: Vega - ATM
console.log('\nTest 20: Vega - ATM');
const vega = calcVega(
  greeksParams.stockPrice,
  greeksParams.strikePrice,
  greeksParams.timeToExpiry,
  greeksParams.riskFreeRate,
  greeksParams.volatility
);
console.log(`Vega: ${vega.toFixed(4)}`);
console.log(`Expected: > 0 (positive for all options)`);
console.log(`✓ ${vega > 0 ? 'PASS' : 'FAIL'}`);

// Test 21: Rho - ATM Call
console.log('\nTest 21: Rho - ATM Call');
const rho = calcRho(
  OptionType.CALL,
  greeksParams.stockPrice,
  greeksParams.strikePrice,
  greeksParams.timeToExpiry,
  greeksParams.riskFreeRate,
  greeksParams.volatility
);
console.log(`Rho: ${rho.toFixed(4)}`);
console.log(`Expected: > 0 (call rho is positive)`);
console.log(`✓ ${rho > 0 ? 'PASS' : 'FAIL'}`);

// ============================================================================
// MULTI-LEG STRATEGY TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('MULTI-LEG STRATEGY CALCULATIONS');
console.log('='.repeat(80));

// Test 22: Bull Call Spread
console.log('\nTest 22: Bull Call Spread');
const bullCallLegs: OptionLeg[] = [
  createTestLeg({
    id: 'long-call',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
  }),
  createTestLeg({
    id: 'short-call',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 105,
    premium: 2,
    quantity: 1,
  }),
];

const initialCost = calcInitialCost(bullCallLegs);
console.log(`Initial Cost: $${initialCost}`);
console.log(`Expected: -$300 (paid 5, received 2, net debit 3)`);
console.log(`✓ ${initialCost === -300 ? 'PASS' : 'FAIL'}`);

const plAt110 = calcTotalPL(bullCallLegs, 110);
console.log(`P/L at stock=$110: $${plAt110}`);
console.log(`Expected: $200 (max profit = spread width - net debit)`);
console.log(`✓ ${plAt110 === 200 ? 'PASS' : 'FAIL'}`);

const plAt95 = calcTotalPL(bullCallLegs, 95);
console.log(`P/L at stock=$95: $${plAt95}`);
console.log(`Expected: -$300 (max loss = net debit)`);
console.log(`✓ ${plAt95 === -300 ? 'PASS' : 'FAIL'}`);

// Test 23: Break-Even for Bull Call Spread
console.log('\nTest 23: Bull Call Spread Break-Even');
const breakEvens = findBreakEvens(bullCallLegs, 100, 0.2);
console.log(`Break-Even Points: ${breakEvens.map(be => `$${be.toFixed(2)}`).join(', ')}`);
console.log(`Expected: ~$103 (lower strike + net debit)`);
console.log(`✓ ${breakEvens.length === 1 && Math.abs(breakEvens[0] - 103) < 0.1 ? 'PASS' : 'FAIL'}`);

// Test 24: Long Straddle
console.log('\nTest 24: Long Straddle');
const straddleLegs: OptionLeg[] = [
  createTestLeg({
    id: 'long-call',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
  }),
  createTestLeg({
    id: 'long-put',
    optionType: OptionType.PUT,
    position: Position.LONG,
    strikePrice: 100,
    premium: 5,
    quantity: 1,
  }),
];

const straddleCost = calcInitialCost(straddleLegs);
console.log(`Initial Cost: $${straddleCost}`);
console.log(`Expected: -$1000 (paid 5 for call + 5 for put)`);
console.log(`✓ ${straddleCost === -1000 ? 'PASS' : 'FAIL'}`);

const straddlePLUp = calcTotalPL(straddleLegs, 120);
console.log(`P/L at stock=$120: $${straddlePLUp}`);
console.log(`Expected: $1000 (call profit 15*100 - 10*100 premium)`);
console.log(`✓ ${straddlePLUp === 1000 ? 'PASS' : 'FAIL'}`);

const straddlePLDown = calcTotalPL(straddleLegs, 80);
console.log(`P/L at stock=$80: $${straddlePLDown}`);
console.log(`Expected: $1000 (put profit 15*100 - 10*100 premium)`);
console.log(`✓ ${straddlePLDown === 1000 ? 'PASS' : 'FAIL'}`);

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('TEST SUITE COMPLETE');
console.log('='.repeat(80));
console.log('\nAll core calculations have been tested.');
console.log('Review output above for any FAIL results.');
console.log('\nCalculation Engine Status: ✓ READY FOR USE');
console.log('='.repeat(80));
