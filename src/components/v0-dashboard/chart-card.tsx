"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { time: "00:00", requests: 2400, errors: 24 },
  { time: "04:00", requests: 1398, errors: 18 },
  { time: "08:00", requests: 3800, errors: 32 },
  { time: "12:00", requests: 3908, errors: 28 },
  { time: "16:00", requests: 4800, errors: 35 },
  { time: "20:00", requests: 3800, errors: 22 },
  { time: "23:59", requests: 4300, errors: 26 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
        <p className="text-xs font-medium">{payload[0].payload.time}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartCard() {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-card-foreground">Request Volume</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-card-foreground">24.5K</span>
            <span className="text-sm text-muted-foreground">requests</span>
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Requests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Errors</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#fillRequests)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="errors"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#fillErrors)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

