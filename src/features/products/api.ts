import { decodeProduct, decodeProducts, isProductSlug } from './products'

export async function fetchProducts(signal: AbortSignal) {
  const response = await fetch('/data/products.json', {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Unable to load products.')
  const data: unknown = await response.json()
  return decodeProducts(data)
}

export async function fetchProduct(slug: string, signal: AbortSignal) {
  if (!isProductSlug(slug)) return null
  const response = await fetch(`/data/products/${slug}.json`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error('Unable to load product.')
  const data: unknown = await response.json()
  if (data === null) return null
  const product = decodeProduct(data)
  if (product.slug !== slug) throw new Error('Product does not match this URL.')
  return product
}
