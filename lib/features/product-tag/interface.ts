import { Id, Model, SchemaModel } from '@/lib/features/core/interface'
import { User } from '../user/interface'

export type ProductTagTranslationSchema = {
  /**
   * زبان مطلب
   */
  locale: string // "fa", "en", "de", ...

  /**
   * عنوان برچسب
   */
  title: string

  /**
   * توضیحات مربوط به برچسب
   */
  description: string
}

/**
 * اطلاعات پایه برچسب که شامل فیلدهای اصلی برچسب می‌باشد
 */
type ProductTagBase = {
  /**
   * نامک برچسب
   */
  slug: string

  /**
   * محتوا
   */
  translations: [ProductTagTranslationSchema]

  /**
   * شناسه تصویر برچسب
   */
  icon: string

  /**
   * شناسه تصویر برچسب
   */
  image: File

  /**
   * وضعیت فعال بودن برچسب (در صورت فعال بودن true)
   */
  status: 'active' | 'inactive'

  /**
   * کاربر سازنده
   */
  user: User
}

/**
 * مدل برچسب که شامل اطلاعات پایه برچسب و ویژگی‌های اضافی مدل می‌باشد
 */
export type ProductTag = Model & ProductTagBase

/**
 * مدل اسکیمای برچسب برای پایگاه داده که شامل اطلاعات پایه برچسب و ویژگی‌های اضافی اسکیمای پایگاه داده می‌باشد
 */
export type ProductTagSchema = SchemaModel &
  Omit<ProductTagBase, 'user' | 'image'> & { image: Id; user: Id }

/**
 * ساختار درخواست ارسال داده‌های برچسب که شامل اطلاعات پایه برچسب می‌باشد
 */
export type ProductTagInput = SchemaModel
