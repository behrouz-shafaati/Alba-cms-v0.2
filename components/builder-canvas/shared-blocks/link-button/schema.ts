export const buttonBlockSchema = {
  title: 'تنظیمات دکمه',
  type: 'object',
  properties: {
    label: {
      type: 'string',
      title: 'برچسب دکمه',
    },
    href: {
      type: 'string',
      title: 'لینک',
      default: '',
    },
    variant: {
      type: 'string',
      title: 'نوع',
      enum: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link'],
      default: 'default',
    },
    size: {
      type: 'string',
      title: 'اندازه',
      enum: ['default', 'sm', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
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
    iconPlace: {
      type: 'string',
      title: 'محل آیکون',
      enum: ['before', 'after'],
      default: 'before',
    },
    required: ['href'],
  },
}
