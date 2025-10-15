import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { StockPriceInput } from './StockPriceInput';
import { StrategySelector } from './StrategySelector';
import { OptionLegForm } from './OptionLegForm';
import { OptionLegsList } from './OptionLegsList';
import { Calculator, RotateCcw } from 'lucide-react';

export function CalculatorPanel() {
  const { calculate, reset, inputs, isCalculating, error } = useCalculatorStore();

  const handleCalculate = () => {
    if (inputs.legs.length === 0) {
      alert('Please add at least one option leg');
      return;
    }
    calculate();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Setup</CardTitle>
          <CardDescription>Configure your options strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StrategySelector />
          <StockPriceInput />
        </CardContent>
      </Card>

      <OptionLegForm />

      <OptionLegsList />

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleCalculate}
          disabled={isCalculating || inputs.legs.length === 0}
          className="flex-1"
          size="lg"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </Button>
        <Button onClick={reset} variant="outline" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
