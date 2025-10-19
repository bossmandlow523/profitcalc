import { Button } from "@/components/ui/button"
import { DownloadIcon, RefreshCwIcon } from "lucide-react"
import {
  OptionsChartGrid,
  MainChartArea,
  SidebarArea,
  SmallChartArea,
  MediumChartArea,
  WideChartArea,
} from "./OptionsChartGrid"
import { ChartLayoutContainer } from "./ChartLayoutContainer"
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

/**
 * Example implementations showing how to use the new chart layout system
 * for the options calculator dashboard.
 */

// Sample data
const plData = [
  { price: 90, profitLoss: -200 },
  { price: 95, profitLoss: -100 },
  { price: 100, profitLoss: 0 },
  { price: 105, profitLoss: 500 },
  { price: 110, profitLoss: 1000 },
  { price: 115, profitLoss: 1500 },
]

const greeksData = [
  { greek: "Delta", value: 0.65 },
  { greek: "Gamma", value: 0.15 },
  { greek: "Theta", value: -0.05 },
  { greek: "Vega", value: 0.25 },
  { greek: "Rho", value: 0.10 },
]

const volatilityData = [
  { date: "Jan", iv: 25, hv: 22 },
  { date: "Feb", iv: 28, hv: 24 },
  { date: "Mar", iv: 32, hv: 30 },
  { date: "Apr", iv: 30, hv: 28 },
  { date: "May", iv: 27, hv: 25 },
]

const heatmapData = [
  { strike: 95, price: 95, pl: -150 },
  { strike: 95, price: 100, pl: -50 },
  { strike: 95, price: 105, pl: 50 },
  { strike: 100, price: 95, pl: -200 },
  { strike: 100, price: 100, pl: 0 },
  { strike: 100, price: 105, pl: 200 },
]

// Example 1: Default Layout (4x3 grid)
export function OptionsChartLayoutExample1() {
  return (
    <OptionsChartGrid layout="default">
      {/* Main P&L Chart - Large */}
      <MainChartArea>
        <ChartLayoutContainer
          title="Profit/Loss Profile"
          subtitle="Strategy payoff at expiration"
          value="$1,500"
          valueLabel="max profit"
          legend={[{ label: "P&L", color: "#10b981" }]}
          actions={
            <>
              <Button variant="ghost" size="icon">
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </>
          }
          chartHeight="full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plData}>
              <defs>
                <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="price" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip />
              <Area type="monotone" dataKey="profitLoss" stroke="#10b981" fill="url(#plGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartLayoutContainer>
      </MainChartArea>

      {/* Greeks Sidebar */}
      <SidebarArea>
        <ChartLayoutContainer title="Greeks" subtitle="Risk metrics" chartHeight="full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={greeksData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="greek" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartLayoutContainer>
      </SidebarArea>

      {/* Stats Card */}
      <SmallChartArea>
        <ChartLayoutContainer title="Break Even" subtitle="Price points" value="$102.50" chartHeight="sm">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">$102.50</div>
              <p className="mt-2 text-xs text-muted-foreground">Single break-even point</p>
            </div>
          </div>
        </ChartLayoutContainer>
      </SmallChartArea>

      {/* Volatility Chart */}
      <MediumChartArea>
        <ChartLayoutContainer
          title="Volatility"
          subtitle="Implied vs Historical"
          legend={[
            { label: "IV", color: "#3b82f6" },
            { label: "HV", color: "#ef4444" },
          ]}
          chartHeight="sm"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="iv" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="hv" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartLayoutContainer>
      </MediumChartArea>

      {/* Risk Metrics */}
      <SmallChartArea>
        <ChartLayoutContainer title="Position Delta" subtitle="Directional risk" value="0.65" chartHeight="sm">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">+0.65</div>
              <p className="mt-2 text-xs text-muted-foreground">Bullish position</p>
            </div>
          </div>
        </ChartLayoutContainer>
      </SmallChartArea>
    </OptionsChartGrid>
  )
}

// Example 2: Focus Main Layout (Large chart with supporting charts below)
export function OptionsChartLayoutExample2() {
  return (
    <div className="space-y-3">
      {/* Main Chart - Full Width */}
      <ChartLayoutContainer
        title="Profit/Loss Profile"
        subtitle="Multi-leg option strategy"
        value="$1,500"
        valueLabel="max profit"
        trend={{ value: 12.5, isPositive: true }}
        legend={[{ label: "Strategy P&L", color: "#10b981" }]}
        chartHeight="xl"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plData}>
            <defs>
              <linearGradient id="plGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="price" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip />
            <Area type="monotone" dataKey="profitLoss" stroke="#10b981" fill="url(#plGradient2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartLayoutContainer>

      {/* Supporting Charts */}
      <OptionsChartGrid layout="3-column">
        <ChartLayoutContainer title="Greeks Radar" subtitle="Risk profile" chartHeight="md">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={greeksData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="greek" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Radar name="Value" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartLayoutContainer>

        <ChartLayoutContainer
          title="Volatility Smile"
          subtitle="IV by strike"
          legend={[{ label: "Implied Vol", color: "#3b82f6" }]}
          chartHeight="md"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="iv" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartLayoutContainer>

        <ChartLayoutContainer title="Time Decay" subtitle="Theta impact" chartHeight="md">
          <div className="flex h-full flex-col justify-center space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">-$45</div>
              <p className="text-xs text-muted-foreground">Daily theta</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold">21 days</div>
              <p className="text-xs text-muted-foreground">to expiration</p>
            </div>
          </div>
        </ChartLayoutContainer>
      </OptionsChartGrid>
    </div>
  )
}

// Example 3: Two Column Layout (Side by side comparison)
export function OptionsChartLayoutExample3() {
  return (
    <OptionsChartGrid layout="2-column">
      <ChartLayoutContainer
        title="Bull Call Spread"
        subtitle="Conservative bullish strategy"
        value="$500"
        valueLabel="max profit"
        legend={[{ label: "P&L", color: "#10b981" }]}
        chartHeight="lg"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plData}>
            <defs>
              <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="price" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip />
            <Area type="monotone" dataKey="profitLoss" stroke="#10b981" fill="url(#bullGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartLayoutContainer>

      <ChartLayoutContainer
        title="Iron Condor"
        subtitle="Neutral income strategy"
        value="$300"
        valueLabel="max profit"
        legend={[{ label: "P&L", color: "#3b82f6" }]}
        chartHeight="lg"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={plData.map(d => ({ ...d, profitLoss: Math.min(d.profitLoss * 0.6, 300) }))}>
            <defs>
              <linearGradient id="condorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="price" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip />
            <Area type="monotone" dataKey="profitLoss" stroke="#3b82f6" fill="url(#condorGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartLayoutContainer>
    </OptionsChartGrid>
  )
}
