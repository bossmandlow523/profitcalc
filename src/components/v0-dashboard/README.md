# V0 Dashboard Components

This folder contains dashboard layout components adapted from the v0-hello repository.

## Components

- **DashboardGrid**: Main grid layout container with responsive breakpoints
- **ChartCard**: Large chart display with area charts for data visualization
- **MetricCard**: Key metrics display with trend indicators
- **ActivityCard**: Recent activity timeline
- **StatsCard**: Single stat display with progress bar
- **PerformanceCard**: Regional performance metrics grid

## Usage

```tsx
import { DashboardGrid } from "@/components/v0-dashboard"

export function MyDashboard() {
  return (
    <div className="container mx-auto p-4">
      <DashboardGrid />
    </div>
  )
}
```

## Grid Layout

The dashboard uses a responsive CSS Grid layout:
- Mobile: Single column
- Tablet (md): 2 columns
- Desktop (lg): 4 columns x 3 rows

### Layout Structure:
```
┌─────────────────────────┬───────┐
│                         │       │
│      ChartCard          │Metric │
│      (3x2)              │Card   │
│                         │(1x2)  │
├─────────┬───────────────┼───────┤
│Stats    │  Activity     │Perf   │
│Card     │  Card         │Card   │
│(1x1)    │  (2x1)        │(1x1)  │
└─────────┴───────────────┴───────┘
```

## Customization

Each card component accepts standard props and can be customized:
- Replace mock data with real API calls
- Adjust colors via Tailwind classes
- Modify chart configurations
- Change grid layout spans

## Integration Notes

- Uses existing Card component from `@/components/ui/card`
- Uses existing recharts library (already in dependencies)
- Compatible with your Tailwind CSS configuration
- Follows your project's TypeScript patterns
- Uses lucide-react icons (already installed)

