'use client'

import IconPicker from '@/components/input/IconPicker'
import { FieldProps } from '@rjsf/utils'

export default function IconPickerField(props: FieldProps) {
  const { formData, onChange, fieldPathId } = props
  return (
    <IconPicker
      name=""
      defaultValue={formData}
      onChange={(val) => onChange(val, fieldPathId.path)}
    />
  )
}
