export function buildUiSchemaFromX(schema: any, path: string[] = []): any {
  let ui: any = {}

  if (!schema || typeof schema !== 'object') return ui

  const uiConfig = extractUiConfig(schema)

  if (Object.keys(uiConfig).length > 0) {
    const nested = buildNestedUiSchema(path, uiConfig)
    ui = deepMerge(ui, nested)
  }

  if (schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const child = schema.properties[key]
      const childUi = buildUiSchemaFromX(child, [...path, key])
      ui = deepMerge(ui, childUi)
    }
  }

  return ui
}

function extractUiConfig(schema: any) {
  const ui: any = {}

  if (schema['x-field']) ui['ui:field'] = schema['x-field']
  if (schema['x-widget']) ui['ui:widget'] = schema['x-widget']

  if (schema['x-class']) ui['classNames'] = schema['x-class']
  if (schema['x-placeholder']) ui['ui:placeholder'] = schema['x-placeholder']
  if (schema['x-help']) ui['ui:help'] = schema['x-help']

  if (schema['x-disabled']) ui['ui:disabled'] = true
  if (schema['x-readonly']) ui['ui:readonly'] = true
  if (schema['x-autofocus']) ui['ui:autofocus'] = true

  if (schema['x-options']) ui['ui:options'] = schema['x-options']

  if (schema['x-order']) ui['ui:order'] = schema['x-order']

  if (schema['x-hidden']) {
    ui['ui:widget'] = 'hidden'
  }

  return ui
}

function buildNestedUiSchema(path: string[], config: any) {
  if (path.length === 0) return config

  let root: any = {}
  let current = root

  for (let i = 0; i < path.length; i++) {
    const key = path[i]

    if (i === path.length - 1) {
      current[key] = config
    } else {
      current[key] = {}
      current = current[key]
    }
  }

  return root
}

function deepMerge(target: any, source: any) {
  const out = { ...target }

  for (const key of Object.keys(source)) {
    if (
      key in target &&
      typeof target[key] === 'object' &&
      typeof source[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key])
    } else {
      out[key] = source[key]
    }
  }

  return out
}
