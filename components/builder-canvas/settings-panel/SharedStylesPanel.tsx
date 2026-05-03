// پنل تنظیمات عمومی مثل padding, margin
import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import { uiSchema } from '../../rjsf/uiSchema'
import { buildUiSchemaFromX } from '@/components/rjsf/utils/buildUiSchemaFromX'

export const textColorSchema = {
  type: 'object',
  title: 'Text color',
  additionalProperties: true,
  'x-field': 'ColorField',
}
const cssSchema = {
  type: 'object',
  title: 'CSS',
  additionalProperties: true,
  'x-field': 'CssField',
}
export const backgroundColorSchema = {
  type: 'object',
  title: 'Background color',
  additionalProperties: true,
  'x-field': 'ColorField',
}
export const layoutSchema = {
  type: 'object',
  title: 'Layout',
  additionalProperties: true,
  'x-responsive': true,
  'x-field': 'LayoutField',
}
export const borderSchema = {
  type: 'object',
  title: 'Border',
  additionalProperties: true,
  'x-field': 'BorderField',
}

export const publicStylesSchema: any = {
  type: 'object',
  title: '',
  properties: {
    textColor: textColorSchema,
    backgroundColor: backgroundColorSchema,
    layout: layoutSchema,
    padding: {
      type: 'object',
      title: 'Padding',
      additionalProperties: true,
      'x-responsive': true,
      'x-field': 'FourSideBoxField',
    },
    margin: {
      type: 'object',
      title: 'Margin',
      additionalProperties: true,
      'x-responsive': true,
      'x-field': 'FourSideBoxField',
    },
    boxShadow: {
      type: 'object',
      title: 'سایه (Box Shadow)',
      properties: {
        color: {
          type: 'object',
          title: 'رنگ',
          additionalProperties: true,
        },
        x: {
          type: 'number',
          title: 'افقی (X)',
          default: undefined,
        },
        y: {
          type: 'number',
          title: 'عمودی (Y)',
          default: undefined,
        },
        blur: {
          type: 'number',
          title: 'محو شدگی (Blur)',
          default: undefined,
        },
        spread: {
          type: 'number',
          title: 'گستردگی (Spread)',
          default: undefined,
        },
        inset: {
          type: 'boolean',
          title: 'درونی باشد؟',
          default: false,
        },
      },
      required: ['color', 'x', 'y', 'blur', 'spread', 'inset'],
      'x-field': 'ShadowField',
    },
    border: borderSchema,
    borderRadius: {
      type: 'object',
      title: 'Border radius',
      additionalProperties: true,
      'x-responsive': true,
      'x-field': 'FourSideBoxField',
    },
    opacity: {
      type: 'number',
      title: 'Opacity',
      default: undefined,
      minimum: 0,
      maximum: 100,
      multipleOf: 1,
      'x-widget': 'SliderWidget',
    },
    visibility: {
      type: 'object',
      title: 'نمایش در دستگاه‌ها',
      properties: {
        desktop: { type: 'boolean', title: 'نمایش در دسکتاپ', default: true },
        tablet: { type: 'boolean', title: 'نمایش در تبلت', default: true },
        mobile: { type: 'boolean', title: 'نمایش در موبایل', default: true },
      },
      'x-field': 'ResponsiveVisibilityField',
    },
    css: cssSchema,
  },
}

export const PublicStylesForm = () => {
  const { selectedBlock, update } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  if (!selectedBlock) return null
  return (
    <>
      <TailwindForm
        key={`shared-styles-block-${selectedBlock.id}`} // باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={publicStylesSchema}
        // uiSchema={uiSchema}
        uiSchema={buildUiSchemaFromX(publicStylesSchema)}
        formData={selectedBlock.styles}
        validator={validator}
        onChange={(e) =>
          debouncedUpdate(selectedBlock.id, 'styles', e.formData)
        }
        showErrorList={false}
        omitExtraData={false}
        noHtml5Validate
        liveValidate
        widgets={{}} // می‌تونی در آینده کاستوم‌سازی کنی
        templates={{
          // FieldTemplate: CustomFieldTemplate,
          //  حذف دکمه Submit
          ButtonTemplates: {
            SubmitButton: () => null,
          },
        }}
        transformErrors={() => []}
      />
    </>
  )
}
