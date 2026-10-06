import { isNonEmpty } from '../../lib/isNonEmpty'
import { DEMO_CURRENCY, parsePrice } from '../../lib/money'

export interface ProductSummary {
  id: string
  slug: string
  name: string
  category: string
  image: string
  priceMinor: number
  currency: typeof DEMO_CURRENCY
}

export interface ProductDetail extends Omit<ProductSummary, 'image'> {
  images: string[]
  description: string
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Expected a product object.')
  }
  return value as Record<string, unknown>
}

function string(value: unknown, field: string, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && !isNonEmpty(value))) {
    throw new Error(`Invalid product ${field}.`)
  }
  return value.trim()
}

export function isProductSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function identity(value: Record<string, unknown>) {
  const slug = string(value.slug, 'slug')
  if (!isProductSlug(slug)) throw new Error('Invalid product slug.')
  return {
    id: string(value.id, 'id'),
    slug,
    name: string(value.name, 'name'),
    category: string(value.category, 'category'),
  }
}

function currency(value: unknown): typeof DEMO_CURRENCY {
  if (value !== DEMO_CURRENCY) throw new Error('Unsupported product currency.')
  return DEMO_CURRENCY
}

export function decodeProducts(value: unknown): ProductSummary[] {
  if (!Array.isArray(value)) throw new Error('Expected a product list.')
  const ids = new Set<string>()
  const slugs = new Set<string>()
  return value.map((item) => {
    const raw = record(item)
    const product: ProductSummary = {
      ...identity(raw),
      image: string(raw.image, 'image', true),
      priceMinor: parsePrice(raw.price),
      currency: currency(raw.currency),
    }
    if (ids.has(product.id) || slugs.has(product.slug)) {
      throw new Error('Product IDs and slugs must be unique.')
    }
    ids.add(product.id)
    slugs.add(product.slug)
    return product
  })
}

export function decodeProduct(value: unknown): ProductDetail {
  const raw = record(value)
  const pricing = record(raw.pricing)
  if (!Array.isArray(raw.images)) throw new Error('Expected product images.')
  return {
    ...identity(raw),
    images: raw.images.map((image) => string(image, 'image', true)),
    description: string(raw.description, 'description', true),
    priceMinor: parsePrice(pricing.amount),
    currency: currency(pricing.currency),
  }
}
