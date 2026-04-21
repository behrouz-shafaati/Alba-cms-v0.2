// import { TextBlock } from './TextBlock'
import blockSchema from './schema'
import { rowBlockDefaults } from './defaultSettings'
import ContentEditor from './ContentEditor'

export const RowBlockDef = {
  type: 'row',
  label: 'سطر',
  showInBlocksList: false,
  // Renderer: TextBlock,
  settingsSchema: blockSchema,
  defaultSettings: rowBlockDefaults,
  ContentEditor: ContentEditor,
}
