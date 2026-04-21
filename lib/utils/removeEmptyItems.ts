export default function removeEmptyItems(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    const filtered = obj
      .map(removeEmptyItems)
      .filter((v) => v !== null && v !== undefined)
    return filtered.length > 0 ? filtered : undefined
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = removeEmptyItems(value)
      if (cleaned !== undefined && cleaned !== '' && cleaned !== null) {
        result[key] = cleaned
      }
    }
    return Object.keys(result).length > 0 ? result : undefined
  }

  if (obj === '' || obj === null) return undefined
  return obj
}
