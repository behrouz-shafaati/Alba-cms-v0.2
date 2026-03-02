'use client'
import { LoadingButton } from '@/components/ui/loading-button'
import { useBrowserLocale } from '@/hooks/useBrowserLocale'
import { useLocale } from '@/hooks/useLocale'
import { checkVariablesAction } from '@/lib/config/action'
import { useEffect, useState } from 'react'
import DBSuccess from './component/DBSuccess'
import DBAwait from './component/DBAwait'
import DBFail from './component/DBFail'
import JWTSuccess from './component/JWTSuccess'
import JWTFail from './component/JWTFail'
import JWTAwait from './component/JWTAwait'
import Link from 'next/link'

export default function SetDatabaseForm() {
  const t = useLocale()
  const locale = useBrowserLocale()
  const [loading, setLoading] = useState(false)
  const [dbConnectionVariant, setDbConnectionVariant] = useState('await')
  const [jwtVariant, setJwtVariant] = useState('await')
  const [disableButton, setDisableButton] = useState(true)

  const nextHref =
    locale != '' ? `/install/${locale}/admin` : `/install/en/admin`

  useEffect(() => {
    const checkVariables = async () => {
      setLoading(true)
      const testConnetionResult = await checkVariablesAction()
      console.log('#234 testConnetionResult:', testConnetionResult)
      if (testConnetionResult.dbConnection) setDbConnectionVariant('success')
      else setDbConnectionVariant('fail')
      if (testConnetionResult.jwtSecret) setJwtVariant('success')
      else setJwtVariant('fail')
      if (testConnetionResult.dbConnection && testConnetionResult.jwtSecret)
        setDisableButton(false)
      setLoading(false)
    }

    checkVariables()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 py-24">
        {dbConnectionVariant === 'await' && <DBAwait />}
        {dbConnectionVariant === 'fail' && <DBFail />}
        {dbConnectionVariant === 'success' && <DBSuccess />}

        {jwtVariant === 'await' && <JWTAwait />}
        {jwtVariant === 'fail' && <JWTFail />}
        {jwtVariant === 'success' && <JWTSuccess />}
      </div>
      <div className="flex justify-between">
        <div className="w-[25vw]"></div>
        <LoadingButton
          variant="default"
          loading={loading}
          disabled={disableButton}
        >
          <Link href={nextHref} className="py-2 px-4">
            {t.shared.next}
          </Link>
        </LoadingButton>
      </div>
    </div>
  )
}
