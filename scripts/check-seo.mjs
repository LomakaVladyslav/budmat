#!/usr/bin/env node

// Run against a production build: npm run build && npm start
// Then: node scripts/check-seo.mjs http://localhost:3000
import assert from 'node:assert/strict'

const base = new URL(process.argv[2] ?? process.env.SEO_CHECK_URL ?? 'http://localhost:3000')
const expectedOrigin = 'https://budmat-kaharlyk.com.ua'
const issues = []
const publicImages = new Set()
const internalLinks = new Set()
const locales = ['uk', 'ru']
let canonicalOrigin

function check(condition, message) {
  if (!condition) issues.push(message)
}

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, name, doubleQuoted, singleQuoted]) => [
        name.toLowerCase(),
        decode(doubleQuoted ?? singleQuoted),
      ]
    )
  )
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => attributes(tag))
}

function schemaTypes(value, found = []) {
  if (Array.isArray(value)) value.forEach((item) => schemaTypes(item, found))
  else if (value && typeof value === 'object') {
    if (value['@type']) found.push(...[value['@type']].flat())
    Object.values(value).forEach((item) => schemaTypes(item, found))
  }
  return found
}

function pageUrl(canonicalUrl) {
  const url = new URL(canonicalUrl)
  return new URL(`${url.pathname}${url.search}`, base)
}

async function request(url, options = {}) {
  return fetch(url, { signal: AbortSignal.timeout(20_000), ...options })
}

async function parallel(items, visit) {
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(4, items.length) }, async () => {
      while (cursor < items.length) {
        const item = items[cursor++]
        try {
          await visit(item)
        } catch (error) {
          issues.push(`${item}: ${error.message}`)
        }
      }
    })
  )
}

