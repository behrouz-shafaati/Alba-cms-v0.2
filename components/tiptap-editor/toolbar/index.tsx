import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  HelpCircle,
  Italic,
  Link2,
  Link2Off,
  List,
  ListCollapse,
  ListOrdered,
  Megaphone,
  Minus,
  PilcrowLeft,
  PilcrowRight,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Underline as UnderlineIcon,
  Undo2,
  Image as ImageIcon,
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group'
import { Editor } from '@tiptap/core'
import { AddVideoButton } from '../component/AddVideoButton'
import StickyBox from 'react-sticky-box'
import ColorPickerPopover from '../../input/ColorPickerPopover'
import { useState } from 'react'

const MenuBar = ({
  editor,
  fileUploadSettings,
  setShowGallery,
}: {
  editor: Editor
  fileUploadSettings?: any
  setShowGallery?: (show: boolean) => void
}) => {
  if (!editor) {
    return null
  }
  const bold = () => editor.chain().focus().toggleBold().run()
  window.bold = bold
  const italic = () => editor.chain().focus().toggleItalic().run()
  window.italic = italic
  const underline = () => editor.chain().focus().toggleUnderline().run()
  window.underline = underline
  const strike = () => editor.chain().focus().toggleStrike().run()
  window.strike = underline
  const code = () => editor.chain().focus().toggleCode().run()
  window.code = code
  const clearMarks = () => editor.chain().focus().unsetAllMarks().run()
  window.clearMarks = clearMarks
  const clearNodes = () => editor.chain().focus().clearNodes().run()
  window.clearNodes = clearNodes
  const paragraph = () => editor.chain().focus().setParagraph().run()
  window.paragraph = paragraph
  const h1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run()
  window.h1 = h1
  const h2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  window.h2 = h2
  const h3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  window.h3 = h3
  const h4 = () => editor.chain().focus().toggleHeading({ level: 4 }).run()
  window.h4 = h4
  const h5 = () => editor.chain().focus().toggleHeading({ level: 5 }).run()
  window.h5 = h5
  const h6 = () => editor.chain().focus().toggleHeading({ level: 6 }).run()
  window.h6 = h6
  const bulletList = () => editor.chain().focus().toggleBulletList().run()
  window.bulletList = bulletList
  const orderedList = () => editor.chain().focus().toggleOrderedList().run()
  window.orderedList = orderedList
  const codeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  window.codeBlock = codeBlock
  const blockQuote = () => editor.chain().focus().toggleBlockquote().run()
  window.blockQuote = blockQuote
  const horizontalRule = () => editor.chain().focus().setHorizontalRule().run()
  window.horizontalRule = horizontalRule
  const hardBreak = () => editor.chain().focus().setHardBreak().run()
  window.hardBreak = hardBreak
  const undo = () => editor.chain().focus().undo().run()
  window.undo = undo
  const redo = () => editor.chain().focus().redo().run()
  window.redo = redo
  const left = () => editor.chain().focus().setTextAlign('left').run()
  window.left = left
  const center = () => editor.chain().focus().setTextAlign('center').run()
  window.center = center
  const right = () => editor.chain().focus().setTextAlign('right').run()
  window.right = right
  const justify = () => editor.chain().focus().setTextAlign('justify').run()
  window.justify = justify
  const rtl = () => editor?.commands.setDirection('rtl')
  window.rtl = rtl
  const ltr = () => editor?.commands.setDirection('ltr')
  window.ltr = ltr
  const link = () => {
    console.log("editor.isActive('link'):", editor.isActive('link'))
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  window.link = link

  const updateTextStyle = (attrs: Record<string, any>) => {
    const current = editor.getAttributes('textStyle')
    editor
      .chain()
      // .focus()
      .setMark('textStyle', {
        ...current,
        ...attrs,
      })
      .run()
  }
  window.updateTextStyle = updateTextStyle

  const insertTable = () =>
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  window.insertTable = insertTable

  const insertAdSlot = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'adSlot',
      })
      .run()

  window.insertAdSlot = insertAdSlot

  const insertAccordion = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'accordion',
        content: [
          {
            type: 'accordionItem',
            content: [
              {
                type: 'accordionItemTitle',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'عنوان اول' }],
                  },
                ],
              },
              {
                type: 'accordionItemContent',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'محتوای اول' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'accordionItem',
            content: [
              {
                type: 'accordionItemTitle',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'عنوان دوم' }],
                  },
                ],
              },
              {
                type: 'accordionItemContent',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'محتوای دوم' }],
                  },
                ],
              },
            ],
          },
        ],
      })
      .run()

  if (typeof window !== 'undefined') {
    ;(window as any).insertAccordion = insertAccordion
  }

  // برای تست می‌تونی بذاری روی window
  window.insertAccordion = insertAccordion

  const insertFaq = () =>
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'faq',
        content: [
          {
            type: 'accordionItem',
            content: [
              {
                type: 'accordionItemTitle',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'سوال اول' }],
                  },
                ],
              },
              {
                type: 'accordionItemContent',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'پاسخ سوال اول' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'accordionItem',
            content: [
              {
                type: 'accordionItemTitle',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'سوال دوم' }],
                  },
                ],
              },
              {
                type: 'accordionItemContent',
                content: [
                  {
                    type: 'paragraph',
                    attrs: { dir: 'rtl', textAlign: null },
                    content: [{ type: 'text', text: 'پاسخ سوال دوم' }],
                  },
                ],
              },
            ],
          },
        ],
      })
      .run()

  if (typeof window !== 'undefined') {
    ;(window as any).insertFaq = insertFaq
  }

  // برای تست می‌تونی بذاری روی window
  window.insertFaq = insertFaq

  const activeStates = {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
    strike: editor.isActive('strike'),
    quote: editor.isActive('quote'),
    code: editor.isActive('code'),
    paragraph: editor.isActive('paragraph'),
    h1: editor.isActive('heading', { level: 1 }),
    h2: editor.isActive('heading', { level: 2 }),
    h3: editor.isActive('heading', { level: 3 }),
    h4: editor.isActive('heading', { level: 4 }),
    h5: editor.isActive('heading', { level: 5 }),
    h6: editor.isActive('heading', { level: 6 }),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
    codeBlock: editor.isActive('codeBlock'),
    blockQuote: editor.isActive('blockquote'),
    left: editor.isActive({ textAlign: 'left' }),
    center: editor.isActive({ textAlign: 'center' }),
    right: editor.isActive({ textAlign: 'right' }),
    justify: editor.isActive({ textAlign: 'justify' }),
    link: editor.isActive('link'),
    rtl: editor.isActive('direction', { direction: 'rtl' }),
    ltr: editor.isActive('direction', { direction: 'ltr' }),

    // textStyle
    color: editor.getAttributes('textStyle')?.color,
    backgroundColor: editor.getAttributes('textStyle')?.backgroundColor,
    fontSize: editor.getAttributes('textStyle')?.fontSize,
    letterSpacing: editor.getAttributes('textStyle')?.letterSpacing,
    lineHeight: editor.getAttributes('textStyle')?.lineHeight,
  }

  const [active, setActive] = useState(activeStates)

  const data = {
    html: editor.getHTML(),
    json: editor.getJSON(),
  }

  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        data,
        activeStates,
      }),
    )
  }

  if (window.ReactNativeWebView) return null

  const getTypography = () => {
    if (activeStates.h1) return 'h1'
    if (activeStates.h2) return 'h2'
    if (activeStates.h3) return 'h3'
    if (activeStates.h4) return 'h4'
    if (activeStates.bulletList) return 'bulletList'
    if (activeStates.orderedList) return 'orderedList'
    return ''
  }

  const getAlign = () => {
    if (activeStates.left) return 'left'
    if (activeStates.right) return 'right'
    if (activeStates.center) return 'center'
    if (activeStates.justify) return 'justify'
    return ''
  }
  const getDirection = () => {
    if (activeStates.rtl) return 'rtl'
    if (activeStates.ltr) return 'ltr'
    return ''
  }

  editor.on('selectionUpdate', () => {
    const textStyle = editor.getAttributes('textStyle')
    setActive((prev) => ({ ...prev, ...textStyle }))
  })

  return (
    <>
      <StickyBox className=" z-10 flex flex-row items-center max-w-full gap-1 py-2 overflow-auto bg-white rtl dark:bg-slate-900">
        <select
          value={active.lineHeight || '1.8rem'}
          onChange={(e) =>
            updateTextStyle({
              lineHeight: e.target.value,
            })
          }
        >
          <option value="1rem">1</option>
          <option value="1.8rem">1.8</option>
          <option value="2rem">2</option>
          <option value="3rem">3</option>
          <option value="4rem">4</option>
          <option value="5rem">5</option>
          <option value="6rem">6</option>
          <option value="7rem">7</option>
          <option value="8rem">8</option>
          <option value="9rem">9</option>
          <option value="11rem">11</option>
          <option value="12rem">12</option>
          <option value="13rem">13</option>
          <option value="14rem">14</option>
          <option value="15rem">15</option>
          <option value="16rem">16</option>
        </select>
        <select
          value={active.fontSize || '16px'}
          onChange={(e) =>
            updateTextStyle({
              fontSize: e.target.value,
            })
          }
        >
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
          <option value="32px">36</option>
          <option value="32px">40</option>
          <option value="32px">44</option>
          <option value="32px">48</option>
        </select>
        <ColorPickerPopover
          key={JSON.stringify(active.color)}
          defaultValue={active.color || { light: {}, dark: {} }}
          onChange={(color) => {
            updateTextStyle({
              color: color,
            })
          }}
        />
        <ToggleGroup
          type="multiple"
          value={[
            activeStates.bold ? 'bold' : '',
            activeStates.italic ? 'italic' : '',
            activeStates.blockQuote ? 'blockQuote' : '',
            activeStates.strike ? 'strike' : '',
            activeStates.underline ? 'underline' : '',
          ]}
          className="rtl"
        >
          <ToggleGroupItem value="bold" onClick={bold} aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" onClick={italic} aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            onClick={underline}
            aria-label="Underline"
          >
            <UnderlineIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strike"
            onClick={strike}
            aria-label="Strike through"
          >
            <Strikethrough />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="blockQuote"
            onClick={blockQuote}
            aria-label="Block Quote"
          >
            <Quote />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="block w-px h-6 bg-border" />
        <ToggleGroup type="single" value={getTypography()} className="rtl">
          <ToggleGroupItem value="h1" onClick={h1} aria-label="H1">
            <Heading1 />
          </ToggleGroupItem>
          <ToggleGroupItem value="h2" onClick={h2} aria-label="H2">
            <Heading2 />
          </ToggleGroupItem>
          <ToggleGroupItem value="h3" onClick={h3} aria-label="H3">
            <Heading3 />
          </ToggleGroupItem>
          <ToggleGroupItem value="h4" onClick={h4} aria-label="H4">
            <Heading4 />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bulletList"
            onClick={bulletList}
            aria-label="Bullet list"
          >
            <List />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="orderedList"
            onClick={orderedList}
            aria-label="Ordered list"
          >
            <ListOrdered />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="block w-px h-6 bg-border" />
        <ToggleGroup type="single" value={getAlign()} className="rtl">
          <ToggleGroupItem value="left" onClick={left} aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="center"
            onClick={center}
            aria-label="Align center"
          >
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            onClick={right}
            aria-label="Align right"
          >
            <AlignRight />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="justify"
            onClick={justify}
            aria-label="Align justify"
          >
            <AlignJustify />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="block w-px h-6 bg-border" />
        <ToggleGroup type="single" value={getDirection()} className="rtl">
          <ToggleGroupItem
            value="rtl"
            onClick={rtl}
            title="راست چین"
            aria-label="Right to left"
          >
            <PilcrowLeft />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ltr"
            onClick={ltr}
            title="چپ چین"
            aria-label="Left to right"
          >
            <PilcrowRight />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="block w-px h-6 bg-border" />
        <ToggleGroup type="single" value="" className="rtl">
          <ToggleGroupItem value="link" onClick={link} aria-label="Link">
            {activeStates.link ? <Link2Off /> : <Link2 />}
          </ToggleGroupItem>
          <ToggleGroupItem
            value="horizontalRule"
            onClick={horizontalRule}
            aria-label="Horizontal rule"
          >
            <Minus />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="redo"
            onClick={redo}
            title="بازیابی تغییر"
            aria-label="Redo"
          >
            <Redo2 />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="undo"
            onClick={undo}
            title="لغو آخرین تغییر"
            aria-label="Undo"
          >
            <Undo2 />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="block w-px h-6 bg-border" />
        <ToggleGroup type="single" value="" className="rtl">
          <ToggleGroupItem
            value="link"
            onClick={() => setShowGallery?.(true)}
            title="تصویر"
            aria-label="Image"
          >
            <ImageIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="link"
            onClick={insertTable}
            title="جدول"
            aria-label="Table"
          >
            <Table />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="link"
            onClick={insertAdSlot}
            title="جایگاه تبلیغات"
            aria-label="Ad"
          >
            <Megaphone />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="link"
            onClick={insertAccordion}
            title="آکاردئون"
            aria-label="Accordion"
          >
            <ListCollapse />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="link"
            onClick={insertFaq}
            title="سوالات متداول"
            aria-label="FAQ"
          >
            <HelpCircle />
          </ToggleGroupItem>

          <AddVideoButton editor={editor} />
        </ToggleGroup>
      </StickyBox>
    </>
  )
}

export default MenuBar
