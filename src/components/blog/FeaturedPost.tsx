import { Badge } from '@/components/ui/badge'
import { MagicCard } from '@/components/ui/magic-card'
import { Clock, Calendar, User, ArrowRight } from 'lucide-react'
import type { BlogPost } from './BlogCard'

interface FeaturedPostProps {
  post: BlogPost
  onClick?: () => void
}

export function FeaturedPost({ post, onClick }: FeaturedPostProps) {
  return (
    <MagicCard
      className="w-full cursor-pointer rounded-2xl overflow-hidden"
      gradientSize={300}
      gradientFrom="#3B82F6"
      gradientTo="#8B5CF6"
      onClick={onClick}
    >
      <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-800/50 backdrop-blur-sm">
        {/* Image Side */}
        <div className="relative h-64 md:h-full bg-gradient-to-br from-blue-900/60 to-purple-900/60 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl opacity-20">✨</span>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-yellow-500 text-black font-semibold px-3 py-1">
              Featured Article
            </Badge>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <Badge className="bg-blue-600 text-white mb-4">
              {post.category}
            </Badge>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* CTA Button */}
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold group">
            Read Full Article
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </MagicCard>
  )
}
