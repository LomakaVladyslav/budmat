'use client'

import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { cn } from '@/utils/cn'
import { PhoneDialog } from '@/components/ui/PhoneDialog'

interface PhoneButtonProps {
  label: string
  dict: Dictionary
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function PhoneButton({
  label,
  dict,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: PhoneButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
          {
            'bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 active:bg-brand-600':
              variant === 'primary',
            'border border-surface-border bg-surface-card text-ink hover:border-surface-muted hover:bg-surface-muted':
              variant === 'secondary',
            'border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white':
              variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2.5 text-sm': size === 'md',
            'px-6 py-3.5 text-base': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        aria-haspopup="dialog"
      >
        <PhoneIcon className="h-4 w-4 shrink-0" />
        {label}
      </button>
      <PhoneDialog isOpen={isOpen} onClose={() => setIsOpen(false)} dict={dict} />
    </>
  )
}

interface PhoneNumberButtonProps {
  phone: {
    number: string
    display: string
  }
  dict: Dictionary
  variant: 'contactCard' | 'footerLink'
}

export function PhoneNumberButton({ phone, dict, variant }: PhoneNumberButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'footerLink') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
          aria-haspopup="dialog"
        >
          <PhoneIcon className="h-4 w-4 shrink-0" />
          {phone.display}
        </button>
        <PhoneDialog isOpen={isOpen} onClose={() => setIsOpen(false)} dict={dict} />
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-3 rounded-xl border border-surface-border bg-surface-card p-3.5 text-left transition-all duration-200 hover:border-brand-500/30"
        aria-haspopup="dialog"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 transition-colors group-hover:border-brand-500 group-hover:bg-brand-500">
          <PhoneIcon className="h-4 w-4 text-brand-400 transition-colors group-hover:text-white" />
        </div>
        <span className="text-lg font-semibold tracking-wide text-ink">{phone.display}</span>
      </button>
      <PhoneDialog isOpen={isOpen} onClose={() => setIsOpen(false)} dict={dict} />
    </>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  )
}
