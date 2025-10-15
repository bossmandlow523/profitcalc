import { StrategyGrid } from './StrategyGrid'
import { OptionFinderSidebar } from './OptionFinderSidebar'
import { Separator } from '../ui/separator'
import { ContainerTextFlip } from '../container-text-flip'

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
            {/* Hero Section */}
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Options Profit
                <span className="block mt-2" style={{
                  background: 'transparent',
                  color: 'transparent'
                }}>
                  <div className="inline-block">
                    <ContainerTextFlip
                      words={["Calculator", "Analyzer", "Simulator", "Optimizer"]}
                      interval={3000}
                      animationDuration={700}
                      className="text-3xl lg:text-5xl"
                      textClassName="text-white font-bold"
                    />
                  </div>
                </span>
              </h1>

              {/* Faster Data/Money Section */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="inline-block rounded-lg pt-2 pb-3 px-6 text-center text-4xl font-bold text-purple-600 md:text-7xl dark:text-purple-400 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db] dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]">
                  Faster
                </div>
                <ContainerTextFlip
                  words={["data", "Money"]}
                  wordColors={["#f97316", "#22c55e"]}
                  interval={3000}
                  animationDuration={700}
                />
              </div>
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
