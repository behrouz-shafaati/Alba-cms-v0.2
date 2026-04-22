import { useState, useEffect } from 'react'
import { FieldProps } from '@rjsf/utils'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'

const options = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
  { label: 'vw', value: 'vw' },
  { label: 'vh', value: 'vh' },
]

export const FourSideBoxField = (props: FieldProps) => {
  const { device } = useBuilderStore()
  const [linked, setLinked] = useState(true)
  const { formData, onChange, schema } = props
  const value = formData?.[device]
  const [unit, setUnit] = useState(formData?.[device]?.unit || 'px')

  const update = (key: string, val: any) => {
    let newValues
    if (val) {
      if (linked) {
        newValues = { top: val, right: val, bottom: val, left: val, unit }
      } else {
        newValues = { ...formData?.[device], [key]: val, unit }
      }
      console.log(
        'value to be set #234098 { ...formData, [device]: newValues }:',
        { ...formData, [device]: newValues },
      )
      onChange({ ...formData, [device]: newValues }, [props.name])
    } else {
      onChange({ ...formData, [device]: { value: '' } }, [props.name])
    }
  }

  useEffect(() => {
    const newValues = { ...formData?.[device], unit }
    onChange({ ...formData, [device]: newValues }, [props.name])
  }, [unit])

  return (
    <div className="flex rounded-md overflow-hidden">
      {['left', 'bottom', 'top', 'right'].map((key) => {
        return (
          <div key={key} className="flex flex-col gap-1 text-center">
            <input
              autocomplete="off"
              className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none',
                'border text-sm px-1!',
              )}
              value={Number(value?.[key])}
              type="number"
              name={key}
              onChange={(e) => update(key, e.target.value)}
            />
            <span className="text-xs text-gray-400">{key}</span>
          </div>
        )
      })}
      <Button
        type="button"
        variant="ghost"
        className={cn(
          'rounded-none px-1! bg-transparent',
          linked ? 'text-blue-500' : 'text-gray-400',
        )}
        onClick={() => setLinked(!linked)}
      >
        <Link
          size={18}
          className={
            linked
              ? 'rotate-45 transition-transform'
              : 'rotate-0 transition-transform'
          }
        />
      </Button>
      <Select
        value={formData?.[device]?.unit || 'px'}
        onValueChange={(value: string) => {
          setUnit(value)
        }}
      >
        <SelectTrigger className="border-none rounded-none outline-none text-[10px]">
          <SelectValue className="w-12" placeholder={unit} />
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
