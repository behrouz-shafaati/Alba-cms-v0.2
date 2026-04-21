// components/ResponsiveStyle.tsx

import parseCssStringToObject from '@/lib/utils/parseCssStringToObject'

type ResponsiveStyles = {
  allDevices?: string
  mobile?: string
  tablet?: string
  desktop?: string
}

type Props = {
  selector: string
  styles: ResponsiveStyles
}

const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
}

function generateResponsiveCSS(
  selector: string,
  styles: ResponsiveStyles,
): string | null {
  if (!styles) return null
  delete styles.allDevices
  const keys: (keyof ResponsiveStyles)[] = ['mobile', 'tablet', 'desktop']
  return keys
    .filter((key) => styles[key] && Object.keys(styles[key]!).length > 0)
    .map((breakpoint) => {
      const properties = parseCssStringToObject(styles[breakpoint])!
      const rules = Object.entries(properties)
        .map(([prop, value]) => `    ${prop}: ${value};`)
        .join('\n')
      return `@media ${breakpoints[breakpoint]} {\n  .${selector} {\n${rules}\n  }\n}`
    })
    .join('\n\n')
}

export default function ResponsiveStyle({ selector, styles }: Props) {
  const css = generateResponsiveCSS(selector, styles)
  if (!css) return null
  return <style>{css}</style>
}
