import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Clock, Calendar, User, ArrowLeft, Share2, BookOpen, TrendingUp, TrendingDown, Target, Lightbulb, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import type { BlogPost } from '../blog/BlogCard'
import { BlogCard } from '../blog/BlogCard'

// Sample blog posts data (same as BlogPage)
const samplePosts: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-calculate-options-profit',
    title: 'How to Calculate Options Profit: Complete Guide for Beginners',
    excerpt: 'Master options profit calculations with our step-by-step guide. Learn to calculate P&L for calls, puts, and complex strategies with real examples.',
    author: { name: 'Options Expert', bio: 'Professional options trader with 10+ years experience' },
    publishedDate: '2024-01-15',
    readTime: 8,
    category: 'Education',
    tags: ['Profit Calculation', 'Beginners', 'Options Basics'],
    featured: true
  },
  {
    id: '2',
    slug: 'understanding-options-greeks',
    title: 'Understanding Options Greeks: Delta, Gamma, Theta, Vega Explained',
    excerpt: 'Deep dive into options Greeks and how they affect your trading strategy. Learn to interpret Delta, Gamma, Theta, Vega, and Rho for better risk management.',
    author: { name: 'Trading Analyst', bio: 'Quantitative analyst specializing in derivatives' },
    publishedDate: '2024-01-12',
    readTime: 12,
    category: 'Greeks',
    tags: ['Delta', 'Gamma', 'Theta', 'Vega', 'Risk Management']
  },
  {
    id: '3',
    slug: 'iron-condor-strategy-guide',
    title: 'Iron Condor Strategy: Setup, Risk, and Profit Calculator Guide',
    excerpt: 'Complete guide to iron condor options strategy. Learn optimal setup, breakeven points, profit zones, and how to use our calculator for instant analysis.',
    author: { name: 'Strategy Specialist', bio: 'Expert in income-generating options strategies' },
    publishedDate: '2024-01-10',
    readTime: 10,
    category: 'Strategies',
    tags: ['Iron Condor', 'Credit Spread', 'Income Strategy']
  },
  {
    id: '4',
    slug: 'covered-call-income-strategy',
    title: 'Covered Call Calculator: Maximize Income on Your Stock Holdings',
    excerpt: 'Generate consistent income with covered calls. Learn strike selection, timing, and how to calculate maximum profit and breakeven using our free calculator.',
    author: { name: 'Income Investor', bio: 'Focused on dividend and options income strategies' },
    publishedDate: '2024-01-08',
    readTime: 7,
    category: 'Strategies',
    tags: ['Covered Call', 'Income', 'Stock Options']
  },
  {
    id: '5',
    slug: 'visualizing-options-profit-loss',
    title: 'Visualizing Options P&L: From Data to Interactive Charts',
    excerpt: 'Learn how to create and interpret profit/loss diagrams. Understand payoff curves, breakeven visualization, and multi-leg strategy charts.',
    author: { name: 'Data Visualization Pro', bio: 'Specialist in financial data visualization' },
    publishedDate: '2024-01-05',
    readTime: 9,
    category: 'Education',
    tags: ['Visualization', 'Charts', 'Analysis']
  },
  {
    id: '6',
    slug: 'bull-put-spread-tutorial',
    title: 'Bull Put Spread: Credit Strategy for Bullish Markets',
    excerpt: 'Master the bull put spread for bullish outlooks. Learn setup, profit potential, risk management, and when to use this credit strategy.',
    author: { name: 'Options Expert', bio: 'Professional options trader with 10+ years experience' },
    publishedDate: '2024-01-03',
    readTime: 8,
    category: 'Strategies',
    tags: ['Bull Put Spread', 'Credit Spread', 'Bullish']
  }
]

interface BlogPostPageProps {
  postSlug: string
  onBack?: () => void
  onNavigateToPost?: (slug: string) => void
}

export default function BlogPostPage({ postSlug, onBack, onNavigateToPost }: BlogPostPageProps) {
  return renderPostContent(postSlug, postSlug, onBack, onNavigateToPost)
}

// Content rendering function - returns just the article sections based on slug
function getArticleContent(slug: string) {
  switch (slug) {
    case 'understanding-options-greeks':
      return <OptionsGreeksContent />
    case 'iron-condor-strategy-guide':
      return <IronCondorContent />
    case 'covered-call-income-strategy':
      return <CoveredCallContent />
    case 'visualizing-options-profit-loss':
      return <VisualizationContent />
    case 'bull-put-spread-tutorial':
      return <BullPutSpreadContent />
    default:
      return <DefaultArticleContent />
  }
}

// Main rendering function - wraps content in full page layout
function renderPostContent(slug: string, postSlug: string, onBack?: () => void, onNavigateToPost?: (slug: string) => void) {
  return <BlogPostLayout postSlug={postSlug} onBack={onBack} onNavigateToPost={onNavigateToPost} />
}

// Content Components for each blog post

