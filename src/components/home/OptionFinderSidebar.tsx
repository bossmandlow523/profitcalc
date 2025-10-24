import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ArrowRight, BookOpen } from 'lucide-react'

interface OptionFinderSidebarProps {
  onNavigateToStrategies?: () => void
}

export function OptionFinderSidebar({ onNavigateToStrategies }: OptionFinderSidebarProps = {}) {
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

      {/* Strategy Help Section */}
      <Card className="glass-card-strong border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center">
            <Badge variant="secondary" className="w-full py-2">
              Updates
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Need Help Picking a Strategy?
              </h3>
            </div>
          </div>

          <p className="text-foreground/80 text-sm leading-relaxed">
            Explore <span className="font-semibold text-purple-400">20+ options strategies</span> with detailed breakdowns covering when to use them, how they work, and what risks they carry. From basic calls and puts to advanced iron condors and multi-leg positions.
          </p>

          <Button
            onClick={onNavigateToStrategies}
            className="group w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            View All Strategies
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
