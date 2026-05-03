export const contentBlockSchema = {
  title: '',
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string',
      default: '',
    },
    accordion: {
      title: 'Accordion',
      type: 'boolean',
      default: true,
    },
    listOpen: {
      title: 'List open',
      type: 'boolean',
      default: false,
    },
    activeTextColor: {
      type: 'object',
      title: 'رنگ لینک فعال',
      default: undefined,
      'x-field': 'ColorField',
    },
  },
}
