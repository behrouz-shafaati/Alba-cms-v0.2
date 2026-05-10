import { ComponentType } from 'react'

export type Content = {
  id: string // UUID
  title: string
  rows: Row[]
}

export type Row = {
  id: string // UUID
  type: 'row'
  classNames?: {
    // tailwind classess
    manualInputs: string
  }
  styles: { [key: string]: string }
  settings: { rowColumns: string; sticky?: boolean }
  columns: Column[]
}

export type Column = {
  id: string // UUID
  width: number // مثلاً 6 یعنی 6 از 12 (مثل Bootstrap)
  type: 'column'
  classNames?: {
    // tailwind classess
    manualInputs: string
  }
  styles: { [key: string]: string }
  settings: { rowColumns: string }
  blocks: Block[]
}

export type Block = {
  widgetName?: string
  id: string // UUID
  title?: string // Optional title for the block
  slug?: string // Optional slug for the block, useful for custom blocks
  // The type is not updatable.
  type:
    | 'row'
    | 'column'
    | 'text'
    | 'write'
    | 'image'
    | 'video'
    | 'gallery'
    | 'form'
    | 'product'
    | 'custom'
    | 'templateSegment'
    | 'button'
    | 'adSlot'
    | 'internalSection'
  content?: object
  classNames?: {
    // tailwind classess
    manualInputs: string
  }
  styles?: {
    padding?: string
    margin?: string
    backgroundColor?: string
    borderRadius?: string
    visibility: {
      desktop: boolean
      tablet: boolean
      mobile: boolean
    }
    [key: string]: any
  }
  settings?: {
    [key: string]: any
  }
  children?: Block[]
  data?: any
}

export type DndSortable = {
  data: {
    current: {
      type: string
      parentId: string
      parentType: string
    }
  }
  id: string
}

export type BlockDefinitionType<
  PRenderer = any,
  PRenderEditor = any,
  PContentEditor = any,
> = {
  type: string
  label: string
  showInBlocksList: boolean
  Renderer: ComponentType<PRenderer>
  RendererInEditor: ComponentType<PRenderEditor>
  settingsSchema: object
  defaultSettings: object
  ContentEditor: ComponentType<PContentEditor>
  /**
   * In all canves expect
   */
  notTemplateFor?: Array<'form' | 'page' | 'templateSegment' | 'template'>
  /**
   * Just in canves
   */
  templateFor?: Array<'form' | 'page' | 'templateSegment' | 'template'>
}
