'use client'
import { Button } from '@/components/ui/button'
import { useBrowserLocale } from '@/hooks/useBrowserLocale'
import { useLocale } from '@/hooks/useLocale'
import Link from 'next/link'

export default function InstallFinish() {
  const locale = useBrowserLocale()
  const t = useLocale()

  return (
    <div className="flex flex-col gap-16 py-16">
      <p>{t.installer.steps.finish.description}</p>
      <Button variant="default" className="p-0">
        <Link href={`/${locale}/login`} className="py-2 px-4 w-full">
          {t.shared.login}
        </Link>
      </Button>
    </div>
  )
}
