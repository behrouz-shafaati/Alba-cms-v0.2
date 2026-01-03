'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { updateValidationSettings } from './actions'
import authorize from '@/lib/utils/authorize'
import { FormActionState } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import { LANGUAGES } from '@/lib/i18n/languages'
import SubmitButton from '@/components/input/submit-button'
import MultipleSelect from '@/components/input/multiple-select'
import Combobox from '@/components/input/combobox'
import { useLocale } from '@/hooks/useLocale'

interface SettingsFormProps {
  settings: Settings
}

export const FormLocales: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const t = useLocale().feature.setting.locales
  const { user } = useSession()
  const userRoles = user?.roles || []

  const [selectdlanguages, setSelectdlanguages] = useState([])
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
          <div className="max-w-md flex flex-col gap-4">
            <MultipleSelect
              title={t.locales.title}
              name="locales"
              placeholder={t.locales.placeholder}
              state={state}
              defaultSuggestions={LANGUAGES}
              onChange={(options) => setSelectdlanguages(options)}
            />
            <Combobox
              title={t.siteDefault.title}
              name="siteDefault"
              defaultValue={state.values?.mainCategory?.id || null}
              options={selectdlanguages}
              placeholder={t.siteDefault.placeholder}
              state={state}
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