function OptionsGreeksContent() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Options Greeks are essential risk metrics that measure how an option's price responds to various market factors. Named after Greek letters, these metrics help traders understand and quantify the risk exposure of their options positions.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Whether you're buying a simple call option or managing a complex multi-leg strategy, understanding Greeks is crucial for making informed trading decisions and managing risk effectively.
        </p>
      </section>

      <Card className="bg-blue-900/20 border-blue-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Delta measures directional risk and probability of expiring ITM</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Gamma shows how Delta changes as the stock price moves</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Theta quantifies time decay - your position loses value every day</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Vega measures sensitivity to changes in implied volatility</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Delta: Directional Exposure</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Delta measures how much an option's price will change for every $1 move in the underlying stock. It ranges from 0 to 1.00 for calls, and 0 to -1.00 for puts.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Delta Interpretation</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Call Options:</strong> Delta of 0.50 means the option gains ~$0.50 per $1 stock increase</p>
            <p><strong>Put Options:</strong> Delta of -0.50 means the option gains ~$0.50 per $1 stock decrease</p>
            <p><strong>Probability:</strong> Delta also approximates the probability of expiring in-the-money</p>
          </div>
        </Card>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: Delta in Action</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Stock:</strong> AAPL at $150</p>
                <p><strong>Option:</strong> $155 Call with Delta of 0.30</p>
                <p><strong>Premium:</strong> $2.50</p>
                <p className="pt-2 border-t border-purple-500/30"><strong>If AAPL rises to $152 (+$2):</strong></p>
                <p className="text-green-400">Option price increases by ~$0.60 (0.30 × $2) to $3.10</p>
                <p className="pt-2"><strong>Interpretation:</strong> This option has roughly 30% chance of expiring ITM</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Gamma: Rate of Change</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Gamma measures how much Delta changes for every $1 move in the stock. It's highest for at-the-money options and near expiration.
        </p>
        <p className="text-gray-300 leading-relaxed mb-6">
          High Gamma means your Delta (directional exposure) is changing rapidly. This creates both opportunities and risks - your position can accelerate in profit or loss quickly.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <Card className="bg-green-900/20 border-green-500/30 p-6">
            <h4 className="text-xl font-bold text-green-400 mb-3">Long Options (Positive Gamma)</h4>
            <p className="text-gray-300 text-sm">
              Gamma works in your favor. As stock moves your way, Delta increases, accelerating profits. Works against you on reversals.
            </p>
          </Card>
          <Card className="bg-red-900/20 border-red-500/30 p-6">
            <h4 className="text-xl font-bold text-red-400 mb-3">Short Options (Negative Gamma)</h4>
            <p className="text-gray-300 text-sm">
              Gamma works against you. Large stock moves increase your risk exposure as Delta grows against your position.
            </p>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Theta: Time Decay</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Theta represents the daily time decay of an option. It shows how much value your option loses each day, all else being equal. Theta is always working against option buyers and in favor of option sellers.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <code className="text-blue-400 text-lg block mb-3">
            Theta = -$0.05 means option loses $5 per day per contract
          </code>
          <p className="text-gray-400 text-sm">
            Note: Theta accelerates as expiration approaches, especially in the final 30 days.
          </p>
        </Card>

        <p className="text-gray-300 leading-relaxed mb-4">
          Time decay isn't linear - it accelerates as expiration approaches. Options with 7 days left decay much faster than options with 60 days left.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Vega: Volatility Sensitivity</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Vega measures how much an option's price changes for every 1% change in implied volatility (IV). Higher Vega means your option is more sensitive to volatility changes.
        </p>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: Vega Impact</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Option Premium:</strong> $3.00</p>
                <p><strong>Vega:</strong> 0.12</p>
                <p><strong>Current IV:</strong> 30%</p>
                <p className="pt-2 border-t border-purple-500/30"><strong>If IV rises to 35% (+5%):</strong></p>
                <p className="text-green-400">Option premium increases by ~$0.60 (0.12 × 5) to $3.60</p>
                <p className="pt-2 text-yellow-400"><strong>Important:</strong> This happens even if stock price doesn't move!</p>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-gray-300 leading-relaxed">
          Volatility tends to spike during market uncertainty or earnings announcements. Option buyers benefit from rising IV, while sellers benefit from falling IV (volatility crush).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Rho: Interest Rate Sensitivity</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Rho measures how much an option's price changes for every 1% change in interest rates. In practice, Rho has the least impact on most options trades, especially short-term options.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Rho becomes more significant for LEAPS (long-term options) and in environments where interest rates are changing rapidly.
        </p>
      </section>

      <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Greeks Work Together</h4>
            <p className="text-gray-300 text-sm">
              Greeks don't operate in isolation. Your position is affected by all Greeks simultaneously. A stock move (Delta) might be offset by time decay (Theta), or amplified by volatility changes (Vega). Always consider the complete picture when managing risk.
            </p>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Greeks in Trading</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Position Sizing with Delta</h4>
              <p className="text-gray-300">Use Delta to understand your directional exposure. 100 shares = 1.0 Delta. A 0.50 Delta call acts like owning 50 shares.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Managing Gamma Risk</h4>
              <p className="text-gray-300">Be aware of high Gamma near expiration. Your Delta can change dramatically on small price moves.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Time Your Trades with Theta</h4>
              <p className="text-gray-300">Option buyers should give trades enough time. Sellers benefit from theta decay, especially in the final 30-45 days.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Monitor IV with Vega</h4>
              <p className="text-gray-300">Avoid buying options when IV is high. Sell options when IV is elevated to benefit from volatility crush.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our options profit calculator automatically calculates all Greeks for your positions. See real-time Greeks values as you adjust strikes, expiration dates, and position sizes. Visualize how Greeks change across different stock prices.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2 mb-6">
          Calculate Greeks Now
          <TrendingUp className="w-5 h-5" />
        </button>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Understanding Options Greeks transforms you from a speculator to a calculated risk manager. Delta tells you where you stand, Gamma shows how fast things can change, Theta reminds you time is money, and Vega highlights volatility's impact.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Master these metrics, use our calculator to model different scenarios, and you'll make more informed, confident trading decisions. Remember: Greeks are tools for understanding risk, not crystal balls for predicting profits.
        </p>
      </section>
    </>
  )
}

