import { Card } from "@/components/ui/card"

const regions = [
  { name: "US East", latency: 45, status: "optimal" },
  { name: "EU West", latency: 78, status: "optimal" },
  { name: "Asia Pacific", latency: 124, status: "good" },
  { name: "US West", latency: 52, status: "optimal" },
]

export function PerformanceCard() {
  return (
    <Card className="flex h-full flex-col p-6">
      <h3 className="mb-4 text-sm font-medium text-card-foreground">Regional Performance</h3>
      <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
        {regions.map((region) => (
          <div key={region.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{region.name}</span>
              <div className={`h-1.5 w-1.5 rounded-full ${region.status === "optimal" ? "bg-green-500" : "bg-yellow-500"}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-card-foreground">{region.latency}</span>
              <span className="text-xs text-muted-foreground">ms</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

