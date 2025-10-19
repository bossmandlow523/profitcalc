import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { Button } from '../ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '../ui/label';
import { Position, StockLeg } from '../../lib/types';

interface StockPositionInputProps {
  currentStockPrice: number;
  stockPosition?: StockLeg;
  onStockPositionChange: (stockPosition: StockLeg | null) => void;
  showExplanation?: boolean; // Whether to show explanation text
}

export function StockPositionInput({
  currentStockPrice,
  stockPosition,
  onStockPositionChange,
  showExplanation = false
}: StockPositionInputProps) {
  const [showForm, setShowForm] = useState(!!stockPosition);
  const [position, setPosition] = useState<'long' | 'short'>(
    stockPosition ? (stockPosition.position === Position.LONG ? 'long' : 'short') : 'long'
  );
  const [entryPrice, setEntryPrice] = useState(
    stockPosition?.entryPrice.toString() || currentStockPrice.toFixed(2)
  );
  const [quantity, setQuantity] = useState(
    stockPosition?.quantity.toString() || '100'
  );

  // Update internal state when stockPosition prop changes
  useEffect(() => {
    if (stockPosition) {
      setShowForm(true);
      setPosition(stockPosition.position === Position.LONG ? 'long' : 'short');
      setEntryPrice(stockPosition.entryPrice.toString());
      setQuantity(stockPosition.quantity.toString());
    } else {
      setShowForm(false);
    }
  }, [stockPosition]);

  const handleSave = () => {
    const stock: StockLeg = {
      id: stockPosition?.id || `stock-${Date.now()}`,
      position: position === 'long' ? Position.LONG : Position.SHORT,
      entryPrice: parseFloat(entryPrice) || currentStockPrice,
      quantity: parseInt(quantity) || 100,
    };
    onStockPositionChange(stock);
  };

  const handleRemove = () => {
    onStockPositionChange(null);
    setShowForm(false);
  };

  const handleQuickAdd = (type: 'long' | 'short', shares: number) => {
    const stock: StockLeg = {
      id: `stock-${Date.now()}`,
      position: type === 'long' ? Position.LONG : Position.SHORT,
      entryPrice: currentStockPrice,
      quantity: shares,
    };
    onStockPositionChange(stock);
    setShowForm(true);
    setPosition(type);
    setEntryPrice(currentStockPrice.toFixed(2));
    setQuantity(shares.toString());
  };

  if (!showForm && !stockPosition) {
    return (
      <div>
        <div className="text-base font-semibold mb-4 text-white">Stock Position</div>
        <div className="space-y-3">
          {showExplanation && (
            <p className="text-sm text-gray-400">
              Some strategies like Covered Call, Collar, and Covered Strangle require owning stock.
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
            >
              Add Stock Position
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => handleQuickAdd('long', 100)}
              variant="outline"
              className="flex-1 text-sm"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Quick: +100 shares
            </Button>
            <Button
              type="button"
              onClick={() => handleQuickAdd('short', 100)}
              variant="outline"
              className="flex-1 text-sm"
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Quick: -100 shares
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-white">Stock Position</div>
        {stockPosition && (
          <Button
            type="button"
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="stock-position" className="text-sm text-gray-400">
            Position
          </Label>
          <select
            id="stock-position"
            value={position}
            onChange={(e) => setPosition(e.target.value as 'long' | 'short')}
            className="w-full px-4 py-3 rounded-xl bg-dark-700 border-2 border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="long">Long (Own)</option>
            <option value="short">Short (Sold)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock-entry-price" className="text-sm text-gray-400">
            Entry Price
          </Label>
          <NumberInput
            id="stock-entry-price"
            placeholder="0.00"
            value={entryPrice}
            onValueChange={(value) => setEntryPrice(value.toString())}
            classNames={{
              inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none",
              input: "text-white"
            }}
            startContent={<span className="text-gray-400">$</span>}
            step={0.01}
            aria-label="Stock entry price"
            formatOptions={{
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock-quantity" className="text-sm text-gray-400">
            Shares
          </Label>
          <NumberInput
            id="stock-quantity"
            value={quantity}
            onValueChange={(value) => setQuantity(value.toString())}
            classNames={{
              inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none",
              input: "text-white"
            }}
            minValue={1}
            step={1}
            aria-label="Number of shares"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-400">Current Value</div>
          <div className="text-xl font-bold text-white">
            ${(currentStockPrice * parseInt(quantity || '0')).toFixed(2)}
          </div>
        </div>
      </div>

      {!stockPosition && (
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
          >
            Save Stock Position
          </Button>
        </div>
      )}

      {stockPosition && (
        <div className="mt-3 text-xs text-gray-500">
          Stock position will be included in P/L calculations
        </div>
      )}
    </div>
  );
}