function IronCondorContent() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The Iron Condor is a popular options income strategy that profits from low volatility and range-bound markets. By combining a bull put spread and a bear call spread, traders can generate consistent premium while defining their maximum risk upfront.
        </p>
        <p className="text-gray-300 leading-relaxed">
          This strategy is ideal when you expect a stock to trade sideways within a specific range until expiration. It requires less directional conviction than buying calls or puts, making it attractive for income-focused traders.
        </p>
      </section>

      <Card className="bg-blue-900/20 border-blue-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Iron Condor profits when stock stays within a defined range</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Maximum profit is the net credit received when opening the position</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Maximum loss is limited and defined at trade entry</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Works best in low-volatility, range-bound markets</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">What is an Iron Condor?</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          An Iron Condor consists of four options contracts at four different strikes, all with the same expiration date. You simultaneously sell an out-of-the-money (OTM) put spread and an OTM call spread.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Iron Condor Structure</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Lower Put Spread:</strong> Sell OTM put + Buy further OTM put (protection)</p>
            <p><strong>Upper Call Spread:</strong> Sell OTM call + Buy further OTM call (protection)</p>
            <p className="pt-2 border-t border-gray-700"><strong>Net Effect:</strong> Credit received for selling both spreads</p>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Setup Example</h2>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: SPY Iron Condor</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Underlying:</strong> SPY trading at $450</p>
                <p><strong>Expiration:</strong> 45 days to expiration</p>
                <p className="pt-2 border-t border-purple-500/30 font-semibold">Put Spread (Bullish Side):</p>
                <p>Sell 1 $440 Put @ $2.00</p>
                <p>Buy 1 $435 Put @ $1.20</p>
                <p className="text-green-400">Credit: $0.80 per share ($80 total)</p>
                <p className="pt-2 border-t border-purple-500/30 font-semibold">Call Spread (Bearish Side):</p>
                <p>Sell 1 $460 Call @ $2.10</p>
                <p>Buy 1 $465 Call @ $1.30</p>
                <p className="text-green-400">Credit: $0.80 per share ($80 total)</p>
                <p className="pt-2 border-t border-purple-500/30 font-semibold text-white">Total Net Credit: $160</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Profit and Loss Calculations</h2>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Max Profit</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Profit = Total Net Credit Received
          </code>
          <p className="text-gray-300 text-sm">
            Achieved when stock closes between the two short strikes at expiration. All options expire worthless and you keep the entire premium.
          </p>
          <p className="text-green-400 text-sm mt-2">
            Example: $160 (if SPY closes between $440 and $460)
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Max Loss</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Loss = (Spread Width × 100) - Net Credit
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Occurs if stock closes beyond either long strike at expiration.
          </p>
          <p className="text-red-400 text-sm">
            Example: ($5 width × 100) - $160 = $340 max loss
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Breakeven Points</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Lower Breakeven:</strong> Lower short put - (Net Credit / 100)</p>
            <p className="text-blue-400 ml-4">$440 - $1.60 = $438.40</p>
            <p className="mt-2"><strong>Upper Breakeven:</strong> Upper short call + (Net Credit / 100)</p>
            <p className="text-blue-400 ml-4">$460 + $1.60 = $461.60</p>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">When to Use Iron Condors</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Low Volatility Environment</h4>
              <p className="text-gray-300">Iron Condors work best when implied volatility is elevated (for higher premiums) but you expect actual volatility to decrease.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Range-Bound Markets</h4>
              <p className="text-gray-300">Perfect for stocks or indices trading in a clear range with defined support and resistance levels.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">After Earnings</h4>
              <p className="text-gray-300">When volatility crush is expected after an earnings announcement or major event.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Income Generation</h4>
              <p className="text-gray-300">Consistent strategy for generating monthly income when you have no strong directional bias.</p>
            </div>
          </li>
        </ul>
      </section>

      <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Risk Management Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Consider closing when you've captured 50-75% of max profit</li>
              <li>• Set alerts at breakeven points to monitor positions</li>
              <li>• Don't allocate more than 2-5% of portfolio to single Iron Condor</li>
              <li>• Avoid earnings announcements unless intentionally trading volatility crush</li>
              <li>• Have an exit plan before entering - don't hope for recovery</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our Iron Condor calculator lets you model different strike selections, see breakeven points visually, and understand your profit zones instantly. Adjust wing widths, compare different expirations, and calculate risk-reward ratios before placing your trade.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2 mb-6">
          Calculate Iron Condor Now
          <TrendingUp className="w-5 h-5" />
        </button>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The Iron Condor is a versatile strategy for generating income in neutral markets. With defined risk and consistent premium collection, it's a favorite among income traders. Success comes from proper strike selection, timing, and disciplined risk management.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Use our calculator to experiment with different setups, understand your profit zones, and find the optimal balance between premium collected and risk taken. Remember: smaller, consistent wins beat home-run swings in options income strategies.
        </p>
      </section>
    </>
  )
}

