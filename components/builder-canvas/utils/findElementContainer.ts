const findElementContainer = (content: any, elementId: string) => {
  for (const row of content.rows || []) {
    for (const column of row.columns || []) {
      // اگر بلاک خود ستون باشد
      if (column.id == elementId) return column
      // 1️⃣ اگر بلاک مستقیم داخل column باشد
      if (column.blocks?.some((block: any) => block.id === elementId)) {
        return column
      }

      // 2️⃣ بررسی internalSectionWrapper → internalSection
      for (const block of column.blocks || []) {
        if (block.type !== 'internalSectionWrapper') continue

        for (const section of block.sections || []) {
          // اگر بلاک همان بخش داخلی باشد
          if (section.id == elementId) return section

          if (section.blocks?.some((inner: any) => inner.id === elementId)) {
            return section // internalSection
          }
        }
      }
    }
  }

  return null
}

export default findElementContainer
