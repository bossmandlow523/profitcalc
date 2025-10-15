import { BlurDropdown, DropdownOption } from '@/components/ui/blur-dropdown'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface OptionsActionDropdownProps {
  selectedOption?: string
  onSelect?: (optionKey: string) => void
  variant?: 'Buy' | 'Write' | 'Short'
  disabled?: boolean
}

export function OptionsActionDropdown({
  selectedOption,
  onSelect,
  variant = 'Buy',
  disabled = false,
}: OptionsActionDropdownProps) {
  const options: DropdownOption[] = [
    {
      key: 'buy',
      label: 'Buy Option',
      onClick: () => onSelect?.('buy'),
    },
    {
      key: 'write',
      label: 'Write Option',
      onClick: () => onSelect?.('write'),
    },
    {
      key: 'short',
      label: 'Short Option',
      onClick: () => onSelect?.('short'),
      color: 'danger',
    },
  ]

  const selectedLabel = options.find(opt => opt.key === selectedOption)?.label || variant

  return (
    <BlurDropdown
      trigger={
        <Button
          variant="outline"
          className="w-full justify-between border-2 backdrop-blur-sm"
          disabled={disabled}
        >
          <span>{selectedLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      }
      options={options}
      menuClassName="w-[200px]"
      align="start"
    />
  )
}

// Example: Strike Price Selector Dropdown
interface StrikePriceDropdownProps {
  strikes: Array<{
    strike: number
    bid: number
    mid: number
    ask: number
  }>
  onSelect?: (strike: number) => void
  selectedStrike?: number
}

export function StrikePriceDropdown({
  strikes,
  onSelect,
  selectedStrike,
}: StrikePriceDropdownProps) {
  const options: DropdownOption[] = strikes.map((s) => ({
    key: s.strike.toString(),
    label: `$${s.strike.toFixed(2)} (Mid: $${s.mid.toFixed(2)})`,
    onClick: () => onSelect?.(s.strike),
    className: selectedStrike === s.strike ? 'bg-primary/10 font-semibold' : '',
  }))

  return (
    <BlurDropdown
      trigger={
        <Button variant="outline" className="w-full justify-between border-2">
          <span>
            {selectedStrike ? `$${selectedStrike.toFixed(2)}` : 'Select Strike'}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      }
      options={options}
      menuClassName="w-full max-h-[300px] overflow-y-auto"
      align="start"
    />
  )
}

// Example: Simple Menu Dropdown (like your example)
export function SimpleMenuDropdown() {
  const menuOptions: DropdownOption[] = [
    {
      key: 'new',
      label: 'New file',
      onClick: () => console.log('New file'),
    },
    {
      key: 'copy',
      label: 'Copy link',
      onClick: () => console.log('Copy link'),
    },
    {
      key: 'edit',
      label: 'Edit file',
      onClick: () => console.log('Edit file'),
    },
    {
      key: 'delete',
      label: 'Delete file',
      onClick: () => console.log('Delete file'),
      color: 'danger',
      className: 'font-semibold',
    },
  ]

  return (
    <BlurDropdown
      triggerLabel="Open Menu"
      triggerVariant="bordered"
      options={menuOptions}
      menuClassName="min-w-[160px]"
    />
  )
}
