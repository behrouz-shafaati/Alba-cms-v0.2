import { Eye } from 'lucide-react'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import Link from 'next/link'

const Header = ({ locale }: { locale: string }) => {
  const { getJson } = useBuilderStore()
  const parsedJson = JSON.parse(getJson())
  const pageHref = locale
    ? `/${locale}/${parsedJson.slug}`
    : `/${parsedJson.slug}`
  return (
    <>
      {parsedJson.slug && (
        <Link className=" hover:brightness-90" href={pageHref} target="_blank">
          <Eye />
        </Link>
      )}
    </>
  )
}

export default Header
