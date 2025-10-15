/**
 * Market Data Store
 * Zustand store for managing market data state (stock prices, options chains, expiry dates)
 */

import { create } from 'zustand';
import { marketDataService } from '../services/market-data-service';
import type {
  StockQuote,
  OptionsChain,
  ExpiryDatesResponse,
  VolatilityData,
  RequestState,
  ApiError,
} from '../types/market-data';

/**
 * Helper to create initial request state
 */
function createRequestState<T>(): RequestState<T> {
  return {
    status: 'idle',
    data: null,
    error: null,
    timestamp: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  };
}

interface MarketDataStore {
  // Current symbol being viewed
  currentSymbol: string | null;

  // Stock quote state
  stockQuote: RequestState<StockQuote>;

  // Options chain state
  optionsChain: RequestState<OptionsChain>;

  // Expiry dates state
  expiryDates: RequestState<ExpiryDatesResponse>;

  // Volatility state
  volatility: RequestState<VolatilityData>;

  // Selected expiry date (for filtering options chain)
  selectedExpiryDate: string | null;

  // Actions
  setCurrentSymbol: (symbol: string) => void;
  fetchStockQuote: (symbol: string) => Promise<void>;
  fetchOptionsChain: (symbol: string, expiryDate?: string) => Promise<void>;
  fetchExpiryDates: (symbol: string) => Promise<void>;
  fetchVolatility: (symbol: string, period?: number) => Promise<void>;
  setSelectedExpiryDate: (date: string | null) => void;
  clearMarketData: () => void;
}

const initialState = {
  currentSymbol: null,
  stockQuote: createRequestState<StockQuote>(),
  optionsChain: createRequestState<OptionsChain>(),
  expiryDates: createRequestState<ExpiryDatesResponse>(),
  volatility: createRequestState<VolatilityData>(),
  selectedExpiryDate: null,
};

export const useMarketDataStore = create<MarketDataStore>((set, get) => ({
  ...initialState,

  /**
   * Set the current symbol
   */
  setCurrentSymbol: (symbol) => {
    set({ currentSymbol: symbol });
  },

  /**
   * Fetch stock quote for a symbol
   */
  fetchStockQuote: async (symbol) => {
    set((state) => ({
      stockQuote: {
        ...state.stockQuote,
        status: 'pending',
        isLoading: true,
        isError: false,
        error: null,
      },
    }));

    try {
      const response = await marketDataService.getStockPrice({ symbol });

      set({
        stockQuote: {
          status: 'success',
          data: response.data,
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      });
    } catch (error) {
      set({
        stockQuote: {
          status: 'error',
          data: null,
          error: error as ApiError,
          timestamp: new Date(),
          isLoading: false,
          isSuccess: false,
          isError: true,
        },
      });
    }
  },

  /**
   * Fetch options chain for a symbol
   */
  fetchOptionsChain: async (symbol, expiryDate) => {
    set((state) => ({
      optionsChain: {
        ...state.optionsChain,
        status: 'pending',
        isLoading: true,
        isError: false,
        error: null,
      },
    }));

    try {
      const response = await marketDataService.getOptionsChain({
        symbol,
        expiryDate,
        includeGreeks: true,
      });

      set({
        optionsChain: {
          status: 'success',
          data: response.data,
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      });
    } catch (error) {
      set({
        optionsChain: {
          status: 'error',
          data: null,
          error: error as ApiError,
          timestamp: new Date(),
          isLoading: false,
          isSuccess: false,
          isError: true,
        },
      });
    }
  },

  /**
   * Fetch expiry dates for a symbol
   */
  fetchExpiryDates: async (symbol) => {
    set((state) => ({
      expiryDates: {
        ...state.expiryDates,
        status: 'pending',
        isLoading: true,
        isError: false,
        error: null,
      },
    }));

    try {
      const response = await marketDataService.getExpiryDates({
        symbol,
        includeWeeklies: true,
        includeMonthlies: true,
      });

      set({
        expiryDates: {
          status: 'success',
          data: response.data,
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      });
    } catch (error) {
      set({
        expiryDates: {
          status: 'error',
          data: null,
          error: error as ApiError,
          timestamp: new Date(),
          isLoading: false,
          isSuccess: false,
          isError: true,
        },
      });
    }
  },

  /**
   * Fetch volatility data for a symbol
   */
  fetchVolatility: async (symbol, period = 30) => {
    set((state) => ({
      volatility: {
        ...state.volatility,
        status: 'pending',
        isLoading: true,
        isError: false,
        error: null,
      },
    }));

    try {
      const response = await marketDataService.getVolatility({
        symbol,
        period,
      });

      set({
        volatility: {
          status: 'success',
          data: response.data,
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      });
    } catch (error) {
      set({
        volatility: {
          status: 'error',
          data: null,
          error: error as ApiError,
          timestamp: new Date(),
          isLoading: false,
          isSuccess: false,
          isError: true,
        },
      });
    }
  },

  /**
   * Set selected expiry date
   */
  setSelectedExpiryDate: (date) => {
    set({ selectedExpiryDate: date });

    // If a symbol is selected, fetch the options chain for that expiry
    const { currentSymbol } = get();
    if (currentSymbol && date) {
      get().fetchOptionsChain(currentSymbol, date);
    }
  },

  /**
   * Clear all market data
   */
  clearMarketData: () => {
    set(initialState);
  },
}));
