import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StrategyBreakdownBox } from './StrategyBreakdownBox';

interface Strategy {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  whatItIs: string;
  whenToUse: string[];
  risks: string[];
}

const basicStrategies: Strategy[] = [
  {
    name: 'Long Call',
    type: 'bullish',
    whatItIs: 'You buy a call option: you pay premium to bet the stock goes up.',
    whenToUse: [
      'You\'re bullish and expect a decent rise',
      'You want leveraged upside exposure',
      'You have limited capital but want stock exposure'
    ],
    risks: [
      'If the stock doesn\'t move enough (or moves too slowly), you lose your premium',
      'Time decay works against you',
      'Maximum loss is 100% of premium paid'
    ]
  },
  {
    name: 'Long Put',
    type: 'bearish',
    whatItIs: 'You buy a put option: you pay premium to bet the stock goes down.',
    whenToUse: [
      'You\'re bearish and expect a drop',
      'You want to hedge existing long positions',
      'You want leveraged downside exposure'
    ],
    risks: [
      'If the stock doesn\'t fall enough, you lose the premium',
      'Time decay erodes value',
      'Maximum loss is 100% of premium paid'
    ]
  },
  {
    name: 'Covered Call',
    type: 'neutral',
    whatItIs: 'You own the stock, and you sell a call on it. You get income but cap upside.',
    whenToUse: [
      'You\'re moderately bullish or neutral—happy with limited gain + income',
      'You want to generate income on stocks you own',
      'You\'re willing to sell the stock at the strike price'
    ],
    risks: [
      'The stock tanks—you still lose on stock holdings',
      'If it rockets, you miss out on big upside',
      'Assignment risk if stock goes above strike'
    ]
  },
  {
    name: 'Cash-Secured Put',
    type: 'neutral',
    whatItIs: 'You sell a put option, and you have the cash ready in case you\'re assigned (you buy the stock).',
    whenToUse: [
      'You\'re neutral-to-bullish and wouldn\'t mind owning the stock at that strike',
      'You want to potentially buy stock at a discount',
      'You want to collect premium income'
    ],
    risks: [
      'The stock drops big → you buy at strike, but market price is much lower',
      'Big loss potential if stock plummets',
      'Requires significant capital tied up'
    ]
  },
  {
    name: 'Naked Call',
    type: 'bearish',
    whatItIs: 'You sell a call option and don\'t own the underlying. Premium income, but huge risk if stock rises.',
    whenToUse: [
      'You\'re bearish (or at least think stock won\'t rise)',
      'You have required margin and risk management',
      'You\'re experienced with unlimited risk positions'
    ],
    risks: [
      'Stock goes up big: UNLIMITED LOSS POTENTIAL',
      'Very risky—not recommended for beginners',
      'Margin requirements can increase rapidly'
    ]
  },
  {
    name: 'Naked Put',
    type: 'bullish',
    whatItIs: 'You sell a put option without hedging. You get premium, but if stock drops you\'re on the hook.',
    whenToUse: [
      'You\'re bullish/neutral and willing to own the stock at the strike price',
      'You want premium income',
      'You believe the stock won\'t fall significantly'
    ],
    risks: [
      'Stock plummets: you buy at strike, but market value is much lower → large loss',
      'Loss potential down to stock going to zero',
      'Requires significant margin/cash'
    ]
  }
];

