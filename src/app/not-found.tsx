import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="uk" data-theme="light">
      <body className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-display font-bold text-brand-500 mb-4">404</p>
          <h1 className="text-2xl font-display font-bold text-ink mb-3">
            Сторінку не знайдено
          </h1>
          <p className="text-ink-muted mb-8">
            Сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
          <Link
            href="/uk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-400 transition-colors"
          >
            ← На головну
          </Link>
        </div>
      </body>
    </html>
  )
}
