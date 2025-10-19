import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type GridLayout = "default" | "2-column" | "3-column" | "sidebar-left" | "sidebar-right" | "focus-main"

interface OptionsChartGridProps {
  children: ReactNode
  layout?: GridLayout
  className?: string
}

/**
 * Flexible grid component for arranging charts in the dashboard.
 *
 * Layouts:
 * - default: 4 columns x 3 rows (like DashboardGrid)
 * - 2-column: Equal width columns, responsive
 * - 3-column: Three equal columns for multiple charts
 * - sidebar-left: Main chart on right (3 cols) + sidebar on left (1 col)
 * - sidebar-right: Main chart on left (3 cols) + sidebar on right (1 col)
 * - focus-main: Large main chart with smaller supporting charts below
 */
export function OptionsChartGrid({
  children,
  layout = "default",
  className,
}: OptionsChartGridProps) {
  const layoutClasses: Record<GridLayout, string> = {
    default: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3",
    "2-column": "grid grid-cols-1 gap-3 md:grid-cols-2",
    "3-column": "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
    "sidebar-left": "grid grid-cols-1 gap-3 lg:grid-cols-4",
    "sidebar-right": "grid grid-cols-1 gap-3 lg:grid-cols-4",
    "focus-main": "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  )
}

// Grid item wrapper components for specific layouts
interface GridItemProps {
  children: ReactNode
  className?: string
}

export function MainChartArea({ children, className }: GridItemProps) {
  return (
    <div className={cn("lg:col-span-3 lg:row-span-2", className)}>
      {children}
    </div>
  )
}

export function SidebarArea({ children, className }: GridItemProps) {
  return <div className={cn("lg:row-span-2", className)}>{children}</div>
}

export function SmallChartArea({ children, className }: GridItemProps) {
  return <div className={cn("lg:col-span-1 lg:row-span-1", className)}>{children}</div>
}

export function MediumChartArea({ children, className }: GridItemProps) {
  return <div className={cn("lg:col-span-2 lg:row-span-1", className)}>{children}</div>
}

export function WideChartArea({ children, className }: GridItemProps) {
  return <div className={cn("lg:col-span-3 lg:row-span-1", className)}>{children}</div>
}

export function FullWidthArea({ children, className }: GridItemProps) {
  return <div className={cn("lg:col-span-4", className)}>{children}</div>
}
