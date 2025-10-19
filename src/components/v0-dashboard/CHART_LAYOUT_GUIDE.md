# Chart Layout System Guide

A flexible, responsive chart layout system for the Options Calculator dashboard using shadcn/ui, Radix UI, and Recharts.

## Components

### 1. ChartLayoutContainer

A reusable container component that provides consistent styling and structure for all chart types.

**Features:**
- Flexible header layouts (default, compact, centered)
- Built-in support for titles, subtitles, and value displays
- Optional legend with customizable colors
- Action button support (export, refresh, etc.)
- Configurable chart heights
- Trend indicators

**Props:**
```tsx
interface ChartLayoutContainerProps {
  title: string                    // Main chart title
  subtitle?: string                // Optional subtitle/description
  value?: string | number          // Primary value to display
  valueLabel?: string              // Label for the value
  trend?: {                        // Optional trend indicator
    value: number
    isPositive: boolean
  }
  legend?: Array<{                 // Chart legend
    label: string
    color: string
  }>
  actions?: ReactNode              // Action buttons (export, refresh, etc.)
  children: ReactNode              // Chart content
  className?: string
  chartHeight?: "sm" | "md" | "lg" | "xl" | "full"
  headerLayout?: "default" | "compact" | "centered"
}
```

**Example Usage:**
```tsx
import { ChartLayoutContainer } from "@/components/v0-dashboard"
import { ResponsiveContainer, LineChart, Line } from "recharts"

<ChartLayoutContainer
  title="Profit/Loss Profile"
  subtitle="Strategy payoff at expiration"
  value="$1,500"
  valueLabel="max profit"
  trend={{ value: 12.5, isPositive: true }}
  legend={[
    { label: "P&L", color: "#10b981" }
  ]}
  chartHeight="lg"
>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      {/* Chart configuration */}
    </LineChart>
  </ResponsiveContainer>
</ChartLayoutContainer>
```

### 2. OptionsChartGrid

A flexible grid system for arranging multiple charts in various layouts.

**Available Layouts:**
- `default` - 4 columns × 3 rows (classic dashboard grid)
- `2-column` - Two equal columns
- `3-column` - Three equal columns
- `sidebar-left` - Main chart on right, sidebar on left
- `sidebar-right` - Main chart on left, sidebar on right
- `focus-main` - Large main chart with supporting charts below

**Example Usage:**
```tsx
import { OptionsChartGrid, MainChartArea, SidebarArea } from "@/components/v0-dashboard"

<OptionsChartGrid layout="default">
  <MainChartArea>
    {/* Large main chart - spans 3 columns × 2 rows */}
  </MainChartArea>

  <SidebarArea>
    {/* Sidebar content - spans 1 column × 2 rows */}
  </SidebarArea>
</OptionsChartGrid>
```

### 3. Grid Area Components

Helper components for positioning charts within the grid:

- **MainChartArea** - Large area (3 cols × 2 rows)
- **SidebarArea** - Sidebar area (1 col × 2 rows)
- **SmallChartArea** - Small area (1 col × 1 row)
- **MediumChartArea** - Medium area (2 cols × 1 row)
- **WideChartArea** - Wide area (3 cols × 1 row)
- **FullWidthArea** - Full width (4 cols × 1 row)

## Layout Examples

### Example 1: Default Dashboard Layout (4×3 Grid)

Perfect for a comprehensive dashboard with one main chart and multiple supporting metrics.

```tsx
import {
  OptionsChartGrid,
  MainChartArea,
  SidebarArea,
  SmallChartArea,
  MediumChartArea,
  ChartLayoutContainer
} from "@/components/v0-dashboard"

<OptionsChartGrid layout="default">
  {/* Main P&L Chart */}
  <MainChartArea>
    <ChartLayoutContainer
      title="Profit/Loss Profile"
      legend={[{ label: "P&L", color: "#10b981" }]}
      chartHeight="full"
    >
      {/* Large area chart */}
    </ChartLayoutContainer>
  </MainChartArea>

  {/* Greeks Sidebar */}
  <SidebarArea>
    <ChartLayoutContainer title="Greeks" chartHeight="full">
      {/* Greeks chart */}
    </ChartLayoutContainer>
  </SidebarArea>

  {/* Break Even Stats */}
  <SmallChartArea>
    <ChartLayoutContainer title="Break Even" value="$102.50">
      {/* Stats display */}
    </ChartLayoutContainer>
  </SmallChartArea>

  {/* Volatility Chart */}
  <MediumChartArea>
    <ChartLayoutContainer
      title="Volatility"
      legend={[
        { label: "IV", color: "#3b82f6" },
        { label: "HV", color: "#ef4444" }
      ]}
    >
      {/* Line chart */}
    </ChartLayoutContainer>
  </MediumChartArea>

  {/* Position Delta */}
  <SmallChartArea>
    <ChartLayoutContainer title="Position Delta" value="0.65">
      {/* Delta display */}
    </ChartLayoutContainer>
  </SmallChartArea>
</OptionsChartGrid>
```

