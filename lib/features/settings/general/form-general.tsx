'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Heading1, Link, MessageSquare } from 'lucide-react'
import {
  PageContent,
  PageTranslationSchema,
} from '@/lib/features/page/interface'
import { HomeIcon } from 'lucide-react'
import { useSession } from '@/components/context/SessionContext'
import { updateGeneralSettings } from './actions'
import SingleImagePicker from '@/components/input/single-image-picker'
import { Settings } from '../interface'
import authorize from '@/lib/utils/authorize'
import { FormActionState, Option } from '@/lib/types'
import getTranslation from '@/lib/utils/getTranslation'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import Text from '@/components/input/text'
import Combobox from '@/components/input/combobox'
import SubmitButton from '@/components/input/submit-button'
import { useLocale } from '@/hooks/useLocale'
import { BreadCrumb } from '@/components/other/breadcrumb'
import { ContentLanguageTabs } from '@/components/input/ContentLanguageTabs'
import { useSearchParams } from 'next/navigation'

interface FormGeneralProps {
  settings: Settings
  allPages: PageContent[]
}

export const FormGeneral: React.FC<FormGeneralProps> = ({
  settings,
  allPages,
}) => {
  const searchParams = useSearchParams()

  const lang = searchParams?.get('lang')

  const t = useLocale()
  const { user } = useSession()
  const locale = user?.locale
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    values: settings?.general,
    message: null,
    errors: {},
    success: true,
  }
  const [state, dispatch] = useActionState(
    updateGeneralSettings as any,
    initialState
  )
  const [imgLoading, setImgLoading] = useState(false)

  const pagesOptions: Option[] = allPages?.map((p: PageContent) => {
    const translation: PageTranslationSchema = getTranslation({
      translations: p.translations,
      locale,
    })
    return {
      value: String(p.id),
      label: translation?.title,
    }
  })
  const siteInfo = getTranslation({
    translations: settings.general?.translations || [],
    lang: lang || settings.language?.siteDefault,
  })

  console.log(
    '#24098 settings.general?.translations:',
    settings.general?.translations
  )
  console.log('#24098 siteInfo:', siteInfo)
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
  }, [state])
  if (!canModerate) return <AccessDenied />

  const pageBreadCrumb = [
    {
      title: t.shared.dashboard,
      link: '/dashboard',
    },
    {
      title: t.feature.setting.title,
      link: '/dashboard/settings/general',
    },
    {
      title: t.feature.setting.general.title,
      link: '/dashboard/settings/general',
    },
  ]

  return (
    <>
      <BreadCrumb items={pageBreadCrumb} />
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form
          action={dispatch}
          ref={formRef}
          className="space-y-8 w-full"
          key={`form_${siteInfo.lang}`}
        >
          <input type="hidden" name="locale" value={t.lang} readOnly />
          <ContentLanguageTabs settings={settings} />
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Site title */}
            <Text
              title={t.feature.setting.general.siteTitle}
              name="site_title"
              defaultValue={siteInfo?.site_title || ''}
              placeholder=""
              state={state}
              icon={<Heading1 className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title={t.feature.setting.general.siteIntroduction}
              name="site_introduction"
              defaultValue={siteInfo?.site_introduction || ''}
              placeholder=""
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title={t.feature.setting.general.siteUrl}
              name="site_url"
              defaultValue={settings?.general?.site_url || ''}
              placeholder=""
              state={state}
              icon={<Link className="w-4 h-4" />}
              description=""
            />

            {/* first page */}
            <Combobox
              title={t.feature.setting.general.homePage}
              name="homePageId"
              defaultValue={String(settings?.general?.homePageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* terms page */}
            <Combobox
              title={t.feature.setting.general.termsPage}
              name="termsPageId"
              defaultValue={String(settings?.general?.termsPageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* privacy page */}
            <Combobox
              title={t.feature.setting.general.privacyPage}
              name="privacyPageId"
              defaultValue={String(settings?.general?.privacyPageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />

            <SingleImagePicker
              title={t.feature.setting.general.favicon}
              name="favicon"
              defaultValue={settings?.general?.faviconDetails}
              targetFormat="png"
            />
          </div>
          <div className="flex justify-end ">
            <SubmitButton loading={imgLoading} />
          </div>
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
