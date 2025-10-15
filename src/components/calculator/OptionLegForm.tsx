import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { OptionType, Position } from '@/lib/types';
import type { OptionLegInput } from '@/lib/types';
import { Plus } from 'lucide-react';

export function OptionLegForm() {
  const { addLeg } = useCalculatorStore();
  const [formData, setFormData] = useState<OptionLegInput>({
    optionType: 'call' as OptionType,
    position: 'long' as Position,
    strikePrice: 0,
    premium: 0,
    quantity: 1,
    expiryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeg(formData);
    // Reset form
    setFormData({
      ...formData,
      strikePrice: 0,
      premium: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Option Leg</CardTitle>
        <CardDescription>
          Configure and add an option leg to your strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="option-type">Option Type</Label>
              <Select
                value={formData.optionType}
                onValueChange={(value) =>
                  setFormData({ ...formData, optionType: value as OptionType })
                }
              >
                <SelectTrigger id="option-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="put">Put</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) =>
                  setFormData({ ...formData, position: value as Position })
                }
              >
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long (Buy)</SelectItem>
                  <SelectItem value="short">Short (Sell)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strike">Strike Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="strike"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.strikePrice || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, strikePrice: Number(e.target.value) })
                  }
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium">Premium (per share)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="premium"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.premium || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, premium: Number(e.target.value) })
                  }
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (contracts)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                placeholder="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration Date</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Leg
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
