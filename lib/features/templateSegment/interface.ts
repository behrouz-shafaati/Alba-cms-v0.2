import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as SectionContentComponent,
  Row as SectionRowComponent,
  Column as SectionColumnComponent,
  Block as SectionBlockComponent,
} from '@/components/builder-template-segment/types'

export type SectionContent = SectionContentComponent

export type SectionRow = SectionRowComponent

export type SectionColumn = SectionColumnComponent

export type SectionBlock = SectionBlockComponent

export type TemplateSegmentTranslation = {
  locale: string // "fa", "en", "de", ...
  title: string
  content: any
}
/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type TemplateSegmentBase = {
  /**
   * عنوان سربرگ
   */
  title: string

  user: Id

  /**
   * محتوای سربرگ
   */
  content: SectionContent

  status: 'deactive' | 'active'
}

/**
 * مدل سربرگ که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی مدل می‌باشد
 */
export type Section = Model & TemplateSegmentBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type TemplateSegmentSchema = SchemaModel & TemplateSegmentBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type TemplateSegmentInput = TemplateSegmentBase
