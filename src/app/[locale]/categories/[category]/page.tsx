import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCT_CATEGORIES } from '@/constants/categories'
import { categoryContent, isProductCategory } from '@/data/categories'
import { contacts } from '@/data/contacts'
import { locales, isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getProductsByCategory } from '@/lib/repositories/products.repository'
import { absoluteUrl, getLanguageAlternates, serializeJsonLd } from '@/lib/seo'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ContactsSection } from '@/components/sections/ContactsSection'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { formatPrice } from '@/utils/formatPrice'

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PRODUCT_CATEGORIES.filter((category) => getProductsByCategory(category).length > 0).map(
      (category) => ({ locale, category })
    )
  )
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params
  if (!isValidLocale(locale) || !isProductCategory(category)) notFound()
  const content = categoryContent[category][locale]
  const dict = await getDictionary(locale)
  const path = `/${locale}/categories/${category}`
  const title = `${content.title} — ${locale === 'uk' ? 'ціни' : 'цены'} | БудМат`
  const firstProduct = getProductsByCategory(category)[0]
  if (!firstProduct) notFound()

  return {
    title,
    description: content.description,
    alternates: { canonical: path, languages: getLanguageAlternates(`/categories/${category}`) },
    openGraph: {
      title,
      description: content.description,
      url: path,
      siteName: dict.meta.siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'ru_UA',
      type: 'website',
      images: [{ url: firstProduct.image, alt: content.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: content.description,
      images: [firstProduct.image],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params
  if (!isValidLocale(locale) || !isProductCategory(category)) notFound()
  const products = getProductsByCategory(category)
  if (!products.length) notFound()
  const dict = await getDictionary(locale)
  const content = categoryContent[category][locale]
  const isUk = locale === 'uk'
  const url = absoluteUrl(`/${locale}/categories/${category}`)
  const home = isUk ? 'Головна' : 'Главная'
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: content.title,
        description: content.description,
        inLanguage: locale,
        isPartOf: { '@id': absoluteUrl('/#website') },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: { '@id': `${url}#products` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#products`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name[locale],
          url: absoluteUrl(`/${locale}/products/${product.id}`),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: home, item: absoluteUrl(`/${locale}`) },
          { '@type': 'ListItem', position: 2, name: dict.products.categories[category], item: url },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="pt-24">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav
            aria-label={isUk ? 'Навігаційний ланцюжок' : 'Навигационная цепочка'}
            className="mb-6 flex flex-wrap gap-2 text-sm text-ink-muted"
          >
            <Link href={`/${locale}`} className="font-semibold hover:text-ink">
              {home}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{dict.products.categories[category]}</span>
          </nav>
          <h1 className="max-w-4xl font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-muted">{content.intro}</p>
          <p className="mt-3 text-sm text-ink-muted">
            {isUk
              ? 'Наявність і остаточну вартість замовлення підтверджуємо телефоном.'
              : 'Наличие и окончательную стоимость заказа подтверждаем по телефону.'}
          </p>
          <div className="mt-6">
            <PhoneButton label={dict.products.modalCall} dict={dict} size="lg" />
          </div>
        </section>

        <section
          aria-labelledby="category-products"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <h2 id="category-products" className="mb-6 font-display text-2xl font-bold text-ink">
            {isUk ? 'Товари та ціни' : 'Товары и цены'}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card"
              >
                <Link href={`/${locale}/products/${product.id}`} className="group block">
                  <div className="relative aspect-[4/3] bg-surface-muted">
                    <Image
                      src={product.image}
                      alt={product.name[locale]}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 34px), (max-width: 1279px) 30vw, 288px"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-ink group-hover:underline">
                      {product.name[locale]}
                    </h3>
                    <p className="mt-3 text-2xl font-bold text-ink">
                      {formatPrice(product.price)} ₴{' '}
                      <span className="text-sm font-normal text-ink-muted">
                        {dict.products.perUnit} {product.unit[locale]}
                      </span>
                    </p>
                    {product.status === 'order' && (
                      <p className="mt-2 text-sm text-ink-muted">{dict.products.statusOrder}</p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {product.features[locale].join(' · ')}
                    </p>
                    <span className="mt-4 inline-block text-sm font-semibold text-ink underline underline-offset-4">
                      {dict.products.detailsButton} →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 border-y border-surface-border bg-surface-card py-12">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {isUk ? 'Що уточнити перед замовленням' : 'Что уточнить перед заказом'}
              </h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-ink-muted">
                {content.selection.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {isUk ? 'Самовивіз і доставка' : 'Самовывоз и доставка'}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-muted">
                {isUk
                  ? 'Забрати матеріали можна за адресою:'
                  : 'Забрать материалы можно по адресу:'}{' '}
                {contacts.address[locale]}.{' '}
                {isUk
                  ? 'Доставка оплачується окремо; адресу, транспорт, дату та вартість погоджуємо телефоном до відвантаження.'
                  : 'Доставка оплачивается отдельно; адрес, транспорт, дату и стоимость согласовываем по телефону до отгрузки.'}
              </p>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {isUk
                  ? 'Якщо потрібна техніка для будівельних робіт або розвантаження, перегляньте'
                  : 'Если нужна техника для строительных работ или разгрузки, посмотрите'}{' '}
                <Link
                  href={`/${locale}#equipment`}
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  {dict.equipment.sectionTitle.toLowerCase()}
                </Link>
                .
              </p>
              <Link
                href={`/${locale}/return-policy`}
                className="mt-5 inline-block font-semibold text-ink underline underline-offset-4"
              >
                {dict.footer.returnPolicy}
              </Link>
            </div>
          </div>
        </section>

        <nav
          aria-label={isUk ? 'Інші будівельні матеріали' : 'Другие строительные материалы'}
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
          <h2 className="mb-4 font-display text-xl font-bold text-ink">
            {isUk ? 'Інші будівельні матеріали' : 'Другие строительные материалы'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {PRODUCT_CATEGORIES.filter(
              (item) => item !== category && getProductsByCategory(item).length > 0
            ).map((item) => (
              <Link
                key={item}
                href={`/${locale}/categories/${item}`}
                className="rounded-xl border border-surface-border px-4 py-3 font-semibold text-ink hover:bg-surface-muted"
              >
                {dict.products.categories[item]}
              </Link>
            ))}
          </div>
        </nav>
        <ContactsSection locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
