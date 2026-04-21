const BREAKPOINTS = {
  sm: '@media(max-width:767px)',
  md: '@media(min-width:768px) and (max-width:1023px)',
  lg: '',
}

const CSS_WHITELIST = new Set([
  'width',
  'height',
  'maxWidth',
  'fontSize',
  'fontWeight',
  'textAlign',
  'color',
  'background',
  'backgroundColor',
  'display',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'opacity',
  'boxShadow',
])

const UNITLESS = new Set(['opacity', 'fontWeight'])

const CUSTOM_BP = {
  mobile: 'sm',
  tablet: 'md',
  desktop: 'lg',
}

function kebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function isObj(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function push(map, bp, cls, rule) {
  map[bp] ??= {}
  map[bp][cls] ??= []
  map[bp][cls].push(rule)
}

function normalizeOpacity(val) {
  const n = Number(val)
  if (Number.isNaN(n)) return ''
  const v = Math.max(0, Math.min(1, n / 100))
  return String(v)
}

function parseValue(prop, data) {
  if (prop === 'opacity') {
    const raw = isObj(data) ? (data.value ?? data) : data
    if (raw === undefined || raw === null) return ''
    return normalizeOpacity(raw)
  }

  if (!isObj(data)) {
    let value = String(data ?? '').trim()
    if (value === '') return ''

    if (UNITLESS.has(prop) || /[a-z%)]$/i.test(value) || value === '0')
      return value

    return value + 'px'
  }

  let value = String(data.value ?? '').trim()
  if (value === '') return ''

  if (UNITLESS.has(prop) || /[a-z%)]$/i.test(value) || value === '0')
    return value

  const unit = data.unit || 'px'
  return value + unit
}

function sanitizeCss(css) {
  if (typeof css !== 'string') return ''

  return css
    .replace(/[{}]/g, '')
    .replace(/\n/g, '')
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((rule) => {
      const i = rule.indexOf(':')
      if (i === -1) return ''

      const prop = rule.slice(0, i).trim()
      const val = rule.slice(i + 1).trim()

      const camel = prop.replace(/-([a-z])/g, (m, p) => p.toUpperCase())

      if (!CSS_WHITELIST.has(camel)) return ''

      return `${prop}:${val}`
    })
    .filter(Boolean)
    .join(';')
}

function merge(arr) {
  const map = {}

  for (const g of arr) {
    const parts = g.split(';')

    for (const p of parts) {
      const i = p.indexOf(':')
      if (i === -1) continue

      const k = p.slice(0, i)
      const v = p.slice(i + 1)

      map[k] = v
    }
  }

  return Object.entries(map)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
}

function build(map, bp) {
  if (!map[bp]) return ''

  let css = ''

  for (const cls in map[bp]) {
    const rules = merge(map[bp][cls])
    if (!rules) continue

    css += `${cls}{${rules}}`
  }

  return css
}

function processStyle(prop, val, id, map) {
  if (!CSS_WHITELIST.has(prop) || !id) return

  const cls = `.b${id}`
  const cssProp = kebab(prop)

  if (isObj(val) && ('lg' in val || 'md' in val || 'sm' in val)) {
    for (const bp of ['lg', 'md', 'sm']) {
      const data = val[bp]
      if (!data) continue

      const v = parseValue(prop, data)
      if (!v) continue

      push(map, bp, cls, `${cssProp}:${v}`)
    }
  } else {
    const v = parseValue(prop, val)
    if (!v) return

    push(map, 'lg', cls, `${cssProp}:${v}`)
  }
}

function collect(node, parentId, map) {
  if (!node) return

  if (Array.isArray(node)) {
    for (const n of node) collect(n, parentId, map)
    return
  }

  if (typeof node !== 'object') return

  const id = node.id || parentId

  for (const key in node) {
    const val = node[key]

    if (key === 'css' && id && isObj(val)) {
      const cls = `.b${id}`

      for (const d in val) {
        const bp = CUSTOM_BP[d]
        if (!bp) continue

        const css = sanitizeCss(val[d])
        if (!css) continue

        push(map, bp, cls, css)
      }

      continue
    }

    if (CSS_WHITELIST.has(key)) processStyle(key, val, id, map)

    if (isObj(val) || Array.isArray(val)) collect(val, id, map)
  }
}

export function generateResponsiveCSS(json) {
  const map = {}

  collect(json, null, map)

  let css = ''

  const lg = build(map, 'lg')
  if (lg) css += lg

  const sm = build(map, 'sm')
  if (sm) css += `${BREAKPOINTS.sm}{${sm}}`

  const md = build(map, 'md')
  if (md) css += `${BREAKPOINTS.md}{${md}}`

  return css
}
