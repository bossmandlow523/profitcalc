import { useState, useEffect } from 'react'
import { Calculator, HelpCircle, RefreshCw, TrendingUp, TrendingDown, Table2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '../ui/label'
import { LegConfig } from '../../lib/constants/strategy-configs'
import { useMarketDataStore } from '../../lib/store/market-data-store'
import { useCalculatorStore } from '../../lib/store/calculator-store'
import { UnifiedOptionsChain } from './UnifiedOptionsChain'
import { StockPositionInput } from './StockPositionInput'
import { DashboardCharts } from './DashboardCharts'
import { OptionType, Position, StockLeg } from '../../lib/types'

interface StrategyFormProps {
  legs: LegConfig[]
}

export function StrategyForm({ legs }: StrategyFormProps) {
  const [symbol, setSymbol] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})
  const [optionPremiums, setOptionPremiums] = useState<Record<number, string>>({})
  const [showOptionsModal, setShowOptionsModal] = useState<number | null>(null)
  const [legPositions, setLegPositions] = useState<Record<number, 'buy' | 'write'>>({})
  const [legContracts, setLegContracts] = useState<Record<number, string>>({})
  const [legStrikes, setLegStrikes] = useState<Record<number, number>>({})
  const [legIVs, setLegIVs] = useState<Record<number, number | undefined>>({})
  const [priceRangeMin, setPriceRangeMin] = useState('')
  const [priceRangeMax, setPriceRangeMax] = useState('')
  const [isManualPriceRange, setIsManualPriceRange] = useState(false)
  const [stockPosition, setStockPosition] = useState<StockLeg | null>(null)

  // Debug: Log currentPrice whenever it changes
  useEffect(() => {
    console.log('[RENDER] currentPrice value is now:', currentPrice, 'type:', typeof currentPrice)
  }, [currentPrice])

  const {
    stockQuote,
    fetchStockQuote,
    fetchExpiryDates,
    expiryDates,
    optionsChain,
    fetchOptionsChain,
    setSelectedExpiryDate
  } = useMarketDataStore()

  const { setInputs, calculate, results, inputs, isCalculating } = useCalculatorStore()

  const handleGetPrice = async () => {
    if (!symbol || symbol.trim() === '') {
      alert('Please enter a stock symbol')
      return
    }

    console.log('=== FETCHING PRICE ===')
    console.log('Symbol:', symbol)
    console.log('API Base URL:', '/api')
    console.log('Full URL will be: /api/stocks/' + symbol.toUpperCase() + '/quote')

    try {
      await Promise.all([
        fetchStockQuote(symbol.toUpperCase()),
        fetchExpiryDates(symbol.toUpperCase())
      ])
      console.log('=== FETCH COMPLETE ===')
      console.log('stockQuote object:', stockQuote)
      console.log('stockQuote.data:', stockQuote.data)
      console.log('stockQuote.isError:', stockQuote.isError)
      console.log('stockQuote.error:', stockQuote.error)
    } catch (error) {
      console.error('=== FETCH ERROR ===')
      console.error('Error object:', error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')

      // Show user-friendly error
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('HTTP')) {
          alert(`Could not find stock data for ${symbol}. Please check the symbol and try again.`)
        } else if (error.message.includes('timeout')) {
          alert('Request timed out. Please check your connection and try again.')
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          alert('Network error. Please make sure the backend API server is running.')
        } else {
          alert(`Error fetching price: ${error.message}`)
        }
      }
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
        // API returns per-contract pricing (already multiplied by 100)
        setOptionPremiums(prev => ({ ...prev, [legIndex]: premium.toFixed(2) }))
      }
    }
  }

  const handleModalOptionSelect = (legIndex: number, optionSymbol: string, premium: number, strike: number, expiryDate: string, optionType: 'call' | 'put', impliedVolatility?: number) => {
    setSelectedOptions(prev => ({ ...prev, [legIndex]: optionSymbol }))
    // API returns per-share pricing
    setOptionPremiums(prev => ({ ...prev, [legIndex]: premium.toFixed(2) }))
    setLegStrikes(prev => ({ ...prev, [legIndex]: strike }))
    // Store IV for each leg
    setLegIVs(prev => ({ ...prev, [legIndex]: impliedVolatility }))
    setSelectedExpiry(expiryDate)
    setShowOptionsModal(null)
  }

  const handleCalculate = () => {
    // Validate inputs
    if (!currentPrice || parseFloat(currentPrice) <= 0) {
      alert('Please enter a valid current stock price')
      return
    }

    if (!selectedExpiry) {
      alert('Please select an expiry date by choosing an option')
      return
    }

    // Build option legs from form data
    const optionLegs = legs.map((legConfig, index) => {
      const premium = parseFloat(optionPremiums[index] || '0')
      const contracts = parseFloat(legContracts[index] || '1')
      const position = legPositions[index] || legConfig.position
      const strike = legStrikes[index]

      if (!strike || strike <= 0) {
        throw new Error(`Please select a valid option for ${legConfig.label}`)
      }

      if (premium <= 0) {
        throw new Error(`Please enter a valid premium for ${legConfig.label}`)
      }

      return {
        id: `leg-${index}`,
        optionType: legConfig.type === 'call' ? OptionType.CALL : OptionType.PUT,
        position: position === 'buy' ? Position.LONG : Position.SHORT,
        strikePrice: strike,
        premium: premium,
        quantity: contracts,
        expiryDate: new Date(selectedExpiry),
        volatility: legIVs[index] // Use leg-specific IV if available
      }
    })

    try {
      // Update calculator store with inputs
      setInputs({
        currentStockPrice: parseFloat(currentPrice),
        legs: optionLegs,
        stockPosition: stockPosition || undefined,
        volatility: 0.30, // Default for now
        riskFreeRate: 0.05, // Default for now
        priceRange: priceRangeMin && priceRangeMax
          ? (parseFloat(priceRangeMax) - parseFloat(priceRangeMin)) / parseFloat(currentPrice)
          : 0.5,
        chartPoints: 100
      })

      // Trigger calculation
      calculate()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to calculate')
    }
  }

  // Initialize default values for legs
  useEffect(() => {
    const initialPositions: Record<number, 'buy' | 'write'> = {}
    const initialContracts: Record<number, string> = {}

    legs.forEach((leg, index) => {
      initialPositions[index] = leg.position
      initialContracts[index] = '1'
    })

    setLegPositions(initialPositions)
    setLegContracts(initialContracts)
  }, [legs])

  // Auto-update price when stock data is fetched
  useEffect(() => {
    console.log('[USEEFFECT] Triggered, stockQuote.data:', stockQuote.data)
    console.log('[USEEFFECT] stockQuote.isSuccess:', stockQuote.isSuccess)
    console.log('[USEEFFECT] stockQuote.isLoading:', stockQuote.isLoading)

    // Only update if we have successful data
    if (stockQuote.isSuccess && stockQuote.data && typeof stockQuote.data === 'object' && 'price' in stockQuote.data) {
      const priceValue = stockQuote.data.price
      console.log('[USEEFFECT] Found price:', priceValue)

      if (typeof priceValue === 'number' && !isNaN(priceValue) && priceValue > 0) {
        const priceStr = priceValue.toFixed(2)
        console.log('[USEEFFECT] Setting price to:', priceStr)
        setCurrentPrice(priceStr)

        // Verify the state was updated
        setTimeout(() => {
          console.log('[USEEFFECT] After setState - currentPrice should be:', priceStr)
        }, 100)
      } else {
        console.log('[USEEFFECT] Price value invalid:', priceValue)
      }
    } else {
      console.log('[USEEFFECT] No valid data to process')
      if (stockQuote.isError) {
        console.log('[USEEFFECT] Error state detected, not updating price')
      }
    }
  }, [stockQuote.data, stockQuote.isSuccess, stockQuote.isLoading])

  // Auto-populate price range when current price changes (only if not manually set)
  useEffect(() => {
    const price = parseFloat(currentPrice)

    if (!isManualPriceRange && !isNaN(price) && price > 0) {
      const minPrice = Math.max(0, price - 5) // Ensure min doesn't go below 0
      const maxPrice = price + 5

      setPriceRangeMin(minPrice.toFixed(2))
      setPriceRangeMax(maxPrice.toFixed(2))

      console.log('[PRICE RANGE AUTO-FILL] Set range to:', minPrice, '-', maxPrice)
    }
  }, [currentPrice, isManualPriceRange])

  // Access stock data for the change indicator
  const actualStockData = stockQuote.data as any
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
                <NumberInput
                  id="currentPrice"
                  placeholder="0.00"
                  value={currentPrice}
                  onValueChange={(value) => setCurrentPrice(value.toString())}
                  isDisabled={stockQuote.isLoading}
                  classNames={{
                    inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none",
                    input: "text-white"
                  }}
                  startContent={<span className="text-gray-400">$</span>}
                  step={0.01}
                  minValue={0}
                  aria-label="Current stock price"
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                />
              </div>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleGetPrice}
                  disabled={stockQuote.isLoading || !symbol}
                  className={`shimmer-effect h-[46px] px-5 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all ${
                    stockQuote.isLoading
                      ? 'opacity-70 cursor-wait'
                      : !symbol
                        ? 'opacity-50 cursor-default'
                        : 'cursor-pointer hover:scale-105'
                  }`}
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
                {!symbol && (
                  <span className="text-xs text-gray-500">Enter symbol first</span>
                )}
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
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
                <div className="text-sm font-semibold text-red-400 mb-1">
                  ⚠️ Failed to fetch price
                </div>
                <div className="text-xs text-red-300">
                  {stockQuote.error?.message || 'Unknown error'}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Make sure the backend API server is running:
                  <code className="block mt-1 bg-black/30 p-1 rounded">
                    cd backend && python -m uvicorn main:app --reload
                  </code>
                </div>
                <Button
                  onClick={handleGetPrice}
                  variant="outline"
                  className="mt-2 text-xs h-7 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">* Add stock purchase</div>
          </div>

          {/* Dynamic Option Legs */}
          {legs.map((leg, index) => (
            <div key={index} className="bg-dark-800/50 border border-white/10 rounded-2xl overflow-hidden">
              {/* Header - Purple Banner */}
              <div className="bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-600/20 border-b border-purple-500/30 py-6">
                <div className="max-w-2xl mx-auto text-center px-8">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {leg.label}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    ({leg.position === 'buy' ? 'Long' : 'Short'} {leg.type === 'call' ? 'Call' : 'Put'})
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">

              {/* Two column layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left column - Position & Inputs */}
                <div className="space-y-6">
                  {/* Position */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Position</h3>
                    <div className="text-sm text-primary font-bold uppercase tracking-wide mb-3">
                      RECOMMENDED: {leg.position === 'buy' ? 'BUY' : 'WRITE'}
                    </div>
                    <select
                      id={`position-${index}`}
                      value={legPositions[index] || leg.position}
                      onChange={(e) => setLegPositions(prev => ({ ...prev, [index]: e.target.value as 'buy' | 'write' }))}
                      className="w-full px-4 py-3 rounded-xl bg-dark-700 border-2 border-white/10 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="buy">Buy</option>
                      <option value="write">Write</option>
                    </select>
                  </div>

                  {/* Premium per contract */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Premium per contract*</h3>
                    <NumberInput
                      id={`premium-${index}`}
                      placeholder="0.00"
                      value={optionPremiums[index] || ''}
                      onValueChange={(value) => setOptionPremiums(prev => ({ ...prev, [index]: value.toString() }))}
                      classNames={{
                        inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none h-12",
                        input: "text-white text-lg"
                      }}
                      startContent={<span className="text-gray-400 text-lg">$</span>}
                      step={0.01}
                      minValue={0}
                      aria-label={`Premium for ${legs[index]?.label || 'option'}`}
                      formatOptions={{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }}
                    />
                    {optionPremiums[index] && selectedOptions[index] && (
                      <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                        <span>✓</span> Auto-filled from selected option
                      </p>
                    )}
                  </div>

                  {/* Contracts */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Contracts*</h3>
                    <div className="flex items-center gap-3">
                      <NumberInput
                        id={`contracts-${index}`}
                        value={legContracts[index] || '1'}
                        onValueChange={(value) => setLegContracts(prev => ({ ...prev, [index]: value.toString() }))}
                        classNames={{
                          base: "w-32",
                          inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none h-12",
                          input: "text-white text-lg text-center"
                        }}
                        minValue={1}
                        step={1}
                        aria-label={`Number of contracts for ${legs[index]?.label || 'option'}`}
                      />
                      <span className="text-sm text-gray-400">×100</span>
                      <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">* Manual settings</div>
                </div>

                {/* Right column - Selected Option Card */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white text-center">
                    Selected Option ({leg.type === 'call' ? 'Call' : 'Put'})
                  </h3>

                  {/* Option display card */}
                  <div className="bg-dark-900 border-2 border-dashed border-white/20 rounded-xl p-6">
                    {selectedOptions[index] ? (
                      <div className="space-y-4">
                        {/* Main option display */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">
                            ${legStrikes[index]?.toFixed(0) || '0'} {leg.type === 'call' ? 'Call' : 'Put'}
                          </div>
                          {optionPremiums[index] && (
                            <div className="text-sm text-gray-400 mt-2">
                              Premium: ${optionPremiums[index]}
                            </div>
                          )}
                        </div>

                        {/* Expiry date */}
                        {selectedExpiry && (
                          <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              EXPIRY
                            </div>
                            <div className="text-xl text-gray-200 font-semibold">
                              {(() => {
                                // Parse date as UTC to avoid timezone shifts
                                const [year, month, day] = selectedExpiry.split('-').map(Number);
                                const date = new Date(year, month - 1, day);
                                return date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-gray-400 mb-2">No option selected</div>
                        <div className="text-sm text-gray-500">
                          Click "Browse Options" to view all dates
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Browse button */}
                  <Button
                    type="button"
                    onClick={() => setShowOptionsModal(index)}
                    disabled={!symbol}
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="View full options chain with dates"
                  >
                    Browse Options
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Click "Browse Options" to view all dates and strikes
                  </p>
                </div>
              </div>

              {/* Total Cost - Centered with header */}
              <div className="mt-8">
                <div className="bg-dark-900/50 border-2 border-red-500/30 rounded-lg p-2.5 max-w-[220px] mx-auto text-center">
                  <div className="text-xs text-gray-400 mb-0.5">Total Cost</div>
                  <div className={`text-xl font-bold ${
                    (() => {
                      const premium = parseFloat(optionPremiums[index] || '0');
                      const contracts = parseFloat(legContracts[index] || '1');
                      const position = legPositions[index] || leg.position;
                      const isLong = position === 'buy';
                      return isLong ? 'text-red-400' : 'text-green-400';
                    })()
                  }`}>
                    {(() => {
                      const premium = parseFloat(optionPremiums[index] || '0');
                      const contracts = parseFloat(legContracts[index] || '1');
                      const position = legPositions[index] || leg.position;
                      const isLong = position === 'buy';
                      const cost = premium * contracts * 100;
                      return isLong ? `-$${cost.toFixed(2)}` : `+$${cost.toFixed(2)}`;
                    })()}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {(() => {
                      const position = legPositions[index] || leg.position;
                      return position === 'buy' ? 'Debit' : 'Credit';
                    })()}
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}

          {/* Net Spread Cost Summary - Only show for multi-leg strategies */}
          {legs.length > 1 && (
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-white mb-1">Net Spread Cost</div>
                  <div className="text-sm text-gray-400">
                    Combined debit/credit for all {legs.length} legs
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    (() => {
                      const totalCost = legs.reduce((sum, leg, index) => {
                        const premium = parseFloat(optionPremiums[index] || '0');
                        const contracts = parseFloat(legContracts[index] || '1');
                        const position = legPositions[index] || leg.position;
                        const isLong = position === 'buy';
                        const legCost = premium * contracts * 100;
                        return sum + (isLong ? -legCost : legCost);
                      }, 0);
                      return totalCost < 0 ? 'text-red-400' : 'text-green-400';
                    })()
                  }`}>
                    {(() => {
                      const totalCost = legs.reduce((sum, leg, index) => {
                        const premium = parseFloat(optionPremiums[index] || '0');
                        const contracts = parseFloat(legContracts[index] || '1');
                        const position = legPositions[index] || leg.position;
                        const isLong = position === 'buy';
                        const legCost = premium * contracts * 100;
                        return sum + (isLong ? -legCost : legCost);
                      }, 0);
                      return totalCost < 0
                        ? `-$${Math.abs(totalCost).toFixed(2)}`
                        : `+$${totalCost.toFixed(2)}`;
                    })()}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {(() => {
                      const totalCost = legs.reduce((sum, leg, index) => {
                        const premium = parseFloat(optionPremiums[index] || '0');
                        const contracts = parseFloat(legContracts[index] || '1');
                        const position = legPositions[index] || leg.position;
                        const isLong = position === 'buy';
                        const legCost = premium * contracts * 100;
                        return sum + (isLong ? -legCost : legCost);
                      }, 0);
                      return totalCost < 0 ? 'Net Debit (you pay)' : 'Net Credit (you receive)';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Position Input - Only show if user has added it */}
          {stockPosition ? (
            <StockPositionInput
              currentStockPrice={parseFloat(currentPrice) || 100}
              stockPosition={stockPosition || undefined}
              onStockPositionChange={setStockPosition}
            />
          ) : (
            /* Manual "Add Stock Position" button for advanced users */
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => {
                  const defaultStock: StockLeg = {
                    id: `stock-${Date.now()}`,
                    position: Position.LONG,
                    entryPrice: parseFloat(currentPrice) || 100,
                    quantity: 100,
                  };
                  setStockPosition(defaultStock);
                }}
                variant="outline"
                className="text-sm text-gray-400 border-white/10 hover:text-white hover:border-white/30"
              >
                + Add Stock Position (Optional)
              </Button>
            </div>
          )}

          {/* Calculate Button */}
          <div className="pt-2">
            <div className="text-center">
              <Button
                onClick={handleCalculate}
                className="shimmer-effect inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary via-secondary to-purple-500 text-white font-bold text-lg shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-200 animate-glow-pulse"
              >
                <Calculator className="w-5 h-5" />
                Calculate
              </Button>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="bg-dark-800/50 border border-white/5 rounded-lg px-4 py-2.5 inline-flex items-center gap-3">
                <label className="text-sm font-medium text-gray-300">Stock price range:</label>
                <NumberInput
                  value={priceRangeMin}
                  onValueChange={(value) => {
                    setPriceRangeMin(value.toString())
                    setIsManualPriceRange(true)
                  }}
                  classNames={{
                    base: "w-36",
                    inputWrapper: "bg-dark-700 border border-white/20 hover:border-white/30 focus-within:border-primary/60 shadow-sm transition-colors",
                    input: "text-white"
                  }}
                  placeholder="Min"
                  startContent={<span className="text-gray-400">$</span>}
                  step={3}
                  minValue={0}
                  aria-label="Minimum price range"
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                />
                <span className="text-gray-400">–</span>
                <NumberInput
                  value={priceRangeMax}
                  onValueChange={(value) => {
                    setPriceRangeMax(value.toString())
                    setIsManualPriceRange(true)
                  }}
                  classNames={{
                    base: "w-36",
                    inputWrapper: "bg-dark-700 border border-white/20 hover:border-white/30 focus-within:border-primary/60 shadow-sm transition-colors",
                    input: "text-white"
                  }}
                  placeholder="Max"
                  startContent={<span className="text-gray-400">$</span>}
                  step={3}
                  minValue={0}
                  aria-label="Maximum price range"
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                />
                {isManualPriceRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsManualPriceRange(false)}
                    className="h-7 px-2.5 text-xs text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
                    title="Reset to auto-fill (±$5 from current price)"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Auto
                  </Button>
                )}
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help transition-colors" />
              </div>
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


      {/* Options Chain Modal */}
      {showOptionsModal !== null && (
        <UnifiedOptionsChain
          symbol={symbol}
          optionType={legs[showOptionsModal].type}
          onOptionSelect={(optionSymbol, premium, strike, expiryDate, optionType, impliedVolatility) =>
            handleModalOptionSelect(showOptionsModal, optionSymbol, premium, strike, expiryDate, optionType, impliedVolatility)
          }
          onClose={() => setShowOptionsModal(null)}
        />
      )}

      {/* Full-Width Dashboard Charts */}
      {results && inputs.legs.length > 0 && (
        <div className="relative left-1/2 right-1/2 -mx-[48vw] w-[96vw] px-6 sm:px-8 lg:px-12 mt-12">
          <DashboardCharts
            legs={inputs.legs}
            currentStockPrice={inputs.currentStockPrice}
            riskFreeRate={inputs.riskFreeRate || 0.05}
            volatility={inputs.volatility || 0.30}
            dividendYield={0}
            priceRangeMin={priceRangeMin ? parseFloat(priceRangeMin) : undefined}
            priceRangeMax={priceRangeMax ? parseFloat(priceRangeMax) : undefined}
            isLoading={isCalculating}
          />
        </div>
      )}
    </>
  )
}
