'use client'

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'md' | 'lg'
  closeLabel?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  closeLabel = 'Закрити',
}: ModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleEscape)
    }
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  if (!isOpen || !portalRoot) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="modal-backdrop absolute inset-0 animate-fade-in backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full animate-fade-up border border-surface-border bg-surface-card shadow-2xl',
          'rounded-t-2xl sm:rounded-2xl',
          'max-h-[calc(100dvh-1rem)] overflow-y-auto sm:max-h-[calc(100dvh-2rem)]',
          {
            'sm:max-w-lg': size === 'md',
            'sm:max-w-2xl': size === 'lg',
          }
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-surface-card px-6 py-4">
          <h3 id="modal-title" className="pr-4 font-display text-xl font-bold text-ink">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted transition-colors hover:bg-surface-border hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
            aria-label={closeLabel}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    portalRoot
  )
}
