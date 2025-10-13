/**
 * Strategy Templates
 * Pre-configured strategy templates for common options strategies
 */

import { StrategyTemplate, StrategyType, OptionType, Position } from '../types';

/**
 * Array of all available strategy templates
 */
export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  // ========================================================================
  // BASIC STRATEGIES
  // ========================================================================
  {
    type: StrategyType.LONG_CALL,
    name: 'Long Call',
    description: 'Buy a call option - bullish strategy with limited risk and unlimited profit potential',
    category: 'basic',
    outlook: 'bullish',
    complexity: 'beginner',
    riskLevel: 'low',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: 5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'A long call gives you the right to buy stock at the strike price. Profit if stock rises above strike + premium paid.',
    advantages: [
      'Limited risk (only premium paid)',
      'Unlimited profit potential',
      'Leveraged upside exposure',
      'Time to be right before expiration',
    ],
    disadvantages: [
      'Lose entire premium if wrong',
      'Time decay works against you',
      'Requires significant stock movement to profit',
    ],
    idealConditions: 'Expecting strong upward movement in stock price. High conviction bullish view.',
  },

  {
    type: StrategyType.LONG_PUT,
    name: 'Long Put',
    description: 'Buy a put option - bearish strategy with limited risk',
    category: 'basic',
    outlook: 'bearish',
    complexity: 'beginner',
    riskLevel: 'low',
    legTemplate: [
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: -5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'A long put gives you the right to sell stock at the strike price. Profit if stock falls below strike - premium paid.',
    advantages: [
      'Limited risk (only premium paid)',
      'Large profit potential',
      'Leveraged downside exposure',
      'Alternative to short selling',
    ],
    disadvantages: [
      'Lose entire premium if wrong',
      'Time decay works against you',
      'Requires significant stock movement to profit',
    ],
    idealConditions: 'Expecting significant downward movement in stock price. High conviction bearish view.',
  },

  {
    type: StrategyType.SHORT_CALL,
    name: 'Short Call (Naked)',
    description: 'Sell a call option - bearish/neutral strategy with limited profit and unlimited risk',
    category: 'basic',
    outlook: 'bearish',
    complexity: 'advanced',
    riskLevel: 'unlimited',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: 5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Sell a call to collect premium. Profit if stock stays below strike. Unlimited loss if stock rises significantly.',
    advantages: [
      'Immediate premium income',
      'Time decay works for you',
      'Profitable in sideways/down markets',
    ],
    disadvantages: [
      'Unlimited loss potential',
      'Requires margin',
      'High risk strategy',
    ],
    idealConditions: 'Expecting stock to stay flat or decline. Should only be used with proper risk management.',
  },

  {
    type: StrategyType.SHORT_PUT,
    name: 'Short Put (Cash-Secured)',
    description: 'Sell a put option - bullish/neutral strategy to collect premium or buy stock at lower price',
    category: 'basic',
    outlook: 'bullish',
    complexity: 'intermediate',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.PUT,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: -5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Sell a put to collect premium. Obligated to buy stock at strike if assigned. Works well if willing to own stock at that price.',
    advantages: [
      'Immediate premium income',
      'Time decay works for you',
      'Can acquire stock at desired price',
    ],
    disadvantages: [
      'Large loss if stock crashes',
      'Ties up capital (cash-secured)',
      'Miss out on bigger gains if stock rallies',
    ],
    idealConditions: 'Want to buy stock at lower price, or believe stock will stay flat/rise. Should have cash to buy shares if assigned.',
  },

  // ========================================================================
  // VERTICAL SPREADS
  // ========================================================================
  {
    type: StrategyType.CALL_DEBIT_SPREAD,
    name: 'Bull Call Spread',
    description: 'Buy call at lower strike, sell call at higher strike - bullish with limited risk and profit',
    category: 'spreads',
    outlook: 'bullish',
    complexity: 'intermediate',
    riskLevel: 'low',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'atm',
        strikeOffset: 0,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.CALL,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: 5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Reduces cost of long call by selling higher strike call. Max profit = spread width - net debit. Max loss = net debit.',
    advantages: [
      'Lower cost than long call',
      'Defined maximum risk',
      'Defined maximum profit',
      'Better breakeven than long call',
    ],
    disadvantages: [
      'Limited profit potential',
      'Both legs lose time value',
      'Need significant move to profit',
    ],
    idealConditions: 'Moderately bullish. Expecting stock to rise to or above short strike by expiration.',
  },

  {
    type: StrategyType.PUT_DEBIT_SPREAD,
    name: 'Bear Put Spread',
    description: 'Buy put at higher strike, sell put at lower strike - bearish with limited risk and profit',
    category: 'spreads',
    outlook: 'bearish',
    complexity: 'intermediate',
    riskLevel: 'low',
    legTemplate: [
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'atm',
        strikeOffset: 0,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.PUT,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: -5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Reduces cost of long put by selling lower strike put. Max profit = spread width - net debit. Max loss = net debit.',
    advantages: [
      'Lower cost than long put',
      'Defined maximum risk',
      'Defined maximum profit',
      'Better breakeven than long put',
    ],
    disadvantages: [
      'Limited profit potential',
      'Both legs lose time value',
      'Need significant move to profit',
    ],
    idealConditions: 'Moderately bearish. Expecting stock to fall to or below short strike by expiration.',
  },

  {
    type: StrategyType.CALL_CREDIT_SPREAD,
    name: 'Bear Call Spread',
    description: 'Sell call at lower strike, buy call at higher strike - bearish with limited risk',
    category: 'spreads',
    outlook: 'bearish',
    complexity: 'intermediate',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: 5,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: 10,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Collect premium by selling call spread. Max profit = net credit. Max loss = spread width - net credit.',
    advantages: [
      'Immediate credit received',
      'Time decay works for you',
      'High probability of success',
    ],
    disadvantages: [
      'Limited profit potential',
      'Larger max loss than max profit',
      'Requires margin',
    ],
    idealConditions: 'Neutral to bearish. Stock stays below short strike. Good for high IV environments.',
  },

  {
    type: StrategyType.PUT_CREDIT_SPREAD,
    name: 'Bull Put Spread',
    description: 'Sell put at higher strike, buy put at lower strike - bullish with limited risk',
    category: 'spreads',
    outlook: 'bullish',
    complexity: 'intermediate',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.PUT,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: -5,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: -10,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Collect premium by selling put spread. Max profit = net credit. Max loss = spread width - net credit.',
    advantages: [
      'Immediate credit received',
      'Time decay works for you',
      'High probability of success',
    ],
    disadvantages: [
      'Limited profit potential',
      'Larger max loss than max profit',
      'Requires margin',
    ],
    idealConditions: 'Neutral to bullish. Stock stays above short strike. Good for high IV environments.',
  },

  // ========================================================================
  // VOLATILITY STRATEGIES
  // ========================================================================
  {
    type: StrategyType.LONG_STRADDLE,
    name: 'Long Straddle',
    description: 'Buy call and put at same strike - profit from large move in either direction',
    category: 'volatility',
    outlook: 'volatile',
    complexity: 'intermediate',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'atm',
        strikeOffset: 0,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'atm',
        strikeOffset: 0,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Profit if stock makes large move in either direction. Break-even at strike +/- total premium paid.',
    advantages: [
      'Profit from big moves either direction',
      'Unlimited profit potential on upside',
      'Large profit potential on downside',
      'Good for earnings/events',
    ],
    disadvantages: [
      'Expensive strategy',
      'Need very large move to profit',
      'Double time decay',
      'IV crush after events',
    ],
    idealConditions: 'Expecting large move but unsure of direction. Before major catalyst like earnings or FDA approval.',
  },

  {
    type: StrategyType.LONG_STRANGLE,
    name: 'Long Strangle',
    description: 'Buy OTM call and OTM put - cheaper than straddle, requires larger move',
    category: 'volatility',
    outlook: 'volatile',
    complexity: 'intermediate',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: 5,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: -5,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Similar to straddle but cheaper. Requires bigger move to profit. Break-evens are wider apart.',
    advantages: [
      'Cheaper than straddle',
      'Profit from big moves either direction',
      'Good risk/reward if big move expected',
    ],
    disadvantages: [
      'Need even larger move than straddle',
      'Double time decay',
      'Max loss if stock stays between strikes',
    ],
    idealConditions: 'Expecting very large move but unsure of direction. Lower cost alternative to straddle.',
  },

  {
    type: StrategyType.IRON_CONDOR,
    name: 'Iron Condor',
    description: 'Sell OTM call spread and OTM put spread - profit from range-bound movement',
    category: 'volatility',
    outlook: 'range-bound',
    complexity: 'advanced',
    riskLevel: 'medium',
    legTemplate: [
      {
        optionType: OptionType.PUT,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: -15,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.PUT,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: -10,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.CALL,
        position: Position.SHORT,
        strikeRelation: 'otm',
        strikeOffset: 10,
        quantityMultiplier: 1,
      },
      {
        optionType: OptionType.CALL,
        position: Position.LONG,
        strikeRelation: 'otm',
        strikeOffset: 15,
        quantityMultiplier: 1,
      },
    ],
    explanation: 'Collect premium by selling both call and put spreads. Max profit if stock stays between short strikes.',
    advantages: [
      'Immediate credit received',
      'Time decay works for you',
      'High probability of profit',
      'Defined risk',
    ],
    disadvantages: [
      'Limited profit potential',
      'Losses if stock moves significantly',
      'Requires margin',
      'Complex management',
    ],
    idealConditions: 'Expecting low volatility and range-bound price action. Good for high IV that you expect to decrease.',
  },

  // ========================================================================
  // CUSTOM
  // ========================================================================
  {
    type: StrategyType.CUSTOM,
    name: 'Custom Strategy',
    description: 'Build your own multi-leg strategy',
    category: 'custom',
    outlook: 'neutral',
    complexity: 'advanced',
    riskLevel: 'medium',
    legTemplate: [],
    explanation: 'Create a custom options strategy by adding your own legs.',
    advantages: ['Complete flexibility', 'Can combine any options', 'Tailor to your view'],
    disadvantages: ['Requires deep understanding', 'Easy to make mistakes', 'Complex risk profile'],
    idealConditions: 'When pre-built strategies do not fit your market view or risk tolerance.',
  },
];

/**
 * Get strategy template by type
 */
export function getStrategyTemplate(type: StrategyType): StrategyTemplate | undefined {
  return STRATEGY_TEMPLATES.find((template) => template.type === type);
}

/**
 * Get all strategy templates by category
 */
export function getStrategiesByCategory(category: StrategyTemplate['category']): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter((template) => template.category === category);
}

/**
 * Get all strategy templates by complexity
 */
export function getStrategiesByComplexity(complexity: StrategyTemplate['complexity']): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter((template) => template.complexity === complexity);
}

/**
 * Get all strategy templates by outlook
 */
export function getStrategiesByOutlook(outlook: StrategyTemplate['outlook']): StrategyTemplate[] {
  return STRATEGY_TEMPLATES.filter((template) => template.outlook === outlook);
}
