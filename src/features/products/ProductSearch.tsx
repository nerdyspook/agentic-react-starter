import { useState } from 'react'
import { Button } from '../../components/common'

export function ProductSearch({
  value,
  onSubmit,
  onClear,
}: {
  value: string
  onSubmit: (value: string) => void
  onClear: () => void
}) {
  const [draft, setDraft] = useState(value)
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        setDraft(draft.trim())
        onSubmit(draft)
      }}
    >
      <label htmlFor="product-search" className="mb-2 block font-medium">
        Search products
      </label>
      <div className="flex gap-3">
        <input
          id="product-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by product name"
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3"
        />
        <Button type="submit">Search</Button>
        <Button
          onClick={() => {
            setDraft('')
            onClear()
          }}
        >
          Clear search
        </Button>
      </div>
    </form>
  )
}
