import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Locale } from '@/types/common.types'
import type { Equipment } from '@/types/equipment.types'
import { contacts } from '@/data/contacts'
import { locales, isValidLocale, defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/utils/formatPrice'

const BASE_URL = 'https://budmat-kaharlyk.com.ua'

interface EquipmentPageProps {
  params: Promise<{ locale: string; equipmentId: string }>
}

const pageText = {
  uk: {
    backToCatalog: 'До спецтехніки',
    serviceBadge: 'Послуга спецтехніки',
    price: 'Ціна',
    area: 'Регіон роботи',
    areaValue: 'Кагарлик та Київська область',
    deliveryTitle: 'Замовлення техніки',
    deliveryText:
      'Подачу техніки, доступність на потрібну дату, маршрут, обсяг робіт і фінальну вартість уточнюйте телефоном.',
    relatedTitle: 'Інші послуги спецтехніки',
    relatedSubtitle: 'Ще кілька варіантів для будівельних і земляних робіт',
    homeBreadcrumb: 'Послуги спецтехніки',
    contractPrice: 'Ціна договірна',
  },
  ru: {
    backToCatalog: 'К спецтехнике',
    serviceBadge: 'Услуга спецтехники',
    price: 'Цена',
    area: 'Регион работы',
    areaValue: 'Кагарлык и Киевская область',
    deliveryTitle: 'Заказ техники',
    deliveryText:
      'Подачу техники, доступность на нужную дату, маршрут, объем работ и финальную стоимость уточняйте по телефону.',
    relatedTitle: 'Другие услуги спецтехники',
    relatedSubtitle: 'Еще несколько вариантов для строительных и земляных работ',
    homeBreadcrumb: 'Услуги спецтехники',
    contractPrice: 'Цена договорная',
  },
} satisfies Record<Locale, Record<string, string>>

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllEquipment().map((item) => ({
      locale,
      equipmentId: item.id,
    }))
  )
}

