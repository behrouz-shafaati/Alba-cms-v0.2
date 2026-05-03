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
import ResponsiveVisibilityField from './fields/ResponsiveVisibility'
import BorderField from './fields/Border'
import CssEditor from '../ui/css-editor'
import IconPickerField from './fields/IconPickerField'
import ResponsiveNumberField from './fields/ResponsiveNumberField'
import CustomFieldTemplate from './templates/CustomFieldTemplate'
import { ResponsiveSelectField } from './fields/ResponsiveSelectField'
import FlexSettingsField from './fields/FlexSettingsField'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'

function CustomObjectTemplate(props) {
  const { properties, formData } = props
  const { device } = useBuilderStore()

  const display = formData?.display

  const isFlex = display?.[device] === 'flex'
  const isGrid = display?.[device] === 'grid'

  return (
    <div>
      {properties.map((p) => {
        if (p.name === 'flexSettings' && !isFlex) return null
        // if (p.name === 'grid' && !isGrid) return null
        return <div key={p.name}>{p.content}</div>
      })}
    </div>
  )
}

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
    ResponsiveSelectField,
    FlexSettingsField,
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
    ColorField: (props: FieldProps) => {
      const { formData, onChange, fieldPathId } = props
      const current = formData ?? {}
      // وقتی کاربر رنگ انتخاب میکنه
      const handleChange = (val: { light: any; dark: any }) => {
        onChange(val, fieldPathId.path)
      }
      return <ColorWidget value={current} onChange={handleChange} />
    },
    IconPickerField,
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
    ObjectFieldTemplate: CustomObjectTemplate,
  },
  validator,
}

export const TailwindForm = withTheme(CustomTheme)
