'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  position?: 'top' | 'bottom'
}

export function ScrollProgress({ className, position = 'top' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={cn(
        'fixed left-0 right-0 h-1 bg-primary origin-left z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ scaleX }}
    />
  )
}
