import MobileMenuList from '../mobile/MobileMenuList'

type Props = {
  items: any
}

export default function VerticalMenu(props: Props) {
  console.log('#2349**********8723 props menu:', props.style)
  return (
    <nav>
      <MobileMenuList {...props} />
    </nav>
  )
}