const spreadStrategies: Strategy[] = [
  {
    name: 'Credit Spread',
    type: 'neutral',
    whatItIs: 'You sell one option and buy another (same class, same expiry) so you receive a net premium. Limited reward + defined risk.',
    whenToUse: [
      'You\'re neutral to slightly directional (bullish/bearish) and want income',
      'You want defined risk and reward',
      'You believe the stock will stay within a range'
    ],
    risks: [
      'The stock moves strongly against you → you hit max loss',
      'Max loss = difference between strikes minus credit received',
      'Early assignment risk on short leg'
    ]
  },
  {
    name: 'Call Spread (Debit)',
    type: 'bullish',
    whatItIs: 'Vertical: buy a call and sell another call at a higher strike (same expiry). Costs net premium.',
    whenToUse: [
      'You\'re bullish but want to reduce cost/risk versus just buying a call',
      'You have a specific price target in mind',
      'You want defined risk and reward'
    ],
    risks: [
      'Stock doesn\'t rise enough → you lose most or all of premium',
      'Upside is capped at the short strike',
      'Both legs subject to time decay'
    ]
  },
  {
    name: 'Put Spread (Debit)',
    type: 'bearish',
    whatItIs: 'Buy a put, sell a lower-strike put (same expiry).',
    whenToUse: [
      'You\'re bearish but want to lower cost/risk',
      'You have a specific downside target',
      'You want defined maximum loss'
    ],
    risks: [
      'Stock doesn\'t fall enough → you lose premium',
      'Gain is capped at the difference between strikes',
      'Time decay affects both legs'
    ]
  },
  {
    name: 'Poor Man\'s Covered Call',
    type: 'bullish',
    whatItIs: 'Instead of owning the stock, you buy a long-dated call (cheap hedge) + sell a shorter-term call.',
    whenToUse: [
      'You\'re bullish long-term, want income short-term',
      'You want less capital outlay than owning stock',
      'You believe in the stock but want to reduce cost basis'
    ],
    risks: [
      'If nothing happens, you lose long call\'s time value',
      'If big move up, managing the short call becomes complex',
      'Requires active management of both legs'
    ]
  },
  {
    name: 'Calendar Spread',
    type: 'neutral',
    whatItIs: 'Buy an option with longer expiry + sell one with nearer expiry (same strike). You exploit time decay differences.',
    whenToUse: [
      'You believe little will happen in short term, maybe movement later',
      'You want to profit from time decay',
      'You expect low volatility near term'
    ],
    risks: [
      'If stock moves a lot in near term, the short leg gets hurt',
      'Volatility changes/time-decay shifts can go against you',
      'More complex to manage than vertical spreads'
    ]
  },
  {
    name: 'Ratio Back Spread',
    type: 'neutral',
    whatItIs: 'Unequal legs: you sell fewer options and buy more (e.g., sell 1 call, buy 2 calls). Big upside if big move, smaller cost.',
    whenToUse: [
      'You expect a large move (up or down) and want to benefit heavily from it',
      'You want unlimited profit potential in one direction',
      'You can manage complex positions'
    ],
    risks: [
      'If the move is mild or flat, you lose because you paid more (or got small credit)',
      'Risk kicks in at the short strike',
      'Complex to manage and adjust'
    ]
  }
];

