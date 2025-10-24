import { useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './components/home/HomePage'
import { CalculatorPage } from './components/calculator/CalculatorPage'
import FAQPage from './components/pages/FAQPage'
import AboutPage from './components/pages/AboutPage'
import BlogPage from './components/pages/BlogPage'
import BlogPostPage from './components/pages/BlogPostPage'
import StrategiesPage from './components/pages/StrategiesPage'
import { AnimatedGridPattern } from './components/ui/animated-grid-pattern'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'calculator' | 'faq' | 'about' | 'blog' | 'blog-post' | 'strategies'>('home')
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')
  const [selectedBlogPost, setSelectedBlogPost] = useState<string>('')

  const handleSelectStrategy = (strategy: string) => {
    setSelectedStrategy(strategy)
    setCurrentPage('calculator')
    window.scrollTo(0, 0)
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setSelectedStrategy('')
    window.scrollTo(0, 0)
  }

  const handleNavigate = (page: 'home' | 'calculator' | 'faq' | 'about' | 'blog' | 'strategies') => {
    if (page === 'home') {
      handleBackToHome()
    } else {
      setCurrentPage(page)
      window.scrollTo(0, 0)
    }
  }

  const handleSelectBlogPost = (slug: string) => {
    setSelectedBlogPost(slug)
    setCurrentPage('blog-post')
    window.scrollTo(0, 0)
  }

  const handleBackToBlog = () => {
    setCurrentPage('blog')
    setSelectedBlogPost('')
    window.scrollTo(0, 0)
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Animated Background Grid */}
        <AnimatedGridPattern
          numSquares={40}
          maxOpacity={0.6}
          duration={3}
          repeatDelay={1}
          className="fixed inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
        />

        {/* Main Content */}
        {currentPage === 'blog-post' ? (
          <>
            <BlogPostPage
              postSlug={selectedBlogPost}
              onBack={handleBackToBlog}
              onNavigateToPost={handleSelectBlogPost}
            />
          </>
        ) : (
          <>
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
            <div className="pt-16">
              {currentPage === 'home' && (
                <HomePage
                  onSelectStrategy={handleSelectStrategy}
                  onNavigateToStrategies={() => handleNavigate('strategies')}
                />
              )}
              {currentPage === 'calculator' && (
                <CalculatorPage
                  selectedStrategy={selectedStrategy}
                  onBackToHome={handleBackToHome}
                />
              )}
              {currentPage === 'faq' && <FAQPage />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'strategies' && <StrategiesPage />}
              {currentPage === 'blog' && (
                <BlogPage onSelectPost={handleSelectBlogPost} />
              )}
            </div>
            <Footer />
          </>
        )}
      </div>
    </HelmetProvider>
  )
}

export default App
