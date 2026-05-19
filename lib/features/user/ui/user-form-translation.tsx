'use client'
import { useSearchParams } from 'next/navigation'
import { UserForm } from './user-form'
import { User } from '../interface'
import getTranslation from '@/lib/utils/getTranslation'

interface PostFormProps {
  initialData: any | null
  loginedUser: User
  settings: any
}

export const UserFormTranslation: React.FC<PostFormProps> = ({
  initialData: user,
  loginedUser,
  settings,
}) => {
  const searchParams = useSearchParams()
  const localedFallback = settings.language?.siteDefault

  const locale = searchParams.get('locale') ?? localedFallback

  const translation: any = getTranslation({
    locale,
    translations: user?.translations,
  })
  const initialState = {
    message: null,
    errors: {},
    values: { roles: [], ...user, translation },
  }

  return (
    <UserForm
      user={user}
      loginedUser={loginedUser}
      settings={settings}
      initialState={initialState}
      locale={locale}
      key={locale}
    />
  )
}
