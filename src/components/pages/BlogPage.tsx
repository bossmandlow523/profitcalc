import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'motion/react'
import { BlogHero } from '../blog/BlogHero'
import { BlogPostCard } from '@/components/ui/card-18'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Blog post interface
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedDate: string
  updatedDate?: string
  readTime: number
  category: string
  tags: string[]
  featuredImage?: string
  featured?: boolean
}

// Sample blog posts - will be replaced with real content later
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
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
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

interface BlogPageProps {
  onSelectPost?: (slug: string) => void
}

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Animation variants for child items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function BlogPage({ onSelectPost }: BlogPageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  const featuredPost = samplePosts.find(post => post.featured) || samplePosts[0]
  const regularPosts = samplePosts.filter(post => !post.featured)

  // Pagination
  const totalPages = Math.ceil(regularPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = regularPosts.slice(startIndex, startIndex + postsPerPage)

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase()
  }

  // SEO Schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Options Profit Calculator Blog',
    'description': 'Educational content about options trading, profit calculations, Greeks analysis, and strategy guides',
    'url': 'https://optionscalculator.com/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'Options Profit Calculator',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://optionscalculator.com/logo.png'
      }
    }
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': samplePosts.map((post, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'url': `https://optionscalculator.com/blog/${post.slug}`,
        'datePublished': post.publishedDate,
        'author': {
          '@type': 'Person',
          'name': post.author.name
        }
      }
    }))
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
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>Options Trading Blog - Strategies, Greeks & Profit Calculator Guides</title>
        <meta
          name="description"
          content="Learn options trading with our comprehensive guides. Master profit calculations, understand Greeks, explore strategies like iron condor and covered calls. Free educational content."
        />
        <meta
          name="keywords"
          content="options trading blog, options strategies guide, how to calculate options profit, options Greeks explained, iron condor tutorial, covered call guide, options calculator how to, options trading for beginners"
        />
        <link rel="canonical" href="https://optionscalculator.com/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://optionscalculator.com/blog" />
        <meta property="og:title" content="Options Trading Blog - Expert Guides & Tutorials" />
        <meta property="og:description" content="Learn options trading strategies, profit calculations, and Greeks analysis with our free educational guides." />
        <meta property="og:image" content="https://optionscalculator.com/blog-og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://optionscalculator.com/blog" />
        <meta name="twitter:title" content="Options Trading Blog - Expert Guides" />
        <meta name="twitter:description" content="Master options trading with our comprehensive strategy guides and tutorials." />
        <meta name="twitter:image" content="https://optionscalculator.com/blog-og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <main className="relative z-10 min-h-screen text-white">
        {/* Hero Section */}
        <BlogHero />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-12 md:mb-16"
            >
              <BlogPostCard
                variant="featured"
                tag={featuredPost.category}
                date={`ON ${formatDate(featuredPost.publishedDate)}`}
                title={featuredPost.title}
                description={featuredPost.excerpt}
                imageUrl={featuredPost.featuredImage}
                href={`/blog/${featuredPost.slug}`}
                readMoreText="Read the full article"
                onNavigate={() => onSelectPost?.(featuredPost.slug)}
              />
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-200">
              Latest Articles
            </h2>
            {paginatedPosts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {paginatedPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <BlogPostCard
                      tag={post.category}
                      date={`ON ${formatDate(post.publishedDate)}`}
                      title={post.title}
                      description={post.excerpt}
                      href={`/blog/${post.slug}`}
                      onNavigate={() => onSelectPost?.(post.slug)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No articles found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-700 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-700 hover:border-blue-500 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-700 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
