import { StrategyGrid } from './StrategyGrid'
import { OptionFinderSidebar } from './OptionFinderSidebar'
import { Separator } from '../ui/separator'
import { ContainerTextFlip } from '../container-text-flip'
import { TextColor } from '../ui/text-color'
import { Typewriter } from '../ui/typewriter'

interface HomePageProps {
  onSelectStrategy: (strategy: string) => void
}

export function HomePage({ onSelectStrategy }: HomePageProps) {
  return (
    <main className="relative z-10 flex-1">
      {/* Main Content Container */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Sticky on large screens */}
          <div className="hidden xl:block w-72 flex-shrink-0 -ml-4">
            <div className="sticky top-8">
              <OptionFinderSidebar />
            </div>
          </div>

          {/* Center Content */}
          <div className="flex-1 max-w-[1400px] mx-auto pl-12">
            {/* Hero Section - Animated Gradient Text */}
            <div className="text-center mb-4 animate-fade-in">
              <TextColor
                words={["Options", "Profit", "Calculator"]}
              />
            </div>

            <Separator className="mb-2 bg-border/50" />

            {/* Strategy Selection Header - Independent */}
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Select Your Strategy
              </h2>
              <div className="text-lg text-foreground/90 max-w-3xl">
                <span>Choose from </span>
                <Typewriter
                  text={[
                    "basic options",
                    "spreads",
                    "advanced strategies",
                    "custom combinations"
                  ]}
                  speed={50}
                  initialDelay={300}
                  waitTime={2000}
                  deleteSpeed={30}
                  loop={true}
                  showCursor={true}
                  cursorChar="_"
                  className="text-lg font-semibold text-primary brightness-125"
                />
              </div>
            </div>

            {/* Strategy Grid - Separate container */}
            <div className="mb-12 mt-4">
              <StrategyGrid onSelectStrategy={onSelectStrategy} />
            </div>
          </div>

          {/* Right Spacer - Hidden on smaller screens */}
          <div className="hidden xl:block w-52 flex-shrink-0" />
        </div>

        {/* Mobile/Tablet Sidebar - Shows at bottom on smaller screens */}
        <div className="xl:hidden mt-12">
          <Separator className="mb-12 bg-border/50" />
          <div className="max-w-md mx-auto">
            <OptionFinderSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}
