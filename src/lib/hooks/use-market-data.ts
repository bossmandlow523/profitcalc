/**
 * React Hooks for Market Data
 * Custom hooks for fetching stock prices, options chains, and expiry dates
 */

import { useState, useEffect, useCallback } from 'react';
import { marketDataService } from '../services/market-data-service';
import type {
  StockQuote,
  OptionsChain,
  ExpiryDatesResponse,
  VolatilityData,
  StockPriceRequest,
  OptionsChainRequest,
  ExpiryDatesRequest,
  VolatilityRequest,
  RequestState,
  RequestStatus,
  ApiError,
} from '../types/market-data';

/**
 * Create initial request state
 */
function createInitialState<T>(): RequestState<T> {
  return {
    status: 'idle' as RequestStatus,
    data: null,
    error: null,
    timestamp: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  };
}

/**
 * Hook for fetching stock price
 *
 * @example
 * const { data, isLoading, error, refetch } = useStockPrice({ symbol: 'AAPL' });
 */
export function useStockPrice(request: StockPriceRequest | null, autoFetch = true) {
  const [state, setState] = useState<RequestState<StockQuote>>(createInitialState());

  const fetch = useCallback(async () => {
    if (!request) return;

    setState((prev) => ({
      ...prev,
      status: 'pending',
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const response = await marketDataService.getStockPrice(request);

      setState({
        status: 'success',
        data: response.data,
        error: null,
        timestamp: response.timestamp,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error as ApiError,
        timestamp: new Date(),
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [request?.symbol, request?.includeExtendedHours]);

  useEffect(() => {
    if (autoFetch && request) {
      fetch();
    }
  }, [autoFetch, request, fetch]);

  return {
    ...state,
    refetch: fetch,
  };
}

/**
 * Hook for fetching options chain
 *
 * @example
 * const { data, isLoading, error, refetch } = useOptionsChain({
 *   symbol: 'AAPL',
 *   includeGreeks: true
 * });
 */
export function useOptionsChain(request: OptionsChainRequest | null, autoFetch = true) {
  const [state, setState] = useState<RequestState<OptionsChain>>(createInitialState());

  const fetch = useCallback(async () => {
    if (!request) return;

    setState((prev) => ({
      ...prev,
      status: 'pending',
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const response = await marketDataService.getOptionsChain(request);

      setState({
        status: 'success',
        data: response.data,
        error: null,
        timestamp: response.timestamp,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error as ApiError,
        timestamp: new Date(),
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [
    request?.symbol,
    request?.expiryDate,
    request?.minStrike,
    request?.maxStrike,
    request?.includeGreeks,
  ]);

  useEffect(() => {
    if (autoFetch && request) {
      fetch();
    }
  }, [autoFetch, request, fetch]);

  return {
    ...state,
    refetch: fetch,
  };
}

/**
 * Hook for fetching expiry dates
 *
 * @example
 * const { data, isLoading, error } = useExpiryDates({
 *   symbol: 'AAPL',
 *   includeWeeklies: true,
 *   includeMonthlies: true
 * });
 */
export function useExpiryDates(request: ExpiryDatesRequest | null, autoFetch = true) {
  const [state, setState] = useState<RequestState<ExpiryDatesResponse>>(
    createInitialState()
  );

  const fetch = useCallback(async () => {
    if (!request) return;

    setState((prev) => ({
      ...prev,
      status: 'pending',
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const response = await marketDataService.getExpiryDates(request);

      setState({
        status: 'success',
        data: response.data,
        error: null,
        timestamp: response.timestamp,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error as ApiError,
        timestamp: new Date(),
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [
    request?.symbol,
    request?.includeWeeklies,
    request?.includeMonthlies,
    request?.includeQuarterlies,
    request?.includeLeaps,
    request?.minDaysOut,
    request?.maxDaysOut,
  ]);

  useEffect(() => {
    if (autoFetch && request) {
      fetch();
    }
  }, [autoFetch, request, fetch]);

  return {
    ...state,
    refetch: fetch,
  };
}

/**
 * Hook for fetching volatility data
 *
 * @example
 * const { data, isLoading } = useVolatility({ symbol: 'AAPL', period: 30 });
 */
export function useVolatility(request: VolatilityRequest | null, autoFetch = true) {
  const [state, setState] = useState<RequestState<VolatilityData>>(createInitialState());

  const fetch = useCallback(async () => {
    if (!request) return;

    setState((prev) => ({
      ...prev,
      status: 'pending',
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const response = await marketDataService.getVolatility(request);

      setState({
        status: 'success',
        data: response.data,
        error: null,
        timestamp: response.timestamp,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error as ApiError,
        timestamp: new Date(),
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
    }
  }, [request?.symbol, request?.period]);

  useEffect(() => {
    if (autoFetch && request) {
      fetch();
    }
  }, [autoFetch, request, fetch]);

  return {
    ...state,
    refetch: fetch,
  };
}

/**
 * Hook for symbol search with debouncing
 *
 * @example
 * const { results, isLoading, search } = useSymbolSearch();
 *
 * // In your component:
 * <input onChange={(e) => search(e.target.value)} />
 */
export function useSymbolSearch(debounceMs = 300) {
  const [state, setState] = useState<RequestState<{ symbol: string; name: string }[]>>(
    createInitialState()
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query || query.length < 2) {
      setState(createInitialState());
      return;
    }

    const timeoutId = setTimeout(async () => {
      setState((prev) => ({
        ...prev,
        status: 'pending',
        isLoading: true,
      }));

      try {
        const response = await marketDataService.searchSymbols(query);

        setState({
          status: 'success',
          data: response.data,
          error: null,
          timestamp: response.timestamp,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error as ApiError,
          timestamp: new Date(),
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return {
    ...state,
    results: state.data,
    search: setQuery,
  };
}
