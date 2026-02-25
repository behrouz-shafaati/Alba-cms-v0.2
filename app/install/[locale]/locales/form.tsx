'use client'
import Combobox from '@/components/input/combobox'
import MultipleSelect from '@/components/input/multiple-select'
import { LoadingButton } from '@/components/ui/loading-button'
import { useBrowserLocale } from '@/hooks/useBrowserLocale'
import { useLocale } from '@/hooks/useLocale'
import installLanguagesAction from '@/lib/config/actions/set-languages'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { LANGUAGES } from '@/lib/i18n/languages'
import { FormActionState } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function SetLocalesForm() {
  const initialState: FormActionState = {
    message: null,
    errors: {},
    success: false,
  }
  const t = useLocale() as InstallLocaleSchema
  const locale = useBrowserLocale()
  const router = useRouter()
  const [selectdlanguages, setSelectdlanguages] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [state, dispatch] = useActionState(
    installLanguagesAction as any,
    initialState,
  )

  const nextHref =
    locale != '' ? `/install/${locale}/finish` : `/install/en/finish`

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
        <input type="hidden" value={t.lang} name="dashboardDefault" />
        <div className="max-w-md flex flex-col gap-4">
          <MultipleSelect
            title={t.languages.locales.title}
            name="locales"
            placeholder={t.languages.locales.placeholder}
            state={state}
            defaultSuggestions={LANGUAGES}
            onChange={(options) => setSelectdlanguages(options)}
          />
          <Combobox
            title={t.languages.siteDefault.title}
            name="siteDefault"
            defaultValue={state.values?.mainCategory?.id || null}
            options={selectdlanguages}
            placeholder={t.languages.siteDefault.placeholder}
            state={state}
          />
        </div>
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
