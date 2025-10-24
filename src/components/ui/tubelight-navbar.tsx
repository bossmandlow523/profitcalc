"use client"

import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  onClick?: () => void
  icon: LucideIcon
  disabled?: boolean
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeItem?: string
  onItemClick?: (itemName: string) => void
}

export function NavBar({ items, className, activeItem, onItemClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(activeItem || items[0]?.name || '')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (activeItem) {
      setActiveTab(activeItem)
    }
  }, [activeItem])

  const handleClick = (item: NavItem) => {
    if (item.disabled) return

    setActiveTab(item.name)
    if (item.onClick) {
      item.onClick()
    }
    if (onItemClick) {
      onItemClick(item.name)
    }
  }

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-2 bg-background/10 border border-border/40 backdrop-blur-xl px-2 py-1.5 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className={cn(
                "relative text-sm font-medium px-6 py-2.5 rounded-full transition-colors",
                item.disabled
                  ? "cursor-default text-foreground/70"
                  : "cursor-pointer text-foreground/70 hover:text-primary",
                isActive && "text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-t-full">
                    <div className="absolute w-10 h-4 bg-primary/15 rounded-full blur-md -top-1.5 -left-2" />
                    <div className="absolute w-6 h-4 bg-primary/15 rounded-full blur-md -top-0.5" />
                    <div className="absolute w-3 h-3 bg-primary/15 rounded-full blur-sm top-0 left-1.5" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
