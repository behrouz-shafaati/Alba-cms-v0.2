'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Label } from '../ui/label'
import { ICON_NAMES } from '@/lib/icon/icon-names'
import { cn } from '@/lib/utils'
import FileUpload from './file-upload'
import IconRender from '../builder-canvas/components/IconRender'
import DynamicLucideIcon from '../builder-canvas/components/DynamicLucideIcon'

export type IconValue = { lucide: string; file: string }

type Props = {
  name: string
  title?: string
  defaultValue?: IconValue
  onChange?: (value: IconValue) => void
}

export default function IconPicker({
  name,
  title = '',
  defaultValue = { lucide: '', file: null },
  onChange,
}: Props) {
  // const [value, setValue] = React.useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [value, setValue] = useState(defaultValue)

  const filtered = useMemo(() => {
    if (!search) return ICON_NAMES
    const q = search.toLowerCase()
    return ICON_NAMES.filter((name) => name.toLowerCase().includes(q))
  }, [search])

  const update = (key: 'lucide' | 'file', val: any) => {
    const updatedValue = { ...value }
    updatedValue[key] = val
    setValue(updatedValue)
    onChange?.(updatedValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={JSON.stringify(value) || ''} />
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex justify-between"
          >
            <span className="flex items-center gap-2">
              <IconRender icon={value} size={20} />
              <span>{value.lucide || 'انتخاب آیکون'}</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 h-96 p-2 overflow-y-auto">
          <FileUpload
            name="image"
            title={``}
            defaultValues={value?.file || null}
            maxFiles={1}
            onChange={(f) => update('file', { id: f.id, srcSmall: f.srcSmall })}
            allowedFileTypes={['image_svg']}
          />
          <Input
            placeholder="جستجوی آیکون..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="my-2"
          />
          <div className="h-72 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    update('lucide', name)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-md border hover:bg-muted transition',
                    value.lucide === name && 'bg-muted border-primary',
                  )}
                  title={name}
                >
                  {/* <DynamicLucideIcon name={name} size={20} /> */}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
