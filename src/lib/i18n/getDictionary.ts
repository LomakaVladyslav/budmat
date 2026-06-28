import type { Locale } from '@/types/common.types'
import type { Dictionary } from './dictionaries/uk'

const dictionaries: Record<Locale, () => Promise<{ default?: Dictionary } & Dictionary>> = {
  uk: () => import('./dictionaries/uk').then((m) => ({ ...m.uk, default: m.uk })),
  ru: () => import('./dictionaries/ru').then((m) => ({ ...m.ru, default: m.ru })),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.uk
  const mod = await loader()
  // Return the named export (uk / ru) which is the dictionary object
  if ('default' in mod && mod.default) return mod.default as Dictionary
  return mod as unknown as Dictionary
}
