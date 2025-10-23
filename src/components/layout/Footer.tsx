import { Facebook, Instagram, Youtube, Linkedin, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DotPattern } from '@/components/ui/dot-pattern'
import { Button } from '@/components/ui/button'

interface FooterLink {
  title: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { title: 'Options Calculator', href: '#calculator' },
      { title: 'Strategy Builder', href: '#strategies' },
      { title: 'Live Options Chain', href: '#chain' },
      { title: 'Greeks Analysis', href: '#greeks' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '#docs' },
      { title: 'Guides & Tutorials', href: '#guides' },
      { title: 'API Reference', href: '#api' },
      { title: 'Community', href: '#community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '#about' },
      { title: 'Contact', href: '#contact' },
      { title: 'Privacy Policy', href: '#privacy' },
      { title: 'Terms of Service', href: '#terms' },
    ],
  },
]

const socialLinks = [
  { title: 'Facebook', href: '#', icon: Facebook },
  { title: 'Instagram', href: '#', icon: Instagram },
  { title: 'Youtube', href: '#', icon: Youtube },
  { title: 'LinkedIn', href: '#', icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="relative w-full border-t bg-background">
      {/* Dot Pattern Background */}
      <DotPattern
        className={cn(
          "opacity-40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold">Options Calculator</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Advanced options trading analytics and profit calculation tools for informed investment decisions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.title}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 hover:bg-primary hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <a href={social.href} aria-label={social.title}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-12">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-5">
                    {section.title}
                  </h3>
                  <ul className="space-y-3.5">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Options Profit Calculator. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Advanced trading analytics
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
