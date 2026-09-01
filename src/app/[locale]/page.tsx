import type { Locale } from '@/types/common.types'
import { isValidLocale, defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllProducts } from '@/lib/repositories/products.repository'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'
import { contacts } from '@/data/contacts'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { CatalogClient } from '@/components/shared/CatalogClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: PageProps) {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale

  const [dict, products, equipment] = await Promise.all([
    getDictionary(locale),
    Promise.resolve(getAllProducts()),
    Promise.resolve(getAllEquipment()),
  ])
  const baseUrl = 'https://budmat-kaharlyk.com.ua'
  const pageUrl = `${baseUrl}/${locale}`
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: dict.meta.siteName,
    description: dict.meta.description,
    url: pageUrl,
    logo: `${baseUrl}/favicon.ico`,
    image: `${baseUrl}/favicon.png`,
    telephone: contacts.phones.map((phone) => phone.number),
    address: {
      '@type': 'PostalAddress',
      streetAddress: locale === 'uk' ? 'провулок Серпневий' : 'переулок Серпневый',
      addressLocality: locale === 'uk' ? 'Кагарлик' : 'Кагарлык',
      addressRegion: locale === 'uk' ? 'Київська область' : 'Киевская область',
      postalCode: '09200',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contacts.mapCoordinates.lat,
      longitude: contacts.mapCoordinates.lng,
    },
    openingHours: ['Mo-Fr 08:00-17:00', 'Sa 08:00-15:00'],
    areaServed: [
      locale === 'uk' ? 'Кагарлик' : 'Кагарлык',
      locale === 'uk' ? 'Київська область' : 'Киевская область',
    ],
    priceRange: '₴',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        locale === 'uk'
          ? 'Будівельні матеріали та спецтехніка'
          : 'Строительные материалы и спецтехника',
      itemListElement: [
        ...products.map((product) => {
          const productUrl = `${baseUrl}/${locale}/products/${product.id}`
          const availability =
            product.status === 'available'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder'
          const offer = {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'UAH',
            price: product.price,
            availability,
            itemCondition: 'https://schema.org/NewCondition',
          }

          return {
            '@type': 'Offer',
            url: productUrl,
            itemOffered: {
              '@type': 'Product',
              name: product.name[locale],
              description: product.description[locale],
              image: `${baseUrl}${product.image}`,
              sku: product.id,
              category: dict.products.categories[product.category],
              url: productUrl,
              offers: offer,
            },
            price: product.price,
            priceCurrency: 'UAH',
            availability,
          }
        }),
        ...equipment.map((item) => {
          const equipmentUrl = `${baseUrl}/${locale}/equipment/${item.id}`

          return {
            '@type': 'Offer',
            url: equipmentUrl,
            itemOffered: {
              '@type': 'Service',
              name: item.name[locale],
              description: item.description[locale],
              image: `${baseUrl}${item.image}`,
              url: equipmentUrl,
            },
            price: item.price ?? undefined,
            priceCurrency: item.price !== null ? 'UAH' : undefined,
          }
        }),
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Header locale={locale} dict={dict} />

      <main id="main-content">
        <HeroSection locale={locale} dict={dict} />

        {/* Client-side catalog: search + filter + products + equipment */}
        <CatalogClient locale={locale} dict={dict} products={products} equipment={equipment} />

        <ContactsSection locale={locale} dict={dict} />
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
