import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50',
        {
          // Variants
          'bg-brand-500 text-brand-950 shadow-lg shadow-brand-500/20 hover:bg-brand-400 active:bg-brand-600':
            variant === 'primary',
          'border border-surface-border bg-surface-card text-ink hover:border-surface-muted hover:bg-surface-muted':
            variant === 'secondary',
          'text-ink-muted hover:bg-surface-card hover:text-ink': variant === 'ghost',
          'border border-brand-500 text-brand-content hover:bg-brand-500 hover:text-brand-950':
            variant === 'outline',
          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-6 py-3.5 text-base': size === 'lg',
          // Width
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
