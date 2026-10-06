import { parsePrice } from '../../lib/money'
import type { ProductSummary } from './products'

export const PAGE_SIZE = 12
export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const

type Sort = (typeof SORT_OPTIONS)[number]['value']
export interface CatalogQuery {
  q: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sort: Sort
  page: number
}
export type ProductFilterValues = Pick<
  CatalogQuery,
  'category' | 'minPrice' | 'maxPrice'
>
const queryKeys = [
  'q',
  'category',
  'minPrice',
  'maxPrice',
  'sort',
  'page',
] as const

export function priceInput(minor: number | null): string {
  if (minor === null) return ''
  const cents = BigInt(minor)
  return `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`
}

function optionalPrice(value: string): number | null {
  return value.trim() === '' ? null : parsePrice(value.trim())
}

export function parseFilterInputs(
  category: string,
  min: string,
  max: string,
): ProductFilterValues {
  const minPrice = optionalPrice(min)
  const maxPrice = optionalPrice(max)
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    throw new Error('Minimum price must not exceed maximum price.')
  }
  return { category: category.trim(), minPrice, maxPrice }
}

function urlPrice(value: string | null): number | null {
  try {
    return optionalPrice(value ?? '')
  } catch {
    return null
  }
}

export function parseCatalogQuery(params: URLSearchParams): CatalogQuery {
  const rawPage = params.get('page') ?? '1'
  const page = Number(rawPage)
  const rawSort = params.get('sort')
  const sort =
    SORT_OPTIONS.find((option) => option.value === rawSort)?.value ?? 'name-asc'
  let minPrice = urlPrice(params.get('minPrice'))
  let maxPrice = urlPrice(params.get('maxPrice'))
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    minPrice = null
    maxPrice = null
  }
  return {
    q: (params.get('q') ?? '').trim(),
    category: (params.get('category') ?? '').trim(),
    minPrice,
    maxPrice,
    sort,
    page:
      /^\d+$/.test(rawPage) && Number.isSafeInteger(page) && page > 0
        ? page
        : 1,
  }
}

export function serializeCatalogQuery(
  query: CatalogQuery,
  current = new URLSearchParams(),
): URLSearchParams {
  const params = new URLSearchParams(current)
  for (const key of queryKeys) params.delete(key)
  if (query.q) params.set('q', query.q)
  if (query.category) params.set('category', query.category)
  if (query.minPrice !== null)
    params.set('minPrice', priceInput(query.minPrice))
  if (query.maxPrice !== null)
    params.set('maxPrice', priceInput(query.maxPrice))
  if (query.sort !== 'name-asc') params.set('sort', query.sort)
  if (query.page !== 1) params.set('page', String(query.page))
  return params
}

// Only changed criteria reset the page; submitting an unchanged form is a no-op.
export function updateCatalogQuery(
  params: URLSearchParams,
  patch: Partial<Omit<CatalogQuery, 'page'>>,
): URLSearchParams {
  const previous = parseCatalogQuery(params)
  const next = { ...previous, ...patch, q: (patch.q ?? previous.q).trim() }
  const changed =
    next.q !== previous.q ||
    next.category !== previous.category ||
    next.minPrice !== previous.minPrice ||
    next.maxPrice !== previous.maxPrice ||
    next.sort !== previous.sort
  return serializeCatalogQuery(
    { ...next, page: changed ? 1 : previous.page },
    params,
  )
}

export function selectProducts(
  products: readonly ProductSummary[],
  query: CatalogQuery,
) {
  const search = query.q.trim().toLowerCase()
  const matching = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search) &&
      (!query.category || product.category === query.category) &&
      (query.minPrice === null || product.priceMinor >= query.minPrice) &&
      (query.maxPrice === null || product.priceMinor <= query.maxPrice),
  )
  matching.sort((a, b) => {
    const order =
      query.sort === 'name-asc'
        ? a.name.localeCompare(b.name)
        : query.sort === 'price-asc'
          ? a.priceMinor - b.priceMinor
          : b.priceMinor - a.priceMinor
    return order || a.id.localeCompare(b.id)
  })
  const count = matching.length
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  return {
    items: matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    count,
    pageCount,
    page,
  }
}
