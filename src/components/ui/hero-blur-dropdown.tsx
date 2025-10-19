import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react"

export interface HeroDropdownOption {
  key: string
  label: string
  onClick?: () => void
  className?: string
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  href?: string
}

export interface HeroBlurDropdownProps {
  trigger?: React.ReactNode
  triggerLabel?: string
  options: HeroDropdownOption[]
  backdrop?: "transparent" | "opaque" | "blur"
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow"
  ariaLabel?: string
}

export function HeroBlurDropdown({
  trigger,
  triggerLabel = "Open Menu",
  options,
  backdrop = "blur",
  variant = "faded",
  ariaLabel = "Dropdown Actions",
}: HeroBlurDropdownProps) {
  return (
    <Dropdown backdrop={backdrop}>
      <DropdownTrigger>
        {trigger || <Button variant="bordered">{triggerLabel}</Button>}
      </DropdownTrigger>
      <DropdownMenu aria-label={ariaLabel} variant={variant}>
        {options.map((option) => (
          <DropdownItem
            key={option.key}
            className={option.className}
            color={option.color}
            onPress={option.onClick}
            href={option.href}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

// Pre-built example matching your requirement
export function SimpleBlurMenuDropdown() {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" variant="faded">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
