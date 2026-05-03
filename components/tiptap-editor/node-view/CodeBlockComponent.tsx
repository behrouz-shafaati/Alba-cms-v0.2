// components/admin/editor/CodeBlockComponent.tsx
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { NodeViewProps } from '@tiptap/core'

export default function CodeBlockComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  const language = node.attrs.language || 'plaintext'

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="code-block-header">
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="code-block-language-selector"
          contentEditable={false}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
          <option value="bash">Bash</option>
          <option value="plaintext">Plain Text</option>
        </select>
      </div>
      <NodeViewContent as="pre" />
    </NodeViewWrapper>
  )
}
