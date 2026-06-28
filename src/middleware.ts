import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isValidLocale } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // Check if the path already has a valid locale prefix
  const pathnameLocale = pathname.split('/')[1]
  if (isValidLocale(pathnameLocale)) {
    return NextResponse.next()
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferredLocale = acceptLanguage.toLowerCase().includes('ru') ? 'ru' : defaultLocale

  // Redirect to locale-prefixed path
  const locale = isValidLocale(preferredLocale) ? preferredLocale : defaultLocale
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
