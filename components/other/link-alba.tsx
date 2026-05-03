import Link from 'next/link'

export function LinkAlba({
  prefetch = false,
  ...props
}: {
  href: string
  prefetch?: boolean
}) {
  return <Link prefetch={prefetch} {...props} />
}
