import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useMarketDataStore } from '@/lib/store/market-data-store'
import { X, HelpCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { HeroBlurDropdown } from '@/components/ui/hero-blur-dropdown'
import { Button } from '@heroui/react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CurrentPriceLine } from './CurrentPriceLine'
import { CircularProgressCombined } from '@/components/ui/circular-progress'

interface UnifiedOptionsChainProps {
  symbol: string
  onOptionSelect: (optionSymbol: string, premium: number, strike: number, expiryDate: string, optionType: 'call' | 'put', impliedVolatility?: number) => void
  onClose: () => void
  optionType: 'call' | 'put'
}

export function UnifiedOptionsChain({
  symbol,
  onOptionSelect,
  onClose,
  optionType
}: UnifiedOptionsChainProps) {
  const { expiryDates, fetchExpiryDates, optionsChain, fetchOptionsChain } = useMarketDataStore()
  const [selectedExpiryTab, setSelectedExpiryTab] = useState<string>('')
  const [showExplanation, setShowExplanation] = useState<'ITM' | 'ATM' | 'OTM' | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const tabScrollContainerRef = useRef<HTMLDivElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const currentPriceRowRef = useRef<HTMLTableRowElement>(null)

  // Lock body scroll when modal is mounted
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Lock the scroll
    document.body.style.overflow = 'hidden'

    // Restore the original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Fetch expiry dates on mount
  useEffect(() => {
    if (!expiryDates.data) {
      fetchExpiryDates(symbol)
    }
  }, [symbol, expiryDates.data, fetchExpiryDates])

  // Auto-select first expiry date
  useEffect(() => {
    // Store already handles the double-nested response structure
    const expiryData = expiryDates.data as any
    if (expiryData?.expiryDates && expiryData.expiryDates.length > 0 && !selectedExpiryTab) {
      const firstExpiry = expiryData.expiryDates[0].date
      setSelectedExpiryTab(firstExpiry)
      fetchOptionsChain(symbol, firstExpiry)
    }
  }, [expiryDates.data, selectedExpiryTab, symbol, fetchOptionsChain])

  const handleExpiryTabClick = (expiryDate: string) => {
    setSelectedExpiryTab(expiryDate)
    fetchOptionsChain(symbol, expiryDate)
  }

  const handleRowClick = (option: any, type: 'call' | 'put') => {
    const premium = option.mark || option.lastPrice || 0
    const impliedVolatility = option.impliedVolatility
    onOptionSelect(option.symbol, premium, option.strikePrice, selectedExpiryTab, type, impliedVolatility)
    onClose()
  }

  // Extract data from store state
  // Store already handles the double-nested response structure
  const expiryData = expiryDates.data as any
  const chainData = optionsChain.data as any
  const calls = chainData?.calls || []
  const puts = chainData?.puts || []
  const underlyingPrice = chainData?.underlyingPrice

  // Merge calls and puts by strike price
  const allStrikes = new Set<number>()
  calls.forEach((c: any) => allStrikes.add(c.strikePrice))
  puts.forEach((p: any) => allStrikes.add(p.strikePrice))

  // Sort descending so higher strikes appear at top
  const mergedData = Array.from(allStrikes).sort((a, b) => b - a).map(strike => {
    const call = calls.find((c: any) => c.strikePrice === strike)
    const put = puts.find((p: any) => p.strikePrice === strike)
    return { strike, call, put }
  })

  // Get all available option dates for calendar matching
  // Parse date strings as local dates to avoid timezone issues
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const availableOptionDates = expiryData?.expiryDates?.map((expiry: any) =>
    parseLocalDate(expiry.date)
  ) || []

  // Filter expiry dates based on selected month
  const filteredExpiryDates = selectedMonth
    ? expiryData?.expiryDates?.filter((expiry: any) => {
        const expiryDate = parseLocalDate(expiry.date)
        return (
          expiryDate.getFullYear() === selectedMonth.getFullYear() &&
          expiryDate.getMonth() === selectedMonth.getMonth()
        )
      })
    : expiryData?.expiryDates

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    setSelectedMonth(date)
    setCalendarOpen(false)

    // Filter to show only dates from the selected month
    const filteredDates = expiryData?.expiryDates?.filter((expiry: any) => {
      const expiryDate = parseLocalDate(expiry.date)
      return (
        expiryDate.getFullYear() === date.getFullYear() &&
        expiryDate.getMonth() === date.getMonth()
      )
    })

    // Auto-select first date in the selected month
    if (filteredDates && filteredDates.length > 0) {
      const firstDate = filteredDates[0].date
      setSelectedExpiryTab(firstDate)
      fetchOptionsChain(symbol, firstDate)
    }
  }

  // Matcher function to only enable dates that have options
  const matcherAvailableDates = (date: Date) => {
    return availableOptionDates.some(
      (availableDate) =>
        availableDate.getFullYear() === date.getFullYear() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getDate() === date.getDate()
    )
  }

  // Get unique months that have available options
  const getAvailableMonths = () => {
    const monthsSet = new Set<string>()
    availableOptionDates.forEach((date) => {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      monthsSet.add(monthKey)
    })
    return Array.from(monthsSet).map((key) => {
      const [year, month] = key.split('-').map(Number)
      return new Date(year, month, 1)
    }).sort((a, b) => a.getTime() - b.getTime())
  }

  const availableMonths = getAvailableMonths()

  // Navigate to previous month with options
  const handlePreviousMonth = () => {
    const currentMonthKey = selectedMonth
      ? `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`
      : null

    if (!currentMonthKey) {
      // If no month selected, select the first available month
      if (availableMonths.length > 0) {
        handleDateSelect(availableMonths[0])
      }
      return
    }

    // Find current month index
    const currentIndex = availableMonths.findIndex(
      (month) => `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
    )

    // Navigate to previous month
    if (currentIndex > 0) {
      handleDateSelect(availableMonths[currentIndex - 1])
    }
  }

  // Navigate to next month with options
  const handleNextMonth = () => {
    const currentMonthKey = selectedMonth
      ? `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`
      : null

    if (!currentMonthKey) {
      // If no month selected, select the first available month
      if (availableMonths.length > 0) {
        handleDateSelect(availableMonths[0])
      }
      return
    }

    // Find current month index
    const currentIndex = availableMonths.findIndex(
      (month) => `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
    )

    // Navigate to next month
    if (currentIndex < availableMonths.length - 1) {
      handleDateSelect(availableMonths[currentIndex + 1])
    }
  }

  // Check if navigation buttons should be disabled
  const canNavigatePrevious = () => {
    if (availableMonths.length === 0) return false

    if (!selectedMonth) {
      // If no month selected, can always go to first month
      return true
    }

    const currentMonthKey = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`
    const currentIndex = availableMonths.findIndex(
      (month) => `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
    )
    return currentIndex > 0
  }

  const canNavigateNext = () => {
    if (availableMonths.length === 0) return false

    if (!selectedMonth) {
      // If no month selected, can always go to first month
      return true
    }

    const currentMonthKey = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`
    const currentIndex = availableMonths.findIndex(
      (month) => `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
    )
    return currentIndex < availableMonths.length - 1
  }

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    const container = tabScrollContainerRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  // Scroll tabs left
  const scrollTabsLeft = () => {
    const container = tabScrollContainerRef.current
    if (!container) return
    container.scrollBy({ left: -200, behavior: 'smooth' })
  }

  // Scroll tabs right
  const scrollTabsRight = () => {
    const container = tabScrollContainerRef.current
    if (!container) return
    container.scrollBy({ left: 200, behavior: 'smooth' })
  }

  // Monitor scroll position
  useEffect(() => {
    const container = tabScrollContainerRef.current
    if (!container) return

    checkScrollPosition()
    container.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', checkScrollPosition)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [filteredExpiryDates])

  // Auto-scroll to current price range when options chain loads
  useEffect(() => {
    if (!optionsChain.isLoading && underlyingPrice && mergedData.length > 0) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const container = tableContainerRef.current
        if (!container) return

        // Find the row closest to current price
        // Since strikes are sorted DESCENDING, we look for where strike transitions from >= to <
        const atmIndex = mergedData.findIndex((row, idx) => {
          const nextRow = mergedData[idx + 1]
          if (!nextRow) return false
          // Strikes go from high to low, so we want: current >= price AND next < price
          return row.strike >= underlyingPrice && nextRow.strike < underlyingPrice
        })

        if (atmIndex !== -1) {
          // Scroll to position the ATM strike in the middle of the viewport
          const rowHeight = 50 // Approximate row height
          const containerHeight = container.clientHeight
          const scrollPosition = (atmIndex * rowHeight) - (containerHeight / 2) + (rowHeight * 2)

          container.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
          })
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [optionsChain.isLoading, underlyingPrice, mergedData.length])

  const handleBadgeClick = (e: React.MouseEvent, type: 'ITM' | 'ATM' | 'OTM') => {
    e.stopPropagation()
    setShowExplanation(type)
  }

  const getExplanationContent = (type: 'ITM' | 'ATM' | 'OTM') => {
    const isCall = optionType === 'call'

    switch(type) {
      case 'ITM':
        return {
          title: 'In The Money (ITM)',
          color: 'green',
          definition: isCall
            ? 'A call option where the strike price is below the current stock price.'
            : 'A put option where the strike price is above the current stock price.',
          meaning: 'This option has intrinsic value and would be profitable if exercised immediately.',
          example: isCall
            ? `If stock is trading at $100 and your call strike is $95, you could buy at $95 and sell at $100 for a $5 profit.`
            : `If stock is trading at $100 and your put strike is $105, you could buy at $100 and sell at $105 for a $5 profit.`,
          condition: isCall ? 'Strike < Current Price' : 'Strike > Current Price'
        }
      case 'ATM':
        return {
          title: 'At The Money (ATM)',
          color: 'blue',
          definition: 'An option where the strike price is very close to the current stock price.',
          meaning: 'This option is near the breakeven point with minimal intrinsic value.',
          example: 'If stock is trading at $100 and your strike is $100 (or very close like $99-$101), the option is at the money.',
          condition: 'Strike ≈ Current Price'
        }
      case 'OTM':
        return {
          title: 'Out of The Money (OTM)',
          color: 'red',
          definition: isCall
            ? 'A call option where the strike price is above the current stock price.'
            : 'A put option where the strike price is below the current stock price.',
          meaning: 'This option has no intrinsic value and would lose money if exercised now.',
          example: isCall
            ? `If stock is trading at $100 and your call strike is $105, exercising would mean buying at $105 when you could buy at $100 in the market.`
            : `If stock is trading at $100 and your put strike is $95, exercising would mean selling at $95 when you could sell at $100 in the market.`,
          condition: isCall ? 'Strike > Current Price' : 'Strike < Current Price'
        }
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] overflow-hidden"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="glass-card-strong rounded-2xl border border-primary/30 shadow-2xl max-w-full md:max-w-6xl w-full mx-2 md:mx-auto max-h-[95vh] md:max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">
              {symbol} Options Chain
            </h3>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Calls & Puts •
              {underlyingPrice && <span> Current Price: <span className="text-white font-semibold">${underlyingPrice.toFixed(2)}</span></span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Expiry Date Tabs with Calendar Filter */}
        <div className="border-b border-white/10 bg-background/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 p-2 md:p-4">
            {/* Left Arrow - Previous Month */}
            <button
              onClick={handlePreviousMonth}
              disabled={!canNavigatePrevious()}
              className="flex-shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>

            {/* Calendar Month Picker */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all text-white font-medium"
                >
                  <CalendarIcon className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-xs md:text-sm">
                    {selectedMonth
                      ? selectedMonth.toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })
                      : 'All Months'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[10000] bg-dark-800 border-primary/30" align="start">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={handleDateSelect}
                  disabled={(date) => !matcherAvailableDates(date)}
                  captionLayout="dropdown"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 2}
                  className="rounded-md border border-primary/30 bg-dark-800 text-white"
                />
              </PopoverContent>
            </Popover>

            {/* Right Arrow - Next Month */}
            <button
              onClick={handleNextMonth}
              disabled={!canNavigateNext()}
              className="flex-shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>

            {/* See All Button - Reset Filter */}
            {selectedMonth && (
              <button
                onClick={() => {
                  setSelectedMonth(undefined)
                  // Reset to first available date
                  if (expiryData?.expiryDates && expiryData.expiryDates.length > 0) {
                    const firstExpiry = expiryData.expiryDates[0].date
                    setSelectedExpiryTab(firstExpiry)
                    fetchOptionsChain(symbol, firstExpiry)
                  }
                }}
                className="ml-auto px-2 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:border-blue-400 hover:bg-blue-500/30 text-blue-300 text-xs md:text-sm font-medium transition-all"
              >
                See All
              </button>
            )}
          </div>

          {/* Scrollable Date Tabs */}
          <div className="relative">
            {/* Left Scroll Arrow - Mobile Only */}
            {showLeftArrow && (
              <button
                onClick={scrollTabsLeft}
                className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Right Scroll Arrow - Mobile Only */}
            {showRightArrow && (
              <button
                onClick={scrollTabsRight}
                className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Scrollable container - Hide scrollbar on mobile */}
            <div
              ref={tabScrollContainerRef}
              className="overflow-x-auto md:overflow-x-auto [&::-webkit-scrollbar]:h-0 md:[&::-webkit-scrollbar]:h-2"
            >
              <div className="flex gap-2 px-4 pb-4 min-w-max">
                {expiryDates.isLoading ? (
                  <div className="flex items-center gap-3 px-4 py-2">
                    <CircularProgressCombined size={24} thickness={3} />
                    <span className="text-gray-400 text-sm">Loading dates...</span>
                  </div>
                ) : filteredExpiryDates && filteredExpiryDates.length > 0 ? (
                  filteredExpiryDates.map((expiry: any) => (
                    <button
                      key={expiry.date}
                      onClick={() => handleExpiryTabClick(expiry.date)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedExpiryTab === expiry.date
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">
                        {parseLocalDate(expiry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-xs opacity-75">
                        {expiry.daysUntilExpiry}d
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-gray-400 text-sm px-4 py-2">
                  No dates available for selected month
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Options Table - Split View */}
        <div ref={tableContainerRef} className="overflow-auto flex-1 min-h-0">
          {optionsChain.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <CircularProgressCombined size={80} thickness={6} />
                <p className="text-sm text-gray-400">Loading options chain...</p>
              </div>
            </div>
          ) : optionsChain.isError ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-red-400">
                Error: {typeof optionsChain.error === 'string'
                  ? optionsChain.error
                  : optionsChain.error?.message || 'Failed to load options chain'}
              </div>
            </div>
          ) : mergedData.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-400">No options available</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-dark-900 sticky top-0 z-10">
                {/* Section Headers */}
                <tr className="border-b border-white/10">
                  <th colSpan={6} className="px-2 md:px-4 py-1 md:py-2 text-center font-bold text-white text-xs md:text-sm uppercase tracking-wide bg-gradient-to-r from-green-500/10 to-green-500/5">
                    Calls
                  </th>
                  <th className="px-2 md:px-4 py-1 md:py-2 bg-dark-800/80"></th>
                  <th colSpan={6} className="px-2 md:px-4 py-1 md:py-2 text-center font-bold text-white text-xs md:text-sm uppercase tracking-wide bg-gradient-to-l from-red-500/10 to-red-500/5">
                    Puts
                  </th>
                </tr>
                {/* Column Headers */}
                <tr className="text-[9px] md:text-[10px] uppercase tracking-wider border-b-2 border-white/20">
                  {/* CALLS Side Headers - IV, OI, Vol (outer), then Ask, Mid, Bid (inner/closest to strike, right to left) */}
                  <th className="hidden md:table-cell px-3 py-3 text-left font-bold text-purple-400 bg-dark-900 w-16">IV</th>
                  <th className="hidden md:table-cell px-3 py-3 text-left font-bold text-cyan-400 bg-dark-900 w-20">OI</th>
                  <th className="hidden md:table-cell px-3 py-3 text-left font-bold text-gray-400 bg-dark-900 w-16">Vol</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-bold text-white bg-dark-900 md:w-20">Ask</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-white bg-dark-900 md:w-20">Mid</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-bold text-white bg-dark-900 md:w-20">Bid</th>

                  {/* Strike Price Center */}
                  <th className="px-3 md:px-6 py-2 md:py-3 text-center font-bold text-white bg-gradient-to-r from-dark-800 to-dark-800 border-x-2 border-primary/30 md:w-28">
                    Strike
                  </th>

                  {/* PUTS Side Headers - Bid, Mid, Ask (inner/closest to strike, left to right), then Vol, OI, IV (outer) */}
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-bold text-white bg-dark-900 md:w-20">Bid</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-white bg-dark-900 md:w-20">Mid</th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-right font-bold text-white bg-dark-900 md:w-20">Ask</th>
                  <th className="hidden md:table-cell px-3 py-3 text-right font-bold text-gray-400 bg-dark-900 w-16">Vol</th>
                  <th className="hidden md:table-cell px-3 py-3 text-right font-bold text-cyan-400 bg-dark-900 w-20">OI</th>
                  <th className="hidden md:table-cell px-3 py-3 text-right font-bold text-purple-400 bg-dark-900 w-16">IV</th>
                </tr>
              </thead>
              <tbody>
                {mergedData.map((row, idx) => {
                  const prevStrike = idx > 0 ? mergedData[idx - 1].strike : null
                  const currentStrike = row.strike
                  // Since strikes are sorted descending, show price line when transitioning from above to below current price
                  const shouldShowPriceLine = underlyingPrice && prevStrike &&
                    prevStrike >= underlyingPrice && currentStrike < underlyingPrice

                  const { strike, call, put } = row
                  const isAtPrice = underlyingPrice && Math.abs(strike - underlyingPrice) < underlyingPrice * 0.02

                  // Process call data - API already returns per-contract pricing
                  const callBid = call?.bid ?? null
                  const callAsk = call?.ask ?? null
                  // Only calculate mid if both bid and ask exist
                  const callMid = (callBid !== null && callAsk !== null) ? (callBid + callAsk) / 2 : (callBid ?? callAsk)
                  const callITM = call && underlyingPrice && strike < underlyingPrice
                  const callATM = call && isAtPrice
                  const callOTM = call && !callITM && !callATM

                  // Process put data - API already returns per-contract pricing
                  const putBid = put?.bid ?? null
                  const putAsk = put?.ask ?? null
                  // Only calculate mid if both bid and ask exist
                  const putMid = (putBid !== null && putAsk !== null) ? (putBid + putAsk) / 2 : (putBid ?? putAsk)
                  const putITM = put && underlyingPrice && strike > underlyingPrice
                  const putATM = put && isAtPrice
                  const putOTM = put && !putITM && !putATM

                  // Check if we have actual data for this row
                  const hasCallData = call !== undefined
                  const hasPutData = put !== undefined

                  // Row background coloring based on moneyness with hover states
                  const getRowBgClass = () => {
                    if (isAtPrice) return 'bg-blue-500/30 border-l-4 border-l-blue-400 shadow-inner shadow-blue-500/20 hover:bg-blue-500/40'
                    if (callITM || putITM) return 'bg-green-500/20 border-l-4 border-l-green-400 hover:bg-green-500/30'
                    return 'bg-yellow-400/20 border-l-4 border-l-yellow-300 hover:bg-yellow-400/30'
                  }

                  return (
                    <>
                      {/* Insert current price line before this row if needed */}
                      {shouldShowPriceLine && (
                        <CurrentPriceLine currentPrice={underlyingPrice} symbol={symbol} />
                      )}

                      <tr
                        key={strike}
                        className={`border-b border-white/5 transition-all ${getRowBgClass()}`}
                      >
                      {/* CALLS Side - Left: IV, OI, Vol (outer), then Ask, Mid, Bid (inner/closest to strike, right to left) */}
                      {/* IV */}
                      <td
                        className="px-3 py-3 text-left text-xs cursor-pointer text-purple-400"
                        onClick={() => call && handleRowClick(call, 'call')}
                      >
                        {call?.impliedVolatility ? `${(call.impliedVolatility * 100).toFixed(1)}%` : '—'}
                      </td>
                      {/* OI */}
                      <td
                        className="px-3 py-3 text-left text-xs cursor-pointer text-cyan-400"
                        onClick={() => call && handleRowClick(call, 'call')}
                      >
                        {call?.openInterest?.toLocaleString() || '—'}
                      </td>
                      {/* Vol */}
                      <td
                        className="px-3 py-3 text-left text-xs cursor-pointer text-gray-400"
                        onClick={() => call && handleRowClick(call, 'call')}
                      >
                        {call?.volume?.toLocaleString() || '—'}
                      </td>
                      {/* Ask */}
                      <td
                        className={`px-4 py-3 text-right font-semibold text-sm text-white ${
                          !hasCallData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => call && callAsk !== null && handleRowClick(call, 'call')}
                      >
                        <span className={!hasCallData ? 'italic text-xs' : ''}>
                          {!hasCallData ? 'Not quoted' : (call && callAsk !== null ? `$${callAsk.toFixed(2)}` : '—')}
                        </span>
                      </td>
                      {/* Mid */}
                      <td
                        className={`px-4 py-3 text-center font-bold text-sm text-white ${
                          !hasCallData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => call && callMid !== null && handleRowClick(call, 'call')}
                      >
                        <span className={!hasCallData ? 'italic text-xs' : ''}>
                          {!hasCallData ? 'Not quoted' : (call && callMid !== null ? `$${callMid.toFixed(2)}` : '—')}
                        </span>
                      </td>
                      {/* Bid */}
                      <td
                        className={`px-4 py-3 text-right font-semibold text-sm text-white ${
                          !hasCallData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => call && callBid !== null && handleRowClick(call, 'call')}
                      >
                        <span className={!hasCallData ? 'italic text-xs' : ''}>
                          {!hasCallData ? 'Not quoted' : (call && callBid !== null ? `$${callBid.toFixed(2)}` : '—')}
                        </span>
                      </td>

                      {/* Strike Price - Center */}
                      <td className={`px-6 py-3 text-center font-bold border-x-2 border-white/10 ${
                        isAtPrice
                          ? 'bg-dark-800/80'
                          : 'bg-dark-900/50'
                      }`}>
                        <div className="flex items-center justify-center">
                          <span className={`text-base font-bold ${isAtPrice ? 'text-white' : 'text-gray-200'}`}>
                            ${strike.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* PUTS Side - Right: Bid, Mid, Ask (inner/closest to strike), then Vol, OI, IV (outer) */}
                      {/* Bid */}
                      <td
                        className={`px-4 py-3 text-left font-semibold text-sm text-red-400 ${
                          !hasPutData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => put && putBid !== null && handleRowClick(put, 'put')}
                      >
                        <span className={!hasPutData ? 'text-white italic text-xs' : ''}>
                          {!hasPutData ? 'Not quoted' : (put && putBid !== null ? `$${putBid.toFixed(2)}` : '—')}
                        </span>
                      </td>
                      {/* Mid */}
                      <td
                        className={`px-4 py-3 text-center font-bold text-sm text-red-400 ${
                          !hasPutData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => put && putMid !== null && handleRowClick(put, 'put')}
                      >
                        <span className={!hasPutData ? 'text-white italic text-xs' : ''}>
                          {!hasPutData ? 'Not quoted' : (put && putMid !== null ? `$${putMid.toFixed(2)}` : '—')}
                        </span>
                      </td>
                      {/* Ask */}
                      <td
                        className={`px-4 py-3 text-right font-semibold text-sm text-red-400 ${
                          !hasPutData ? 'opacity-40' : 'cursor-pointer'
                        }`}
                        onClick={() => put && putAsk !== null && handleRowClick(put, 'put')}
                      >
                        <span className={!hasPutData ? 'text-white italic text-xs' : ''}>
                          {!hasPutData ? 'Not quoted' : (put && putAsk !== null ? `$${putAsk.toFixed(2)}` : '—')}
                        </span>
                      </td>
                      {/* Vol */}
                      <td
                        className="px-3 py-3 text-right text-xs cursor-pointer text-gray-400"
                        onClick={() => put && handleRowClick(put, 'put')}
                      >
                        {put?.volume?.toLocaleString() || '—'}
                      </td>
                      {/* OI */}
                      <td
                        className="px-3 py-3 text-right text-xs cursor-pointer text-cyan-400"
                        onClick={() => put && handleRowClick(put, 'put')}
                      >
                        {put?.openInterest?.toLocaleString() || '—'}
                      </td>
                      {/* IV */}
                      <td
                        className="px-3 py-3 text-right text-xs cursor-pointer text-purple-400"
                        onClick={() => put && handleRowClick(put, 'put')}
                      >
                        {put?.impliedVolatility ? `${(put.impliedVolatility * 100).toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                    </>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer - Compact Legend */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 text-xs">
            {/* Moneyness Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-green-500/60 border-2 border-green-400 rounded"></div>
                <span className="text-gray-300 font-medium">ITM (In The Money)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-blue-500/60 border-2 border-blue-400 rounded"></div>
                <span className="text-gray-300 font-medium">ATM (At The Money)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-yellow-500/60 border-2 border-yellow-400 rounded"></div>
                <span className="text-gray-300 font-medium">OTM (Out of The Money)</span>
              </div>
            </div>

            {/* Column Info */}
            <div className="flex items-center gap-3 text-gray-400">
              <span>Vol = Volume</span>
              <span>•</span>
              <span>OI = Open Interest</span>
              <span>•</span>
              <span>IV = Implied Volatility</span>
            </div>

            {/* Action Hint */}
            <div className="text-gray-500">
              Click any cell to select option
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      {showExplanation && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowExplanation(null)}
        >
          <div
            className="glass-card-strong rounded-2xl border-2 max-w-lg w-full mx-4 overflow-hidden shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const content = getExplanationContent(showExplanation)
              const colorClasses = {
                green: 'border-green-400 bg-gradient-to-r from-green-500/20 to-green-600/20',
                blue: 'border-blue-400 bg-gradient-to-r from-blue-500/20 to-blue-600/20',
                red: 'border-red-400 bg-gradient-to-r from-red-500/20 to-red-600/20'
              }
              const badgeClasses = {
                green: 'bg-green-500/30 text-green-200 border-green-400/50',
                blue: 'bg-blue-500/30 text-blue-200 border-blue-400/50',
                red: 'bg-red-500/30 text-red-300 border-red-400/50'
              }

              return (
                <>
                  {/* Header */}
                  <div className={`p-6 border-b border-white/10 ${colorClasses[content.color as keyof typeof colorClasses]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full font-bold border text-sm ${badgeClasses[content.color as keyof typeof badgeClasses]}`}>
                          {showExplanation}
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {content.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowExplanation(null)}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Condition */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Condition</div>
                      <div className="text-white font-bold text-lg font-mono">{content.condition}</div>
                    </div>

                    {/* Definition */}
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Definition</div>
                      <p className="text-gray-200 leading-relaxed">{content.definition}</p>
                    </div>

                    {/* Meaning */}
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">What This Means</div>
                      <p className="text-gray-200 leading-relaxed">{content.meaning}</p>
                    </div>

                    {/* Example */}
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <div className="text-xs text-primary uppercase tracking-wide mb-2 font-semibold">Example</div>
                      <p className="text-gray-200 leading-relaxed text-sm">{content.example}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-background/50 text-center">
                    <button
                      onClick={() => setShowExplanation(null)}
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      Got it!
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )

  return createPortal(modalContent, document.body)
}
