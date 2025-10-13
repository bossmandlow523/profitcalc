/**
 * Time and Date Utilities
 * Helper functions for date and time calculations
 */

import { DateRange } from '../types';
import { DAYS_PER_YEAR } from '../constants/defaults';

/**
 * Calculate date range information
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns DateRange object with calculated values
 *
 * @example
 * const range = calculateDateRange(new Date(), new Date('2025-12-31'));
 * console.log(range.daysUntilExpiry); // 80 (example)
 * console.log(range.yearsUntilExpiry); // 0.22 (example)
 */
export function calculateDateRange(startDate: Date, endDate: Date): DateRange {
  const msPerDay = 24 * 60 * 60 * 1000;
  const ms = endDate.getTime() - startDate.getTime();

  const days = Math.ceil(ms / msPerDay);
  const years = ms / (DAYS_PER_YEAR * msPerDay);

  return {
    startDate,
    endDate,
    daysUntilExpiry: Math.max(0, days),
    yearsUntilExpiry: Math.max(0, years),
  };
}

/**
 * Add days to a date
 *
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 *
 * @example
 * addDays(new Date('2025-01-01'), 30); // returns Date for 2025-01-31
 * addDays(new Date('2025-01-31'), -10); // returns Date for 2025-01-21
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 *
 * @param date - Starting date
 * @param months - Number of months to add (can be negative)
 * @returns New date
 *
 * @example
 * addMonths(new Date('2025-01-31'), 1); // returns Date for 2025-02-28
 * addMonths(new Date('2025-06-15'), 3); // returns Date for 2025-09-15
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to a date
 *
 * @param date - Starting date
 * @param years - Number of years to add (can be negative)
 * @returns New date
 *
 * @example
 * addYears(new Date('2025-01-01'), 1); // returns Date for 2026-01-01
 * addYears(new Date('2025-12-31'), -1); // returns Date for 2024-12-31
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get the difference in days between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days (can be negative if date1 > date2)
 *
 * @example
 * getDaysDifference(new Date('2025-01-01'), new Date('2025-01-31')); // returns 30
 * getDaysDifference(new Date('2025-01-31'), new Date('2025-01-01')); // returns -30
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const ms = date2.getTime() - date1.getTime();
  return Math.floor(ms / msPerDay);
}

/**
 * Get the difference in years between two dates (decimal)
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of years (decimal)
 *
 * @example
 * getYearsDifference(new Date('2024-01-01'), new Date('2025-01-01')); // returns 1.0
 * getYearsDifference(new Date('2024-01-01'), new Date('2024-07-01')); // returns ~0.5
 */
export function getYearsDifference(date1: Date, date2: Date): number {
  const msPerYear = DAYS_PER_YEAR * 24 * 60 * 60 * 1000;
  const ms = date2.getTime() - date1.getTime();
  return ms / msPerYear;
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 *
 * @param date - Date to check
 * @returns True if weekend
 *
 * @example
 * isWeekend(new Date('2025-01-04')); // returns true (Saturday)
 * isWeekend(new Date('2025-01-06')); // returns false (Monday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a weekday (Monday-Friday)
 *
 * @param date - Date to check
 * @returns True if weekday
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Get next weekday (skips weekends)
 *
 * @param date - Starting date
 * @returns Next weekday
 *
 * @example
 * getNextWeekday(new Date('2025-01-03')); // Friday -> returns Monday
 * getNextWeekday(new Date('2025-01-02')); // Thursday -> returns Friday
 */
export function getNextWeekday(date: Date): Date {
  let result = addDays(date, 1);

  while (isWeekend(result)) {
    result = addDays(result, 1);
  }

  return result;
}

/**
 * Get next option expiry date (3rd Friday of the month)
 * Standard monthly options expire on the 3rd Friday
 *
 * @param fromDate - Starting date (default: today)
 * @returns Next expiry date
 *
 * @example
 * getNextExpiryDate(new Date('2025-01-10')); // returns 2025-01-17 (3rd Friday of January)
 */
export function getNextExpiryDate(fromDate: Date = new Date()): Date {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();

  // Get the 3rd Friday of the current month
  let expiryDate = getThirdFriday(year, month);

  // If we've passed it, get next month's
  if (expiryDate <= fromDate) {
    expiryDate = getThirdFriday(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1
    );
  }

  return expiryDate;
}

/**
 * Get the 3rd Friday of a given month
 *
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Date of 3rd Friday
 *
 * @example
 * getThirdFriday(2025, 0); // returns 2025-01-17
 */
export function getThirdFriday(year: number, month: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();

  // Calculate days until first Friday
  const daysUntilFirstFriday = firstDayOfWeek === 5 ? 0 : (5 - firstDayOfWeek + 7) % 7;

  // Add 14 days to get to third Friday
  const thirdFridayDate = 1 + daysUntilFirstFriday + 14;

  return new Date(year, month, thirdFridayDate);
}

/**
 * Get all monthly expiry dates for a given year
 *
 * @param year - Year
 * @returns Array of expiry dates (3rd Friday of each month)
 *
 * @example
 * getYearlyExpiryDates(2025); // returns array of 12 dates
 */
export function getYearlyExpiryDates(year: number): Date[] {
  const dates: Date[] = [];

  for (let month = 0; month < 12; month++) {
    dates.push(getThirdFriday(year, month));
  }

  return dates;
}

/**
 * Check if a date is a standard monthly expiry (3rd Friday)
 *
 * @param date - Date to check
 * @returns True if it's a monthly expiry
 *
 * @example
 * isMonthlyExpiry(new Date('2025-01-17')); // returns true
 * isMonthlyExpiry(new Date('2025-01-20')); // returns false
 */
export function isMonthlyExpiry(date: Date): boolean {
  const thirdFriday = getThirdFriday(date.getFullYear(), date.getMonth());
  return (
    date.getDate() === thirdFriday.getDate() &&
    date.getMonth() === thirdFriday.getMonth() &&
    date.getFullYear() === thirdFriday.getFullYear()
  );
}

/**
 * Parse ISO date string to Date object
 *
 * @param isoString - ISO 8601 date string (YYYY-MM-DD)
 * @returns Date object
 *
 * @example
 * parseISODate('2025-12-31'); // returns Date object
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 *
 * @param date - Date to format
 * @returns ISO date string
 *
 * @example
 * toISODateString(new Date('2025-12-31')); // returns '2025-12-31'
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Get start of day (midnight)
 *
 * @param date - Date
 * @returns Date set to 00:00:00.000
 *
 * @example
 * startOfDay(new Date('2025-01-15 14:30:00')); // returns 2025-01-15 00:00:00
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day (23:59:59.999)
 *
 * @param date - Date
 * @returns Date set to 23:59:59.999
 *
 * @example
 * endOfDay(new Date('2025-01-15 14:30:00')); // returns 2025-01-15 23:59:59.999
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if two dates are on the same day
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 *
 * @example
 * isSameDay(new Date('2025-01-15 10:00'), new Date('2025-01-15 20:00')); // returns true
 * isSameDay(new Date('2025-01-15'), new Date('2025-01-16')); // returns false
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns True if today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the past
 *
 * @param date - Date to check
 * @returns True if in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if a date is in the future
 *
 * @param date - Date to check
 * @returns True if in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}
