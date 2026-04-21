'use client'

import IconPicker from '@/components/input/IconPicker'
import { WidgetProps } from '@rjsf/utils'

export default function IconPickerField({ value, onChange }: WidgetProps) {
  return <IconPicker name="" defaultValue={value} onChange={onChange} />
}
