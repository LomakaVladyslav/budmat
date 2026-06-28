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
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-ink-muted text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
