interface BlogHeroProps {
  onSearch?: (query: string) => void
}

export function BlogHero({ onSearch }: BlogHeroProps) {
  return (
    <div className="relative z-10 w-full py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Options Trading Insights
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Learn options strategies, understand Greeks, and master profit calculations with our comprehensive guides and tutorials
        </p>
      </div>
    </div>
  )
}
