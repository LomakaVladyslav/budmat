'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import type { Product } from '@/types/product.types'
import { Modal } from '@/components/ui/Modal'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { Badge } from '@/components/ui/Badge'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatPrice } from '@/utils/formatPrice'
import { PRODUCT_CATEGORIES } from '@/constants/categories'

interface ProductsSectionProps {
  locale: Locale
  dict: Dictionary
  products: Product[]
  searchQuery: string
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function ProductsSection({
  locale,
  dict,
  products,
  searchQuery,
  activeFilter,
  onFilterChange,
}: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const t = dict.products

  const filters = useMemo(() => {
    const used = new Set(products.map((p) => p.category))
    return PRODUCT_CATEGORIES.filter((c) => used.has(c))
  }, [products])

  const productFilters = [
    { id: 'all-products', label: t.filterAll },
    ...filters.map((c) => ({
      id: c,
      label: t.categories[c] ?? c,
    })),
  ]

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return products.filter((p) => {
      // Category filter (only when in products tab)
      const filterMatch =
        activeFilter === 'all' ||
        activeFilter === 'all-products' ||
        activeFilter === 'materials' ||
        p.category === activeFilter

      if (!filterMatch) return false
      if (!q) return true

      return (
        p.name[locale].toLowerCase().includes(q) ||
        p.description[locale].toLowerCase().includes(q) ||
        p.applications[locale].some((a) => a.toLowerCase().includes(q)) ||
        p.features[locale].some((feature) => feature.toLowerCase().includes(q))
      )
    })
  }, [products, searchQuery, activeFilter, locale])

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t.sectionTitle} subtitle={t.sectionSubtitle} />

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {productFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeFilter === f.id || (f.id === 'all-products' && activeFilter === 'all')
                  ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                  : 'border-surface-border bg-surface-card text-ink-muted hover:border-surface-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                dict={dict}
                onDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-ink-muted">
            <span className="mb-4 block text-4xl" aria-hidden="true">
              🔍
            </span>
            <p className="text-lg">{t.noResults}</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name[locale] ?? ''}
      >
        {selectedProduct && (
          <ProductModalContent product={selectedProduct} locale={locale} dict={dict} />
        )}
      </Modal>
    </section>
  )
}

// ─── Product Card ────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product
  locale: Locale
  dict: Dictionary
  onDetails: () => void
}

function ProductCard({ product, locale, dict, onDetails }: ProductCardProps) {
  const t = dict.products

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.status === 'order' && (
          <div className="absolute right-3 top-3">
            <Badge variant="muted">{t.statusOrder}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="mb-1 line-clamp-2 font-display text-base font-bold leading-snug text-ink">
          {product.name[locale]}
        </h3>
        <p className="mb-4 text-sm text-ink-muted">
          {t.perUnit} {product.unit[locale]}
        </p>

        {/* Price */}
        <div className="mb-4 mt-auto">
          <span className="font-display text-2xl font-bold text-brand-400">
            {formatPrice(product.price)} ₴
          </span>
          {product.priceNote && (
            <span className="ml-1.5 text-xs text-ink-muted">/ {product.priceNote[locale]}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <PhoneButton label={t.callButton} dict={dict} size="sm" fullWidth />
          <button
            onClick={onDetails}
            className="shrink-0 rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:border-surface-muted hover:text-ink"
            aria-label={`${t.detailsButton}: ${product.name[locale]}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Product Modal Content ────────────────────────────────────────────────────

function ProductModalContent({
  product,
  locale,
  dict,
}: {
  product: Product
  locale: Locale
  dict: Dictionary
}) {
  const t = dict.products

  return (
    <div className="space-y-6">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-muted">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-brand-400">
          {formatPrice(product.price)} ₴
        </span>
        <span className="text-sm text-ink-muted">/ {product.unit[locale]}</span>
      </div>

      {/* Description */}
      <p className="leading-relaxed text-ink-muted">{product.description[locale]}</p>

      {/* Applications */}
      {product.applications[locale].length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">
            {t.modalApplications}
          </h4>
          <ul className="space-y-2">
            {product.applications[locale].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-muted">
                <span className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Features */}
      {product.features[locale].length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">
            {t.modalFeatures}
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.features[locale].map((feat, i) => (
              <Badge key={i} variant="muted">
                {feat}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <PhoneButton label={t.modalCall} dict={dict} size="lg" fullWidth />
    </div>
  )
}
