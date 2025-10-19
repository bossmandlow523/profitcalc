import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface NumberInputProps {
  id?: string
  value?: string | number
  onValueChange?: (value: number) => void
  placeholder?: string
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  step?: number
  minValue?: number
  maxValue?: number
  isRequired?: boolean
  isDisabled?: boolean
  "aria-label"?: string
  formatOptions?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
  classNames?: {
    base?: string
    inputWrapper?: string
    input?: string
  }
  className?: string
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      value = "",
      onValueChange,
      placeholder,
      startContent,
      endContent,
      step = 1,
      minValue,
      maxValue,
      isRequired = false,
      isDisabled = false,
      "aria-label": ariaLabel,
      formatOptions,
      classNames,
      className,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(value.toString())
    const [isFocused, setIsFocused] = React.useState(false)

    // Update display value when prop changes
    React.useEffect(() => {
      if (!isFocused) {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0
        if (formatOptions && numValue !== 0) {
          setDisplayValue(
            numValue.toLocaleString('en-US', {
              minimumFractionDigits: formatOptions.minimumFractionDigits,
              maximumFractionDigits: formatOptions.maximumFractionDigits,
            })
          )
        } else {
          setDisplayValue(value.toString())
        }
      }
    }, [value, formatOptions, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value

      // Allow empty string, digits, decimal point, and minus sign
      if (rawValue === '' || /^-?\d*\.?\d*$/.test(rawValue)) {
        setDisplayValue(rawValue)

        // Parse and validate the number
        const numValue = parseFloat(rawValue)

        if (!isNaN(numValue)) {
          // Apply min/max constraints
          let constrainedValue = numValue
          if (minValue !== undefined && numValue < minValue) {
            constrainedValue = minValue
          }
          if (maxValue !== undefined && numValue > maxValue) {
            constrainedValue = maxValue
          }

          if (onValueChange) {
            onValueChange(constrainedValue)
          }
        } else if (rawValue === '' || rawValue === '-') {
          // Allow clearing the input or starting with minus
          if (onValueChange) {
            onValueChange(0)
          }
        }
      }
    }

    const handleBlur = () => {
      setIsFocused(false)

      // Format the value on blur
      const numValue = parseFloat(displayValue) || 0

      // Apply min/max constraints
      let constrainedValue = numValue
      if (minValue !== undefined && numValue < minValue) {
        constrainedValue = minValue
      }
      if (maxValue !== undefined && numValue > maxValue) {
        constrainedValue = maxValue
      }

      // Format with specified decimal places
      if (formatOptions) {
        setDisplayValue(
          constrainedValue.toLocaleString('en-US', {
            minimumFractionDigits: formatOptions.minimumFractionDigits,
            maximumFractionDigits: formatOptions.maximumFractionDigits,
          })
        )
      } else {
        setDisplayValue(constrainedValue.toString())
      }

      if (onValueChange && constrainedValue !== numValue) {
        onValueChange(constrainedValue)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)

      // Remove formatting on focus for easier editing
      const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0
      setDisplayValue(numValue.toString())

      // Select all text for easy replacement
      e.target.select()
    }

    const handleIncrement = () => {
      if (isDisabled) return

      const currentValue = typeof value === 'number' ? value : parseFloat(value as string) || 0
      let newValue = currentValue + step

      // Apply max constraint
      if (maxValue !== undefined && newValue > maxValue) {
        newValue = maxValue
      }

      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    const handleDecrement = () => {
      if (isDisabled) return

      const currentValue = typeof value === 'number' ? value : parseFloat(value as string) || 0
      let newValue = currentValue - step

      // Apply min constraint
      if (minValue !== undefined && newValue < minValue) {
        newValue = minValue
      }

      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    return (
      <div
        className={cn(
          "relative flex items-center",
          classNames?.base,
          className
        )}
        data-slot="base"
      >
        <div
          className={cn(
            "relative flex items-center w-full rounded-md border border-input bg-transparent shadow-sm transition-colors",
            "focus-within:ring-1 focus-within:ring-ring",
            isDisabled && "opacity-50 cursor-not-allowed",
            classNames?.inputWrapper
          )}
          data-slot="input-wrapper"
        >
          {startContent && (
            <div className="flex items-center pl-3 pointer-events-none">
              {startContent}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={isDisabled}
            required={isRequired}
            aria-label={ariaLabel}
            step={step}
            className={cn(
              "flex h-9 w-full bg-transparent px-3 py-1 text-sm transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startContent && "pl-1",
              endContent && "pr-1",
              classNames?.input
            )}
            data-slot="input"
          />

          {endContent && (
            <div className="flex items-center pr-3 pointer-events-none">
              {endContent}
            </div>
          )}

          {/* Increment/Decrement Controls */}
          <div className="flex flex-col border-l border-input">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isDisabled || (maxValue !== undefined && typeof value === 'number' && value >= maxValue)}
              className={cn(
                "flex items-center justify-center h-[18px] px-2 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "border-b border-input"
              )}
              aria-label="Increment value"
              tabIndex={-1}
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isDisabled || (minValue !== undefined && typeof value === 'number' && value <= minValue)}
              className={cn(
                "flex items-center justify-center h-[18px] px-2 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
              aria-label="Decrement value"
              tabIndex={-1}
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    )
  }
)

NumberInput.displayName = "NumberInput"
