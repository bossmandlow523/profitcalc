import { StrategyGrid } from './StrategyGrid'
import { OptionFinderSidebar } from './OptionFinderSidebar'
import { Separator } from '../ui/separator'
import { ContainerTextFlip } from '../container-text-flip'
import { TextColor } from '../ui/text-color'

interface HomePageProps {
  onSelectStrategy: (strategy: string) => void
}

export function HomePage({ onSelectStrategy }: HomePageProps) {
  return (
    <main className="relative z-10 flex-1">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Hero Section with Animated Gradient Text */}
            <div className="text-center mb-10 animate-fade-in">
              <TextColor
                words={["Options", "Profit", "Calculator"]}
              />
            </div>

            <Separator className="mb-8 bg-border/50" />

            {/* Strategy Selection Header */}
            <div className="mb-6 animate-slide-up">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Select Your Strategy
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose from basic options, spreads, advanced strategies, or create custom combinations
              </p>
            </div>

            {/* Strategy Grid */}
            <StrategyGrid onSelectStrategy={onSelectStrategy} />
          </div>

          {/* Right Sidebar */}
          <OptionFinderSidebar />
        </div>
      </div>
    </main>
  )
}
