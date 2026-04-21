import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import { cn } from '@/lib/utils'
import { FieldTemplateProps } from '@rjsf/utils'

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

  return (
    <div className={cn(classNames, `my-2`)}>
      <div className="flex gap-2">
        {label && (
          <label htmlFor={id}>
            {label}
            {required && '*'}
          </label>
        )}
        {isResponsive && (
          <div className="flex gap-1">
            <button onClick={() => setDevice('sm')}>🖥</button>
            <button onClick={() => setDevice('md')}>📱</button>
            <button onClick={() => setDevice('lg')}>📟</button>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center">{children}</div>

      {description}
      {errors}
    </div>
  )
}
