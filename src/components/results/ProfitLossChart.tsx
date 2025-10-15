import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { formatCurrency } from '@/lib/utils/formatters';

export function ProfitLossChart() {
  const { results, inputs } = useCalculatorStore();

  if (!results) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold mb-1">
            Stock: {formatCurrency(payload[0].payload.stockPrice)}
          </p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            P/L: {formatCurrency(payload[0].value, { showSign: true })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss Chart</CardTitle>
        <CardDescription>
          P/L across stock price range at expiration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={results.chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="stockPrice"
              label={{ value: 'Stock Price', position: 'insideBottom', offset: -5 }}
              tickFormatter={(value) => `$${value}`}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'Profit/Loss', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => formatCurrency(value, { showCents: false }).replace('$', '')}
              className="text-xs"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              y={0}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              x={inputs.currentStockPrice}
              stroke="hsl(var(--primary))"
              label="Current"
              strokeDasharray="5 5"
            />
            {results.breakEvenPoints.map((be, index) => (
              <ReferenceLine
                key={index}
                x={be}
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                label={`B/E ${index + 1}`}
              />
            ))}
            <Line
              type="monotone"
              dataKey="profitLoss"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              name="P/L at Expiry"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
