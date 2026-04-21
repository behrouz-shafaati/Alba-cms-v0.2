'use client'

import { Smartphone, Tablet, Monitor } from 'lucide-react'
import clsx from 'clsx'
import Select from '@/components/input/select'
import ColorPickerPopover from '@/components/input/ColorPickerPopover'
import NumberInput from '@/components/input/number'

type Props = {
  value: any
  onChange: (value: any) => void
}

const BORDERS = [
  { key: 'top', icon: Smartphone, label: 'top' },
  { key: 'right', icon: Tablet, label: 'right' },
  { key: 'bottom', icon: Monitor, label: 'bottom' },
  { key: 'left', icon: Monitor, label: 'left' },
]

const borderType = [
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'inset',
  'groove',
  'outset',
  'ridge',
]

export default function BorderField({ value = {}, onChange }: Props) {
  // مقدار اولیه
  const defaultValue = {
    color: { light: {}, dark: {} },
    top: 'none',
    right: 'none',
    bottom: 'none',
    left: 'none',
    width: 1,
  }

  const data = { ...defaultValue, ...(value || {}) }

  const update = (key: string, val: any) => {
    const newData = { ...data, [key]: val }
    onChange(newData)
  }

  const borderTypeOptions = borderType.map((t) => ({ label: t, value: t }))

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Select
          className="w-full"
          key="top"
          name="top"
          title="Top"
          placeholder="Top"
          defaultValue={value?.['top']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('top', val)
          }}
        />
        <Select
          className="w-full"
          key="right"
          name="right"
          title="Right"
          placeholder="Right"
          defaultValue={value?.['right']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('right', val)
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          className="w-full"
          key="bottom"
          name="bottom"
          title="Bottom"
          placeholder="Bottom"
          defaultValue={value?.['bottom']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('bottom', val)
          }}
        />
        <Select
          className="w-full"
          key="left"
          name="left"
          title="Left"
          placeholder="Left"
          defaultValue={value?.['left']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('left', val)
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <NumberInput
          name="width"
          title="Width"
          defaultValue={data?.width}
          onChange={(e: any) => update('width', e.target.value)}
        />
        <ColorPickerPopover
          defaultValue={data?.color}
          onChange={(c: string) => update('color', c)}
        />
      </div>
    </div>
  )
}
