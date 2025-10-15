import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const strategies = {
  basic: {
    title: 'Basic',
    color: 'from-blue-600 to-blue-700',
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
          className="glass-card-strong border-2 border-border/60 shadow-xl hover:shadow-2xl hover:border-border/80 transition-all duration-300 relative group overflow-hidden hover:-translate-y-1"
        >
          {/* Static gradient overlay - always visible */}
          <div className={`absolute inset-0 bg-gradient-to-br ${strategy.color} opacity-[0.45] pointer-events-none`} />

          {/* Subtle inner glow */}
          <div className={`absolute inset-0 bg-gradient-to-t ${strategy.color} opacity-[0.15] pointer-events-none`} />

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
              <button
                key={item}
                type="button"
                onClick={() => handleClick(item)}
                className={`w-full text-left px-4 py-3 bg-card/60 rounded-lg border border-border/40 text-sm font-medium text-foreground/90 shadow transition-all duration-200 cursor-pointer hover:translate-x-2 hover:scale-[1.01] active:scale-98 hover:shadow-lg ${strategy.hoverColor} hover:text-foreground hover:font-semibold hover:border-border/60`}
              >
                <span className="flex items-center justify-between">
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
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
