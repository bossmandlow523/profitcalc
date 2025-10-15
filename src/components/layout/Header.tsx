import { TrendingUp, Twitter, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Page = 'home' | 'calculator'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-glow-pulse">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-purple-500 bg-clip-text text-transparent">
              Options Calculator
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? 'text-primary bg-primary/10 border border-primary/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Option Finder
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Strategies
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Membership
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Blog
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              FAQ/Help
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
            >
              <Twitter className="w-4 h-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
            >
              <Github className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
