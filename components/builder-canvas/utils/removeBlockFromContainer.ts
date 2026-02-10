const removeBlockFromContainer = (content: any, movedBlockId: string) => {
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

          // 1️⃣ حذف بلاک‌های مستقیم داخل column
          let newBlocks = (column.blocks || []).filter((block: any) => {
            if (!handled && block.id === movedBlockId) {
              handled = true
              columnChanged = true
              return false
            }
            return true
          })

          // 2️⃣ حذف بلاک از internalSection
          newBlocks = newBlocks.map((block: any) => {
            if (
              handled ||
              block.type !== 'internalSectionWrapper' ||
              !block.sections
            ) {
              return block
            }

            let wrapperChanged = false

            const newSections = block.sections.map((section: any) => {
              if (handled || !section.blocks) return section

              const filteredBlocks = section.blocks.filter(
                (inner: any) => inner.id !== movedBlockId
              )

              if (filteredBlocks.length !== section.blocks.length) {
                handled = true
                wrapperChanged = true
                return {
                  ...section,
                  blocks: filteredBlocks,
                }
              }

              return section
            })

            if (!wrapperChanged) return block

            columnChanged = true
            return {
              ...block,
              sections: newSections,
            }
          })

          if (!columnChanged) return column

          return {
            ...column,
            blocks: newBlocks,
          }
        }),
      }
    }),
  }
}

export default removeBlockFromContainer
