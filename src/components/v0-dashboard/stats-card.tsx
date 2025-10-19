import { Card } from "@/components/ui/card"

export function StatsCard() {
  return (
    <Card className="flex h-full flex-col p-6">
      <h3 className="mb-2 text-sm font-medium text-card-foreground">Active Users</h3>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-card-foreground">1,284</span>
          <span className="text-sm text-muted-foreground">online</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[68%] rounded-full bg-primary" />
          </div>
          <span className="text-xs text-muted-foreground">68% capacity</span>
        </div>
      </div>
    </Card>
  )
}

