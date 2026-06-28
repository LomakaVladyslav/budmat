'use client'

import { useState, useEffect } from 'react'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { navigation } from '@/data/navigation'
import { contacts } from '@/data/contacts'
import { cn } from '@/utils/cn'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { PhoneButton } from '@/components/ui/PhoneButton'

interface HeaderProps {
  locale: Locale
  dict: Dictionary
}

export function Header({ locale, dict }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const primaryPhone = contacts.phones[0]

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setIsMobileOpen(false)

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
        isScrolled
          ? 'glass border-b border-surface-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:h-18 flex h-16 items-center justify-between">
          {/* Logo */}
          <a href={`/${locale}`} className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <span className="font-display text-sm font-bold text-white">Б</span>
            </div>
            <span className="font-display text-lg font-bold leading-tight text-ink">
              БудМат
              <span className="block text-xs font-medium leading-none text-ink-muted">
                Кагарлик
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основна навігація">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-card hover:text-ink"
              >
                {item.label[locale]}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LocaleSwitcher currentLocale={locale} dict={dict} />
            <ThemeToggle dict={dict} />

            {/* Desktop phone CTA */}
            <PhoneButton
              label={dict.nav.callUs}
              dict={dict}
              className="hidden items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-400 sm:inline-flex"
            />

            {/* Mobile burger */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-card text-ink-muted transition-colors hover:text-ink lg:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? dict.nav.menuClose : dict.nav.menuOpen}
              aria-expanded={isMobileOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="glass animate-fade-in border-t border-surface-border lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMobile}
                className="block rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-surface-card hover:text-ink"
              >
                {item.label[locale]}
              </a>
            ))}
            <div className="mt-2 border-t border-surface-border pt-2">
              <PhoneButton label={primaryPhone.display} dict={dict} fullWidth className="py-3" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
