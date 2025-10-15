import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';

interface MetricCardProps {
  title: string;
  value: number | number[] | null;
  variant: 'profit' | 'loss' | 'neutral';
  unlimited?: boolean;
}

export function MetricCard({ title, value, variant, unlimited }: MetricCardProps) {
  const formatValue = () => {
    if (unlimited) return 'Unlimited';
    if (value === null) return 'N/A';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      return value.map((v) => formatCurrency(v)).join(', ');
    }
    return formatCurrency(value, { showSign: true });
  };

  const variantStyles = {
    profit: 'text-green-600 dark:text-green-400',
    loss: 'text-red-600 dark:text-red-400',
    neutral: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variantStyles[variant])}>
          {formatValue()}
        </div>
      </CardContent>
    </Card>
  );
}
