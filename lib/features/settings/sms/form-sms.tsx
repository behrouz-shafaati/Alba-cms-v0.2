'use client'
import { useActionState, useEffect, useRef } from 'react'
import { Server, Plug, Mail } from 'lucide-react'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { updateSMSSettings } from './actions'
import authorize from '@/lib/utils/authorize'
import { FormActionState } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'

interface SettingsFormProps {
  settings: Settings
}

export const FormSMS: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: true,
    values: settings?.sms?.farazsms,
  }
  const [state, dispatch] = useActionState(
    updateSMSSettings as any,
    initialState
  )
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
    console.log('#234 sms setings state:', state)
  }, [state])
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <h3 className="text-2xlg">تنظیمات پیامک فراز اس ام اس</h3>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* farazsms_apiKey */}
            <Text
              title="کلید دسترسی"
              name="apiKey"
              defaultValue={state?.values?.apiKey || ''}
              placeholder=""
              state={state}
              icon={<Server className="w-4 h-4" />}
              description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
            />
            {/* patternCode */}
            <Text
              title="کد پترن وریفای"
              name="verifyPatternCode"
              defaultValue={state?.values?.verifyPatternCode || ''}
              placeholder="مثلا:e23c6ytxkg4f5qc"
              state={state}
              icon={<Plug className="w-4 h-4" />}
              description="در متن باید متغییر %code% حتما باشد. پترن نمونه: 
          کد تایید شماره موبایل در زومکشت: %code%"
            />
            {/* from_number */}
            <Text
              title="خط مورد استفاده"
              name="from_number"
              defaultValue={state?.values?.from_number || ''}
              placeholder="مثلاً: +983000505"
              state={state}
              icon={<Mail className="w-4 h-4" />}
              description="ارسال پیامک از این شماره انجام می‌شود"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
