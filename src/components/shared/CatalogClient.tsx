'use client'

import { useState, useMemo } from 'react'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import type { Product } from '@/types/product.types'
import type { Equipment } from '@/types/equipment.types'
import { SearchBar } from '@/components/shared/SearchBar'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { EquipmentSection } from '@/components/sections/EquipmentSection'

interface CatalogClientProps {
  locale: Locale
  dict: Dictionary
  products: Product[]
  equipment: Equipment[]
}

type TabFilter = 'all' | 'materials' | 'equipment'

export function CatalogClient({
  locale,
  dict,
  products,
  equipment,
}: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tabFilter, setTabFilter] = useState<TabFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const t = dict.products

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

  // Visible products: apply tab + category + search
  const visibleProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return products.filter((p) => {
      const catMatch =
        categoryFilter === 'all' ||
        categoryFilter === 'all-products' ||
        categoryFilter === 'materials' ||
        p.category === categoryFilter
      if (!catMatch) return false
      if (!q) return true
      return (
        p.name[locale].toLowerCase().includes(q) ||
        p.description[locale].toLowerCase().includes(q) ||
        p.applications[locale].some((a) => a.toLowerCase().includes(q)) ||
        p.features[locale].some((feature) => feature.toLowerCase().includes(q))
      )
    })
  }, [products, searchQuery, categoryFilter, locale])

  // Visible equipment: apply tab + search only
  const visibleEquipment = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return equipment.filter((e) => {
      if (!q) return true
      return (
        e.name[locale].toLowerCase().includes(q) ||
        e.description[locale].toLowerCase().includes(q) ||
        e.applications[locale].some((a) => a.toLowerCase().includes(q)) ||
        e.specifications.some(
          (spec) =>
            spec.label[locale].toLowerCase().includes(q) ||
            spec.value[locale].toLowerCase().includes(q)
        )
      )
    })
  }, [equipment, searchQuery, locale])

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'all', label: t.filterAll },
    { id: 'materials', label: t.filterMaterials },
    { id: 'equipment', label: t.filterEquipment },
  ]

  return (
    <>
      {/* ── Sticky Search + Tab bar ── */}
      <div className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.searchPlaceholder}
            />
          </div>

          {/* Tab filter */}
          <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-xl p-1 self-start sm:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  tabFilter === tab.id
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      {showProducts && (
        <ProductsSection
          locale={locale}
          dict={dict}
          products={visibleProducts}
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
          equipment={visibleEquipment}
          searchQuery={searchQuery}
        />
      )}
    </>
  )
}
