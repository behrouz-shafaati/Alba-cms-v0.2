import { Render } from './Render'
import { schema } from './schema'
import { defaultSetings } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const IconCardBlockDef = {
  type: 'iconCard',
  label: 'آیکون کارت',
  showInBlocksList: true,
  Renderer: Render,
  settingsSchema: schema,
  defaultSettings: defaultSetings,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
