import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLocale } from '@/hooks/useLocale'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { Database } from 'lucide-react'

export default function DBSuccess() {
  const t = useLocale() as InstallLocaleSchema

  return (
    <Alert className="border-green-200 bg-green-50 text-amber-900 dark:border-green-900 dark:bg-green-950 dark:text-amber-50">
      <Database />
      <AlertTitle>{t.installer.steps.variables.db_uri.title}</AlertTitle>
      <AlertDescription>
        {t.installer.steps.variables.db_uri.success_description}
      </AlertDescription>
    </Alert>
  )
}
