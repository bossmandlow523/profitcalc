import { Card, CardContent } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { MetricCard } from './MetricCard';

export function MetricsDisplay() {
  const { results } = useCalculatorStore();

  if (!results) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p className="mb-2">No results yet</p>
          <p className="text-sm">
            Add option legs and click Calculate to see your profit/loss analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MetricCard
        title="Max Profit"
        value={results.maxProfit}
        variant="profit"
        unlimited={results.maxProfit === null}
      />
      <MetricCard
        title="Max Loss"
        value={results.maxLoss}
        variant="loss"
        unlimited={results.maxLoss === null}
      />
      <MetricCard
        title="Break-Even Points"
        value={results.breakEvenPoints}
        variant="neutral"
      />
      <MetricCard
        title="Initial Cost"
        value={results.initialCost}
        variant={results.initialCost < 0 ? 'loss' : 'profit'}
      />
    </div>
  );
}
