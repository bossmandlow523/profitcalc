import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';

export function GreeksDisplay() {
  const { results } = useCalculatorStore();

  if (!results || !results.greeks) {
    return null;
  }

  const { greeks } = results;

  const greekItems = [
    {
      name: 'Delta',
      value: greeks.delta.toFixed(4),
      description: 'Price sensitivity (per $1 move)',
    },
    {
      name: 'Gamma',
      value: greeks.gamma.toFixed(4),
      description: 'Delta rate of change',
    },
    {
      name: 'Theta',
      value: greeks.theta.toFixed(4),
      description: 'Time decay (per day)',
    },
    {
      name: 'Vega',
      value: greeks.vega.toFixed(4),
      description: 'Volatility sensitivity',
    },
    {
      name: 'Rho',
      value: greeks.rho.toFixed(4),
      description: 'Interest rate sensitivity',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Greeks</CardTitle>
        <CardDescription>Risk measures for your position</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-5">
          {greekItems.map((greek) => (
            <div key={greek.name} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{greek.name}</p>
              <p className="text-2xl font-bold">{greek.value}</p>
              <p className="text-xs text-muted-foreground">{greek.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
