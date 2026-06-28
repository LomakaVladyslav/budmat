'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Locale } from '@/types/common.types'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import type { Equipment } from '@/types/equipment.types'
import { Modal } from '@/components/ui/Modal'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { Badge } from '@/components/ui/Badge'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatPrice } from '@/utils/formatPrice'

interface EquipmentSectionProps {
  locale: Locale
  dict: Dictionary
  equipment: Equipment[]
  searchQuery: string
}

export function EquipmentSection({ locale, dict, equipment, searchQuery }: EquipmentSectionProps) {
  const [selected, setSelected] = useState<Equipment | null>(null)
  const t = dict.equipment

  const filtered = equipment.filter((e) => {
    const q = searchQuery.toLowerCase().trim()
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

  return (
    <section id="equipment" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title={t.sectionTitle} subtitle={t.sectionSubtitle} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {filtered.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                locale={locale}
                dict={dict}
                onDetails={() => setSelected(item)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-ink-muted">
            <span className="mb-4 block text-4xl" aria-hidden="true">
              🔍
            </span>
            <p className="text-lg">{dict.products.noResults}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name[locale] ?? ''}
      >
        {selected && <EquipmentModalContent item={selected} locale={locale} dict={dict} />}
      </Modal>
    </section>
  )
}

// ─── Equipment Card ───────────────────────────────────────────────────────────

interface EquipmentCardProps {
  item: Equipment
  locale: Locale
  dict: Dictionary
  onDetails: () => void
}

function EquipmentCard({ item, locale, dict, onDetails }: EquipmentCardProps) {
  const t = dict.equipment

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-card transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-surface-muted">
        <Image
          src={item.image}
          alt={item.name[locale]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* //  <div className="absolute inset-0 bg-gradient-to-t from-surface-card/60 to-transparent" /> */}
        {item.minimumHours && (
          <Badge variant="muted" className="absolute bottom-3 left-3">
            {t.minRental} {item.minimumHours} {t.modalHours}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-display text-lg font-bold leading-snug text-ink">
          {item.name[locale]}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {item.description[locale]}
        </p>

        {/* Price */}
        <div className="mb-4 mt-auto">
          <span className="font-display text-2xl font-bold text-brand-400">
            {item.price === null ? item.priceLabel?.[locale] : `${formatPrice(item.price)} ₴`}
          </span>
          {item.price !== null && item.priceNote && (
            <span className="ml-1.5 text-sm text-ink-muted">/ {item.priceNote[locale]}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <PhoneButton label={t.callButton} dict={dict} size="sm" fullWidth />
          <button
            onClick={onDetails}
            className="shrink-0 rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:border-surface-muted hover:text-ink"
            aria-label={`${t.detailsButton}: ${item.name[locale]}`}
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

// ─── Equipment Modal Content ──────────────────────────────────────────────────

function EquipmentModalContent({
  item,
  locale,
  dict,
}: {
  item: Equipment
  locale: Locale
  dict: Dictionary
}) {
  const t = dict.equipment

  return (
    <div className="space-y-6">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-muted">
        <Image
          src={item.image}
          alt={item.name[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>

      {/* Price & min hours */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display text-3xl font-bold text-brand-400">
            {item.price === null ? item.priceLabel?.[locale] : `${formatPrice(item.price)} ₴`}
          </span>
          {item.price !== null && item.priceNote && (
            <span className="ml-1.5 text-sm text-ink-muted">/ {item.priceNote[locale]}</span>
          )}
        </div>
        {item.minimumHours && (
          <Badge variant="brand">
            {t.modalMinHours}: {item.minimumHours} {t.modalHours}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="leading-relaxed text-ink-muted">{item.description[locale]}</p>

      {/* Specifications */}
      {item.specifications.length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">
            {t.modalSpecs}
          </h4>
          <div className="overflow-hidden rounded-xl border border-surface-border">
            {item.specifications.map((spec, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i % 2 === 0 ? 'bg-surface-muted' : 'bg-surface-card'
                }`}
              >
                <span className="text-ink-muted">{spec.label[locale]}</span>
                <span className="font-semibold text-ink">{spec.value[locale]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications */}
      {item.applications[locale].length > 0 && (
        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ink">
            {t.modalApplications}
          </h4>
          <ul className="space-y-2">
            {item.applications[locale].map((app, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-muted">
                <span className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                  ✓
                </span>
                {app}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <PhoneButton label={t.modalCall} dict={dict} size="lg" fullWidth />
    </div>
  )
}
