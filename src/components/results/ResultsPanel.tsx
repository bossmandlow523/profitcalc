import { MetricsDisplay } from './MetricsDisplay';
import { ProfitLossChart } from './ProfitLossChart';
import { GreeksDisplay } from './GreeksDisplay';

export function ResultsPanel() {
  return (
    <div className="space-y-6">
      <MetricsDisplay />
      <ProfitLossChart />
      <GreeksDisplay />
    </div>
  );
}
