import insertWithPosition from '@/lib/utils/insertWithPosition'

export default function addBlockToContainer(
  content: any,
  goalContainerId: string,
  movedBlock: any,
  position: 'start' | 'end' | number = 'end'
) {
  let handled = false
  return {
    ...content,
    rows: content.rows.map((row: any) => {
      if (handled) return row

      return {
        ...row,
        columns: row.columns.map((column: any) => {
          if (handled) return column

          let columnChanged = false

          // 1️⃣ تلاش برای internalSection (از طریق wrapper)
          const newBlocks = (column.blocks || []).map((block: any) => {
            if (
              handled ||
              block.type !== 'internalSectionWrapper' ||
              !block.sections
            ) {
              return block
            }

            let wrapperChanged = false

            const newSections = block.sections.map((section: any) => {
              if (handled || section.id !== goalContainerId) return section

              handled = true
              wrapperChanged = true

              return {
                ...section,
                blocks: insertWithPosition(
                  section.blocks || [],
                  movedBlock,
                  position
                ),
              }
            })

            if (!wrapperChanged) return block

            columnChanged = true
            return {
              ...block,
              sections: newSections,
            }
          })

          if (handled) {
            return {
              ...column,
              blocks: newBlocks,
            }
          }

          // 2️⃣ اگر target خود column بود
          if (column.id === goalContainerId) {
            handled = true
            return {
              ...column,
              blocks: insertWithPosition(
                column.blocks || [],
                movedBlock,
                position
              ),
            }
          }

          return columnChanged ? { ...column, blocks: newBlocks } : column
        }),
      }
    }),
  }
}
