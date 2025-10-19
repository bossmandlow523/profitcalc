import { Home, Search, BarChart3, Crown, FileText, HelpCircle } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

type Page = 'home' | 'calculator'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { name: 'Home', onClick: () => onNavigate('home'), icon: Home },
    { name: 'Option Finder', onClick: () => {}, icon: Search },
    { name: 'Strategies', onClick: () => {}, icon: BarChart3 },
    { name: 'Membership', onClick: () => {}, icon: Crown },
    { name: 'Blog', onClick: () => {}, icon: FileText },
    { name: 'FAQ/Help', onClick: () => {}, icon: HelpCircle }
  ]

  return (
    <NavBar
      items={navItems}
      activeItem={currentPage === 'home' ? 'Home' : undefined}
    />
  )
}
