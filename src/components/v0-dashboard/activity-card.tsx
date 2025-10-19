import { Card } from "@/components/ui/card"

const activities = [
  {
    event: "API Request",
    path: "/api/users",
    status: "success",
    time: "2s ago",
  },
  {
    event: "Database Query",
    path: "SELECT * FROM orders",
    status: "success",
    time: "5s ago",
  },
  {
    event: "Cache Miss",
    path: "/api/products",
    status: "warning",
    time: "12s ago",
  },
  {
    event: "API Request",
    path: "/api/checkout",
    status: "success",
    time: "18s ago",
  },
]

export function ActivityCard() {
  return (
    <Card className="flex h-full flex-col p-6">
      <h3 className="mb-4 text-sm font-medium text-card-foreground">Recent Activity</h3>
      <div className="flex-1 space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  activity.status === "success"
                    ? "bg-green-500"
                    : activity.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">{activity.event}</p>
                <p className="text-xs text-muted-foreground font-mono">{activity.path}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

