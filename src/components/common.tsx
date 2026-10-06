import { useState, type ReactNode } from 'react'
import { formatPrice } from '../lib/money'

export function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-emerald-900 px-5 py-3 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

export function PageState({
  title,
  children,
  error = false,
  onRetry,
}: {
  title: string
  children: ReactNode
  error?: boolean
  onRetry?: () => void
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-8">
      <div role={error ? 'alert' : 'status'}>
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-3 text-stone-600">{children}</div>
      </div>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry}>Try again</Button>
        </div>
      )}
    </section>
  )
}

export function Price({ minor }: { minor: number }) {
  return <span className="tabular-nums">{formatPrice(minor)}</span>
}

export function ProductImage({
  src,
  name,
  loading,
}: {
  src: string
  name: string
  loading?: 'lazy' | 'eager'
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  if (!src || src === failedSource) {
    return (
      <div
        className="flex aspect-square items-center justify-center rounded-xl bg-stone-100 p-8 text-center text-stone-600"
        role="img"
        aria-label={`${name}: image unavailable`}
      >
        Image unavailable
      </div>
    )
  }
  return (
    <img
      className="aspect-square w-full rounded-xl object-cover"
      src={src}
      loading={loading}
      alt={name}
      width={640}
      height={640}
      onError={() => setFailedSource(src)}
    />
  )
}