function CoveredCallContent() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Covered calls are one of the most popular options strategies for generating income from stock holdings you already own. By selling call options against your shares, you collect premium while potentially limiting your upside if the stock rallies above your strike price.
        </p>
        <p className="text-gray-300 leading-relaxed">
          This conservative strategy is perfect for investors who want to enhance returns on their long-term holdings, especially in flat or moderately bullish markets. It's often called a "stock enhancement" strategy.
        </p>
      </section>

      <Card className="bg-blue-900/20 border-blue-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Generate income from stocks you already own</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Reduces cost basis and provides downside cushion</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Caps upside if stock rallies above strike price</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Works best in neutral to moderately bullish markets</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">How Covered Calls Work</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          A covered call involves owning 100 shares of stock and selling one call option contract against those shares. The call you sell is "covered" by your stock ownership, meaning you can deliver the shares if the option is exercised.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Required Components</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Long Stock:</strong> Own 100 shares per contract (or multiples of 100)</p>
            <p><strong>Short Call:</strong> Sell 1 call option for every 100 shares owned</p>
            <p><strong>Strike Selection:</strong> Typically out-of-the-money (above current price)</p>
            <p><strong>Premium Collected:</strong> Income received for selling the call</p>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Setup Example</h2>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: AAPL Covered Call</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Current Position:</strong> Own 100 shares of AAPL at $150</p>
                <p><strong>Stock Price:</strong> AAPL trading at $150</p>
                <p><strong>Action:</strong> Sell 1 AAPL $155 Call expiring in 30 days</p>
                <p><strong>Premium Received:</strong> $2.50 per share ($250 total)</p>
                <p className="pt-2 border-t border-purple-500/30 font-semibold text-white">Outcomes at Expiration:</p>
                <p><strong>If AAPL ≤ $155:</strong></p>
                <p className="text-green-400 ml-4">Keep stock + $250 premium (1.67% return in 30 days)</p>
                <p className="mt-2"><strong>If AAPL &gt; $155:</strong></p>
                <p className="text-blue-400 ml-4">Stock called away at $155, profit: $500 stock gain + $250 premium = $750 total</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Profit and Loss Analysis</h2>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Maximum Profit</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Profit = (Strike - Stock Purchase Price) + Premium Received
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Achieved when stock closes at or above strike price at expiration.
          </p>
          <p className="text-green-400 text-sm">
            Example: ($155 - $150) + $2.50 = $7.50 per share ($750 total)
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Maximum Loss</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Loss = Stock Purchase Price - Premium Received
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Theoretically unlimited down to zero, but reduced by premium collected.
          </p>
          <p className="text-red-400 text-sm">
            Example: $150 - $2.50 = $147.50 (loss if stock goes to zero)
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Breakeven Point</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Breakeven = Stock Purchase Price - Premium Received
          </code>
          <p className="text-gray-300 text-sm">
            Stock can fall this far before you start losing money overall.
          </p>
          <p className="text-blue-400 text-sm">
            Example: $150 - $2.50 = $147.50
          </p>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Strike Selection Strategies</h2>

        <div className="grid md:grid-cols-3 gap-6 my-8">
          <Card className="bg-blue-900/20 border-blue-500/30 p-6">
            <h4 className="text-xl font-bold text-blue-400 mb-3">Conservative (5-10% OTM)</h4>
            <p className="text-gray-300 text-sm mb-3">
              Lower premium but higher probability of keeping stock.
            </p>
            <p className="text-gray-400 text-xs">
              Best for: Long-term holds you don't want called away
            </p>
          </Card>
          <Card className="bg-green-900/20 border-green-500/30 p-6">
            <h4 className="text-xl font-bold text-green-400 mb-3">Moderate (3-5% OTM)</h4>
            <p className="text-gray-300 text-sm mb-3">
              Balanced premium and reasonable chance of assignment.
            </p>
            <p className="text-gray-400 text-xs">
              Best for: Income generation with mild upside potential
            </p>
          </Card>
          <Card className="bg-orange-900/20 border-orange-500/30 p-6">
            <h4 className="text-xl font-bold text-orange-400 mb-3">Aggressive (ATM or ITM)</h4>
            <p className="text-gray-300 text-sm mb-3">
              Maximum premium but high probability of assignment.
            </p>
            <p className="text-gray-400 text-xs">
              Best for: Wanting to sell stock at premium price
            </p>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Best Practices</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Target 30-45 Days to Expiration</h4>
              <p className="text-gray-300">This timeframe offers optimal theta decay while giving stock room to move.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Aim for 1-2% Monthly Returns</h4>
              <p className="text-gray-300">Realistic target for premium as percentage of stock value. Compounds to 12-24% annually.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Avoid Earnings Announcements</h4>
              <p className="text-gray-300">Stock can gap beyond your strike, leaving you with limited upside but full downside.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Roll When Profitable</h4>
              <p className="text-gray-300">Consider buying back the call at 50-75% profit and selling a new one for next month.</p>
            </div>
          </li>
        </ul>
      </section>

      <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Important Considerations</h4>
            <p className="text-gray-300 text-sm">
              Covered calls reduce but don't eliminate downside risk. If the stock falls significantly, you'll lose money despite the premium collected. This strategy is best for stocks you're comfortable owning long-term and wouldn't mind selling at the strike price.
            </p>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our covered call calculator helps you evaluate different strike prices and expirations. See your potential returns, breakeven point, and maximum profit instantly. Compare multiple scenarios to find the optimal balance of income and upside potential.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2 mb-6">
          Calculate Covered Call Returns
          <TrendingUp className="w-5 h-5" />
        </button>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Covered calls are an excellent way to generate consistent income from your stock portfolio. While they cap your upside, they provide regular cash flow and a buffer against small price declines. The key is choosing strikes that align with your outlook and income goals.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Use our calculator to model different scenarios, understand your trade-offs, and build a systematic covered call strategy. With discipline and proper stock selection, covered calls can meaningfully enhance your portfolio returns.
        </p>
      </section>
    </>
  )
}

