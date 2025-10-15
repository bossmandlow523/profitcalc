import { Button } from '../ui/button'

const calculations = [
  { name: 'Long Call (bullish)', active: true },
  { name: 'Synthetic Put', active: false },
  { name: 'Ratio Back Spread', active: false },
  { name: 'Diagonal Spread', active: false },
  { name: 'Put Spread', active: false },
  { name: 'Long Call (bullish)', active: false },
  { name: 'Reverse Conversion', active: false },
]

export function CalculatorSidebar() {
  return (
    <aside className="w-full lg:w-56 flex-shrink-0 space-y-6 animate-fade-in">
      <div className="glass-card-strong rounded-2xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold">
          Current Calculations
        </div>
        <div className="p-3 space-y-2">
          {calculations.map((calc, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-left px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                calc.active
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white border-white/10'
              }`}
            >
              {calc.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-72 glass-card rounded-2xl flex items-center justify-center text-gray-500 text-xs font-semibold border border-white/10">
        <div className="text-center">
          <div>AD SPACE</div>
          <div className="mt-1">300×300</div>
        </div>
      </div>
    </aside>
  )
}
