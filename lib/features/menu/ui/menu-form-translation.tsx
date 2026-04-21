'use client'
import { useSearchParams } from 'next/navigation'
import { MenuForm } from './menu-form'

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

  const translation: any =
    menu?.translations?.find((t: any) => t.locale === locale) ||
    menu?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...menu, translation },
  }

  console.log('#234 locale in form tran:', locale)
  return (
    <MenuForm
      initialState={initialState}
      settings={settings}
      menu={menu}
      key={locale}
    />
  )
}
