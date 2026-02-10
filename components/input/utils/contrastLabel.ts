import { hex } from 'wcag-contrast'

function isHexColor(color?: string): color is string {
  return typeof color === 'string' && color.startsWith('#')
}

export default function contrastLabel(bg?: string, fg = '#000000') {
  if (!isHexColor(bg) || !isHexColor(fg)) return null

  const ratio = hex(bg, fg)

  if (ratio >= 7)
    return { label: 'عالی – خوانایی خیلی بالا', color: 'text-green-600' }

  if (ratio >= 4.5) return { label: 'خوب – خوانا', color: 'text-green-500' }

  if (ratio >= 3)
    return { label: 'ضعیف – بهتره اصلاح بشه', color: 'text-yellow-500' }

  return { label: 'بد – خوانا نیست', color: 'text-red-500' }
}
