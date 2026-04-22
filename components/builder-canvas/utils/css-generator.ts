const BREAKPOINTS = {
  sm: '@media(max-width:767px)',
  md: '@media(min-width:768px) and (max-width:1023px)',
  lg: '',
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)

const kebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase()

function push(map, bp, cls, rule) {
  map[bp] ??= {}
  map[bp][cls] ??= []
  map[bp][cls].push(rule)
}

/* ----------------------------- */
/* parse values */
/* ----------------------------- */

function parseValue(prop, val) {
  if (prop === 'opacity') {
    const v = Number(val)
    return Math.max(0, Math.min(1, v / 100))
  }

  if (!isObj(val)) return val

  const value = val.value ?? ''
  const unit = val.unit ?? 'px'

  return `${value}${unit}`
}

/* ----------------------------- */
/* padding / margin */
/* ----------------------------- */

function handleSpacing(type, val, id, map) {
  const cls = `.b${id}`

  for (const bp of ['lg', 'md', 'sm']) {
    if (!val[bp]) continue

    const v = val[bp]

    const t = v.top ?? 0
    const r = v.right ?? t
    const b = v.bottom ?? t
    const l = v.left ?? r
    const unit = v.unit ?? 'px'

    push(
      map,
      bp,
      cls,
      `${type}:${t}${unit} ${r}${unit} ${b}${unit} ${l}${unit}`,
    )
  }
}

/* ----------------------------- */
/* borderRadius */
/* ----------------------------- */

function handleRadius(val, id, map) {
  const cls = `.b${id}`

  for (const bp of ['lg', 'md', 'sm']) {
    if (!val[bp]) continue

    const v = val[bp]

    const t = v.top ?? 0
    const r = v.right ?? t
    const b = v.bottom ?? t
    const l = v.left ?? r
    const unit = v.unit ?? 'px'

    push(
      map,
      bp,
      cls,
      `border-radius:${t}${unit} ${r}${unit} ${b}${unit} ${l}${unit}`,
    )
  }
}

/* ----------------------------- */
/* boxShadow */
/* ----------------------------- */

function handleShadow(val, id, map) {
  if (!val) return

  const { x, y, blur, spread } = val

  if ([x, y, blur, spread].some((v) => v === undefined)) return

  push(map, 'lg', `.b${id}`, `box-shadow:${x}px ${y}px ${blur}px ${spread}px`)
}

/* ----------------------------- */
/* border */
/* ----------------------------- */

function handleBorder(val, id, map) {
  const cls = `.b${id}`

  if (val.width) push(map, 'lg', cls, `border-width:${val.width}px`)

  if (val.bottom) push(map, 'lg', cls, `border-bottom-style:${val.bottom}`)
}

/* ----------------------------- */
/* css custom */
/* ----------------------------- */

function sanitizeCss(css) {
  if (typeof css !== 'string') return ''

  return css
    .replace(/[{}]/g, '')
    .replace(/\n/g, '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean)
    .join(';')
}

/* ----------------------------- */
/* process properties */
/* ----------------------------- */

function process(prop, val, id, map) {
  const cls = `.b${id}`

  if (prop === 'padding') return handleSpacing('padding', val, id, map)

  if (prop === 'margin') return handleSpacing('margin', val, id, map)

  if (prop === 'borderRadius') return handleRadius(val, id, map)

  if (prop === 'boxShadow') return handleShadow(val, id, map)

  if (prop === 'border') return handleBorder(val, id, map)

  if (prop === 'css') {
    for (const bp in val) {
      const clean = sanitizeCss(val[bp])

      if (clean) push(map, bp, cls, clean)
    }

    return
  }

  /* responsive */

  if (isObj(val) && (val.lg || val.md || val.sm)) {
    for (const bp of ['lg', 'md', 'sm']) {
      if (!val[bp]) continue

      const v = parseValue(prop, val[bp])

      push(map, bp, cls, `${kebab(prop)}:${v}`)
    }

    return
  }

  /* normal */

  if (typeof val === 'string' || typeof val === 'number') {
    push(map, 'lg', cls, `${kebab(prop)}:${val}`)
  }
}

/* ----------------------------- */
/* traversal */
/* ----------------------------- */

function collect(node, parentId, map) {
  if (!node) return

  if (Array.isArray(node)) {
    node.forEach((n) => collect(n, parentId, map))
    return
  }

  if (!isObj(node)) return

  const id = node.id || parentId

  /* styles */

  if (node.styles) {
    const styles = node.styles

    for (const key in styles) {
      if (key === 'layout') {
        for (const k in styles.layout) process(k, styles.layout[k], id, map)
      } else process(key, styles[key], id, map)
    }
  }

  /* content */

  if (node.content) {
    for (const key in node.content) process(key, node.content[key], id, map)
  }

  for (const key in node) collect(node[key], id, map)
}

/* ----------------------------- */
/* build css */
/* ----------------------------- */

function build(map, bp) {
  if (!map[bp]) return ''

  let css = ''

  for (const cls in map[bp]) {
    const rules = [...new Set(map[bp][cls])].join(';')

    css += `${cls}{${rules}}`
  }

  return css
}

/* ----------------------------- */
/* main */
/* ----------------------------- */

export function generateResponsiveCSS(json) {
  const map = {}

  collect(json, null, map)

  let css = build(map, 'lg')

  const sm = build(map, 'sm')
  const md = build(map, 'md')

  if (sm) css += `${BREAKPOINTS.sm}{${sm}}`

  if (md) css += `${BREAKPOINTS.md}{${md}}`

  return css
}
