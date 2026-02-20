'use client'

import { WidgetProps } from '@rjsf/utils'
import { Smartphone, Tablet, Monitor } from 'lucide-react'
import clsx from 'clsx'

const DEVICES = [
  { key: 'mobile', icon: Smartphone, label: 'موبایل' },
  { key: 'tablet', icon: Tablet, label: 'تبلت' },
  { key: 'desktop', icon: Monitor, label: 'دسکتاپ' },
]

export default function ResponsiveVisibilityField({
  value = {},
  onChange,
}: WidgetProps) {
  const toggle = (device: string) => {
    onChange({
      ...value,
      [device]: !value?.[device],
    })
  }

  return (
    <div className="flex gap-2">
      {DEVICES.map(({ key, icon: Icon, label }) => {
        const active = value?.[key]

        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(key)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1',
              'w-20 h-20 rounded-xl border transition',
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-muted text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