function VisualizationContent() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Visualizing profit and loss is one of the most powerful tools for understanding options strategies. P&L diagrams transform complex mathematical formulas into intuitive visual representations, making it easier to grasp risk, reward, and breakeven points at a glance.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Whether you're trading a simple call option or a complex multi-leg strategy, being able to "see" your potential outcomes helps you make better decisions and manage risk effectively.
        </p>
      </section>

      <Card className="bg-blue-900/20 border-blue-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>P&L diagrams show profit/loss across all possible stock prices</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Payoff curves reveal risk zones, profit zones, and breakeven points</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Interactive charts let you compare strategies before placing trades</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Time-lapse visualization shows how theta decay affects positions</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Understanding P&L Diagrams</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          A profit/loss diagram plots your strategy's P&L (Y-axis) against different stock prices (X-axis) at expiration. The resulting curve shows exactly how much you'll make or lose at any price point.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Anatomy of a P&L Diagram</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>X-Axis (Horizontal):</strong> Underlying stock price</p>
            <p><strong>Y-Axis (Vertical):</strong> Profit or loss in dollars</p>
            <p><strong>Zero Line:</strong> Breakeven - no profit, no loss</p>
            <p><strong>Curve:</strong> Your strategy's payoff at different prices</p>
            <p><strong>Green Zone:</strong> Profitable price range</p>
            <p><strong>Red Zone:</strong> Loss price range</p>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Basic Strategy Patterns</h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <Card className="bg-green-900/20 border-green-500/30 p-6">
            <h4 className="text-xl font-bold text-green-400 mb-3">Long Call</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Shape:</strong> Hockey stick - flat loss on left, unlimited gain on right
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Interpretation:</strong> Limited risk (premium paid), unlimited upside above breakeven
            </p>
          </Card>
          <Card className="bg-red-900/20 border-red-500/30 p-6">
            <h4 className="text-xl font-bold text-red-400 mb-3">Long Put</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Shape:</strong> Reverse hockey stick - high gain on left, flat loss on right
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Interpretation:</strong> Limited risk, substantial profit potential if stock falls
            </p>
          </Card>
          <Card className="bg-purple-900/20 border-purple-500/30 p-6">
            <h4 className="text-xl font-bold text-purple-400 mb-3">Iron Condor</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Shape:</strong> Plateau in middle with slopes on both sides
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Interpretation:</strong> Profit in range, defined loss outside wings
            </p>
          </Card>
          <Card className="bg-blue-900/20 border-blue-500/30 p-6">
            <h4 className="text-xl font-bold text-blue-400 mb-3">Covered Call</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Shape:</strong> Diagonal line that flattens at strike price
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Interpretation:</strong> Capped upside, full downside risk minus premium
            </p>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Reading Payoff Curves</h2>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: Analyzing a Bull Call Spread</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Strategy:</strong> Buy $100 Call, Sell $110 Call for $3 net debit</p>
                <p className="pt-2 border-t border-purple-500/30"><strong>What the Chart Shows:</strong></p>
                <p>• <strong>Below $100:</strong> Flat line at -$300 (max loss)</p>
                <p>• <strong>$100-$110:</strong> Upward slope (profit zone begins)</p>
                <p>• <strong>Above $110:</strong> Flat line at +$700 (max profit)</p>
                <p className="pt-2 border-t border-purple-500/30 text-white"><strong>Breakeven:</strong> Where line crosses zero = $103</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Interactive Chart Features</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Modern options calculators offer interactive charts that go beyond static diagrams. You can manipulate variables in real-time and see instant visual feedback.
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Time Decay Visualization</h4>
              <p className="text-gray-300">Watch how your P&L curve changes as days pass. See theta decay in action across different price points.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Volatility Impact</h4>
              <p className="text-gray-300">Adjust implied volatility sliders to see how vega affects your position before and at expiration.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Strategy Comparison</h4>
              <p className="text-gray-300">Overlay multiple strategies on one chart to compare risk/reward profiles side-by-side.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Probability Cones</h4>
              <p className="text-gray-300">View statistical probability ranges overlaid on your P&L curve to assess likelihood of outcomes.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Multi-Leg Strategy Visualization</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Complex strategies like butterflies, condors, and calendars become much easier to understand when visualized. You can see each leg's contribution to the overall payoff curve.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Building Strategies Visually</h4>
          <p className="text-gray-300 text-sm mb-3">
            Start with a blank canvas and add one leg at a time. Watch the payoff curve evolve with each addition:
          </p>
          <div className="space-y-2 text-gray-300 text-sm ml-4">
            <p>1. Add long call → See hockey stick appear</p>
            <p>2. Add short call → Curve flattens at higher strike (bull call spread)</p>
            <p>3. Add short put → Curve rises on left side</p>
            <p>4. Add long put → Final shape emerges (Iron Condor)</p>
          </div>
        </Card>
      </section>

      <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Common Visualization Mistakes</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Only looking at expiration P&L - Check current date P&L too</li>
              <li>• Ignoring probability - High max profit doesn't mean likely profit</li>
              <li>• Forgetting commissions - They shift your breakeven points</li>
              <li>• Not accounting for early assignment risk on short options</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our options calculator provides real-time interactive P&L charts for any strategy. Build multi-leg positions, adjust strikes and expirations, and instantly see visual feedback. Toggle time decay, volatility changes, and probability overlays to fully understand your position.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2 mb-6">
          Visualize Your Strategy
          <TrendingUp className="w-5 h-5" />
        </button>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Visualization transforms options from abstract math into concrete, understandable scenarios. By seeing your risk and reward graphically, you'll make more informed decisions, better understand your exposure, and communicate strategies more effectively.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Use our interactive charts to model every trade before you place it. Compare alternatives, stress-test scenarios, and build intuition for how different strategies behave. Great traders don't just calculate - they visualize.
        </p>
      </section>
    </>
  )
}

