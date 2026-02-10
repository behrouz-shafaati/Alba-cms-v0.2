export const dynamic = 'force-static'

import InstallCreateAdminPage from '@/pages/install/admin/page'
import InstallDatabasePage from '@/pages/install/database/page'
import InstallFinishPage from '@/pages/install/finish/page'
import InstallLanguagePage from '@/pages/install/language/page'
import InstallLocalesPage from '@/pages/install/locales/page'

type Props = {
  params: Promise<{
    locale: string
    step: string
  }>
}

export default async function Page({ params }: Props) {
  const { step } = await params
  switch (step) {
    case 'language':
      return <InstallLanguagePage />
    case 'db':
      return <InstallDatabasePage />
    case 'admin':
      return <InstallCreateAdminPage />
    case 'locales':
      return <InstallLocalesPage />
    case 'finish':
      return <InstallFinishPage />
    default:
      return <InstallLanguagePage />
  }
}
