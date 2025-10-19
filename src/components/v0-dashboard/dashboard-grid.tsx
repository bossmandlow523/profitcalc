import { MetricCard } from "./metric-card"
import { ChartCard } from "./chart-card"
import { ActivityCard } from "./activity-card"
import { StatsCard } from "./stats-card"
import { PerformanceCard } from "./performance-card"

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
      {/* Large container - spans 3 columns and 2 rows */}
      <div className="lg:col-span-3 lg:row-span-2">
        <ChartCard />
      </div>

      {/* Medium container - spans 1 column and 2 rows */}
      <div className="lg:row-span-2">
        <MetricCard />
      </div>

      {/* Small container - spans 1 column and 1 row */}
      <div className="lg:row-span-1">
        <StatsCard />
      </div>

      {/* Medium container - spans 2 columns and 1 row */}
      <div className="lg:col-span-2 lg:row-span-1">
        <ActivityCard />
      </div>

      {/* Small container - spans 1 column and 1 row */}
      <div className="lg:col-span-1 lg:row-span-1">
        <PerformanceCard />
      </div>
    </div>
  )
}

