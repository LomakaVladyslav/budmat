import { cn } from '@/utils/cn'

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionTitle({ title, subtitle, centered = false, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-10 md:mb-14', { 'text-center': centered }, className)}>
      <h2 className="mb-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">{subtitle}</p>
      )}
    </div>
  )
}
