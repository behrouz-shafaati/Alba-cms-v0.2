import parseCssStringToObject from '@/lib/utils/parseCssStringToObject'
import clsx from 'clsx'

type ClassNames = Record<string, string | undefined | null>

const STYLE_VAR_CLASS_MAP: Record<string, string> = {
  '--txt-default': 'text-(--txt-default)',
  '--txt-hover': 'hover:text-(--txt-hover)',
  '--txt-active': 'active:text-(--txt-active)',

  '--txt-default-dark': 'dark:text-(--txt-default-dark)',
  '--txt-hover-dark': 'dark:hover:text-(--txt-hover-dark)',
  '--txt-active-dark': 'dark:active:text-(--txt-active-dark)',

  '--bg-default': 'bg-(--bg-default)',
  '--bg-hover': 'hover:bg-(--bg-hover)',
  '--bg-active': 'active:bg-(--bg-active)',

  '--bg-default-dark': 'dark:bg-(--bg-default-dark)',
  '--bg-hover-dark': 'dark:hover:bg-(--bg-hover-dark)',
  '--bg-active-dark': 'dark:active:bg-(--bg-active-dark)',

  '--borderColor-default': '!border-(--borderColor-default)',
  '--borderColor-hover': 'hover:border-(--borderColor-hover)',
  '--borderColor-active': 'active:border-(--borderColor-active)',

  '--borderColor-default-dark': 'dark:border-(--borderColor-default-dark)',
  '--borderColor-hover-dark': 'dark:hover:border-(--borderColor-hover-dark)',
  '--borderColor-active-dark': 'dark:active:border-(--borderColor-active-dark)',
}

/**
 * Combines multiple class names into a single string.
 *
 * This function is highly flexible and supports the following types of input:
 * - Strings: added directly.1
 * - Arrays: flattened recursively and each element processed.
 * - Objects: keys whose values are truthy will be included; nested objects are supported.
 *
 * Falsy values (`null`, `undefined`, `''`, `false`) are ignored.
 * All class names are trimmed and joined with a single space.
 *
 * @param {...any} args - Strings, arrays, or objects containing class names.
 *
 * @returns {string} A single string with all valid class names, separated by spaces.
 *
 * @example
 * combineClassNames("btn", ["btn-lg", null], { active: true, disabled: false });
 * // returns "btn btn-lg active"
 *
 * @example
 * combineClassNames({ foo: "bar", nested: { a: "b", c: false } }, "extra");
 * // returns "bar b extra"
 */
export function combineClassNames(...args: any[]): string {
  const classes: string[] = []

  const process = (input: any) => {
    if (!input) return

    if (typeof input === 'string') {
      if (input.trim()) classes.push(input.trim())
      return
    }

    if (Array.isArray(input)) {
      input.forEach(process)
      return
    }

    if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        // ✅ اگر CSS variable باشه
        if (key.startsWith('--')) {
          const cls = STYLE_VAR_CLASS_MAP[key]
          if (cls) classes.push(cls)
          return
        }

        // رفتار قبلی
        if (typeof value === 'boolean') {
          if (value) classes.push(key)
        } else if (typeof value === 'string') {
          if (value.trim()) classes.push(value.trim())
        } else if (typeof value === 'object') {
          process(value)
        }
      })
    }
  }

  args.forEach(process)

  return clsx(classes.join(' '))
}

export const getVisibilityClass = (
  visibility: {
    mobile?: boolean
    tablet?: boolean
    desktop?: boolean
  },
  options?: { display?: string },
) => {
  const { mobile = true, tablet = true, desktop = true } = visibility || {}

  //مقدار پیش فرض زیر گرید بود که باعث میشد صفحه از عرض سریز کنه برای همین block‌ جایگزین آن شد
  const display = options?.display || 'block' // پیش‌فرض نمایش همه جا block

  const classList: string[] = []

  // موبایل: پایه‌ای‌ترین حالت (پیش‌فرض Tailwind)
  if (mobile === false) {
    classList.push('!hidden')
  } else {
    classList.push(display)
  }

  // تبلت
  if (tablet === false) {
    classList.push('md:!hidden')
  } else {
    classList.push(`md:!${display}`)
  }

  // دسکتاپ
  if (desktop === false) {
    classList.push('lg:!hidden')
  } else {
    classList.push(`lg:!${display}`)
  }

  return classList.join(' ')
}

/**
 * Extracts and returns only color-related Tailwind CSS classes from a given className string.
 *
 * This function filters classes that are related to color styling,
 * including background (`bg-`), text (`text-`), border (`border-`),
 * shadow (`shadow-`), placeholder (`placeholder-`), and ring (`ring-`),
 * as well as their dark mode variants (`dark:` prefix).
 *
 * @param {string} className - The complete className string containing multiple Tailwind CSS classes.
 * @returns {string} A new string containing only color-related Tailwind classes, separated by spaces.
 *
 * @example
 * extractColorClasses("bg-red-500 text-white p-4 border border-gray-200")
 * // returns "bg-red-500 text-white border border-gray-200"
 *
 * @example
 * extractColorClasses("dark:bg-gray-800 text-sm shadow-lg hover:scale-105")
 * // returns "dark:bg-gray-800 shadow-lg"
 */
export function extractColorClasses(className: string): string {
  return className
    .split(/\s+/) // تبدیل استرینگ به آرایه کلاس‌ها
    .filter((cls) =>
      /^(dark:)?(bg-|text-|border-|shadow-|placeholder-|ring-)/.test(cls),
    )
    .join(' ')
}

function objectToCssString(obj) {
  let cssString = ''
  for (const property in obj) {
    // بررسی می‌کنیم که پراپرتی متعلق به خود آبجکت باشد (نه prototype)
    if (Object.hasOwnProperty.call(obj, property)) {
      const value = obj[property]
      // تبدیل نام property از camelCase به kebab-case (مثلاً boxShadow به box-shadow)
      const cssProperty = property.replace(
        /([A-Z])/g,
        (match) => `-${match.toLowerCase()}`,
      )
      cssString += `${cssProperty}: ${value};\n`
    }
  }
  return cssString
}
