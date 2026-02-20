export const uiSchema = {
  color: {
    'ui:widget': 'ColorWidget',
  },
  backgroundColor: {
    'ui:field': 'BackgroundColorField',
  },
  layout: {
    'ui:field': 'LayoutField',
  },
  textColor: {
    'ui:widget': 'TailwindTextColorPickerWidget',
  },
  iconColor: {
    'ui:widget': 'TailwindTextColorPickerWidget',
  },
  isPublished: {
    'ui:widget': 'CheckboxWidget',
  },
  description: {
    'ui:widget': 'TextareaWidget',
  },
  quantity: {
    'ui:widget': 'NumberWidget',
  },
  opacity: {
    'ui:widget': 'SliderWidget',
  },
  padding: {
    'ui:field': 'PaddingField',
  },
  margin: {
    'ui:field': 'MarginField',
  },
  borderRadius: {
    'ui:field': 'BorderRadiusField',
  },
  boxShadow: {
    'ui:field': 'ShadowField',
  },
  icon: {
    'ui:widget': 'IconPickerWidget',
  },
  className: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      placeholder: 'مثلاً: flex gap-4 justify-center items-center',
    },
  },
  visibility: {
    'ui:field': 'ResponsiveVisibilityField',
  },
}
