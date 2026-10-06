import { useCallback, useEffect, useState } from 'react'
import { fetchProduct, fetchProducts } from './api'
import { selectProducts, type CatalogQuery } from './catalog'

type RequestState<T> =
  { status: 'loading' } | { status: 'error' } | { status: 'success'; data: T }

// Shared only by the two product hooks; no cache or global request state.
function useProductRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    load: typeof load
    attempt: number
    state: RequestState<T>
  } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setResult({ load, attempt, state: { status: 'success', data } })
        }
      },
      () => {
        if (!controller.signal.aborted) {
          setResult({ load, attempt, state: { status: 'error' } })
        }
      },
    )
    return () => controller.abort()
  }, [load, attempt])

  // A new slug or retry must never render the previous request's product.
  const state: RequestState<T> =
    result?.load === load && result.attempt === attempt
      ? result.state
      : { status: 'loading' }

  return { state, retry: () => setAttempt((previous) => previous + 1) }
}

export function useProducts(query: CatalogQuery) {
  const request = useProductRequest(fetchProducts)
  const products =
    request.state.status === 'success' ? request.state.data : null
  return {
    ...request,
    selection: products === null ? null : selectProducts(products, query),
    categories:
      products === null
        ? []
        : [...new Set(products.map((product) => product.category))].sort(),
  }
}

export function useProduct(slug: string) {
  const load = useCallback(
    (signal: AbortSignal) => fetchProduct(slug, signal),
    [slug],
  )
  return useProductRequest(load)
}
