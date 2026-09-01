import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'
import { getAllProducts } from '@/lib/repositories/products.repository'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'

const BASE_URL = 'https://budmat-kaharlyk.com.ua'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const homePages = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: locale === 'uk' ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}`]).concat([['x-default', `${BASE_URL}/uk`]])
      ),
    },
  }))

  const returnPolicyPages = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}/return-policy`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: locale === 'uk' ? 0.7 : 0.65,
    alternates: {
      languages: Object.fromEntries(
        locales
          .map((l) => [l, `${BASE_URL}/${l}/return-policy`])
          .concat([['x-default', `${BASE_URL}/uk/return-policy`]])
      ),
    },
  }))

  const productPages = getAllProducts().flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: locale === 'uk' ? 0.85 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales
            .map((l) => [l, `${BASE_URL}/${l}/products/${product.id}`])
            .concat([['x-default', `${BASE_URL}/uk/products/${product.id}`]])
        ),
      },
    }))
  )

  const equipmentPages = getAllEquipment().flatMap((item) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/equipment/${item.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: locale === 'uk' ? 0.85 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales
            .map((l) => [l, `${BASE_URL}/${l}/equipment/${item.id}`])
            .concat([['x-default', `${BASE_URL}/uk/equipment/${item.id}`]])
        ),
      },
    }))
  )

  return [...homePages, ...returnPolicyPages, ...productPages, ...equipmentPages]
}
