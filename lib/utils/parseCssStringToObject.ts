export default function parseCssStringToObject(cssString: string) {
  const obj = {}
  // حذف آکولادها و فضاهای خالی اطراف
  const cleanedString = cssString.replace(/[{}]/g, '').trim()

  // تقسیم رشته بر اساس ; برای جدا کردن پراپرتی‌ها
  const properties = cleanedString.split(';')

  properties.forEach((property) => {
    if (property.trim()) {
      // اطمینان از اینکه خط خالی نباشد
      // تقسیم هر پراپرتی به کلید و مقدار بر اساس :
      const [key, value] = property.split(':')

      if (key && value !== undefined) {
        const cleanedKey = key.trim()
        const cleanedValue = value.trim()

        // تبدیل camelCase به kebab-case (اگر نیاز دارید، اما برای آبجکت استایل React معمولا camelCase لازم است)
        // const cssKey = cleanedKey.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
        // obj[cssKey] = cleanedValue;

        // اگر می‌خواهید آبجکت را برای استایل React آماده کنید، camelCase را نگه دارید
        obj[cleanedKey] = cleanedValue
      }
    }
  })

  return obj
}

// تبدیل kebab-case به camelCase
function kebabToCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

// export default function parseCssStringToObject(cssString: string) {
//   const obj: Record<string, string> = {}

//   // حذف آکولادها و فاصله‌ها
//   const cleanedString = cssString.replace(/[{}]/g, '').trim()

//   // جدا کردن خطوط
//   const properties = cleanedString.split(';')

//   properties.forEach((property) => {
//     if (property.trim()) {
//       const [key, value] = property.split(':')

//       if (key && value !== undefined) {
//         const cleanedKey = key.trim()
//         const cleanedValue = value.trim()

//         // تبدیل کلید به camelCase
//         const camelKey = kebabToCamel(cleanedKey)

//         obj[camelKey] = cleanedValue
//       }
//     }
//   })

//   return obj
// }
