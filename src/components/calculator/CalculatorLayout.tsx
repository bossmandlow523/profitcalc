import { ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { CalculatorSidebar } from './CalculatorSidebar'
import { AdSidebar } from './AdSidebar'

interface CalculatorLayoutProps {
  strategyName: string
  description: string
  onBackToHome: () => void
  children: React.ReactNode
}

export function CalculatorLayout({
  strategyName,
  description,
  onBackToHome,
  children,
}: CalculatorLayoutProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar */}
        <CalculatorSidebar />

        {/* Main Content */}
        <section className="flex-1 min-w-0">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Strategy Selection
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
            Strategy Calculators
            <ChevronRight className="w-4 h-4 text-primary" />
            <span className="text-gray-300">{strategyName} Calculator</span>
          </div>

          {/* Page Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            {strategyName} Calculator
          </h1>
          <p className="text-gray-400 mb-8 max-w-3xl leading-relaxed">{description}</p>

          {/* Main Content Area - Passed as children */}
          {children}
        </section>

        {/* Right Sidebar */}
        <AdSidebar />
      </div>
    </main>
  )
}
