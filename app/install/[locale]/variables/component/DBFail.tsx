import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLocale } from '@/hooks/useLocale'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { Database } from 'lucide-react'

export default function DBFail() {
  const t = useLocale() as InstallLocaleSchema

  return (
    <Alert className="border-red-200 bg-red-50 text-amber-900 dark:border-red-900 dark:bg-red-950 dark:text-amber-50">
      <Database />
      <AlertTitle>{t.installer.steps.variables.db_uri.title}</AlertTitle>
      <AlertDescription>
        {t.installer.steps.variables.db_uri.fail_description}
      </AlertDescription>
    </Alert>
  )
}
