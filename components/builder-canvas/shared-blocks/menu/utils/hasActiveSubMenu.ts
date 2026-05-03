export default function hasActiveSubMenu(
  menuItems: MenuItem[],
  pageSlug: string,
): boolean {
  for (const item of menuItems) {
    // چک کن آیتم فعلی اکتیو هست؟
    if (item.url.endsWith(pageSlug)) {
      return true
    }

    // اگه subMenu داره، بازگشتی چک کن
    if (item.subMenu && item.subMenu.length > 0) {
      if (hasActiveSubMenu(item.subMenu, currentUrl)) {
        return true
      }
    }
  }

  return false
}
