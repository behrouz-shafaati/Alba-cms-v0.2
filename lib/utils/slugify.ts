/**
 * تبدیل عنوان به اسلاگ خوانا
 */
const arabicDiacriticsRegex = /[\u064B-\u0652]/g // اعراب عربی و فارسی مثل ً ُ ِ ّ

export default function slugify(title: string): string {
  if (!title) return ''
  return title
    .normalize('NFC') // نرمال‌سازی حروف فارسی/عربی
    .replace(arabicDiacriticsRegex, '') // حذف اعراب
    .replace(/[^\w\u0600-\u06FF\s-]/g, '') // حذف کاراکترهای غیرحرفی (غیراز حروف فارسی و عدد و فاصله)
    .replace(/\s+/g, '-') // فاصله به خط تیره
    .replace(/-+/g, '-') // چند خط تیره → یکی
    .replace(/^-+|-+$/g, '') // حذف خط تیره‌ی اول و آخر
    .toLowerCase()
}
