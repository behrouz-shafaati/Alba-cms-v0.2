import { FieldProps } from '@rjsf/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'

export const ResponsiveSelectField = (props: FieldProps) => {
  const { device } = useBuilderStore()
  const { formData, onChange, schema, fieldPathId } = props
  const value = formData?.[device]

  if (!schema.enum) return <i>Set enum</i>

  const options = schema.enum.map((value) => ({ label: value, value }))
  console.log('#243 fieldPathId:', fieldPathId)
  console.log('#243 formData:', formData)
  const update = (val: any) => {
    if (typeof formData == 'object')
      onChange({ ...formData, [device]: val }, fieldPathId.path)
    else onChange({ [device]: val }, fieldPathId.path)
  }
  return (
    <Select
      value={value}
      onValueChange={(value: string) => {
        update(value)
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={value || schema?.default}
          className="text-sm font-medium text-muted-foreground"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm font-medium text-muted-foreground"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
