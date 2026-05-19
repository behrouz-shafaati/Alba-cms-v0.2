// store/useBuilderStore.ts
import { create } from 'zustand'
import { Block, Column, Content, DndSortable, Row } from '../types'
import objectId from '@/lib/utils/objectId'
import removeEmptyItems from '@/lib/utils/removeEmptyItems'
import updateContentItem from '../utils/updateContentItem'
import findElementById from '../utils/findElementById'

const defaultColumn = () => ({
  id: objectId(),
  type: 'column',
  colspan: 4,
  blocks: [],
})

type State = {
  activeElement: Block | null
  setActiveElement: (el: Block | null) => void
  content: Content
  resetContent: () => void
  setContent: (content: Content) => void
  addRow: (index: number | null, rowData?: any) => void
  addColumn: (rowId: string) => void
  getJson: () => string
  reorderRows: (sourceId: string, destinationId: string) => void
  updateRowColumns: (containerId: string, layout: string) => void
  deleteItem: (itemId: string) => void
  update: (itemId: string | null, key: string, value: any) => void
  selectedBlock: Block | null
  selectBlock: (block: Block) => void
  deselectBlock: () => void
  device: 'lg' | 'md' | 'sm'
  setDevice: (d: 'lg' | 'md' | 'sm') => void // sm:mobile md:tablet lg:descktop
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
  addRow: (index: number | null = null, rowData: any = null) =>
    set((state) => {
      const newRow = rowData
        ? {
            ...rowData,
            id: objectId(),
          }
        : {
            id: objectId(),
            type: 'row',
            classNames: '',
            styles: {},
            content: { rowColumns: '4-4-4' },
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
                    colspan: 12,
                    blocks: [],
                  },
                ],
              }
            : row,
        ),
      },
    })),
  /**
   *
   * @param sourceId Row ID to change location
   * @param destinationId
   */
  reorderRows: (sourceId, destinationId) =>
    set((state) => {
      const indexFrom = state.content.rows.findIndex(
        (row) => row.id == sourceId,
      )
      const indexTo = state.content.rows.findIndex(
        (row) => row.id === destinationId,
      )
      const updated = [...state.content.rows]
      const [moved] = updated.splice(indexFrom, 1)
      updated.splice(indexTo + (indexFrom < indexTo ? 0 : 0), 0, moved)
      return { ...state, content: { ...state.content, rows: updated } }
    }),
  updateRowColumns: (containerId, layout) => {
    const colspans = layout.split('-').map(Number)

    const rebuildColumns = (oldColumns, colspans) => {
      let index = 0
      return colspans.map((colspan) => {
        const old = oldColumns[index]
        index++
        return {
          id: objectId(),
          type: 'column',
          colspan,
          blocks: old?.blocks ? [...old.blocks] : [],
        }
      })
    }

    const rebuildSections = (oldSections, colspans) => {
      let index = 0
      return colspans.map((colspan) => {
        const old = oldSections[index]
        index++
        return {
          id: objectId(),
          type: 'internalSection',
          colspan,
          blocks: old?.blocks ? [...old.blocks] : [],
        }
      })
    }

    // recursive updater
    const recurse = (node) => {
      // CASE 1: row
      if (node.type === 'row' && node.id === containerId) {
        return {
          ...node,
          columns: rebuildColumns(node.columns, colspans),
          content: { ...node.content, rowColumns: layout },
        }
      }

      // CASE 2: internalSectionWrapper
      if (node.type === 'internalSectionWrapper' && node.id === containerId) {
        return {
          ...node,
          sections: rebuildSections(node.sections, colspans),
        }
      }

      // otherwise traverse children
      if (
        node.type === 'page' ||
        node.type === 'template' ||
        node.type === 'templateSegment' ||
        node.type === 'form'
      ) {
        return {
          ...node,
          rows: node.rows.map(recurse),
        }
      }

      if (node.type === 'row') {
        return {
          ...node,
          columns: node.columns.map((col) => recurse(col)),
        }
      }

      if (node.type === 'column') {
        return {
          ...node,
          blocks: node.blocks.map((b) => recurse(b)),
        }
      }

      if (node.type === 'internalSection') {
        return {
          ...node,
          blocks: node.blocks.map((b) => recurse(b)),
        }
      }

      if (node.type === 'internalSectionWrapper') {
        return {
          ...node,
          sections: node.sections.map((sec) => recurse(sec)),
        }
      }

      return node
    }

    set((state) => ({
      content: recurse(state.content),
    }))
  },
  update: (itemId, key, value) =>
    set((state) => {
      console.log(
        ' #77 in update store; key: ',
        key,
        '#234****** value:',
        value,
      )
      value = removeEmptyItems(value)

      const updatedContent = updateContentItem(
        state.content,
        itemId,
        key,
        value,
      )

      const selected = findElementById(updatedContent, itemId)
      if (selected) state.selectBlock(selected)

      return { content: updatedContent }
    }),
  deleteItem: (itemId) =>
    set((state) => {
      set({ selectedBlock: null })
      if (!itemId) return { content: { ...state.content } }
      // recursive delete
      const recurse = (node) => {
        if (!node || typeof node !== 'object') return node

        // اگر خود node هدف حذف بود → حذفش کن
        if (node.id === itemId) return null

        // هر نوع node را جدا بررسی می‌کنیم
        switch (node.type) {
          case 'templateSegment':
          case 'page':
          case 'template':
          case 'form':
            return {
              ...node,
              rows: node.rows.map(recurse).filter(Boolean), // حذف null
            }

          case 'row':
            return {
              ...node,
              columns: node.columns.map(recurse).filter(Boolean),
            }

          case 'column':
            return {
              ...node,
              blocks: node.blocks.map(recurse).filter(Boolean),
            }

          case 'internalSection':
            return {
              ...node,
              blocks: node.blocks.map(recurse).filter(Boolean),
            }

          case 'internalSectionWrapper':
            return {
              ...node,
              sections: node.sections.map(recurse).filter(Boolean),
            }

          default:
            // block معمولی
            if (node.id === itemId) return null
            return node
        }
      }

      return {
        content: recurse(state.content),
      }
    }),
  getJson: () => JSON.stringify(get().content, null, 2),
  selectedBlock: null,
  selectBlock: (block) => {
    console.log('select done!:', block)
    set({ selectedBlock: block })
  },
  deselectBlock: () => {
    console.log('deselect done!')
    set({ selectedBlock: null })
  },
  device: 'lg',
  setDevice: (d) => set(() => ({ device: d })),
}))
