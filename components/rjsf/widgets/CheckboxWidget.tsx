'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function CheckboxWidget({ value, onChange, label }: any) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={label} checked={!!value} onCheckedChange={onChange} />
      <Label htmlFor={label}>{label}</Label>
    </div>
  )
}
