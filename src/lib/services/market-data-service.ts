/**
 * Market Data Service
 * High-level API for fetching stock prices, options chains, and expiry dates
 */

import { apiClient } from './api-client';
import type {
  StockQuote,
  StockPriceRequest,
  OptionsChain,
  OptionsChainRequest,
  ExpiryDatesResponse,
  ExpiryDatesRequest,
  VolatilityData,
  VolatilityRequest,
  HistoricalDataResponse,
  HistoricalDataRequest,
  ApiResponse,
} from '../types/market-data';

/**
 * Market Data Service Class
 * Provides methods for all market data operations
 */
export class MarketDataService {
  /**
   * Get current stock price and quote data
   * Timeout: 15 seconds (like getStockPrice in the example)
   */
  async getStockPrice(request: StockPriceRequest): Promise<ApiResponse<StockQuote>> {
    return apiClient.request<StockQuote>(
      `stocks/${request.symbol}/quote`,
      {
        includeExtendedHours: request.includeExtendedHours,
      },
      {
        description: `Fetching price for ${request.symbol}`,
        timeout: 15000, // 15 second timeout like the example
      }
    );
  }

  /**
   * Get options chain for a symbol
   * Timeout: 30 seconds (like getOptions in the example)
   */
  async getOptionsChain(request: OptionsChainRequest): Promise<ApiResponse<OptionsChain>> {
    return apiClient.request<OptionsChain>(
      `options/${request.symbol}/chain`,
      {
        expiryDate: request.expiryDate,
        minStrike: request.minStrike,
        maxStrike: request.maxStrike,
        includeGreeks: request.includeGreeks,
      },
      {
        description: `Fetching options chain for ${request.symbol}`,
        timeout: 30000, // 30 second timeout like the example
      }
    );
  }

  /**
   * Get available expiry dates for a symbol
   */
  async getExpiryDates(request: ExpiryDatesRequest): Promise<ApiResponse<ExpiryDatesResponse>> {
    return apiClient.request<ExpiryDatesResponse>(
      `options/${request.symbol}/expiries`,
      {
        includeWeeklies: request.includeWeeklies,
        includeMonthlies: request.includeMonthlies,
        includeQuarterlies: request.includeQuarterlies,
        includeLeaps: request.includeLeaps,
        minDaysOut: request.minDaysOut,
        maxDaysOut: request.maxDaysOut,
      },
      {
        description: `Fetching expiry dates for ${request.symbol}`,
        timeout: 15000,
      }
    );
  }

  /**
   * Get volatility data (IV, HV, IV Rank)
   */
  async getVolatility(request: VolatilityRequest): Promise<ApiResponse<VolatilityData>> {
    return apiClient.request<VolatilityData>(
      `stocks/${request.symbol}/volatility`,
      {
        period: request.period,
      },
      {
        description: `Fetching volatility for ${request.symbol}`,
        timeout: 15000,
      }
    );
  }

  /**
   * Get historical price data
   */
  async getHistoricalData(
    request: HistoricalDataRequest
  ): Promise<ApiResponse<HistoricalDataResponse>> {
    return apiClient.request<HistoricalDataResponse>(
      `stocks/${request.symbol}/history`,
      {
        startDate: request.startDate,
        endDate: request.endDate,
        interval: request.interval,
      },
      {
        description: `Fetching historical data for ${request.symbol}`,
        timeout: 20000,
      }
    );
  }

  /**
   * Search for stock symbols
   */
  async searchSymbols(query: string): Promise<ApiResponse<{ symbol: string; name: string }[]>> {
    return apiClient.request<{ symbol: string; name: string }[]>(
      'stocks/search',
      { q: query },
      {
        description: 'Searching symbols',
        timeout: 10000,
        skipCache: true, // Don't cache search results
      }
    );
  }

  /**
   * Validate if a symbol exists and is optionable
   */
  async validateSymbol(symbol: string): Promise<ApiResponse<{
    valid: boolean;
    optionable: boolean;
    name: string;
  }>> {
    return apiClient.request(
      `stocks/${symbol}/validate`,
      {},
      {
        description: `Validating ${symbol}`,
        timeout: 10000,
      }
    );
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const marketDataService = new MarketDataService();
