/**
 * API Client Service
 * Handles HTTP requests with timeout, retry logic, and request management
 * Similar to the ajaxRequest/ajaxCall pattern from the downloadsite example
 */

import type {
  ApiConfig,
  ApiResponse,
  ApiError,
  RequestStatus,
} from '../types/market-data';

// ============================================================================
// REQUEST MANAGEMENT
// ============================================================================

interface PendingRequest {
  id: string;
  command: string;
  description: string;
  params: Record<string, any>;
  timestamp: number;
  status: RequestStatus;
  controller: AbortController;
  timeoutId: NodeJS.Timeout | null;
}

class RequestManager {
  private requests = new Map<string, PendingRequest>();
  private requestCounter = 0;

  /**
   * Check if a duplicate request is already in progress
   */
  hasDuplicateInProgress(
    command: string,
    params: Record<string, any>
  ): boolean {
    const paramsStr = this.serializeParams(params);

    for (const request of this.requests.values()) {
      if (
        request.status === 'pending' &&
        request.command === command &&
        this.serializeParams(request.params) === paramsStr &&
        Date.now() - request.timestamp < 1000 // Within 1 second
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Register a new request
   */
  registerRequest(
    command: string,
    description: string,
    params: Record<string, any>,
    controller: AbortController
  ): string {
    const id = `req_${++this.requestCounter}`;

    this.requests.set(id, {
      id,
      command,
      description,
      params,
      timestamp: Date.now(),
      status: 'pending',
      controller,
      timeoutId: null,
    });

    return id;
  }

  /**
   * Update request status
   */
  updateStatus(id: string, status: RequestStatus): void {
    const request = this.requests.get(id);
    if (request) {
      request.status = status;
    }
  }

  /**
   * Cancel a request
   */
  cancelRequest(id: string): void {
    const request = this.requests.get(id);
    if (request) {
      request.controller.abort();
      if (request.timeoutId) {
        clearTimeout(request.timeoutId);
      }
      this.requests.delete(id);
    }
  }

  /**
   * Clean up completed requests
   */
  cleanup(maxAge: number = 60000): void {
    const now = Date.now();
    for (const [id, request] of this.requests.entries()) {
      if (
        request.status !== 'pending' &&
        now - request.timestamp > maxAge
      ) {
        this.requests.delete(id);
      }
    }
  }

  /**
   * Get request by ID
   */
  getRequest(id: string): PendingRequest | undefined {
    return this.requests.get(id);
  }

  /**
   * Serialize params for comparison
   */
  private serializeParams(params: Record<string, any>): string {
    return JSON.stringify(
      Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    );
  }
}

// ============================================================================
// API CLIENT
// ============================================================================

export class ApiClient {
  private config: ApiConfig;
  private requestManager: RequestManager;
  private cache = new Map<string, { data: any; timestamp: number }>();

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api',
      timeout: config.timeout || 15000,
      retryAttempts: config.retryAttempts || 2,
      retryDelay: config.retryDelay || 1000,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheDuration: config.cacheDuration || 30000,
    };

    this.requestManager = new RequestManager();

    // Cleanup old requests and cache periodically
    setInterval(() => {
      this.requestManager.cleanup();
      this.cleanupCache();
    }, 60000);
  }

  /**
   * Make an API request
   * Similar to ajaxRequest from the example
   */
  async request<T>(
    command: string,
    params: Record<string, any> = {},
    options: {
      description?: string;
      skipCache?: boolean;
      skipDuplicateCheck?: boolean;
      timeout?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      description = command,
      skipCache = false,
      skipDuplicateCheck = false,
      timeout = this.config.timeout,
    } = options;

    // Check for duplicate in-progress requests
    if (!skipDuplicateCheck && this.requestManager.hasDuplicateInProgress(command, params)) {
      console.log(`[API] Skipping duplicate request: ${description}`);
      throw this.createError('DUPLICATE_REQUEST', 'A similar request is already in progress');
    }

    // Check cache
    if (!skipCache && this.config.cacheEnabled) {
      const cached = this.getFromCache<T>(command, params);
      if (cached) {
        console.log(`[API] Cache hit for: ${description}`);
        return cached;
      }
    }

    // Create abort controller for cancellation
    const controller = new AbortController();

    // Register request
    const requestId = this.requestManager.registerRequest(
      command,
      description,
      params,
      controller
    );

    try {
      // Make the request with retries
      const data = await this.makeRequestWithRetry<T>(
        command,
        params,
        controller.signal,
        timeout
      );

      // Update status
      this.requestManager.updateStatus(requestId, 'success');

      // Build response
      const response: ApiResponse<T> = {
        data,
        status: 'success',
        timestamp: new Date(),
        cached: false,
      };

      // Cache the response
      if (this.config.cacheEnabled) {
        this.saveToCache(command, params, response);
      }

      return response;
    } catch (error) {
      this.requestManager.updateStatus(requestId, 'error');

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createError('REQUEST_CANCELLED', 'Request was cancelled');
      }

      throw error;
    }
  }

