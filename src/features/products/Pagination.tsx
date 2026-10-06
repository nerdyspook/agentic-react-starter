import { Link } from 'react-router'

export function Pagination({
  page,
  pageUrls,
  status,
}: {
  page: number
  pageUrls: string[]
  status: 'loading' | 'error' | 'success'
}) {
  const controlClass =
    'rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50'
  return (
    <nav
      aria-label="Product pagination"
      className="mt-8 flex flex-wrap items-center gap-2"
    >
      {status === 'success' && page > 1 ? (
        <Link className={controlClass} to={pageUrls[page - 2]}>
          Previous
        </Link>
      ) : (
        <button className={controlClass} disabled>
          Previous
        </button>
      )}
      {status === 'success' ? (
        pageUrls.map((url, index) => (
          <Link
            key={index + 1}
            to={url}
            aria-label={`Page ${index + 1}`}
            aria-current={page === index + 1 ? 'page' : undefined}
            className={
              page === index + 1
                ? 'rounded-lg border border-emerald-900 bg-emerald-900 px-4 py-2 font-medium text-white'
                : controlClass
            }
          >
            {index + 1}
          </Link>
        ))
      ) : (
        <span className="px-3 text-stone-600">
          Requested page {page} ·{' '}
          {status === 'loading' ? 'Loading pages…' : 'Pages unavailable'}
        </span>
      )}
      {status === 'success' && page < pageUrls.length ? (
        <Link className={controlClass} to={pageUrls[page]}>
          Next
        </Link>
      ) : (
        <button className={controlClass} disabled>
          Next
        </button>
      )}
    </nav>
  )
}
