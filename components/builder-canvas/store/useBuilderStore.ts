// store/useBuilderStore.ts
import { create } from 'zustand'
import { Block, Column, Content, DndSortable, Row } from '../types'
import objectId from '@/lib/utils/objectId'

const defaultColumn = () => ({
  id: objectId(),
  type: 'column',
  width: 4,
  blocks: [],
})

type State = {
  activeElement: Block | null
  setActiveElement: (el: Block | null) => void
  content: Content
  resetContent: () => void
  setContent: (content: Content) => void
  addRow: (index: number | null) => void
  addColumn: (rowId: string) => void
  addElementToColumn: (colId: string, element: Block) => void
  addElementToInternalSection: (
    colId: string,
    sectionId: string,
    element: Block
  ) => void
  moveElementWithinColumn: (
    colId: string,
    oldIndex: number,
    newIndex: number
  ) => void
  moveElementBetweenColumns: (
    sourceColId: string,
    targetColId: string,
    elementId: string,
    newIndex: number
  ) => void
  getJson: () => string
  reorderRows: (sourceId: string, destinationId: string) => void
  updateRowColumns: (containerId: string, layout: string) => void
  deleteItem: (itemId: string) => void
  update: (itemId: string | null, key: string, value: any) => void
  selectedBlock: Block | null
  selectBlock: (block: Block) => void
  deselectBlock: () => void
}

const initialContent = {
  title: '',
  status: 'published',
  rows: [],
}