function BullPutSpreadContent() {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The bull put spread is a credit strategy designed for moderately bullish market outlooks. By selling a put and buying a lower-strike put for protection, you collect premium upfront while defining your maximum risk. It's a favorite among income traders who want bullish exposure with limited capital requirements.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Unlike buying calls, which requires the stock to move significantly to profit, a bull put spread profits from the stock staying flat, rising, or even declining slightly - as long as it stays above your short put strike.
        </p>
      </section>

      <Card className="bg-blue-900/20 border-blue-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Credit strategy - you receive money upfront when opening</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Profits when stock stays above short put strike</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Maximum loss is limited by long put protection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Lower capital requirement than owning stock</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">How Bull Put Spreads Work</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          A bull put spread involves simultaneously selling an out-of-the-money put and buying a further out-of-the-money put with the same expiration. The difference in premiums creates a net credit that you keep if the stock stays above your short strike.
        </p>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Structure Breakdown</h4>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><strong>Sell Put:</strong> Higher strike (closer to current price) - collect premium</p>
            <p><strong>Buy Put:</strong> Lower strike (further OTM) - pay premium for protection</p>
            <p><strong>Net Credit:</strong> Premium sold - Premium bought</p>
            <p><strong>Collateral:</strong> Difference between strikes minus net credit</p>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Setup Example</h2>

        <Card className="bg-purple-900/20 border-purple-500/30 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Example: SPY Bull Put Spread</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Underlying:</strong> SPY trading at $450</p>
                <p><strong>Outlook:</strong> Moderately bullish - expect SPY to stay above $440</p>
                <p><strong>Expiration:</strong> 30 days</p>
                <p className="pt-2 border-t border-purple-500/30"><strong>Trade:</strong></p>
                <p>Sell 1 SPY $440 Put @ $2.50 (collect $250)</p>
                <p>Buy 1 SPY $435 Put @ $1.30 (pay $130)</p>
                <p className="text-green-400"><strong>Net Credit:</strong> $1.20 per share ($120 total)</p>
                <p className="text-blue-400"><strong>Collateral Required:</strong> $380 (spread width $500 - credit $120)</p>
                <p className="pt-2 border-t border-purple-500/30"><strong>Return on Risk:</strong> $120 / $380 = 31.6% in 30 days</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Profit and Loss Calculations</h2>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Maximum Profit</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Profit = Net Credit Received
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Achieved when stock closes at or above short put strike at expiration.
          </p>
          <p className="text-green-400 text-sm">
            Example: $120 (if SPY closes at $440 or higher)
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Maximum Loss</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Max Loss = (Spread Width × 100) - Net Credit
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Occurs if stock closes at or below long put strike.
          </p>
          <p className="text-red-400 text-sm">
            Example: ($5 × 100) - $120 = $380 max loss
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">Breakeven Point</h4>
          <code className="text-blue-400 text-lg block mb-3">
            Breakeven = Short Put Strike - (Net Credit / 100)
          </code>
          <p className="text-gray-300 text-sm mb-2">
            Stock can fall to this price and you still break even.
          </p>
          <p className="text-blue-400 text-sm">
            Example: $440 - $1.20 = $438.80
          </p>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">When to Use Bull Put Spreads</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Mildly Bullish Outlook</h4>
              <p className="text-gray-300">You expect the stock to rise or stay flat, but don't need a large upward move to profit.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Support Levels</h4>
              <p className="text-gray-300">Stock has clear support levels you believe will hold. Sell puts at or just below support.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white mb-1">High IV Environment</h4>
              <p className="text-gray-300">Elevated volatility means higher premiums. Collect more credit for the same spread width.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white mb-1">Income Generation</h4>
              <p className="text-gray-300">Consistent strategy for monthly cash flow when you have bullish bias but want defined risk.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Strike Selection Guidelines</h2>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <Card className="bg-green-900/20 border-green-500/30 p-6">
            <h4 className="text-xl font-bold text-green-400 mb-3">Conservative Approach</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Short Put:</strong> 15-20% below current price
            </p>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Spread Width:</strong> $5-$10
            </p>
            <p className="text-gray-400 text-xs">
              Higher probability of profit, lower premium collected
            </p>
          </Card>
          <Card className="bg-orange-900/20 border-orange-500/30 p-6">
            <h4 className="text-xl font-bold text-orange-400 mb-3">Aggressive Approach</h4>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Short Put:</strong> 5-10% below current price
            </p>
            <p className="text-gray-300 text-sm mb-3">
              <strong>Spread Width:</strong> $5 or less
            </p>
            <p className="text-gray-400 text-xs">
              Higher premium, but requires stock to stay above closer strike
            </p>
          </Card>
        </div>
      </section>

      <Card className="bg-yellow-900/20 border-yellow-500/30 p-6 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-2">Risk Management Essentials</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Target 30-45 days to expiration for optimal theta decay</li>
              <li>• Aim for credit that's 1/3 of spread width for good risk/reward</li>
              <li>• Close at 50-75% of max profit to reduce tail risk</li>
              <li>• Avoid holding through earnings if spread is near the money</li>
              <li>• Don't allocate more than 5% of portfolio to any single spread</li>
            </ul>
          </div>
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Bull Put Spread vs. Long Call</h2>

        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-blue-400 mb-3">Bull Put Spread</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✓ Collect premium upfront</li>
                <li>✓ Profit from time decay</li>
                <li>✓ Defined maximum risk</li>
                <li>✓ Profits even if stock is flat</li>
                <li>✗ Limited profit potential</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">Long Call</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✓ Unlimited profit potential</li>
                <li>✓ Simple to understand</li>
                <li>✗ Pay premium upfront</li>
                <li>✗ Time decay works against you</li>
                <li>✗ Requires stock to move up to profit</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Our bull put spread calculator shows you potential returns, breakeven points, and probability of profit for different strike selections. Model multiple scenarios, compare risk/reward ratios, and find the optimal spread width for your outlook and risk tolerance.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2 mb-6">
          Calculate Bull Put Spread
          <TrendingUp className="w-5 h-5" />
        </button>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The bull put spread is an excellent strategy for generating income with a bullish bias. It offers defined risk, reasonable probability of profit, and benefits from both time decay and volatility contraction. The key is selecting strikes that align with your market outlook and managing risk appropriately.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Use our calculator to find the sweet spot between premium collected and probability of profit. With proper strike selection and disciplined management, bull put spreads can be a consistent source of portfolio income.
        </p>
      </section>
    </>
  )
}

