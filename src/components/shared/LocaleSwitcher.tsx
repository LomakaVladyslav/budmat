'use client'

import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()

  const switchLocale = (locale: Locale) => {
    // Replace locale prefix in URL
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-0.5 bg-surface-card border border-surface-border rounded-xl p-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={cn(
            'px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200',
            locale === currentLocale
              ? 'bg-brand-500 text-white'
              : 'text-ink-muted hover:text-ink'
          )}
          aria-label={`Перейти на ${locale.toUpperCase()}`}
          aria-current={locale === currentLocale ? 'true' : undefined}
        >
          {dict.localeSwitcher[locale]}
        </button>
      ))}
    </div>
  )
}
