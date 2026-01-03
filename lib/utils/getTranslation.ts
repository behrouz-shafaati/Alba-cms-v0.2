const getTranslation = ({
  translations,
  lang = 'fa',
}: {
  translations: any[]
  lang?: string
}) => {
  if (typeof translations === 'undefined' || translations == null) return {}
  const translation = translations?.find((t) => t.lang === lang) || {}
  return translation
}

export default getTranslation