const advancedStrategies: Strategy[] = [
  {
    name: 'Iron Condor',
    type: 'neutral',
    whatItIs: 'Combine a bear call spread + a bull put spread (4 legs) on same expiry: you want the stock to stay in between.',
    whenToUse: [
      'You expect low volatility / range-bound stock',
      'You want to profit from time decay',
      'You want defined risk on both sides'
    ],
    risks: [
      'If stock breaks out above or below your range, you suffer',
      'Reward is limited to net credit received',
      'Requires active monitoring for breakouts'
    ]
  },
  {
    name: 'Butterfly',
    type: 'neutral',
    whatItIs: 'Typically 3 strikes: buy 1 option, sell 2 at middle strike, buy 1 at outer strike. Narrow profit zone.',
    whenToUse: [
      'You\'re very confident on where the stock will end up (near a specific price)',
      'You expect minimal movement',
      'You want high reward-to-risk ratio if correct'
    ],
    risks: [
      'If stock ends far from your middle strike, you lose',
      'Narrow sweet-spot means high precision required',
      'Lower probability of profit'
    ]
  },
  {
    name: 'Collar',
    type: 'neutral',
    whatItIs: 'You own the stock + buy a put (downside protection) + sell a call (caps upside).',
    whenToUse: [
      'You like the stock but want to limit downside',
      'You\'re willing to cap upside for protection',
      'You want to protect gains in a long position'
    ],
    risks: [
      'You give up big profit potential',
      'If stock collapses beyond your put strike, you still lose',
      'May incur net cost depending on strikes chosen'
    ]
  },
  {
    name: 'Diagonal Spread',
    type: 'neutral',
    whatItIs: 'Options differ in both strike and expiry: e.g., long longer-term call, sell nearer-term call at different strike.',
    whenToUse: [
      'You\'re bullish with a view on time and strike',
      'You want flexibility and income',
      'You can actively manage rolling positions'
    ],
    risks: [
      'More complex (two expiries)',
      'More to manage (rolls, timing)',
      'Volatility/time shifts can hit you unexpectedly'
    ]
  },
  {
    name: 'Double Diagonal',
    type: 'neutral',
    whatItIs: 'Combine diagonals on both calls & puts: 4 or more legs. You\'re building a range/resilience trade.',
    whenToUse: [
      'You expect the stock to stay within a range but want protection if it doesn\'t',
      'You want to collect premium on both sides',
      'You have advanced options trading experience'
    ],
    risks: [
      'Very complex—many legs = many moving parts',
      'Higher cost and commissions',
      'Harder to manage and exit'
    ]
  },
  {
    name: 'Straddle',
    type: 'neutral',
    whatItIs: 'Buy a call + a put at same strike/expiry. You profit if stock moves big either way.',
    whenToUse: [
      'You expect a big move but don\'t know direction (earnings, event)',
      'High implied volatility is expected',
      'You believe current IV is underpriced'
    ],
    risks: [
      'If stock doesn\'t move much, you lose both premiums',
      'Time decay kills value on both sides',
      'Expensive to enter—need significant move'
    ]
  },
  {
    name: 'Strangle',
    type: 'neutral',
    whatItIs: 'Buy a call + a put with different strikes (usually OTM). Cheaper than straddle but needs a bigger move.',
    whenToUse: [
      'Expect big move, but want cheaper entry',
      'You accept needing a larger move than a straddle',
      'Earnings or major event expected'
    ],
    risks: [
      'Stock moves a little → you lose both premiums',
      'Higher risk of losing than a straddle if move is mild',
      'Time decay on both legs'
    ]
  },
  {
    name: 'Covered Strangle',
    type: 'neutral',
    whatItIs: 'You own stock (or are ready for assignment) + you sell an OTM call + sell an OTM put. You collect two premiums.',
    whenToUse: [
      'You believe stock will stay in a range',
      'You\'re comfortable owning more stock or taking assignment',
      'You want aggressive income generation'
    ],
    risks: [
      'If stock jumps up, your upside is capped (call)',
      'If stock drops, you might buy more (put)',
      'Lots of assignment risk, big moves hurt you'
    ]
  },
  {
    name: 'Synthetic Put',
    type: 'bearish',
    whatItIs: 'Replicate a put\'s payoff using other combinations (calls + stock).',
    whenToUse: [
      'You want put-like exposure but perhaps cheaper',
      'You want to use a specific structure for tax/margin reasons',
      'You\'re an advanced trader looking for synthetic positions'
    ],
    risks: [
      'Complexity increases—you might mis-replicate',
      'Margin/interest/early exercise risk',
      'Requires active management'
    ]
  },
  {
    name: 'Reverse Conversion',
    type: 'neutral',
    whatItIs: 'Essentially an arbitrage: combining short underlying + options to lock in financing/dividend differences. Very advanced.',
    whenToUse: [
      'You\'re a pro, see mispricing',
      'You want to exploit subtle risk/return',
      'You have sophisticated execution capabilities'
    ],
    risks: [
      'High execution/tracking risk',
      'Margin and transaction cost issues',
      'Mis-timing = losses'
    ]
  }
];

const getTypeIcon = (type: 'bullish' | 'bearish' | 'neutral') => {
  switch (type) {
    case 'bullish':
      return <TrendingUp className="w-4 h-4" />;
    case 'bearish':
      return <TrendingDown className="w-4 h-4" />;
    case 'neutral':
      return <Minus className="w-4 h-4" />;
  }
};

