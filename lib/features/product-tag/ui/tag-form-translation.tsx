'use client'
import { useSearchParams } from 'next/navigation'
import { ProductTag } from '@/lib/features/product-tag/interface'
import getTranslation from '@/lib/utils/getTranslation'
import { ProductTagForm } from './tag-form'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface ProductTagFormProps {
  initialData: ProductTag | null
  settings: any
  dictionary: DashboardLocaleSchema
}

export const ProductTagFormTranslation: React.FC<ProductTagFormProps> = ({
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
    <ProductTagForm
      tag={tag}
      settings={settings}
      initialState={initialState}
      key={locale}
      dictionary={dictionary}
    />
  )
}
