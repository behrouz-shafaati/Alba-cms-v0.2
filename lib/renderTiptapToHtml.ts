'use server'
const jsdom = require('jsdom')
const { JSDOM } = jsdom
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // برای HTML
import plaintext from 'highlight.js/lib/languages/plaintext'

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('css', css)
lowlight.register('html', xml)
lowlight.register('xml', xml)
lowlight.register('plaintext', plaintext)

import { getTextFromNode } from '@/components/tiptap-editor/utils'
import { Schema, DOMSerializer, Node as ProseNode } from 'prosemirror-model'
import slugify from './utils/slugify'

const accordionNodes = {
  accordion: {
    group: 'block',
    content: 'accordionItems',
    parseDOM: [{ tag: 'div[data-type="accordion"]' }],
    toDOM: () => ['div', { 'data-type': 'accordion', class: 'accordion' }, 0],
  },

  accordionItems: {
    content: 'accordionItem+',
    parseDOM: [{ tag: 'div[data-type="accordion-items"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-items', class: 'accordion-items' },
      0,
    ],
  },

  accordionItem: {
    content: 'accordionItemTitle accordionItemContent',
    parseDOM: [{ tag: 'div[data-type="accordion-item"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item', class: 'accordion-item' },
      0,
    ],
  },

  accordionItemTitle: {
    content: 'inline*',
    parseDOM: [{ tag: 'div[data-type="accordion-item-title"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item-title', class: 'accordion-title' },
      0,
    ],
  },

  accordionItemContent: {
    content: 'block+',
    parseDOM: [{ tag: 'div[data-type="accordion-item-content"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item-content', class: 'accordion-content' },
      0,
    ],
  },
}
const faqNodes = {
  faq: {
    group: 'block',
    content: 'accordionItems',
    parseDOM: [{ tag: 'div[data-type="faq"]' }],
    toDOM: () => ['div', { 'data-type': 'faq', class: 'accordion' }, 0],
  },
}

