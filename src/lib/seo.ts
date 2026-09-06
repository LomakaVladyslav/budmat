import { defaultLocale, locales } from '@/lib/i18n/config'

export const SITE_URL = 'https://budmat-kaharlyk.com.ua'
export const BUSINESS_ID = `${SITE_URL}/#business`

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString()
}

export function getLanguageAlternates(path = ''): Record<string, string> {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, absoluteUrl(`/${locale}${path}`)]),
    ['x-default', absoluteUrl(`/${defaultLocale}${path}`)],
  ])
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
