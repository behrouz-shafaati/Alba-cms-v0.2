export const schema = {
  title: 'تنظیمات آیکون',
  type: 'object',
  properties: {
    href: {
      type: 'string',
      title: 'لینک',
      default: '',
    },
    icon: {
      type: 'string',
      title: 'آیکون',
      default: undefined,
      'x-field': 'IconPickerField',
    },
    iconColor: {
      type: 'string',
      title: 'رنگ آیکون',
      default: undefined,
      'x-field': 'ColorField',
    },
  },
}
