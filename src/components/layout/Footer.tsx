import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="glass-card border-t border-border/50 py-10 mt-auto relative z-10 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors h-auto p-0">
            About
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors h-auto p-0">
            Terms and Conditions
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors h-auto p-0">
            Privacy Policy
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors h-auto p-0">
            Contact
          </Button>
        </div>
        <div className="text-center text-muted-foreground text-sm">
          Copyright 2008-2025 Options Profit Calculator
        </div>
      </div>
    </footer>
  )
}
