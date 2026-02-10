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
import { useLocale } from '@/hooks/useLocale'

interface SettingsFormProps {
  settings: Settings
}

export const FormValidation: React.FC<SettingsFormProps> = ({ settings }) => {
  const _t = useLocale()
  const t = _t.feature.setting.validation
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
          <input type="hidden" name="locale" value={_t.lang} readOnly />
          <div>
            <Switch
              name="commentApprovalRequired"
              title={
                t?.commentApprovalRequired?.title ||
                'Show comments only after approval/review'
              }
              defaultChecked={state?.values?.commentApprovalRequired ?? true}
            />
            <Switch
              name="emailVerificationRequired"
              title={
                t?.emailVerificationRequired?.title ||
                'Verify user email ownership'
              }
              defaultChecked={state?.values?.emailVerificationRequired ?? false}
            />
            <Switch
              name="mobileVerificationRequired"
              title={
                t?.mobileVerificationRequired?.title ||
                "Verify ownership of users' mobile numbers"
              }
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
