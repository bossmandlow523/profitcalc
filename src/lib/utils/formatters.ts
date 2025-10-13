/**
 * Formatting Utilities
 * Functions for formatting numbers, currency, percentages, and dates
 */

/**
 * Format number as currency
 *
 * @param value - Dollar amount
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56); // returns "$1,234.56"
 * formatCurrency(-1234.56); // returns "-$1,234.56"
 * formatCurrency(1234.56, { showCents: false }); // returns "$1,235"
 * formatCurrency(1234.56, { compact: true }); // returns "$1.23K"
 */
export function formatCurrency(
  value: number,
  options: {
    showCents?: boolean;
    showSign?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    showCents = true,
    showSign = false,
    compact = false,
  } = options;

  // Handle compact notation for large numbers
  if (compact && Math.abs(value) >= 1000) {
    return formatCompactCurrency(value);
  }

  const sign = value < 0 ? '-' : showSign && value > 0 ? '+' : '';
  const absValue = Math.abs(value);

  if (showCents) {
    const formatted = absValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${sign}$${formatted}`;
  } else {
    const formatted = Math.round(absValue)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${sign}$${formatted}`;
  }
}

/**
 * Format currency in compact notation (K, M, B)
 *
 * @param value - Dollar amount
 * @returns Compact formatted string
 *
 * @example
 * formatCompactCurrency(1234); // returns "$1.23K"
 * formatCompactCurrency(1234567); // returns "$1.23M"
 * formatCompactCurrency(-1234567890); // returns "-$1.23B"
 */
export function formatCompactCurrency(value: number): string {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
  } else {
    return formatCurrency(value);
  }
}

/**
 * Format number as percentage
 *
 * @param value - Decimal value (0.25 = 25%)
 * @param decimals - Number of decimal places (default 2)
 * @param showSign - Show + for positive values (default false)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(0.2534); // returns "25.34%"
 * formatPercentage(0.2534, 1); // returns "25.3%"
 * formatPercentage(0.2534, 2, true); // returns "+25.34%"
 * formatPercentage(-0.1523); // returns "-15.23%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  showSign: boolean = false
): string {
  const percentage = value * 100;
  const sign = percentage < 0 ? '' : showSign && percentage > 0 ? '+' : '';

  return `${sign}${percentage.toFixed(decimals)}%`;
}

/**
 * Format profit/loss with color indication
 *
 * @param value - P/L value
 * @param options - Formatting options
 * @returns Object with formatted string and color
 *
 * @example
 * formatProfitLoss(1234.56); // returns { text: "+$1,234.56", color: "green" }
 * formatProfitLoss(-1234.56); // returns { text: "-$1,234.56", color: "red" }
 * formatProfitLoss(0); // returns { text: "$0.00", color: "neutral" }
 */
export function formatProfitLoss(
  value: number,
  options: {
    showCents?: boolean;
    compact?: boolean;
  } = {}
): { text: string; color: 'green' | 'red' | 'neutral' } {
  const color = value > 0 ? 'green' : value < 0 ? 'red' : 'neutral';

  const text = formatCurrency(value, {
    ...options,
    showSign: value !== 0,
  });

  return { text, color };
}

/**
 * Format date as string
 *
 * @param date - Date to format
 * @param format - Format style (default "medium")
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2025-12-31')); // returns "Dec 31, 2025"
 * formatDate(new Date('2025-12-31'), 'short'); // returns "12/31/25"
 * formatDate(new Date('2025-12-31'), 'long'); // returns "December 31, 2025"
 * formatDate(new Date('2025-12-31'), 'iso'); // returns "2025-12-31"
 */
export function formatDate(
  date: Date,
  format: 'short' | 'medium' | 'long' | 'iso' = 'medium'
): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      });

    case 'medium':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    case 'long':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    case 'iso':
      return date.toISOString().split('T')[0];

    default:
      return date.toLocaleDateString();
  }
}

