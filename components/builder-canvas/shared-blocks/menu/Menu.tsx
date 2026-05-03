import {
  Menu as MenuType,
  MenuTranslationSchema,
} from '@/features/menu/interface'
import HorizontalMenu from './designs/Horizontal'
import VerticalMenu from './designs/Vertical'
import computedStyles from '../../utils/computedStyles'
import { cn } from '@/lib/utils'
import { combineClassNames } from '../../utils/styleUtils'
// import MenuPrefetch from './MenuPrefetch'

interface MainMenuProps {
  blockData: {
    content: { menuId: string }
    type: 'menu'
    content: {}
  }
  widgetName: string
  menu: MenuType
  locale: string
}

function Menu({
  blockData,
  widgetName,
  menu,
  locale,
  ...props
}: MainMenuProps) {
  menu.translations = menu?.translations || []

  const translation: MenuTranslationSchema =
    menu?.translations?.find(
      (t: MenuTranslationSchema) => t.locale === locale,
    ) ||
    menu?.translations[0] ||
    {}
  const items = translation.items
  const { content } = blockData
  const { className = '', ...resProps } = props
  let selectedMenu
  switch (content?.design) {
    case 'vertical':
      selectedMenu = (
        <VerticalMenu
          items={items}
          className={cn(
            className,
            combineClassNames(computedStyles(blockData.styles)),
          )}
          style={{
            ...computedStyles(blockData.styles),
          }}
          content={content}
          {...resProps}
        />
      )
      break
    default:
      selectedMenu = (
        <HorizontalMenu
          items={items}
          className={cn(
            className,
            combineClassNames(computedStyles(blockData.styles)),
          )}
          style={{
            ...computedStyles(blockData.styles),
          }}
          {...resProps}
        />
      )
      break
  }

  return (
    <>
      {/* <MenuPrefetch items={items} /> */}
      {selectedMenu}
    </>
  )
}

export default Menu
