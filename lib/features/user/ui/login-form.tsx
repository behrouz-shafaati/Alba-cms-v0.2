'use client'
import { Suspense, useActionState, useEffect } from 'react'
import { loginAction } from '@/lib/features/user/actions'
import Link from 'next/link'
import Text from '@/components/input/text'
import { KeyRound, UserIcon } from 'lucide-react'
import Password from '@/components/input/password'
import SubmitButton from '@/components/input/submit-button'
import ImageAlba from '@/components/other/image-alba'
import { FormActionState } from '@/lib/types'
import { toast } from 'sonner'
import { useLocale } from '@/hooks/useLocale'

function UserAuthFormComponent() {
  const initialState: FormActionState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }
  const t = useLocale()
  const [state, dispatch] = useActionState(loginAction as any, initialState)

  useEffect(() => {
    if (state?.message && state?.message !== null)
      if (state.success) {
        toast.success(state.message)
      } else toast.error(state.message)
  }, [state])

  return (
    <>
      <form action={dispatch} className="space-y-2 w-full">
        {/* Identifier */}
        <Text
          title={t.login.identifier.title}
          name="identifier"
          defaultValue={state?.values?.identifier || ''}
          placeholder=""
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />

        {/* Password */}
        <Password
          title={t.login.password.title}
          name="password"
          placeholder="******"
          defaultValue={state?.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        <SubmitButton text={t.login.submit} className="w-full" />
      </form>
    </>
  )
}

export default function LoginForm({
  site_title,
  logo,
}: {
  site_title: any
  logo: any
}) {
  const t = useLocale()
  return (
    <Suspense fallback={<div className="flex m-auto">Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center justify-center">
          <Link href={'/'} target="_self" className=" w-20 m-auto">
            {logo && <ImageAlba zoomable={false} file={logo} />}
          </Link>
          <p className="text-sm text-muted-foreground">
            {site_title
              ? t.login.titleWithSiteTitle.replace('%s%', site_title)
              : t.login.title}
          </p>
        </div>
        <UserAuthFormComponent />
        <div className="text-center text-sm">
          {t.login.dontHaveAccount}{' '}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t.login.signup}
          </Link>
        </div>
        <div className="text-center text-sm">
          {t.login.forgotPassword}{' '}
          <Link
            href="/resetPass"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t.login.resetPassword}
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
