'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import GridPreview from './GridPreview'

const columnOptions = [
  {
    label: '12',
    value: '12',
  },

  {
    label: '6-6',
    value: '6-6',
  },

  {
    label: '4-8',
    value: '4-8',
  },
  {
    label: '3-9',
    value: '3-9',
  },
  {
    label: '9-3',
    value: '9-3',
  },
  {
    label: '8-4',
    value: '8-4',
  },

  {
    label: '2-2-8',
    value: '2-2-8',
  },
  {
    label: '8-2-2',
    value: '8-2-2',
  },
  {
    label: '4-4-4',
    value: '4-4-4',
  },
  {
    label: '3-6-3',
    value: '3-6-3',
  },
  {
    label: '2-8-2',
    value: '2-8-2',
  },
  {
    label: '1-10-1',
    value: '1-10-1',
  },
  {
    label: '3-3-3-3',
    value: '3-3-3-3',
  },
]

type Props = {
  value?: string
  onChange: (value: string) => void
}

function parseColumns(value: string): number[] {
  return value.split('-').map(Number)
}

export default function ColumnLayoutCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // ✅ close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (
    <div ref={ref} className="relative w-[260px]">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <GridPreview value={value} />
              <span className="text-xs text-muted-foreground">{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select layout</span>
          )}
        </div>

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-popover p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {columnOptions.map((opt) => {
              const cols = parseColumns(opt.value)
              const isActive = opt.value === value

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={clsx(
                    'rounded-md border p-2 transition focus:outline-none',
                    isActive
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-muted/50'
                  )}
                >
                  {/* Visual Grid */}
                  <div className="flex h-8 w-full overflow-hidden rounded bg-muted">
                    {cols.map((c, i) => (
                      <div
                        key={i}
                        className={clsx(
                          'h-full border-r last:border-r-0',
                          isActive
                            ? 'bg-primary/70'
                            : 'bg-foreground/80 dark:bg-foreground/60'
                        )}
                        style={{ width: `${(c / 12) * 100}%` }}
                      />
                    ))}
                  </div>

                  <div className="mt-1 text-center text-xs text-muted-foreground">
                    {opt.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
