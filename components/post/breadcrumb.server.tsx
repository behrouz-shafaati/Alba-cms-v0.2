import React from 'react'
import { BreadCrumbServer } from '../other/breadcrumb.server'

type PostCoverProps = {
  content: any
  styles?: any
  locale: string
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostBreadcrumbServer = ({
  content,
  styles = {},
  locale,
  ...props
}: PostCoverProps) => {
  return content ? (
    <div style={styles} {...props} className="text-sm text-gray-500 ">
      <div className="flex-1 space-y-4 mt-4 mb-3">
        <BreadCrumbServer items={content} locale={locale} />
      </div>
    </div>
  ) : (
    <></>
  )
}
