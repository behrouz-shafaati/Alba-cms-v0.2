export default function createCatrgoryBreadcrumb(
  category: any,
  title: string,
  locale: string = 'fa'
): string {
  if (category?.parent) {
    const translation: any =
      category.parent?.translations?.find((t: any) => t.lang === locale) ||
      category.parent?.translations[0] ||
      {}
    title = `${translation?.title} > ${title}`
    return createCatrgoryBreadcrumb(category.parent, title)
  }
  return title
}
