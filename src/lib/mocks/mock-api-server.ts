/**
 * Mock API Server
 * Simulates backend API responses for development and testing
 *
 * This can be replaced with a real backend implementation that calls:
 * - Yahoo Finance API (free, but rate-limited)
 * - Alpha Vantage API (free tier available)
 * - Polygon.io API (free tier for stocks)
 * - IEX Cloud API (free tier available)
 * - TD Ameritrade API (free with account)
 */

import type {
  StockQuote,
  OptionsChain,
  OptionContract,
  ExpiryDatesResponse,
  ExpiryDate,
  VolatilityData,
} from '../types/market-data';

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate mock stock quote
 */
export async function mockGetStockQuote(symbol: string): Promise<StockQuote> {
  await delay(500); // Simulate network delay

  // Generate realistic mock data
  const basePrice = 100 + Math.random() * 400; // $100-$500
  const change = (Math.random() - 0.5) * 10;

  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: Math.floor(Math.random() * 1000000000000),
    high52Week: parseFloat((basePrice * 1.2).toFixed(2)),
    low52Week: parseFloat((basePrice * 0.8).toFixed(2)),
    previousClose: parseFloat((basePrice - change).toFixed(2)),
    timestamp: new Date(),
  };
}

/**
 * Generate mock options chain
 */
export async function mockGetOptionsChain(
  symbol: string,
  expiryDate?: string
): Promise<OptionsChain> {
  await delay(1000); // Simulate longer network delay

  const stockPrice = 150; // Mock underlying price
  const strikes = generateStrikePrices(stockPrice);
  const expiryDates = generateExpiryDates();
  const selectedExpiry = expiryDate || expiryDates[0];

  const calls: OptionContract[] = strikes.map((strike) =>
    generateOptionContract(symbol, 'call', strike, selectedExpiry, stockPrice)
  );

  const puts: OptionContract[] = strikes.map((strike) =>
    generateOptionContract(symbol, 'put', strike, selectedExpiry, stockPrice)
  );

  return {
    underlying: symbol.toUpperCase(),
    underlyingPrice: stockPrice,
    timestamp: new Date(),
    expiryDates,
    strikes,
    calls,
    puts,
  };
}

/**
 * Generate mock expiry dates
 */
export async function mockGetExpiryDates(symbol: string): Promise<ExpiryDatesResponse> {
  await delay(300);

  const expiryDates: ExpiryDate[] = [];
  const today = new Date();

  // Generate weekly expiries for next 8 weeks
  for (let week = 1; week <= 8; week++) {
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + week * 7);

    // Make it Friday
    const day = expiryDate.getDay();
    const daysToFriday = (5 - day + 7) % 7 || 7;
    expiryDate.setDate(expiryDate.getDate() + daysToFriday);

    const dateStr = expiryDate.toISOString().split('T')[0];
    const daysUntil = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    expiryDates.push({
      date: dateStr,
      type: week === 3 ? 'monthly' : 'weekly',
      daysUntilExpiry: daysUntil,
      isStandard: week === 3,
    });
  }

  // Add monthly expiries
  for (let month = 2; month <= 6; month++) {
    const expiryDate = new Date(today);
    expiryDate.setMonth(today.getMonth() + month);
    expiryDate.setDate(1);

    // Third Friday
    const firstDay = expiryDate.getDay();
    const daysToFirstFriday = (5 - firstDay + 7) % 7;
    expiryDate.setDate(1 + daysToFirstFriday + 14);

    const dateStr = expiryDate.toISOString().split('T')[0];
    const daysUntil = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    expiryDates.push({
      date: dateStr,
      type: 'monthly',
      daysUntilExpiry: daysUntil,
      isStandard: true,
    });
  }

  // Add LEAPS (long-term)
  for (let year = 1; year <= 2; year++) {
    const expiryDate = new Date(today);
    expiryDate.setFullYear(today.getFullYear() + year);
    expiryDate.setMonth(0); // January
    expiryDate.setDate(1);

    // Third Friday of January
    const firstDay = expiryDate.getDay();
    const daysToFirstFriday = (5 - firstDay + 7) % 7;
    expiryDate.setDate(1 + daysToFirstFriday + 14);

    const dateStr = expiryDate.toISOString().split('T')[0];
    const daysUntil = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    expiryDates.push({
      date: dateStr,
      type: 'leaps',
      daysUntilExpiry: daysUntil,
      isStandard: false,
    });
  }

  return {
    symbol: symbol.toUpperCase(),
    expiryDates,
    timestamp: new Date(),
  };
}

