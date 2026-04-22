'use client'

import ColorPicker from '@/components/input/ColorPickerPopover'

export function ColorWidget({ value, onChange }: any) {
  return (
    <ColorPicker
      defaultValue={value}
      onChange={(c: string) => {
        console.log('#234234 color changed value in widget:', c)
        onChange(c)
      }}
    />
  )
}
