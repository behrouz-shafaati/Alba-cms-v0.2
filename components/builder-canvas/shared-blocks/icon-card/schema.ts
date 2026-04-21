export const schema = {
  title: 'تنظیمات دکمه',
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
      enum: ['default'],
      default: 'default',
    },
    icon: {
      type: 'string',
      title: 'آیکون',
      default: undefined,
    },
    iconColor: {
      type: 'string',
      title: 'رنگ آیکون',
      default: undefined,
    },
    required: ['href'],
  },
}
