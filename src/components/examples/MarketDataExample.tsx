/**
 * Market Data Usage Example
 * Demonstrates how to use the market data API infrastructure
 */

import { useState, useEffect } from 'react';
import { useMarketDataStore } from '@/lib/store/market-data-store';
import { useStockPrice, useOptionsChain, useExpiryDates } from '@/lib/hooks/use-market-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Example 1: Using React Hooks (Component-level state)
 */
export function MarketDataHooksExample() {
  const [symbol, setSymbol] = useState('AAPL');
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);

  // Fetch stock price
  const stockPrice = useStockPrice({ symbol }, true);

  // Fetch expiry dates
  const expiryDates = useExpiryDates(
    {
      symbol,
      includeWeeklies: true,
      includeMonthlies: true,
    },
    true
  );

  // Fetch options chain when expiry is selected
  const optionsChain = useOptionsChain(
    selectedExpiry
      ? {
          symbol,
          expiryDate: selectedExpiry,
          includeGreeks: true,
        }
      : null,
    true
  );

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Market Data Example (React Hooks)</CardTitle>
          <CardDescription>
            Using useStockPrice, useOptionsChain, and useExpiryDates hooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symbol Input */}
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <div className="flex gap-2">
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
              <Button
                onClick={() => {
                  stockPrice.refetch();
                  expiryDates.refetch();
                }}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stock Quote */}
          {stockPrice.isLoading && <p className="text-sm text-muted-foreground">Loading stock price...</p>}
          {stockPrice.error && (
            <p className="text-sm text-red-500">Error: {stockPrice.error.message}</p>
          )}
          {stockPrice.data && (
            <div className="rounded-lg border p-4">
              <h3 className="text-2xl font-bold">
                {stockPrice.data.symbol} - ${stockPrice.data.price.toFixed(2)}
              </h3>
              <p
                className={
                  stockPrice.data.change >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {stockPrice.data.change >= 0 ? '+' : ''}
                {stockPrice.data.change.toFixed(2)} (
                {stockPrice.data.changePercent.toFixed(2)}%)
              </p>
              <p className="text-sm text-muted-foreground">
                Volume: {stockPrice.data.volume.toLocaleString()}
              </p>
            </div>
          )}

          {/* Expiry Dates */}
          {expiryDates.isLoading && <p className="text-sm text-muted-foreground">Loading expiry dates...</p>}
          {expiryDates.data && (
            <div className="space-y-2">
              <Label>Select Expiry Date</Label>
              <div className="flex flex-wrap gap-2">
                {expiryDates.data.expiryDates.slice(0, 8).map((expiry) => (
                  <Button
                    key={expiry.date}
                    variant={selectedExpiry === expiry.date ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedExpiry(expiry.date)}
                  >
                    {new Date(expiry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {expiry.type === 'monthly' && ' ⭐'}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Options Chain */}
          {optionsChain.isLoading && <p className="text-sm text-muted-foreground">Loading options chain...</p>}
          {optionsChain.data && (
            <div className="space-y-2">
              <Label>Options Chain</Label>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="p-2 text-left">Strike</th>
                      <th className="p-2 text-right">Call Premium</th>
                      <th className="p-2 text-right">Put Premium</th>
                      <th className="p-2 text-right">Call Volume</th>
                      <th className="p-2 text-right">Put Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionsChain.data.strikes.map((strike, idx) => {
                      const call = optionsChain.data!.calls[idx];
                      const put = optionsChain.data!.puts[idx];
                      return (
                        <tr key={strike} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">${strike}</td>
                          <td className="p-2 text-right">${call.mark.toFixed(2)}</td>
                          <td className="p-2 text-right">${put.mark.toFixed(2)}</td>
                          <td className="p-2 text-right text-muted-foreground">
                            {call.volume.toLocaleString()}
                          </td>
                          <td className="p-2 text-right text-muted-foreground">
                            {put.volume.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Example 2: Using Zustand Store (Global state)
 */
export function MarketDataStoreExample() {
  const {
    currentSymbol,
    stockQuote,
    expiryDates,
    optionsChain,
    selectedExpiryDate,
    setCurrentSymbol,
    fetchStockQuote,
    fetchExpiryDates,
    setSelectedExpiryDate,
  } = useMarketDataStore();

  const [symbolInput, setSymbolInput] = useState(currentSymbol || 'AAPL');

  const handleFetchData = () => {
    setCurrentSymbol(symbolInput);
    fetchStockQuote(symbolInput);
    fetchExpiryDates(symbolInput);
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Market Data Example (Zustand Store)</CardTitle>
          <CardDescription>
            Using global market data store for shared state across components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Symbol Input */}
          <div className="space-y-2">
            <Label htmlFor="symbol-store">Stock Symbol</Label>
            <div className="flex gap-2">
              <Input
                id="symbol-store"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
              <Button onClick={handleFetchData}>Fetch Data</Button>
            </div>
          </div>

          {/* Stock Quote */}
          {stockQuote.isLoading && <p className="text-sm text-muted-foreground">Loading stock price...</p>}
          {stockQuote.error && (
            <p className="text-sm text-red-500">Error: {stockQuote.error.message}</p>
          )}
          {stockQuote.data && (
            <div className="rounded-lg border p-4">
              <h3 className="text-2xl font-bold">
                {stockQuote.data.symbol} - ${stockQuote.data.price.toFixed(2)}
              </h3>
              <p
                className={
                  stockQuote.data.change >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {stockQuote.data.change >= 0 ? '+' : ''}
                {stockQuote.data.change.toFixed(2)} (
                {stockQuote.data.changePercent.toFixed(2)}%)
              </p>
            </div>
          )}

          {/* Expiry Dates */}
          {expiryDates.data && (
            <div className="space-y-2">
              <Label>Select Expiry Date</Label>
              <div className="flex flex-wrap gap-2">
                {expiryDates.data.expiryDates.slice(0, 8).map((expiry) => (
                  <Button
                    key={expiry.date}
                    variant={selectedExpiryDate === expiry.date ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedExpiryDate(expiry.date)}
                  >
                    {new Date(expiry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Options Chain Summary */}
          {optionsChain.data && (
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Options Chain Summary</h4>
              <p className="text-sm text-muted-foreground">
                {optionsChain.data.calls.length} calls, {optionsChain.data.puts.length}{' '}
                puts
              </p>
              <p className="text-sm text-muted-foreground">
                Strike range: ${Math.min(...optionsChain.data.strikes)} - $
                {Math.max(...optionsChain.data.strikes)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
