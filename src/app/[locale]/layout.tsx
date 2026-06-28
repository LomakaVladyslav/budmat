import type { Metadata } from 'next'
import type { Locale } from '@/types/common.types'
import { locales, isValidLocale, defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { notFound } from 'next/navigation'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const themeScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem('budmat-theme')
    document.documentElement.dataset.theme = storedTheme === 'dark' ? 'dark' : 'light'
  } catch {
    document.documentElement.dataset.theme = 'light'
  }
})()
`

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const dict = await getDictionary(locale)

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords:
      locale === 'uk'
        ? 'будівельні матеріали, цемент, щебінь, пісок, газоблоки, послуги спецтехніки, екскаватор, бульдозер, Кагарлик, Київська область'
        : 'строительные материалы, цемент, щебень, песок, газоблоки, услуги спецтехники, экскаватор, бульдозер, Кагарлык, Киевская область',
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: dict.meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'uk-UA': '/uk',
        'ru-UA': '/ru',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params

  if (!isValidLocale(rawLocale)) {
    notFound()
  }

  return (
    <html lang={rawLocale} className="scroll-smooth" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
