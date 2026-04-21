// components/ui/TailwindClassInput/suggest.ts

import { TAILWIND_CLASSES } from './tailwind-classes'
import { TAILWIND_VARIANTS } from './tailwind-variants'

export interface Suggestion {
  /** مقدار کامل که درج می‌شه */
  value: string
  /** بخش variant اگر داشت */
  variant: string | null
  /** خود کلاس base */
  baseClass: string
  /** نوع match */
  matchType: 'exact-start' | 'start' | 'includes'
}

/**
 * پارس کردن ورودی کاربر به variant و base query
 *
 * "md:px"        → { variants: ["md"],         query: "px"      }
 * "hover:bg-b"   → { variants: ["hover"],       query: "bg-b"    }
 * "sm:hover:tex" → { variants: ["sm", "hover"], query: "tex"     }
 * "flex"         → { variants: [],              query: "flex"    }
 */
function parseInput(input: string): {
  variants: string[]
  query: string
  prefix: string // variants joind با ":"  مثلا "sm:hover:"
} {
  const parts = input.split(':')

  if (parts.length === 1) {
    return { variants: [], query: parts[0], prefix: '' }
  }

  // آخرین بخش همیشه query هست، بقیه variant
  const query = parts[parts.length - 1]
  const variants = parts.slice(0, -1)
  const prefix = variants.join(':') + ':'

  return { variants, query, prefix }
}

/**
 * چک می‌کند variant معتبره یا نه
 */
function isValidVariantChain(variants: string[]): boolean {
  if (variants.length === 0) return true

  // variant های شناخته‌شده
  const knownVariants = new Set(TAILWIND_VARIANTS)

  // برای chain مثل sm:hover اجازه می‌دیم
  // اگر هر variant به تنهایی یا ترکیبش در لیست بود OK
  return variants.every((v) => {
    // responsive variants
    if (['sm', 'md', 'lg', 'xl', '2xl'].includes(v)) return true
    // state variants
    if (knownVariants.has(v as never)) return true
    // arbitrary variant مثل [&:nth-child(3)]
    if (v.startsWith('[') && v.endsWith(']')) return true
    return false
  })
}

/**
 * موتور اصلی پیشنهاد
 */
export function getSuggestions(
  rawQuery: string,
  maxResults = 12,
): Suggestion[] {
  if (!rawQuery || rawQuery.trim().length === 0) return []

  const { variants, query, prefix } = parseInput(rawQuery)

  // ─── حالت ۱: کاربر داره variant تایپ می‌کنه ─────────────────────────────
  // مثال: "sm" یا "hov" یا "sm:hov"
  // تشخیص: قبل از ":" هیچی نداریم یا آخرین ":" وجود داره
  // وقتی query خالیه یعنی دقیقاً "md:" تایپ شده → base classes نشون بده

  if (query === '' && variants.length > 0) {
    // "md:" تایپ شده → نشون بده همه base classes با این prefix
    if (!isValidVariantChain(variants)) return []

    return TAILWIND_CLASSES.slice(0, maxResults).map((cls) => ({
      value: prefix + cls,
      variant: prefix.slice(0, -1),
      baseClass: cls,
      matchType: 'start',
    }))
  }

  // ─── حالت ۲: احتمالاً داره variant تایپ می‌کنه (بدون ":" هنوز) ──────────
  // مثال: "hov", "sm", "md"
  // اگر variants خالیه و query با یک variant شروع می‌شه، variant ها رو هم پیشنهاد بده
  const variantSuggestions: Suggestion[] = []

  if (variants.length === 0) {
    const matchedVariants = TAILWIND_VARIANTS.filter(
      (v) =>
        v.startsWith(query.toLowerCase()) ||
        (query.includes(':') === false && v.includes(query.toLowerCase())),
    )

    for (const v of matchedVariants.slice(0, 5)) {
      variantSuggestions.push({
        value: v + ':',
        variant: v,
        baseClass: '',
        matchType: v.startsWith(query) ? 'start' : 'includes',
      })
    }
  }

  // ─── حالت ۳: base class رو فیلتر کن ─────────────────────────────────────

  if (!isValidVariantChain(variants) && variants.length > 0) {
    // variant نامعتبر → فقط بر اساس query فیلتر کن
  }

  const q = query.toLowerCase()
  const exactStart: Suggestion[] = []
  const starts: Suggestion[] = []
  const includes: Suggestion[] = []

  for (const cls of TAILWIND_CLASSES) {
    const lowerCls = cls.toLowerCase()

    if (lowerCls === q) {
      exactStart.push({
        value: prefix + cls,
        variant: variants.length ? prefix.slice(0, -1) : null,
        baseClass: cls,
        matchType: 'exact-start',
      })
    } else if (lowerCls.startsWith(q)) {
      starts.push({
        value: prefix + cls,
        variant: variants.length ? prefix.slice(0, -1) : null,
        baseClass: cls,
        matchType: 'start',
      })
    } else if (lowerCls.includes(q)) {
      includes.push({
        value: prefix + cls,
        variant: variants.length ? prefix.slice(0, -1) : null,
        baseClass: cls,
        matchType: 'includes',
      })
    }

    if (exactStart.length + starts.length + includes.length >= maxResults * 4)
      break
  }

  const classSuggestions = [...exactStart, ...starts, ...includes].slice(
    0,
    maxResults - Math.min(variantSuggestions.length, 3),
  )

  // variant پیشنهادها اول (حداکثر ۳) + بقیه class ها
  return [...variantSuggestions.slice(0, 3), ...classSuggestions]
}
