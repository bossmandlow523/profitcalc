/**
 * Greeks Radial Bar Chart Component
 * Displays option Greeks (Delta, Gamma, Theta, Vega, Rho) in a radial bar chart visualization
 */

import { useMemo, useEffect, useState } from 'react'
import { RadialBarChart, RadialBarSeries, RadialBar } from 'reaviz'
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

  const radialData = useMemo(() => {
    if (legs.length === 0 || currentStockPrice <= 0) return null

    try {
      // Calculate aggregate Greeks for the entire position
      const greeks = calcAggregateGreeks(legs, currentStockPrice, riskFreeRate, volatility)

      // Normalization function: maps each Greek to 0-100 scale based on typical ranges
      const normalizeGreek = (value: number, type: 'delta' | 'gamma' | 'theta' | 'vega' | 'rho'): number => {
        switch (type) {
          case 'delta':
            // Delta ranges from -100 to +100, normalize to 0-100
            return Math.min(100, Math.max(0, (Math.abs(value) / 100) * 100))
          case 'gamma':
            // Gamma typically 0 to 0.1, scale up
            return Math.min(100, (Math.abs(value) / 0.1) * 100)
          case 'theta':
            // Theta typically -10 to +10, normalize absolute value
            return Math.min(100, (Math.abs(value) / 10) * 100)
          case 'vega':
            // Vega typically 0 to 50
            return Math.min(100, (Math.abs(value) / 50) * 100)
          case 'rho':
            // Rho typically -10 to +10
            return Math.min(100, (Math.abs(value) / 10) * 100)
          default:
            return 0
        }
      }

      // Normalize Greeks for visualization
      const normalizedGreeks = {
        delta: normalizeGreek(greeks.delta, 'delta'),
        gamma: normalizeGreek(greeks.gamma, 'gamma'),
        theta: normalizeGreek(greeks.theta, 'theta'),
        vega: normalizeGreek(greeks.vega, 'vega'),
        rho: normalizeGreek(greeks.rho, 'rho'),
      }

      // Format data for RadialBarChart - filter out zero values
      const chartData = [
        { key: 'Delta', data: normalizedGreeks.delta, isNegative: greeks.delta < 0 },
        { key: 'Gamma', data: normalizedGreeks.gamma, isNegative: false },
        { key: 'Theta', data: normalizedGreeks.theta, isNegative: greeks.theta < 0 },
        { key: 'Vega', data: normalizedGreeks.vega, isNegative: false },
        { key: 'Rho', data: normalizedGreeks.rho, isNegative: greeks.rho < 0 },
      ].filter(item => item.data > 0.01) // Filter out effectively zero values

      return {
        rawGreeks: greeks,
        normalizedGreeks,
        chartData
      }
    } catch (error) {
      console.error('Error calculating Greeks for radial chart:', error)
      return null
    }
  }, [legs, currentStockPrice, riskFreeRate, volatility])

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">Greeks Overview</h3>
          <p className="dashboard-card-subtitle">
            Risk metrics (Delta, Gamma, Theta, Vega, Rho)
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] border-2 border-dashed border-[#333333] rounded min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <CircularProgressCombined size={80} thickness={6} />
            <p className="text-sm text-gray-400">Calculating Greeks...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!radialData) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">Greeks Overview</h3>
          <p className="dashboard-card-subtitle">
            Risk metrics (Delta, Gamma, Theta, Vega, Rho)
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] border-2 border-dashed border-[#333333] rounded min-h-[200px]">
          <p className="text-[#666666] text-sm text-center">
            [Chart Area - Greeks Overview]
          </p>
        </div>
      </div>
    )
  }

  const { rawGreeks, normalizedGreeks, chartData } = radialData

  // Color mapping based on positive/negative values
  const getGreekColor = (key: string, isNegative: boolean) => {
    const baseColors = {
      'Delta': isNegative ? '#EF4444' : '#10B981', // Red/Green
      'Gamma': '#8B5CF6', // Purple (always positive)
      'Theta': isNegative ? '#F59E0B' : '#10B981', // Orange/Green
      'Vega': '#3B82F6', // Blue (always positive)
      'Rho': isNegative ? '#EF4444' : '#EC4899', // Red/Pink
    }
    return baseColors[key as keyof typeof baseColors] || '#666666'
  }

  // Map colors to each chart data item
  const chartDataWithColors = chartData.map(item => ({
    ...item,
    color: getGreekColor(item.key, item.isNegative)
  }))

  const colorScheme = chartDataWithColors.map(item => item.color)

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">Greeks Overview</h3>
        <p className="dashboard-card-subtitle">
          Risk metrics (Delta, Gamma, Theta, Vega, Rho)
        </p>
      </div>

      {/* Radial Bar Chart */}
      <div className="mb-3 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[250px] h-[250px] rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-green-500/10 blur-3xl"></div>
        </div>
        {/* Scale reference circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: 368, height: 368 }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" style={{ width: '25%', height: '25%' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: '50%', height: '50%' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" style={{ width: '75%', height: '75%' }}></div>
            {/* Scale labels */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-[10px] text-gray-600" style={{ marginTop: '-50%' }}>100%</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-[10px] text-gray-600" style={{ marginTop: '-37.5%' }}>75%</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-[10px] text-gray-600" style={{ marginTop: '-25%' }}>50%</div>
          </div>
        </div>
        <RadialBarChart
          height={368}
          width={368}
          data={chartDataWithColors}
          innerRadius={15}
          series={
            <RadialBarSeries
              colorScheme={colorScheme}
              bar={<RadialBar gradient={false} />}
            />
          }
        />
      </div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-3 justify-center px-2">
        {chartDataWithColors.map((item) => {
          const normalizedValue = normalizedGreeks[item.key.toLowerCase() as keyof typeof normalizedGreeks]

          return (
            <div key={item.key} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-300 font-medium">{item.key}</span>
              <span className="text-gray-500">
                ({normalizedValue.toFixed(0)}%)
              </span>
            </div>
          )
        })}
      </div>

      {/* Greeks Summary Table - Compact Grid */}
      <div className="bg-dark-800/30 rounded-lg p-3 border border-white/10">
        <div className="text-xs font-semibold text-white mb-2">Greeks Values</div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          <div className="bg-dark-900/50 rounded-lg p-2 border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Delta (Δ)</div>
            <div className={`text-base font-bold ${rawGreeks.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {rawGreeks.delta >= 0 ? '+' : ''}{rawGreeks.delta.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {Math.abs(Math.round(rawGreeks.delta))} shares
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-lg p-2 border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Gamma (Γ)</div>
            <div className="text-base font-bold text-purple-400">
              {rawGreeks.gamma.toFixed(3)}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Delta change
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-lg p-2 border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Theta (Θ)</div>
            <div className={`text-base font-bold ${rawGreeks.theta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {rawGreeks.theta >= 0 ? '+' : ''}${rawGreeks.theta.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Per day
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-lg p-2 border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Vega (ν)</div>
            <div className="text-base font-bold text-blue-400">
              {rawGreeks.vega.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Per 1% IV
            </div>
          </div>

          <div className="bg-dark-900/50 rounded-lg p-2 border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Rho (ρ)</div>
            <div className={`text-base font-bold ${rawGreeks.rho >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {rawGreeks.rho >= 0 ? '+' : ''}{rawGreeks.rho.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Per 1% rate
            </div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-2 text-[10px] text-gray-500 italic">
        Note: Greeks are aggregate values for the entire position. Delta shows directional exposure,
        Theta shows daily time decay, Vega shows volatility sensitivity.
      </div>
    </div>
  )
}