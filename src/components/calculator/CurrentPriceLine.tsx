interface CurrentPriceLineProps {
  currentPrice: number
  symbol: string
}

export function CurrentPriceLine({ currentPrice, symbol }: CurrentPriceLineProps) {
  return (
    <tr className="relative">
      <td colSpan={13} className="p-0 relative">
        {/* Price Line */}
        <div className="absolute inset-0 flex items-center z-20 pointer-events-none py-2">
          <div className="w-full flex items-center gap-0">
            {/* Left Line - Solid */}
            <div className="flex-1 h-[2px] bg-yellow-500"></div>

            {/* Center Price Label - Slim & Rounded */}
            <div className="bg-yellow-500 text-black px-3 py-0.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 whitespace-nowrap mx-1">
              <span>{symbol}</span>
              <span>${currentPrice.toFixed(2)}</span>
            </div>

            {/* Right Line - Solid */}
            <div className="flex-1 h-[2px] bg-yellow-500"></div>
          </div>
        </div>

        {/* Spacer for table layout - Slimmer */}
        <div className="h-6"></div>
      </td>
    </tr>
  )
}
