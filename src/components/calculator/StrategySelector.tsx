import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { StrategyType } from '@/lib/types';

const STRATEGIES = [
  { value: StrategyType.LONG_CALL, label: 'Long Call', category: 'Basic' },
  { value: StrategyType.LONG_PUT, label: 'Long Put', category: 'Basic' },
  { value: StrategyType.SHORT_CALL, label: 'Short Call', category: 'Basic' },
  { value: StrategyType.SHORT_PUT, label: 'Short Put', category: 'Basic' },
  { value: StrategyType.CALL_DEBIT_SPREAD, label: 'Bull Call Spread', category: 'Spreads' },
  { value: StrategyType.PUT_DEBIT_SPREAD, label: 'Bear Put Spread', category: 'Spreads' },
  { value: StrategyType.CALL_CREDIT_SPREAD, label: 'Bear Call Spread', category: 'Spreads' },
  { value: StrategyType.PUT_CREDIT_SPREAD, label: 'Bull Put Spread', category: 'Spreads' },
  { value: StrategyType.LONG_STRADDLE, label: 'Long Straddle', category: 'Volatility' },
  { value: StrategyType.LONG_STRANGLE, label: 'Long Strangle', category: 'Volatility' },
  { value: StrategyType.IRON_CONDOR, label: 'Iron Condor', category: 'Advanced' },
  { value: StrategyType.CUSTOM, label: 'Custom Strategy', category: 'Custom' },
];

export function StrategySelector() {
  const { selectedStrategy, setStrategy } = useCalculatorStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="strategy">Select Strategy</Label>
      <Select value={selectedStrategy} onValueChange={(value) => setStrategy(value as StrategyType)}>
        <SelectTrigger id="strategy">
          <SelectValue placeholder="Choose a strategy" />
        </SelectTrigger>
        <SelectContent>
          {STRATEGIES.map((strategy) => (
            <SelectItem key={strategy.value} value={strategy.value}>
              {strategy.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Choose a pre-configured strategy or build a custom one
      </p>
    </div>
  );
}
