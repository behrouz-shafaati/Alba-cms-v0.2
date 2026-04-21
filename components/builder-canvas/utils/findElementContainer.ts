const findElementContainer = (content: any, elementId: string) => {
  // تابع بازگشتی برای گشتن داخل blocks
  const deepSearch = (blocks: any[], container: any): any => {
    if (!blocks) return null

    for (const block of blocks) {
      // اگر بلاک مستقیم target باشد → container والد معتبر است
      if (block.id === elementId && block.type != 'internalSectionWrapper')
        return container

      // اگر internalSectionWrapper باشد → باید داخل sections برویم
      if (block.type === 'internalSectionWrapper') {
        for (const section of block.sections || []) {
          // اگر خود section هدف است → container والد آن block است
          if (section.id === elementId) return section

          // اگر آیتم در section.blocks باشد → parent همان section است
          if (section.blocks?.some((b: any) => b.id === elementId)) {
            return section
          }

          // جستجوی عمیق داخل section.blocks
          const deepInsideSection = deepSearch(section.blocks || [], section)
          if (deepInsideSection) return deepInsideSection
        }
      }

      // اگر block.blocks دارد → واردش می‌شویم
      if (Array.isArray(block.blocks)) {
        const deepInside = deepSearch(block.blocks, container)
        if (deepInside) return deepInside
      }
    }

    return null
  }

  // شروع جستجو از rows → columns
  for (const row of content.rows || []) {
    for (const column of row.columns || []) {
      // اگر خود column هدف باشد
      if (column.id === elementId) return column

      // اگر بلاک مستقیم داخل ستون باشد
      if (column.blocks?.some((block: any) => block.id === elementId)) {
        return column
      }

      // جستجوی عمیق داخل column.blocks با کانتینر column
      const found = deepSearch(column.blocks || [], column)
      if (found) return found
    }
  }

  return null
}

export default findElementContainer
