'use client'

import { motion, useInView, type Variant } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface InViewProps {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  transition?: {
    duration?: number
    ease?: string | number[]
  }
  viewOptions?: {
    once?: boolean
    margin?: string
    amount?: number | 'some' | 'all'
  }
}

const defaultVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: 'easeOut' },
  viewOptions = { once: true, margin: '0px 0px -100px 0px' },
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
