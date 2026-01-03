'use client'
import { useActionState, useEffect, useRef } from 'react'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { updateValidationSettings } from './actions'
import authorize from '@/lib/utils/authorize'
import { FormActionState } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import Switch from '@/components/input/switch'
import SubmitButton from '@/components/input/submit-button'

interface SettingsFormProps {
  settings: Settings
}

export const FormValidation: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: true,
    values: settings?.validation,
  }
  const [state, dispatch] = useActionState(
    updateValidationSettings as any,
    initialState
  )

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
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
          <div>
            <Switch
              name="commentApprovalRequired"
              title="نمایش دیدگاه‌ها فقط بعد از تأیید/بررسی"
              defaultChecked={state?.values?.commentApprovalRequired ?? true}
            />
            <Switch
              name="emailVerificationRequired"
              title="تایید مالکیت ایمیل کاربران بررسی شود"
              defaultChecked={state?.values?.emailVerificationRequired ?? false}
            />
            <Switch
              name="mobileVerificationRequired"
              title="تایید مالکیت شماره موبایل کاربران بررسی شود"
              defaultChecked={
                state?.values?.mobileVerificationRequired ?? false
              }
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
