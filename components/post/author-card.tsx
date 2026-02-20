import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from '@/lib/features/user/interface'
import getTranslation from '@/lib/utils/getTranslation'
import { LinkAlba } from '../other/link-alba'

type PostCoverProps = {
  author: User
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostAuthorCard = ({
  author,
  styles = {},
  ...props
}: PostCoverProps) => {
  const translation = getTranslation({ translations: author?.translations })
  return (
    <div style={styles} {...props}>
      <div className="p-7 border-t border-b">
        <LinkAlba href={`/author/${author?.userName}`} className="flex gap-4">
          <div>
            <Avatar className="size-12 ring-background  ring-2">
              <AvatarImage
                alt={author?.name || ''}
                src={author?.image?.srcSmall || ''}
              />
              <AvatarFallback>{author?.name[0] || '?'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text  flex flex-col justify-center">
            <span>{author?.name}</span>
          </div>
        </LinkAlba>
        <p className="pt-4 font-light">{translation?.about}</p>
      </div>
    </div>
  )
}
