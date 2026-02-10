const extractMovedBlockContent = (container: any, movedBlockId: string) => {
  // 1️⃣ جستجو در بلاک‌های مستقیم داخل column
  for (const block of container.blocks || []) {
    if (block.id === movedBlockId) {
      return block
    }
  }
  return null
}

export default extractMovedBlockContent
