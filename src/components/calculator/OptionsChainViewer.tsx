import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMarketDataStore } from '@/lib/store/market-data-store'
import type { OptionContract } from '@/lib/types/market-data'

interface OptionsChainViewerProps {
  onOptionSelect?: (option: OptionContract) => void
  className?: string
}

export function OptionsChainViewer({
  onOptionSelect,
  className,
}: OptionsChainViewerProps) {
  const { optionsChain, currentSymbol } = useMarketDataStore()
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null)

  // Filter options near the money for better display
  const filteredOptions = useMemo(() => {
    if (!optionsChain.data) return { calls: [], puts: [] }

    const underlyingPrice = optionsChain.data.underlyingPrice
    const priceRange = underlyingPrice * 0.15 // Show ±15% from current price

    const calls = optionsChain.data.calls.filter(
      (opt) =>
        opt.strikePrice >= underlyingPrice - priceRange &&
        opt.strikePrice <= underlyingPrice + priceRange
    )

    const puts = optionsChain.data.puts.filter(
      (opt) =>
        opt.strikePrice >= underlyingPrice - priceRange &&
        opt.strikePrice <= underlyingPrice + priceRange
    )

    return { calls, puts }
  }, [optionsChain.data])

  const handleOptionClick = (option: OptionContract) => {
    setSelectedStrike(option.strikePrice)
    onOptionSelect?.(option)
  }

  // Loading state
  if (optionsChain.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Options Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading options chain...
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (optionsChain.isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Options Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            {optionsChain.error?.message || 'Failed to load options chain'}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (!currentSymbol || !optionsChain.data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Options Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Select a symbol and expiry date to view options chain
          </div>
        </CardContent>
      </Card>
    )
  }

  const { underlyingPrice } = optionsChain.data

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Options Chain
          </div>
          <Badge variant="outline">
            Underlying: ${underlyingPrice.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Calls ({filteredOptions.calls.length})
            </TabsTrigger>
            <TabsTrigger value="puts" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Puts ({filteredOptions.puts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calls" className="mt-4">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr>
                    <th className="text-left p-2">Strike</th>
                    <th className="text-right p-2">Bid</th>
                    <th className="text-right p-2">Ask</th>
                    <th className="text-right p-2">Last</th>
                    <th className="text-right p-2">Volume</th>
                    <th className="text-right p-2">OI</th>
                    <th className="text-right p-2">IV</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOptions.calls.map((call) => {
                    const isITM = call.inTheMoney
                    const isATM = Math.abs(call.strikePrice - underlyingPrice) < underlyingPrice * 0.02
                    const isSelected = selectedStrike === call.strikePrice

                    return (
                      <tr
                        key={call.symbol}
                        onClick={() => handleOptionClick(call)}
                        className={`
                          border-b hover:bg-muted/50 cursor-pointer transition-colors
                          ${isSelected ? 'bg-primary/10' : ''}
                          ${isITM ? 'bg-green-500/5' : ''}
                        `}
                      >
                        <td className="p-2 font-semibold">
                          <div className="flex items-center gap-2">
                            ${call.strikePrice.toFixed(2)}
                            {isATM && <Badge variant="secondary" className="text-xs">ATM</Badge>}
                          </div>
                        </td>
                        <td className="text-right p-2 text-green-600">
                          ${call.bid.toFixed(2)}
                        </td>
                        <td className="text-right p-2 text-red-600">
                          ${call.ask.toFixed(2)}
                        </td>
                        <td className="text-right p-2 font-medium">
                          ${call.lastPrice.toFixed(2)}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {call.volume.toLocaleString()}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {call.openInterest.toLocaleString()}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {(call.impliedVolatility * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="puts" className="mt-4">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr>
                    <th className="text-left p-2">Strike</th>
                    <th className="text-right p-2">Bid</th>
                    <th className="text-right p-2">Ask</th>
                    <th className="text-right p-2">Last</th>
                    <th className="text-right p-2">Volume</th>
                    <th className="text-right p-2">OI</th>
                    <th className="text-right p-2">IV</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOptions.puts.map((put) => {
                    const isITM = put.inTheMoney
                    const isATM = Math.abs(put.strikePrice - underlyingPrice) < underlyingPrice * 0.02
                    const isSelected = selectedStrike === put.strikePrice

                    return (
                      <tr
                        key={put.symbol}
                        onClick={() => handleOptionClick(put)}
                        className={`
                          border-b hover:bg-muted/50 cursor-pointer transition-colors
                          ${isSelected ? 'bg-primary/10' : ''}
                          ${isITM ? 'bg-red-500/5' : ''}
                        `}
                      >
                        <td className="p-2 font-semibold">
                          <div className="flex items-center gap-2">
                            ${put.strikePrice.toFixed(2)}
                            {isATM && <Badge variant="secondary" className="text-xs">ATM</Badge>}
                          </div>
                        </td>
                        <td className="text-right p-2 text-green-600">
                          ${put.bid.toFixed(2)}
                        </td>
                        <td className="text-right p-2 text-red-600">
                          ${put.ask.toFixed(2)}
                        </td>
                        <td className="text-right p-2 font-medium">
                          ${put.lastPrice.toFixed(2)}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {put.volume.toLocaleString()}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {put.openInterest.toLocaleString()}
                        </td>
                        <td className="text-right p-2 text-muted-foreground">
                          {(put.impliedVolatility * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>ITM = In The Money | ATM = At The Money | OI = Open Interest | IV = Implied Volatility</p>
          <p className="mt-1">Showing strikes within ±15% of current price</p>
        </div>
      </CardContent>
    </Card>
  )
}
