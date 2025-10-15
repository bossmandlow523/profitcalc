import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DropdownOption {
  key: string
  label: string
  onClick?: () => void
  className?: string
  color?: "default" | "danger"
  disabled?: boolean
}

export interface BlurDropdownProps {
  trigger?: React.ReactNode
  triggerLabel?: string
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "bordered"
  options: DropdownOption[]
  menuClassName?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export function BlurDropdown({
  trigger,
  triggerLabel = "Open Menu",
  triggerVariant = "outline",
  options,
  menuClassName,
  align = "start",
  sideOffset = 4,
}: BlurDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button
            variant={triggerVariant === "bordered" ? "outline" : triggerVariant}
            className={cn(
              triggerVariant === "bordered" && "border-2"
            )}
          >
            {triggerLabel}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Blur backdrop effect
          "backdrop-blur-xl bg-background/80",
          // Glass effect
          "border border-border/50 shadow-lg",
          // Animation
          "animate-in fade-in-0 zoom-in-95",
          menuClassName
        )}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.key}
            onClick={option.onClick}
            disabled={option.disabled}
            className={cn(
              "cursor-pointer transition-colors",
              option.color === "danger" && "text-destructive focus:text-destructive",
              option.className
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
