import IconRender from '@/components/builder-canvas/components/IconRender'
import computedStyles from '@/components/builder-canvas/utils/computedStyles'
import { combineClassNames } from '@/components/builder-canvas/utils/styleUtils'
import { LinkAlba } from '@/components/other/link-alba'
import { cn } from '@/lib/utils'

const D1 = ({ blockData, ...props }: ButtonBlockProps) => {
  const { content } = blockData
  const { className, ...resProps } = props

  const Tag = content?.href ? LinkAlba : 'div'

  return (
    <Tag
      href={content?.href || undefined}
      className={cn(
        'flex flex-row justify-center items-center align-middle  w-full p-6 ps-17 rounded-2xl border relative',
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
      <span className="text-center text-3xl font-bold leading-7 block [writing-mode:vertical-rl] rotate-180 whitespace-nowrap absolute left-7 top-1/2 -translate-y-1/2 ">
        {content?.title}{' '}
      </span>
      <span className="text-center text-3xl font-bold leading-7 block [writing-mode:vertical-rl] rotate-180 whitespace-nowrap  left-5 top-1/2 -translate-y-1/2 opacity-0">
        {content?.title}{' '}
      </span>
      <div
        className={cn(
          'flex flex-col',
          content?.alignItems == 'start' ? 'items-start' : '',
          content?.alignItems == 'center' ? 'items-center' : '',
          content?.alignItems == 'end' ? 'items-end' : '',
        )}
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
            'text-xl mt-2',
            content?.alignItems == 'start' ? 'text-start' : '',
            content?.alignItems == 'center' ? 'text-center' : '',
            content?.alignItems == 'end' ? 'text-end' : '',
          )}
        >
          {content?.subtitle}{' '}
        </span>
      </div>
    </Tag>
  )
}

export default D1
