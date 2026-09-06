import type { MetadataRoute } from 'next'
import { PRODUCT_CATEGORIES } from '@/constants/categories'
import { locales } from '@/lib/i18n/config'
import { getAllProducts, getProductsByCategory } from '@/lib/repositories/products.repository'
import { getAllEquipment } from '@/lib/repositories/equipment.repository'
import { absoluteUrl, getLanguageAlternates } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/return-policy',
    ...PRODUCT_CATEGORIES.filter((category) => getProductsByCategory(category).length > 0).map(
      (category) => `/categories/${category}`
    ),
    ...getAllProducts().map((product) => `/products/${product.id}`),
    ...getAllEquipment().map((item) => `/equipment/${item.id}`),
  ]

  // Omit lastModified until content has reliable update dates; deployment time is not one.
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      alternates: { languages: getLanguageAlternates(path) },
    }))
  )
}
