'use client'

import { useEffect, useId, useRef, useState } from 'react'
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    const trigger = document.activeElement

    // The native modal keeps focus inside, makes the page inert, and restores
    // focus to the trigger when closed, including when dialogs are nested.
    dialog.showModal()
    closeButtonRef.current?.focus({ preventScroll: true })
    document.body.classList.add('modal-open')

    return () => {
      dialog.close()
      if (!document.querySelector('dialog[open]')) {
        document.body.classList.remove('modal-open')
      }
      // React may remove the dialog before this cleanup runs, so also restore
      // the trigger explicitly instead of relying on the native close alone.
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true })
      }
    }
  }, [isOpen, portalRoot])

  if (!isOpen || !portalRoot) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className="site-dialog fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 text-ink"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        event.stopPropagation()
        const dialog = event.currentTarget
        const controls = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0)
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (
          event.shiftKey &&
          (document.activeElement === first || !dialog.contains(document.activeElement))
        ) {
          event.preventDefault()
          last?.focus()
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || !dialog.contains(document.activeElement))
        ) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
    >
      <div
        className="flex min-h-full items-end justify-center sm:items-center sm:p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
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
            <h2 id={titleId} className="pr-4 font-display text-xl font-bold text-ink">
              {title}
            </h2>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted transition-colors hover:bg-surface-border hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              aria-label={closeLabel}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </dialog>,
    portalRoot
  )
}
