export const BlockSchema = {
  title: 'تنظیمات خط',
  type: 'object',
  properties: {
    orientation: {
      type: 'string',
      title: 'جهت',
      enum: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
    label: {
      type: 'string',
      title: 'متن',
      default: '',
    },
    dashed: {
      type: 'boolean',
      title: 'خط چین',
      default: false,
    },
    thickness: {
      type: 'number',
      title: 'اندازه',
      default: 1,
    },
  },
}
