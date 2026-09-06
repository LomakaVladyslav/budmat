'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import type { Product } from '@/types/product.types'
import type { Equipment } from '@/types/equipment.types'
import { SearchBar } from '@/components/shared/SearchBar'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { EquipmentSection } from '@/components/sections/EquipmentSection'
import { PRODUCT_CATEGORIES } from '@/constants/categories'

interface CatalogClientProps {
  locale: Locale
  dict: Dictionary
  products: Product[]
  equipment: Equipment[]
}

type TabFilter = 'all' | 'materials' | 'equipment'

export function CatalogClient({ locale, dict, products, equipment }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tabFilter, setTabFilter] = useState<TabFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const t = dict.products

  useEffect(() => {
    let scrollFrame = 0
    const showSection = (hash: string) => {
      if (hash !== '#products' && hash !== '#equipment') return
      setTabFilter('all')
      setCategoryFilter('all')
      window.cancelAnimationFrame(scrollFrame)
      scrollFrame = window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView()
      })
    }
    const onHashChange = () => showSection(window.location.hash)
    const onAnchorClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return
      const destination = new URL(link.href)
      if (
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname
      ) {
        // Also handle a link to the current hash when its section was filtered out.
        showSection(destination.hash)
      }
    }

    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('click', onAnchorClick)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onAnchorClick)
      window.cancelAnimationFrame(scrollFrame)
    }
  }, [])

  // When tab changes, reset category filter
  const handleTabChange = (tab: TabFilter) => {
    setTabFilter(tab)
    setCategoryFilter('all')
  }

  const handleCategoryFilter = (cat: string) => {
    setCategoryFilter(cat)
  }

  const showProducts = tabFilter === 'all' || tabFilter === 'materials'
  const showEquipment = tabFilter === 'all' || tabFilter === 'equipment'

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'all', label: t.filterAll },
    { id: 'materials', label: t.filterMaterials },
    { id: 'equipment', label: t.filterEquipment },
  ]

  return (
    <>
      {/* ── Sticky Search + Tab bar ── */}
      <div className="sticky top-16 z-30 border-b border-surface-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          {/* Search */}
          <div className="max-w-md flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.searchPlaceholder}
              clearLabel={locale === 'uk' ? 'Очистити пошук' : 'Очистить поиск'}
            />
          </div>

          {/* Tab filter */}
          <div
            role="group"
            aria-label={locale === 'uk' ? 'Тип пропозиції' : 'Тип предложения'}
            className="flex items-center gap-1 self-start rounded-xl border border-surface-border bg-surface-card p-1 sm:self-auto"
          >
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                aria-pressed={tabFilter === tab.id}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  tabFilter === tab.id
                    ? 'bg-brand-500 text-brand-950 shadow-lg shadow-brand-500/20'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav
        aria-label={locale === 'uk' ? 'Категорії матеріалів' : 'Категории материалов'}
        className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCT_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/${locale}/categories/${category}`}
                prefetch={false}
                className="flex h-full min-h-12 items-center justify-between gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-brand-500 hover:text-ink"
              >
                {t.categories[category]}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Products ── */}
      {showProducts && (
        <ProductsSection
          locale={locale}
          dict={dict}
          products={products}
          searchQuery={searchQuery}
          activeFilter={categoryFilter}
          onFilterChange={handleCategoryFilter}
        />
      )}

      {/* ── Equipment ── */}
      {showEquipment && (
        <EquipmentSection
          locale={locale}
          dict={dict}
          equipment={equipment}
          searchQuery={searchQuery}
        />
      )}
    </>
  )
}
