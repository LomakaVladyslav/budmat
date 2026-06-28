import type { Locale } from '@/types/common.types'
import { isValidLocale, defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllProducts } from '@/lib/repositories/products.repository'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'

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

  return (
    <>
      <Header locale={locale} dict={dict} />

      <main id="main-content">
        <HeroSection locale={locale} dict={dict} />

        {/* Client-side catalog: search + filter + products + equipment */}
        <CatalogClient
          locale={locale}
          dict={dict}
          products={products}
          equipment={equipment}
        />

        <ContactsSection locale={locale} dict={dict} />
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}
