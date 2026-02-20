import React from 'react'
import { Tag } from '@/lib/features/tag/interface'
import { Button } from '../ui/button'
import IconRenderer from '../builder-canvas/components/IconRenderer'
import getTranslation from '@/lib/utils/getTranslation'
import { LinkAlba } from '../other/link-alba'

type PostCoverProps = {
  tags: Tag[]
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostTags = ({ tags, styles = {}, ...props }: PostCoverProps) => {
  return (
    <div style={styles} {...props}>
      <div className="text-sm text-gray-500 mb-8 flex flex-wrap gap-2">
        {tags.map((t) => {
          const translation = getTranslation({ translations: t.translations })
          return (
            <Button
              variant="outline"
              size="sm"
              key={t.id}
              className="inline-flex w-fit p-0 !justify-start"
            >
              <LinkAlba
                href={`/archive/tags/${t.slug}`}
                className="flex gap-1 px-2 items-center"
              >
                {t?.icon && t?.icon != '' && (
                  <IconRenderer name={t.icon} className={`w-5 h-5`} />
                )}
                {translation?.title}
              </LinkAlba>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
