import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLocale } from '@/hooks/useLocale'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { Database } from 'lucide-react'

export default function DBAwait() {
  const t = useLocale() as InstallLocaleSchema

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <Database />
      <AlertTitle>{t.installer.steps.variables.db_uri.title}</AlertTitle>
      <AlertDescription>
        {t.installer.steps.variables.db_uri.await_description}
      </AlertDescription>
    </Alert>
  )
}
