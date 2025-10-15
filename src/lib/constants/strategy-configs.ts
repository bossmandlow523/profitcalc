/**
 * Strategy-Specific Configuration
 * Maps strategy names to their calculator page configuration
 */

export interface StrategyConfig {
  name: string
  description: string
  legCount: number
  faqQuestions: string[]
  formConfig: {
    legs: LegConfig[]
  }
}

export interface LegConfig {
  label: string
  type: 'call' | 'put'
  position: 'buy' | 'write'
  required: boolean
}

export const STRATEGY_CONFIGS: Record<string, StrategyConfig> = {
  // ============================================================================
  // BASIC STRATEGIES
  // ============================================================================
  'Long Call': {
    name: 'Long Call',
    description:
      'Purchasing a call is one of the most basic options trading strategies and is suitable when sentiment is strongly bullish. It can be used as a leveraging tool as an alternative to margin trading.',
    legCount: 1,
    faqQuestions: [
      'How do you calculate call options?',
      'How to choose the best strike price for a long call?',
      'How much do you make on call options?',
      'How do you use volatility on long calls',
      'Time value of call options',
      'What happens when call options expire?',
    ],
    formConfig: {
      legs: [{ label: 'Call Option', type: 'call', position: 'buy', required: true }],
    },
  },

  'Long Put': {
    name: 'Long Put',
    description:
      'Purchasing a put is a bearish strategy used when you expect the underlying stock to decline. It offers limited risk (premium paid) with substantial profit potential if the stock falls significantly.',
    legCount: 1,
    faqQuestions: [
      'How do you calculate put options?',
      'When should you buy a long put?',
      'How much can you lose on a put option?',
      'What is the break-even point for a long put?',
      'How does time decay affect put options?',
      'What happens when put options expire?',
    ],
    formConfig: {
      legs: [{ label: 'Put Option', type: 'put', position: 'buy', required: true }],
    },
  },

  'Covered Call': {
    name: 'Covered Call',
    description:
      'A covered call involves owning the underlying stock while selling a call option against it. This strategy generates income from the premium while potentially capping upside gains.',
    legCount: 1,
    faqQuestions: [
      'How does a covered call work?',
      'What are the risks of covered calls?',
      'How to choose the best strike for covered calls?',
      'When to close a covered call position?',
      'Tax implications of covered calls',
      'What happens if my covered call is assigned?',
    ],
    formConfig: {
      legs: [{ label: 'Call Option', type: 'call', position: 'write', required: true }],
    },
  },

  'Cash Secured Put': {
    name: 'Cash Secured Put',
    description:
      'Selling a put option while holding enough cash to purchase the stock if assigned. This strategy is used to generate income or to buy stock at a lower price.',
    legCount: 1,
    faqQuestions: [
      'How does a cash secured put work?',
      'What are the risks of selling puts?',
      'How much cash do I need for a cash secured put?',
      'When should I sell cash secured puts?',
      'What happens if I get assigned on a put?',
      'Tax implications of cash secured puts',
    ],
    formConfig: {
      legs: [{ label: 'Put Option', type: 'put', position: 'write', required: true }],
    },
  },

  'Naked Call': {
    name: 'Naked Call',
    description:
      'Selling a call option without owning the underlying stock. This is a high-risk strategy with unlimited loss potential and should only be used by experienced traders with proper risk management.',
    legCount: 1,
    faqQuestions: [
      'What is a naked call option?',
      'Why are naked calls so risky?',
      'What is the margin requirement for naked calls?',
      'How to manage naked call risk?',
      'When does a naked call make sense?',
      'What happens if a naked call is assigned?',
    ],
    formConfig: {
      legs: [{ label: 'Call Option', type: 'call', position: 'write', required: true }],
    },
  },

  'Naked Put': {
    name: 'Naked Put',
    description:
      'Selling a put option without setting aside the cash to buy the stock. Similar to cash secured puts but uses margin. Higher risk due to leverage.',
    legCount: 1,
    faqQuestions: [
      'What is a naked put option?',
      'How does a naked put differ from cash secured put?',
      'What is the margin requirement for naked puts?',
      'What are the risks of naked puts?',
      'When should you sell naked puts?',
      'What happens if a naked put is assigned?',
    ],
    formConfig: {
      legs: [{ label: 'Put Option', type: 'put', position: 'write', required: true }],
    },
  },

  // ============================================================================
  // SPREADS
  // ============================================================================
  'Credit Spread': {
    name: 'Credit Spread',
    description:
      'A credit spread involves selling one option and buying another option of the same type with different strikes. You receive a net credit. Limited risk and limited profit.',
    legCount: 2,
    faqQuestions: [
      'How does a credit spread work?',
      'What is the max profit on a credit spread?',
      'What is the max loss on a credit spread?',
      'When should you use credit spreads?',
      'How to manage credit spreads?',
      'Credit spread vs debit spread comparison',
    ],
    formConfig: {
      legs: [
        { label: 'Short Option', type: 'call', position: 'write', required: true },
        { label: 'Long Option', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  'Call Spread': {
    name: 'Call Spread',
    description:
      'A vertical spread using call options. Buy one call and sell another call at a different strike price. Can be bullish (debit) or bearish (credit) depending on which strike you buy vs sell.',
    legCount: 2,
    faqQuestions: [
      'What is a call spread?',
      'Bull call spread vs bear call spread?',
      'How to calculate max profit on call spreads?',
      'When to close a call spread early?',
      'How does time decay affect call spreads?',
      'Best strike selection for call spreads',
    ],
    formConfig: {
      legs: [
        { label: 'Call Option 1', type: 'call', position: 'buy', required: true },
        { label: 'Call Option 2', type: 'call', position: 'write', required: true },
      ],
    },
  },

  'Put Spread': {
    name: 'Put Spread',
    description:
      'A vertical spread using put options. Buy one put and sell another put at a different strike price. Can be bullish (credit) or bearish (debit) depending on strike selection.',
    legCount: 2,
    faqQuestions: [
      'What is a put spread?',
      'Bull put spread vs bear put spread?',
      'How to calculate max profit on put spreads?',
      'When to close a put spread early?',
      'How does time decay affect put spreads?',
      'Best strike selection for put spreads',
    ],
    formConfig: {
      legs: [
        { label: 'Put Option 1', type: 'put', position: 'buy', required: true },
        { label: 'Put Option 2', type: 'put', position: 'write', required: true },
      ],
    },
  },

  "Poor Man's Covered Call": {
    name: "Poor Man's Covered Call",
    description:
      'A diagonal spread that simulates a covered call using LEAPS instead of owning stock. Buy a deep ITM call with long expiration and sell a shorter-term OTM call against it.',
    legCount: 2,
    faqQuestions: [
      "What is a Poor Man's Covered Call?",
      'How does it differ from a regular covered call?',
      'What are the advantages of PMCC?',
      'What are the risks of PMCC?',
      'How to select strikes for PMCC?',
      'When to close a PMCC position?',
    ],
    formConfig: {
      legs: [
        { label: 'Long LEAPS Call (ITM)', type: 'call', position: 'buy', required: true },
        { label: 'Short Call (OTM)', type: 'call', position: 'write', required: true },
      ],
    },
  },

  'Calendar Spread': {
    name: 'Calendar Spread',
    description:
      'Also called a time spread or horizontal spread. Sell a near-term option and buy a longer-term option at the same strike. Profits from time decay differential.',
    legCount: 2,
    faqQuestions: [
      'How does a calendar spread work?',
      'When is the best time to use calendar spreads?',
      'What are the risks of calendar spreads?',
      'How to profit from calendar spreads?',
      'Calendar spread vs diagonal spread?',
      'How does volatility affect calendar spreads?',
    ],
    formConfig: {
      legs: [
        { label: 'Short-Term Option', type: 'call', position: 'write', required: true },
        { label: 'Long-Term Option', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  'Ratio Back Spread': {
    name: 'Ratio Back Spread',
    description:
      'Sell one or more options at one strike and buy more options at a different strike. Creates a net credit or small debit with unlimited profit potential in one direction.',
    legCount: 2,
    faqQuestions: [
      'What is a ratio back spread?',
      'How to construct a ratio back spread?',
      'What are the risks of ratio spreads?',
      'When should you use ratio back spreads?',
      'Call ratio back spread vs put ratio back spread?',
      'How to manage ratio spread positions?',
    ],
    formConfig: {
      legs: [
        { label: 'Short Options', type: 'call', position: 'write', required: true },
        { label: 'Long Options (More Contracts)', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  // ============================================================================
  // ADVANCED STRATEGIES
  // ============================================================================
  'Iron Condor': {
    name: 'Iron Condor',
    description:
      'Combine a bear call spread and bull put spread. Sell OTM call and put spreads to collect premium. Profits when stock stays within a range between the short strikes.',
    legCount: 4,
    faqQuestions: [
      'How does an iron condor work?',
      'What is the max profit on an iron condor?',
      'What is the max loss on an iron condor?',
      'When should you use iron condors?',
      'How to adjust iron condors?',
      'Best market conditions for iron condors',
    ],
    formConfig: {
      legs: [
        { label: 'Long Put (Lower Strike)', type: 'put', position: 'buy', required: true },
        { label: 'Short Put', type: 'put', position: 'write', required: true },
        { label: 'Short Call', type: 'call', position: 'write', required: true },
        { label: 'Long Call (Higher Strike)', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  Butterfly: {
    name: 'Butterfly',
    description:
      'A neutral strategy combining a bull and bear spread. Buy one option at lower strike, sell two options at middle strike, buy one option at higher strike. All same type and expiration.',
    legCount: 3,
    faqQuestions: [
      'How does a butterfly spread work?',
      'Long butterfly vs short butterfly?',
      'What is the max profit on a butterfly?',
      'When to use butterfly spreads?',
      'Iron butterfly vs regular butterfly?',
      'How to select strikes for butterflies?',
    ],
    formConfig: {
      legs: [
        { label: 'Long Option (Lower Strike)', type: 'call', position: 'buy', required: true },
        { label: 'Short Options (Middle Strike)', type: 'call', position: 'write', required: true },
        { label: 'Long Option (Higher Strike)', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  Collar: {
    name: 'Collar',
    description:
      'Protective strategy combining stock ownership with buying a put (protection) and selling a call (to offset cost). Limits both upside and downside.',
    legCount: 2,
    faqQuestions: [
      'What is a collar strategy?',
      'How does a collar protect your stock?',
      'Zero-cost collar vs traditional collar?',
      'When should you use a collar?',
      'Tax implications of collars',
      'How to adjust collar positions?',
    ],
    formConfig: {
      legs: [
        { label: 'Protective Put', type: 'put', position: 'buy', required: true },
        { label: 'Covered Call', type: 'call', position: 'write', required: true },
      ],
    },
  },

  'Diagonal Spread': {
    name: 'Diagonal Spread',
    description:
      'Similar to calendar spread but with different strikes. Sell a near-term option at one strike and buy a longer-term option at a different strike. Combines time and price movement.',
    legCount: 2,
    faqQuestions: [
      'What is a diagonal spread?',
      'Diagonal vs calendar spread difference?',
      'How to construct a diagonal spread?',
      'When to use diagonal spreads?',
      'How to manage diagonal spreads?',
      'Best strikes for diagonal spreads',
    ],
    formConfig: {
      legs: [
        { label: 'Short-Term Option', type: 'call', position: 'write', required: true },
        { label: 'Long-Term Option (Different Strike)', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  'Double Diagonal': {
    name: 'Double Diagonal',
    description:
      'Combine a diagonal call spread and diagonal put spread. Sell near-term OTM options and buy longer-term OTM options on both sides. Profits from time decay in range-bound market.',
    legCount: 4,
    faqQuestions: [
      'What is a double diagonal spread?',
      'How does it differ from iron condor?',
      'When to use double diagonal spreads?',
      'How to manage double diagonal positions?',
      'Double diagonal vs iron condor comparison',
      'Best market conditions for double diagonals',
    ],
    formConfig: {
      legs: [
        { label: 'Short-Term Put', type: 'put', position: 'write', required: true },
        { label: 'Long-Term Put', type: 'put', position: 'buy', required: true },
        { label: 'Short-Term Call', type: 'call', position: 'write', required: true },
        { label: 'Long-Term Call', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  Straddle: {
    name: 'Straddle',
    description:
      'Buy (or sell) both a call and put at the same strike and expiration. Long straddle profits from large moves in either direction. Short straddle profits from low volatility.',
    legCount: 2,
    faqQuestions: [
      'How does a straddle work?',
      'Long straddle vs short straddle?',
      'When to use straddle strategies?',
      'What is the break-even on a straddle?',
      'How does IV crush affect straddles?',
      'Straddle vs strangle comparison',
    ],
    formConfig: {
      legs: [
        { label: 'Call Option (ATM)', type: 'call', position: 'buy', required: true },
        { label: 'Put Option (ATM)', type: 'put', position: 'buy', required: true },
      ],
    },
  },

  Strangle: {
    name: 'Strangle',
    description:
      'Similar to straddle but with different strikes. Buy (or sell) an OTM call and OTM put. Cheaper than straddle but requires larger move to profit.',
    legCount: 2,
    faqQuestions: [
      'How does a strangle work?',
      'Strangle vs straddle difference?',
      'When to use strangle strategies?',
      'What is the break-even on a strangle?',
      'Long strangle vs short strangle?',
      'Best strike selection for strangles',
    ],
    formConfig: {
      legs: [
        { label: 'Call Option (OTM)', type: 'call', position: 'buy', required: true },
        { label: 'Put Option (OTM)', type: 'put', position: 'buy', required: true },
      ],
    },
  },

  'Covered Strangle': {
    name: 'Covered Strangle',
    description:
      'Own the stock, sell an OTM call, and sell an OTM put. Generates income from both premiums but risks assignment on either side.',
    legCount: 2,
    faqQuestions: [
      'What is a covered strangle?',
      'How does it differ from covered call?',
      'What are the risks of covered strangles?',
      'When to use covered strangle strategy?',
      'How to manage covered strangle positions?',
      'Tax implications of covered strangles',
    ],
    formConfig: {
      legs: [
        { label: 'Call Option (OTM)', type: 'call', position: 'write', required: true },
        { label: 'Put Option (OTM)', type: 'put', position: 'write', required: true },
      ],
    },
  },

  'Synthetic Put': {
    name: 'Synthetic Put',
    description:
      'Create a position that mimics a long put by shorting stock and buying a call. Or mimic a short put by buying stock and selling a call.',
    legCount: 2,
    faqQuestions: [
      'What is a synthetic put?',
      'How to construct a synthetic put?',
      'Synthetic put vs actual put comparison?',
      'When to use synthetic positions?',
      'What are the risks of synthetic puts?',
      'Margin requirements for synthetic puts',
    ],
    formConfig: {
      legs: [
        { label: 'Stock Position', type: 'call', position: 'write', required: true },
        { label: 'Call Option', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  'Reverse Conversion': {
    name: 'Reverse Conversion',
    description:
      'An arbitrage strategy involving selling stock short, selling a put, and buying a call with the same strike and expiration. Locks in a near risk-free profit.',
    legCount: 3,
    faqQuestions: [
      'What is a reverse conversion?',
      'How does reverse conversion arbitrage work?',
      'When are reverse conversions profitable?',
      'What are the risks of reverse conversions?',
      'Conversion vs reverse conversion?',
      'How to execute reverse conversion trades?',
    ],
    formConfig: {
      legs: [
        { label: 'Short Stock Position', type: 'call', position: 'write', required: true },
        { label: 'Short Put', type: 'put', position: 'write', required: true },
        { label: 'Long Call', type: 'call', position: 'buy', required: true },
      ],
    },
  },

  // ============================================================================
  // CUSTOM STRATEGIES
  // ============================================================================
  '8 Legs': {
    name: '8 Legs Custom',
    description: 'Build your own custom 8-leg options strategy. Advanced traders only.',
    legCount: 8,
    faqQuestions: [
      'When would you use an 8-leg strategy?',
      'How to manage complex multi-leg positions?',
      'What are the risks of complex strategies?',
      'How to calculate break-evens on multi-leg positions?',
      'Commission impact on multi-leg strategies',
      'Best practices for complex option strategies',
    ],
    formConfig: {
      legs: Array(8).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },

  '6 Legs': {
    name: '6 Legs Custom',
    description: 'Build your own custom 6-leg options strategy.',
    legCount: 6,
    faqQuestions: [
      'When would you use a 6-leg strategy?',
      'How to manage multi-leg positions?',
      'What are the risks of complex strategies?',
      'How to calculate break-evens?',
      'Commission impact on multi-leg strategies',
      'Best practices for complex strategies',
    ],
    formConfig: {
      legs: Array(6).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },

  '5 Legs': {
    name: '5 Legs Custom',
    description: 'Build your own custom 5-leg options strategy.',
    legCount: 5,
    faqQuestions: [
      'When would you use a 5-leg strategy?',
      'How to manage multi-leg positions?',
      'What are the risks?',
      'How to calculate break-evens?',
      'Commission considerations',
      'Best practices for multi-leg strategies',
    ],
    formConfig: {
      legs: Array(5).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },

  '4 Legs': {
    name: '4 Legs Custom',
    description: 'Build your own custom 4-leg options strategy.',
    legCount: 4,
    faqQuestions: [
      'Common 4-leg strategies?',
      'How to manage 4-leg positions?',
      'What are the risks?',
      'How to calculate break-evens?',
      'Iron condors vs custom 4-leg?',
      'Best practices for 4-leg strategies',
    ],
    formConfig: {
      legs: Array(4).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },

  '3 Legs': {
    name: '3 Legs Custom',
    description: 'Build your own custom 3-leg options strategy.',
    legCount: 3,
    faqQuestions: [
      'Common 3-leg strategies?',
      'How to manage 3-leg positions?',
      'What are the risks?',
      'How to calculate break-evens?',
      'Butterfly vs custom 3-leg?',
      'Best practices for 3-leg strategies',
    ],
    formConfig: {
      legs: Array(3).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },

  '2 Legs': {
    name: '2 Legs Custom',
    description: 'Build your own custom 2-leg options strategy.',
    legCount: 2,
    faqQuestions: [
      'Common 2-leg strategies?',
      'How to manage 2-leg positions?',
      'What are the risks?',
      'How to calculate break-evens?',
      'Spreads vs custom 2-leg?',
      'Best practices for 2-leg strategies',
    ],
    formConfig: {
      legs: Array(2).fill({ label: 'Option Leg', type: 'call', position: 'buy', required: false }),
    },
  },
}

/**
 * Get configuration for a specific strategy
 */
export function getStrategyConfig(strategyName: string): StrategyConfig | undefined {
  return STRATEGY_CONFIGS[strategyName]
}

/**
 * Get all strategy names
 */
export function getAllStrategyNames(): string[] {
  return Object.keys(STRATEGY_CONFIGS)
}
