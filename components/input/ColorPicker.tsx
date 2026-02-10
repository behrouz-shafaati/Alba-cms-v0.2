'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import autoDark from './utils/autoDark'
import contrastLabel from './utils/contrastLabel'

export type ColorConfig = {
  light?: string | `token:${string}`
  dark?: string
  autoDark?: boolean
}

type Props = {
  value: ColorConfig
  onChange: (v: ColorConfig) => void
  tokens?: { label: string; value: string }[]
}

export default function ColorPicker({ value, onChange, tokens = [] }: Props) {
  const light = value.light as string | undefined
  // const dark = value.autoDark && light ? autoDark(light) : value.dark
  const dark = light ? autoDark(light) : value.dark

  const contrast = useMemo(() => {
    if (!light || light.startsWith('token:')) return null
    return contrastLabel(light)
  }, [light])

  return (
    <div className="space-y-4 rounded-lg  p-4">
      {/* Preview */}
      <div className="grid grid-cols-2 gap-2">
        <div
          className="h-16 rounded-md flex items-center justify-center text-sm"
          style={{ background: light || '#f3f4f6' }}
        >
          Light
        </div>
        <div
          className="h-16 rounded-md flex items-center justify-center text-sm"
          style={{ background: dark || '#111827', color: '#fff' }}
        >
          Dark
        </div>
      </div>

      {/* Contrast */}
      {contrast && (
        <div className={`text-sm ${contrast.color}`}>{contrast.label}</div>
      )}

      {/* Picker */}
      <div className="space-y-2">
        <Label>Color</Label>
        <Input
          type="color"
          value={light || '#ffffff'}
          onChange={(e) =>
            onChange({
              ...value,
              light: e.target.value,
              dark: autoDark(e.target.value),
            })
          }
        />
      </div>

      {/* Tokens */}
      {tokens.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tokens.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant="outline"
              onClick={() =>
                onChange({
                  ...value,
                  light: `token:${t.value}`,
                  dark: `token:${autoDark(t.value)}`,
                })
              }
            >
              {t.label}
            </Button>
          ))}
        </div>
      )}

      {/* Auto dark */}
      {/* <div className="flex items-center justify-between">
        <Label>Auto generate dark</Label>
        <Switch
          checked={value.autoDark ?? true}
          onCheckedChange={(v) =>
            onChange({
              ...value,
              autoDark: v,
            })
          }
        />
      </div> */}

      {/* Clear */}
      <Button
        variant="ghost"
        className="text-destructive"
        onClick={() => onChange({})}
      >
        حذف رنگ
      </Button>
    </div>
  )
}
