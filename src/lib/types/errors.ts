/**
 * Custom Error Classes for Options Calculator
 */

import { ErrorCode } from './index';

/**
 * Custom error for calculation failures
 */
export class CalculationError extends Error {
  code: ErrorCode;
  context?: Record<string, unknown>;

  constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
    super(message);
    this.name = 'CalculationError';
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (typeof Error.captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, CalculationError);
    }
  }
}

/**
 * Helper function to create validation errors
 */
export function createValidationError(field: string, message: string): CalculationError {
  return new CalculationError(
    `Validation failed for ${field}: ${message}`,
    ErrorCode.INVALID_INPUT,
    { field }
  );
}

/**
 * Helper function to create calculation errors
 */
export function createCalculationError(message: string, context?: Record<string, unknown>): CalculationError {
  return new CalculationError(message, ErrorCode.CALCULATION_FAILED, context);
}

/**
 * Helper function to check for division by zero
 */
export function checkDivisionByZero(denominator: number, context?: Record<string, unknown>): void {
  if (denominator === 0) {
    throw new CalculationError(
      'Division by zero detected in calculation',
      ErrorCode.DIVISION_BY_ZERO,
      context
    );
  }
}

/**
 * Helper function to validate date is in the future
 */
export function validateFutureDate(date: Date, fieldName: string = 'expiryDate'): void {
  const now = new Date();
  if (date <= now) {
    throw new CalculationError(
      `${fieldName} must be in the future`,
      ErrorCode.EXPIRED_OPTION,
      { date: date.toISOString(), now: now.toISOString() }
    );
  }
}
