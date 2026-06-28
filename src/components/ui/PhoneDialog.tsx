'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { contacts } from '@/data/contacts'
import { Modal } from '@/components/ui/Modal'

interface PhoneDialogProps {
  isOpen: boolean
  onClose: () => void
  dict: Dictionary
}

export function PhoneDialog({ isOpen, onClose, dict }: PhoneDialogProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)
  const resetTimer = useRef<number | null>(null)
  const t = dict.phoneDialog

  useEffect(() => {
    if (!isOpen) {
      setCopiedPhone(null)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current)
      }
    }
  }, [])

  const copyPhone = async (phoneNumber: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(phoneNumber)
      } else {
        copyWithFallback(phoneNumber)
      }

      setCopiedPhone(phoneNumber)

      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current)
      }

      resetTimer.current = window.setTimeout(() => {
        setCopiedPhone(null)
      }, 1800)
    } catch {
      copyWithFallback(phoneNumber)
      setCopiedPhone(phoneNumber)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title} size="md" closeLabel={t.close}>
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-ink-muted">{t.subtitle}</p>

        <div className="space-y-3">
          {contacts.phones.map((phone) => {
            const isCopied = copiedPhone === phone.number

            return (
              <div
                key={phone.number}
                className="rounded-xl border border-surface-border bg-surface-muted p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-400">
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <span className="font-display text-xl font-bold tracking-wide text-ink">
                    {phone.display}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href={`tel:${phone.number}`}
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:bg-brand-600"
                    aria-label={`${t.call}: ${phone.display}`}
                  >
                    <PhoneIcon className="h-4 w-4" />
                    {t.call}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyPhone(phone.number)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:border-surface-muted hover:bg-surface-card hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                    aria-label={`${t.copy}: ${phone.display}`}
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4 text-brand-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                    {isCopied ? t.copied : t.copy}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

function copyWithFallback(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
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

function CopyIcon({ className }: { className?: string }) {
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
        d="M8 7.5A2.5 2.5 0 0110.5 5H18a2 2 0 012 2v9.5A2.5 2.5 0 0117.5 19M6 9h7.5A2.5 2.5 0 0116 11.5V19a2 2 0 01-2 2H6.5A2.5 2.5 0 014 18.5v-7A2.5 2.5 0 016.5 9z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
