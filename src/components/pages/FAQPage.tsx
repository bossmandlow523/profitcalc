import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'General',
    question: 'What is an options profit calculator?',
    answer: 'An options profit calculator is a financial tool that helps traders visualize potential profit and loss for options trades. It calculates breakeven points, maximum profit, maximum loss, and Greeks (Delta, Gamma, Theta, Vega) for calls, puts, spreads, and multi-leg strategies. Our calculator provides real-time interactive charts showing P&L at different stock prices.'
  },
  {
    category: 'General',
    question: 'Is this options calculator free to use?',
    answer: 'Yes, our options profit calculator is completely free to use with no hidden costs. No registration required, no credit card needed, and no download necessary. Calculate unlimited options strategies with real-time visualization, Greeks analysis, and breakeven calculations all for free.'
  },
  {
    category: 'General',
    question: 'Do I need to create an account?',
    answer: 'No account creation is necessary. You can start using the calculator immediately without signing up. Simply select your strategy, enter the trade parameters, and view instant results with interactive charts and Greeks analysis.'
  },
  {
    category: 'Calculations',
    question: 'How do I calculate profit on a long call option?',
    answer: 'Long call profit = (Stock Price at Expiration - Strike Price - Premium Paid) × 100 shares per contract. Maximum loss is limited to the premium paid. Breakeven price = Strike Price + Premium Paid. For example, if you buy a $50 call for $2 and the stock reaches $55, your profit is ($55 - $50 - $2) × 100 = $300.'
  },
  {
    category: 'Calculations',
    question: 'How do I calculate breakeven for my options trade?',
    answer: 'Breakeven depends on the strategy: For long calls: Strike + Premium. For long puts: Strike - Premium. For spreads: Add/subtract net premium from the long strike. For multi-leg strategies like iron condors, there are typically two breakeven points. Our calculator automatically displays breakeven points for any strategy you build.'
  },
  {
    category: 'Calculations',
    question: 'What are options Greeks and why do they matter?',
    answer: 'Greeks measure how options prices change with different factors: Delta measures price sensitivity to stock movement, Gamma measures Delta\'s rate of change, Theta measures time decay, and Vega measures sensitivity to volatility changes. Understanding Greeks helps you predict how your position will behave and manage risk effectively.'
  },
  {
    category: 'Strategies',
    question: 'What options strategies can I calculate?',
    answer: 'You can calculate all major options strategies including: long call, long put, covered call, cash secured put, bull/bear credit spreads, bull/bear debit spreads, iron condor, iron butterfly, butterfly spread, calendar spread, diagonal spread, straddle, strangle, ratio spread, and custom multi-leg strategies up to 4 legs.'
  },
  {
    category: 'Strategies',
    question: 'What is the best options strategy for beginners?',
    answer: 'For beginners, covered calls and cash secured puts are excellent starting points. Covered calls generate income on stocks you own with limited downside (you keep the premium). Cash secured puts let you potentially buy stocks at a discount while earning premium. Both have defined risk and are easier to understand than complex spreads.'
  },
  {
    category: 'Strategies',
    question: 'How does an iron condor work?',
    answer: 'An iron condor combines a bull put spread and a bear call spread. You sell an out-of-the-money put, buy a further out-of-the-money put, sell an out-of-the-money call, and buy a further out-of-the-money call. This creates a profit zone between the two short strikes. Maximum profit is the net premium collected, achieved if the stock stays between short strikes at expiration.'
  },
  {
    category: 'Technical',
    question: 'How accurate are the calculations?',
    answer: 'Our calculator uses industry-standard Black-Scholes model for pricing European-style options and binomial models for American-style options. Calculations are accurate based on the inputs provided. However, real market prices may vary due to bid-ask spreads, liquidity, early assignment risk, and market conditions. Always verify with your broker before trading.'
  },
  {
    category: 'Technical',
    question: 'Can I save my calculations?',
    answer: 'Currently, calculations are saved in your browser\'s local storage, so they persist between sessions on the same device. We\'re working on adding cloud save functionality and user accounts to sync calculations across devices. You can also take screenshots of the charts for your records.'
  },
  {
    category: 'Technical',
    question: 'Does this work on mobile devices?',
    answer: 'Yes! Our calculator is fully responsive and works on smartphones and tablets. The interface automatically adapts to smaller screens while maintaining full functionality including interactive charts, Greeks analysis, and all calculation features.'
  },
  {
    category: 'Trading',
    question: 'When should I use a credit spread vs. a debit spread?',
    answer: 'Use credit spreads when you expect limited movement: sell them when you think the stock will stay within a range. Use debit spreads for directional trades: buy them when you expect the stock to move in a specific direction but want to cap your risk. Credit spreads profit from time decay, while debit spreads require the stock to move favorably.'
  },
  {
    category: 'Trading',
    question: 'What is the risk of selling options?',
    answer: 'Selling naked options has unlimited risk (for calls) or substantial risk (for puts down to zero). However, defined-risk strategies like credit spreads limit your maximum loss to the spread width minus premium collected. Always use stop losses and position sizing. Never risk more than 1-2% of your account on a single trade.'
  },
  {
    category: 'Trading',
    question: 'How do dividends affect my options strategy?',
    answer: 'Dividends increase put values and decrease call values because the stock price typically drops by the dividend amount on the ex-dividend date. For covered calls, you receive dividends if you hold the stock. For cash secured puts, you don\'t receive dividends unless assigned. Always account for dividend dates when calculating returns.'
  },
  {
    category: 'Trading',
    question: 'What is implied volatility and how does it affect my trade?',
    answer: 'Implied volatility (IV) represents the market\'s expectation of future stock price movement. Higher IV increases options premiums, benefiting sellers but making buying more expensive. IV often spikes before earnings and major events. Selling high IV and buying low IV is generally favorable. Our calculator shows how Vega measures your position\'s sensitivity to IV changes.'
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = activeCategory === 'All'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Options Calculator FAQ - Common Questions Answered</title>
        <meta
          name="description"
          content="Frequently asked questions about using options profit calculators, understanding Greeks, calculating breakeven, interpreting charts, and options trading strategies."
        />
        <meta
          name="keywords"
          content="options calculator faq, how to use options calculator, options greeks explained, calculate breakeven, options trading questions"
        />
        <link rel="canonical" href="https://optionscalculator.com/faq" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <main className="relative z-10 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about using our options profit calculator and understanding options trading
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Questions
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items - 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFAQs.map((item, index) => {
              const isOpen = openItems.has(index);
              return (
                <BlurFade key={index} delay={0.05 * index} duration={0.3}>
                  <MagicCard
                    className="overflow-hidden h-full border border-purple-500/30"
                    gradientFrom="#3b82f6"
                    gradientTo="#8b5cf6"
                    gradientSize={300}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1 block">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold text-white pr-4">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                        <div className="pt-2 border-t border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </MagicCard>
                </BlurFade>
              );
            })}
          </div>

          {/* CTA Section */}
          <BlurFade delay={0.3}>
            <MagicCard className="mt-16 text-center p-8" gradientFrom="#3b82f6" gradientTo="#a855f7">
              <h2 className="text-2xl font-bold mb-4">Ready to Calculate Your Options Strategy?</h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Try our free options profit calculator with real-time visualization, Greeks analysis, and breakeven calculations
              </p>
              <a
                href="/calculator"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Start Calculating
              </a>
            </MagicCard>
          </BlurFade>

          {/* Contact Section */}
          <div className="mt-8 text-center text-gray-400">
            <p className="text-sm">
              Still have questions? <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact us</a> or check out our{' '}
              <a href="/blog" className="text-blue-400 hover:text-blue-300 underline">educational blog</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
