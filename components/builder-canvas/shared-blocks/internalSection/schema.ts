import { styleSchema } from '@/components/rjsf/schema/styleSchema '

const blockSchema = {
  type: 'object',
  properties: {
    sticky: {
      type: 'boolean',
      title: 'Sticky',
      default: true,
    },
    ...styleSchema.properties,
  },
}

export default blockSchema