// Default article content for "How to Calculate Options Profit"
function DefaultArticleContent() {
  return (
    <>
      <section className="mb-8">
        <p className="text-gray-300 leading-relaxed mb-4">
          Options trading can seem complex at first, but understanding how to calculate your potential profit and loss is fundamental to successful trading. Whether you're buying calls, selling puts, or executing complex multi-leg strategies, knowing your exact profit potential helps you make informed decisions and manage risk effectively.
        </p>
        <p className="text-gray-300 leading-relaxed">
          In this comprehensive guide, we'll break down the profit calculation formulas for different option strategies, show you real examples, and teach you how to use our advanced calculator to visualize your potential returns.
        </p>
      </section>

      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Options profit = (Exit Price - Entry Price) × Contract Multiplier × Number of Contracts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Long positions profit when the option increases in value; short positions profit when it decreases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Maximum loss for option buyers is limited to the premium paid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Our calculator automatically accounts for commissions, fees, and complex multi-leg strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Separator className="my-8 bg-gray-700" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">What Are Options?</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Before diving into profit calculations, let's quickly review what options are. An option is a contract that gives you the right (but not the obligation) to buy or sell an underlying asset at a predetermined price before a specific date.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Call Options
            </h3>
            <p className="text-gray-300 text-sm">
              Give you the right to <strong>buy</strong> the underlying asset at the strike price. Traders buy calls when they expect the price to rise.
            </p>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              Put Options
            </h3>
            <p className="text-gray-300 text-sm">
              Give you the right to <strong>sell</strong> the underlying asset at the strike price. Traders buy puts when they expect the price to fall.
            </p>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Basic Profit Calculation</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          The fundamental formula for calculating options profit is straightforward:
        </p>

        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <code className="text-blue-400 text-sm block mb-2">
            Profit = (Exit Price - Entry Price) × 100 × Number of Contracts
          </code>
          <p className="text-gray-400 text-sm">
            The multiplier is 100 because each standard option contract represents 100 shares of the underlying stock.
          </p>
        </Card>

        <h3 className="text-xl font-semibold text-white mb-3">Long Call Example</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          You buy 1 call option on AAPL with a strike price of $150 for a premium of $5.00. The stock rallies, and you sell the option for $8.00.
        </p>
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Price:</span>
              <span className="text-white">$5.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Exit Price:</span>
              <span className="text-white">$8.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contracts:</span>
              <span className="text-white">1</span>
            </div>
            <Separator className="my-2 bg-gray-600" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-300">Profit:</span>
              <span className="text-green-400">($8.00 - $5.00) × 100 × 1 = $300</span>
            </div>
          </div>
        </Card>

        <h3 className="text-xl font-semibold text-white mb-3">Long Put Example</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          You buy 2 put options on TSLA with a strike of $200 for $6.00 each. The stock drops, and you sell for $10.00 each.
        </p>
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Price:</span>
              <span className="text-white">$6.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Exit Price:</span>
              <span className="text-white">$10.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contracts:</span>
              <span className="text-white">2</span>
            </div>
            <Separator className="my-2 bg-gray-600" />
            <div className="flex justify-between font-semibold">
              <span className="text-gray-300">Profit:</span>
              <span className="text-green-400">($10.00 - $6.00) × 100 × 2 = $800</span>
            </div>
          </div>
        </Card>
      </section>

      <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Risk Warning</h3>
            <p className="text-gray-300 text-sm">
              When buying options, your maximum loss is limited to the premium paid. However, when selling (writing) options, your potential losses can be substantial or even unlimited in the case of naked calls. Always understand your risk exposure before entering a trade.
            </p>
          </div>
        </div>
      </Card>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Using Our Calculator</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Our advanced options calculator makes profit/loss calculations simple and accurate. Here's what makes it powerful:
        </p>
        <ul className="space-y-3 text-gray-300 mb-6">
          <li className="flex items-start gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">1</Badge>
            <div>
              <strong className="text-white">Multi-Leg Support:</strong> Calculate complex strategies like iron condors, butterflies, and spreads with multiple option legs
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">2</Badge>
            <div>
              <strong className="text-white">Greeks Analysis:</strong> See how Delta, Gamma, Theta, and Vega affect your position
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">3</Badge>
            <div>
              <strong className="text-white">Visual P&L Charts:</strong> Interactive charts show your profit/loss at different stock prices and dates
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">4</Badge>
            <div>
              <strong className="text-white">Commission & Fees:</strong> Automatically factors in trading costs for accurate net profit calculations
            </div>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1">1</Badge>
            <div>
              <strong className="text-white">Always calculate your break-even point</strong> before entering a trade. Know exactly where the stock needs to be for you to profit.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1">2</Badge>
            <div>
              <strong className="text-white">Factor in all costs</strong> including commissions, fees, and the bid-ask spread. Small costs add up quickly.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1">3</Badge>
            <div>
              <strong className="text-white">Use position sizing</strong> to manage risk. Never risk more than a small percentage of your portfolio on any single trade.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1">4</Badge>
            <div>
              <strong className="text-white">Monitor the Greeks</strong> to understand how time decay, volatility, and price movements affect your position's value.
            </div>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Conclusion</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Understanding how to calculate options profit is the foundation of successful options trading. Whether you're trading simple long calls and puts or complex multi-leg strategies, knowing your exact profit potential, break-even points, and risk exposure is crucial.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Use our calculator to model different scenarios, visualize your P&L, and make informed trading decisions. With practice and the right tools, calculating options profit becomes second nature.
        </p>
      </section>
    </>
  )
}