/**
 * Generate mock volatility data
 */
export async function mockGetVolatility(symbol: string, period: number = 30): Promise<VolatilityData> {
  await delay(400);

  const baseIV = 0.30 + (Math.random() - 0.5) * 0.2; // 20% - 40%
  const baseHV = baseIV * (0.9 + Math.random() * 0.2); // HV typically different from IV

  return {
    symbol: symbol.toUpperCase(),
    impliedVolatility: parseFloat(baseIV.toFixed(4)),
    historicalVolatility: parseFloat(baseHV.toFixed(4)),
    ivRank: parseFloat((Math.random() * 100).toFixed(2)),
    ivPercentile: parseFloat((Math.random() * 100).toFixed(2)),
    timestamp: new Date(),
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate strike prices around the stock price
 */
function generateStrikePrices(stockPrice: number): number[] {
  const strikes: number[] = [];
  const interval = stockPrice < 50 ? 2.5 : stockPrice < 200 ? 5 : 10;
  const numStrikes = 15;

  const atmStrike = Math.round(stockPrice / interval) * interval;

  for (let i = -numStrikes / 2; i <= numStrikes / 2; i++) {
    strikes.push(atmStrike + i * interval);
  }

  return strikes.sort((a, b) => a - b);
}

/**
 * Generate expiry dates (simplified)
 */
function generateExpiryDates(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let week = 1; week <= 8; week++) {
    const date = new Date(today);
    date.setDate(today.getDate() + week * 7);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * Generate a single option contract
 */
function generateOptionContract(
  underlying: string,
  type: 'call' | 'put',
  strike: number,
  expiry: string,
  stockPrice: number
): OptionContract {
  // Calculate intrinsic value
  const intrinsicValue =
    type === 'call'
      ? Math.max(0, stockPrice - strike)
      : Math.max(0, strike - stockPrice);

  const inTheMoney = intrinsicValue > 0;

  // Calculate time value (simplified)
  const daysToExpiry = Math.floor(
    (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const timeValueMultiplier = Math.sqrt(daysToExpiry / 30) * 0.05 * stockPrice;

  // Calculate moneyness factor (options closer to ATM have higher extrinsic value)
  const moneyness = Math.abs(stockPrice - strike);
  const moneynessMultiplier = Math.exp(-moneyness / (stockPrice * 0.1));

  const extrinsicValue = parseFloat(
    (timeValueMultiplier * moneynessMultiplier).toFixed(2)
  );

  const mark = parseFloat((intrinsicValue + extrinsicValue).toFixed(2));
  const bid = parseFloat((mark - 0.1).toFixed(2));
  const ask = parseFloat((mark + 0.1).toFixed(2));

  // Generate mock Greeks
  const delta =
    type === 'call'
      ? parseFloat((0.5 + (stockPrice - strike) / stockPrice).toFixed(4))
      : parseFloat((-0.5 + (stockPrice - strike) / stockPrice).toFixed(4));

  return {
    symbol: `${underlying}${expiry.replace(/-/g, '')}${type === 'call' ? 'C' : 'P'}${String(strike * 1000).padStart(8, '0')}`,
    underlying: underlying.toUpperCase(),
    strikePrice: strike,
    expiryDate: expiry,
    optionType: type,
    bid: Math.max(0, bid),
    ask: Math.max(0.01, ask),
    lastPrice: mark,
    mark: Math.max(0, mark),
    volume: Math.floor(Math.random() * 10000),
    openInterest: Math.floor(Math.random() * 50000),
    delta: Math.max(-1, Math.min(1, delta)),
    gamma: parseFloat((Math.random() * 0.1).toFixed(4)),
    theta: parseFloat((-(Math.random() * 0.5)).toFixed(4)),
    vega: parseFloat((Math.random() * 0.3).toFixed(4)),
    rho: parseFloat(((Math.random() - 0.5) * 0.1).toFixed(4)),
    impliedVolatility: parseFloat((0.2 + Math.random() * 0.4).toFixed(4)),
    inTheMoney,
    intrinsicValue: parseFloat(intrinsicValue.toFixed(2)),
    extrinsicValue,
    timestamp: new Date(),
  };
}
