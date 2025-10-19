/**
 * Dashboard Charts Component
 * Heatmap with parent container, Greeks stacked as aside
 */

import { useMemo } from 'react'
import { OptionLeg } from '@/lib/types'
import { PLHeatmap } from './PLHeatmap'
import { calcAggregateGreeks } from '@/lib/calculations/greeks'
import { Card } from '@/components/ui/card'

interface DashboardChartsProps {
  legs: OptionLeg[]
  currentStockPrice: number
  riskFreeRate: number
  volatility: number
  dividendYield?: number
  priceRangeMin?: number
  priceRangeMax?: number
  isLoading?: boolean
}

export function DashboardCharts({
  legs,
  currentStockPrice,
  riskFreeRate,
  volatility,
  dividendYield = 0,
  priceRangeMin,
  priceRangeMax,
  isLoading = false
}: DashboardChartsProps) {
  // Calculate Greeks
  const greeks = useMemo(() => {
    if (legs.length === 0 || currentStockPrice <= 0) return null
    try {
      return calcAggregateGreeks(legs, currentStockPrice, riskFreeRate, volatility)
    } catch (error) {
      console.error('Error calculating Greeks:', error)
      return null
    }
  }, [legs, currentStockPrice, riskFreeRate, volatility])

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Heatmap Container - Main Content */}
        <div className="flex-1 w-full">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Profit/Loss Heatmap</h3>
              <p className="text-sm text-gray-400 mt-1">P&L across price and time</p>
            </div>
            <PLHeatmap
              legs={legs}
              currentStockPrice={currentStockPrice}
              riskFreeRate={riskFreeRate}
              volatility={volatility}
              dividendYield={dividendYield}
              priceRangeMin={priceRangeMin}
              priceRangeMax={priceRangeMax}
              isLoading={isLoading}
              className="h-full w-full"
            />
          </Card>
        </div>

        {/* Greeks Sidebar - Right Side */}
        {greeks && (
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Greeks Analysis</h3>
              <p className="text-xs text-gray-400 mt-1">Risk metrics</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Delta */}
              <Card className="p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-200">Delta (Δ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="text-lg font-bold" style={{ color: greeks.delta >= 0 ? '#10B981' : '#EF4444' }}>
                    {greeks.delta >= 0 ? '+' : '−'} {Math.abs(greeks.delta).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-gray-500">shares</div>
                </div>
                <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min((Math.abs(greeks.delta) / 100) * 100, 100)}%`,
                      backgroundColor: greeks.delta >= 0 ? '#10B981' : '#EF4444'
                    }}
                  />
                </div>
              </Card>

              {/* Gamma */}
              <Card className="p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-200">Gamma (Γ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="text-lg font-bold" style={{ color: '#8B5CF6' }}>
                    {greeks.gamma >= 0 ? '+' : '−'} {Math.abs(greeks.gamma).toFixed(3)}
                  </div>
                  <div className="text-[9px] text-gray-500">Δ per $1</div>
                </div>
                <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min((Math.abs(greeks.gamma) / 0.1) * 100, 100)}%`,
                      backgroundColor: '#8B5CF6'
                    }}
                  />
                </div>
              </Card>

              {/* Theta */}
              <Card className="p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-200">Theta (Θ)</span>
                  {greeks.theta < 0 && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-medium bg-orange-500/20 text-orange-400">
                      DECAY
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="text-lg font-bold" style={{ color: greeks.theta >= 0 ? '#10B981' : '#F59E0B' }}>
                    {greeks.theta >= 0 ? '+' : '−'} {Math.abs(greeks.theta).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-gray-500">$ per day</div>
                </div>
                <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min((Math.abs(greeks.theta) / 50) * 100, 100)}%`,
                      backgroundColor: greeks.theta >= 0 ? '#10B981' : '#F59E0B'
                    }}
                  />
                </div>
              </Card>

              {/* Vega */}
              <Card className="p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-200">Vega (ν)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="text-lg font-bold" style={{ color: '#3B82F6' }}>
                    {greeks.vega >= 0 ? '+' : '−'} {Math.abs(greeks.vega).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-gray-500">$ per 1% IV</div>
                </div>
                <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min((Math.abs(greeks.vega) / 100) * 100, 100)}%`,
                      backgroundColor: '#3B82F6'
                    }}
                  />
                </div>
              </Card>

              {/* Rho */}
              <Card className="p-2.5 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-200">Rho (ρ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="text-lg font-bold" style={{ color: greeks.rho >= 0 ? '#EC4899' : '#EF4444' }}>
                    {greeks.rho >= 0 ? '+' : '−'} {Math.abs(greeks.rho).toFixed(2)}
                  </div>
                  <div className="text-[9px] text-gray-500">$ per 1% Δr</div>
                </div>
                <div className="relative h-1.5 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all"
                    style={{
                      width: `${Math.min((Math.abs(greeks.rho) / 50) * 100, 100)}%`,
                      backgroundColor: greeks.rho >= 0 ? '#EC4899' : '#EF4444'
                    }}
                  />
                </div>
              </Card>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
