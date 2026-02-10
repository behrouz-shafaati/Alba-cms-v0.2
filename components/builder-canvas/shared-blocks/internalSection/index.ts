// import { TextBlock } from './TextBlock'
import blockSchema from './schema'
import { columnBlockDefaults } from './defaultSettings'
import ContentEditor from './ContentEditor'
import internalSection from './internalSectionEditor'

export const InternalSectionBlockDef = {
  type: 'internalSection',
  label: 'بخش داخلی',
  showInBlocksList: false,
  RendererEditor: internalSection,
  settingsSchema: blockSchema,
  defaultSettings: columnBlockDefaults,
  ContentEditor: ContentEditor,
}