/**
 * Format time until expiry as human-readable string
 *
 * @param expiryDate - Expiration date
 * @returns Formatted time string
 *
 * @example
 * formatTimeToExpiry(futureDate); // returns "45 days"
 * formatTimeToExpiry(farFutureDate); // returns "3 months"
 * formatTimeToExpiry(veryFarDate); // returns "2 years"
 */
export function formatTimeToExpiry(expiryDate: Date): string {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((expiryDate.getTime() - now.getTime()) / msPerDay);

  if (days < 0) {
    return 'Expired';
  } else if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return '1 day';
  } else if (days < 7) {
    return `${days} days`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    const years = Math.floor(days / 365);
    const remainingMonths = Math.floor((days % 365) / 30);
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${years}y ${remainingMonths}m`;
    }
  }
}

/**
 * Format Greek value with appropriate precision
 *
 * @param greekName - Name of the Greek (delta, gamma, theta, vega, rho)
 * @param value - Greek value
 * @returns Formatted string
 *
 * @example
 * formatGreek('delta', 0.5234); // returns "0.52"
 * formatGreek('gamma', 0.0123); // returns "0.012"
 * formatGreek('theta', -25.345); // returns "-25.35"
 * formatGreek('vega', 123.456); // returns "123.46"
 */
export function formatGreek(
  greekName: 'delta' | 'gamma' | 'theta' | 'vega' | 'rho',
  value: number
): string {
  switch (greekName) {
    case 'delta':
      return value.toFixed(2);

    case 'gamma':
      return value.toFixed(3);

    case 'theta':
      return value.toFixed(2);

    case 'vega':
      return value.toFixed(2);

    case 'rho':
      return value.toFixed(2);

    default:
      return value.toFixed(2);
  }
}

/**
 * Format large number with appropriate suffix
 *
 * @param value - Number to format
 * @param decimals - Decimal places (default 2)
 * @returns Formatted string
 *
 * @example
 * formatLargeNumber(1234); // returns "1.23K"
 * formatLargeNumber(1234567); // returns "1.23M"
 * formatLargeNumber(1234567890); // returns "1.23B"
 */
export function formatLargeNumber(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  } else {
    return `${sign}${absValue.toFixed(decimals)}`;
  }
}

/**
 * Format number with specified decimal places
 *
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 *
 * @example
 * formatNumber(1234.5678); // returns "1234.57"
 * formatNumber(1234.5678, 1); // returns "1234.6"
 * formatNumber(1234.5678, 0); // returns "1235"
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format return on investment (ROI)
 *
 * @param profitLoss - Profit or loss amount
 * @param initialCost - Initial cost (absolute value)
 * @returns Formatted ROI string
 *
 * @example
 * formatROI(500, 1000); // returns "+50.00%"
 * formatROI(-200, 1000); // returns "-20.00%"
 */
export function formatROI(profitLoss: number, initialCost: number): string {
  if (initialCost === 0) {
    return 'N/A';
  }

  const roi = (profitLoss / Math.abs(initialCost)) * 100;
  const sign = roi >= 0 ? '+' : '';

  return `${sign}${roi.toFixed(2)}%`;
}

/**
 * Truncate string to specified length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 *
 * @example
 * truncateString("Long Option Strategy Name", 20); // returns "Long Option Strat..."
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Parse currency string to number
 *
 * @param str - Currency string (e.g., "$1,234.56")
 * @returns Numeric value
 *
 * @example
 * parseCurrency("$1,234.56"); // returns 1234.56
 * parseCurrency("-$1,234.56"); // returns -1234.56
 * parseCurrency("1234.56"); // returns 1234.56
 */
export function parseCurrency(str: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = str.replace(/[$,\s]/g, '');

  return parseFloat(cleaned);
}

/**
 * Parse percentage string to decimal
 *
 * @param str - Percentage string (e.g., "25.5%")
 * @returns Decimal value
 *
 * @example
 * parsePercentage("25.5%"); // returns 0.255
 * parsePercentage("-10%"); // returns -0.10
 * parsePercentage("25.5"); // returns 0.255 (also works without %)
 */
export function parsePercentage(str: string): number {
  const cleaned = str.replace(/%/g, '');
  return parseFloat(cleaned) / 100;
}
