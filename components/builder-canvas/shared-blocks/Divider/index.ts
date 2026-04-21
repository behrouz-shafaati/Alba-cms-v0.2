import { Block } from './Block'
import { BlockSchema } from './schema'
import { BlockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const DividerBlockDef = {
  type: 'divider',
  label: 'جدا کننده',
  showInBlocksList: true,
  Renderer: Block,
  settingsSchema: BlockSchema,
  defaultSettings: BlockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: [''],
}
