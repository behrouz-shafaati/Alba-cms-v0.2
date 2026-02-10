'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { updateLocaleSettings } from './actions'
import authorize from '@/lib/utils/authorize'
import { FormActionState, Option } from '@/lib/types'
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
  const _t = useLocale()
  const t = _t?.feature?.setting?.locales
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: true,
    values: settings?.language,
  }
  const [state, dispatch] = useActionState(
    updateLocaleSettings as any,
    initialState
  )
  const defaultLocaleOptions = LANGUAGES.filter((lang) =>
    state?.values?.locales?.includes(lang.value)
  )
  const [selectdlanguages, setSelectdlanguages] = useState(defaultLocaleOptions)

  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])

  if (!canModerate) return <AccessDenied />

  const options: Option[] = [
    { label: 'English', value: 'en' },
    { label: 'فارسی', value: 'fa' },
  ]

  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <input type="hidden" name="locale" value={_t.lang || 'en'} readOnly />
          <div className="md:grid md:grid-cols-3 gap-8">
            <MultipleSelect
              title={t?.locales?.title || 'Site languages'}
              name="locales"
              placeholder={
                t?.locales?.placeholder || 'Choose your site languages...'
              }
              state={state}
              defaultSuggestions={LANGUAGES}
              defaultValues={defaultLocaleOptions}
              onChange={(options) => setSelectdlanguages(options)}
            />
            <Combobox
              title={t?.siteDefault?.title || 'Site default language'}
              name="siteDefault"
              defaultValue={state?.values?.siteDefault || null}
              options={selectdlanguages}
              placeholder={
                t?.siteDefault?.placeholder || 'Select default language...'
              }
              state={state}
            />
            <Combobox
              name="dashboardDefault"
              title={t?.dashboardDefault?.title || 'Dashboard default language'}
              defaultValue={state?.values?.dashboardDefault || null}
              options={options}
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