function BlogPostLayout({ postSlug, onBack, onNavigateToPost }: { postSlug: string, onBack?: () => void, onNavigateToPost?: (slug: string) => void }) {
  // Find the post by slug
  const post = samplePosts.find(p => p.slug === postSlug)

  // Get related posts from same category
  const relatedPosts = post
    ? samplePosts.filter(p => p.slug !== postSlug && p.category === post.category).slice(0, 3)
    : []

  // If post not found, show error
  if (!post) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  // SEO Schema for Blog Post
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.featuredImage || 'https://optionscalculator.com/default-blog-image.jpg',
    'datePublished': post.publishedDate,
    'dateModified': post.updatedDate || post.publishedDate,
    'author': {
      '@type': 'Person',
      'name': post.author.name,
      'description': post.author.bio
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Options Profit Calculator',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://optionscalculator.com/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://optionscalculator.com/blog/${post.slug}`
    },
    'keywords': post.tags.join(', '),
    'articleSection': post.category,
    'wordCount': 1500
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://optionscalculator.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://optionscalculator.com/blog'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://optionscalculator.com/blog/${post.slug}`
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Options Profit Calculator Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <link rel="canonical" href={`https://optionscalculator.com/blog/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://optionscalculator.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage || 'https://optionscalculator.com/default-blog-image.jpg'} />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:modified_time" content={post.updatedDate || post.publishedDate} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://optionscalculator.com/blog/${post.slug}`} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage || 'https://optionscalculator.com/default-blog-image.jpg'} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <article className="min-h-screen bg-black text-white">
        {/* Top Navigation Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-700 shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-base font-semibold">Back to Blog</span>
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300">{post.readTime} min read</span>
              <Separator orientation="vertical" className="h-5 bg-gray-600" />
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy link"
                >
                  <LinkIcon className="w-5 h-5 text-gray-300 hover:text-green-400" />
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Share on X"
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Article Header */}
              <header className="mb-12">
                <div className="mb-4">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    {post.category}
                  </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{post.author.name}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-blue-500/50 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </header>

              {/* Featured Image Placeholder */}
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-pink-900/60 rounded-2xl overflow-hidden mb-12 border border-gray-700">
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-24 h-24 text-blue-400/40 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Featured Image Placeholder</p>
                  </div>
                </div>
              </div>

              <Separator className="mb-12 bg-gray-700" />

              {/* Article Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                {getArticleContent(postSlug)}
              </div>

              <Separator className="my-12 bg-gray-700" />

              {/* Author Bio */}
              <Card className="bg-gray-800/50 border-gray-700 p-8 mb-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold flex-shrink-0">
                    {post.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">About {post.author.name}</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {post.author.bio || 'Professional options trader and educator dedicated to helping others succeed in the markets through education and transparent tools.'}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open('https://twitter.com/yourhandle', '_blank')}
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                        title="Follow on X"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Table of Contents */}
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Table of Contents</h3>
                  </div>
                  <nav className="space-y-2 text-sm">
                    <a href="#introduction" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      Introduction
                    </a>
                    <a href="#what-are-options" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      What Are Options?
                    </a>
                    <a href="#basic-calculation" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      Basic Profit Calculation
                    </a>
                    <a href="#calculator" className="block text-gray-300 hover:text-blue-400 transition-colors py-1 pl-3">
                      → Long Call Formula
                    </a>
                    <a href="#calculator" className="block text-gray-300 hover:text-blue-400 transition-colors py-1 pl-3">
                      → Long Put Formula
                    </a>
                    <a href="#using-calculator" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      Using Our Calculator
                    </a>
                    <a href="#best-practices" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      Best Practices
                    </a>
                    <a href="#conclusion" className="block text-gray-300 hover:text-blue-400 transition-colors py-1">
                      Conclusion
                    </a>
                  </nav>
                </Card>

                {/* Share Card */}
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <h3 className="font-bold text-white mb-4">Share This Article</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="w-full flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Copy Link</span>
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                      className="w-full flex items-center gap-3 bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg transition-colors border border-gray-700"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-sm font-medium">Share on X</span>
                    </button>
                  </div>
                </Card>

                {/* Related Tools Card */}
                <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30 p-6">
                  <h3 className="font-bold text-white mb-3">Try Our Calculator</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Calculate profit/loss for any options strategy instantly with interactive charts.
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg transition-colors">
                    Open Calculator
                  </button>
                </Card>
              </div>
            </aside>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-3xl font-bold mb-8 text-white">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    onClick={() => onNavigateToPost?.(relatedPost.slug)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  )
}
