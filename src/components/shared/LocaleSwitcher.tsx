'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { locales } from '@/lib/i18n/config'
import { cn } from '@/utils/cn'

interface LocaleSwitcherProps {
  currentLocale: Locale
  dict: Dictionary
}

export function LocaleSwitcher({ currentLocale, dict }: LocaleSwitcherProps) {
  const pathname = usePathname()
  const pagePath = pathname.replace(/^\/(uk|ru)(?=\/|$)/, '')

  return (
    <nav
      className="flex items-center gap-0.5 rounded-xl border border-surface-border bg-surface-card p-1"
      aria-label={currentLocale === 'uk' ? 'Мова сайту' : 'Язык сайта'}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pagePath}`}
          hrefLang={locale}
          lang={locale}
          prefetch={false}
          className={cn(
            'rounded-lg px-2 py-2 text-xs font-bold transition-all duration-200',
            locale === currentLocale
              ? 'bg-brand-500 text-brand-950'
              : 'text-ink-muted hover:text-ink'
          )}
          aria-label={locale === 'uk' ? 'Українська' : 'Русский'}
          aria-current={locale === currentLocale ? 'page' : undefined}
        >
          {dict.localeSwitcher[locale]}
        </Link>
      ))}
    </nav>
  )
}
