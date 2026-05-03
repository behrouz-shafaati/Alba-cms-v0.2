import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import React from 'react'

export default function FlexSettingsField(props) {
  const { device } = useBuilderStore()
  const { formData, registry } = props

  const { SchemaField } = registry.fields

  const flexSchema = {
    type: 'object',
    properties: {
      flexDirection: {
        type: 'string',
        title: 'flex-direction',
        enum: ['row', 'row-reverse', 'column', 'column-reverse'],
        default: 'row',
      },
      justifyContent: {
        type: 'string',
        title: 'justify-content',
        enum: [
          'start',
          'end',
          'center',
          'space-between',
          'space-around',
          'space-evenly',
        ],
        default: 'start',
      },
      alignItems: {
        type: 'string',
        title: 'align-items',
        enum: ['stretch', 'center', 'start', 'end'],
        default: 'stretch',
      },
    },
  }

  return <SchemaField {...props} schema={flexSchema} formData={formData} />
}
