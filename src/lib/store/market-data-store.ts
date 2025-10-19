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
    console.log('[STORE] fetchStockQuote called with symbol:', symbol);

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
      console.log('[STORE] Calling marketDataService.getStockPrice...');
      const response = await marketDataService.getStockPrice({ symbol });

      console.log('[STORE] API Response received:');
      console.log('  - Full response:', response);
      console.log('  - response.data:', response.data);
      console.log('  - response.data TYPE:', typeof response.data);
      console.log('  - response.data KEYS:', response.data ? Object.keys(response.data) : 'null');
      console.log('  - response.status:', response.status);
      console.log('  - response.timestamp:', response.timestamp);

      if (response.data && typeof response.data === 'object') {
        console.log('  - response.data.price:', (response.data as any).price);
        console.log('  - response.data.symbol:', (response.data as any).symbol);
        console.log('  - response.data.data:', (response.data as any).data);

        // Check if it's double-nested
        if ((response.data as any).data) {
          console.log('  - DOUBLE NESTED! response.data.data.price:', (response.data as any).data.price);
          console.log('  - DOUBLE NESTED! response.data.data.symbol:', (response.data as any).data.symbol);
        }
      }

      // Handle double-nested response structure from backend
      // Backend returns: { data: { data: { price, symbol, ... } } }
      // We need to extract the inner data object
      const actualData = (response.data as any).data || response.data;

      console.log('[STORE] Extracted actual data:', actualData);
      console.log('[STORE] Actual data has price?', actualData?.price);

      set({
        stockQuote: {
          status: 'success',
          data: actualData,  // Use the inner data object
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      });

      console.log('[STORE] Stock quote state updated successfully');
    } catch (error) {
      console.error('[STORE] Error in fetchStockQuote:');
      console.error('  - Error:', error);
      console.error('  - Error type:', typeof error);
      console.error('  - Error message:', error instanceof Error ? error.message : 'Unknown');

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

      console.log('[STORE] Stock quote state updated with error');
      throw error; // Re-throw to let handleGetPrice catch it
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
