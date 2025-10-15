import { useState, useEffect } from 'react'
import { Calculator, HelpCircle, RefreshCw, TrendingUp, TrendingDown, Table2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { LegConfig } from '../../lib/constants/strategy-configs'
import { useMarketDataStore } from '../../lib/store/market-data-store'
import { OptionsChainModal } from './OptionsChainModal'

interface StrategyFormProps {
  legs: LegConfig[]
  onCalculate?: () => void
}

export function StrategyForm({ legs, onCalculate }: StrategyFormProps) {
  const [symbol, setSymbol] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})
  const [optionPremiums, setOptionPremiums] = useState<Record<number, string>>({})
  const [showOptionsModal, setShowOptionsModal] = useState<number | null>(null)

  const {
    stockQuote,
    fetchStockQuote,
    fetchExpiryDates,
    expiryDates,
    optionsChain,
    fetchOptionsChain,
    setSelectedExpiryDate
  } = useMarketDataStore()

  const handleGetPrice = async () => {
    if (!symbol || symbol.trim() === '') {
      alert('Please enter a stock symbol')
      return
    }

    console.log('Fetching price for:', symbol)
    try {
      await Promise.all([
        fetchStockQuote(symbol.toUpperCase()),
        fetchExpiryDates(symbol.toUpperCase())
      ])
      console.log('Fetch complete, stockQuote:', stockQuote)
    } catch (error) {
      console.error('Error fetching price:', error)
    }
  }

  const handleExpiryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const expiry = e.target.value
    setSelectedExpiry(expiry)

    if (expiry && symbol) {
      console.log('Fetching options chain for:', symbol, expiry)
      try {
        await fetchOptionsChain(symbol.toUpperCase(), expiry)
      } catch (error) {
        console.error('Error fetching options chain:', error)
      }
    }
  }

  const handleOptionChange = async (legIndex: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    // Check if user selected a "load expiry" option
    if (value.startsWith('load:')) {
      const expiryDate = value.replace('load:', '')
      setSelectedExpiry(expiryDate)

      if (symbol) {
        console.log('Loading options for expiry:', expiryDate)
        try {
          await fetchOptionsChain(symbol.toUpperCase(), expiryDate)
          // Reset the select to show "Select option" after loading
          setSelectedOptions(prev => ({ ...prev, [legIndex]: '' }))
        } catch (error) {
          console.error('Error fetching options chain:', error)
        }
      }
      return
    }

    // Regular option selection
    const optionId = value
    setSelectedOptions(prev => ({ ...prev, [legIndex]: optionId }))

    // Find the selected option and auto-fill premium
    const chainData = (optionsChain.data as any)?.data
    if (chainData) {
      const leg = legs[legIndex]
      const optionsList = leg.type === 'call' ? chainData.calls : chainData.puts
      const selectedOption = optionsList?.find((opt: any) => opt.symbol === optionId)

      if (selectedOption) {
        const premium = selectedOption.mark || selectedOption.lastPrice || 0
        setOptionPremiums(prev => ({ ...prev, [legIndex]: premium.toFixed(2) }))
      }
    }
  }

  const handleModalOptionSelect = (legIndex: number, optionSymbol: string, premium: number, strike: number) => {
    setSelectedOptions(prev => ({ ...prev, [legIndex]: optionSymbol }))
    setOptionPremiums(prev => ({ ...prev, [legIndex]: premium.toFixed(2) }))
    setShowOptionsModal(null)
  }

  // Auto-update price when stock data is fetched
  useEffect(() => {
    console.log('useEffect triggered, stockQuote.data:', stockQuote.data)

    // The API response is nested: stockQuote.data.data contains the actual stock data
    const actualData = stockQuote.data as any
    console.log('actualData?.data:', actualData?.data)
    console.log('actualData?.data?.price:', actualData?.data?.price)

    if (actualData?.data && actualData.data.price != null) {
      const priceStr = Number(actualData.data.price).toFixed(2)
      console.log('Setting price to:', priceStr)
      setCurrentPrice(priceStr)
    } else {
      console.log('Price check failed - no valid price found')
    }
  }, [stockQuote.data])

  // Access nested data for the change indicator
  const actualStockData = (stockQuote.data as any)?.data
  const isPositiveChange = actualStockData && actualStockData.change >= 0

  return (
    <>
      {/* Calculator Form */}
      <div className="glass-card-strong rounded-2xl shadow-2xl mb-8 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Calculator Form</h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Underlying Stock */}
          <div>
            <div className="text-base font-semibold mb-4 text-white">Underlying stock symbol</div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="symbol" className="text-sm text-gray-400">
                  Symbol
                </Label>
                <Input
                  id="symbol"
                  type="text"
                  placeholder="e.g. AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGetPrice()
                    }
                  }}
                  className="bg-dark-700 border-2 border-white/10 focus:border-primary uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPrice" className="text-sm text-gray-400">
                  Current price*
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    disabled={stockQuote.isLoading}
                    className="pl-8 bg-dark-700 border-2 border-white/10 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleGetPrice}
                  disabled={stockQuote.isLoading || !symbol}
                  className="shimmer-effect h-[46px] px-5 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stockQuote.isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Get price'
                  )}
                </Button>
                <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              </div>
            </div>

            {/* Live data indicator */}
            {actualStockData && actualStockData.change !== undefined && actualStockData.changePercent !== undefined && (
              <div className="flex items-center gap-2 text-xs mt-3">
                <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="font-semibold">
                    {isPositiveChange ? '+' : ''}
                    {actualStockData.change.toFixed(2)} ({actualStockData.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <span className="text-gray-400">
                  • Live price from {actualStockData.symbol}
                </span>
              </div>
            )}

            {/* Error state */}
            {stockQuote.isError && (
              <div className="text-xs text-red-500 mt-2">
                {stockQuote.error?.message || 'Failed to fetch price'}
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">* Add stock purchase</div>
          </div>

          {/* Dynamic Option Legs */}
          {legs.map((leg, index) => (
            <div key={index}>
              <div className="text-base font-semibold mb-4 text-white">
                {leg.label} {legs.length > 1 ? `#${index + 1}` : ''}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`position-${index}`} className="text-sm text-gray-400">
                    Buy or write
                  </Label>
                  <select
                    id={`position-${index}`}
                    defaultValue={leg.position}
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border-2 border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="buy">Buy</option>
                    <option value="write">Write</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`optionSelect-${index}`} className="text-sm text-gray-400">
                    Selected Option ({leg.type === 'call' ? 'Call' : 'Put'})
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-dark-700/50 border-2 border-dashed border-white/10 text-gray-400 flex items-center justify-between">
                      {selectedOptions[index] ? (
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            Strike: ${(() => {
                              const chainData = (optionsChain.data as any)?.data
                              if (!chainData) return '—'
                              const optionsList = leg.type === 'call' ? chainData.calls : chainData.puts
                              const option = optionsList?.find((opt: any) => opt.symbol === selectedOptions[index])
                              return option ? option.strikePrice.toFixed(2) : '—'
                            })()}
                          </span>
                          {selectedExpiry && (
                            <span className="text-xs text-gray-400">
                              • Exp: {new Date(selectedExpiry).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>No option selected - Click the table icon →</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowOptionsModal(index)}
                      disabled={!symbol}
                      className="px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="View full options chain with dates"
                    >
                      <Table2 className="w-5 h-5 text-primary" />
                      <span className="ml-2 text-sm font-medium">Browse Options</span>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Click "Browse Options" to view all dates and strikes
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`premium-${index}`} className="text-sm text-gray-400">
                    Price per option*
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      id={`premium-${index}`}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={optionPremiums[index] || ''}
                      onChange={(e) => setOptionPremiums(prev => ({ ...prev, [index]: e.target.value }))}
                      className="pl-8 bg-dark-700 border-2 border-white/10 focus:border-primary"
                    />
                  </div>
                  {optionPremiums[index] && selectedOptions[index] && (
                    <p className="text-xs text-green-600">✓ Auto-filled from selected option</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`contracts-${index}`} className="text-sm text-gray-400">
                    Contracts*
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`contracts-${index}`}
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-24 bg-dark-700 border-2 border-white/10 focus:border-primary"
                    />
                    <span className="text-xs text-gray-400">×100</span>
                    <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Total cost</div>
                  <div className="text-xl font-bold text-primary">$ 0.00</div>
                </div>
              </div>
              {index === legs.length - 1 && (
                <div className="text-xs text-gray-500 mt-4">* Manual settings</div>
              )}
            </div>
          ))}

          {/* Calculate Button */}
          <div className="pt-2">
            <div className="text-center">
              <Button
                onClick={onCalculate}
                className="shimmer-effect inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-purple-500 text-white font-bold text-lg shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-200 animate-glow-pulse"
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <div className="text-gray-400">Stock price range:</div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  type="number"
                  className="w-28 pl-7 bg-dark-700 border-2 border-white/10 focus:border-primary"
                  placeholder="0"
                />
              </div>
              <span className="text-gray-500">–</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <Input
                  type="number"
                  className="w-28 pl-7 bg-dark-700 border-2 border-white/10 focus:border-primary"
                  placeholder="0"
                />
              </div>
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <input
                id="newcopy"
                type="checkbox"
                className="w-4 h-4 rounded bg-dark-700 border-white/10 text-primary"
              />
              <Label htmlFor="newcopy" className="text-gray-400 cursor-pointer">
                Create new copy <HelpCircle className="inline w-3 h-3 text-gray-500 cursor-help" />
              </Label>
            </div>
            <div className="mt-3 text-center">
              <Button variant="link" className="text-primary hover:text-secondary underline">
                * More output options
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="glass-card-strong rounded-2xl shadow-2xl mb-8 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Estimated returns</h2>
        </div>
        <div className="p-6">
          <div className="h-64 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-500 text-center bg-dark-800/50">
            <svg
              className="w-16 h-16 mb-3 text-primary/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              ></path>
            </svg>
            <div className="text-gray-400 font-medium">Profit/Loss Graph</div>
            <div className="text-sm text-gray-500 mt-1">
              Click calculate button above to see estimates
            </div>
          </div>
        </div>
      </div>

      {/* Additional Chart */}
      <div className="glass-card rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-center bg-dark-800/30">
          <svg
            className="w-12 h-12 mb-2 text-primary/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <div className="text-gray-400">Additional Chart/Table View</div>
          <div className="text-sm text-gray-500">Line Chart / Table Toggle</div>
        </div>
      </div>

      {/* Options Chain Modal */}
      {showOptionsModal !== null && (
        <OptionsChainModal
          symbol={symbol}
          optionType={legs[showOptionsModal].type}
          onOptionSelect={(optionSymbol, premium, strike) =>
            handleModalOptionSelect(showOptionsModal, optionSymbol, premium, strike)
          }
          onClose={() => setShowOptionsModal(null)}
        />
      )}
    </>
  )
}
