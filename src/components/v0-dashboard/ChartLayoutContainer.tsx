import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ChartLayoutContainerProps {
  title: string
  subtitle?: string
  value?: string | number
  valueLabel?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  legend?: Array<{ label: string; color: string }>
  actions?: ReactNode
  children: ReactNode
  className?: string
  chartHeight?: "sm" | "md" | "lg" | "xl" | "full"
  headerLayout?: "default" | "compact" | "centered"
}

const heightClasses = {
  sm: "min-h-[200px]",
  md: "min-h-[300px]",
  lg: "min-h-[400px]",
  xl: "min-h-[500px]",
  full: "h-full",
}

export function ChartLayoutContainer({
  title,
  subtitle,
  value,
  valueLabel,
  trend,
  legend,
  actions,
  children,
  className,
  chartHeight = "md",
  headerLayout = "default",
}: ChartLayoutContainerProps) {
  return (
    <Card className={cn("flex h-full flex-col p-6", className)}>
      {/* Header Section */}
      <div
        className={cn(
          "mb-4",
          headerLayout === "centered" && "text-center",
          headerLayout !== "centered" && "flex items-start justify-between"
        )}
      >
        <div className={cn(headerLayout === "centered" && "mx-auto")}>
          <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}

          {/* Value Display */}
          {value !== undefined && (
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-card-foreground">
                {value}
              </span>
              {valueLabel && (
                <span className="text-sm text-muted-foreground">
                  {valueLabel}
                </span>
              )}
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions/Legend Section */}
        <div className="flex flex-col gap-3">
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {legend && legend.length > 0 && (
            <div className="flex gap-4 text-xs">
              {legend.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className={cn("flex-1", heightClasses[chartHeight])}>
        {children}
      </div>
    </Card>
  )
}
