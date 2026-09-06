'use client'

import { useState, useEffect, useId, useRef } from 'react'
import Image from 'next/image'
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
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const navigationLabel = locale === 'uk' ? 'Основна навігація' : 'Основная навигация'
  const primaryPhone = contacts.phones[0]
  const getNavHref = (href: string) => (href.startsWith('#') ? `/${locale}${href}` : href)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMobileOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        setIsMobileOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const closeOutside = (event: PointerEvent) => {
      if (
        !headerRef.current?.contains(event.target as Node) &&
        !document.querySelector('dialog[open]')
      ) {
        setIsMobileOpen(false)
      }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [isMobileOpen])

  const closeMobile = () => setIsMobileOpen(false)

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
        isScrolled
          ? 'glass border-b border-surface-border shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <a href={`/${locale}`} className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center sm:w-11">
              <Image
                src="/favicon.png"
                alt=""
                width={44}
                height={37}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <span className="font-display text-base font-bold leading-tight text-ink sm:text-lg">
              БудМат
              <span className="block text-xs font-medium leading-none text-ink-muted">
                Кагарлик
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label={navigationLabel}>
            {navigation.map((item) => (
              <a
                key={item.id}
                href={getNavHref(item.href)}
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
              className="hidden items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-brand-950 shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-400 sm:inline-flex"
            />

            {/* Mobile burger */}
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface-card text-ink-muted transition-colors hover:text-ink lg:hidden"
              onClick={() => setIsMobileOpen((open) => !open)}
              aria-label={isMobileOpen ? dict.nav.menuClose : dict.nav.menuOpen}
              aria-expanded={isMobileOpen}
              aria-controls={menuId}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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
        <nav
          id={menuId}
          aria-label={navigationLabel}
          className="glass max-h-[calc(100dvh-4rem)] animate-fade-in overflow-y-auto border-t border-surface-border lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={getNavHref(item.href)}
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
        </nav>
      )}
    </header>
  )
}
