export const MenuBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    design: {
      type: 'string',
      title: 'طرح',
      enum: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
    activeTextColor: {
      type: 'object',
      title: 'رنگ لینک فعال',
      default: undefined,
      'x-field': 'ColorField',
    },
  },
}
