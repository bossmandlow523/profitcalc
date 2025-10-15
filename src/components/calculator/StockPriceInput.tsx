import { useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          id="stock-price"
          type="number"
          step="0.01"
          min="0"
          value={inputs.currentStockPrice}
          onChange={(e) => setInputs({ currentStockPrice: Number(e.target.value) })}
          className="pl-7"
          placeholder="0.00"
          disabled={stockQuote.isLoading}
        />
      </div>

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
