/**
 * Options Profit Calculator - Main Library Export
 * Complete calculation engine for options pricing and analysis
 */

// Re-export all types
export * from './types';
export * from './types/errors';

// Re-export all calculations
export * from './calculations';

// Re-export utilities
export * from './utils/formatters';
export * from './utils/time';

// Re-export constants
export * from './constants/defaults';
export * from './constants/strategies';

// Version
export const VERSION = '1.0.0';
