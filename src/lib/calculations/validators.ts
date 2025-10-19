/**
 * Input Validation Functions
 * Comprehensive validation for all calculator inputs
 */

import {
  CalculationInputs,
  ValidationResult,
  ValidationError,
  OptionLeg,
  OptionType,
  Position,
  ErrorCode
} from '../types';
import { CalculationError } from '../types/errors';

/**
 * Validate complete calculation inputs
 * Checks all inputs required for P/L calculations
 *
 * @param inputs - Calculation inputs to validate
 * @returns Validation result with any errors found
 *
 * @example
 * const inputs = { currentStockPrice: 100, legs: [...], ... };
 * const result = validateInputs(inputs);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */
export function validateInputs(inputs: CalculationInputs): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate stock price
  if (!inputs.currentStockPrice || inputs.currentStockPrice <= 0) {
    errors.push({
      field: 'currentStockPrice',
      message: 'Stock price must be greater than 0',
    });
  }

  if (inputs.currentStockPrice && inputs.currentStockPrice > 1000000) {
    errors.push({
      field: 'currentStockPrice',
      message: 'Stock price seems unreasonably high (> $1,000,000)',
    });
  }

  // Validate legs
  if (!inputs.legs || !Array.isArray(inputs.legs)) {
    errors.push({
      field: 'legs',
      message: 'Legs must be an array',
    });
  } else if (inputs.legs.length === 0) {
    errors.push({
      field: 'legs',
      message: 'At least one option leg is required',
    });
  } else if (inputs.legs.length > 8) {
    errors.push({
      field: 'legs',
      message: 'Maximum 8 option legs supported',
    });
  } else {
    // Validate each leg
    inputs.legs.forEach((leg, index) => {
      const legErrors = validateLeg(leg, index);
      errors.push(...legErrors);
    });
  }

  // Validate optional volatility
  if (inputs.volatility !== undefined) {
    if (inputs.volatility < 0) {
      errors.push({
        field: 'volatility',
        message: 'Volatility cannot be negative',
      });
    }
    if (inputs.volatility > 5) {
      errors.push({
        field: 'volatility',
        message: 'Volatility seems unreasonably high (> 500%)',
      });
    }
  }

  // Validate optional risk-free rate
  if (inputs.riskFreeRate !== undefined) {
    if (Math.abs(inputs.riskFreeRate) > 1) {
      errors.push({
        field: 'riskFreeRate',
        message: 'Risk-free rate seems unreasonable (> 100% or < -100%)',
      });
    }
  }

  // Validate optional price range
  if (inputs.priceRange !== undefined) {
    if (inputs.priceRange <= 0 || inputs.priceRange > 10) {
      errors.push({
        field: 'priceRange',
        message: 'Price range must be between 0 and 10 (0-1000%)',
      });
    }
  }

  // Validate optional chart points
  if (inputs.chartPoints !== undefined) {
    if (inputs.chartPoints < 10 || inputs.chartPoints > 1000) {
      errors.push({
        field: 'chartPoints',
        message: 'Chart points must be between 10 and 1000',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a single option leg
 *
 * @param leg - Option leg to validate
 * @param index - Index of leg in array (for error messages)
 * @returns Array of validation errors
 */
export function validateLeg(leg: OptionLeg, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = `leg[${index}]`;

  // Validate ID
  if (!leg.id || typeof leg.id !== 'string') {
    errors.push({
      field: `${prefix}.id`,
      message: 'Leg ID is required and must be a string',
    });
  }

  // Validate option type
  if (!leg.optionType || !Object.values(OptionType).includes(leg.optionType)) {
    errors.push({
      field: `${prefix}.optionType`,
      message: 'Option type must be "call" or "put"',
    });
  }

  // Validate position
  if (!leg.position || !Object.values(Position).includes(leg.position)) {
    errors.push({
      field: `${prefix}.position`,
      message: 'Position must be "long" or "short"',
    });
  }

  // Validate strike price
  if (!leg.strikePrice || leg.strikePrice <= 0) {
    errors.push({
      field: `${prefix}.strikePrice`,
      message: 'Strike price must be greater than 0',
    });
  }

  if (leg.strikePrice && leg.strikePrice > 1000000) {
    errors.push({
      field: `${prefix}.strikePrice`,
      message: 'Strike price seems unreasonably high (> $1,000,000)',
    });
  }

  // Validate premium
  if (leg.premium === undefined || leg.premium === null || leg.premium < 0) {
    errors.push({
      field: `${prefix}.premium`,
      message: 'Premium must be 0 or greater',
    });
  }

  if (leg.premium && leg.premium > leg.strikePrice) {
    errors.push({
      field: `${prefix}.premium`,
      message: 'Premium seems unreasonably high (greater than strike price)',
    });
  }

  // Validate quantity
  if (!leg.quantity || leg.quantity < 1 || !Number.isInteger(leg.quantity)) {
    errors.push({
      field: `${prefix}.quantity`,
      message: 'Quantity must be a positive integer',
    });
  }

  if (leg.quantity && leg.quantity > 1000) {
    errors.push({
      field: `${prefix}.quantity`,
      message: 'Quantity seems unreasonably high (> 1000 contracts)',
    });
  }

  // Validate expiry date
  if (!leg.expiryDate || !(leg.expiryDate instanceof Date)) {
    errors.push({
      field: `${prefix}.expiryDate`,
      message: 'Expiration date is required and must be a Date object',
    });
  } else {
    const now = new Date();
    const expiry = new Date(leg.expiryDate);

    if (isNaN(expiry.getTime())) {
      errors.push({
        field: `${prefix}.expiryDate`,
        message: 'Invalid expiration date',
      });
    } else if (expiry <= now) {
      errors.push({
        field: `${prefix}.expiryDate`,
        message: 'Expiration date must be in the future',
      });
    } else {
      // Check if expiry is too far in the future (> 10 years)
      const tenYears = 10 * 365.25 * 24 * 60 * 60 * 1000;
      if (expiry.getTime() - now.getTime() > tenYears) {
        errors.push({
          field: `${prefix}.expiryDate`,
          message: 'Expiration date seems unreasonably far in the future (> 10 years)',
        });
      }
    }
  }

  return errors;
}

/**
 * Validate that a date is in the future
 *
 * @param date - Date to validate
 * @returns True if date is in the future
 */
export function isValidExpiryDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Sanitize numeric input
 * Converts to number and clamps to valid range
 *
 * @param value - Value to sanitize
 * @param min - Minimum allowed value (optional)
 * @param max - Maximum allowed value (optional)
 * @returns Sanitized number
 *
 * @throws {CalculationError} If value cannot be converted to a number
 *
 * @example
 * sanitizeNumber('100', 0, 1000); // returns 100
 * sanitizeNumber('-10', 0, 1000); // returns 0 (clamped to min)
 * sanitizeNumber('abc', 0, 1000); // throws CalculationError
 */
export function sanitizeNumber(
  value: unknown,
  min?: number,
  max?: number
): number {
  const num = Number(value);

  if (isNaN(num)) {
    throw new CalculationError(
      'Invalid number input',
      ErrorCode.INVALID_INPUT,
      { value, min, max }
    );
  }

  if (!isFinite(num)) {
    throw new CalculationError(
      'Number must be finite',
      ErrorCode.INVALID_INPUT,
      { value, min, max }
    );
  }

  // Apply min/max constraints
  if (min !== undefined && num < min) {
    return min;
  }

  if (max !== undefined && num > max) {
    return max;
  }

  return num;
}

/**
 * Sanitize date input
 * Converts various date formats to Date object
 *
 * @param value - Date value (string, Date, or number timestamp)
 * @returns Date object
 *
 * @throws {CalculationError} If value cannot be converted to a valid date
 *
 * @example
 * sanitizeDate('2025-12-31'); // returns Date object
 * sanitizeDate(new Date()); // returns same Date object
 * sanitizeDate(1735689600000); // returns Date from timestamp
 */
export function sanitizeDate(value: unknown): Date {
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    date = new Date(value);
  } else {
    throw new CalculationError(
      'Invalid date input',
      ErrorCode.INVALID_INPUT,
      { value }
    );
  }

  if (isNaN(date.getTime())) {
    throw new CalculationError(
      'Date is invalid or could not be parsed',
      ErrorCode.INVALID_DATE,
      { value }
    );
  }

  return date;
}

/**
 * Validate strategy for internal consistency
 * Checks for logical issues that might cause problems
 *
 * @param legs - Array of option legs
 * @returns Validation result with warnings (not errors)
 */
export function validateStrategyConsistency(legs: OptionLeg[]): ValidationResult {
  const errors: ValidationError[] = [];

  if (legs.length === 0) {
    return { isValid: true, errors: [] };
  }

  // Check for duplicate leg IDs
  const ids = legs.map((leg) => leg.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push({
      field: 'legs',
      message: 'Duplicate leg IDs detected',
    });
  }

  // Check for mixed expiry dates (warning)
  const expiryDates = legs.map((leg) => leg.expiryDate.getTime());
  const uniqueDates = new Set(expiryDates);
  if (uniqueDates.size > 1) {
    errors.push({
      field: 'legs',
      message: 'Warning: Legs have different expiration dates (calendar/diagonal spread)',
    });
  }

  // Check for very similar strikes (might be a mistake)
  const strikes = legs.map((leg) => leg.strikePrice).sort((a, b) => a - b);
  for (let i = 0; i < strikes.length - 1; i++) {
    const diff = Math.abs(strikes[i + 1] - strikes[i]);
    const avgStrike = (strikes[i] + strikes[i + 1]) / 2;
    if (diff < avgStrike * 0.01) {
      // Less than 1% difference
      errors.push({
        field: 'legs',
        message: `Warning: Very similar strike prices detected ($${strikes[i].toFixed(2)} and $${strikes[i + 1].toFixed(2)})`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Assert that inputs are valid
 * Throws error if validation fails
 *
 * @param inputs - Calculation inputs to validate
 * @throws {CalculationError} If validation fails
 *
 * @example
 * try {
 *   assertValidInputs(inputs);
 *   // Proceed with calculations
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export function assertValidInputs(inputs: CalculationInputs): void {
  const result = validateInputs(inputs);

  if (!result.isValid) {
    const errorMessages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
    throw new CalculationError(
      `Invalid inputs: ${errorMessages}`,
      ErrorCode.INVALID_INPUT,
      { errors: result.errors }
    );
  }
}

/**
 * Create a validation error
 * Helper function for consistent error creation
 *
 * @param field - Field name
 * @param message - Error message
 * @returns ValidationError object
 */
export function createError(field: string, message: string): ValidationError {
  return { field, message };
}

/**
 * Combine multiple validation results
 *
 * @param results - Array of validation results
 * @returns Combined validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap((r) => r.errors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
