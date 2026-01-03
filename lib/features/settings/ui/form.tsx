'use server'
import pageCtrl from '@/lib/features/page/controller'
import { FormAD } from '../ad/form'
import { getSettingsAction } from '../actions'
import { FormAppearance } from '../appearance/form-appearance'
import { FormGeneral } from '../general/form-general'
import { FormUsers } from '../users/form'
import { FormValidation } from '../validation/form-validation'
import { FormEmail } from '../email/form-email'
import { FormSMS } from '../sms/form-sms'
import { FormWPEmigration } from '@/lib/emigration/wp/ui/form'
import { FormLocales } from '../locales/form'

type FormProps = {
  tab:
    | 'general'
    | 'appearance'
    | 'email'
    | 'validation'
    | 'sms'
    | 'ad'
    | 'users'
    | 'wp-emigration'
    | 'locales'
  lang?: string
}

export default async function Form({ tab, lang }: FormProps) {
  const [settings, allPages] = await Promise.all([
    getSettingsAction(),
    pageCtrl.findAll({}),
  ])

  return (
    <div>
      {/* <SettingsTabs /> */}
      {tab === 'general' && (
        <FormGeneral settings={settings} allPages={allPages.data} />
      )}
      {tab === 'appearance' && <FormAppearance settings={settings} />}
      {tab === 'users' && <FormUsers settings={settings} />}
      {tab === 'validation' && <FormValidation settings={settings} />}
      {tab === 'sms' && <FormSMS settings={settings} />}
      {tab === 'email' && <FormEmail settings={settings} />}
      {tab === 'ad' && <FormAD settings={settings} />}
      {tab === 'locales' && <FormLocales settings={settings} />}
      {tab === 'wp-emigration' && <FormWPEmigration settings={settings} />}
    </div>
  )
}
