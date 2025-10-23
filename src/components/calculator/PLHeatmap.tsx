/**
 * P/L Heatmap Component
 * Displays profit/loss across different stock prices and dates using hexagonal heatmap
 * Full honeycomb layout with diverging color scheme centered at $0
 * Custom SVG implementation - no MUI X Pro license required
 */

import { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { OptionLeg } from '@/lib/types'
import { generateHeatmapData, formatDateLabel } from '@/lib/calculations/heatmap-data'
import { hasUnlimitedProfit, hasUnlimitedLoss } from '@/lib/calculations/multi-leg'
import { CircularProgressCombined } from '@/components/ui/circular-progress'
import { CustomHexagonalHeatmap } from './CustomHexagonalHeatmap'

interface PLHeatmapProps {
  legs: OptionLeg[]
  currentStockPrice: number
  riskFreeRate: number
  volatility: number
  dividendYield?: number
  className?: string
  isLoading?: boolean
  priceRangeMin?: number
  priceRangeMax?: number
  priceSteps?: number
  dateSteps?: number
  adaptiveDateSteps?: boolean // Enable automatic DTE-based dateSteps optimization
  adaptivePriceSteps?: boolean // Enable automatic space-based priceSteps optimization
  containerHeight?: number // Container height for adaptive price step calculation
}

export function PLHeatmap({
  legs,
  currentStockPrice,
  riskFreeRate,
  volatility,
  dividendYield = 0,
  className = '',
  isLoading = false,
  priceRangeMin,
  priceRangeMax,
  priceSteps = 9,
  dateSteps = 25,
  adaptiveDateSteps = true,
  adaptivePriceSteps = true,
  containerHeight = 750
}: PLHeatmapProps) {
  const [, setResizeCounter] = useState(0)

  // Listen for resize events from parent grid
  useEffect(() => {
    const handleResize = () => {
      setResizeCounter(prev => prev + 1)
    }

    window.addEventListener('chartContainerResize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('chartContainerResize', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const heatmapData = useMemo(() => {
    if (legs.length === 0) return null

    // Calculate days to expiry (DTE)
    const earliestExpiry = legs.reduce((earliest, leg) => {
      return leg.expiryDate < earliest ? leg.expiryDate : earliest
    }, legs[0]!.expiryDate)
    const today = new Date()
    const daysToExpiry = Math.max(1, Math.floor((earliestExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    // Adaptive dateSteps based on DTE - maximize horizontal space usage
    let effectiveDateSteps = dateSteps
    if (adaptiveDateSteps) {
      if (daysToExpiry <= 7) {
        // Very short-term: 0-7 days - maximize space with 40-50 columns
        effectiveDateSteps = Math.min(50, Math.max(40, daysToExpiry * 7))
      } else if (daysToExpiry <= 14) {
        // Short-term: 8-14 days - high granularity
        effectiveDateSteps = 40
      } else if (daysToExpiry <= 30) {
        // Medium-short: 15-30 days
        effectiveDateSteps = 35
      } else if (daysToExpiry <= 60) {
        // Medium-term: 31-60 days
        effectiveDateSteps = 30
      } else if (daysToExpiry <= 90) {
        // Medium-long: 61-90 days
        effectiveDateSteps = 25
      } else {
        // Long-term: 90+ days - avoid overcrowding
        effectiveDateSteps = 20
      }
    }

    // Adaptive priceSteps based on available vertical space
    let effectivePriceSteps = priceSteps
    if (adaptivePriceSteps) {
      // Calculate available height for hexagons
      const topPadding = Math.max(40, containerHeight * 0.08)
      const bottomPadding = Math.max(20, containerHeight * 0.03)
      const availableHeight = containerHeight - topPadding - bottomPadding

      // Minimum hex radius for readable labels and good visibility
      const minHexRadius = 20 // Increased to keep hexagons visible
      const minHexHeight = minHexRadius * 1.5

      // Calculate maximum rows that fit with minimum hex size
      // Formula: availableHeight = rows * hexHeight = rows * (radius * 1.5)
      // Accounting for honeycomb overlap: availableHeight >= rows * 1.5 * minRadius + 0.5 * minRadius
      const maxRowsThatFit = Math.floor((availableHeight - 0.5 * minHexRadius) / minHexHeight)

      // Use the smaller of: what fits or what was requested, but at least 9
      effectivePriceSteps = Math.max(9, Math.min(maxRowsThatFit, 20)) // Cap at 20 for balance between granularity and size
    } else {
      // Manual mode: just enforce minimum
      effectivePriceSteps = Math.max(9, priceSteps)
    }

    // Calculate price range
    let priceRangePercent: number
    let customMin: number | undefined
    let customMax: number | undefined

    if (priceRangeMin !== undefined && priceRangeMax !== undefined &&
        priceRangeMin > 0 && priceRangeMax > priceRangeMin) {
      customMin = priceRangeMin
      customMax = priceRangeMax
      const rangeBelow = currentStockPrice - priceRangeMin
      const rangeAbove = priceRangeMax - currentStockPrice
      priceRangePercent = Math.max(rangeBelow, rangeAbove) / currentStockPrice
    } else {
      priceRangePercent = 0.50 // 50% range for better coverage
    }

    return generateHeatmapData(
      legs,
      currentStockPrice,
      riskFreeRate,
      volatility,
      dividendYield,
      priceRangePercent,
      effectivePriceSteps,
      effectiveDateSteps,
      customMin,
      customMax
    )
  }, [legs, currentStockPrice, riskFreeRate, volatility, dividendYield, priceRangeMin, priceRangeMax, priceSteps, dateSteps, adaptiveDateSteps, adaptivePriceSteps, containerHeight])

  // Get month header for display
  const monthHeader = useMemo(() => {
    if (!heatmapData || heatmapData.dates.length === 0) return ''
    const firstDate = heatmapData.dates[0]
    if (!firstDate) return ''
    return firstDate.toLocaleDateString('en-US', { month: 'short' })
  }, [heatmapData])

  // Prepare axis data
  const xAxisData = useMemo(() => {
    if (!heatmapData) return []
    return heatmapData.dates.map((date, idx) => {
      const isExpiry = idx === heatmapData.dates.length - 1
      return formatDateLabel(date, isExpiry)
    })
  }, [heatmapData])

  const yAxisData = useMemo(() => {
    if (!heatmapData) return []
    // Show all price labels
    return heatmapData.prices.map((price) => `$${price.toFixed(2)}`)
  }, [heatmapData])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!heatmapData) return null

    const allValues = heatmapData.values.flat()

    // Check for unlimited profit/loss potential
    const isUnlimitedProfit = hasUnlimitedProfit(legs)
    const isUnlimitedLoss = hasUnlimitedLoss(legs)

    const maxProfit = isUnlimitedProfit ? null : Math.max(...allValues)
    const maxLoss = isUnlimitedLoss ? null : Math.min(...allValues)
    const avgPL = allValues.reduce((sum, val) => sum + val, 0) / allValues.length

    // Calculate win rate (% of scenarios with profit)
    const profitableScenarios = allValues.filter(v => v > 0).length
    const winRate = (profitableScenarios / allValues.length) * 100

    return {
      maxProfit,
      maxLoss,
      avgPL,
      winRate,
      isUnlimitedProfit,
      isUnlimitedLoss
    }
  }, [heatmapData, legs])

  // Calculate color scale min/max
  const colorScale = useMemo(() => {
    if (!heatmapData) return { min: -1000, max: 1000, changePoint: 0 }

    const allValues = heatmapData.values.flat()
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)

    // Use symmetric scale around 0 for better visualization
    const range = Math.max(Math.abs(minValue), Math.abs(maxValue))

    return {
      min: -range,
      max: range,
      changePoint: 0
    }
  }, [heatmapData])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <CircularProgressCombined size={80} thickness={6} />
          <p className="text-sm text-gray-400">Generating heatmap data...</p>
        </div>
      </div>
    )
  }

  if (!heatmapData || heatmapData.values.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-gray-400">Add option legs to see P/L analysis</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full w-full ${className}`}>
      {/* Heatmap */}
      <div className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">
        <CustomHexagonalHeatmap
          data={heatmapData.values}
          xLabels={xAxisData}
          yLabels={yAxisData}
          minValue={colorScale.min}
          maxValue={colorScale.max}
          monthHeader={monthHeader}
        />
      </div>

      {/* Statistics */}
      {stats && (
        <div className="flex-shrink-0 flex w-full pl-6 pr-6 justify-between pb-2 pt-4">
          <div className="flex flex-col gap-1 w-1/2">
            <span className="text-base text-white">Max Profit</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-semibold text-white">
                {stats.isUnlimitedProfit ? '∞' : `$${Math.abs(stats.maxProfit!).toLocaleString()}`}
              </span>
              <div className="flex bg-[#00E1D4]/40 p-1 pl-2 pr-2 items-center rounded-full text-[#00E1D4]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M14.4987 11.8888L9.99866 16.3333M9.99866 16.3333L5.49866 11.8888M9.99866 16.3333V4.66658"
                    stroke="#00E1D4"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
            <span className="text-[#B4B7C5] text-xs">
              {stats.isUnlimitedProfit ? 'Unlimited upside' : 'Best case scenario'}
            </span>
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <span className="text-base text-white">Max Loss</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-semibold text-white">
                {stats.isUnlimitedLoss ? '∞' : `$${Math.abs(stats.maxLoss!).toLocaleString()}`}
              </span>
              <div className="flex bg-[#E00007]/40 p-1 pl-2 pr-2 items-center rounded-full text-[#F08083]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <path
                    d="M5.50134 9.11119L10.0013 4.66675M10.0013 4.66675L14.5013 9.11119M10.0013 4.66675L10.0013 16.3334"
                    stroke="#F08083"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
            </div>
            <span className="text-[#B4B7C5] text-xs">
              {stats.isUnlimitedLoss ? 'Unlimited risk' : 'Worst case scenario'}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Metrics - Compact Grid */}
      {stats && (
        <div className="flex-shrink-0 grid grid-cols-3 gap-3 px-6 pb-4 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/30 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.0001 1.66663C5.40511 1.66663 1.66675 5.40499 1.66675 9.99996C1.66675 14.5949 5.40511 18.3333 10.0001 18.3333C14.5951 18.3333 18.3334 14.5949 18.3334 9.99996C18.3334 5.40499 14.5951 1.66663 10.0001 1.66663Z"
                  fill="#FFD36E"
                />
              </svg>
              <span className="text-xs text-gray-400">Avg P/L</span>
            </div>
            <div className="font-mono text-lg font-semibold text-white">
              ${stats.avgPL >= 0 ? '+' : ''}${stats.avgPL.toFixed(0)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-dark-800/30 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 2L12.5 7.5L18 8L14 12.5L15 18L10 15L5 18L6 12.5L2 8L7.5 7.5L10 2Z"
                  fill="#F8A340"
                />
              </svg>
              <span className="text-xs text-gray-400">Win Rate</span>
            </div>
            <div className="font-mono text-lg font-semibold text-white">{stats.winRate.toFixed(1)}%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-800/30 rounded-lg p-3 border border-white/10"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                  stroke="#B4B7C5"
                  strokeWidth="2"
                />
                <path
                  d="M10 6V10L13 13"
                  stroke="#B4B7C5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs text-gray-400">R:R Ratio</span>
            </div>
            <div className="font-mono text-lg font-semibold text-white">
              {stats.isUnlimitedProfit
                ? '∞'
                : stats.isUnlimitedLoss
                ? '0'
                : `1:${(Math.abs(stats.maxProfit!) / Math.abs(stats.maxLoss!)).toFixed(2)}`}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
