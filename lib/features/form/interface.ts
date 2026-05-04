import { Id, Model, SchemaModel } from '@/lib/features/core/interface'
import {
  Content as FormContentComponent,
  Row as FormRowComponent,
  Column as FormColumnComponent,
  Block as FormBlockComponent,
} from '@/components/builder-form/types'

export type FormContent = FormContentComponent

export type FormRow = FormRowComponent

export type FormColumn = FormColumnComponent

export type FormBlock = FormBlockComponent

export type FormField = {
  name: string
  type:
    | 'text'
    | 'email'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'date'
  options: [string] // برای select یا radio
  required: boolean
  label: string
  placeholder: string
  description: string
  defaultValue: string
}

export type FromTranslation = {
  locale: string // "fa", "en", "de", ...
  title: string
  content: any
  fields: FormField[]
  successMessage: string
  description: string
}

/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type FormBase = {
  user: Id

  /**
   * محتوا
   */
  translations: [FromTranslation]

  status: 'deactive' | 'active'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type Form = Model & FormBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type FormSchema = SchemaModel & FormBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type FormInput = FormBase
