import { Home, Search, BarChart3, Info, FileText, HelpCircle } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

type Page = 'home' | 'calculator' | 'faq' | 'about' | 'blog' | 'strategies'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { name: 'Home', onClick: () => onNavigate('home'), icon: Home },
    { name: 'Calculator', onClick: () => onNavigate('calculator'), icon: Search, disabled: true },
    { name: 'Strategies', onClick: () => onNavigate('strategies'), icon: BarChart3 },
    { name: 'About', onClick: () => onNavigate('about'), icon: Info },
    { name: 'Blog', onClick: () => onNavigate('blog'), icon: FileText },
    { name: 'FAQ', onClick: () => onNavigate('faq'), icon: HelpCircle }
  ]

  const getActiveItem = () => {
    switch (currentPage) {
      case 'home': return 'Home'
      case 'calculator': return 'Calculator'
      case 'strategies': return 'Strategies'
      case 'faq': return 'FAQ'
      case 'about': return 'About'
      case 'blog': return 'Blog'
      default: return undefined
    }
  }

  return (
    <NavBar
      items={navItems}
      activeItem={getActiveItem()}
    />
  )
}
