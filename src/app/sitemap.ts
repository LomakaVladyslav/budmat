import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/config'

const BASE_URL = 'https://budmat-kaharlyk.com.ua'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: locale === 'uk' ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l === 'uk' ? 'uk-UA' : 'ru-UA', `${BASE_URL}/${l}`])
      ),
    },
  }))
}
