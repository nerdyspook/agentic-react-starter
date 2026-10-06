import { isNonEmpty } from '../../lib/isNonEmpty'
import { DEMO_CURRENCY } from '../../lib/money'

export interface CartProduct {
  id: string
  slug: string
  name: string
  image: string
  priceMinor: number
  currency: string
}

export interface CartLine {
  productId: string
  slug: string
  name: string
  image: string
  unitPriceMinor: number
  currency: string
  quantity: number
}

export interface CartState {
  lines: readonly CartLine[]
  error: string | null
  checkout: { totalMinor: number; currency: string } | null
}

export type CartAction =
  | { type: 'add'; product: CartProduct }
  | { type: 'increase' | 'decrease' | 'remove'; productId: string }
  | { type: 'clear' | 'checkout' | 'dismiss-checkout' }

function safeNumber(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(
      'This quantity or total is too large. Please use a smaller quantity.',
    )
  }
  return Number(value)
}

export function cartLineTotal(line: CartLine): number {
  if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) {
    throw new Error('Quantity must be a positive whole number.')
  }
  if (
    !Number.isSafeInteger(line.unitPriceMinor) ||
    line.unitPriceMinor < 0 ||
    line.currency !== DEMO_CURRENCY
  ) {
    throw new Error('This product has an unsupported price or currency.')
  }
  return safeNumber(BigInt(line.unitPriceMinor) * BigInt(line.quantity))
}

export function summarizeCart(lines: readonly CartLine[]) {
  let count = 0n
  let totalMinor = 0n
  for (const line of lines) {
    count += BigInt(line.quantity)
    totalMinor += BigInt(cartLineTotal(line))
  }
  return { count: safeNumber(count), totalMinor: safeNumber(totalMinor) }
}

export function addCartProduct(
  lines: readonly CartLine[],
  product: CartProduct,
): readonly CartLine[] {
  if (
    !isNonEmpty(product.id) ||
    !isNonEmpty(product.name) ||
    !isNonEmpty(product.slug)
  ) {
    throw new Error('This product is missing its identity or name.')
  }
  const incoming: CartLine = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    unitPriceMinor: product.priceMinor,
    currency: product.currency,
    quantity: 1,
  }
  cartLineTotal(incoming)
  const existing = lines.find((line) => line.productId === product.id)
  if (
    existing &&
    (existing.unitPriceMinor !== product.priceMinor ||
      existing.currency !== product.currency)
  ) {
    throw new Error(
      'This product price has changed. Remove it from the cart before adding it again.',
    )
  }
  const next = existing
    ? lines.map((line) =>
        line.productId === product.id
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      )
    : [...lines, incoming]
  summarizeCart(next)
  return next
}

export function changeCartQuantity(
  lines: readonly CartLine[],
  productId: string,
  change: 1 | -1,
): readonly CartLine[] {
  const existing = lines.find((line) => line.productId === productId)
  if (!existing || (change === -1 && existing.quantity === 1)) return lines
  const next = lines.map((line) =>
    line.productId === productId
      ? { ...line, quantity: line.quantity + change }
      : line,
  )
  summarizeCart(next)
  return next
}

// The provider uses this pure reducer so rapid actions always see the latest state.
export function cartReducer(state: CartState, action: CartAction): CartState {
  try {
    if (action.type === 'dismiss-checkout') return { ...state, checkout: null }
    if (action.type === 'checkout') {
      if (state.lines.length === 0) return state
      const { totalMinor } = summarizeCart(state.lines)
      return {
        lines: [],
        error: null,
        checkout: { totalMinor, currency: DEMO_CURRENCY },
      }
    }
    let lines: readonly CartLine[]
    switch (action.type) {
      case 'add':
        lines = addCartProduct(state.lines, action.product)
        break
      case 'increase':
        lines = changeCartQuantity(state.lines, action.productId, 1)
        break
      case 'decrease':
        lines = changeCartQuantity(state.lines, action.productId, -1)
        break
      case 'remove':
        lines = state.lines.filter(
          (line) => line.productId !== action.productId,
        )
        break
      case 'clear':
        lines = []
        break
    }
    return { lines, error: null, checkout: null }
  } catch (error) {
    return {
      ...state,
      lines: state.lines,
      error:
        error instanceof Error
          ? error.message
          : 'The cart could not be updated.',
    }
  }
}
