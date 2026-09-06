import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Locale } from '@/types/common.types'
import type { Product } from '@/types/product.types'
import { contacts } from '@/data/contacts'
import { locales, isValidLocale, defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllProducts } from '@/lib/repositories/products.repository'
import { absoluteUrl, BUSINESS_ID, getLanguageAlternates, serializeJsonLd } from '@/lib/seo'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/utils/formatPrice'

interface ProductPageProps {
  params: Promise<{ locale: string; productId: string }>
}

const pageText = {
  uk: {
    homeBreadcrumb: 'Головна',
    breadcrumbs: 'Навігаційний шлях',
    location: 'в Кагарлику',
    category: 'Категорія',
    price: 'Ціна',
    inStock: 'В наявності',
    byOrder: 'Під замовлення',
    deliveryTitle: 'Доставка та замовлення',
    deliveryText:
      'Наявність, доставку по Кагарлику та Київській області, обсяг і деталі замовлення уточнюйте телефоном.',
    relatedTitle: 'Схожі товари',
    relatedSubtitle: 'Інші позиції з цієї категорії',
    orderDetailsTitle: 'Що підготувати для замовлення',
    orderProduct: 'Назву товару та потрібну кількість',
    orderAddress: 'Адресу та бажану дату доставки',
    orderAccess: 'Інформацію про під’їзд і розвантаження',
    viewCategory: 'Усі товари категорії',
  },
  ru: {
    homeBreadcrumb: 'Главная',
    breadcrumbs: 'Навигационная цепочка',
    location: 'в Кагарлыке',
    category: 'Категория',
    price: 'Цена',
    inStock: 'В наличии',
    byOrder: 'Под заказ',
    deliveryTitle: 'Доставка и заказ',
    deliveryText:
      'Наличие, доставку по Кагарлыку и Киевской области, объем и детали заказа уточняйте по телефону.',
    relatedTitle: 'Похожие товары',
    relatedSubtitle: 'Другие позиции из этой категории',
    orderDetailsTitle: 'Что подготовить для заказа',
    orderProduct: 'Название товара и нужное количество',
    orderAddress: 'Адрес и желаемую дату доставки',
    orderAccess: 'Информацию о подъезде и разгрузке',
    viewCategory: 'Все товары категории',
  },
} satisfies Record<Locale, Record<string, string>>

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllProducts().map((product) => ({
      locale,
      productId: product.id,
    }))
  )
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: rawLocale, productId } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale
  const product = getVisibleProduct(productId)

  if (!product) {
    return {}
  }

  const dict = await getDictionary(locale)
  const title =
    locale === 'uk'
      ? `${product.name[locale]} — ціна в Кагарлику | БудМат`
      : `${product.name[locale]} — цена в Кагарлыке | БудМат`
  const summary =
    product.description[locale].match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ??
    product.description[locale]
  const description =
    locale === 'uk'
      ? `${summary} Ціна в Кагарлику: ${formatPrice(product.price)} грн за ${product.unit[locale]}.`
      : `${summary} Цена в Кагарлыке: ${formatPrice(product.price)} грн за ${product.unit[locale]}.`
  const productPath = `/${locale}/products/${product.id}`
  const locationKeywords =
    locale === 'uk'
      ? [`${product.name[locale]} Кагарлик`, `${product.name[locale]} Київська область`]
      : [`${product.name[locale]} Кагарлык`, `${product.name[locale]} Киевская область`]

  return {
    title,
    description,
    keywords: [
      product.name[locale],
      ...locationKeywords,
      dict.products.categories[product.category],
      ...product.features[locale],
      ...product.applications[locale],
    ],
    openGraph: {
      title,
      description,
      url: absoluteUrl(productPath),
      siteName: dict.meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      alternateLocale: locale === 'uk' ? 'ru_UA' : 'uk_UA',
      type: 'website',
      images: [
        {
          url: absoluteUrl(product.image),
          alt: product.name[locale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(product.image)],
    },
    alternates: {
      canonical: absoluteUrl(productPath),
      languages: getLanguageAlternates(`/products/${product.id}`),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: rawLocale, productId } = await params

  if (!isValidLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const product = getVisibleProduct(productId)

  if (!product) {
    notFound()
  }

  const dict = await getDictionary(locale)
  const t = dict.products
  const text = pageText[locale]
  const allProducts = getAllProducts()
  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)
  const categoryLabel = t.categories[product.category] ?? product.category
  const categoryPath = `/${locale}/categories/${product.category}`
  const productUrl = absoluteUrl(`/${locale}/products/${product.id}`)
  const productJsonLd = buildProductJsonLd(
    product,
    locale,
    categoryLabel,
    productUrl,
    dict.meta.siteName
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productJsonLd),
        }}
      />

      <Header locale={locale} dict={dict} />

      <main id="main-content" className="pt-24">
        <section className="py-8 md:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 text-sm" aria-label={text.breadcrumbs}>
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="font-semibold text-brand-content hover:text-ink"
                  >
                    {text.homeBreadcrumb}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-ink-faint">
                  /
                </li>
                <li>
                  <Link
                    href={categoryPath}
                    className="font-semibold text-brand-content hover:text-ink"
                  >
                    {categoryLabel}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-ink-faint">
                  /
                </li>
                <li aria-current="page" className="text-ink-muted">
                  {product.name[locale]}
                </li>
              </ol>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-surface-border bg-surface-muted">
                <Image
                  src={product.image}
                  alt={product.name[locale]}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>

              <div className="lg:pt-2">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="brand">{categoryLabel}</Badge>
                  <Badge variant={product.status === 'available' ? 'success' : 'muted'}>
                    {product.status === 'available' ? text.inStock : text.byOrder}
                  </Badge>
                </div>

                <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                  {product.name[locale]} {text.location}
                </h1>

                <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                  {product.description[locale]}
                </p>

                <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
                    <dt className="text-sm font-semibold text-ink-muted">{text.price}</dt>
                    <dd className="mt-1">
                      <span className="font-display text-3xl font-bold text-brand-content">
                        {formatPrice(product.price)} ₴
                      </span>
                      <span className="ml-2 text-sm text-ink-muted">
                        {t.perUnit} {product.unit[locale]}
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-surface-border bg-surface-card p-4">
                    <dt className="text-sm font-semibold text-ink-muted">{text.category}</dt>
                    <dd className="mt-2 text-lg font-semibold text-ink">
                      <Link
                        href={categoryPath}
                        className="underline decoration-brand-400/40 underline-offset-4 hover:text-brand-content"
                      >
                        {categoryLabel}
                      </Link>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <PhoneButton label={t.modalCall} dict={dict} size="lg" fullWidth />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-surface-card py-10 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">{t.modalApplications}</h2>
              <ul className="mt-4 space-y-3">
                {product.applications[locale].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
                  >
                    <span className="mt-0.5 shrink-0 text-brand-content" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">{t.modalFeatures}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.features[locale].map((feature) => (
                  <Badge key={feature} variant="muted">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-ink">{text.deliveryTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{text.deliveryText}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {contacts.address[locale]}
              </p>
              <h3 className="mt-6 font-semibold text-ink">{text.orderDetailsTitle}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                <li>{text.orderProduct}</li>
                <li>{text.orderAddress}</li>
                <li>{text.orderAccess}</li>
              </ul>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-ink">{text.relatedTitle}</h2>
                <p className="mt-2 text-sm text-ink-muted">{text.relatedSubtitle}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/products/${item.id}`}
                    className="group overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                      <Image
                        src={item.image}
                        alt={item.name[locale]}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-content">
                        {item.name[locale]}
                      </h3>
                      <p className="mt-3 font-display text-xl font-bold text-brand-content">
                        {formatPrice(item.price)} ₴
                        <span className="ml-1 font-sans text-sm font-normal text-ink-muted">
                          {t.perUnit} {item.unit[locale]}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={categoryPath}
                className="mt-6 inline-flex font-semibold text-brand-content underline underline-offset-4 hover:text-ink"
              >
                {text.viewCategory}: {categoryLabel}
              </Link>
            </div>
          </section>
        )}

        <ContactsSection locale={locale} dict={dict} />
      </main>

      <Footer locale={locale} dict={dict} />
    </>
  )
}

function getVisibleProduct(productId: string): Product | undefined {
  return getAllProducts().find((product) => product.id === productId)
}

function buildProductJsonLd(
  product: Product,
  locale: Locale,
  categoryLabel: string,
  productUrl: string,
  siteName: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${productUrl}#webpage`,
        url: productUrl,
        name: `${product.name[locale]} ${pageText[locale].location}`,
        inLanguage: locale,
        mainEntity: { '@id': `${productUrl}#product` },
        breadcrumb: { '@id': `${productUrl}#breadcrumbs` },
      },
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        url: productUrl,
        mainEntityOfPage: { '@id': `${productUrl}#webpage` },
        name: product.name[locale],
        description: product.description[locale],
        image: absoluteUrl(product.image),
        sku: product.id,
        category: categoryLabel,
        offers: {
          '@type': 'Offer',
          '@id': `${productUrl}#offer`,
          url: productUrl,
          priceCurrency: 'UAH',
          price: product.price,
          availability: product.status === 'available' ? 'https://schema.org/InStock' : undefined,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: product.price,
            priceCurrency: 'UAH',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
              value: 1,
              unitText: product.unit[locale],
            },
          },
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'LocalBusiness',
            '@id': BUSINESS_ID,
            name: siteName,
            telephone: contacts.phones.map((phone) => phone.number),
            address: {
              '@type': 'PostalAddress',
              streetAddress: locale === 'uk' ? 'провулок Серпневий' : 'переулок Серпневый',
              addressLocality: locale === 'uk' ? 'Кагарлик' : 'Кагарлык',
              addressRegion: locale === 'uk' ? 'Київська область' : 'Киевская область',
              postalCode: '09200',
              addressCountry: 'UA',
            },
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${productUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: pageText[locale].homeBreadcrumb,
            item: absoluteUrl(`/${locale}`),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryLabel,
            item: absoluteUrl(`/${locale}/categories/${product.category}`),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name[locale],
            item: productUrl,
          },
        ],
      },
    ],
  }
}
