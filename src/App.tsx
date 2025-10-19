import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './components/home/HomePage'
import { CalculatorPage } from './components/calculator/CalculatorPage'
import { AnimatedGridPattern } from './components/ui/animated-grid-pattern'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'calculator'>('home')
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')

  const handleSelectStrategy = (strategy: string) => {
    setSelectedStrategy(strategy)
    setCurrentPage('calculator')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setSelectedStrategy('')
  }

  const handleNavigate = (page: 'home' | 'calculator') => {
    if (page === 'home') {
      handleBackToHome()
    }
    // For calculator navigation, we'd need to know which strategy to show
    // For now, we'll just handle home navigation
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated Background Grid */}
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.6}
        duration={3}
        repeatDelay={1}
        className="fixed inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]"
      />

      {/* Main Content */}
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <div className="pt-16">
        {currentPage === 'home' ? (
          <HomePage onSelectStrategy={handleSelectStrategy} />
        ) : (
          <CalculatorPage
            selectedStrategy={selectedStrategy}
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default App
