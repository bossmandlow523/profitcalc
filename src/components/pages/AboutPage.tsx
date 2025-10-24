import { Helmet } from 'react-helmet-async';
import { Target, TrendingUp, Shield, Zap } from 'lucide-react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';

export default function AboutPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Options Profit Calculator',
      'description': 'Free online options profit calculator providing real-time visualization, Greeks analysis, and breakeven calculations for all options trading strategies.',
      'url': 'https://optionscalculator.com',
      'foundingDate': '2024',
      'slogan': 'Visualize Your Options Trading Potential'
    }
  };

  return (
    <>
      <Helmet>
        <title>About Options Profit Calculator - Our Mission & Team</title>
        <meta
          name="description"
          content="Learn about Options Profit Calculator: free tool built by experienced traders to help visualize options strategies, understand risk, and make informed trading decisions."
        />
        <meta
          name="keywords"
          content="about options calculator, options trading tool, options education, trading transparency"
        />
        <link rel="canonical" href="https://optionscalculator.com/about" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <main className="relative z-10 min-h-screen text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              About Options Profit Calculator
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering traders with professional-grade options analysis tools, completely free
            </p>
          </div>

          {/* Mission Section */}
          <BlurFade delay={0.1}>
            <section className="mb-20">
              <MagicCard className="p-8 sm:p-12" gradientFrom="#3b82f6" gradientTo="#a855f7">
                <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <p className="text-xl sm:text-2xl font-medium text-center leading-relaxed text-white">
                    We believe that powerful financial tools shouldn't be locked behind paywalls or complicated platforms.
                  </p>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent my-6" />

                  <p className="text-lg text-gray-300 leading-relaxed text-center">
                    Our mission is to <span className="text-white font-semibold">democratize options trading education</span> by providing a{' '}
                    <span className="text-white font-semibold">free, professional-grade calculator</span> that helps traders{' '}
                    <span className="text-blue-200">visualize risk</span>,{' '}
                    <span className="text-blue-200">understand Greeks</span>, and{' '}
                    <span className="text-blue-200">make informed decisions</span>.
                  </p>

                  <div className="pt-4 text-center">
                    <p className="text-base text-gray-400">
                      Whether you're learning your first covered call or optimizing complex multi-leg strategies, we're here to help you succeed.
                    </p>
                  </div>
                </div>
              </MagicCard>
            </section>
          </BlurFade>

          {/* Why We Built This */}
          <BlurFade delay={0.2}>
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center">Why We Built This Tool</h2>
              <BentoGrid className="lg:grid-rows-2">
                <BentoCard
                  name="Transparency First"
                  description="Many options calculators are expensive, limited, or filled with ads. We built a completely free tool with no hidden costs, no registration walls, and transparent calculations using industry-standard models."
                  Icon={Target}
                  href="#"
                  cta="Learn more"
                  className="col-span-3 lg:col-span-1"
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20" />
                  }
                />
                <BentoCard
                  name="Education Through Visualization"
                  description="We believe the best way to learn options is through interactive visualization. Our charts show exactly how your P&L changes at different stock prices, making complex strategies intuitive and understandable."
                  Icon={TrendingUp}
                  href="#"
                  cta="Learn more"
                  className="col-span-3 lg:col-span-2"
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />
                  }
                />
                <BentoCard
                  name="Risk Management Focus"
                  description="Every trade has risk. Our calculator clearly shows maximum profit, maximum loss, and breakeven points so you can size positions appropriately and never risk more than you can afford to lose."
                  Icon={Shield}
                  href="#"
                  cta="Learn more"
                  className="col-span-3 lg:col-span-2"
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20" />
                  }
                />
                <BentoCard
                  name="Real-Time Analysis"
                  description="Markets move fast. Our calculator provides instant results with real-time Greeks analysis (Delta, Gamma, Theta, Vega) so you can understand how your position will behave as market conditions change."
                  Icon={Zap}
                  href="#"
                  cta="Learn more"
                  className="col-span-3 lg:col-span-1"
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-yellow-500/20" />
                  }
                />
              </BentoGrid>
            </section>
          </BlurFade>

          {/* What Makes Us Different */}
          <BlurFade delay={0.3}>
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center">What Makes Us Different</h2>
              <MagicCard className="p-8" gradientFrom="#10b981" gradientTo="#3b82f6">
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">100% Free Forever</h4>
                      <p className="text-gray-300">No freemium model, no premium tiers, no paywalls. All features are completely free.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">No Registration Required</h4>
                      <p className="text-gray-300">Start calculating immediately without creating an account or providing personal information.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Professional-Grade Calculations</h4>
                      <p className="text-gray-300">Uses Black-Scholes and binomial models—the same methods used by professional trading platforms.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Interactive Visualizations</h4>
                      <p className="text-gray-300">Dynamic P&L charts that update in real-time as you adjust strategy parameters.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Educational Content</h4>
                      <p className="text-gray-300">Comprehensive guides, strategy explanations, and Greeks tutorials to help you learn as you trade.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 font-bold text-xl mr-4">✓</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Mobile-Friendly Design</h4>
                      <p className="text-gray-300">Full functionality on desktop, tablet, and mobile devices—calculate anywhere, anytime.</p>
                    </div>
                  </li>
                </ul>
              </MagicCard>
            </section>
          </BlurFade>

          {/* Accuracy & Methodology */}
          <BlurFade delay={0.4}>
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center">Calculation Methodology</h2>
              <MagicCard className="p-8" gradientFrom="#8b5cf6" gradientTo="#ec4899">
              <p className="text-gray-300 leading-relaxed mb-6">
                Our calculator uses industry-standard option pricing models to ensure accurate results:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-lg mb-2">Black-Scholes Model</h4>
                  <p className="text-gray-300">
                    For European-style options, we use the Black-Scholes model, the most widely-used method for
                    options pricing developed by Fischer Black, Myron Scholes, and Robert Merton.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-lg mb-2">Greeks Calculation</h4>
                  <p className="text-gray-300">
                    Delta, Gamma, Theta, and Vega are calculated using first and second-order partial derivatives
                    of the option pricing formula, providing accurate sensitivity analysis.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-lg mb-2">Multi-Leg Strategies</h4>
                  <p className="text-gray-300">
                    For complex strategies, we calculate each leg independently and aggregate the results,
                    accounting for net debit/credit and combined Greeks exposure.
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-6 italic">
                Note: Calculations are based on theoretical models and assumptions. Actual market prices may vary
                due to bid-ask spreads, liquidity, early assignment risk, and other factors. Always verify with
                your broker before executing trades.
              </p>
              </MagicCard>
            </section>
          </BlurFade>

          {/* Disclaimer */}
          <BlurFade delay={0.5}>
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center">Important Disclaimer</h2>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-yellow-400">Educational Purposes Only:</strong> This calculator is provided for educational
                  and informational purposes only. It is not investment advice, financial advice, or a recommendation to buy or sell
                  any security. Options trading involves substantial risk and is not suitable for all investors. You may lose more
                  than your initial investment. Past performance does not guarantee future results. Always consult with a licensed
                  financial advisor before making investment decisions. By using this tool, you acknowledge that you are solely
                  responsible for your trading decisions and any resulting gains or losses.
                </p>
              </div>
            </section>
          </BlurFade>

          {/* Contact & Feedback */}
          <BlurFade delay={0.6}>
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                We're constantly improving our calculator based on user feedback. Have a feature request or found a bug?
                We'd love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="mailto:support@optionscalculator.com"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/calculator"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Try the Calculator
                </a>
              </div>
            </section>
          </BlurFade>
        </div>
      </main>
    </>
  );
}
