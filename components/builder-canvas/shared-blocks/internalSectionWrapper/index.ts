// import { TextBlock } from './TextBlock'
import blockSchema from './schema'
import { columnBlockDefaults } from './defaultSettings'
import ContentEditor from './ContentEditor'
import sectionWrapperEditor from './sectionWrapperEditor'
import sectionWrapper from './sectionWrapper'

export const InternalSectionWrapperBlockDef = {
  type: 'internalSectionWrapper',
  label: 'بخش داخلی',
  showInBlocksList: true,
  Renderer: sectionWrapper,
  RendererInEditor: sectionWrapperEditor,
  settingsSchema: blockSchema,
  defaultSettings: columnBlockDefaults,
  ContentEditor: ContentEditor,
}
