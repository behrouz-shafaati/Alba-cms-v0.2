export default function findElementById(node: any, id: string): any {
  if (!node) return null

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findElementById(item, id)
      if (found) return found
    }
    return null
  }

  if (node.id === id) return node

  if (node.rows) {
    const r = findElementById(node.rows, id)
    if (r) return r
  }

  if (node.columns) {
    const r = findElementById(node.columns, id)
    if (r) return r
  }

  if (node.blocks) {
    const r = findElementById(node.blocks, id)
    if (r) return r
  }

  if (node.type === 'internalSectionWrapper' && node.sections) {
    const r = findElementById(node.sections, id)
    if (r) return r
  }

  if (node.type === 'internalSection' && node.blocks) {
    const r = findElementById(node.blocks, id)
    if (r) return r
  }

  return null
}
