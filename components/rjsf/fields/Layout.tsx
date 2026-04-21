'use client'

import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import NumberInput from '@/components/input/number'
import { MoveHorizontal, MoveVertical } from 'lucide-react'
import { useState } from 'react'
import ResponsiveNumberField from './ResponsiveNumberField'
import { FieldProps } from '@rjsf/utils'

type Value = {
  width: number
  height: number
}

const options = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
]

const LayoutField = (props: FieldProps) => {
  const { device } = useBuilderStore()
  const { formData, onChange, schema } = props
  console.log('#@234324 schema:', schema)
  console.log('#@23432==>3 layout props:', props)
  console.log('#@23432==>3 layout formData:', formData)

  const update = (key: string, val: any) => {
    const newLayout = { layout: { ...formData, [key]: val } }
    onChange(newLayout)
  }

  return (
    <div className="flex gap-2 space-y-2">
      <ResponsiveNumberField
        onChange={(value) => update('width', value)}
        formData={formData?.width}
      />
      <ResponsiveNumberField
        onChange={(value) => update('height', value)}
        formData={formData?.height}
      />
      {/* <NumberInput
        type="number"
        defaultValue={layout?.width}
        onChange={(e) => update('width', parseInt(e.target.value))}
        icon={<MoveHorizontal className="w-4 h-4" />}
        placeholder="Width"
      />
      <NumberInput
        type="number"
        defaultValue={layout?.height}
        onChange={(e) => update('height', parseInt(e.target.value))}
        icon={<MoveVertical className="w-4 h-4" />}
        placeholder="Height"
      /> */}
    </div>
  )
}

export default LayoutField
