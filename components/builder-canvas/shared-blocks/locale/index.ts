import Locale from './Locale'
import { localeSchema } from './schema'
import { localeDefaults } from './defaultSettings'
import { ContentEditor } from './ContentEditor'

export const LocaleBlockDef = {
  type: 'locale',
  label: 'انتخاب زبان',
  showInBlocksList: true,
  Renderer: Locale,
  settingsSchema: localeSchema,
  defaultSettings: localeDefaults,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
