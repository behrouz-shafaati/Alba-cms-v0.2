'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import ColorPickerPopover from '@/components/input/ColorPickerPopover'
import NumberInput from '@/components/input/number'
import { Droplets, Expand } from 'lucide-react'

type WidgetProps = {
  value: {
    color: string
    x: number
    y: number
    blur: number
    spread: number
    inset: boolean
  }
  onChange: (value: any) => void
}

export const ShadowWidget = ({ value, onChange }: WidgetProps) => {
  // مقدار اولیه
  const defaultValue = {
    color: { light: {}, dark: {} },
    x: 0,
    y: 0,
    blur: 0,
    spread: 0,
    inset: false,
  }

  const shadow = { ...defaultValue, ...(value || {}) }

  const update = (key: string, val: any) => {
    const newShadow = { ...shadow, [key]: val }
    onChange(newShadow)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <NumberInput
          value={shadow.x}
          onChange={(e) => update('x', parseInt(e.target.value))}
          icon={
            <span className=" flex justify-center items-center text-center h-[18px]">
              X
            </span>
          }
        />
        <NumberInput
          value={shadow.y}
          onChange={(e) => update('y', parseInt(e.target.value))}
          icon={
            <span className=" flex justify-center items-center text-center h-[18px]">
              Y
            </span>
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <NumberInput
          value={shadow.blur}
          onChange={(e) => update('blur', parseInt(e.target.value))}
          icon={<Droplets className="w-4 h-4" />}
          placeholder="Blur"
        />
        <NumberInput
          value={shadow.spread}
          onChange={(e) => update('spread', parseInt(e.target.value))}
          icon={<Expand className="w-4 h-4" />}
          placeholder="Spread"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <ColorPickerPopover
          defaultValue={shadow.color}
          onChange={(c: string) => update('color', c)}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="inset"
            checked={shadow.inset}
            onCheckedChange={(c) => update('inset', !!c)}
          />
          <Label htmlFor="inset">سایه داخلی</Label>
        </div>
      </div>
    </div>
  )
}
