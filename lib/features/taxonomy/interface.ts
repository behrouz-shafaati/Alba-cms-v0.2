import { Id, Model, SchemaModel } from '@/lib/features/core/interface'

export type TaxonomyTranslationSchema = {
  /**
   * زبان مطلب
   */
  lang: string // "fa", "en", "de", ...
  /**
   * عنوان دسته بندی
   */
  title: string

  /**
   * توضیحات مربوط به دسته‌بندی
   */
  description: string
}

export interface ITaxonomyMeta {
  color?: string
  icon?: string
  order?: number
  [key: string]: any
}

export type TaxonomyType =
  | 'category'
  | 'tag'
  | 'product_cat'
  | 'product_tag'
  | 'brand'
  | 'attribute'
export type WpTaxonomyType =
  | 'category'
  | 'post_tag'
  | 'product_cat'
  | 'product_tag'
  | 'brand'
  | 'attribute'

/**
 * اطلاعات پایه دسته‌بندی که شامل فیلدهای اصلی دسته‌بندی می‌باشد
 */
type TaxonomyBase = {
  // 🎯 نوع taxonomy
  type: TaxonomyType

  /**
   * شیء والد دسته‌بندی (اختیاری، می‌تواند هر نوع داده‌ای باشد)
   */
  parent: Taxonomy | null

  ancestors: Id[] // مسیر کامل به ریشه
  level: number // عمق: 0, 1, 2, ...

  /**
   * عنوان دسته
   */
  slug: string
  /**
   * آیکون دسته
   */
  icon: string

  /**
   * محتوا
   */
  translations: [TaxonomyTranslationSchema]

  /**
   * شناسه تصویر دسته‌بندی
   */
  image: File

  // متادیتا
  metadata: {
    color: string // برای attribute رنگ
    icon: string // آیکون دسته‌بندی
    order: number // ترتیب نمایش
    [key: string]: any // هر فیلد سفارشی دیگر
  }

  count: number

  /**
   * وضعیت فعال بودن دسته‌بندی (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'

  /**
   * کاربر سازنده
   */
  user: Id
}

/**
 * مدل دسته‌بندی که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی مدل می‌باشد
 */
export type Taxonomy = Model & TaxonomyBase

/**
 * مدل اسکیمای دسته‌بندی برای پایگاه داده که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type TaxonomySchema = SchemaModel &
  Omit<TaxonomyBase, 'parent' | 'file'> & { parent: Id; file: Id }

/**
 * ساختار درخواست ارسال داده‌های دسته‌بندی که شامل اطلاعات پایه دسته‌بندی می‌باشد
 */
export type TaxonomyInput = TaxonomyBase
