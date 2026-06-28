import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { contacts } from '@/data/contacts'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PhoneNumberButton } from '@/components/ui/PhoneButton'

interface ContactsSectionProps {
  locale: Locale
  dict: Dictionary
}

export function ContactsSection({ locale, dict }: ContactsSectionProps) {
  const t = dict.contacts
  const mapQuery = `${contacts.mapCoordinates.lat},${contacts.mapCoordinates.lng}`

  return (
    <section
      id="contacts"
      className="border-t border-surface-border bg-surface-card py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t.sectionTitle} subtitle={t.sectionSubtitle} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {/* Phones */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-6 md:p-7">
            <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <span className="text-2xl" aria-hidden="true">
                📞
              </span>
              {t.phonesTitle}
            </h3>
            <div className="space-y-3">
              {contacts.phones.map((phone) => (
                <PhoneNumberButton
                  key={phone.number}
                  phone={phone}
                  dict={dict}
                  variant="contactCard"
                />
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-6 md:p-7">
            <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <span className="text-2xl" aria-hidden="true">
                📍
              </span>
              {t.addressTitle}
            </h3>
            <address className="space-y-4 not-italic">
              <p className="leading-relaxed text-ink-muted">{contacts.address[locale]}</p>
              <div className="h-60 overflow-hidden rounded-xl border border-surface-border bg-surface-card sm:h-64 md:h-72">
                <iframe
                  title={`${t.addressTitle}: ${contacts.address[locale]}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="h-full w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={`https://maps.google.com/?q=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                Google Maps →
              </a>
            </address>
          </div>

          {/* Working hours */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-6 md:p-7">
            <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
              <span className="text-2xl" aria-hidden="true">
                🕐
              </span>
              {t.hoursTitle}
            </h3>
            <div className="space-y-3">
              {contacts.workingHours[locale].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                    idx === contacts.workingHours[locale].length - 1
                      ? 'border border-surface-border bg-surface-card text-ink-muted'
                      : 'border border-surface-border bg-surface-card'
                  }`}
                >
                  <span className="text-ink-muted">{item.days}</span>
                  <span
                    className={`font-bold ${
                      item.hours.toLowerCase().includes('вихідний') ||
                      item.hours.toLowerCase().includes('выходной')
                        ? 'text-ink-faint'
                        : 'text-brand-400'
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
