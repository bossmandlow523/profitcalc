/**
 * Greeks Visualization Component
 * Displays option Greeks with proper unit-aware visualization
 * Uses grouped bar charts instead of forcing different units onto same scale
 */

import { useMemo, useEffect, useState } from 'react'
import { OptionLeg } from '@/lib/types'
import { calcAggregateGreeks } from '@/lib/calculations/greeks'
import { CircularProgressCombined } from '@/components/ui/circular-progress'

interface GreeksRadarChartProps {
  legs: OptionLeg[]
  currentStockPrice: number
  riskFreeRate: number
  volatility: number
  className?: string
  isLoading?: boolean
}

interface GreekData {
  name: string
  symbol: string
  value: number
  unit: string
  description: string
  isZero: boolean
  color: string
  impact: string
  maxScale: number
  badge?: string
}

export function GreeksRadarChart({
  legs,
  currentStockPrice,
  riskFreeRate,
  volatility,
  className = '',
  isLoading = false
}: GreeksRadarChartProps) {
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

  const greeksData = useMemo(() => {
    if (legs.length === 0 || currentStockPrice <= 0) return null

    try {
      // Calculate aggregate Greeks for the entire position
      const greeks = calcAggregateGreeks(legs, currentStockPrice, riskFreeRate, volatility)

      /**
       * Greeks grouped by category to avoid mixing units
       * Each category has its own scale and visual treatment
       */
      return {
        rawGreeks: greeks,
        categories: {
          directional: {
            label: 'Directional Exposure',
            description: 'How the position moves with stock price',
            greeks: [
              {
                name: 'Delta',
                symbol: 'Δ',
                value: greeks.delta,
                unit: 'shares',
                description: `Equivalent to ${Math.abs(Math.round(greeks.delta))} shares of stock`,
                isZero: Math.abs(greeks.delta) < 0.01,
                color: greeks.delta >= 0 ? '#10B981' : '#EF4444',
                impact: 'high',
                // Scale: typical range is -100 to +100 for single option positions
                maxScale: 100
              },
              {
                name: 'Gamma',
                symbol: 'Γ',
                value: greeks.gamma,
                unit: 'Δ per $1',
                description: 'How fast Delta changes as stock moves',
                isZero: Math.abs(greeks.gamma) < 0.001,
                color: greeks.gamma >= 0 ? '#8B5CF6' : '#7C3AED',
                impact: 'medium',
                // Scale: typical range is 0 to 0.1
                maxScale: 0.1
              }
            ] as GreekData[]
          },
          timeSensitivity: {
            label: 'Time Sensitivity',
            description: 'Daily profit/loss from time decay',
            greeks: [
              {
                name: 'Theta',
                symbol: 'Θ',
                value: greeks.theta,
                unit: '$ per day',
                description: greeks.theta < 0 ? 'Losing money each day' : 'Earning money each day',
                isZero: Math.abs(greeks.theta) < 0.01,
                color: greeks.theta >= 0 ? '#10B981' : '#F59E0B',
                impact: 'high',
                badge: greeks.theta < 0 ? 'DECAY' : 'EARNING',
                // Scale: typical range is -50 to +50
                maxScale: 50
              }
            ] as GreekData[]
          },
          volatilitySensitivity: {
            label: 'Volatility Sensitivity',
            description: 'P&L change from IV movement',
            greeks: [
              {
                name: 'Vega',
                symbol: 'ν',
                value: greeks.vega,
                unit: '$ per 1% IV',
                description: 'Profit/loss per 1% change in implied volatility',
                isZero: Math.abs(greeks.vega) < 0.01,
                color: greeks.vega >= 0 ? '#3B82F6' : '#2563EB',
                impact: 'medium',
                // Scale: typical range is 0 to 100
                maxScale: 100
              }
            ] as GreekData[]
          },
          rateSensitivity: {
            label: 'Interest Rate Sensitivity',
            description: 'P&L change from rate changes',
            greeks: [
              {
                name: 'Rho',
                symbol: 'ρ',
                value: greeks.rho,
                unit: '$ per 1% Δr',
                description: 'Profit/loss per 1% change in interest rates',
                isZero: Math.abs(greeks.rho) < 0.01,
                color: greeks.rho >= 0 ? '#EC4899' : '#EF4444',
                impact: 'low',
                // Scale: typical range is -50 to +50
                maxScale: 50
              }
            ] as GreekData[]
          }
        }
      }
    } catch (error) {
      console.error('Error calculating Greeks:', error)
      return null
    }
  }, [legs, currentStockPrice, riskFreeRate, volatility])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <CircularProgressCombined size={80} thickness={6} />
          <p className="text-sm text-gray-400">Calculating Greeks...</p>
        </div>
      </div>
    )
  }

  if (!greeksData) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-gray-400">Add options to see Greeks analysis</p>
      </div>
    )
  }

  const { categories } = greeksData

  /**
   * Compact Greek card - optimized for grid layout
   */
  const GreekBar = ({ greek }: { greek: GreekData }) => {
    const percentage = Math.min((Math.abs(greek.value) / greek.maxScale) * 100, 100)
    const isNegative = greek.value < 0
    const isZero = greek.isZero

    return (
      <div className="bg-dark-800/50 rounded-lg p-2.5 border border-white/10">
        {/* Header with name and badges */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-gray-200">{greek.name} ({greek.symbol})</span>
          <div className="flex items-center gap-1">
            {greek.badge && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium ${
                greek.badge === 'DECAY' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {greek.badge}
              </span>
            )}
            {isZero && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-500 font-medium">ZERO</span>
            )}
          </div>
        </div>

        {/* Value and unit on same line */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <div className={`text-xl font-bold ${
            isZero ? 'text-gray-500' : isNegative ? 'text-red-400' : 'text-green-400'
          }`}>
            {isZero ? '—' : `${isNegative ? '−' : '+'} ${Math.abs(greek.value).toFixed(greek.name === 'Gamma' ? 3 : 2)}`}
          </div>
          <div className="text-[9px] text-gray-500">{greek.unit}</div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
          {isZero ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-500"></div>
          ) : (
            <div
              className="absolute top-0 bottom-0 rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: greek.color
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Compact grid - 2 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Delta */}
        {categories.directional.greeks.map(greek => (
          <GreekBar key={greek.name} greek={greek} />
        ))}

        {/* Theta */}
        {categories.timeSensitivity.greeks.map(greek => (
          <GreekBar key={greek.name} greek={greek} />
        ))}

        {/* Vega */}
        {categories.volatilitySensitivity.greeks.map(greek => (
          <GreekBar key={greek.name} greek={greek} />
        ))}

        {/* Rho */}
        {categories.rateSensitivity.greeks.map(greek => (
          <GreekBar key={greek.name} greek={greek} />
        ))}
      </div>
    </div>
  )
}