export const useBuilderStore = create<State>((set, get) => ({
  content: initialContent,
  resetContent: () => set({ content: initialContent }),
  setContent: (content) => set({ content }),
  rows: [],
  activeElement: null,
  setActiveElement: (el) => set(() => ({ activeElement: el })),
  addRow: (index: number | null = null) =>
    set((state) => {
      const newRow = {
        id: objectId(),
        type: 'row',
        classNames: '',
        styles: {},
        settings: { rowColumns: '4-4-4' },
        columns: [defaultColumn(), defaultColumn(), defaultColumn()],
      }

      const rows = [...state.content.rows]

      if (index === null || index >= rows.length) {
        // اضافه کردن در آخر
        rows.push(newRow)
      } else {
        // اضافه کردن در موقعیت مشخص
        rows.splice(index, 0, newRow)
      }

      return {
        content: {
          ...state.content,
          rows,
        },
      }
    }),
  addColumn: (rowId) =>
    set((state) => ({
      content: {
        ...state.content,
        rows: state.content.rows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                columns: [
                  ...row.columns,
                  {
                    id: objectId(),
                    type: 'column',
                    width: 12,
                    blocks: [],
                  },
                ],
              }
            : row
        ),
      },
    })),

  addElementToColumn: (colId, element) =>
    set((state) => {
      const row = state.content.rows.find((r) =>
        r.columns.find((c) => c.id === colId)
      )
      if (!row) return state

      return {
        content: {
          ...state.content,
          rows: state.content.rows.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  columns: r.columns.map((c) =>
                    c.id === colId
                      ? { ...c, blocks: [...c.blocks, element] }
                      : c
                  ),
                }
              : r
          ),
        },
      }
    }),
  addElementToInternalSection: (colId, sectionId, element) =>
    set((state) => {
      const row = state.content.rows.find((r) =>
        r.columns.find((c) => c.id === colId)
      )
      if (!row) return state

      return {
        content: {
          ...state.content,
          rows: state.content.rows.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  columns: r.columns.map((c) =>
                    c.id === colId
                      ? {
                          ...c,
                          blocks: c.blocks.map((b) =>
                            b.id === sectionId
                              ? { ...b, blocks: [...b?.blocks, element] }
                              : b
                          ),
                        }
                      : c
                  ),
                }
              : r
          ),
        },
      }
    }),

  moveElementWithinColumn: (colId, oldIndex, newIndex) =>
    set((state) => {
      const newRows = state.content.rows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => {
          if (col.id !== colId) return col

          const updated = [...col.blocks]
          const [moved] = updated.splice(oldIndex, 1)
          updated.splice(newIndex, 0, moved)

          return { ...col, blocks: updated }
        }),
      }))

      return { content: { ...state.content, rows: newRows } }
    }),

  moveElementBetweenColumns: (sourceColId, targetColId, elementId, newIndex) =>
    set((state) => {
      let movedElement: Block | undefined

      const updatedRows = state.content.rows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((col) => {
            // حذف از ستون مبدا
            if (col.id === sourceColId) {
              const filtered = col.blocks.filter((el) => {
                if (el.id === elementId) {
                  movedElement = el
                  return false
                }
                return true
              })
              return { ...col, blocks: filtered }
            }
            return col
          }),
        }
      })

      const finalRows = updatedRows.map((row) => {
        return {
          ...row,
          columns: row.columns.map((col) => {
            // اضافه به ستون مقصد
            if (col.id === targetColId && movedElement) {
              const updated = [...col.blocks]
              updated.splice(newIndex, 0, movedElement)
              return { ...col, blocks: updated }
            }
            return col
          }),
        }
      })

      return { content: { ...state.content, rows: finalRows } }
    }),
  /**
   *
   * @param sourceId Row ID to change location
   * @param destinationId
   */
  reorderRows: (sourceId, destinationId) =>
    set((state) => {
      const indexFrom = state.content.rows.findIndex(
        (row) => row.id == sourceId
      )
      const indexTo = state.content.rows.findIndex(
        (row) => row.id === destinationId
      )
      const updated = [...state.content.rows]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return { ...state, content: { ...state.content, rows: updated } }
    }),

  /**
   *
   * @param containerId
   * @param layout
   */
  updateRowColumns: (containerId, layout) => {
    console.log('#234 containerId:', containerId, '#234 layout:', layout)
    const widths = layout.split('-').map(Number)

    set((state) => ({
      content: {
        ...state.content,
        rows: state.content.rows.map((row) => {
          let newColumns: Column[] = row.columns
          if (row.id == containerId) {
            let index = -1
            // ساخت ستون‌های جدید
            newColumns = widths.map((width) => {
              index++
              return {
                id: objectId(),
                type: 'column',
                width,
                blocks: row.columns[index]?.blocks || [], // اگه وجود نداشت، آرایه‌ی خالی
              }
            })
            return {
              ...row,
              columns: newColumns,
            }
          }

          // رفتن سراغ بخش های داخلی
          newColumns = row.columns.map((column) => {
            let newBlocks = column.blocks
            newBlocks = column.blocks.map((block) => {
              console.log('#234 block:', block)
              if (block.id == containerId) {
                // => Block is internalSectionWrapper
                let newSections = block.sections
                let index = -1
                // ساخت سکشن جدید
                newSections = widths.map((width) => {
                  index++
                  return {
                    id: objectId(),
                    type: 'internalSection',
                    width,
                    blocks: block.sections[index]?.blocks || [], // اگه وجود نداشت، آرایه‌ی خالی
                  }
                })
                return { ...block, sections: newSections }
              }
              return block
            })
            return { ...column, blocks: newBlocks }
          })

          return {
            ...row,
            columns: newColumns,
          }
        }),
      },
    }))
  },

  /**
   *
   * @param itemId
   * @param key
   * @param value
   */
  update: (itemId, key, value) =>
    set((state) => {
      console.log('#2344 ', key, ':', value)
      if (itemId == null) {
        console.log(key, ':', value)
        return {
          content: { ...state.content, [key]: value },
        }
      }
      const updatedRows = state.content.rows.map((row) => {
        let updatedRow = row
        if (row.id === itemId) {
          updatedRow = { ...row, [key]: value }
          state.selectBlock(updatedRow)
          return updatedRow
        }

        const updatedColumns = row.columns.map((column) => {
          let updatedColumn = column
          if (column.id === itemId) {
            // آپدیت ستون
            updatedColumn = { ...column, [key]: value }
            state.selectBlock(updatedColumn)
            return updatedColumn
          }

          const updatedBlocks = column.blocks.map((block) => {
            let updatedBlock = block
            if (block.id == itemId) {
              updatedBlock = updatdElement(block, key, value)
              state.selectBlock(updatedBlock)

              console.log('#234098 updatedBlock:', updatedBlock)
              return updatedBlock
            }
            if (block.type == 'internalSectionWrapper') {
              const updatedSections = block.sections.map((section) => {
                let updatedSection = section
                if (section.id == itemId) {
                  updatedSection = updatdElement(updatedSection, key, value)
                  state.selectBlock(updatedSection)
                  return updatedSection
                }
                const updatedSectionBlocks = section.blocks.map((block) => {
                  let updatedBlock = block
                  if (block.id === itemId) {
                    updatedBlock = updatdElement(block, key, value)
                    state.selectBlock(updatedBlock)
                    return updatedBlock
                  }
                  return updatedBlock
                })
                return { ...section, blocks: updatedSectionBlocks }
              })
              return { ...block, sections: updatedSections }
            }
            return updatedBlock
          })
          console.log('#3245 updatedBlocks:', updatedBlocks)
          return { ...column, blocks: updatedBlocks }
        })

        return { ...row, columns: updatedColumns }
      })

      return {
        content: { ...state.content, rows: updatedRows },
      }
    }),

  /**
   *
   * @param itemId
   */
  deleteItem: (itemId) =>
    set((state) => {
      if (itemId == null) {
        return { content: { ...state.content } }
      }

      const updatedRows = state.content.rows
        .filter((row) => row.id !== itemId) // حذف row در صورتی که id برابر باشد
        .map((row) => {
          const updatedColumns = row.columns
            .filter((column) => column.id !== itemId) // حذف column در صورت match شدن id
            .map((column) => {
              const updatedBlocks = column.blocks
                .filter((block) => block.id !== itemId)
                .map((block) => {
                  if (block.type !== 'internalSectionWrapper') return block
                  const updatedSections = block.sections.map(
                    (internalSection) => {
                      const updatedSectionBlocks =
                        internalSection.blocks.filter(
                          (block) => block.id != itemId
                        )
                      return {
                        ...internalSection,
                        blocks: updatedSectionBlocks,
                      }
                    }
                  )

                  return { ...block, sections: updatedSections }
                })

              return { ...column, blocks: updatedBlocks }
            })

          return { ...row, columns: updatedColumns }
        })

      return {
        content: { ...state.content, rows: updatedRows },
      }
    }),
  getJson: () => JSON.stringify(get().content, null, 2),
  selectedBlock: null,
  selectBlock: (block) => {
    console.log('select done!')
    set({ selectedBlock: block })
  },
  deselectBlock: () => {
    console.log('deselect done!')
    set({ selectedBlock: null })
  },
}))

const updatdElement = (elemet: any, key: any, value: any) => {
  // آپدیت محتوا
  if (key === 'content') {
    return {
      ...elemet,
      content: value,
    }
  }
  // آپدیت استایل
  if (key === 'styles' && typeof value === 'object') {
    return {
      ...elemet,
      styles: value,
    }
  }
  // آپدیت کلاس
  if (key === 'classNames' && typeof value === 'object') {
    return {
      ...elemet,
      classNames: value,
    }
  }
  // آپدیت تنظمیات بلاک
  if (key === 'settings' && typeof value === 'object') {
    return {
      ...elemet,
      settings: value,
    }
  }
}
