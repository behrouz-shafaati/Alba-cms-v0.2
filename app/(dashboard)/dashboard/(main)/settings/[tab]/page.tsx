import Form from '@/lib/features/settings/ui/form'

interface PageProps {
  params: { tab: 'general' | 'appearance' | 'email' | 'validation' | 'sms' }
  searchParams: { lang?: string }
}
export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const { tab } = resolvedParams

  const resolvedSearchParams = await searchParams
  const lang = resolvedSearchParams?.lang

  return (
    <div className="py-8 px-2">
      <Form tab={tab} lang={lang} />
    </div>
  )
}
