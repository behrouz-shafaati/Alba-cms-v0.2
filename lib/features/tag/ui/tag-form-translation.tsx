'use client'
import { useSearchParams } from 'next/navigation'
import { Tag } from '@/lib/features/tag/interface'
import getTranslation from '@/lib/utils/getTranslation'
import { TagForm } from './tag-form'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface PostFormProps {
  initialData: any | null
  settings: any
  dictionary: DashboardLocaleSchema
}

export const TagFormTranslation: React.FC<PostFormProps> = ({
  initialData: tag,
  settings,
  dictionary,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams?.get('locale') ?? localedFallback

  const translation: any = getTranslation({
    locale,
    translations: tag?.translations,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { ...tag, translation },
  }
  return (
    <TagForm
      tag={tag}
      settings={settings}
      initialState={initialState}
      key={locale}
      dictionary={dictionary}
    />
  )
}
