'use client'
import TextArea from '@/components/input/textArea'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { LoadingButton } from '@/components/ui/loading-button'
import { useBrowserLocale } from '@/hooks/useBrowserLocale'
import { useLocale } from '@/hooks/useLocale'
import { checkConnectionAction, writeConfigAction } from '@/lib/config/action'
import { AlertCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SetDatabaseForm() {
  const t = useLocale()
  const locale = useBrowserLocale()
  const router = useRouter()
  const [uri, setUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const nextHref =
    locale != '' ? `/install/${locale}/admin` : `/install/en/admin`

  const handleNext = async () => {
    setLoading(true)
    const testConnetionResult: boolean = await checkConnectionAction(uri)

    if (testConnetionResult) {
      await writeConfigAction({ db: { uri } })
      router.push(nextHref)
    } else {
      setLoading(false)
      setError(true)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 py-24">
        <TextArea
          name="dburl"
          title={t.shared.mongodbUri}
          placeholder="mongodb://localhost:27017"
          className="w-full"
          onChange={(e) => setUri(e.target.value)}
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{t.shared.failMongodbConnection}</AlertTitle>
          </Alert>
        )}
      </div>
      <div className="flex justify-between">
        <div className="w-[25vw]"></div>
        <LoadingButton variant="default" onClick={handleNext} loading={loading}>
          {t.shared.next}
        </LoadingButton>
      </div>
    </div>
  )
}
