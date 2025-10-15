import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleMenuDropdown, OptionsActionDropdown, StrikePriceDropdown } from '@/components/calculator/OptionsActionDropdown'
import { BlurDropdown } from '@/components/ui/blur-dropdown'
import { Button } from '@/components/ui/button'
import { Settings, Download, Share2 } from 'lucide-react'

export function BlurDropdownDemo() {
  // Example strike prices data
  const sampleStrikes = [
    { strike: 150, bid: 5.2, mid: 5.5, ask: 5.8 },
    { strike: 155, bid: 3.1, mid: 3.4, ask: 3.7 },
    { strike: 160, bid: 1.8, mid: 2.0, ask: 2.2 },
    { strike: 165, bid: 0.9, mid: 1.0, ask: 1.1 },
    { strike: 170, bid: 0.4, mid: 0.5, ask: 0.6 },
  ]

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Blur Dropdown Components</h1>
        <p className="text-muted-foreground">
          Reusable dropdown menus with blur backdrop effect for the options calculator
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Menu Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Basic Menu</CardTitle>
            <CardDescription>Simple dropdown with blur backdrop</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleMenuDropdown />
          </CardContent>
        </Card>

        {/* Options Action Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Action Selector</CardTitle>
            <CardDescription>Buy/Write/Short option selector</CardDescription>
          </CardHeader>
          <CardContent>
            <OptionsActionDropdown
              variant="Buy"
              onSelect={(key) => console.log('Selected:', key)}
            />
          </CardContent>
        </Card>

        {/* Strike Price Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Strike Price</CardTitle>
            <CardDescription>Select strike with pricing info</CardDescription>
          </CardHeader>
          <CardContent>
            <StrikePriceDropdown
              strikes={sampleStrikes}
              onSelect={(strike) => console.log('Selected strike:', strike)}
            />
          </CardContent>
        </Card>

        {/* Custom Icon Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Settings Menu</CardTitle>
            <CardDescription>Custom trigger with icon</CardDescription>
          </CardHeader>
          <CardContent>
            <BlurDropdown
              trigger={
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              }
              options={[
                { key: 'profile', label: 'Profile Settings' },
                { key: 'account', label: 'Account Settings' },
                { key: 'theme', label: 'Theme Settings' },
                { key: 'logout', label: 'Logout', color: 'danger' },
              ]}
              align="end"
            />
          </CardContent>
        </Card>

        {/* Export Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Export in different formats</CardDescription>
          </CardHeader>
          <CardContent>
            <BlurDropdown
              trigger={
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
              options={[
                { key: 'csv', label: 'Export as CSV' },
                { key: 'excel', label: 'Export as Excel' },
                { key: 'json', label: 'Export as JSON' },
                { key: 'pdf', label: 'Export as PDF' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Share Dropdown */}
        <Card className="glass-card-strong">
          <CardHeader>
            <CardTitle>Share Strategy</CardTitle>
            <CardDescription>Share your options strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <BlurDropdown
              trigger={
                <Button className="w-full bg-primary/20 hover:bg-primary/30">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              }
              options={[
                { key: 'link', label: 'Copy Link' },
                { key: 'email', label: 'Email' },
                { key: 'twitter', label: 'Share on Twitter' },
                { key: 'download', label: 'Download Image' },
              ]}
              menuClassName="w-56"
            />
          </CardContent>
        </Card>
      </div>

      {/* Code Examples */}
      <Card className="glass-card-strong">
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">1. Simple Dropdown</h3>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<BlurDropdown
  triggerLabel="Open Menu"
  triggerVariant="bordered"
  options={[
    { key: 'new', label: 'New file' },
    { key: 'delete', label: 'Delete', color: 'danger' }
  ]}
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">2. Custom Trigger</h3>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<BlurDropdown
  trigger={<Button>Custom Button</Button>}
  options={options}
  align="end"
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">3. With Actions</h3>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`<BlurDropdown
  options={[
    {
      key: 'save',
      label: 'Save',
      onClick: () => handleSave()
    }
  ]}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
