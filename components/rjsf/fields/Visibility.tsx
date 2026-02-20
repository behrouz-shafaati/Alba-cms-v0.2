'use client'

import NumberInput from '@/components/input/number'
import { MoveHorizontal, MoveVertical } from 'lucide-react'

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

const LayoutField = ({ value, onChange }: WidgetProps) => {
  // مقدار اولیه
  const defaultValue = {}

  const shadow = { ...defaultValue, ...(value || {}) }

  const update = (key: string, val: any) => {
    const newShadow = { ...shadow, [key]: val }
    onChange(newShadow)
  }

  return (
    <div className="flex gap-2 space-y-2">
      <NumberInput
        type="number"
        defaultValue={shadow?.width}
        onChange={(e) => update('width', parseInt(e.target.value))}
        icon={<MoveHorizontal className="w-4 h-4" />}
        placeholder="Width"
      />
      <NumberInput
        type="number"
        defaultValue={shadow?.height}
        onChange={(e) => update('height', parseInt(e.target.value))}
        icon={<MoveVertical className="w-4 h-4" />}
        placeholder="Height"
      />
    </div>
  )
}

export default LayoutField
