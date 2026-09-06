import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries/uk'
import { PhoneButton } from '@/components/ui/PhoneButton'
import { Badge } from '@/components/ui/Badge'

interface HeroSectionProps {
  locale?: string
  dict: Dictionary
}

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
          sizes="100vw"
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/75 to-surface/95" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,125,15,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 animate-fade-up">
            <Badge variant="brand">{dict.hero.badge}</Badge>
          </div>

          <h1
            id="hero-title"
            className="mb-6 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {dict.hero.headline.split(' ').map((word, i) =>
              i === 0 ? (
                <span key={i} className="text-gradient">
                  {word}{' '}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
            {dict.hero.subheadline}
          </p>

          <div
            className="flex animate-fade-up flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '300ms' }}
          >
            <PhoneButton label={dict.hero.ctaCall} dict={dict} size="lg" />
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-card/50 px-6 py-3.5 text-base font-semibold text-ink-muted backdrop-blur-sm transition-all duration-200 hover:border-surface-muted hover:text-ink"
            >
              {dict.hero.ctaCatalog}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-ink-faint sm:bottom-6"
        aria-hidden="true"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Гортати</span>
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  )
}
