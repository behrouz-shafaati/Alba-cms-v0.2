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
import LayoutField from './fields/Layout'
import CornersRoundField from './fields/CornersRound'
import ResponsiveVisibilityField from './fields/ResponsiveVisibility'
import BorderField from './fields/Border'
import CssEditor from '../ui/css-editor'
import IconPickerWidget from './fields/IconPickerField'
import IconPickerField from './fields/IconPickerField'
import ResponsiveNumberField from './fields/ResponsiveNumberField'

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
    CssEditor,
  },
  fields: {
    ResponsiveNumber: ResponsiveNumberField,
    PaddingField: (props: FieldProps) => {
      return (
        <FourSideBoxWidget
          value={props.formData}
          onChange={(val) => props.onChange(val, ['padding'])}
        />
      )
    },
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
    LayoutField: LayoutField,
    BorderField: (props: FieldProps) => (
      <BorderField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['border'])}
      />
    ),
    ResponsiveVisibilityField: (props: FieldProps) => (
      <ResponsiveVisibilityField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['visibility'])}
      />
    ),
    TextColorField: (props: FieldProps) => {
      const current = props.formData ?? {}
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val: { light: any; dark: any }) => {
        props.onChange(val, ['textColor'])
      }

      return <ColorWidget value={current} onChange={handleChange} />
    },
    BackgroundColorField: (props: FieldProps) => {
      const current = props.formData ?? {}
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val: { light: any; dark: any }) => {
        props.onChange(val, ['backgroundColor'])
      }

      return <ColorWidget value={current} onChange={handleChange} />
    },
    iconColorField: (props: FieldProps) => {
      const current = props.formData ?? {}
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val: { light: any; dark: any }) => {
        props.onChange(val, ['iconColor'])
      }

      return <ColorWidget value={current} onChange={handleChange} />
    },
    IconPickerField: (props: FieldProps) => (
      <IconPickerField
        value={props.formData}
        onChange={(val) => props.onChange(val, ['icon'])}
      />
    ),
  },
  templates: {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate: CustomObjectFieldTemplate,
    ErrorListTemplate: CustomErrorList,
  },
  validator,
}

export const TailwindForm = withTheme(CustomTheme)
