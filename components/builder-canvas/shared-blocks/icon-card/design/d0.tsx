import IconRender from '@/components/builder-canvas/components/IconRender'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'
import { combineClassNames } from '@/components/builder-canvas/utils/styleUtils'
import { LinkAlba } from '@/components/other/link-alba'
import { cn } from '@/lib/utils'

const D0 = ({ blockData, ...props }: ButtonBlockProps) => {
  const { content } = blockData
  const { className, ...resProps } = props

  const Tag = content?.href ? LinkAlba : 'div'

  return (
    <Tag
      href={content?.href || undefined}
      className={cn(
        'flex flex-col justify-center  w-full p-4 rounded-2xl border',
        className || '',
        content?.backgroundColor?.default || '',
        content?.backgroundColor?.hover || '',
        content?.backgroundColor?.focus || '',
        content?.backgroundColor?.active || '',
        combineClassNames(computedStyles(blockData.styles)),
      )}
      style={{
        ...computedStyles(blockData.styles),
      }}
      {...resProps}
    >
      {content?.icon && (
        <div
          className={cn(
            'flex justify-center items-center w-24 h-24 rounded-[100%] mb-4',

            combineClassNames(
              computedStyles({
                backgroundColor: content?.iconBgColor,
              }),
            ),
          )}
          style={computedStyles({
            backgroundColor: content?.iconBgColor,
          })}
        >
          <IconRender
            icon={content.icon || null}
            className="w-14 h-14"
            color={content?.iconColor}
          />
        </div>
      )}
      <span
        className={cn(
          ' text-xl font-bold leading-7',
          content?.alignItems == 'start' ? 'text-start' : '',
          content?.alignItems == 'center' ? 'text-center' : '',
          content?.alignItems == 'end' ? 'text-end' : '',
        )}
      >
        {content?.title}{' '}
      </span>
      <span
        className={cn(
          'text-md mt-2',
          content?.alignItems == 'start' ? 'text-start' : '',
          content?.alignItems == 'center' ? 'text-center' : '',
          content?.alignItems == 'end' ? 'text-end' : '',
        )}
      >
        {content?.subtitle}{' '}
      </span>
    </Tag>
  )
}

export default D0
