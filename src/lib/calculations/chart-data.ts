/**
 * Chart Data Generator
 * Generates data points for profit/loss visualization
 */

import { OptionLeg, ChartDataPoint, ChartConfig, ErrorCode } from '../types';
import { calcTotalPL } from './multi-leg';
import { findBreakEvens } from './break-even';
import { DEFAULT_PRICE_RANGE, DEFAULT_CHART_POINTS } from '../constants/defaults';
import { roundTo } from './helpers';
import { CalculationError } from '../types/errors';

/**
 * Generate chart data points for P/L visualization
 *
 * Creates an array of data points showing profit/loss across a range of stock prices
 * Optimized for use with charting libraries like Recharts
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price
 * @param config - Chart configuration options
 * @returns Array of chart data points
 *
 * @example
 * const legs = [longCall, shortCall];
 * const chartData = generatePLData(legs, 100, {
 *   priceRange: 0.5, // ±50%
 *   points: 100
 * });
 */
export function generatePLData(
  legs: OptionLeg[],
  currentStockPrice: number,
  config: Partial<ChartConfig> = {}
): ChartDataPoint[] {
  // Validate inputs
  if (legs.length === 0) {
    throw new CalculationError(
      'Cannot generate chart data: no option legs provided',
      ErrorCode.INVALID_INPUT
    );
  }

  if (currentStockPrice <= 0) {
    throw new CalculationError(
      'Current stock price must be greater than 0',
      ErrorCode.INVALID_INPUT,
      { currentStockPrice }
    );
  }

  // Extract configuration with defaults
  const priceRange = config.priceRange ?? DEFAULT_PRICE_RANGE;
  const points = config.points ?? DEFAULT_CHART_POINTS;
  const showTimeValue = config.showTimeValue ?? false;

  // Calculate price range
  const minPrice = Math.max(0, currentStockPrice * (1 - priceRange));
  const maxPrice = currentStockPrice * (1 + priceRange);
  const step = (maxPrice - minPrice) / (points - 1);

  // Find break-even points
  const breakEvens = findBreakEvens(legs, currentStockPrice, priceRange);

  // Generate data points
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < points; i++) {
    const price = minPrice + step * i;
    const roundedPrice = roundTo(price, 2);

    // Calculate P/L at this price
    const profitLoss = roundTo(calcTotalPL(legs, roundedPrice), 2);

    // Check if this is a break-even point
    const isBreakEven = breakEvens.some(
      (be) => Math.abs(be - roundedPrice) < step / 2
    );

    const dataPoint: ChartDataPoint = {
      stockPrice: roundedPrice,
      profitLoss,
      breakevenPoint: isBreakEven,
    };

    // If showing time value, add expiration P/L
    // Note: This would require Black-Scholes pricing for current value
    if (showTimeValue) {
      dataPoint.profitLossAtExpiry = profitLoss; // Placeholder
    }

    data.push(dataPoint);
  }

  // Ensure break-even points are included
  data.push(...generateBreakEvenPoints(legs, breakEvens));

  // Sort by stock price and remove duplicates
  return deduplicateAndSort(data);
}

/**
 * Generate data points specifically for break-even prices
 * Ensures break-even points appear exactly in the chart
 *
 * @param legs - Array of option legs
 * @param breakEvens - Array of break-even prices
 * @returns Array of chart data points at break-even prices
 */
function generateBreakEvenPoints(
  legs: OptionLeg[],
  breakEvens: number[]
): ChartDataPoint[] {
  return breakEvens.map((be) => ({
    stockPrice: roundTo(be, 2),
    profitLoss: 0, // By definition, P/L is zero at break-even
    breakevenPoint: true,
  }));
}

/**
 * Remove duplicate data points and sort by stock price
 *
 * @param data - Array of chart data points
 * @returns Deduplicated and sorted array
 */
function deduplicateAndSort(data: ChartDataPoint[]): ChartDataPoint[] {
  // Create a map with stock price as key
  const dataMap = new Map<number, ChartDataPoint>();

  for (const point of data) {
    const existing = dataMap.get(point.stockPrice);

    if (!existing) {
      dataMap.set(point.stockPrice, point);
    } else {
      // If duplicate, prefer the one marked as break-even
      if (point.breakevenPoint && !existing.breakevenPoint) {
        dataMap.set(point.stockPrice, point);
      }
    }
  }

  // Convert back to array and sort
  return Array.from(dataMap.values()).sort((a, b) => a.stockPrice - b.stockPrice);
}

/**
 * Add break-even markers to existing chart data
 * Updates breakevenPoint flag based on break-even prices
 *
 * @param chartData - Existing chart data
 * @param breakEvenPoints - Array of break-even prices
 * @param tolerance - Tolerance for matching (default 0.5)
 * @returns Updated chart data with break-even markers
 *
 * @example
 * const data = generatePLData(legs, 100);
 * const breakEvens = findBreakEvens(legs, 100);
 * const markedData = addBreakEvenMarkers(data, breakEvens);
 */
export function addBreakEvenMarkers(
  chartData: ChartDataPoint[],
  breakEvenPoints: number[],
  tolerance: number = 0.5
): ChartDataPoint[] {
  return chartData.map((point) => ({
    ...point,
    breakevenPoint: breakEvenPoints.some(
      (be) => Math.abs(be - point.stockPrice) < tolerance
    ),
  }));
}

