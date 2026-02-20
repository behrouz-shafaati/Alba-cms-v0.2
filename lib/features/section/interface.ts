import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'
import {
  Content as SectionContentComponent,
  Row as SectionRowComponent,
  Column as SectionColumnComponent,
  Block as SectionBlockComponent,
} from '@/components/builder-section/types'

export type SectionContent = SectionContentComponent

export type SectionRow = SectionRowComponent

export type SectionColumn = SectionColumnComponent

export type SectionBlock = SectionBlockComponent
/**
 * اطلاعات پایه سربرگ که شامل فیلدهای اصلی سربرگ می‌باشد
 */
type SectionBase = {
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
export type Section = Model & SectionBase

/**
 * مدل اسکیمای سربرگ برای پایگاه داده که شامل اطلاعات پایه سربرگ و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type SectionSchema = SchemaModel & SectionBase

/**
 * ساختار درخواست ارسال داده‌های سربرگ که شامل اطلاعات پایه سربرگ می‌باشد
 */
export type SectionInput = SectionBase
