import type { LocalizedString } from '@/types/common.types'

export interface NavItem {
  id: string
  label: LocalizedString
  href: string
}

export const navigation: NavItem[] = [
  {
    id: 'products',
    label: { uk: 'Матеріали', ru: 'Материалы' },
    href: '#products',
  },
  {
    id: 'equipment',
    label: { uk: 'Техніка', ru: 'Техника' },
    href: '#equipment',
  },
  {
    id: 'contacts',
    label: { uk: 'Контакти', ru: 'Контакты' },
    href: '#contacts',
  },
]
