export const DEMO_CURRENCY = 'USD'

export function parsePrice(amount: unknown): number {
  if (typeof amount !== 'string' || !/^\d+(\.\d{1,2})?$/.test(amount)) {
    throw new Error(
      'Price must be a nonnegative decimal with up to two places.',
    )
  }

  const [whole, fraction = ''] = amount.split('.')
  const minor = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  if (minor > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Price is outside the supported range.')
  }
  return Number(minor)
}

export function formatPrice(minor: number): string {
  if (!Number.isSafeInteger(minor) || minor < 0) {
    throw new Error('Price must be a safe, nonnegative integer.')
  }
  // Format the whole amount separately so even the largest valid price keeps its cents.
  const cents = BigInt(minor)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: DEMO_CURRENCY,
  })
    .formatToParts(cents / 100n)
    .map((part) =>
      part.type === 'fraction'
        ? String(cents % 100n).padStart(2, '0')
        : part.value,
    )
    .join('')
}
