import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { GlowButton } from '../ui/glow-button'

const strategies = {
  basic: {
    title: 'Basic',
    color: 'from-blue-600 to-blue-700',
    glowColor: '#3b82f6',
    badgeVariant: 'default' as const,
    hoverColor: 'hover:border-blue-400/50 hover:bg-blue-500/5',
    items: [
      'Long Call',
      'Long Put',
      'Covered Call',
      'Cash Secured Put',
      'Naked Call',
      'Naked Put',
    ],
  },
  spreads: {
    title: 'Spreads',
    color: 'from-emerald-600 to-teal-600',
    glowColor: '#10b981',
    badgeVariant: 'secondary' as const,
    hoverColor: 'hover:border-emerald-400/50 hover:bg-emerald-500/5',
    items: [
      'Credit Spread',
      'Call Spread',
      'Put Spread',
      "Poor Man's Covered Call",
      'Calendar Spread',
      'Ratio Back Spread',
    ],
  },
  advanced: {
    title: 'Advanced',
    color: 'from-purple-600 to-violet-600',
    glowColor: '#a855f7',
    badgeVariant: 'default' as const,
    hoverColor: 'hover:border-purple-400/50 hover:bg-purple-500/5',
    items: [
      'Iron Condor',
      'Butterfly',
      'Collar',
      'Diagonal Spread',
      'Double Diagonal',
      'Straddle',
      'Strangle',
      'Covered Strangle',
      'Synthetic Put',
      'Reverse Conversion',
    ],
  },
  custom: {
    title: 'Custom',
    color: 'from-orange-600 to-red-600',
    glowColor: '#f97316',
    badgeVariant: 'destructive' as const,
    hoverColor: 'hover:border-orange-400/50 hover:bg-orange-500/5',
    items: ['8 Legs', '6 Legs', '5 Legs', '4 Legs', '3 Legs', '2 Legs'],
  },
}

interface StrategyGridProps {
  onSelectStrategy: (strategy: string) => void
}

export function StrategyGrid({ onSelectStrategy }: StrategyGridProps) {
  const handleClick = (item: string) => {
    console.log('Strategy clicked:', item)
    onSelectStrategy(item)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up relative z-20 pb-8">
      {Object.entries(strategies).map(([key, strategy]) => (
        <Card
          key={key}
          className="relative group overflow-hidden hover:-translate-y-1 transition-all duration-500 backdrop-blur-[2px] bg-background/20"
          style={{
            border: 'none',
            boxShadow: `
              0 0 6px rgba(0,0,0,0.03),
              0 2px 6px rgba(0,0,0,0.08),
              inset 3px 3px 0.5px -3px rgba(0,0,0,0.9),
              inset -3px -3px 0.5px -3px rgba(0,0,0,0.85),
              inset 1px 1px 1px -0.5px rgba(0,0,0,0.6),
              inset -1px -1px 1px -0.5px rgba(0,0,0,0.6),
              inset 0 0 6px 6px rgba(0,0,0,0.12),
              inset 0 0 2px 2px rgba(0,0,0,0.06),
              0 0 12px rgba(255,255,255,0.15),
              0 0 0 1px ${strategy.glowColor}50
            `,
          }}
        >
          {/* Colored glass tint overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-[0.15] pointer-events-none rounded-[inherit]`}
          />

          {/* Glass depth shadow effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-lg transition-all"
            style={{
              boxShadow: `
                0 0 8px rgba(0,0,0,0.03),
                0 2px 6px rgba(0,0,0,0.08),
                inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09),
                inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85),
                inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
                inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
                inset 0 0 6px 6px rgba(255,255,255,0.12),
                inset 0 0 2px 2px rgba(255,255,255,0.06),
                0 0 12px rgba(0,0,0,0.15)
              `,
            }}
          />

          {/* Hover shimmer effect */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <CardHeader className="pb-4 space-y-0 relative border-b border-border/30">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="text-foreground drop-shadow-sm">{strategy.title}</span>
              <Badge variant={strategy.badgeVariant} className="text-xs font-semibold shadow-sm">
                {strategy.items.length}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 relative pt-5">
            {strategy.items.map((item) => (
              <GlowButton
                key={item}
                glowColor={strategy.glowColor}
                onClick={() => handleClick(item)}
                className="hover:scale-[1.02] active:scale-98 transition-transform"
              >
                <span>{item}</span>
                <svg
                  className="w-4 h-4 opacity-40 hover:opacity-70 transition-all"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </GlowButton>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
