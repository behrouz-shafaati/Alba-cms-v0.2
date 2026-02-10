import { useRouter } from 'next/navigation'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/useLocale'

type Props = {
  onClick?: () => void
}

const BackButton = ({ onClick }: Props) => {
  const t = useLocale()
  const dir = t.dir
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        if (onClick) onClick()
        else router.back()
      }}
    >
      {dir == 'ltr' ? <ChevronLeft /> : <ChevronRight />}
    </Button>
  )
}

export default BackButton
