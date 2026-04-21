import { Id, Model, SchemaModel } from '@/lib/features/core/interface'

export type ProductCategoryTranslationSchema = {
  /**
   * زبان مطلب
   */
  locale: string // "fa", "en", "de", ...
  /**
   * عنوان دسته بندی
   */
  title: string

  /**
   * توضیحات مربوط به دسته‌بندی
   */
  description: string
}

/**
 * اطلاعات پایه دسته‌بندی که شامل فیلدهای اصلی دسته‌بندی می‌باشد
 */
type CategoryBase = {
  /**
   * شیء والد دسته‌بندی (اختیاری، می‌تواند هر نوع داده‌ای باشد)
   */
  parent: ProductCategory | null

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
  translations: [ProductCategoryTranslationSchema]

  /**
   * شناسه تصویر دسته‌بندی
   */
  image: File

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
export type ProductCategory = Model & CategoryBase

/**
 * مدل اسکیمای دسته‌بندی برای پایگاه داده که شامل اطلاعات پایه دسته‌بندی و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type CategorySchema = SchemaModel &
  Omit<CategoryBase, 'parent' | 'file'> & { parent: Id; file: Id }

/**
 * ساختار درخواست ارسال داده‌های دسته‌بندی که شامل اطلاعات پایه دسته‌بندی می‌باشد
 */
export type CategoryInput = CategoryBase
