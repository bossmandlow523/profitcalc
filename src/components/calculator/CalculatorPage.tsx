import { CalculatorLayout } from './CalculatorLayout'
import { StrategyForm } from './StrategyForm'
import { FAQSection } from './FAQSection'
import { getStrategyConfig } from '../../lib/constants/strategy-configs'

interface CalculatorPageProps {
  selectedStrategy: string
  onBackToHome: () => void
}

export function CalculatorPage({ selectedStrategy, onBackToHome }: CalculatorPageProps) {
  // Get the strategy configuration
  const config = getStrategyConfig(selectedStrategy)

  // Fallback for unknown strategies
  if (!config) {
    return (
      <CalculatorLayout
        strategyName={selectedStrategy}
        description="Strategy configuration not found. Please select a valid strategy."
        onBackToHome={onBackToHome}
      >
        <div className="glass-card-strong rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-400">
            This strategy is not yet configured. Please go back and select a different strategy.
          </p>
        </div>
      </CalculatorLayout>
    )
  }

  return (
    <CalculatorLayout
      strategyName={config.name}
      description={config.description}
      onBackToHome={onBackToHome}
    >
      {/* Strategy Form with dynamic legs */}
      <StrategyForm legs={config.formConfig.legs} />

      {/* FAQ Section */}
      <FAQSection strategyName={config.name} questions={config.faqQuestions} />
    </CalculatorLayout>
  )
}
