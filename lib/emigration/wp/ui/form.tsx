'use client'
import { useEffect, useRef, useState } from 'react'
import { Server, Key } from 'lucide-react'
import { useSession } from '@/components/context/SessionContext'
import { Settings } from '@/lib/features/settings/interface'
import {
  startUserMigration,
  testWPConnectionAction,
} from '../actions/user-migration-actions'
import { decodeUnicodeMessage } from '@/lib/utils/decode-unicode'
import {
  startConvertHtymlToJson,
  startTaxonomyMigration,
} from '../actions/taxonomy-migration-actions'
import { startPostMigration } from '../posts/post-migration-actions'
import { startPostCommentMigration } from '../post-comments/post-comment-migration-actions'
import authorize from '@/lib/utils/authorize'
import { toast } from 'sonner'
import AccessDenied from '@/components/other/access-denied'
import Text from '@/components/input/text'
import { LoadingButton as Button } from '@/components/ui/loading-button'
import { FormActionState } from '@/lib/types'
import { useLocale } from '@/hooks/useLocale'

interface SettingsFormProps {
  settings: Settings
}

export const FormWPEmigration: React.FC<SettingsFormProps> = ({ settings }) => {
  const _t = useLocale()
  const t = _t.feature.setting.wpEmigration
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = authorize(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: FormActionState = {
    message: null,
    errors: {},
    testConnectionSuccess: null,
  }
  const [state, setState] = useState<FormActionState>(initialState)
  const handleTestConnection = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await testWPConnectionAction(state, formData)
    setState(result)
    console.log('handleTestConnection result :', result)
    setLoading(false)
  }
  const handleStartEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await startUserMigration(state, formData, { batchSize: 50 })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }
  const handleStartTaxonomyEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await startTaxonomyMigration(state, formData, {
      batchSize: 50,
    })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }
  const handleStartPostEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.append('newBaseUrl', window.location.origin.replace(/\/+$/, ''))

    const result = await startPostMigration(state, formData, {
      batchSize: 50,
    })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }

  const handleStartPostCommentEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.append('newBaseUrl', window.location.origin.replace(/\/+$/, ''))

    const result = await startPostCommentMigration(state, formData, {
      batchSize: 50,
    })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStart post comments Emigration result :', result)
    setLoading(false)
  }

  const handleTestHtmlToTipTap = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    const formData = new FormData(formRef.current!)
    formData.append('newBaseUrl', window.location.origin)

    const result = await startConvertHtymlToJson(formData)
    setState((s) => ({ ...s, ...result }))

    console.log('ConvertHtymlToJson result:', result)
    console.log(
      'ConvertHtymlToJson result jsonContent:',
      JSON.parse(result?.data?.jsonContent)
    )

    setLoading(false)
  }

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (state.message && state.message !== null)
      if (state.success) toast.success(state.message)
      else toast.error(state.message)
    console.log('#state 5678 :', state)
  }, [state])
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form ref={formRef} className="space-y-8 w-full">
          <input type="hidden" name="locale" value={_t.lang} readOnly />
          <h3 className="text-2xlg">
            {t?.title || 'Migrating from WordPress'}
          </h3>
          <p>
            {t?.note ||
              'Note: For a successful WordPress migration, your database must be completely empty. In other words, the first thing you do after the site is up and running is to perform the migration.'}
          </p>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* baseUrl */}
            <Text
              title={t?.baseUrl?.title || 'Site address'}
              name="baseUrl"
              defaultValue={state?.values?.baseUrl || ''}
              placeholder="https://example.com"
              state={state}
              icon={<Server className="w-4 h-4" />}
              description=""
            />
            {/* apiKey */}
            <Text
              title={t?.apiKey?.title || 'API Key'}
              name="apiKey"
              defaultValue={state?.values?.apiKey || ''}
              placeholder=""
              state={state}
              icon={<Key className="w-4 h-4" />}
              description=""
            />
            {/* baseUrl */}
            <Text
              title={t?.newDomain?.title || 'New site address'}
              name="newDomain"
              defaultValue={state?.values?.newDomain || ''}
              placeholder="https://example.com"
              state={state}
              icon={<Server className="w-4 h-4" />}
              description=""
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleTestConnection}
            >
              {t?.testBtn || 'Connection test'}
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartEmigration}
            >
              {t?.userBtn || 'Starting user migration'}
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartTaxonomyEmigration}
            >
              {t?.taxoBtn || 'Taxonomy migration begins'}
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartPostEmigration}
            >
              {t?.postBtn || 'Start post migration'}
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartPostCommentEmigration}
            >
              {t?.commentBtn || 'Start migration Post views'}
            </Button>
            {/* <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleTestHtmlToTipTap}
            >
              تست تبدیل HTML به TipTap
            </Button> */}
          </div>

          <TestConnectionReport data={state?.data} />
        </form>
      </div>
    </>
  )
}

const TestConnectionReport = ({ data }: any) => {
  const { connected, message } = data || {}
  if (connected == null) return null
  if (!connected) {
    return (
      <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
        {decodeUnicodeMessage(message)}
      </div>
    )
  }
  return (
    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
      {decodeUnicodeMessage(message)}
    </div>
  )
}
