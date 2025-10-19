/**
 * P/L Heatmap Data Generation
 * Calculate profit/loss across different stock prices and dates
 * using Black-Scholes with Greeks for time decay
 */

import { OptionLeg, OptionType, Position } from '../types'
import { blackScholes } from './black-scholes'
import { calculateTimeToExpiry } from './helpers'

export interface HeatmapDataPoint {
  stockPrice: number
  date: Date
  profitLoss: number
}

export interface HeatmapData {
  prices: number[]
  dates: Date[]
  values: number[][] // [priceIndex][dateIndex]
}

/**
 * Generate P/L heatmap data for a multi-leg options strategy
 *
 * @param legs - Array of option legs in the strategy
 * @param currentStockPrice - Current stock price
 * @param riskFreeRate - Risk-free rate (decimal)
 * @param volatility - Default implied volatility (decimal), used if leg doesn't have its own
 * @param dividendYield - Dividend yield (decimal, default 0)
 * @param priceRange - Percentage range above/below current price (default 0.25 = ±25%)
 * @param priceSteps - Number of price levels to calculate (default 25)
 * @param dateSteps - Number of date points to calculate (default 30)
 * @param customMinPrice - Optional absolute minimum price (overrides priceRange)
 * @param customMaxPrice - Optional absolute maximum price (overrides priceRange)
 * @returns HeatmapData with prices, dates, and P/L values
 */
export function generateHeatmapData(
  legs: OptionLeg[],
  currentStockPrice: number,
  riskFreeRate: number,
  volatility: number,
  dividendYield: number = 0,
  priceRange: number = 0.25,
  priceSteps: number = 25,
  dateSteps: number = 30,
  customMinPrice?: number,
  customMaxPrice?: number
): HeatmapData {
  if (legs.length === 0) {
    return { prices: [], dates: [], values: [] }
  }

  // Calculate initial cost of the strategy
  const initialCost = legs.reduce((sum, leg) => {
    const cost = leg.premium * leg.quantity * 100
    return sum + (leg.position === Position.LONG ? -cost : cost)
  }, 0)

  // Find the earliest expiry date among all legs
  const earliestExpiry = legs.reduce((earliest, leg) => {
    return leg.expiryDate < earliest ? leg.expiryDate : earliest
  }, legs[0].expiryDate)

  // Generate price range (from high to low, for display purposes)
  let minPrice: number
  let maxPrice: number

  if (customMinPrice !== undefined && customMaxPrice !== undefined) {
    // Use custom absolute price range
    minPrice = customMinPrice
    maxPrice = customMaxPrice
  } else {
    // Use percentage-based range
    minPrice = currentStockPrice * (1 - priceRange)
    maxPrice = currentStockPrice * (1 + priceRange)
  }

  const prices: number[] = []
  for (let i = 0; i < priceSteps; i++) {
    const price = maxPrice - (i * (maxPrice - minPrice)) / (priceSteps - 1)
    prices.push(Math.round(price * 100) / 100)
  }

  // Generate date range (from today to expiry)
  const today = new Date()
  const dates: Date[] = []
  const daysToExpiry = Math.max(1, Math.floor((earliestExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const dateStep = Math.max(1, Math.floor(daysToExpiry / dateSteps))

  for (let i = 0; i < dateSteps; i++) {
    const daysForward = i * dateStep
    if (daysForward > daysToExpiry) break
    const date = new Date(today)
    date.setDate(date.getDate() + daysForward)
    dates.push(date)
  }

  // Add expiry date as the last column if not already included
  if (dates.length === 0 || dates[dates.length - 1].getTime() < earliestExpiry.getTime()) {
    dates.push(new Date(earliestExpiry))
  }

  // Calculate P/L for each (price, date) combination
  const values: number[][] = []

  for (let priceIdx = 0; priceIdx < prices.length; priceIdx++) {
    const row: number[] = []
    const testPrice = prices[priceIdx]

    for (let dateIdx = 0; dateIdx < dates.length; dateIdx++) {
      const testDate = dates[dateIdx]
      let totalValue = initialCost // Start with initial credit/debit

      // Calculate value of each leg at this price/date combination
      for (const leg of legs) {
        const timeToExpiry = calculateTimeToExpiry(leg.expiryDate, testDate)
        // Use leg-specific IV if available, otherwise use default
        const legVolatility = leg.volatility ?? volatility

        let legValue: number

        if (timeToExpiry <= 0) {
          // At or past expiration - use intrinsic value
          if (leg.optionType === OptionType.CALL) {
            legValue = Math.max(0, testPrice - leg.strikePrice)
          } else {
            legValue = Math.max(0, leg.strikePrice - testPrice)
          }
        } else {
          // Before expiration - use Black-Scholes with dividend yield
          legValue = blackScholes({
            optionType: leg.optionType,
            stockPrice: testPrice,
            strikePrice: leg.strikePrice,
            timeToExpiry,
            riskFreeRate,
            volatility: legVolatility,
            dividendYield,
          }).optionPrice
        }

        // Convert to per-contract value and adjust for position
        const contractValue = legValue * 100 * leg.quantity
        totalValue += leg.position === Position.LONG ? contractValue : -contractValue
      }

      row.push(Math.round(totalValue))
    }

    values.push(row)
  }

  return { prices, dates, values }
}

/**
 * Format date label for heatmap display
 * @param date - Date to format
 * @param isExpiry - Whether this is the expiry date
 */
export function formatDateLabel(date: Date, isExpiry: boolean = false): string {
  if (isExpiry) return 'Exp'
  const day = date.getDate()
  return `${day}`
}

/**
 * Get color for P/L value
 * Returns RGB color string
 */
export function getPLColor(value: number, minValue: number, maxValue: number): string {
  // Normalize value between -1 and 1 with 0 at center
  const range = Math.max(Math.abs(minValue), Math.abs(maxValue))
  if (range === 0) return 'rgb(255, 255, 200)' // Neutral yellow

  const normalized = value / range

  if (normalized > 0) {
    // Positive (profit) - green gradient
    const intensity = Math.min(normalized, 1)
    const r = Math.round(144 - intensity * 100) // 144 -> 44
    const g = Math.round(238 - intensity * 18) // 238 -> 220
    const b = Math.round(144 - intensity * 100) // 144 -> 44
    return `rgb(${r}, ${g}, ${b})`
  } else {
    // Negative (loss) - red gradient
    const intensity = Math.min(Math.abs(normalized), 1)
    const r = Math.round(239 - intensity * 19) // 239 -> 220
    const g = Math.round(68 + intensity * 76) // 68 -> 144
    const b = Math.round(68 + intensity * 76) // 68 -> 144
    return `rgb(${r}, ${g}, ${b})`
  }
}

/**
 * Get text color (black or white) based on background brightness
 */
export function getTextColor(value: number): string {
  return value > 0 ? 'black' : 'white'
}