/**
 * Generate adaptive chart data with more points around interesting areas
 * Adds extra data points near strikes, break-evens, and current price
 *
 * @param legs - Array of option legs
 * @param currentStockPrice - Current stock price
 * @param config - Chart configuration
 * @returns Array of chart data points with adaptive density
 */
export function generateAdaptivePLData(
  legs: OptionLeg[],
  currentStockPrice: number,
  config: Partial<ChartConfig> = {}
): ChartDataPoint[] {
  // Start with regular data
  const baseData = generatePLData(legs, currentStockPrice, {
    ...config,
    points: (config.points ?? DEFAULT_CHART_POINTS) * 0.7, // Use 70% of points for base
  });

  // Find interesting prices
  const strikes = legs.map((leg) => leg.strikePrice);
  const breakEvens = findBreakEvens(
    legs,
    currentStockPrice,
    config.priceRange ?? DEFAULT_PRICE_RANGE
  );
  const interestingPrices = [currentStockPrice, ...strikes, ...breakEvens];

  // Add extra points around interesting prices
  const extraPoints: ChartDataPoint[] = [];
  const priceRange = config.priceRange ?? DEFAULT_PRICE_RANGE;
  const minPrice = Math.max(0, currentStockPrice * (1 - priceRange));
  const maxPrice = currentStockPrice * (1 + priceRange);

  for (const price of interestingPrices) {
    if (price < minPrice || price > maxPrice) continue;

    // Add points in a small range around interesting price
    const range = (maxPrice - minPrice) * 0.02; // 2% of range
    for (let offset = -range; offset <= range; offset += range / 5) {
      const testPrice = roundTo(price + offset, 2);

      if (testPrice >= minPrice && testPrice <= maxPrice) {
        extraPoints.push({
          stockPrice: testPrice,
          profitLoss: roundTo(calcTotalPL(legs, testPrice), 2),
          breakevenPoint: breakEvens.some((be) => Math.abs(be - testPrice) < 0.1),
        });
      }
    }
  }

  // Combine and deduplicate
  return deduplicateAndSort([...baseData, ...extraPoints]);
}

/**
 * Calculate statistics for chart data
 * Useful for scaling and labeling charts
 *
 * @param chartData - Array of chart data points
 * @returns Statistics object
 */
export function calculateChartStatistics(chartData: ChartDataPoint[]): {
  minPrice: number;
  maxPrice: number;
  minPL: number;
  maxPL: number;
  breakEvenPrices: number[];
  profitableRange: { min: number; max: number } | null;
} {
  if (chartData.length === 0) {
    throw new CalculationError(
      'Cannot calculate statistics: chart data is empty',
      ErrorCode.INVALID_INPUT
    );
  }

  const prices = chartData.map((d) => d.stockPrice);
  const profitLosses = chartData.map((d) => d.profitLoss);

  const breakEvenPrices = chartData
    .filter((d) => d.breakevenPoint)
    .map((d) => d.stockPrice);

  // Find profitable range (where P/L > 0)
  const profitablePoints = chartData.filter((d) => d.profitLoss > 0);
  let profitableRange: { min: number; max: number } | null = null;

  if (profitablePoints.length > 0) {
    const profitablePrices = profitablePoints.map((d) => d.stockPrice);
    profitableRange = {
      min: Math.min(...profitablePrices),
      max: Math.max(...profitablePrices),
    };
  }

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minPL: Math.min(...profitLosses),
    maxPL: Math.max(...profitLosses),
    breakEvenPrices,
    profitableRange,
  };
}

/**
 * Sample chart data to reduce points while maintaining shape
 * Useful for performance optimization on large datasets
 *
 * @param chartData - Original chart data
 * @param targetPoints - Target number of points
 * @returns Sampled chart data
 */
export function sampleChartData(
  chartData: ChartDataPoint[],
  targetPoints: number
): ChartDataPoint[] {
  if (chartData.length <= targetPoints) {
    return chartData;
  }

  // Always keep first, last, and break-even points
  const mustKeep = new Set<number>();
  mustKeep.add(0); // First point
  mustKeep.add(chartData.length - 1); // Last point

  // Add break-even points
  chartData.forEach((point, index) => {
    if (point.breakevenPoint) {
      mustKeep.add(index);
    }
  });

  // Calculate stride for sampling
  const remainingPoints = targetPoints - mustKeep.size;
  const stride = Math.floor(chartData.length / remainingPoints);

  const sampled: ChartDataPoint[] = [];

  for (let i = 0; i < chartData.length; i++) {
    if (mustKeep.has(i) || i % stride === 0) {
      sampled.push(chartData[i]);
    }
  }

  return sampled;
}

/**
 * Generate chart configuration object
 * Helper to create complete ChartConfig from partial config
 *
 * @param currentPrice - Current stock price
 * @param breakEvenPoints - Array of break-even prices
 * @param config - Partial configuration
 * @returns Complete ChartConfig object
 */
export function createChartConfig(
  currentPrice: number,
  breakEvenPoints: number[],
  config: Partial<ChartConfig> = {}
): ChartConfig {
  const priceRange = config.priceRange ?? DEFAULT_PRICE_RANGE;

  return {
    minPrice: Math.max(0, currentPrice * (1 - priceRange)),
    maxPrice: currentPrice * (1 + priceRange),
    currentPrice,
    breakEvenPoints,
    showTimeValue: config.showTimeValue ?? false,
    priceRange,
    points: config.points ?? DEFAULT_CHART_POINTS,
  };
}
