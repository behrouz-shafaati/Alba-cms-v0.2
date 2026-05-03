import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import { cn } from '@/lib/utils'
import { FieldTemplateProps } from '@rjsf/utils'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

const devices: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']

export default function CustomFieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    classNames,
    label,
    required,
    description,
    errors,
    children,
    schema,
  } = props
  const { device, setDevice } = useBuilderStore()
  const isResponsive = schema?.['x-responsive']

  // پیدا کردن device بعدی برای چرخه روی آیکون
  const handleToggleDevice = () => {
    const currentIndex = devices.indexOf(device as any)
    const nextDevice = devices[(currentIndex + 1) % devices.length]
    setDevice(nextDevice)
  }

  const renderDeviceIcon = () => {
    switch (device) {
      case 'sm':
        return <Smartphone className="w-4 h-4" />
      case 'md':
        return <Tablet className="w-4 h-4" />
      case 'lg':
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getDeviceLabel = () => {
    switch (device) {
      case 'sm':
        return 'Mobile'
      case 'md':
        return 'Tablet'
      case 'lg':
      default:
        return 'Desktop'
    }
  }

  return (
    <div className={cn(classNames, `my-2`)}>
      <div className="flex gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-muted-foreground"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {isResponsive && (
          <button
            type="button"
            onClick={handleToggleDevice}
            // اگر shadcn داری خیلی خوب، در غیر این صورت className ساده نگه‌دار
            className={cn(
              'inline-flex items-center justify-center rounded-md border',
              'border-border bg-background px-2 py-1',
              'text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'transition-colors',
            )}
            title={`${getDeviceLabel()}`}
          >
            {renderDeviceIcon()}
          </button>
        )}
      </div>
      <div className="flex gap-2 items-center mt-1">{children}</div>

      {description}
      {errors}
    </div>
  )
}
