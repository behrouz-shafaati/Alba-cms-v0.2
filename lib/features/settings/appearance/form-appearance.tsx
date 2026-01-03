'use client'
import { useActionState, useEffect, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import { useSession } from '@/components/context/SessionContext'
import { updateAppearanceSettings } from './actions'
import { Settings } from '../interface'
import { FormActionState } from '@/lib/types'
import AccessDenied from '@/components/other/access-denied'
import Text from '@/components/input/text'
import SubmitButton from '@/components/input/submit-button'
import { toast } from 'sonner'
import authorize from '@/lib/utils/authorize'

interface FormProps {
  settings: Settings
}

export const FormAppearance: React.FC<FormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    values: settings?.appearance,
    message: null,
    errors: {},
    success: true,
  }
  const [state, dispatch] = useActionState(
    updateAppearanceSettings as any,
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
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* desktopHeaderHeight */}
            <Text
              title="ارتفاع هدر در دسکتاپ"
              name="desktopHeaderHeight"
              defaultValue={state?.values?.desktopHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />

            {/* desktopHeaderHeight */}
            <Text
              title="ارتفاع هدر در تبلت"
              name="tabletHeaderHeight"
              defaultValue={state?.values?.tabletHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />

            {/* mobileHeaderHeight */}
            <Text
              title="ارتفاع هدر در موبایل"
              name="mobileHeaderHeight"
              defaultValue={state?.values?.mobileHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
