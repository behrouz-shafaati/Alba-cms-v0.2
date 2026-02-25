'use client'
import Password from '@/components/input/password'
import Text from '@/components/input/text'
import { LoadingButton } from '@/components/ui/loading-button'
import { useBrowserLocale } from '@/hooks/useBrowserLocale'
import { useLocale } from '@/hooks/useLocale'
import configSuperAdminAction from '@/lib/config/actions/create-super-admin'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { FormActionState } from '@/lib/types'
import { KeyRound, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function CreateSuperAdminForm() {
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: false,
  }
  const t = useLocale() as InstallLocaleSchema
  const locale = useBrowserLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [state, dispatch] = useActionState(
    configSuperAdminAction as any,
    initialState,
  )

  const nextHref =
    locale != '' ? `/install/${locale}/locales` : `/install/en/locales`

  const handleNext = async () => {
    setLoading(true)
    formRef.current?.requestSubmit()
    setLoading(false)
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) {
        toast.success(state.message)
        router.push(nextHref)
      } else toast.error(state.message)
  }, [state])

  return (
    <div className="flex flex-col gap-4">
      <form ref={formRef} action={dispatch} className="space-y-2">
        <input type="hidden" value={t.lang} name="locale" />
        {/* First Name */}
        <Text
          title={t.user.fName.title}
          name="firstName"
          defaultValue={state.values?.firstName || ''}
          placeholder={t.user.fName.title}
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Last Name */}
        <Text
          title={t.user.lName.title}
          name="lastName"
          defaultValue={state.values?.lastName || ''}
          placeholder={t.user.lName.title}
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Email */}
        <Text
          title={t.user.email.title}
          name="email"
          defaultValue={state.values?.email || ''}
          placeholder={t.user.email.title}
          state={state}
          icon={<MailIcon className="w-4 h-4" />}
        />
        {/* Mobile */}
        <Text
          title={t.user.mobile.title}
          name="mobile"
          defaultValue={state.values?.mobile || ''}
          placeholder={t.user.mobile.title}
          state={state}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
        {/* Password */}
        <Password
          title={t.user.password.title}
          name="password"
          placeholder="******"
          defaultValue={state.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />
        {/* Confirm Password Field */}
        <Password
          title={t.user.confirmPassword.title}
          name="confirmPassword"
          placeholder="******"
          defaultValue={state.values?.confirmPassword || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />
      </form>
      <div className="flex justify-between">
        <div className="w-[25vw]"></div>
        <LoadingButton variant="default" onClick={handleNext} loading={loading}>
          {t.shared.next}
        </LoadingButton>
      </div>
    </div>
  )
}
