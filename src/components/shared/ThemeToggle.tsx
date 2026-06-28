'use client'

import { useEffect, useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'budmat-theme'

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function writeTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The visual theme should still change when storage is unavailable.
  }
}

interface ThemeToggleProps {
  dict: Dictionary
}

export function ThemeToggle({ dict }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const isDark = theme === 'dark'
  const label = isDark ? dict.themeToggle.toLight : dict.themeToggle.toDark

  useEffect(() => {
    setTheme(readTheme())
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark'
    writeTheme(nextTheme)
    setTheme(nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25 9.75 9.75 0 0 0 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  )
}
