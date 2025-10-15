import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Sparkles, TrendingUp, Shield, AlertCircle, Globe } from 'lucide-react'

const updates = [
  {
    icon: Sparkles,
    title: 'Ad-Free Experience',
    description: 'with our Membership program',
    color: 'text-primary',
    borderColor: 'border-primary/30',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Cash Secured Put',
    description: 'calculator added',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-400/30',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: "Poor Man's Covered Call",
    description: 'calculator added',
    color: 'text-purple-500',
    borderColor: 'border-purple-400/30',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: AlertCircle,
    title: 'Find the best spreads',
    description: 'and short options',
    color: 'text-orange-500',
    borderColor: 'border-orange-400/30',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Globe,
    title: 'Support for Canadian MX',
    description: 'options',
    color: 'text-red-500',
    borderColor: 'border-red-400/30',
    bgColor: 'bg-red-500/10',
  },
]

export function OptionFinderSidebar() {
  return (
    <aside className="w-full lg:w-80 space-y-5">
      {/* Option Finder CTA */}
      <Card className="glass-card-strong border-primary/30 shadow-lg animate-float">
        <CardHeader className="pb-4">
          <CardTitle className="text-center">
            <Badge className="w-full py-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary">
              Try our Option Finder
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter an expected future stock price, and the Option Finder will suggest the best call or put option that maximises your profit.
          </p>
          <Button className="shimmer-effect w-full bg-gradient-to-r from-primary via-secondary to-purple-500 hover:from-secondary hover:to-primary text-white font-semibold py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50">
            Use Option Finder
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            or{' '}
            <span className="text-primary hover:text-secondary underline cursor-pointer transition-colors">
              read more about it
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Updates Section */}
      <Card className="glass-card-strong border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center">
            <Badge variant="secondary" className="w-full py-2">
              Updates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {updates.map((update, index) => {
            const Icon = update.icon
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 ${update.bgColor} rounded-lg border ${update.borderColor} hover:border-primary/40 transition-all duration-200 cursor-pointer group`}
              >
                <div className={`mt-0.5 flex-shrink-0 ${update.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {update.title}
                  </h4>
                  <p className="text-muted-foreground text-xs">{update.description}</p>
                </div>
              </div>
            )
          })}
          <div className="text-center pt-2">
            <Button
              variant="link"
              className="text-primary hover:text-secondary text-sm font-medium h-auto p-0"
            >
              More updates →
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
