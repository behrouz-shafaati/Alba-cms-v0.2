'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import renderIcon from './render-icons'
import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction } from 'react'
import { useSession } from '@/components/context/SessionContext'
import useCheckActiveNav from '@/hooks/use-check-active-nav'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import authorize from '@/lib/utils/authorize'
import { NavItem, SidebarNavItem } from '@/lib/types'

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
  isCollapsed?: boolean
  closeNav?: () => void
}

export function DashboardNav({
  items,
  setOpen,
  isCollapsed = false,
  closeNav = () => {
    console.log('#0027 closeNav')
  },
}: DashboardNavProps) {
  const path = usePathname()
  const { user } = useSession()

  if (!items?.length) {
    return null
  }

  const renderLink = ({ sub, authorized, ...rest }: SidebarNavItem) => {
    // check permisions
    let canViewLink = false
    for (const permission of authorized || []) {
      if (authorize(user?.roles || [], permission)) canViewLink = true
    }
    if (authorized === undefined || authorized?.length == 0) canViewLink = true
    if (!canViewLink) return null

    const key = `${rest.title}-${rest.href}`
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      )

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      )

    return <NavLink {...rest} key={key} closeNav={closeNav} />
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group border-b bg-background py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2 md:border-none'
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className="grid gap-1 group-[[data-collapsed=true]]:px-2">
          {items.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
    // <span
    //   className={cn(
    //     'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
    //     path === item.href ? 'bg-accent' : 'transparent',
    //     item.disabled && 'cursor-not-allowed opacity-80'
    //   )}
    // >
    //   <Icon className="mx-2 h-4 w-4" />
    //   <span>{item.title}</span>
    // </span>
  )
}

interface NavLinkProps extends SidebarNavItem {
  subLink?: boolean
  closeNav: () => void
  className?: string
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
  className = '',
  sub = [],
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))
  return (
    <Link
      href={href}
      onClick={closeNav}
      className={cn(
        buttonVariants({
          variant:
            checkActiveNav(href) || isChildActive ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'h-12 !justify-start text-wrap rounded-none px-6',
        subLink && 'h-10 w-full border-l border-l-slate-500 px-2',
        className
      )}
      aria-current={checkActiveNav(href) ? 'page' : undefined}
    >
      <div className="ml-2">{renderIcon(icon)}</div>
      {title}
      {label && (
        <div className="mr-2 rounded-lg bg-primary px-1 text-[0.625rem] text-primary-foreground">
          {label}
        </div>
      )}
    </Link>
  )
}

function NavLinkDropdown({
  title,
  icon,
  label,
  sub,
  closeNav,
  ...rest
}: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        role="link"
        type="reset"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'group h-12 w-full justify-between rounded-none px-0'
        )}
      >
        <NavLink
          {...rest}
          title={title}
          closeNav={closeNav}
          icon={icon}
          className="w-[75%]"
          sub={sub}
        />
        <span
          className={cn(
            'transition-all group-data-[state="open"]:-rotate-180 me-8'
          )}
        >
          <ChevronDown strokeWidth={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="collapsibleDropdown" asChild>
        <ul>
          {sub!.map((sublink) => (
            <li key={sublink.title} className="my-1 ms-8">
              <NavLink
                {...sublink}
                subLink
                closeNav={closeNav}
                sub={sublink?.sub}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavLinkIcon({ title, icon, label, href }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: checkActiveNav(href) ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12'
          )}
        >
          {renderIcon(icon)}
          <span className="sr-only">{title} 000</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {title} 002
        {label && (
          <span className="ml-auto text-muted-foreground">{label} 001</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function NavLinkIconDropdown({ title, icon, label, sub }: NavLinkProps) {
  const { checkActiveNav } = useCheckActiveNav()

  /* Open collapsible by default
   * if one of child element is active */
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href))
  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isChildActive ? 'secondary' : 'ghost'}
              size="icon"
              className="h-12 w-12"
            >
              {renderIcon(icon)}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-4">
          {title}{' '}
          {label && (
            <span className="ms-auto text-muted-foreground">{label}</span>
          )}
          <ChevronDown size={18} className="-rotate-90 text-muted-foreground" />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={`${title}-${href}`} asChild>
            <Link
              href={href}
              className={`${checkActiveNav(href) ? 'bg-secondary' : ''}`}
            >
              {renderIcon(icon)}{' '}
              <span className="ml-2 max-w-52 text-wrap">{title}</span>
              {label && <span className="ml-auto text-xs">{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
