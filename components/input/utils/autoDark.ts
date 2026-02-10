import { parse, converter, formatHex } from 'culori'

const toOklch = converter('oklch')

export default function autoDark(hex: string) {
  const c = toOklch(parse(hex))
  if (!c) return hex

  return formatHex({
    mode: 'oklch',
    l: Math.max(c.l - 0.28, 0.15),
    c: c.c,
    h: c.h,
  })
}
