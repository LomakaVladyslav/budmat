import type { Metadata } from 'next'
import type { Locale } from '@/types/common.types'
import { defaultLocale, isValidLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { contacts } from '@/data/contacts'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

interface ReturnPolicyPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://budmat-kaharlyk.com.ua'

interface PolicyContentBlock {
  id: string
  paragraph?: string
  list?: string[]
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: ReturnPolicyPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const dict = await getDictionary(locale)

  return {
    title: dict.returnPolicy.metaTitle,
    description: dict.returnPolicy.metaDescription,
    alternates: {
      canonical: `/${locale}/return-policy`,
      languages: {
        uk: '/uk/return-policy',
        ru: '/ru/return-policy',
        'x-default': '/uk/return-policy',
      },
    },
    openGraph: {
      title: dict.returnPolicy.metaTitle,
      description: dict.returnPolicy.metaDescription,
      url: `${baseUrl}/${locale}/return-policy`,
      siteName: dict.meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ReturnPolicyPage({ params }: ReturnPolicyPageProps) {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main className="min-h-screen bg-surface">
        <section className="border-b border-surface-border bg-surface-card pt-28">
          <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-500">
              {dict.returnPolicy.eyebrow}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {dict.returnPolicy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink-muted sm:text-lg">
              {dict.returnPolicy.intro}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0 space-y-8">
              <div className="rounded-lg border border-surface-border bg-surface-card p-5 shadow-sm sm:p-6">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {dict.returnPolicy.summaryTitle}
                </h2>
                <ul className="mt-5 space-y-3">
                  {dict.returnPolicy.summary.map((item) => (
                    <li
                      key={item}
                      className="flex min-w-0 gap-3 break-words text-sm leading-6 text-ink-muted"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {dict.returnPolicy.sections.map((section) => (
                <article
                  key={section.id}
                  className="rounded-lg border border-surface-border bg-surface-card p-5 shadow-sm sm:p-6"
                >
                  <h2 className="font-display text-2xl font-bold text-ink">{section.title}</h2>
                  <PolicyContent blocks={section.content} />
                </article>
              ))}
            </div>

            <aside className="h-fit min-w-0 rounded-lg border border-surface-border bg-surface-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-bold text-ink">
                {dict.returnPolicy.contact.title}
              </h2>
              <PolicyContent blocks={dict.returnPolicy.contact.content} compact />
              <div className="mt-5 space-y-2">
                {contacts.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={`tel:${phone.number}`}
                    className="block rounded-lg border border-surface-border bg-surface-muted px-3 py-2.5 text-sm font-semibold text-brand-400 transition-colors hover:border-brand-500/30 hover:text-brand-300"
                  >
                    {phone.display}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

function PolicyContent({
  blocks,
  compact = false,
}: {
  blocks: PolicyContentBlock[]
  compact?: boolean
}) {
  return (
    <div className={compact ? 'mt-3 space-y-3' : 'mt-4 space-y-4'}>
      {blocks.map((block) => {
        if (block.list) {
          return (
            <ul key={block.id} className={compact ? 'space-y-2' : 'space-y-3'}>
              {block.list.map((item) => (
                <li
                  key={`${block.id}-${item}`}
                  className="flex min-w-0 gap-3 break-words text-sm leading-6 text-ink-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p
            key={block.id}
            className={
              compact
                ? 'break-words text-sm leading-6 text-ink-muted'
                : 'break-words text-sm leading-7 text-ink-muted sm:text-base'
            }
          >
            {block.paragraph}
          </p>
        )
      })}
    </div>
  )
}
