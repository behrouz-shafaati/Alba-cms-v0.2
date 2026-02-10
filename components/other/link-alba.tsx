import Link from 'next/link'

export function LinkAlba({ prefetch = false, ...props }: any) {
  return <Link prefetch={prefetch} {...props} />
}
