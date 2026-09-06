'use client'

import { useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  clearLabel?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  clearLabel = 'Очистити пошук',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg
          className="h-4 w-4 text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="search"
        name="catalog-search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-11 pr-12 text-sm text-ink transition-colors placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 [&::-webkit-search-cancel-button]:appearance-none"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute inset-y-0 right-1 flex w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          aria-label={clearLabel}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
