// پنل تنظیمات عمومی مثل padding, margin
import validator from '@rjsf/validator-ajv8'
import { useBuilderStore } from '../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import { TailwindForm } from '../../rjsf/shadcn-theme'
import { uiSchema } from '../../rjsf/uiSchema'

export const publicStylesSchema0 = {
  type: 'object',
  title: '',
  properties: {
    // display: {
    //   type: 'string',
    //   title: 'display',
    //   enum: ['inline-block', 'grid', 'block'],
    //   default: 'inline-block',
    // },

    boxShadow: {
      type: 'object',
      title: 'سایه (Box Shadow)',
      properties: {
        color: {
          type: 'string',
          title: 'رنگ',
          default: undefined,
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
    },

    manual: {
      type: 'string',
      title: 'style',
      default: '',
    },
  },
}
export const backgroundColorSchema = {
  type: 'object',
  title: 'Background color',
  additionalProperties: true,
}

export const publicStylesSchema = {
  type: 'object',
  title: '',
  properties: {
    backgroundColor: backgroundColorSchema,
    width: {
      type: 'number',
      title: 'عرض',
      default: undefined,
    },
    height: {
      type: 'number',
      title: 'ارتفاع',
      default: undefined,
    },
    padding: {
      type: 'object',
      title: 'Padding',
      properties: {
        top: { type: 'number', title: 'بالا', default: undefined },
        right: { type: 'number', title: 'راست', default: undefined },
        bottom: { type: 'number', title: 'پایین', default: undefined },
        left: { type: 'number', title: 'چپ', default: undefined },
      },
    },
    margin: {
      type: 'object',
      title: 'Margin',
      properties: {
        top: { type: 'number', title: 'بالا', default: undefined },
        right: { type: 'number', title: 'راست', default: undefined },
        bottom: { type: 'number', title: 'پایین', default: undefined },
        left: { type: 'number', title: 'چپ', default: undefined },
      },
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
    },
    border: {
      type: 'string',
      title: 'Border',
      enum: [
        'none',
        'solid',
        'dashed',
        'dotted',
        'double',
        'inset',
        'groove',
        'outset',
        'ridge',
      ],
      default: 'none',
    },
    borderRadius: {
      type: 'object',
      title: 'Border radius',
      properties: {
        top: { type: 'number', title: 'بالا', default: undefined },
        right: { type: 'number', title: 'راست', default: undefined },
        bottom: { type: 'number', title: 'پایین', default: undefined },
        left: { type: 'number', title: 'چپ', default: undefined },
      },
    },
    opacity: {
      type: 'number',
      title: 'Opacity',
      default: undefined,
      minimum: 0,
      maximum: 100,
      multipleOf: 1,
    },
    visibility: {
      type: 'object',
      title: 'نمایش در دستگاه‌ها',
      properties: {
        desktop: { type: 'boolean', title: 'نمایش در دسکتاپ', default: true },
        tablet: { type: 'boolean', title: 'نمایش در تبلت', default: true },
        mobile: { type: 'boolean', title: 'نمایش در موبایل', default: true },
      },
    },
  },
}

export const PublicStylesForm = () => {
  const { selectedBlock, update } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400,
  )

  if (!selectedBlock) return null
  console.log('#234 selectedBlock.styles: ', selectedBlock.styles)
  return (
    <>
      <TailwindForm
        key={`shared-styles-block-${selectedBlock.id}`} // باعث میشه فرم کاملاً ری‌ست و رندر بشه
        schema={publicStylesSchema}
        uiSchema={uiSchema}
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
          //  حذف دکمه Submit
          ButtonTemplates: {
            SubmitButton: () => null,
          },
        }}
      />
    </>
  )
}
