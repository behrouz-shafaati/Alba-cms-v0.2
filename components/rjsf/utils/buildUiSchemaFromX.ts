export function buildUiSchemaFromX(schema) {
  const ui: any = {}

  for (const key in schema.properties) {
    const field = schema.properties[key]

    if (field['x-field']) {
      ui[key] = {
        'ui:field': field['x-field'],
      }
    }
  }

  return ui
}
