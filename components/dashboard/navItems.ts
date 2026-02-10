import {
  DashboardLocaleSchema,
  getDashboardDictionary,
} from '@/lib/i18n/dashboard'
import { SidebarNavItem, SupportedLanguage } from '@/lib/types'

type Props = {
  locale?: SupportedLanguage
  dictionary?: DashboardLocaleSchema
}
export default function getNavItems({ locale, dictionary }: Props) {
  let t
  if (locale) t = getDashboardDictionary(locale)
  else if (dictionary) t = dictionary
  else return null
  const navItems: SidebarNavItem[] = [
    {
      slug: 'dashboard',
      title: t?.feature?.dashboard?.title || 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      authorized: ['dashboard.view.any'],
    },
    {
      slug: 'post',
      title: t?.feature?.post?.title || 'Posts',
      href: '/dashboard/posts',
      icon: 'FileText',
      authorized: ['post.view.any', 'post.view.own', 'postComment.view.own'],
      sub: [
        {
          slug: 'createPost',
          title: t?.feature?.post?.create || 'Add post',
          href: '/dashboard/posts/create',
          icon: 'Plus',
          authorized: ['post.create'],
        },
      ],
    },
    {
      slug: 'post-comment',
      title: t?.feature?.postComment?.title || 'Comments',
      href: '/dashboard/post-comments',
      icon: 'MessageSquare',
      label: '',
      authorized: ['postComment.moderate.any', 'postComment.view.any'],
    },
    {
      slug: 'user',
      title: t?.feature?.user?.title || 'Users',
      href: '/dashboard/users',
      icon: 'Users',
      label: '',
      authorized: ['user.view.any', 'user.view.own'],
      sub: [
        {
          slug: 'createUser',
          title: t?.feature?.user?.create || 'Add user',
          href: '/dashboard/users/create',
          icon: 'Plus',
          label: '',
          authorized: ['user.create'],
        },
      ],
    },
    {
      slug: 'category',
      title: t?.feature?.category?.title || 'Categories',
      href: '/dashboard/categories',
      icon: 'FolderTree',
      label: '',
      authorized: ['category.view.any', 'category.view.own'],
      sub: [
        {
          slug: 'createCategory',
          title: t?.feature?.category?.create || 'Add category',
          href: '/dashboard/categories/create',
          icon: 'Plus',
          label: '',
          authorized: ['category.create'],
        },
      ],
    },
    {
      slug: 'tag',
      title: t?.feature?.tag?.title || 'Tags',
      href: '/dashboard/tags',
      icon: 'Tag',
      label: '',
      authorized: ['tag.view.any', 'tag.view.own'],
      sub: [
        {
          slug: 'createTag',
          title: t?.feature?.tag?.create || 'Add tag',
          href: '/dashboard/tags/create',
          icon: 'Plus',
          label: '',
          authorized: ['tag.create'],
        },
      ],
    },
    {
      slug: 'menu',
      title: t?.feature?.menu?.title || 'Menus',
      href: '/dashboard/menus',
      icon: 'Menu',
      label: '',
      authorized: ['menu.view.any', 'menu.view.own'],
      sub: [
        {
          slug: 'createMenu',
          title: t?.feature?.menu?.create || 'Add menu',
          href: '/dashboard/menus/create',
          icon: 'Plus',
          label: '',
          authorized: ['menu.create'],
        },
      ],
    },
    {
      slug: 'page',
      title: t?.feature?.page?.title || 'Pages',
      href: '/dashboard/pages',
      icon: 'Files',
      label: '',
      authorized: ['page.view.any', 'page.view.own'],
      sub: [
        {
          slug: 'createPage',
          title: t?.feature?.page?.create || 'Add page',
          href: '/dashboard/pages/create',
          icon: 'Plus',
          label: '',
          authorized: ['page.create'],
        },
      ],
    },
    {
      slug: 'ad-campaign',
      title: t?.feature?.adCampaign?.title || 'AD Campaign',
      href: '/dashboard/ad-campaigns',
      icon: 'Megaphone',
      label: '',
      authorized: ['campaign.view.any', 'campaign.view.own'],
      sub: [
        {
          slug: 'createADCampaign',
          title: t?.feature?.adCampaign?.create || 'Add campaign',
          href: '/dashboard/ad-campaigns/create',
          icon: 'Plus',
          label: '',
          authorized: ['campaign.create'],
        },
      ],
    },

    {
      slug: 'form',
      title: t?.feature?.form?.title || 'Forms',
      href: '/dashboard/forms',
      icon: 'ClipboardList',
      label: '',
      authorized: ['form.view.any', 'form.view.own'],
      sub: [
        {
          slug: 'createForm',
          title: t?.feature?.form?.create || 'Add form',
          href: '/dashboard/forms/create',
          icon: 'Plus',
          label: '',
          authorized: ['form.create'],
        },
      ],
    },
    {
      slug: 'template',
      title: t?.feature?.template?.title || 'Templates',
      href: '/dashboard/templates',
      icon: 'LayoutTemplate',
      label: '',
      authorized: ['template.view.any', 'template.view.own'],
      sub: [
        {
          slug: 'createTemplate',
          title: t?.feature?.template?.create || 'Add template',
          href: '/dashboard/templates/create',
          icon: 'Plus',
          label: '',
          authorized: ['template.create'],
        },
      ],
    },
    {
      slug: 'section',
      title: t?.feature?.section?.title || 'Sections',
      href: '/dashboard/sections',
      icon: 'Layers',
      label: '',
      authorized: ['template.view.any', 'template.view.own'],
      sub: [
        {
          slug: 'createSection',
          title: t?.feature?.section?.create || 'Add section',
          href: '/dashboard/sections/create',
          icon: 'Plus',
          label: '',
          authorized: ['template.create'],
        },
      ],
    },
    {
      slug: 'settings',
      title: t?.feature?.setting?.title || 'Settings',
      href: '/dashboard/settings/general',
      icon: 'Settings',
      label: '',
      authorized: [
        'settings.view.any',
        'settings.view.own',
        'settings.moderate.any',
      ],
      sub: [
        {
          slug: 'general',
          title: t?.feature?.setting?.general?.title || 'General',
          href: '/dashboard/settings/general',
          icon: 'Sliders',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'users',
          title: t?.feature?.setting?.users?.title || 'Users',
          href: '/dashboard/settings/users',
          icon: 'UserCog',
          label: '',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'locales',
          title: t?.feature?.setting?.locales?.title || 'Locales',
          href: '/dashboard/settings/locales',
          icon: 'Globe',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'appearance',
          title: t?.feature?.setting?.appearance?.title || 'Appearance',
          href: '/dashboard/settings/appearance',
          icon: 'Palette',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'ad',
          title: t?.feature?.setting?.adCampaign?.title || 'AD Campaign',
          href: '/dashboard/settings/ad',
          icon: 'Megaphone',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'email',
          title: t?.feature?.setting?.email?.title || 'Email',
          href: '/dashboard/settings/email',
          icon: 'Mail',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'sms',
          title: t?.feature?.setting?.sms?.title || 'SMS',
          href: '/dashboard/settings/sms',
          icon: 'MessageCircle',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'validation',
          title: t?.feature?.setting?.validation?.title || 'Validation',
          href: '/dashboard/settings/validation',
          icon: 'ShieldCheck',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
        {
          slug: 'wpEmigration',
          title: t?.feature?.setting?.wpEmigration?.title || 'WP Emigration',
          href: '/dashboard/settings/wp-emigration',
          icon: 'ArrowRightLeft',
          authorized: [
            'settings.view.any',
            'settings.view.own',
            'settings.moderate.any',
          ],
        },
      ],
    },

    {
      slug: 'logout',
      title: t?.feature?.logout?.title || 'Logout',
      href: '/logout',
      icon: 'LogOut',
      label: '',
      authorized: [],
    },
  ]
  return navItems
}
