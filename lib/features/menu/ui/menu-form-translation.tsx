'use client'
import { useSearchParams } from 'next/navigation'
import { MenuForm } from './menu-form'
import getTranslation from '@/lib/utils/getTranslation'

interface MenuFormProps {
  initialData: any | null
  settings: any
}

export const MenuFormTranslation: React.FC<MenuFormProps> = ({
  initialData: menu,
  settings,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const translation: any = getTranslation({
    translations: menu?.translations,
    locale,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { ...menu, translation },
  }

  return (
    <MenuForm
      initialState={initialState}
      settings={settings}
      menu={menu}
      key={locale}
    />
  )
}
