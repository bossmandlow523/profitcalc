import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleBlurMenuDropdown, HeroBlurDropdown, HeroDropdownOption } from '@/components/ui/hero-blur-dropdown'
import { Button } from '@heroui/react'
import { Settings, Download, Share2, Menu } from 'lucide-react'

export function HeroDropdownDemo() {
  const menuOptions: HeroDropdownOption[] = [
    { key: 'new', label: 'New file' },
    { key: 'copy', label: 'Copy link' },
    { key: 'edit', label: 'Edit file' },
    { key: 'delete', label: 'Delete file', color: 'danger' },
  ]

  const settingsOptions: HeroDropdownOption[] = [
    { key: 'profile', label: 'Profile Settings' },
    { key: 'account', label: 'Account Settings' },
    { key: 'theme', label: 'Theme Settings' },
    { key: 'logout', label: 'Logout', color: 'danger' },
  ]

  const exportOptions: HeroDropdownOption[] = [
    { key: 'csv', label: 'Export as CSV', onClick: () => console.log('CSV') },
    { key: 'excel', label: 'Export as Excel', onClick: () => console.log('Excel') },
    { key: 'json', label: 'Export as JSON', onClick: () => console.log('JSON') },
    { key: 'pdf', label: 'Export as PDF', onClick: () => console.log('PDF') },
  ]

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">HeroUI Blur Dropdown Components</h1>
        <p className="text-muted-foreground">
          Beautiful dropdowns with blur backdrop effect using HeroUI React
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Simple Blur Menu */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Simple Blur Menu</CardTitle>
            <CardDescription>Default blur backdrop dropdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleBlurMenuDropdown />
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`<SimpleBlurMenuDropdown />`}
            </pre>
          </CardContent>
        </Card>

        {/* Custom Options */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Custom Options</CardTitle>
            <CardDescription>With custom trigger and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroBlurDropdown
              triggerLabel="Options Menu"
              options={menuOptions}
              backdrop="blur"
              variant="faded"
            />
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`<HeroBlurDropdown
  triggerLabel="Options Menu"
  options={menuOptions}
  backdrop="blur"
/>`}
            </pre>
          </CardContent>
        </Card>

        {/* Icon Button Trigger */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Icon Trigger</CardTitle>
            <CardDescription>Custom button with icon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroBlurDropdown
              trigger={
                <Button isIconOnly variant="bordered" aria-label="Settings">
                  <Settings className="h-5 w-5" />
                </Button>
              }
              options={settingsOptions}
              backdrop="blur"
            />
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`<HeroBlurDropdown
  trigger={
    <Button isIconOnly>
      <Settings />
    </Button>
  }
  options={settingsOptions}
/>`}
            </pre>
          </CardContent>
        </Card>

        {/* Export Menu */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Export Menu</CardTitle>
            <CardDescription>With onClick handlers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroBlurDropdown
              trigger={
                <Button variant="flat" color="primary">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
              options={exportOptions}
              backdrop="blur"
              variant="faded"
            />
          </CardContent>
        </Card>

        {/* Opaque Backdrop */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Opaque Backdrop</CardTitle>
            <CardDescription>Without blur effect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroBlurDropdown
              triggerLabel="Opaque Menu"
              options={menuOptions}
              backdrop="opaque"
            />
          </CardContent>
        </Card>

        {/* Transparent Backdrop */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Transparent Backdrop</CardTitle>
            <CardDescription>No backdrop overlay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HeroBlurDropdown
              triggerLabel="Transparent"
              options={menuOptions}
              backdrop="transparent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Full Code Example */}
      <Card className="glass-card-strong">
        <CardHeader>
          <CardTitle>Complete Usage Example</CardTitle>
          <CardDescription>How to implement in your options calculator</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

export default function App() {
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
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
