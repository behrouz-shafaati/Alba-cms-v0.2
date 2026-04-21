import generateObjectId from '@/lib/utils/objectId'
// تابع بازگشتی نهایی
export function regenerateAllIds(data: any): any {
  // اگر null یا primitive است → بدون تغییر
  if (data === null || typeof data !== 'object') return data

  // اگر آرایه است → روی تک تک آیتم‌ها اعمال کن
  if (Array.isArray(data)) {
    return data.map((item) => regenerateAllIds(item))
  }

  // اگر object است → یک object جدید با id جدید
  const newObj: any = {}

  for (const key of Object.keys(data)) {
    if (key === 'id') {
      // هر ID → یک ID جدید ساخته می‌شود
      newObj[key] = generateObjectId()
      continue
    }

    // اگر آبجکت یا آرایه است → بازگشتی
    const value = data[key]
    if (typeof value === 'object' && value !== null) {
      newObj[key] = regenerateAllIds(value)
    } else {
      // مقدار معمولی
      newObj[key] = value
    }
  }

  return newObj
}
