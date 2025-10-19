import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartLayoutContainer } from "./ChartLayoutContainer"
import { ReactNode } from "react"

/**
 * Example integration component showing how to use the dashboard layout
 * for options calculator chart visualization.
 *
 * You can replace the data with actual P&L calculations, Greeks data, etc.
 */

interface OptionsChartLayoutProps {
  data?: Array<{ price: number; profitLoss: number }>
  title?: string
  subtitle?: string
  chartHeight?: "sm" | "md" | "lg" | "xl" | "full"
  actions?: ReactNode
  showStats?: boolean
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
        <p className="text-xs font-medium">Price: ${payload[0].payload.price}</p>
        <p className="text-xs" style={{ color: payload[0].color }}>
          P&L: ${payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

export function OptionsChartLayout({
  data = [],
  title = "Profit/Loss Profile",
  subtitle = "Option strategy payoff diagram",
  chartHeight = "lg",
  actions,
  showStats = true,
}: OptionsChartLayoutProps) {
  // Example default data if none provided
  const chartData = data.length > 0 ? data : [
    { price: 90, profitLoss: -200 },
    { price: 95, profitLoss: -100 },
    { price: 100, profitLoss: 0 },
    { price: 105, profitLoss: 500 },
    { price: 110, profitLoss: 1000 },
    { price: 115, profitLoss: 1500 },
  ]

  const maxProfit = Math.max(...chartData.map(d => d.profitLoss))
  const maxLoss = Math.min(...chartData.map(d => d.profitLoss))

  return (
    <ChartLayoutContainer
      title={title}
      subtitle={subtitle}
      legend={[
        { label: "Profit/Loss", color: "#10b981" }
      ]}
      actions={actions}
      chartHeight={chartHeight}
    >
      {showStats && (
        <div className="mb-4 flex items-baseline gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Max Profit</span>
            <div className="text-xl font-semibold text-green-500">${maxProfit.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Max Loss</span>
            <div className="text-xl font-semibold text-red-500">${maxLoss.toFixed(2)}</div>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillProfitLoss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="price"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Stock Price', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            label={{ value: 'P&L', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="profitLoss"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#fillProfitLoss)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartLayoutContainer>
  )
}

