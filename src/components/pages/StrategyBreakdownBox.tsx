import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { Sparkles, TrendingUp, Shield, AlertCircle, Globe } from 'lucide-react';

const updates = [
  {
    icon: Sparkles,
    title: 'Ad-Free Experience',
    description: 'with our Membership program',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400/30',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Cash Secured Put',
    description: 'calculator added',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: "Poor Man's Covered Call",
    description: 'calculator added',
    color: 'text-purple-400',
    borderColor: 'border-purple-400/30',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: AlertCircle,
    title: 'Find the best spreads',
    description: 'and short options',
    color: 'text-orange-400',
    borderColor: 'border-orange-400/30',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Globe,
    title: 'Support for Canadian MX',
    description: 'options',
    color: 'text-red-400',
    borderColor: 'border-red-400/30',
    bgColor: 'bg-red-500/10',
  },
];

export function StrategyBreakdownBox() {
  return (
    <BlurFade delay={0.35}>
      <MagicCard className="mt-12 p-8" gradientFrom="#3b82f6" gradientTo="#a855f7">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Strategy Breakdown & Need Help?</h2>
          <p className="text-gray-300">
            Explore our latest features and calculators for your options trading strategies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {updates.map((update, index) => {
            const Icon = update.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 ${update.bgColor} rounded-lg border ${update.borderColor} hover:border-white/40 transition-all duration-200 cursor-pointer group bg-gray-900/40`}
              >
                <div className={`mt-0.5 flex-shrink-0 ${update.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">
                    {update.title}
                  </h4>
                  <p className="text-gray-300 text-xs">{update.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-300 mb-4">
            Want to learn more about these strategies and how to use them?
          </p>
          <a
            href="/strategies"
            className="inline-block text-blue-300 hover:text-blue-200 font-semibold underline transition-colors"
          >
            View all strategies →
          </a>
        </div>
      </MagicCard>
    </BlurFade>
  );
}
