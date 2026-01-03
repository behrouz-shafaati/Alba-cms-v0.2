'use client'

import { useFormStatus } from 'react-dom'
import { LoadingButton } from '../ui/loading-button'
import { useLocale } from '@/hooks/useLocale'

type SubmitButtonProps = {
  text?: string
  className?: string
  loading?: boolean
}
export default function SubmitButton({
  text,
  className = '',
  loading = false,
}: SubmitButtonProps) {
  const t = useLocale()
  const { pending } = useFormStatus()
  const _text = text ? text : t.shared.submitLabel
  return (
    <LoadingButton
      type="submit"
      loading={pending || loading}
      className={className}
    >
      {_text}
    </LoadingButton>
  )
}
