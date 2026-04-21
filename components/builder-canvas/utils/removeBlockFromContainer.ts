// const removeBlockFromContainer = (content: any, movedBlockId: string) => {
//   let handled = false

//   return {
//     ...content,
//     rows: content.rows.map((row: any) => {
//       if (handled) return row

//       return {
//         ...row,
//         columns: row.columns.map((column: any) => {
//           if (handled) return column

//           let columnChanged = false

//           // 1️⃣ حذف بلاک‌های مستقیم داخل column
//           let newBlocks = (column.blocks || []).filter((block: any) => {
//             if (!handled && block.id === movedBlockId) {
//               handled = true
//               columnChanged = true
//               return false
//             }
//             return true
//           })

//           // 2️⃣ حذف بلاک از internalSection
//           newBlocks = newBlocks.map((block: any) => {
//             if (
//               handled ||
//               block.type !== 'internalSectionWrapper' ||
//               !block.sections
//             ) {
//               return block
//             }

//             let wrapperChanged = false

//             const newSections = block.sections.map((section: any) => {
//               if (handled || !section.blocks) return section

//               const filteredBlocks = section.blocks.filter(
//                 (inner: any) => inner.id !== movedBlockId
//               )

//               if (filteredBlocks.length !== section.blocks.length) {
//                 handled = true
//                 wrapperChanged = true
//                 return {
//                   ...section,
//                   blocks: filteredBlocks,
//                 }
//               }

//               return section
//             })

//             if (!wrapperChanged) return block

//             columnChanged = true
//             return {
//               ...block,
//               sections: newSections,
//             }
//           })

//           if (!columnChanged) return column

//           return {
//             ...column,
//             blocks: newBlocks,
//           }
//         }),
//       }
//     }),
//   }
// }
const removeBlock = (node, blockId) => {
  if (!node || typeof node !== 'object') return node

  switch (node.type) {
    case 'column':
      return {
        ...node,
        blocks: node.blocks
          .filter((b) => b.id !== blockId)
          .map((b) => removeBlock(b, blockId)),
      }

    case 'internalSection':
      return {
        ...node,
        blocks: node.blocks
          .filter((b) => b.id !== blockId)
          .map((b) => removeBlock(b, blockId)),
      }

    case 'internalSectionWrapper':
      return {
        ...node,
        sections: node.sections.map((s) => removeBlock(s, blockId)),
      }

    case 'page':
      return {
        ...node,
        rows: node.rows.map((r) => removeBlock(r, blockId)),
      }

    case 'row':
      return {
        ...node,
        columns: node.columns.map((c) => removeBlock(c, blockId)),
      }

    default:
      return node
  }
}

export default removeBlock
