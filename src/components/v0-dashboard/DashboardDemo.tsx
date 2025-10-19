import { DashboardGrid } from "./dashboard-grid"

/**
 * Demo component showing how to integrate the V0 Dashboard
 * 
 * This can be used as a chart layout section in your options calculator
 * or as a standalone dashboard view.
 */
export function DashboardDemo() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Layout</h1>
        <p className="text-muted-foreground mt-2">
          Responsive dashboard grid adapted from v0-hello repository
        </p>
      </div>
      
      <DashboardGrid />
    </div>
  )
}