// 1. تعریف schema ساده بر اساس Tiptap StarterKit + image + link
const nodes = {
  doc: { content: 'block+' },
  undefined: {},
  paragraph: {
    content: 'inline*',
    group: 'block',
    attrs: {
      dir: { default: null },
      textAlign: { default: null },
      cite: { default: null },
    },
    parseDOM: [
      {
        tag: 'p',
        getAttrs: (el: any) => ({
          dir: el.getAttribute('dir'),
          textAlign: el.style.textAlign || null,
          cite: el.getAttribute('cite'),
        }),
      },
    ],
    toDOM: (node: any) => {
      const attrs: Record<string, string> = {}
      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign};`
      if (node.attrs.cite) attrs.cite = node.attrs.cite
      return ['p', { ...attrs }, 0]
    },
  },

  text: {
    group: 'inline',
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    attrs: {
      dir: { default: null },
      textAlign: { default: null },
      cite: { default: null },
    },
    parseDOM: [
      {
        tag: 'blockquote',
        getAttrs: (el: any) => ({
          dir: el.getAttribute('dir'),
          textAlign: el.style.textAlign || null,
          cite: el.getAttribute('cite'),
        }),
      },
    ],
    toDOM: (node: any) => {
      const attrs: Record<string, string> = {}
      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign};`
      if (node.attrs.cite) attrs.cite = node.attrs.cite

      return [
        'blockquote',
        {
          ...attrs,
          class:
            'border-l-4 border-gray-400 pl-4 italic text-gray-700 dark:text-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-md my-4 p-4',
        },
        0,
      ]
    },
  },

  listItem: {
    content: 'paragraph block*', // یک پاراگراف و بعد بلوک‌های دیگر
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },
  list_item: {
    content: 'paragraph block*', // یک پاراگراف و بعد بلوک‌های دیگر
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },

  bulletList: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ul' }],
    toDOM: () => ['ul', 0],
  },

  orderedList: {
    content: 'list_item+',
    group: 'block',
    attrs: { order: { default: 1 } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom: any) {
          return {
            order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1,
          }
        },
      },
    ],
    toDOM(node: any) {
      return node.attrs.order === 1
        ? ['ol', 0]
        : ['ol', { start: node.attrs.order }, 0]
    },
  },
  codeBlock: {
    content: 'text*',
    group: 'block',
    code: true,
    marks: '',
    defining: true,
    attrs: {
      language: { default: null },
    },
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: (el: any) => {
          return { language: el.getAttribute('language') }
        },
      },
    ],
    toDOM(node: any) {
      const language = node.attrs.language || 'plaintext'
      return [
        'pre',
        {
          class:
            'p-4 my-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto',
        },
        ['code', { class: `language-${language}` }, 0],
      ]
    },
  },
  image: {
    inline: true,

    attrs: {
      src: { default: null },
      id: { default: null },
      translations: { default: null },
      srcSmall: { default: null },
      srcMedium: { default: null },
      srcLarge: { default: null },
      width: { default: null },
      height: { default: null },
      patchSmall: { default: null },
      patchMedium: { default: null },
      patchLarge: { default: null },
      href: { default: null },
      target: { default: null },
      previewPath: { default: null },
      mimeType: { default: null },
      main: { default: null },
      user: { default: null },
      attachedTo: { default: null },
      createdAt: { default: null },
      updatedAt: { default: null },
      extension: { default: null },
      blurDataURL: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom: any) => ({
          src: '/assets/placeholder.jpg',
        }),
      },
    ],
    toDOM: (node: any) => {
      const {
        id,
        translations,
        srcSmall,
        srcMedium,
        srcLarge,
        width,
        height,
        blurDataURL,
      } = node.attrs
      const src = srcMedium || srcSmall || srcLarge || '/assets/placeholder.jpg'
      return [
        'img',
        {
          srcSmall,
          srcMedium,
          srcLarge,
          src,
          id: id,
          translations: translations ? JSON.stringify(translations) : null,
          width,
          height,
          blurDataURL,
        },
      ]
    },
  },
  hardBreak: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM: () => ['br'],
  },
  horizontalRule: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr', { style: 'padding-bottom: 32px;margin-top: 32px' }],
  },
  // 👇 تعریف adSlot برای رندر سمت سرور
  adSlot: {
    group: 'block',
    atom: true,
    attrs: {
      slotId: { default: null },
      linkedCampaign: { default: null },
      countOfBanners: { default: null },
      direction: { default: null },
      aspect: { default: null },
      fallbackBehavior: { default: null },
    },
    parseDOM: [
      {
        tag: 'ad-slot',
        getAttrs: (dom: any) => ({
          slotId: dom.getAttribute('data-slot-id'),
        }),
      },
    ],
    toDOM: (node: any) => {
      const {
        slotId,
        linkedCampaign,
        countOfBanners,
        direction,
        aspect,
        fallbackBehavior,
      } = node.attrs
      return [
        'ad-slot',
        {
          slotId,
          linkedCampaign,
          countOfBanners,
          direction,
          aspect,
          fallbackBehavior,
        },
      ]
    },
    // toDOM: (node) => [
    //   'ad-slot',
    //   node.attrs.slotId ? { 'data-slot-id': node.attrs.slotId } : {},
    // ],
  },
  heading: {
    content: 'inline*',
    group: 'block',
    defining: true,
    attrs: {
      level: { default: 1 }, // h1 تا h6
      dir: { default: null }, // راست‌چین یا چپ‌چین
      textAlign: { default: null }, // تراز متن
    },
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) {
      const attrs: any = {}

      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign}`

      // استخراج متن heading به صورت recursive
      const textContent = getTextFromNode(node)

      // اضافه کردن id
      if (textContent) attrs.id = slugify(textContent)

      return ['h' + node.attrs.level, attrs, 0]
    },
  },

  // ---------- 📌 نودهای جدول ----------
  table: {
    content: 'tableRow+',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    parseDOM: [{ tag: 'table' }],
    toDOM: () => ['table', ['tbody', 0]],
  },

  tableRow: {
    content: '(tableCell | tableHeader)+',
    tableRole: 'row',
    parseDOM: [{ tag: 'tr' }],
    toDOM: () => ['tr', 0],
  },

  tableCell: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'td',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'td',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
        class:
          'border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200',
      },
      0,
    ],
  },

  tableHeader: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'header_cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'th',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'th',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
        class:
          'border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100',
      },
      0,
    ],
  },
  ...accordionNodes,
  ...faqNodes,
  videoEmbed: {
    group: 'block',
    atom: true, // چون داخلش محتوای دیگری نمیاد

    attrs: {
      src: { default: null },
      title: { default: null },
    },

    parseDOM: [
      {
        tag: 'iframe[src]',
        getAttrs: (dom: any) => {
          const el = dom as HTMLIFrameElement
          return {
            src: el.getAttribute('src'),
            title: el.getAttribute('title'),
          }
        },
      },
    ],

    toDOM: (node: any) => [
      'iframe',
      {
        src: node.attrs.src,
        title: node.attrs.title || 'Embedded Video',
        width: '560',
        height: '315',
        allowfullscreen: 'true',
        loading: 'lazy',
        'data-type': 'videoEmbed',
      },
    ],
  },
  mention: {
    group: 'inline',
    inline: true,
    atom: true, // نود اتمی → یک واحد جدا
    selectable: false,

    attrs: {
      id: { default: null },
      label: { default: '' },
      mentionSuggestionChar: { default: '@' },
    },

    parseDOM: [
      {
        tag: 'span[data-mention]',
        getAttrs: (dom: HTMLElement) => ({
          id: dom.getAttribute('data-id'),
          label: dom.getAttribute('data-label'),
          mentionSuggestionChar: dom.getAttribute('data-char') || '@',
        }),
      },
    ],

    toDOM: (node) => [
      'span',
      {
        'data-mention': '',
        'data-id': node.attrs.id,
        'data-label': node.attrs.label,
        'data-char': node.attrs.mentionSuggestionChar,
        class: 'mention',
      },
      `${node.attrs.mentionSuggestionChar}${node.attrs.label}`,
    ],
  },
}

const marks = {
  bold: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },
  italic: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },
  underline: {
    parseDOM: [{ tag: 's' }, { tag: 's' }],
    toDOM: () => ['s', 0],
  },
  link: {
    attrs: {
      href: {},
      target: { default: '_blank' },
      rel: { default: 'noopener noreferrer' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom: any) => ({
          href: dom.getAttribute('href'),
          target: dom.getAttribute('target'),
          rel: dom.getAttribute('rel'),
        }),
      },
    ],
    toDOM: (mark) => ['a', mark.attrs, 0],
  },
  textStyle: {
    attrs: {
      color: { default: null },
      fontSize: { default: null },
      lineHeight: { default: null },
      textAlign: { default: null },
    },
    inclusive: true,
    group: 'inline',
    parseDOM: [
      {
        tag: 'span[style]',
        getAttrs(dom: any) {
          const style = dom.getAttribute('style') || ''

          const color = /color:\s*([^;]+)/i.exec(style)?.[1] || null
          const fontSize = /font-size:\s*([^;]+)/i.exec(style)?.[1] || null
          const lineHeight = /line-height:\s*([^;]+)/i.exec(style)?.[1] || null
          const textAlign = /text-align:\s*([^;]+)/i.exec(style)?.[1] || null

          if ([color, fontSize, lineHeight, textAlign].every((v) => !v)) {
            return false
          }

          return { color, fontSize, lineHeight, textAlign }
        },
      },
    ],
    toDOM(mark) {
      const style = []
      const _class = []

      if (mark.attrs.color?.light) {
        style.push(`--color-default:${mark.attrs.color.light.default}`)
        style.push(`--color-default-dark:${mark.attrs.color.dark.default}`)
        _class.push(`text-(--color-default) dark:text-(--color-default-dark)`)
        if (mark.attrs.color.light?.hover) {
          style.push(`--color-hover:${mark.attrs.color.light.hover}`)
          style.push(`--color-hover-dark:${mark.attrs.color.dark.hover}`)
          _class.push(
            `hover:text-(--color-hover) dark:hover:text-(--color-hover-dark)`,
          )
        }
        if (mark.attrs.color.light?.active) {
          style.push(`--color-active:${mark.attrs.color.light.active}`)
          style.push(`--color-active-dark:${mark.attrs.color.dark.active}`)
          _class.push(
            `active:text-(--color-active) dark:active:text-(--color-active-dark)`,
          )
        }
      }
      if (mark.attrs.fontSize) style.push(`font-size:${mark.attrs.fontSize}`)
      if (mark.attrs.lineHeight)
        style.push(`line-height:${mark.attrs.lineHeight}`)

      return ['span', { style: style.join(';'), class: _class.join(' ') }, 0]
    },
  },
  strike: {
    parseDOM: [
      { tag: 's' },
      { tag: 'del' },
      { tag: 'strike' },
      {
        style: 'text-decoration',
        getAttrs: (value) => {
          // value ممکنه چیزی مثل "line-through" یا "underline" باشه
          if (typeof value === 'string' && value.includes('line-through')) {
            return null // قبولش کن، بدون attrs
          }
          return false // رد کن
        },
      },
    ],
    toDOM() {
      // شبیه رفتار پیش‌فرض Tiptap Strike: از <s> استفاده می‌کنه
      return ['s', 0]
    },
  },
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return ['code', 0]
    },
  },
}

const schema = new Schema({ nodes, marks })
// if (!jsdom) {
//   throw new Error('parseHtml must be called on the server only!')
// }

// const { JSDOM } = jsdom
// 2. تابع نهایی تبدیل JSON → HTML
export async function renderTiptapJsonToHtml(json: any): string {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`)
  const document = dom.window.document

  const node = ProseNode.fromJSON(schema, json)
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    node.content,
    {
      document,
    },
  )

  const container = document.createElement('div')
  container.appendChild(fragment)
  // اعمال syntax highlighting
  syntaxCodeHighlighting(container)
  return container.innerHTML
}

