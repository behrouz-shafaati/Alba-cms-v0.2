'use client'
import { useActionState, useEffect, useRef } from 'react'
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
import { useLocale } from '@/hooks/useLocale'

interface SettingsFormProps {
  settings: Settings
}

export const FormEmail: React.FC<SettingsFormProps> = ({ settings }) => {
  const _t = useLocale()
  const t = _t.feature.setting.email
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
          <input type="hidden" name="locale" value={_t.lang} readOnly />
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* mail_host */}
            <Text
              title={t?.mail_host?.title || 'Mail host'}
              name="mail_host"
              defaultValue={state?.values?.mail_host || ''}
              placeholder={t?.mail_host?.placeholder || 'mail.example.com'}
              state={state}
              icon={<Server className="w-4 h-4" />}
              description={
                t?.mail_host?.description ||
                'The SMTP server address you get from your host or email service.'
              }
            />
            {/* mail_port */}
            <Text
              title={t?.mail_port?.title || 'Mail post'}
              name="mail_port"
              defaultValue={state?.values?.mail_port || ''}
              placeholder={t?.mail_port?.placeholder || 'Usually 465 or 587'}
              state={state}
              icon={<Plug className="w-4 h-4" />}
              description={
                t?.mail_port?.description ||
                'The port number used to connect to SMTP.'
              }
            />
            {/* mail_username */}
            <Text
              title={t?.mail_username?.title || 'Mail usename'}
              name="mail_username"
              defaultValue={state?.values?.mail_username || ''}
              placeholder={
                t?.mail_username?.placeholder || 'noreply@example.com'
              }
              state={state}
              icon={<Mail className="w-4 h-4" />}
              description={
                t?.mail_username?.description ||
                'The same email address you use for sending.'
              }
            />
            {/* mail_password */}
            <Text
              title={t?.mail_password?.title || 'Mail password'}
              name="mail_password"
              defaultValue={state?.values?.mail_password || ''}
              placeholder=""
              state={state}
              icon={<Key className="w-4 h-4" />}
              description={
                t?.mail_password?.description ||
                'Password or App Password of the same email.'
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
