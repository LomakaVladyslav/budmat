import type { Locale } from '@/types/common.types'

export const locales: Locale[] = ['uk', 'ru']
export const defaultLocale: Locale = 'uk'

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