### Example 2: Focus Main Layout

Large primary chart with supporting charts below.

```tsx
<div className="space-y-3">
  {/* Main Chart - Full Width */}
  <ChartLayoutContainer
    title="Profit/Loss Profile"
    value="$1,500"
    valueLabel="max profit"
    chartHeight="xl"
  >
    {/* Large primary chart */}
  </ChartLayoutContainer>

  {/* Supporting Charts */}
  <OptionsChartGrid layout="3-column">
    <ChartLayoutContainer title="Greeks Radar">
      {/* Radar chart */}
    </ChartLayoutContainer>

    <ChartLayoutContainer title="Volatility Smile">
      {/* Line chart */}
    </ChartLayoutContainer>

    <ChartLayoutContainer title="Time Decay">
      {/* Stats display */}
    </ChartLayoutContainer>
  </OptionsChartGrid>
</div>
```

### Example 3: Two Column Comparison

Side-by-side strategy comparison.

```tsx
<OptionsChartGrid layout="2-column">
  <ChartLayoutContainer
    title="Bull Call Spread"
    value="$500"
    valueLabel="max profit"
    chartHeight="lg"
  >
    {/* First strategy chart */}
  </ChartLayoutContainer>

  <ChartLayoutContainer
    title="Iron Condor"
    value="$300"
    valueLabel="max profit"
    chartHeight="lg"
  >
    {/* Second strategy chart */}
  </ChartLayoutContainer>
</OptionsChartGrid>
```

## Chart Heights

Available height options for `chartHeight` prop:
- `sm` - 200px minimum (compact metrics)
- `md` - 300px minimum (medium charts)
- `lg` - 400px minimum (standard charts)
- `xl` - 500px minimum (large feature charts)
- `full` - Fill available space (use in grid areas)

## Responsive Behavior

All layouts are fully responsive:
- **Mobile (default)**: Single column, stacked vertically
- **Tablet (md breakpoint)**: 2 columns
- **Desktop (lg breakpoint)**: Full grid layout (4 columns)

## Integration with Existing Charts

The system works seamlessly with your existing chart components:

```tsx
import { ChartLayoutContainer } from "@/components/v0-dashboard"
import { PLHeatmap } from "@/components/calculator/PLHeatmap"
import { GreeksRadarChart } from "@/components/calculator/GreeksRadarChart"

<OptionsChartGrid layout="2-column">
  <ChartLayoutContainer title="P&L Heatmap">
    <PLHeatmap data={heatmapData} />
  </ChartLayoutContainer>

  <ChartLayoutContainer title="Greeks Analysis">
    <GreeksRadarChart data={greeksData} />
  </ChartLayoutContainer>
</OptionsChartGrid>
```

## Best Practices

1. **Use ChartLayoutContainer** for all charts to maintain consistency
2. **Choose appropriate heights**:
   - Use `"full"` in grid areas that define their own size
   - Use fixed heights (`sm`, `md`, `lg`, `xl`) outside grid layouts
3. **Leverage legends** instead of inline text for chart data labels
4. **Add actions** (export, refresh) for interactive charts
5. **Show key metrics** in the header when relevant (max profit, current value, etc.)
6. **Use trend indicators** to highlight positive/negative changes
7. **Keep titles concise** and use subtitles for additional context

## Tech Stack

- **Components**: shadcn/ui (New York variant) with Radix UI primitives
- **Charts**: Recharts (Area, Line, Bar, Radar, etc.)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: lucide-react
- **State**: Compatible with Zustand (your app's state management)

## File Structure

```
src/components/v0-dashboard/
├── ChartLayoutContainer.tsx        # Reusable chart container
├── OptionsChartGrid.tsx            # Grid layout system
├── OptionsChartLayoutExample.tsx   # Implementation examples
├── OptionsChartLayout.tsx          # Updated with new system
├── CHART_LAYOUT_GUIDE.md          # This file
└── index.ts                        # Exports
```

## See Also

- [OptionsChartLayoutExample.tsx](./OptionsChartLayoutExample.tsx) - Complete working examples
- [README.md](./README.md) - Original dashboard components documentation
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Integration instructions
