import { Card } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const metrics = [
  {
    label: "Response Time",
    value: "245ms",
    change: -12,
    trend: "down",
  },
  {
    label: "Success Rate",
    value: "99.8%",
    change: 0.3,
    trend: "up",
  },
  {
    label: "Error Rate",
    value: "0.2%",
    change: -0.1,
    trend: "down",
  },
  {
    label: "Throughput",
    value: "1.2K/s",
    change: 8.5,
    trend: "up",
  },
]

export function MetricCard() {
  return (
    <Card className="flex h-full flex-col p-6">
      <h3 className="mb-4 text-sm font-medium text-card-foreground">Key Metrics</h3>
      <div className="flex flex-1 flex-col justify-between gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-card-foreground">{metric.value}</span>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {metric.trend === "up" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

