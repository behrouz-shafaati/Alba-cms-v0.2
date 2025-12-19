import { SupportedLanguage } from '@/lib/types/types'
import InnstallLanguagePage from '@/pages/install/language/page'
type PageProps = {
  params: Promise<{ locale: SupportedLanguage }>
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  return <InnstallLanguagePage locale={resolvedParams.locale} />
}