  /**
   * Make request with retry logic
   */
  private async makeRequestWithRetry<T>(
    command: string,
    params: Record<string, any>,
    signal: AbortSignal,
    timeout: number,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await this.makeRequest<T>(command, params, signal, timeout);
    } catch (error) {
      // Retry on network errors if we have attempts left
      if (
        attempt < this.config.retryAttempts &&
        this.isRetryableError(error)
      ) {
        console.log(`[API] Retrying request (attempt ${attempt + 1}/${this.config.retryAttempts})`);

        // Wait before retrying
        await this.delay(this.config.retryDelay * (attempt + 1));

        return this.makeRequestWithRetry<T>(
          command,
          params,
          signal,
          timeout,
          attempt + 1
        );
      }

      throw error;
    }
  }

  /**
   * Make the actual HTTP request
   * Similar to ajaxCall using $.getJSON
   */
  private async makeRequest<T>(
    command: string,
    params: Record<string, any>,
    signal: AbortSignal,
    timeout: number
  ): Promise<T> {
    const url = this.buildUrl(command, params);

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(this.createError('TIMEOUT', `Request timeout after ${timeout}ms`));
      }, timeout);

      // Clear timeout if request is aborted
      signal.addEventListener('abort', () => clearTimeout(timeoutId));
    });

    // Make fetch request
    const fetchPromise = fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createError(
          'HTTP_ERROR',
          `HTTP ${response.status}: ${response.statusText}`,
          errorData
        );
      }
      return response.json();
    });

    // Race between fetch and timeout
    return Promise.race([fetchPromise, timeoutPromise]);
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(command: string, params: Record<string, any>): string {
    const url = new URL(`${this.config.baseUrl}/${command}`, window.location.origin);

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Retry on network errors
      return (
        error.name === 'TypeError' ||
        error.message.includes('fetch') ||
        error.message.includes('network')
      );
    }
    return false;
  }

  /**
   * Create standardized error
   */
  private createError(code: string, message: string, details?: any): ApiError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Get from cache
   */
  private getFromCache<T>(
    command: string,
    params: Record<string, any>
  ): ApiResponse<T> | null {
    const key = this.getCacheKey(command, params);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    const age = Date.now() - cached.timestamp;
    if (age > this.config.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    // Return cached response
    return {
      ...cached.data,
      cached: true,
      cacheAge: age,
    };
  }

  /**
   * Save to cache
   */
  private saveToCache<T>(
    command: string,
    params: Record<string, any>,
    response: ApiResponse<T>
  ): void {
    const key = this.getCacheKey(command, params);
    this.cache.set(key, {
      data: response,
      timestamp: Date.now(),
    });
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cacheDuration) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(command: string, params: Record<string, any>): string {
    return `${command}:${JSON.stringify(params)}`;
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClient();
