import { withTheme, FormProps } from '@rjsf/core'
import { FieldProps } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { TextWidget } from './widgets/TextWidget'
import { SelectWidget } from './widgets/SelectWidget'
import { ColorWidget } from './widgets/ColorWidget'
import { TailwindBgColorWidget } from './widgets/TailwindBgColorWidget'
import { CheckboxWidget } from './widgets/CheckboxWidget'
import { TextareaWidget } from './widgets/TextareaWidget'
import { NumberWidget } from './widgets/NumberWidget'
import { SliderWidget } from './widgets/SliderWidget'
import { FourSideBoxWidget } from './fields/FourSideBoxWidget'
import { ShadowWidget } from './widgets/ShadowWidget'
import { TailwindTextColorPickerWidget } from './widgets/TailwindTextColorPickerWidget'
import IconPickerWidget from './widgets/IconPickerWidget'
import LayoutField from './fields/Layout'
import CornersRoundField from './fields/CornersRound'
import ResponsiveVisibilityField from './fields/ResponsiveVisibility'

const CustomFieldTemplate = ({
  id,
  classNames,
  label,
  children,
  errors,
  help,
}: any) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      {children}
      {errors}
      {help}
    </div>
  )
}

const CustomObjectFieldTemplate = ({ properties }: any) => {
  return <div>{properties.map((prop: any) => prop.content)}</div>
}

const CustomErrorList = () => null

export const CustomTheme = {
  widgets: {
    TextWidget, // ✅ این ویجت جایگزین ورودی متنی پیش‌فرض می‌شه
    SelectWidget,
    TailwindBgColorWidget,
    TailwindTextColorPickerWidget,
    CheckboxWidget,
    TextareaWidget,
    NumberWidget,
    SliderWidget,
    IconPickerWidget,
  },
  fields: {
    PaddingField: (props: FieldProps) => (
      <FourSideBoxWidget
        value={props.formData}
        onChange={(val) => props.onChange(val, ['padding'])}
      />
    ),
    MarginField: (props: FieldProps) => (
      <FourSideBoxWidget
        value={props.formData}
        onChange={(val) => props.onChange(val, ['margin'])}
      />
    ),
    BorderRadiusField: (props: FieldProps) => (
      <CornersRoundField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['borderRadius'])}
      />
    ),
    ShadowField: (props: FieldProps) => (
      <ShadowWidget
        value={props.formData}
        onChange={(val) => props.onChange(val, ['boxShadow'])}
      />
    ),
    LayoutField: (props: FieldProps) => (
      <LayoutField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['layout'])}
      />
    ),
    ResponsiveVisibilityField: (props: FieldProps) => (
      <ResponsiveVisibilityField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['visibility'])}
      />
    ),
    BackgroundColorField: (props: FieldProps) => {
      const current = props.formData ?? {}
      console.log('#2885  current backgroundColor:', current)
      console.log('#2885  current formContext?.allFormData:', props.formContext)
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val: { light: any; dark: any }) => {
        props.onChange(val, ['backgroundColor'])
      }

      return <ColorWidget value={current} onChange={handleChange} />
    },
  },
  templates: {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate: CustomObjectFieldTemplate,
    ErrorListTemplate: CustomErrorList,
  },
  validator,
}

export const TailwindForm = withTheme(CustomTheme)
