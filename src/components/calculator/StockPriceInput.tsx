import { useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { useMarketDataStore } from '@/lib/store/market-data-store';

export function StockPriceInput() {
  const { inputs, setInputs } = useCalculatorStore();
  const { stockQuote, currentSymbol, fetchStockQuote } = useMarketDataStore();

  // Auto-populate price when stock data is available
  useEffect(() => {
    if (stockQuote.data && stockQuote.data.price > 0) {
      setInputs({ currentStockPrice: stockQuote.data.price });
    }
  }, [stockQuote.data, setInputs]);

  const handleRefresh = async () => {
    if (currentSymbol) {
      await fetchStockQuote(currentSymbol);
    }
  };

  const isPositiveChange = stockQuote.data && stockQuote.data.change >= 0;
  const hasLiveData = stockQuote.data && currentSymbol;

  return (
    <div className="space-y-2">
      <Label htmlFor="stock-price" className="flex items-center justify-between">
        <span>Current Stock Price</span>
        {hasLiveData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={stockQuote.isLoading}
            className="h-6 px-2"
          >
            <RefreshCw className={`w-3 h-3 ${stockQuote.isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </Label>

      <NumberInput
        id="stock-price"
        placeholder="0.00"
        value={inputs.currentStockPrice.toString()}
        onValueChange={(value) => setInputs({ currentStockPrice: value })}
        startContent={<span className="text-muted-foreground">$</span>}
        step={0.01}
        minValue={0}
        isDisabled={stockQuote.isLoading}
        aria-label="Current stock price"
        formatOptions={{
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }}
      />

      {/* Live data indicator */}
      {hasLiveData && (
        <div className="flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveChange ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="font-semibold">
              {isPositiveChange ? '+' : ''}
              {stockQuote.data.change.toFixed(2)} ({stockQuote.data.changePercent.toFixed(2)}%)
            </span>
          </div>
          <span className="text-muted-foreground">
            • Live price from {currentSymbol}
          </span>
        </div>
      )}

      {/* Loading state */}
      {stockQuote.isLoading && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Fetching live price...
        </p>
      )}

      {/* Error state */}
      {stockQuote.isError && (
        <p className="text-xs text-red-500">
          {stockQuote.error?.message || 'Failed to fetch price'}
        </p>
      )}

      {/* Default message */}
      {!hasLiveData && !stockQuote.isLoading && !stockQuote.isError && (
        <p className="text-xs text-muted-foreground">
          Search for a symbol to auto-populate the current price
        </p>
      )}
    </div>
  );
}
