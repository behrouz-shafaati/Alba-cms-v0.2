'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { updateEmailSettings } from './actions'
import { Key, Mail, Plug, Server } from 'lucide-react'
import authorize from '@/lib/utils/authorize'
import { FormActionState } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'

interface SettingsFormProps {
  settings: Settings
}

export const FormEmail: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: true,
    values: settings?.email,
  }
  const [state, dispatch] = useActionState(
    updateEmailSettings as any,
    initialState
  )

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <h3 className="text-2xlg">تنظیمات ایمیل</h3>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* mail_host */}
            <Text
              title="سرور ایمیل (Mail Host)"
              name="mail_host"
              defaultValue={state?.values?.mail_host || ''}
              placeholder="مثلاً mail.example.com"
              state={state}
              icon={<Server className="w-4 h-4" />}
              description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
            />
            {/* mail_port */}
            <Text
              title="پورت ایمیل (Mail Port)"
              name="mail_port"
              defaultValue={state?.values?.mail_port || ''}
              placeholder="معمولاً 465 یا 587"
              state={state}
              icon={<Plug className="w-4 h-4" />}
              description="شماره پورتی که برای اتصال به SMTP استفاده می‌شود."
            />
            {/* mail_username */}
            <Text
              title="نام کاربری ایمیل (Email Username)"
              name="mail_username"
              defaultValue={state?.values?.mail_username || ''}
              placeholder="مثلاً noreply@example.com"
              state={state}
              icon={<Mail className="w-4 h-4" />}
              description="همان آدرس ایمیلی که برای ارسال استفاده می‌کنید."
            />
            {/* mail_password */}
            <Text
              title="رمز عبور ایمیل (Email Password)"
              name="mail_password"
              defaultValue={state?.values?.mail_password || ''}
              placeholder=""
              state={state}
              icon={<Key className="w-4 h-4" />}
              description="رمز عبور یا App Password همان ایمیل."
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