export async function generateMetadata({ params }: EquipmentPageProps): Promise<Metadata> {
  const { locale: rawLocale, equipmentId } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const item = getVisibleEquipment(equipmentId)

  if (!item) {
    return {}
  }

  const dict = await getDictionary(locale)
  const priceText = getEquipmentPriceText(item, locale, 'грн')
  const title =
    locale === 'uk'
      ? `${item.name[locale]} в Кагарлику - ${priceText} | ${dict.meta.siteName}`
      : `${item.name[locale]} в Кагарлыке - ${priceText} | ${dict.meta.siteName}`
  const description =
    locale === 'uk'
      ? `${item.description[locale]} Ціна: ${priceText}.`
      : `${item.description[locale]} Цена: ${priceText}.`
  const equipmentPath = `/${locale}/equipment/${item.id}`
  const locationKeywords =
    locale === 'uk'
      ? [`${item.name[locale]} Кагарлик`, `${item.name[locale]} Київська область`]
      : [`${item.name[locale]} Кагарлык`, `${item.name[locale]} Киевская область`]
  const serviceKeywords =
    locale === 'uk'
      ? ['послуги спецтехніки', 'оренда спецтехніки', 'земляні роботи']
      : ['услуги спецтехники', 'аренда спецтехники', 'земляные работы']

  return {
    title,
    description,
    keywords: [
      item.name[locale],
      ...locationKeywords,
      ...serviceKeywords,
      ...item.applications[locale],
      ...item.specifications.flatMap((spec) => [spec.label[locale], spec.value[locale]]),
    ],
    openGraph: {
      title,
      description,
      url: equipmentPath,
      siteName: dict.meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      type: 'website',
      images: [
        {
          url: item.image,
          alt: item.name[locale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.image],
    },
    alternates: {
      canonical: equipmentPath,
      languages: {
        'uk-UA': `/uk/equipment/${item.id}`,
        'ru-UA': `/ru/equipment/${item.id}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
  const { locale: rawLocale, equipmentId } = await params

  if (!isValidLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const item = getVisibleEquipment(equipmentId)

  if (!item) {
    notFound()
  }

  const dict = await getDictionary(locale)
  const t = dict.equipment
  const text = pageText[locale]
  const relatedEquipment = getAllEquipment()
    .filter((related) => related.id !== item.id)
    .slice(0, 3)
  const equipmentUrl = `${BASE_URL}/${locale}/equipment/${item.id}`
  const equipmentJsonLd = buildEquipmentJsonLd(item, locale, equipmentUrl, dict.meta.siteName)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(equipmentJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Header locale={locale} dict={dict} />

      <main id="main-content" className="pt-24">
        <section className="py-8 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link
                href={`/${locale}#equipment`}
                className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
              >
                {text.backToCatalog}
              </Link>
              <span className="text-ink-faint" aria-hidden="true">
                /
              </span>
              <span className="text-ink-muted">{item.name[locale]}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-surface-border bg-surface-muted lg:aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.name[locale]}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>

              <div className="lg:pt-2">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="brand">{text.serviceBadge}</Badge>
                  {item.minimumHours && (
                    <Badge variant="muted">
                      {t.modalMinHours}: {item.minimumHours} {t.modalHours}
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                  {item.name[locale]}
                </h1>

                <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                  {item.description[locale]}
                </p>

                <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
                    <dt className="text-sm font-semibold text-ink-muted">{text.price}</dt>
                    <dd className="mt-1">
                      <span className="font-display text-3xl font-bold text-brand-400">
                        {item.price === null
                          ? (item.priceLabel?.[locale] ?? text.contractPrice)
                          : `${formatPrice(item.price)} ₴`}
                      </span>
                      {item.price !== null && item.priceNote && (
                        <span className="ml-2 text-sm text-ink-muted">
                          / {item.priceNote[locale]}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
                    <dt className="text-sm font-semibold text-ink-muted">{text.area}</dt>
                    <dd className="mt-2 text-lg font-semibold text-ink">{text.areaValue}</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <PhoneButton label={t.modalCall} dict={dict} size="lg" fullWidth />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-surface-card py-10 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-bold text-ink">{t.modalSpecs}</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-surface-border">
                {item.specifications.map((spec, index) => (
                  <div
                    key={`${spec.label[locale]}-${spec.value[locale]}`}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                      index % 2 === 0 ? 'bg-surface-muted' : 'bg-surface-card'
                    }`}
                  >
                    <span className="text-ink-muted">{spec.label[locale]}</span>
                    <span className="text-right font-semibold text-ink">{spec.value[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">{t.modalApplications}</h2>
              <ul className="mt-4 space-y-3">
                {item.applications[locale].map((app) => (
                  <li
                    key={app}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
                  >
                    <span className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                      ✓
                    </span>
                    {app}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 font-display text-xl font-bold text-ink">{text.deliveryTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{text.deliveryText}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {contacts.address[locale]}
              </p>
            </div>
          </div>
        </section>

        {relatedEquipment.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">{text.relatedTitle}</h2>
                <p className="mt-2 text-sm text-ink-muted">{text.relatedSubtitle}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedEquipment.map((related) => (
                  <Link
                    key={related.id}
                    href={`/${locale}/equipment/${related.id}`}
                    className="group overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5"
                  >
                    <div className="relative aspect-video overflow-hidden bg-surface-muted">
                      <Image
                        src={related.image}
                        alt={related.name[locale]}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-400">
                        {related.name[locale]}
                      </h3>
                      <p className="mt-3 font-display text-xl font-bold text-brand-400">
                        {getEquipmentPriceText(related, locale)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContactsSection locale={locale} dict={dict} />
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

function getVisibleEquipment(equipmentId: string): Equipment | undefined {
  return getAllEquipment().find((item) => item.id === equipmentId)
}

function getEquipmentPriceText(item: Equipment, locale: Locale, currency = '₴'): string {
  if (item.price === null) {
    return item.priceLabel?.[locale] ?? pageText[locale].contractPrice
  }

  const price = `${formatPrice(item.price)} ${currency}`
  return item.priceNote ? `${price} / ${item.priceNote[locale]}` : price
}

function buildEquipmentJsonLd(
  item: Equipment,
  locale: Locale,
  equipmentUrl: string,
  siteName: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: item.name[locale],
        description: item.description[locale],
        image: `${BASE_URL}${item.image}`,
        serviceType: pageText[locale].serviceBadge,
        areaServed: pageText[locale].areaValue,
        provider: {
          '@type': 'LocalBusiness',
          name: siteName,
          telephone: contacts.phones.map((phone) => phone.number),
          address: {
            '@type': 'PostalAddress',
            streetAddress: locale === 'uk' ? 'провулок Серпневий' : 'переулок Серпневый',
            addressLocality: locale === 'uk' ? 'Кагарлик' : 'Кагарлык',
            addressRegion: locale === 'uk' ? 'Київська область' : 'Киевская область',
            postalCode: '09200',
            addressCountry: 'UA',
          },
        },
        offers: {
          '@type': 'Offer',
          url: equipmentUrl,
          priceCurrency: item.price !== null ? 'UAH' : undefined,
          price: item.price ?? undefined,
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: pageText[locale].homeBreadcrumb,
            item: `${BASE_URL}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: item.name[locale],
            item: equipmentUrl,
          },
        ],
      },
    ],
  }
}
