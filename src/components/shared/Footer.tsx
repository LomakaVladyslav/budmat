import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { contacts } from '@/data/contacts'
import { navigation } from '@/data/navigation'
import { PhoneNumberButton } from '@/components/ui/PhoneButton'

interface FooterProps {
  locale: Locale
  dict: Dictionary
}

export function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="border-t border-surface-border bg-surface-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <span className="font-display text-sm font-bold text-white">Б</span>
              </div>
              <span className="font-display text-lg font-bold text-ink">БудМат Кагарлик</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">{dict.footer.tagline}</p>
            {/* Phones */}
            <div className="mt-6 space-y-2">
              {contacts.phones.map((phone) => (
                <PhoneNumberButton
                  key={phone.number}
                  phone={phone}
                  dict={dict}
                  variant="footerLink"
                />
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
              {dict.footer.nav}
            </h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink">
              {dict.footer.contacts}
            </h3>
            <address className="space-y-3 not-italic">
              <p className="text-sm leading-relaxed text-ink-muted">{contacts.address[locale]}</p>
              <div className="space-y-1.5">
                {contacts.workingHours[locale].map((item) => (
                  <div key={item.days} className="flex justify-between gap-4 text-sm">
                    <span className="text-ink-muted">{item.days}</span>
                    <span className="shrink-0 font-medium text-ink">{item.hours}</span>
                  </div>
                ))}
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-surface-border pt-8">
          <p className="text-center text-sm text-ink-faint">{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
