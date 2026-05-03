import { Render } from './RenderIcon'
import { schema } from './schema'
import { blockDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const IconBlockDef = {
  type: 'icon',
  label: 'آیکون',
  showInBlocksList: true,
  Renderer: Render,
  settingsSchema: schema,
  defaultSettings: blockDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: [],
}
