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
import { FourSideBoxField } from './fields/FourSideBoxField'
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
import CustomFieldTemplate from './templates/CustomFieldTemplate'

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
  },
  fields: {
    ResponsiveNumber: ResponsiveNumberField,
    FourSideBoxField: FourSideBoxField,
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
        console.log('#234234 value in color widget:', val)
        props.onChange(val, ['textColor'])
      }

      console.log('#234234 value in color current:', current)
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
    CssField: (props: FieldProps) => {
      const current = props.formData ?? {}
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val) => {
        props.onChange(val, ['css'])
      }

      return <CssEditor value={current} onChange={handleChange} />
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
