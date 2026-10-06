import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { Button, PageState } from '../../components/common'
import { useProducts } from './hooks'
import {
  parseCatalogQuery,
  serializeCatalogQuery,
  SORT_OPTIONS,
  updateCatalogQuery,
  type CatalogQuery,
} from './catalog'
import { ProductSearch } from './ProductSearch'
import { ProductFilters } from './ProductFilters'
import { ProductGrid } from './ProductGrid'
import { Pagination } from './Pagination'

export function ProductListPage() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const query = parseCatalogQuery(params)
  const { state, retry, selection, categories } = useProducts(query)
  const page = selection?.page ?? query.page
  const normalized = serializeCatalogQuery(
    { ...query, page },
    params,
  ).toString()
  useEffect(() => {
    if (params.toString() !== normalized)
      setParams(normalized, { replace: true })
  }, [normalized, params, setParams])

  function apply(patch: Partial<Omit<CatalogQuery, 'page'>>) {
    const next = updateCatalogQuery(params, patch)
    if (next.toString() !== params.toString()) setParams(next)
  }
  const resetFilters = { category: '', minPrice: null, maxPrice: null }
  const pageUrls = selection
    ? Array.from({ length: selection.pageCount }, (_, index) => {
        const search = serializeCatalogQuery(
          { ...query, page: index + 1 },
          params,
        ).toString()
        return search ? `/products?${search}` : '/products'
      })
    : []

  return (
    <>
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-800">
        The collection
      </p>
      <h1 className="mb-3 text-4xl font-semibold tracking-tight">
        Everyday essentials
      </h1>
      <p className="mb-10 text-lg text-stone-600">
        Simple things for a considered home and workspace.
      </p>
      <div className="grid grid-cols-[240px_1fr] items-start gap-8">
        {/* A navigation remount discards unsubmitted drafts, including on Back/Forward. */}
        <ProductFilters
          key={location.key}
          value={query}
          categories={categories}
          onApply={apply}
          onReset={() => apply(resetFilters)}
        />
        <section aria-label="Catalog results" className="min-w-0">
          <ProductSearch
            key={location.key}
            value={query.q}
            onSubmit={(q) => apply({ q })}
            onClear={() => apply({ q: '' })}
          />
          <div className="my-6 flex items-center justify-between gap-4">
            <p role="status" className="text-stone-600">
              {selection
                ? `${selection.count} products · Page ${page} of ${selection.pageCount}`
                : state.status === 'loading'
                  ? 'Loading product count…'
                  : 'Product count unavailable'}
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="font-medium">
                Sort by
              </label>
              <select
                id="sort"
                value={query.sort}
                onChange={(event) => {
                  const sort = SORT_OPTIONS.find(
                    (option) => option.value === event.target.value,
                  )
                  if (sort) apply({ sort: sort.value })
                }}
                className="rounded-lg border border-stone-300 bg-white px-3 py-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {state.status === 'loading' && (
            <PageState title="Loading products">
              Finding your everyday essentials…
            </PageState>
          )}
          {state.status === 'error' && (
            <PageState
              title="Products couldn't be loaded"
              error
              onRetry={retry}
            >
              Please try again.
            </PageState>
          )}
          {state.status === 'success' &&
            selection &&
            (state.data.length === 0 ? (
              <PageState title="No products yet">
                Check back soon for new additions.
              </PageState>
            ) : selection.count === 0 ? (
              <PageState title="No matching products">
                <p>Try another search or adjust your filters.</p>
                <div className="mt-5">
                  <Button onClick={() => apply({ q: '', ...resetFilters })}>
                    Clear search and filters
                  </Button>
                </div>
              </PageState>
            ) : (
              <ProductGrid products={selection.items} />
            ))}
          <Pagination status={state.status} page={page} pageUrls={pageUrls} />
        </section>
      </div>
    </>
  )
}
