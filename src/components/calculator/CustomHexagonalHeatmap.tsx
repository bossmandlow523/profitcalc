/**
 * Custom Hexagonal Heatmap Component
 * SVG-based heatmap with hexagonal cells - no MUI X Pro license required
 */

import { useState, useRef, useEffect } from 'react'
import { red, green, orange } from '@mui/material/colors'

interface CustomHexagonalHeatmapProps {
  data: number[][] // [priceIndex][dateIndex]
  xLabels: string[] // Date labels
  yLabels: string[] // Price labels
  minValue: number
  maxValue: number
  width?: number
  height?: number
  monthHeader?: string
  showAllLabels?: boolean // Whether to show all cell labels or only on hover
}

export function CustomHexagonalHeatmap({
  data,
  xLabels,
  yLabels,
  minValue,
  maxValue,
  width,
  height,
  monthHeader,
  showAllLabels = false
}: CustomHexagonalHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 900, height: 450 })

  // Observe container size changes
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: containerWidth, height: containerHeight } =
          containerRef.current.getBoundingClientRect()

        // Only update if we have valid dimensions
        if (containerWidth > 0 && containerHeight > 0) {
          // Use provided dimensions or fall back to container size with limits
          // Increased minimum by 25% total: 600 -> 750, 400 -> 500
          // Cap width at 1500px (1200 * 1.25) and height at 750px (600 * 1.25) to prevent excessive growth
          const finalWidth = width || Math.min(Math.max(containerWidth, 750), 1500)
          const finalHeight = height || Math.min(Math.max(containerHeight, 500), 750)

          setDimensions({
            width: finalWidth,
            height: finalHeight
          })
        }
      }
    }

    // Delay initial measurement to ensure container is rendered
    const timeoutId = setTimeout(updateDimensions, 0)

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize events
      requestAnimationFrame(updateDimensions)
    })
    resizeObserver.observe(containerRef.current)

    // Also listen to window resize
    window.addEventListener('resize', updateDimensions)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [width, height])

  if (!data || data.length === 0 || !xLabels || !yLabels) {
    return <div className="text-gray-400">No data available</div>
  }

  const rows = data.length
  const cols = xLabels.length

  // Calculate cell dimensions - make padding responsive
  const svgWidth = dimensions.width
  const svgHeight = dimensions.height

  const leftPadding = Math.max(60, svgWidth * 0.08)
  const rightPadding = Math.max(100, svgWidth * 0.12) // Space for legend
  const topPadding = Math.max(60, svgHeight * 0.12)
  const bottomPadding = Math.max(30, svgHeight * 0.05)

  // Honeycomb hexagon geometry
  // For a perfect honeycomb, hexagons need to overlap vertically
  // Horizontal spacing: width = radius * sqrt(3)
  // Vertical spacing: height = radius * 1.5 (3/4 overlap)
  const availableWidth = svgWidth - leftPadding - rightPadding
  const availableHeight = svgHeight - topPadding - bottomPadding

  // Calculate radius based on space constraints
  // For honeycomb: horizontal = cols * (radius * sqrt(3)), vertical = rows * (radius * 1.5)
  const radiusFromWidth = availableWidth / (cols * Math.sqrt(3))
  const radiusFromHeight = availableHeight / (rows * 1.5 + 0.5) // +0.5 for top/bottom half
  const hexRadius = Math.min(radiusFromWidth, radiusFromHeight) * 0.99 // Increased from 0.98 to utilize the larger container

  // Hexagon dimensions
  const hexWidth = hexRadius * Math.sqrt(3)
  const hexHeight = hexRadius * 1.5

  /**
   * Get color for a value using diverging color scale
   */
  const getColor = (value: number): string => {
    const range = Math.max(Math.abs(minValue), Math.abs(maxValue))
    if (range === 0) return orange[500]

    const normalized = value / range // -1 to 1

    if (normalized > 0) {
      // Positive - interpolate from orange to green
      const t = Math.min(normalized, 1)
      return interpolateColor(orange[500], green[700], t)
    } else {
      // Negative - interpolate from orange to red
      const t = Math.min(Math.abs(normalized), 1)
      return interpolateColor(orange[500], red[700], t)
    }
  }

  /**
   * Interpolate between two hex colors
   */
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const c1 = hexToRgb(color1)
    const c2 = hexToRgb(color2)

    const r = Math.round(c1.r + (c2.r - c1.r) * factor)
    const g = Math.round(c1.g + (c2.g - c1.g) * factor)
    const b = Math.round(c1.b + (c2.b - c1.b) * factor)

    return `rgb(${r}, ${g}, ${b})`
  }

  /**
   * Convert hex color to RGB
   */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 }
  }

  /**
   * Generate hexagon path
   */
  const getHexagonPath = (cx: number, cy: number, radius: number): string => {
    const points: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')} Z`
  }

  /**
   * Format value for display
   */
  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return Math.round(value).toString()
  }

  /**
   * Generate legend gradient stops
   */
  const legendStops = [
    { offset: '0%', color: red[700], label: minValue?.toFixed(0) || '0' },
    { offset: '50%', color: orange[500], label: '0' },
    { offset: '100%', color: green[700], label: maxValue?.toFixed(0) || '0' }
  ]

  return (
    <div ref={containerRef} className="w-full h-full max-h-full flex flex-col overflow-hidden">
      {/* Month Header */}
      {monthHeader && (
        <div className="text-left text-sm text-[#B4B7C5] py-2 pl-20 flex-shrink-0">
          {monthHeader}
        </div>
      )}

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <svg width={svgWidth} height={svgHeight} className="max-w-full max-h-full">
        <defs>
          {/* Gradient for legend */}
          <linearGradient id="heatmapGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={red[700]} />
            <stop offset="50%" stopColor={orange[500]} />
            <stop offset="100%" stopColor={green[700]} />
          </linearGradient>
        </defs>

        {/* X-axis labels (dates) */}
        {xLabels.map((label, colIdx) => {
          const cx = leftPadding + colIdx * hexWidth + hexWidth / 2
          return (
            <text
              key={`xlabel-${colIdx}`}
              x={cx}
              y={topPadding - 15}
              textAnchor="middle"
              fill="#B4B7C5"
              fontSize="11"
              transform={`rotate(-60, ${cx}, ${topPadding - 15})`}
            >
              {label}
            </text>
          )
        })}

        {/* Y-axis labels (prices) */}
        {yLabels.map((label, rowIdx) => {
          if (!label) return null // Skip empty labels
          const cy = topPadding + rowIdx * hexHeight + hexRadius
          return (
            <text
              key={`ylabel-${rowIdx}`}
              x={leftPadding - 10}
              y={cy}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#B4B7C5"
              fontSize="11"
            >
              {label}
            </text>
          )
        })}

        {/* Heatmap cells */}
        {data.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            // Honeycomb positioning: alternating rows are offset horizontally
            const xOffset = (rowIdx % 2) * (hexWidth / 2)
            const cx = leftPadding + colIdx * hexWidth + hexWidth / 2 + xOffset
            const cy = topPadding + rowIdx * hexHeight + hexRadius

            const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx
            const color = getColor(value)
            const textColor = 'white' // Always use white for maximum contrast

            // Smart label visibility: only show if hex is big enough or on hover
            const minRadiusForLabel = 10 // Reduced from 12 to show labels more often
            const shouldShowLabel = showAllLabels || isHovered || hexRadius >= minRadiusForLabel

            return (
              <g
                key={`cell-${rowIdx}-${colIdx}`}
                onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                onMouseLeave={() => setHoveredCell(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={getHexagonPath(cx, cy, hexRadius)}
                  fill={color}
                  stroke={isHovered ? '#ffffff' : 'none'}
                  strokeWidth={isHovered ? 2 : 0}
                  opacity={isHovered ? 1 : 0.9}
                />
                {shouldShowLabel && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={textColor}
                    fontSize={isHovered ? '0.9em' : '0.7em'}
                    fontWeight="700"
                    pointerEvents="none"
                    style={{
                      textShadow: '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)'
                    }}
                  >
                    {formatValue(value)}
                  </text>
                )}
                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 35}
                      y={cy - hexRadius - 35}
                      width={70}
                      height={28}
                      fill="#1a1a1a"
                      stroke="#ffffff"
                      strokeWidth={1}
                      rx={4}
                      pointerEvents="none"
                    />
                    <text
                      x={cx}
                      y={cy - hexRadius - 26}
                      textAnchor="middle"
                      fill="#00E1D4"
                      fontSize="0.7em"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      P/L: ${value.toLocaleString()}
                    </text>
                    <text
                      x={cx}
                      y={cy - hexRadius - 14}
                      textAnchor="middle"
                      fill="#B4B7C5"
                      fontSize="0.6em"
                      pointerEvents="none"
                    >
                      {yLabels[rowIdx]} @ {xLabels[colIdx]}
                    </text>
                  </g>
                )}
              </g>
            )
          })
        )}

        {/* Legend */}
        <g transform={`translate(${svgWidth - rightPadding + 40}, ${topPadding})`}>
          {/* Legend gradient bar */}
          <rect
            x={0}
            y={0}
            width={20}
            height={svgHeight - topPadding - bottomPadding}
            fill="url(#heatmapGradient)"
            stroke="#333333"
            strokeWidth={1}
          />

          {/* Legend labels */}
          <text
            x={30}
            y={0}
            fill="#B4B7C5"
            fontSize="11"
            dominantBaseline="hanging"
          >
            ${legendStops[2]?.label || '0'}
          </text>
          <text
            x={30}
            y={(svgHeight - topPadding - bottomPadding) / 2}
            fill="#B4B7C5"
            fontSize="11"
            dominantBaseline="middle"
          >
            ${legendStops[1]?.label || '0'}
          </text>
          <text
            x={30}
            y={svgHeight - topPadding - bottomPadding}
            fill="#B4B7C5"
            fontSize="11"
            dominantBaseline="auto"
          >
            ${legendStops[0]?.label || '0'}
          </text>
        </g>

        {/* Axis lines */}
        <line
          x1={leftPadding}
          y1={topPadding}
          x2={leftPadding}
          y2={svgHeight - bottomPadding}
          stroke="#333333"
          strokeWidth={1}
        />
        <line
          x1={leftPadding}
          y1={topPadding}
          x2={svgWidth - rightPadding}
          y2={topPadding}
          stroke="#333333"
          strokeWidth={1}
        />
      </svg>
      </div>
    </div>
  )
}
