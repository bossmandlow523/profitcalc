import { useState, useEffect } from 'react'
import { useMarketDataStore } from '@/lib/store/market-data-store'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OptionsChainModalProps {
  symbol: string
  onOptionSelect: (optionSymbol: string, premium: number, strike: number) => void
  onClose: () => void
  optionType: 'call' | 'put'
}

export function OptionsChainModal({ symbol, onOptionSelect, onClose, optionType }: OptionsChainModalProps) {
  const { expiryDates, fetchExpiryDates, optionsChain, fetchOptionsChain } = useMarketDataStore()
  const [selectedExpiryTab, setSelectedExpiryTab] = useState<string>('')

  useEffect(() => {
    if (!expiryDates.data) {
      fetchExpiryDates(symbol)
    }
  }, [symbol, expiryDates.data, fetchExpiryDates])

  useEffect(() => {
    // Extract data from store state
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

  const handleRowClick = (option: any) => {
    const premium = option.mark || option.lastPrice || 0
    onOptionSelect(option.symbol, premium, option.strikePrice)
    onClose()
  }

  // Parse date strings as local dates to avoid timezone issues
  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  // Extract data from store state
  // Store already handles the double-nested response structure
  const expiryData = expiryDates.data as any
  const chainData = optionsChain.data as any
  const optionsList = optionType === 'call' ? chainData?.calls : chainData?.puts
  const underlyingPrice = chainData?.underlyingPrice

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {symbol} - {optionType === 'call' ? 'Calls' : 'Puts'} Options Chain
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Expiry Tabs */}
        <div className="overflow-x-auto border-b border-gray-700 bg-gray-800/50">
          <div className="flex gap-1 p-2">
            {expiryDates.isLoading ? (
              <div className="text-gray-400 text-sm px-4 py-2">Loading expiry dates...</div>
            ) : (
              expiryData?.expiryDates?.slice(0, 10).map((expiry: any) => (
                <button
                  key={expiry.date}
                  onClick={() => handleExpiryTabClick(expiry.date)}
                  className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedExpiryTab === expiry.date
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {parseLocalDate(expiry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit'
                  })}
                  <span className="ml-2 text-xs opacity-75">
                    ({expiry.daysUntilExpiry}d)
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Options Table */}
        <div className="overflow-auto max-h-[calc(80vh-140px)]">
          {optionsChain.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading options chain...</div>
            </div>
          ) : optionsChain.isError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-400">Error loading options: {optionsChain.error}</div>
            </div>
          ) : !optionsList || optionsList.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">No options available for this expiry date</div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800 sticky top-0">
                <tr className="text-xs text-gray-400 uppercase">
                  <th className="px-4 py-3 text-left">Strike</th>
                  <th className="px-4 py-3 text-right">Bid</th>
                  <th className="px-4 py-3 text-right">Mid</th>
                  <th className="px-4 py-3 text-right">Ask</th>
                  <th className="px-4 py-3 text-right">Last</th>
                  <th className="px-4 py-3 text-right">Volume</th>
                  <th className="px-4 py-3 text-right">OI</th>
                  <th className="px-4 py-3 text-right">IV</th>
                </tr>
              </thead>
              <tbody>
                {optionsList.map((option: any) => {
                  const isITM = optionType === 'call'
                    ? option.strikePrice < underlyingPrice
                    : option.strikePrice > underlyingPrice
                  const isATM = Math.abs(option.strikePrice - underlyingPrice) < 1

                  return (
                    <tr
                      key={option.symbol}
                      onClick={() => handleRowClick(option)}
                      className={`border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                        isATM ? 'bg-blue-900/20' : isITM ? 'bg-green-900/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        ${option.strikePrice.toFixed(2)}
                        {isATM && <span className="ml-2 text-xs text-blue-400">ATM</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {option.bid > 0 ? `$${option.bid.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        {option.mark > 0 ? `$${option.mark.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {option.ask > 0 ? `$${option.ask.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {option.lastPrice > 0 ? `$${option.lastPrice.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 text-sm">
                        {option.volume?.toLocaleString() || '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 text-sm">
                        {option.openInterest?.toLocaleString() || '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 text-sm">
                        {option.impliedVolatility ? (option.impliedVolatility * 100).toFixed(1) + '%' : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              {underlyingPrice && (
                <span>Current Price: <span className="text-white font-medium">${underlyingPrice.toFixed(2)}</span></span>
              )}
            </div>
            <div className="text-gray-400">
              Click any row to select
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
