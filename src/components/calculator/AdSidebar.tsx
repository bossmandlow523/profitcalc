import { Play } from 'lucide-react'

export function AdSidebar() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6 animate-fade-in">
      <div className="h-64 glass-card border border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 font-medium">
        <div className="text-sm">AD SPACE</div>
        <div className="text-xs">300×250</div>
      </div>
      <div className="h-48 glass-card-strong border border-primary/30 rounded-2xl flex flex-col items-center justify-center text-gray-400 animate-glow-pulse">
        <Play className="w-12 h-12 mb-2 text-primary" fill="currentColor" />
        <div className="text-sm font-medium">VIDEO/MEDIA</div>
        <div className="text-xs">300×180</div>
      </div>
      <div className="h-64 glass-card border border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 font-medium">
        <div className="text-sm">AD SPACE</div>
        <div className="text-xs">300×250</div>
      </div>
      <div className="h-[600px] glass-card border border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500 font-medium">
        <div className="text-sm">AD SPACE</div>
        <div className="text-xs">300×600</div>
      </div>
    </aside>
  )
}
