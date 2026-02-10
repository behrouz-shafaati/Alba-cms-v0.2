'use client'

import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'
import readableTextColor from './utils/readableTextColor'

type Mode = 'default' | 'hover' | 'active'
type Theme = 'light' | 'dark'

type Props = {
  defaultValue: any
  onChange: (val: any) => void
}

export default function ColorPickerPopover({
  defaultValue = { light: {}, dark: {} },
  onChange,
}: Props) {
  const [value, setValue] = useState(normalizeColorValue(defaultValue))
  const [mode, setMode] = useState<Mode>('default')
  const [theme, setTheme] = useState<Theme | null>(null)

  const getColor = (t: Theme) => value?.[t]?.[mode]

  function updateColor(color: string) {
    const next = structuredClone(value || { light: {}, dark: {} })

    if (theme === 'light') {
      next.light[mode] = color
      if (!next.dark[mode]) next.dark[mode] = color
    }

    if (theme === 'dark') {
      next.dark[mode] = color
      if (!next.light[mode]) next.light[mode] = color
    }

    setValue(next)
    onChange(next)
  }

  const currentColor = theme ? getColor(theme) : ''

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">🎨 انتخاب رنگ</Button>
      </PopoverTrigger>

      <PopoverContent className="w-[360px] space-y-4">
        {/* Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="hover">Hover</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Light / Dark */}
        <div className="flex gap-2">
          {(['light', 'dark'] as Theme[]).map((t) => {
            const bg = getColor(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={clsx(
                  'flex-1 rounded-md border px-3 py-2 text-sm transition',
                  theme === t && 'ring-2 ring-primary',
                )}
                style={{
                  background: bg || 'transparent',
                  color: bg ? readableTextColor(bg) : undefined,
                }}
              >
                {t === 'light' ? 'Light' : 'Dark'}
              </button>
            )
          })}
        </div>

        {/* Picker + Input */}
        {theme && (
          <>
            <HexColorPicker
              color={currentColor || '#ffffff'}
              onChange={updateColor}
              className="w-full"
            />

            {/* Hex Input */}
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded border"
                style={{ background: currentColor || '#fff' }}
              />

              <Input
                value={currentColor || ''}
                placeholder="#ffffff"
                className="font-mono"
                onChange={(e) => {
                  let v = e.target.value.trim()

                  if (!v.startsWith('#')) v = '#' + v

                  // اعتبارسنجی ساده hex
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    updateColor(v)
                  }
                }}
              />
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

function normalizeColorValue(value: any) {
  if (
    !value ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  ) {
    return {
      light: {},
      dark: {},
    }
  }

  return {
    light: value.light ?? {},
    dark: value.dark ?? {},
  }
}