async function main() {
  const sitemapResponse = await request(new URL('/sitemap.xml', base))
  assert.equal(sitemapResponse.status, 200, 'Sitemap must return HTTP 200')
  const sitemap = await sitemapResponse.text()
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
    url: decode(entry.match(/<loc>(.*?)<\/loc>/)?.[1] ?? ''),
    alternates: tags(entry, 'xhtml:link'),
  }))
  assert.ok(entries.length > 0, 'Sitemap must contain URLs')
  canonicalOrigin = new URL(entries[0].url).origin
  check(canonicalOrigin === expectedOrigin, 'Sitemap must use the primary business domain')
  const urls = new Set(entries.map(({ url }) => url))
  check(urls.size === entries.length, 'Sitemap contains duplicate URLs')
  check(canonicalOrigin.startsWith('https://'), 'Canonical site must use HTTPS')

  await parallel(entries, async ({ url, alternates: sitemapAlternates }) => {
    const pathname = new URL(url).pathname
    const [, locale, ...segments] = pathname.split('/')
    const suffix = segments.length ? `/${segments.join('/')}` : ''
    const expectedAlternates = Object.fromEntries(
      [...locales, 'x-default'].map((language) => [
        language,
        `${canonicalOrigin}/${language === 'x-default' ? 'uk' : language}${suffix}`,
      ])
    )
    check(new URL(url).origin === canonicalOrigin, `${pathname}: inconsistent sitemap origin`)
    check(locales.includes(locale), `${pathname}: unsupported locale in sitemap`)
    const response = await request(pageUrl(url), { redirect: 'manual' })
    check(response.status === 200, `${pathname}: expected HTTP 200, got ${response.status}`)
    if (response.status !== 200) return
    check(
      response.headers.get('x-content-type-options') === 'nosniff',
      `${pathname}: missing nosniff header`
    )
    check(
      response.headers.get('x-frame-options') === 'SAMEORIGIN',
      `${pathname}: missing frame protection`
    )
    check(
      response.headers.get('referrer-policy') === 'strict-origin-when-cross-origin',
      `${pathname}: incorrect referrer policy`
    )
    const html = await response.text()
    const metas = tags(html, 'meta')
    const links = tags(html, 'link')
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    const description = metas.find((meta) => meta.name === 'description')?.content
    const canonicals = links.filter((link) => link.rel === 'canonical')
    const htmlAlternates = links.filter((link) => link.rel === 'alternate' && link.hreflang)
    const robots = [
      ...metas
        .filter((meta) => ['robots', 'googlebot'].includes(meta.name))
        .map((meta) => meta.content),
      response.headers.get('x-robots-tag') ?? '',
    ].join(',')
    check(Boolean(title?.trim()), `${pathname}: missing title`)
    check(Boolean(description?.trim()), `${pathname}: missing description`)
    check(tags(html, 'h1').length === 1, `${pathname}: expected exactly one H1`)
    check(tags(html, 'html')[0]?.lang === locale, `${pathname}: incorrect document language`)
    check(!/noindex|none/i.test(robots), `${pathname}: indexing is blocked`)
    check(canonicals.length === 1 && canonicals[0].href === url, `${pathname}: incorrect canonical`)
    for (const [language, alternate] of Object.entries(expectedAlternates)) {
      check(urls.has(alternate), `${pathname}: ${language} alternate is absent from sitemap`)
      check(
        htmlAlternates.filter((link) => link.hreflang === language && link.href === alternate)
          .length === 1,
        `${pathname}: incorrect HTML ${language} alternate`
      )
      check(
        sitemapAlternates.filter((link) => link.hreflang === language && link.href === alternate)
          .length === 1,
        `${pathname}: incorrect sitemap ${language} alternate`
      )
    }
    const structuredData = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter(([, attrs]) => attributes(attrs).type === 'application/ld+json')
      .map(([, , json]) => JSON.parse(json))
    const types = schemaTypes(structuredData)
    if (!suffix || suffix.startsWith('/categories/')) {
      check(!types.includes('Product'), `${pathname}: list page contains Product markup`)
    }
    if (!suffix) check(types.includes('HardwareStore'), `${pathname}: missing HardwareStore markup`)
    if (suffix.startsWith('/categories/')) {
      for (const type of ['CollectionPage', 'ItemList', 'BreadcrumbList']) {
        check(types.includes(type), `${pathname}: missing ${type} markup`)
      }
    }
    if (suffix.startsWith('/products/')) {
      check(types.includes('Product'), `${pathname}: missing Product markup`)
      check(types.includes('BreadcrumbList'), `${pathname}: missing breadcrumb markup`)
    }
    if (suffix.startsWith('/equipment/')) {
      check(types.includes('Service'), `${pathname}: missing Service markup`)
      check(types.includes('BreadcrumbList'), `${pathname}: missing breadcrumb markup`)
    }
    for (const link of tags(html, 'a')) {
      if (!link.href || /^(tel:|mailto:|#)/i.test(link.href)) continue
      const target = new URL(link.href, url)
      if (target.origin === canonicalOrigin && target.pathname !== '/') {
        internalLinks.add(target.pathname)
      }
    }
    for (const image of tags(html, 'img')) {
      check('alt' in image, `${pathname}: image is missing an alt attribute`)
      if (!image.src || image.src.startsWith('data:')) continue
      let target = new URL(image.src, url)
      if (target.pathname === '/_next/image') {
        target = new URL(target.searchParams.get('url') ?? '', canonicalOrigin)
      }
      if (target.origin === canonicalOrigin) publicImages.add(target.pathname)
    }
  })

  const sitemapPaths = new Set([...urls].map((url) => new URL(url).pathname))
  for (const path of internalLinks) {
    check(sitemapPaths.has(path), `Internal link is absent from sitemap: ${path}`)
  }
  await parallel([...publicImages], async (path) => {
    const response = await request(new URL(path, base), { method: 'HEAD', redirect: 'manual' })
    check(response.status === 200, `${path}: image returned HTTP ${response.status}`)
    check(
      response.headers.get('content-type')?.startsWith('image/'),
      `${path}: invalid image content type`
    )
  })

  const missingPaths = [
    '/uk/page-that-does-not-exist',
    '/ru/page-that-does-not-exist',
    '/uk/products/product-that-does-not-exist',
    '/ru/equipment/equipment-that-does-not-exist',
    '/uk/categories/category-that-does-not-exist',
    '/zz',
  ]
  await parallel(missingPaths, async (path) => {
    const response = await request(new URL(path, base))
    const html = await response.text()
    check(response.status === 404, `${path}: missing page returned HTTP ${response.status}`)
    const robots = tags(html, 'meta').filter((meta) => meta.name === 'robots')
    check(
      robots.some((meta) => /noindex/i.test(meta.content ?? '')),
      `${path}: 404 lacks noindex`
    )
  })

  for (const [path, expected] of [
    ['/?utm_source=seo-check&ref=1', '/uk?utm_source=seo-check&ref=1'],
    ['/products/river-sand?utm_source=seo-check', '/uk/products/river-sand?utm_source=seo-check'],
  ]) {
    const response = await request(new URL(path, base), {
      redirect: 'manual',
      headers: { 'Accept-Language': 'ru-RU,ru;q=0.9' },
    })
    check(response.status === 308, `${path}: redirect must be permanent (308)`)
    const location = response.headers.get('location')
    check(Boolean(location), `${path}: redirect lacks Location`)
    if (location) {
      const target = new URL(location, base)
      check(
        `${target.pathname}${target.search}` === expected,
        `${path}: redirect changed path or query`
      )
    }
  }

  const robotsResponse = await request(new URL('/robots.txt', base))
  const robots = await robotsResponse.text()
  check(robotsResponse.status === 200, 'robots.txt must return HTTP 200')
  check(
    robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
    'robots.txt lacks canonical sitemap'
  )
  check(!/^Disallow:\s*\/\s*$/im.test(robots), 'robots.txt blocks the whole site')

  console.log(
    `Checked ${entries.length} sitemap pages, ${publicImages.size} local images, ${missingPaths.length} missing routes, redirects and robots.txt.`
  )
  if (issues.length) {
    console.error(
      `SEO checks failed (${issues.length}):\n${issues.map((issue) => `- ${issue}`).join('\n')}`
    )
    process.exitCode = 1
  } else {
    console.log('All SEO checks passed.')
  }
}

main().catch((error) => {
  console.error(`SEO check could not complete: ${error.message}`)
  process.exitCode = 1
})
