import slugify from './slugify'

// types
export type TiptapNode = {
  type: string
  attrs?: { level?: number }
  content?: TiptapNode[]
  text?: string
}

export type HeadingItem = {
  level: number
  text: string
  id: string
  children: HeadingItem[]
}

export function generateTableOfContents(json: { content: TiptapNode[] }) {
  const flat = extractHeadings(json.content)
  return buildTree(flat)
}

// استخراج headingها از JSON tiptap
function extractHeadings(nodes: TiptapNode[], result: any[] = []) {
  for (const node of nodes) {
    if (node.type === 'heading' && node.attrs?.level) {
      const text = extractText(node)
      result.push({
        level: node.attrs.level,
        text,
        id: slugify(text),
      })
    }
    if (node.content) {
      extractHeadings(node.content, result)
    }
  }
  return result
}

// گرفتن متن از node
function extractText(node: TiptapNode): string {
  if (node.text) return node.text
  if (node.content) return node.content.map(extractText).join('')
  return ''
}

// ساخت درخت از headingهای فلت
function buildTree(
  headings: { level: number; text: string; id: string }[],
): HeadingItem[] {
  const root: HeadingItem[] = []
  const stack: HeadingItem[] = []

  for (const h of headings) {
    const item: HeadingItem = { ...h, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(item)
      stack.push(item)
    } else {
      stack[stack.length - 1].children.push(item)
      stack.push(item)
    }
  }

  return root
}
