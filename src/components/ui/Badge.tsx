import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'brand' | 'muted' | 'success'
  className?: string
}

export function Badge({ children, variant = 'brand', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        {
          'border border-brand-500/20 bg-brand-500/10 text-brand-content': variant === 'brand',
          'border border-surface-border bg-surface-muted text-ink-muted': variant === 'muted',
          'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400': variant === 'success',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
