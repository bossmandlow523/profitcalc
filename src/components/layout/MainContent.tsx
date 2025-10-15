import { CalculatorPanel } from '@/components/calculator/CalculatorPanel';
import { ResultsPanel } from '@/components/results/ResultsPanel';

export function MainContent() {
  return (
    <main className="container py-8 px-4 flex-1">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Modern Options Profit Calculator
        </h2>
        <p className="text-muted-foreground">
          Calculate profit/loss, break-even points, and Greeks for your options strategies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Column - Inputs */}
        <div>
          <CalculatorPanel />
        </div>

        {/* Right Column - Results */}
        <div>
          <ResultsPanel />
        </div>
      </div>
    </main>
  );
}
