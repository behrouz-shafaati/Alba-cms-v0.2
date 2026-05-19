'use client'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { PostComment } from '../../interface'
import { PostCommentItemManage } from './post-comment-item-manage'
import Link from 'next/link'
import { Option } from '@/lib/types'
import { getPosts } from '@/lib/features/post/actions'
import { Post } from '@/lib/features/post/interface'
import { Status } from '@/components/other/Status'
import { MessageSquareShare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUpdatedUrl } from '@/hooks/use-updated-url'
import getTranslation from '@/lib/utils/getTranslation'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

type FilterType = 'text' | 'select' | 'boolean'

interface FilterConfig {
  type: FilterType
  options?: Option[]
  fetchOptions?: (query: string) => Promise<Option[]>
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterConfig?: FilterConfig
  }
}

export const getColumns = (
  dictionary: DashboardLocaleSchema,
  locale: string,
): ColumnDef<PostComment>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: dictionary.feature.postComment.title,
    accessorFn: (row) => {
      const translation = getTranslation({
        translations: row.translations,
        locale,
      })
      return JSON.stringify(translation.contentJson) // برای فیلتر پذیری
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-md">
          <PostCommentItemManage postComment={row.original} />
        </div>
      )
    },
  },
  {
    accessorKey: 'post',
    header: dictionary.feature.post.title,
    accessorFn: (row) => {
      const translation = getTranslation({
        translations: row.post?.translations,
        locale: row.locale ?? 'fa',
      })
      return translation.title // برای فیلتر پذیری
    },
    cell: ({ row }) => {
      const { buildUrlWithParams } = useUpdatedUrl()
      const post = row.original.post
      const translation = getTranslation({
        translations: post?.translations,
        locale: row.locale ?? 'fa',
      })
      return (
        <div className="flex flex-col gap-2">
          <Link href={post?.href ?? '#'} target="_blank">
            {translation.title}
          </Link>
          <Link
            href={buildUrlWithParams(null, { post: post?.id }) ?? '#'}
            target="_self"
          >
            <Button variant="ghost" size="icon" className="size-10">
              <MessageSquareShare />
            </Button>
          </Link>
        </div>
      )
    },
    meta: {
      filterConfig: {
        type: 'select',
        async fetchOptions(query: string): Promise<Option[]> {
          // به API بزن
          const postResult = await getPosts({ filters: { query } })
          return postResult.data.map((post: Post) => {
            const translation = getTranslation({
              translations: post.translations,
              locale,
            })
            return {
              label: translation.title,
              value: post.id,
            }
          })
        },
        // options: [
        //   { label: 'Active', value: 'active' },
        //   { label: 'Draft', value: 'draft' },
        // ],
      },
    },
  },
  {
    accessorKey: 'status',
    header: dictionary.feature.postComment.status,
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: dictionary.feature.postComment.pending, value: 'pending' },
          { label: dictionary.feature.postComment.approved, value: 'approved' },
          { label: dictionary.feature.postComment.rejected, value: 'rejected' },
        ],
      },
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
]
