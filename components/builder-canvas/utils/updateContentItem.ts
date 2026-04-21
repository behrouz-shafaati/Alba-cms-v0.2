export default function updateContentItem(
  node: any,
  itemId: string,
  key: string,
  value: any,
): any {
  // اگر آرایه باشد
  if (Array.isArray(node)) {
    return node.map((item) => updateContentItem(item, itemId, key, value))
  }

  if (!node || typeof node !== 'object') return node

  // اگر هدف سند باشد
  if (!itemId) return { ...node, [key]: value }

  // اگر خود آیتم هدف باشد
  if (node.id === itemId) {
    return { ...node, [key]: value }
  }

  const newNode = { ...node }

  // ----------------------
  // 1) rows
  // ----------------------
  if (node.rows) {
    newNode.rows = updateContentItem(node.rows, itemId, key, value)
  }

  // ----------------------
  // 2) columns
  // ----------------------
  if (node.columns) {
    newNode.columns = updateContentItem(node.columns, itemId, key, value)
  }

  // ----------------------
  // 3) blocks
  // ----------------------
  if (node.blocks) {
    newNode.blocks = updateContentItem(node.blocks, itemId, key, value)
  }

  // ----------------------
  // 4) internalSectionWrapper → sections[]
  // ----------------------
  if (node.type === 'internalSectionWrapper' && node.sections) {
    newNode.sections = updateContentItem(node.sections, itemId, key, value)
  }

  // ----------------------
  // 5) internalSection → blocks[]
  // ----------------------
  if (node.type === 'internalSection' && node.blocks) {
    newNode.blocks = updateContentItem(node.blocks, itemId, key, value)
  }

  return newNode
}
