import { useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useMarketDataStore } from '@/lib/store/market-data-store'

interface ExpiryDateSelectorProps {
  symbol?: string
  onExpirySelect?: (date: string) => void
  className?: string
}

export function ExpiryDateSelector({
  symbol,
  onExpirySelect,
  className,
}: ExpiryDateSelectorProps) {
  const {
    currentSymbol,
    expiryDates,
    selectedExpiryDate,
    setSelectedExpiryDate,
  } = useMarketDataStore()

  const handleExpiryChange = (date: string) => {
    setSelectedExpiryDate(date)
    onExpirySelect?.(date)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Get badge variant based on expiry type
  const getExpiryBadge = (type: string) => {
    switch (type) {
      case 'monthly':
        return <Badge variant="default" className="ml-2 text-xs">Monthly</Badge>
      case 'leaps':
        return <Badge variant="secondary" className="ml-2 text-xs">LEAP</Badge>
      case 'quarterly':
        return <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
      default:
        return null
    }
  }

  const activeSymbol = symbol || currentSymbol

  // Show loading state
  if (expiryDates.isLoading) {
    return (
      <div className={className}>
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          Expiry Date
        </Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading expiry dates..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  // Show error state
  if (expiryDates.isError) {
    return (
      <div className={className}>
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          Expiry Date
        </Label>
        <Select disabled>
          <SelectTrigger className="border-red-500">
            <SelectValue placeholder="Error loading expiry dates" />
          </SelectTrigger>
        </Select>
        <p className="text-xs text-red-500 mt-1">
          {expiryDates.error?.message || 'Failed to load expiry dates'}
        </p>
      </div>
    )
  }

  // Show empty state
  if (!activeSymbol || !expiryDates.data) {
    return (
      <div className={className}>
        <Label className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          Expiry Date
        </Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select a symbol first" />
          </SelectTrigger>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Search for a stock symbol to load expiry dates
        </p>
      </div>
    )
  }

  const expiries = expiryDates.data.expiryDates

  return (
    <div className={className}>
      <Label className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4" />
        Expiry Date
      </Label>

      <Select value={selectedExpiryDate || undefined} onValueChange={handleExpiryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select expiry date" />
        </SelectTrigger>
        <SelectContent>
          {expiries.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No expiry dates available
            </div>
          ) : (
            expiries.map((expiry) => (
              <SelectItem key={expiry.date} value={expiry.date}>
                <div className="flex items-center justify-between w-full">
                  <span>{formatDate(expiry.date)}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({expiry.daysUntilExpiry}d)
                  </span>
                  {expiry.isStandard && getExpiryBadge(expiry.type)}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedExpiryDate && (
        <p className="text-xs text-muted-foreground mt-2">
          Options expire in{' '}
          <span className="font-semibold">
            {expiries.find((e) => e.date === selectedExpiryDate)?.daysUntilExpiry} days
          </span>
        </p>
      )}
    </div>
  )
}
