import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllProducts } from '@/lib/repositories/products.repository'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'
import { absoluteUrl, BUSINESS_ID, getLanguageAlternates, serializeJsonLd } from '@/lib/seo'
import { contacts } from '@/data/contacts'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { CatalogClient } from '@/components/shared/CatalogClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const { meta } = await getDictionary(locale)
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${locale}`, languages: getLanguageAlternates() },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      siteName: meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      type: 'website',
      images: [{ url: '/catalog/products/granite-crushed-stone-5-20.jpg', alt: meta.siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/catalog/products/granite-crushed-stone-5-20.jpg'],
    },
  }
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const dict = await getDictionary(locale)
  const products = getAllProducts()
  const equipment = getAllEquipment()
  const pageUrl = absoluteUrl(`/${locale}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HardwareStore',
        '@id': BUSINESS_ID,
        name: dict.meta.siteName,
        description: dict.meta.description,
        url: absoluteUrl('/uk'),
        logo: absoluteUrl('/favicon.png'),
        image: absoluteUrl('/favicon.png'),
        telephone: contacts.phones.map((phone) => phone.number),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'провулок Серпневий',
          addressLocality: 'Кагарлик',
          addressRegion: 'Київська область',
          postalCode: '09200',
          addressCountry: 'UA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: contacts.mapCoordinates.lat,
          longitude: contacts.mapCoordinates.lng,
        },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${contacts.mapCoordinates.lat},${contacts.mapCoordinates.lng}`,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '08:00',
            closes: '15:00',
          },
        ],
        areaServed: ['Кагарлик', 'Київська область'],
      },
      {
        '@type': 'WebSite',
        '@id': absoluteUrl('/#website'),
        url: absoluteUrl('/'),
        name: dict.meta.siteName,
        inLanguage: ['uk', 'ru'],
        publisher: { '@id': BUSINESS_ID },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': absoluteUrl('/#website') },
        about: { '@id': BUSINESS_ID },
        mainEntity: { '@id': `${pageUrl}#catalog` },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#catalog`,
        name: dict.hero.headline,
        numberOfItems: products.length + equipment.length,
        itemListElement: [
          ...products.map((product) => ({
            name: product.name[locale],
            url: absoluteUrl(`/${locale}/products/${product.id}`),
          })),
          ...equipment.map((item) => ({
            name: item.name[locale],
            url: absoluteUrl(`/${locale}/equipment/${item.id}`),
          })),
        ].map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Header locale={locale} dict={dict} />
      <main id="main-content">
        <HeroSection locale={locale} dict={dict} />
        <CatalogClient locale={locale} dict={dict} products={products} equipment={equipment} />
        <section className="border-y border-surface-border bg-surface-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-ink">
              {locale === 'uk'
                ? 'Як замовити матеріали та спецтехніку'
                : 'Как заказать материалы и спецтехнику'}
            </h2>
            <ol className="mt-6 grid list-inside list-decimal gap-6 text-ink-muted md:grid-cols-3">
              <li className="leading-relaxed">
                {locale === 'uk'
                  ? 'Оберіть товар у каталозі або техніку для ваших робіт. Підготуйте кількість, потрібні розміри чи фракцію та бажану дату.'
                  : 'Выберите товар в каталоге или технику для ваших работ. Подготовьте количество, нужные размеры или фракцию и желаемую дату.'}
              </li>
              <li className="leading-relaxed">
                {locale === 'uk'
                  ? 'Зателефонуйте менеджеру, щоб підтвердити наявність матеріалів або доступність техніки, ціну та умови замовлення.'
                  : 'Позвоните менеджеру, чтобы подтвердить наличие материалов или доступность техники, цену и условия заказа.'}
              </li>
              <li className="leading-relaxed">
                {locale === 'uk'
                  ? 'Погодьте самовивіз або доставку. Перевезення, подача техніки та розвантаження узгоджуються окремо.'
                  : 'Согласуйте самовывоз или доставку. Перевозка, подача техники и разгрузка согласовываются отдельно.'}
              </li>
            </ol>
          </div>
        </section>
        <ContactsSection locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
