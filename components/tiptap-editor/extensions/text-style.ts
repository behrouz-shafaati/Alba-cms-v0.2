import { Mark } from '@tiptap/core'

export const TextStyle = Mark.create({
  name: 'textStyle',

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: null,
      },

      fontSize: {
        default: null,
      },

      backgroundColor: {
        default: null,
      },

      letterSpacing: {
        default: null,
      },

      lineHeight: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[style]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const style: string[] = []
    const _class: string[] = []

    if (HTMLAttributes.color) {
      if (HTMLAttributes.color?.light)
        style.push(`--color-default:${HTMLAttributes.color.light.default}`)
      style.push(`--color-default-dark:${HTMLAttributes.color.dark.default}`)
      _class.push(`text-(--color-default) dark:text-(--color-default-dark)`)
      if (HTMLAttributes.color.light?.hover) {
        style.push(`--color-hover:${HTMLAttributes.color.light.hover}`)
        style.push(`--color-hover-dark:${HTMLAttributes.color.dark.hover}`)
        _class.push(
          `hover:text-(--color-hover) dark:hover:text-(--color-hover-dark)`,
        )
      }
      if (HTMLAttributes.color.light?.active) {
        style.push(`--color-active:${HTMLAttributes.color.light.active}`)
        style.push(`--color-active-dark:${HTMLAttributes.color.dark.active}`)
        _class.push(
          `active:text-(--color-active) dark:active:text-(--color-active-dark)`,
        )
      }
    }

    if (HTMLAttributes.fontSize) {
      style.push(`font-size:${HTMLAttributes.fontSize}`)
    }

    if (HTMLAttributes.backgroundColor) {
      style.push(`background-color:${HTMLAttributes.backgroundColor}`)
    }

    if (HTMLAttributes.letterSpacing) {
      style.push(`letter-spacing:${HTMLAttributes.letterSpacing}`)
    }

    if (HTMLAttributes.lineHeight) {
      style.push(`line-height:${HTMLAttributes.lineHeight}`)
    }

    if (!style.length) {
      return ['span', 0]
    }

    return [
      'span',
      {
        style: style.join(';'),
        class: _class.join(' '),
      },
      0,
    ]
  },
})