const getTypeBadgeColor = (type: 'bullish' | 'bearish' | 'neutral') => {
  switch (type) {
    case 'bullish':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'bearish':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'neutral':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

const StrategyCard = ({ strategy, index }: { strategy: Strategy; index: number }) => (
  <BlurFade key={strategy.name} delay={0.05 * index} duration={0.3}>
    <MagicCard
      className="h-full border border-purple-500/30"
      gradientFrom="#3b82f6"
      gradientTo="#8b5cf6"
      gradientSize={300}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
          <Badge className={`${getTypeBadgeColor(strategy.type)} flex items-center gap-1`}>
            {getTypeIcon(strategy.type)}
            <span className="capitalize">{strategy.type}</span>
          </Badge>
        </div>

        {/* What it is */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
            What it is
          </h4>
          <p className="text-gray-300 leading-relaxed">
            {strategy.whatItIs}
          </p>
        </div>

        {/* When to use */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
            When to use
          </h4>
          <ul className="space-y-1.5">
            {strategy.whenToUse.map((use, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start">
                <span className="text-green-400 mr-2 mt-0.5">•</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="border-t border-gray-700/50 pt-4">
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            What can go wrong
          </h4>
          <ul className="space-y-1.5">
            {strategy.risks.map((risk, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start">
                <span className="text-red-400 mr-2 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MagicCard>
  </BlurFade>
);

export default function StrategiesPage() {
  const [activeTab, setActiveTab] = useState('basic');

  const strategiesSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    'name': 'Options Trading Strategies Guide',
    'description': 'Comprehensive guide to options trading strategies from basic to advanced including long calls, puts, spreads, iron condors, and multi-leg strategies.',
    'provider': {
      '@type': 'Organization',
      'name': 'Options Calculator'
    }
  };

  return (
    <>
      <Helmet>
        <title>Options Trading Strategies Guide - From Basic to Advanced</title>
        <meta
          name="description"
          content="Complete guide to options trading strategies: long calls, puts, covered calls, spreads, iron condors, butterflies, straddles, and advanced multi-leg strategies. Learn when to use each strategy and understand the risks."
        />
        <meta
          name="keywords"
          content="options strategies, long call, long put, covered call, credit spread, iron condor, butterfly spread, straddle, strangle, options trading strategies, multi-leg options"
        />
        <link rel="canonical" href="https://optionscalculator.com/strategies" />
        <script type="application/ld+json">
          {JSON.stringify(strategiesSchema)}
        </script>
      </Helmet>

      <main className="relative z-10 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Options Trading Strategies
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Master every options strategy from simple single-leg trades to complex multi-leg positions.
              Understand what each strategy is, when to use it, and what risks you're taking.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 max-w-2xl mx-auto">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p>
                Pro tip: The more legs you add, the more you must monitor Greeks (delta, theta, vega, gamma),
                volatility, time decay, assignment risk, liquidity, and transaction costs.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800/50">
              <TabsTrigger value="basic" className="text-base">
                Basic Strategies
              </TabsTrigger>
              <TabsTrigger value="spreads" className="text-base">
                Spreads
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-base">
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Basic Strategies Tab */}
            <TabsContent value="basic">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Basic Strategies</h2>
                <p className="text-gray-400">
                  Core single-leg or simple combo plays. Good to know before stepping into more complex strategies.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {basicStrategies.map((strategy, index) => (
                  <StrategyCard key={strategy.name} strategy={strategy} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Spreads Tab */}
            <TabsContent value="spreads">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Spread Strategies</h2>
                <p className="text-gray-400">
                  Combine buying and selling options to manage risk and reward more precisely with defined-risk positions.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {spreadStrategies.map((strategy, index) => (
                  <StrategyCard key={strategy.name} strategy={strategy} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Advanced Strategies</h2>
                <p className="text-gray-400">
                  Multi-leg trades with more moving parts. These require active management and deeper understanding of options mechanics.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {advancedStrategies.map((strategy, index) => (
                  <StrategyCard key={strategy.name} strategy={strategy} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Multi-Leg Complexity Info */}
          <BlurFade delay={0.3}>
            <MagicCard className="mt-12 p-8" gradientFrom="#3b82f6" gradientTo="#a855f7">
              <h2 className="text-2xl font-bold mb-4">Custom Multi-Leg Structures</h2>
              <p className="text-gray-300 mb-4">
                You can build custom strategies with multiple legs. The more legs you add, the more precision—and the more things that can go wrong.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-bold text-blue-400 mb-2">2-3 Legs</h3>
                  <p className="text-gray-300">Lower complexity. Easier to manage. Good for beginners moving beyond single-leg trades.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-bold text-purple-400 mb-2">4-5 Legs</h3>
                  <p className="text-gray-300">Intermediate+ complexity. Requires active monitoring of Greeks and multiple expiries.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-bold text-red-400 mb-2">6+ Legs</h3>
                  <p className="text-gray-300">Extremely complex. Professional-level structures with multiple hedges and adjustments.</p>
                </div>
              </div>
            </MagicCard>
          </BlurFade>

          {/* Strategy Breakdown & Need Help Box */}
          <StrategyBreakdownBox />

          {/* CTA Section */}
          <BlurFade delay={0.4}>
            <MagicCard className="mt-12 text-center p-8" gradientFrom="#3b82f6" gradientTo="#a855f7">
              <h2 className="text-2xl font-bold mb-4">Ready to Calculate Your Strategy?</h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Use our free options profit calculator to model any strategy with real-time P&L visualization,
                Greeks analysis, and breakeven calculations
              </p>
              <a
                href="/calculator"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Start Calculating
              </a>
            </MagicCard>
          </BlurFade>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm">
              New to options trading? Check out our{' '}
              <a href="/faq" className="text-blue-400 hover:text-blue-300 underline">FAQ page</a> or{' '}
              <a href="/blog" className="text-blue-400 hover:text-blue-300 underline">educational blog</a> for more resources
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
