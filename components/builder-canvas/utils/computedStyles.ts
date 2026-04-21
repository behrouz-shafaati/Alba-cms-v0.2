import parseCssStringToObject from '@/lib/utils/parseCssStringToObject'

const computedStyles = (
  styles?: Record<string, string>,
): Record<string, string | number> => {
  const safeStyles = styles ?? {}
  let result: Record<string, string | number> = {}

  const colorModes = ['light', 'dark'] as const
  const colorStates = ['default', 'hover', 'active'] as const

  for (const [key, value] of Object.entries(safeStyles)) {
    if (value)
      switch (key) {
        case 'backgroundColor':
          for (const mode of colorModes) {
            for (const state of colorStates) {
              const val = value?.[mode]?.[state]
              if (!val) continue

              const key =
                mode === 'light' ? `--bg-${state}` : `--bg-${state}-dark`

              result[key] = val
            }
          }
          break
        case 'textColor':
          for (const mode of colorModes) {
            for (const state of colorStates) {
              const val = value?.[mode]?.[state]
              if (!val) continue

              const key =
                mode === 'light' ? `--txt-${state}` : `--txt-${state}-dark`

              result[key] = val
            }
          }
          break
        case 'border':
          if (value?.color)
            for (const mode of colorModes) {
              for (const state of colorStates) {
                const val = value?.color?.[mode]?.[state]
                if (!val) continue

                const key =
                  mode === 'light'
                    ? `--borderColor-${state}`
                    : `--borderColor-${state}-dark`

                result[key] = val
              }
            }

          if (value?.width)
            result['borderWidth'] = value?.width + 'px !important'
          result['borderTop'] = value?.top
          result['borderRight'] = value?.right
          result['borderBottom'] = value?.bottom
          result['borderLeft'] = value?.left
          break
        case 'opacity':
          const num = parseFloat(value)
          result.opacity = isNaN(num) ? 1 : Math.min(Math.max(num / 100, 0), 1)
          break
        case 'padding':
          result.padding = `${value?.top || 0}px ${value?.right || 0}px ${
            value?.bottom || 0
          }px ${value?.left || 0}px`
          break
        case 'margin':
          result.margin = `${value?.top || 0}px ${value?.right || 0}px ${
            value?.bottom || 0
          }px ${value?.left || 0}px`
          break
        case 'borderRadius':
          result.borderRadius = `${value?.top || 0}px ${value?.right || 0}px ${
            value?.bottom || 0
          }px ${value?.left || 0}px`
          break
        case 'boxShadow':
          result['boxShadow'] = `${value?.inset ? 'inset ' : ''}${
            value?.x || 0
          }px ${value?.y || 0}px ${value?.blur || 0}px ${value?.spread || 0}px ${
            value?.color || ''
          }`
          break
        case 'fontSize':
          result.fontSize = `${value}px`
          break
        case 'layout':
          result.width = value?.width ? `${value?.width}px` : 'auto'
          result.height = value?.height ? `${value?.height}px` : 'auto'
          break
        case 'css':
          const cssObject = parseCssStringToObject(value?.allDevices || '{}')
          result = { ...result, ...cssObject }
          break
        case 'visibility':
        case 'tailwindClasses':
          break
        default:
          result[key] = value
      }
  }
  return result
}

export default computedStyles
