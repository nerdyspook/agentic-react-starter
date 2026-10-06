import { useState } from 'react'
import { Button } from '../../components/common'
import {
  parseFilterInputs,
  priceInput,
  type ProductFilterValues,
} from './catalog'

export function ProductFilters({
  value,
  categories,
  onApply,
  onReset,
}: {
  value: ProductFilterValues
  categories: string[]
  onApply: (value: ProductFilterValues) => void
  onReset: () => void
}) {
  const [category, setCategory] = useState(value.category)
  const [min, setMin] = useState(priceInput(value.minPrice))
  const [max, setMax] = useState(priceInput(value.maxPrice))
  const [error, setError] = useState('')
  const inputClass =
    'mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-3'
  return (
    <form
      className="self-start rounded-xl border border-stone-200 bg-white p-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        try {
          const values = parseFilterInputs(category, min, max)
          setMin(priceInput(values.minPrice))
          setMax(priceInput(values.maxPrice))
          setError('')
          onApply(values)
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : 'Please check the price range.',
          )
        }
      }}
    >
      <h2 className="mb-5 text-xl font-semibold">Filters</h2>
      <label htmlFor="category" className="block font-medium">
        Category
      </label>
      <select
        id="category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className={inputClass}
      >
        <option value="">All categories</option>
        {category && !categories.includes(category) && (
          <option value={category}>{category}</option>
        )}
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <label htmlFor="min-price" className="mt-5 block font-medium">
        Minimum price (USD)
      </label>
      <input
        id="min-price"
        inputMode="decimal"
        value={min}
        onChange={(event) => setMin(event.target.value)}
        className={inputClass}
        aria-describedby={error ? 'filter-error' : undefined}
      />
      <label htmlFor="max-price" className="mt-5 block font-medium">
        Maximum price (USD)
      </label>
      <input
        id="max-price"
        inputMode="decimal"
        value={max}
        onChange={(event) => setMax(event.target.value)}
        className={inputClass}
        aria-describedby={error ? 'filter-error' : undefined}
      />
      {error && (
        <p id="filter-error" role="alert" className="mt-4 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-3">
        <Button type="submit">Apply filters</Button>
        <Button
          onClick={() => {
            setCategory('')
            setMin('')
            setMax('')
            setError('')
            onReset()
          }}
        >
          Reset filters
        </Button>
      </div>
    </form>
  )
}
