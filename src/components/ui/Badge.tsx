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
        'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full',
        {
          'bg-brand-500/10 text-brand-400 border border-brand-500/20': variant === 'brand',
          'bg-surface-muted text-ink-muted border border-surface-border': variant === 'muted',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': variant === 'success',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
