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
  { key: 't', icon: Smartphone, label: 'top' },
  { key: 'r', icon: Tablet, label: 'right' },
  { key: 'b', icon: Monitor, label: 'bottom' },
  { key: 'l', icon: Monitor, label: 'left' },
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
    t: 'none',
    r: 'none',
    b: 'none',
    l: 'none',
    w: 1,
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
          defaultValue={value?.['t']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('t', val)
          }}
        />
        <Select
          className="w-full"
          key="right"
          name="right"
          title="Right"
          placeholder="Right"
          defaultValue={value?.['r']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('r', val)
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
          defaultValue={value?.['b']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('b', val)
          }}
        />
        <Select
          className="w-full"
          key="left"
          name="left"
          title="Left"
          placeholder="Left"
          defaultValue={value?.['l']}
          options={borderTypeOptions}
          onChange={(val: string) => {
            update('l', val)
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <NumberInput
          name="width"
          title="Width"
          defaultValue={data?.w}
          onChange={(e: any) => update('w', e.target.value)}
        />
        <ColorPickerPopover
          defaultValue={data?.color}
          onChange={(c: string) => update('color', c)}
        />
      </div>
    </div>
  )
}
