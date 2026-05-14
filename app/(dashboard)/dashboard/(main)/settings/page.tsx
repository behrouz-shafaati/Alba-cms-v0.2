import Form from '@/lib/features/settings/ui/form'

export default async function Page() {
  'use cache'
  return (
    <div className="py-8 px-2">
      <Form tab="general" />
    </div>
  )
}
