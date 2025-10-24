import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, User } from 'lucide-react'

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

interface BlogCardProps {
  post: BlogPost
  onClick?: () => void
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <Card
      className="group overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Featured Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-900/40 to-purple-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">{post.category === 'Strategies' ? '📊' : post.category === 'Education' ? '📚' : post.category === 'Greeks' ? 'Δ' : '💡'}</span>
        </div>
        {post.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-yellow-500/90 text-black font-semibold">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-blue-600/90 text-white">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-300 mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-gray-600 text-gray-300 hover:border-blue-500/50"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
