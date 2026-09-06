import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { locales, isValidLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'

const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-inter',
})
const manrope = Manrope({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-manrope',
})

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

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${manrope.variable} scroll-smooth`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
