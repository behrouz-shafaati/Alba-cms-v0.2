import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const options = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
]

export default function ResponsiveNumberField(props) {
  const { device } = useBuilderStore()
  const { formData, onChange } = props

  console.log('#@23432=============>4 formData:', formData)
  const [value, setValue] = useState(formData?.[device]?.value || '')
  const [unit, setUnit] = useState(formData?.[device]?.unit || 'px')

  useEffect(() => {
    if (value != '')
      onChange(
        {
          ...formData,
          [device]: { value, unit },
        },
        [props.name],
      )
    else
      onChange(
        {
          ...formData,
          [device]: { value: '' },
        },
        [props.name],
      )
  }, [value, unit])
  useEffect(() => {
    setValue(formData?.[device]?.value || '')
    setUnit(formData?.[device]?.unit || 'px')
  }, [device])
  console.log('#2423 value: value')
  return (
    <div className="flex border rounded-md">
      <input
        type="number"
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none',
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Select
        value={unit}
        onValueChange={(value: string) => {
          setUnit(value)
        }}
      >
        <SelectTrigger className="border-none rounded-none outline-none">
          <SelectValue placeholder={unit} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
