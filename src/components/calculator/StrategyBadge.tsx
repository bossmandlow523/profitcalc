import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StrategyBadgeProps {
  strategyName: string;
  confidence: number;
  requiresStock: boolean;
  hasStock: boolean;
  requiresTimeBasedCalc: boolean;
}

export function StrategyBadge({
  strategyName,
  confidence,
  requiresStock,
  hasStock,
  requiresTimeBasedCalc
}: StrategyBadgeProps) {
  // Determine badge color based on confidence
  const getConfidenceColor = () => {
    if (confidence >= 0.95) return 'from-green-500 to-emerald-600';
    if (confidence >= 0.8) return 'from-yellow-500 to-amber-600';
    return 'from-gray-500 to-slate-600';
  };

  // Determine icon based on confidence
  const getConfidenceIcon = () => {
    if (confidence >= 0.95) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.8) return <TrendingUp className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Show warning if stock is required but missing
  const showStockWarning = requiresStock && !hasStock && confidence >= 0.8;

  return (
    <div className="space-y-2">
      {/* Strategy Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-dark-700 to-dark-800 border-2 border-white/10">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r ${getConfidenceColor()} text-white font-semibold text-sm`}>
          {getConfidenceIcon()}
          <span>Detected Strategy</span>
        </div>
        <div className="text-white font-bold text-lg">
          {strategyName}
        </div>
        <div className="text-xs text-gray-400 ml-2">
          {(confidence * 100).toFixed(0)}% confidence
        </div>
        {requiresTimeBasedCalc && (
          <div className="flex items-center gap-1 text-xs text-blue-400 ml-2">
            <Clock className="w-3 h-3" />
            <span>Time-based</span>
          </div>
        )}
      </div>

      {/* Stock Warning */}
      {showStockWarning && (
        <div className="flex items-start gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
          <div className="text-sm text-orange-300">
            <span className="font-semibold">{strategyName}</span> typically requires a stock position.
            Add a stock position below for accurate calculations.
          </div>
        </div>
      )}

      {/* Time-based Warning */}
      {requiresTimeBasedCalc && confidence >= 0.8 && (
        <div className="flex items-start gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-300">
            This is a time-based strategy (calendar/diagonal spread). Calculations use Black-Scholes
            pricing with the current volatility settings.
          </div>
        </div>
      )}
    </div>
  );
}
