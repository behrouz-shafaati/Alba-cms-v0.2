export const schema = {
  title: 'تنظیمات کارت',
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'عنوان',
    },
    subtitle: {
      type: 'string',
      title: 'زیر عنوان',
    },
    href: {
      type: 'string',
      title: 'لینک',
      default: '',
    },
    design: {
      type: 'string',
      title: 'نوع',
      enum: ['default', 'd1'],
      default: 'default',
    },
    alignItems: {
      type: 'string',
      title: 'چینش افقی',
      enum: ['start', 'center', 'end'],
      default: 'center',
    },
    icon: {
      type: 'string',
      title: 'آیکون',
      default: undefined,
      'x-field': 'IconPickerField',
    },
    iconColor: {
      type: 'object',
      title: 'رنگ آیکون',
      default: undefined,
      'x-field': 'ColorField',
    },
    iconBgColor: {
      type: 'object',
      title: 'رنگ پشت آیکون',
      default: undefined,
      'x-field': 'ColorField',
    },
    required: ['href'],
  },
}
