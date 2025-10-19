/**
 * Dashboard Charts Component
 * Uses v0-dashboard layout system for consistent, responsive chart display
 */

import { OptionLeg } from '@/lib/types'
import { PLHeatmap } from './PLHeatmap'
import { GreeksRadarChart } from './GreeksRadarChart'
import {
  OptionsChartGrid,
  MainChartArea,
  SidebarArea,
  SmallChartArea,
  MediumChartArea,
  ChartLayoutContainer
} from '@/components/v0-dashboard'

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
  return (
    <div className="w-full">
      <OptionsChartGrid layout="default">
        {/* P/L Heatmap - Main vertical chart area (2 columns wide, 3 rows tall) */}
        <div className="lg:col-span-2 lg:row-span-3">
          <ChartLayoutContainer
            title="Profit/Loss Heatmap"
            subtitle="P&L across price and time"
            value={`$${currentStockPrice.toFixed(2)}`}
            valueLabel="Current Price"
            chartHeight="full"
            headerLayout="compact"
          >
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
          </ChartLayoutContainer>
        </div>

        {/* Greeks Radar Chart - Row 1, spans 2 columns */}
        <div className="lg:col-span-2 lg:row-span-1">
          <ChartLayoutContainer
            title="Greeks Analysis"
            subtitle="Risk metrics visualization"
            chartHeight="small"
          >
            <GreeksRadarChart
              legs={legs}
              currentStockPrice={currentStockPrice}
              riskFreeRate={riskFreeRate}
              volatility={volatility}
              isLoading={isLoading}
              className="h-full w-full"
            />
          </ChartLayoutContainer>
        </div>

        {/* Row 2 - Two charts side by side */}
        {/* Profit Distribution */}
        <div className="lg:col-span-1 lg:row-span-1">
          <ChartLayoutContainer
            title="Profit Distribution"
            subtitle="Probability analysis"
            chartHeight="small"
          >
            <PlaceholderChart
              title="Profit Distribution"
              description="Probability analysis coming soon"
              isLoading={isLoading}
            />
          </ChartLayoutContainer>
        </div>

        {/* Time Decay Analysis */}
        <div className="lg:col-span-1 lg:row-span-1">
          <ChartLayoutContainer
            title="Time Decay"
            subtitle="Theta impact over time"
            chartHeight="small"
          >
            <PlaceholderChart
              title="Time Decay Analysis"
              description="Theta decay visualization coming soon"
              isLoading={isLoading}
            />
          </ChartLayoutContainer>
        </div>

        {/* Volatility Sensitivity */}
        <div className="lg:col-span-1 lg:row-span-1">
          <ChartLayoutContainer
            title="Volatility"
            subtitle="IV impact analysis"
            chartHeight="small"
          >
            <PlaceholderChart
              title="Volatility Sensitivity"
              description="IV impact analysis coming soon"
              isLoading={isLoading}
            />
          </ChartLayoutContainer>
        </div>
      </OptionsChartGrid>
    </div>
  )
}

/**
 * Placeholder component for charts under development
 */
interface PlaceholderChartProps {
  title: string
  description: string
  isLoading?: boolean
}

function PlaceholderChart({ description, isLoading }: PlaceholderChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