const syntaxCodeHighlighting = (container: any) => {
  const codeBlocks = container.querySelectorAll('pre code')

  codeBlocks.forEach((codeElement: any) => {
    const code = codeElement.textContent || ''
    const classList = codeElement.getAttribute('class') || ''
    const languageMatch = classList.match(/language-(\w+)/)
    const language = languageMatch ? languageMatch[1] : 'plaintext'

    // برای plaintext یا زبان‌های ناشناخته، فقط escape کن
    if (language === 'plaintext' || !language) {
      codeElement.innerHTML = escapeHtml(code)
      return
    }

    try {
      const result = lowlight.highlight(language, code, { prefix: 'hljs-' })
      const html = toHtml(result)
      codeElement.innerHTML = html
    } catch (error) {
      // اگر زبان پشتیبانی نشد، escape ساده
      codeElement.innerHTML = escapeHtml(code)
    }
  })
}

// کمک‌کننده برای escape کردن کاراکترهای HTML
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// تابع کمکی برای تبدیل AST به HTML
function toHtml(node: any): string {
  if (!node) return ''

  if (node.type === 'text') {
    return escapeHtml(node.value || '')
  }

  if (node.type === 'element') {
    const children = (node.children || []).map(toHtml).join('')
    const className = node.properties?.className?.join(' ') || ''

    if (className) {
      return `<span class="${className}">${children}</span>`
    }
    return children
  }

  if (node.type === 'root') {
    return (node.children || []).map(toHtml).join('')
  }

  return ''
}
