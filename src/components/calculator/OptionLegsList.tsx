import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export function OptionLegsList() {
  const { inputs, removeLeg } = useCalculatorStore();
  const { legs } = inputs;

  if (legs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Option Legs</CardTitle>
          <CardDescription>No legs added yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Add option legs above to build your strategy
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Option Legs ({legs.length})</CardTitle>
        <CardDescription>Your configured option positions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {legs.map((leg) => (
            <div
              key={leg.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize">
                    {leg.position} {leg.optionType}
                  </span>
                  <span className="text-muted-foreground">×{leg.quantity}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Strike: {formatCurrency(leg.strikePrice)} | Premium:{' '}
                  {formatCurrency(leg.premium)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(leg.expiryDate).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLeg(leg.id)}
                aria-label="Remove leg"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
