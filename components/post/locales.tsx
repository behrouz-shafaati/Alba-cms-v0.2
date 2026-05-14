import { LinkAlba } from '../other/link-alba'

type props = {
  dontExistLocale: string
  post: {
    translations: [
      {
        title: string
        locale: string
      },
    ]
    href: string
  }
}
const PostLocalesList = ({ dontExistLocale, post }: props) => {
  return (
    <div className="w-full py-8 flex flex-col justify-center items-center">
      {dontExistLocale && (
        <span>Sorry! Don'e Exist content in : {dontExistLocale}.</span>
      )}
      <ul className="my-8">
        {post.translations.map((t) => {
          return (
            <LinkAlba key={t.locale} href={`/${t.locale}${post.href}`}>
              <li className="p-4 rounded border">{t.title}</li>
            </LinkAlba>
          )
        })}
      </ul>
    </div>
  )
}

export default PostLocalesList
