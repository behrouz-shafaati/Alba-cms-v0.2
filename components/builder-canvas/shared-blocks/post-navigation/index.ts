import { schema } from './schema'
import { defaultsContent } from './defaultContent'
import { ContentEditor } from './ContentEditor'
import RenderEditorBlock from './RenderEditor'
import { BlockDefinitionType } from '../../types'
import { RenderServerBlock } from './RenderServer'

export const PostNavigationBlockDef: BlockDefinitionType = {
  type: 'postNavigation',
  label: 'ناوبری پست',
  showInBlocksList: true,
  Renderer: RenderServerBlock,
  RendererInEditor: RenderEditorBlock,
  settingsSchema: schema,
  defaultSettings: defaultsContent,
  ContentEditor: ContentEditor,
  notTemplateFor: ['form'],
}
