/**
 * Strategy Calculation Examples
 *
 * This file demonstrates the new FormulaIM strategy-by-strategy implementations.
 * Run with: npx ts-node strategy-examples.ts
 */

import { OptionType, Position, OptionLeg } from './src/lib/types';
import { calcTotalPL, calcInitialCost, calcMaxProfit, calcMaxLoss } from './src/lib/calculations/multi-leg';
import { findBreakEvens } from './src/lib/calculations/break-even';
import { detectStrategy, getStrategyName } from './src/lib/calculations/strategy-detector';

// Helper to create expiry date
const createExpiry = (daysFromNow: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Example 1: Bull Call Spread
console.log('=== Example 1: Bull Call Spread ===');
const bullCallSpread: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 500, // $5.00 per contract ($0.05 per share)
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 110,
    premium: 200, // $2.00 per contract
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const bcsDetection = detectStrategy(bullCallSpread);
console.log(`Detected: ${getStrategyName(bcsDetection.type)} (confidence: ${bcsDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(bullCallSpread)}`);
console.log(`Max Profit: $${calcMaxProfit(bullCallSpread, 105)}`);
console.log(`Max Loss: $${calcMaxLoss(bullCallSpread, 105)}`);
console.log(`Break-Even: $${findBreakEvens(bullCallSpread, 105).join(', ')}`);
console.log(`P/L at $105: $${calcTotalPL(bullCallSpread, 105)}`);
console.log(`P/L at $115: $${calcTotalPL(bullCallSpread, 115)}`);
console.log(`P/L at $95: $${calcTotalPL(bullCallSpread, 95)}`);
console.log('');

// Example 2: Iron Condor
console.log('=== Example 2: Iron Condor ===');
const ironCondor: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.PUT,
    position: Position.LONG,
    strikePrice: 90,
    premium: 50,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.PUT,
    position: Position.SHORT,
    strikePrice: 95,
    premium: 150,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '3',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 105,
    premium: 150,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '4',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 110,
    premium: 50,
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const icDetection = detectStrategy(ironCondor);
console.log(`Detected: ${getStrategyName(icDetection.type)} (confidence: ${icDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(ironCondor)}`);
console.log(`Max Profit: $${calcMaxProfit(ironCondor, 100)}`);
console.log(`Max Loss: $${calcMaxLoss(ironCondor, 100)}`);
console.log(`Break-Evens: $${findBreakEvens(ironCondor, 100).join(', ')}`);
console.log(`P/L at $100: $${calcTotalPL(ironCondor, 100)}`);
console.log(`P/L at $85: $${calcTotalPL(ironCondor, 85)}`);
console.log(`P/L at $115: $${calcTotalPL(ironCondor, 115)}`);
console.log('');

// Example 3: Long Straddle
console.log('=== Example 3: Long Straddle ===');
const longStraddle: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 100,
    premium: 400,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.PUT,
    position: Position.LONG,
    strikePrice: 100,
    premium: 400,
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const lsDetection = detectStrategy(longStraddle);
console.log(`Detected: ${getStrategyName(lsDetection.type)} (confidence: ${lsDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(longStraddle)}`);
console.log(`Max Profit: ${calcMaxProfit(longStraddle, 100) === null ? 'Unlimited' : '$' + calcMaxProfit(longStraddle, 100)}`);
console.log(`Max Loss: $${calcMaxLoss(longStraddle, 100)}`);
console.log(`Break-Evens: $${findBreakEvens(longStraddle, 100).join(', ')}`);
console.log(`P/L at $100: $${calcTotalPL(longStraddle, 100)}`);
console.log(`P/L at $110: $${calcTotalPL(longStraddle, 110)}`);
console.log(`P/L at $90: $${calcTotalPL(longStraddle, 90)}`);
console.log('');

// Example 4: Long Strangle
console.log('=== Example 4: Long Strangle ===');
const longStrangle: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 105,
    premium: 300,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.PUT,
    position: Position.LONG,
    strikePrice: 95,
    premium: 300,
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const lstDetection = detectStrategy(longStrangle);
console.log(`Detected: ${getStrategyName(lstDetection.type)} (confidence: ${lstDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(longStrangle)}`);
console.log(`Break-Evens: $${findBreakEvens(longStrangle, 100).join(', ')}`);
console.log(`P/L at $100: $${calcTotalPL(longStrangle, 100)}`);
console.log(`P/L at $115: $${calcTotalPL(longStrangle, 115)}`);
console.log(`P/L at $85: $${calcTotalPL(longStrangle, 85)}`);
console.log('');

// Example 5: Bear Put Spread
console.log('=== Example 5: Bear Put Spread ===');
const bearPutSpread: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.PUT,
    position: Position.LONG,
    strikePrice: 100,
    premium: 500,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.PUT,
    position: Position.SHORT,
    strikePrice: 90,
    premium: 200,
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const bpsDetection = detectStrategy(bearPutSpread);
console.log(`Detected: ${getStrategyName(bpsDetection.type)} (confidence: ${bpsDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(bearPutSpread)}`);
console.log(`Max Profit: $${calcMaxProfit(bearPutSpread, 95)}`);
console.log(`Max Loss: $${calcMaxLoss(bearPutSpread, 95)}`);
console.log(`Break-Even: $${findBreakEvens(bearPutSpread, 95).join(', ')}`);
console.log(`P/L at $95: $${calcTotalPL(bearPutSpread, 95)}`);
console.log(`P/L at $85: $${calcTotalPL(bearPutSpread, 85)}`);
console.log(`P/L at $105: $${calcTotalPL(bearPutSpread, 105)}`);
console.log('');

// Example 6: Butterfly
console.log('=== Example 6: Long Call Butterfly ===');
const butterfly: OptionLeg[] = [
  {
    id: '1',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 95,
    premium: 600,
    quantity: 1,
    expiryDate: createExpiry(30)
  },
  {
    id: '2',
    optionType: OptionType.CALL,
    position: Position.SHORT,
    strikePrice: 100,
    premium: 400,
    quantity: 2,
    expiryDate: createExpiry(30)
  },
  {
    id: '3',
    optionType: OptionType.CALL,
    position: Position.LONG,
    strikePrice: 105,
    premium: 200,
    quantity: 1,
    expiryDate: createExpiry(30)
  }
];

const bfDetection = detectStrategy(butterfly);
console.log(`Detected: ${getStrategyName(bfDetection.type)} (confidence: ${bfDetection.confidence})`);
console.log(`Initial Cost: $${calcInitialCost(butterfly)}`);
console.log(`Max Profit: $${calcMaxProfit(butterfly, 100)}`);
console.log(`Max Loss: $${calcMaxLoss(butterfly, 100)}`);
console.log(`P/L at $100: $${calcTotalPL(butterfly, 100)}`);
console.log(`P/L at $95: $${calcTotalPL(butterfly, 95)}`);
console.log(`P/L at $105: $${calcTotalPL(butterfly, 105)}`);
console.log('');

console.log('=== Performance Comparison ===');
console.log('Testing calculation speed for Iron Condor at 1000 price points...');

const pricePoints = Array.from({ length: 1000 }, (_, i) => 50 + i * 0.1);

// With optimization
const start1 = performance.now();
pricePoints.forEach(price => calcTotalPL(ironCondor, price, true));
const end1 = performance.now();
console.log(`With optimization: ${(end1 - start1).toFixed(2)}ms`);

// Without optimization (generic calculation)
const start2 = performance.now();
pricePoints.forEach(price => calcTotalPL(ironCondor, price, false));
const end2 = performance.now();
console.log(`Without optimization: ${(end2 - start2).toFixed(2)}ms`);
console.log(`Speedup: ${((end2 - start1) / (end1 - start1)).toFixed(2)}x faster`);
