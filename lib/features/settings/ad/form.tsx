'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Link } from 'lucide-react'
import { Settings } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { CampaignTranslation } from '@/lib/features/campaign/interface'
import { updateAdSettings } from './actions'
import authorize from '@/lib/utils/authorize'
import { FormActionState, Option } from '@/lib/types'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import getTranslation from '@/lib/utils/getTranslation'
import Select from '@/components/input/select'
import Text from '@/components/input/text'
import FileUpload from '@/components/input/file-upload'
import SubmitButton from '@/components/input/submit-button'
import { useLocale } from '@/hooks/useLocale'
import { ContentLanguageTabs } from '@/components/input/ContentLanguageTabs'
import { useSearchParams } from 'next/navigation'

interface SettingsFormProps {
  settings: Settings
}

export const FormAD: React.FC<SettingsFormProps> = ({ settings }) => {
  const searchParams = useSearchParams()
  const contantLang = searchParams?.get('lang')

  const _t = useLocale()
  const t = _t?.feature?.setting?.adCampaign
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    values: settings?.ad,
    message: null,
    errors: {},
    success: true,
  }
  const [state, dispatch] = useActionState(
    updateAdSettings as any,
    initialState
  )

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])
  if (!canModerate) return <AccessDenied />
  const translation: CampaignTranslation = getTranslation({
    translations: state?.values?.translations || [],
    lang: contantLang || settings.language?.siteDefault,
  })
  const fallbackBehaviorOptions: Option[] = [
    {
      label: t?.fallbackBehavior?.options?.random || 'Show a random banner',
      value: 'random',
    },
    {
      label:
        t?.fallbackBehavior?.options?.default_banner || 'Show default banner',
      value: 'default_banner',
    },
    {
      label: t?.fallbackBehavior?.options?.hide || 'No display',
      value: 'hide',
    },
  ]
  const aspectKeys = ['1/1', '4/1', '10/1', '20/1', '30/1']
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form
          action={dispatch}
          ref={formRef}
          className="space-y-8 w-full"
          key={`ad_${contantLang}`}
        >
          <ContentLanguageTabs settings={settings} />
          <div className="md:grid md:grid-cols-3 gap-8">
            <input type="hidden" name="locale" value="fa" readOnly />

            {/* رفتار در صورت نبود تبلیغ */}
            <Select
              title={
                t?.fallbackBehavior?.title ||
                'Behavior in the absence of advertising'
              }
              name="fallbackBehavior"
              placeholder={
                t?.fallbackBehavior?.placeholder ||
                'Behavior in the absence of advertising'
              }
              options={fallbackBehaviorOptions}
              defaultValue={state?.values?.fallbackBehavior || 'random'}
              icon={<Link className="w-4 h-4" />}
            />

            {/* targetUrl */}
            <Text
              title={t?.targetUrl?.title || 'Default banner destination link'}
              name="targetUrl"
              defaultValue={state?.values?.targetUrl}
              placeholder={t?.targetUrl?.placeholder || 'Destination link'}
              state={state}
              icon={<Link className="w-4 h-4" />}
            />
          </div>
          <h3>{t?.defaultBanners || 'Default banners'}</h3>
          {/* نمایش لیست بنرها */}
          <div>
            {aspectKeys.map((aspectKey, index) => {
              const ratio = aspectKey.split('/')
              const defaultValu = translation?.banners?.find(
                (b) => b.aspect === aspectKey
              )
              return (
                <section
                  key={index}
                  className="mt-2 rounded-md  p-4 md:mt-0 md:p-6"
                >
                  <input
                    type="hidden"
                    name="banners[][aspect]"
                    value={aspectKey}
                  />
                  <FileUpload
                    title={` ${t?.ratio || 'Width to length ratio'} ${
                      ratio[0]
                    }/${ratio[1]}`}
                    name="banners[][file]"
                    state={state}
                    maxFiles={1}
                    allowedFileTypes={['image']}
                    defaultValues={
                      defaultValu?.fileDetails ? [defaultValu?.fileDetails] : []
                    }
                    onLoading={setLoading}
                  />
                </section>
              )
            })}
          </div>
          <SubmitButton loading={loading} />
        </form>
      </div>
    </>
  )
}
