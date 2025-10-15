import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Combobox, ComboboxOption } from '@/components/ui/combobox'
import { useMarketDataStore } from '@/lib/store/market-data-store'
import { marketDataService } from '@/lib/services/market-data-service'

interface SymbolSearchInputProps {
  onSymbolSelect: (symbol: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function SymbolSearchInput({
  onSymbolSelect,
  label = "Search Stock Symbol",
  placeholder = "Type to search...",
  className,
}: SymbolSearchInputProps) {
  const [searchResults, setSearchResults] = useState<ComboboxOption[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')
  const { setCurrentSymbol, fetchStockQuote, fetchExpiryDates } = useMarketDataStore()

  // Debounce search
  const debounceTimeout = useState<NodeJS.Timeout | null>(null)[0]

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length === 0) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    try {
      const response = await marketDataService.searchSymbols(query)

      const options: ComboboxOption[] = response.data.map((result) => ({
        value: result.symbol,
        label: `${result.symbol} - ${result.name}`,
      }))

      setSearchResults(options)
    } catch (error) {
      console.error('Error searching symbols:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(() => {
      handleSearch(query)
    }, 300)

    // Store timeout reference
    Object.assign(debounceTimeout, timeout)
  }, [handleSearch, debounceTimeout])

  const handleSymbolSelect = async (symbol: string) => {
    if (!symbol) return

    setSelectedSymbol(symbol)
    setCurrentSymbol(symbol)

    // Fetch stock data automatically
    try {
      await Promise.all([
        fetchStockQuote(symbol),
        fetchExpiryDates(symbol)
      ])

      onSymbolSelect(symbol)
    } catch (error) {
      console.error('Error fetching symbol data:', error)
    }
  }

  return (
    <div className={className}>
      <Label className="flex items-center gap-2 mb-2">
        <Search className="w-4 h-4" />
        {label}
      </Label>

      <Combobox
        options={searchResults}
        value={selectedSymbol}
        onValueChange={handleSymbolSelect}
        onSearch={debouncedSearch}
        placeholder={placeholder}
        searchPlaceholder="Type symbol or company name..."
        emptyText="No symbols found. Try AAPL, MSFT, or TSLA."
        isLoading={isSearching}
      />

      {selectedSymbol && (
        <p className="text-xs text-muted-foreground mt-2">
          Selected: <span className="font-semibold">{selectedSymbol}</span>
        </p>
      )}
    </div>
  )
}
