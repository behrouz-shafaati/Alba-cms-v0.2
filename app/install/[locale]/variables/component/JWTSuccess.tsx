import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useLocale } from '@/hooks/useLocale'
import { InstallLocaleSchema } from '@/lib/i18n/install'
import { Database } from 'lucide-react'

export default function JWTSuccess() {
  const t = useLocale() as InstallLocaleSchema

  return (
    <Alert className="border-green-200 bg-green-50 text-amber-900 dark:border-green-900 dark:bg-green-950 dark:text-amber-50">
      <Database />
      <AlertTitle>{t.variables.jwt_secret.title}</AlertTitle>
      <AlertDescription>
        {t.variables.jwt_secret.success_description}
      </AlertDescription>
    </Alert>
  )
}
