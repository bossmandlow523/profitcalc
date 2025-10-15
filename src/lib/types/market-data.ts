/**
 * Market Data API Type Definitions
 * Types for stock prices, options chains, and related market data
 */

// ============================================================================
// STOCK PRICE DATA
// ============================================================================

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high52Week?: number;
  low52Week?: number;
  previousClose: number;
  timestamp: Date;
}

export interface StockPriceRequest {
  symbol: string;
  includeExtendedHours?: boolean;
}

// ============================================================================
// OPTIONS CHAIN DATA
// ============================================================================

export interface OptionContract {
  symbol: string;              // Option symbol (e.g., "AAPL250117C00150000")
  underlying: string;          // Underlying stock symbol
  strikePrice: number;
  expiryDate: string;          // ISO date string (YYYY-MM-DD)
  optionType: 'call' | 'put';

  // Pricing data
  bid: number;
  ask: number;
  lastPrice: number;
  mark: number;                // (bid + ask) / 2

  // Volume and interest
  volume: number;
  openInterest: number;

  // Greeks
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;

  // Volatility
  impliedVolatility?: number;

  // Status
  inTheMoney: boolean;
  intrinsicValue: number;
  extrinsicValue: number;

  timestamp: Date;
}

export interface OptionsChain {
  underlying: string;
  underlyingPrice: number;
  timestamp: Date;
  expiryDates: string[];       // Available expiry dates
  strikes: number[];           // Available strike prices
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionsChainRequest {
  symbol: string;
  expiryDate?: string;         // Filter by specific expiry (YYYY-MM-DD)
  minStrike?: number;
  maxStrike?: number;
  includeGreeks?: boolean;
}

// ============================================================================
// EXPIRY DATES
// ============================================================================

export interface ExpiryDate {
  date: string;                // ISO date string (YYYY-MM-DD)
  type: 'weekly' | 'monthly' | 'quarterly' | 'leaps';
  daysUntilExpiry: number;
  isStandard: boolean;         // Is this a standard monthly expiry?
}

export interface ExpiryDatesRequest {
  symbol: string;
  includeWeeklies?: boolean;
  includeMonthlies?: boolean;
  includeQuarterlies?: boolean;
  includeLeaps?: boolean;
  minDaysOut?: number;         // Minimum days until expiry
  maxDaysOut?: number;         // Maximum days until expiry
}

export interface ExpiryDatesResponse {
  symbol: string;
  expiryDates: ExpiryDate[];
  timestamp: Date;
}

// ============================================================================
// HISTORICAL DATA
// ============================================================================

export interface HistoricalDataPoint {
  date: string;                // ISO date string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface HistoricalDataRequest {
  symbol: string;
  startDate: string;           // ISO date string
  endDate: string;             // ISO date string
  interval: '1d' | '1wk' | '1mo';
}

export interface HistoricalDataResponse {
  symbol: string;
  data: HistoricalDataPoint[];
  interval: string;
}

// ============================================================================
// VOLATILITY DATA
// ============================================================================

export interface VolatilityData {
  symbol: string;
  impliedVolatility: number;   // Current IV (annualized)
  historicalVolatility: number; // HV (annualized)
  ivRank: number;              // IV percentile (0-100)
  ivPercentile: number;        // IV percentile over period
  timestamp: Date;
}

export interface VolatilityRequest {
  symbol: string;
  period?: number;             // Days for calculation (default 30)
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: Date;
  cached?: boolean;            // Is this from cache?
  cacheAge?: number;           // Cache age in milliseconds
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// ============================================================================
// API REQUEST STATE
// ============================================================================

export enum RequestStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface RequestState<T = any> {
  status: RequestStatus;
  data: T | null;
  error: ApiError | null;
  timestamp: Date | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;             // Request timeout in milliseconds
  retryAttempts: number;
  retryDelay: number;          // Delay between retries in milliseconds
  cacheEnabled: boolean;
  cacheDuration: number;       // Cache duration in milliseconds
}

export interface ApiEndpoints {
  stockPrice: string;          // e.g., '/api/stocks/{symbol}/quote'
  optionsChain: string;        // e.g., '/api/options/{symbol}/chain'
  expiryDates: string;         // e.g., '/api/options/{symbol}/expiries'
  historicalData: string;      // e.g., '/api/stocks/{symbol}/history'
  volatility: string;          // e.g., '/api/stocks/{symbol}/volatility'
}
