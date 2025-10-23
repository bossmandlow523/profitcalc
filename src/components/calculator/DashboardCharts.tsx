/**
 * Dashboard Charts Component
 * Heatmap with parent container, Greeks stacked as aside
 */

import { useMemo, useState } from 'react'
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
  // Heatmap control state
  const [dateSteps, setDateSteps] = useState<number>(25)
  const [priceSteps, setPriceSteps] = useState<number>(12)
  const [adaptiveDateSteps, setAdaptiveDateSteps] = useState<boolean>(true)
  const [adaptivePriceSteps, setAdaptivePriceSteps] = useState<boolean>(true)

  // Capture calculation time when inputs change
  const calculationTime = useMemo(() => new Date(), [legs, currentStockPrice, riskFreeRate, volatility])

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
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Heatmap Container - Main Content */}
        <div className="flex-1 w-full">
          <Card className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-semibold text-white">Profit/Loss Heatmap</h3>
                  <p className="text-sm text-gray-400 mt-1">P&L across price and time</p>
                </div>

                {/* Heatmap Controls - Top Right Corner */}
                <div className="flex gap-8 items-start">
                {/* Date Steps Control */}
                <div className="flex flex-col gap-2 items-center">
                  <label className="text-xs text-gray-400 font-medium">Date Points</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={dateSteps}
                    onChange={(e) => setDateSteps(Number(e.target.value))}
                    disabled={adaptiveDateSteps}
                    className="w-40 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 min-w-[30px] text-center">{dateSteps}</span>
                    <button
                      onClick={() => setAdaptiveDateSteps(!adaptiveDateSteps)}
                      className={`text-xs px-3 py-1 rounded transition-colors ${
                        adaptiveDateSteps
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-gray-700/40 text-gray-400 border border-gray-600/40'
                      }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>

                {/* Price Steps Control */}
                <div className="flex flex-col gap-2 items-center">
                  <label className="text-xs text-gray-400 font-medium">Price Points</label>
                  <input
                    type="range"
                    min="9"
                    max="25"
                    value={priceSteps}
                    onChange={(e) => setPriceSteps(Number(e.target.value))}
                    disabled={adaptivePriceSteps}
                    className="w-40 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 min-w-[30px] text-center">{priceSteps}</span>
                    <button
                      onClick={() => setAdaptivePriceSteps(!adaptivePriceSteps)}
                      className={`text-xs px-3 py-1 rounded transition-colors ${
                        adaptivePriceSteps
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-gray-700/40 text-gray-400 border border-gray-600/40'
                      }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 italic text-center">
                💡 Each date column uses the same time of day ({calculationTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })})
              </p>
            </div>
            <PLHeatmap
              legs={legs}
              currentStockPrice={currentStockPrice}
              riskFreeRate={riskFreeRate}
              volatility={volatility}
              dividendYield={dividendYield}
              priceRangeMin={priceRangeMin}
              priceRangeMax={priceRangeMax}
              dateSteps={dateSteps}
              priceSteps={priceSteps}
              adaptiveDateSteps={adaptiveDateSteps}
              adaptivePriceSteps={adaptivePriceSteps}
              isLoading={isLoading}
              className="h-full w-full"
            />
          </Card>
        </div>

        {/* Greeks Sidebar - Right Side */}
        {greeks && (
          <aside className="w-full lg:w-80 flex-shrink-0">
            <Card className="p-6 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Greeks Analysis</h3>
                <p className="text-sm text-gray-400 mt-2 font-medium">Risk metrics</p>
              </div>

              <div className="flex flex-col gap-4">
              {/* Delta */}
              <Card className="p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-base font-bold text-gray-200">Delta (Δ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2.5">
                  <div className="text-2xl font-bold" style={{ color: greeks.delta >= 0 ? '#10B981' : '#EF4444' }}>
                    {greeks.delta >= 0 ? '+' : '−'} {Math.abs(greeks.delta).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">shares</div>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
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
              <Card className="p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-base font-bold text-gray-200">Gamma (Γ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2.5">
                  <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                    {greeks.gamma >= 0 ? '+' : '−'} {Math.abs(greeks.gamma).toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">Δ per $1</div>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
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
              <Card className="p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-base font-bold text-gray-200">Theta (Θ)</span>
                  {greeks.theta < 0 && (
                    <span className="text-[9px] px-2 py-1 rounded font-medium bg-orange-500/20 text-orange-400">
                      DECAY
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-2.5">
                  <div className="text-2xl font-bold" style={{ color: greeks.theta >= 0 ? '#10B981' : '#F59E0B' }}>
                    {greeks.theta >= 0 ? '+' : '−'} {Math.abs(greeks.theta).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">$ per day</div>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
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
              <Card className="p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-base font-bold text-gray-200">Vega (ν)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2.5">
                  <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
                    {greeks.vega >= 0 ? '+' : '−'} {Math.abs(greeks.vega).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">$ per 1% IV</div>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
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
              <Card className="p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-base font-bold text-gray-200">Rho (ρ)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2.5">
                  <div className="text-2xl font-bold" style={{ color: greeks.rho >= 0 ? '#EC4899' : '#EF4444' }}>
                    {greeks.rho >= 0 ? '+' : '−'} {Math.abs(greeks.rho).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">$ per 1% Δr</div>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden">
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
          </Card>
          </aside>
        )}
      </div>
    </div>
  )
}
