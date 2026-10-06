import { expect, test } from 'vitest'
import {
  parseCatalogQuery,
  parseFilterInputs,
  priceInput,
  selectProducts,
  serializeCatalogQuery,
  updateCatalogQuery,
} from './catalog'
import type { ProductSummary } from './products'

const query = (text = '') => parseCatalogQuery(new URLSearchParams(text))
const product = (
  id: string,
  name: string,
  priceMinor: number,
  category = 'home',
): ProductSummary => ({
  id,
  name,
  priceMinor,
  category,
  slug: id,
  image: '',
  currency: 'USD',
})
const products = [
  product('d', 'Red Mug', 10000),
  product('b', 'Blue Mug', 900),
  product('a', 'Blue Mug', 900),
  product('c', 'Mug + Lid', 1999),
  product('e', 'Mug Notebook', 1999, 'stationery'),
  product('f', 'Free sample', 0),
]

test('absent or invalid URL values use defaults; unsafe pages and malformed prices cannot leak into selection', () => {
  expect(query()).toEqual({
    q: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    sort: 'name-asc',
    page: 1,
  })
  for (const page of [
    'abc',
    '0',
    '-2',
    '1.5',
    'Infinity',
    '9007199254740992',
    '1e2',
  ]) {
    expect(query(`page=${page}&sort=unknown`).page).toBe(1)
    expect(query(`page=${page}&sort=unknown`).sort).toBe('name-asc')
  }
  for (const price of [
    '-1',
    'abc',
    '1.001',
    'Infinity',
    '900719925474099.99',
  ]) {
    expect(query(`minPrice=${price}&maxPrice=20`).minPrice).toBeNull()
    expect(query(`minPrice=${price}&maxPrice=20`).maxPrice).toBe(2000)
  }
  expect(query('minPrice=20&maxPrice=10')).toMatchObject({
    minPrice: null,
    maxPrice: null,
  })
  expect(query('minPrice=0&maxPrice=0')).toMatchObject({
    minPrice: 0,
    maxPrice: 0,
  })
})

test('normalization uses first repeated value, trims search, removes empty/default keys, and retains unrelated repeated keys', () => {
  const raw = new URLSearchParams(
    'q=++MUG++&q=stool&page=2&page=9&sort=price-asc&sort=price-desc&tag=a&tag=b',
  )
  const normalized = serializeCatalogQuery(parseCatalogQuery(raw), raw)
  expect(normalized.getAll('q')).toEqual(['MUG'])
  expect(normalized.getAll('page')).toEqual(['2'])
  expect(normalized.getAll('sort')).toEqual(['price-asc'])
  expect(normalized.getAll('tag')).toEqual(['a', 'b'])
  expect(
    serializeCatalogQuery(query('q=++&page=1&sort=name-asc')).toString(),
  ).toBe('')
  expect(
    serializeCatalogQuery(query('minPrice=0010&maxPrice=50.0')).toString(),
  ).toBe('minPrice=10.00&maxPrice=50.00')
})

test('literal punctuation round-trips without treating plus as whitespace or a regex', () => {
  const params = updateCatalogQuery(new URLSearchParams(), {
    q: '  Mug + Lid  ',
  })
  expect(params.toString()).toBe('q=Mug+%2B+Lid')
  expect(
    selectProducts(products, parseCatalogQuery(params)).items.map(
      (item) => item.id,
    ),
  ).toEqual(['c'])
  expect(selectProducts(products, query('q=%2E%2A')).count).toBe(0)
})

test('changed criteria reset page and preserve companion fields; unchanged normalized submissions keep page', () => {
  const raw = new URLSearchParams(
    'q=mug&category=home&minPrice=10&maxPrice=50&sort=price-desc&page=2&source=demo',
  )
  const same = updateCatalogQuery(raw, { q: ' mug ' })
  expect(parseCatalogQuery(same).page).toBe(2)
  expect(updateCatalogQuery(same, { q: 'mug' }).toString()).toBe(
    same.toString(),
  )
  const changed = updateCatalogQuery(raw, { q: 'stool' })
  expect(parseCatalogQuery(changed)).toEqual({
    q: 'stool',
    category: 'home',
    minPrice: 1000,
    maxPrice: 5000,
    sort: 'price-desc',
    page: 1,
  })
  expect(changed.get('source')).toBe('demo')
  expect(raw.get('page')).toBe('2')
  for (const patch of [
    { category: 'stationery' },
    { minPrice: 0 },
    { maxPrice: 6000 },
    { sort: 'price-asc' as const },
  ]) {
    expect(parseCatalogQuery(updateCatalogQuery(raw, patch)).page).toBe(1)
  }
})

test('independent and combined resets remove only their owned fields while page links preserve all criteria', () => {
  const raw = new URLSearchParams(
    'q=mug&category=home&minPrice=10&maxPrice=50&sort=price-desc&page=2&source=demo',
  )
  expect(parseCatalogQuery(updateCatalogQuery(raw, { q: '' }))).toEqual({
    q: '',
    category: 'home',
    minPrice: 1000,
    maxPrice: 5000,
    sort: 'price-desc',
    page: 1,
  })
  const reset = { category: '', minPrice: null, maxPrice: null }
  expect(parseCatalogQuery(updateCatalogQuery(raw, reset))).toEqual({
    q: 'mug',
    ...reset,
    sort: 'price-desc',
    page: 1,
  })
  expect(updateCatalogQuery(raw, { q: '', ...reset }).toString()).toBe(
    'source=demo&sort=price-desc',
  )
  const page = serializeCatalogQuery(
    { ...parseCatalogQuery(raw), page: 3 },
    raw,
  )
  expect(parseCatalogQuery(page)).toEqual({
    q: 'mug',
    category: 'home',
    minPrice: 1000,
    maxPrice: 5000,
    sort: 'price-desc',
    page: 3,
  })
  expect(page.get('source')).toBe('demo')
})

test('form prices use exact cents and reject reversed or malformed ranges instead of silently applying them', () => {
  expect(parseFilterInputs('home', ' 19.99 ', '50')).toEqual({
    category: 'home',
    minPrice: 1999,
    maxPrice: 5000,
  })
  expect(parseFilterInputs('', '', '')).toEqual({
    category: '',
    minPrice: null,
    maxPrice: null,
  })
  expect(() => parseFilterInputs('', '20', '10')).toThrow('Minimum')
  expect(() => parseFilterInputs('', '-1', '')).toThrow()
  expect(() => parseFilterInputs('', '1.001', '')).toThrow()
  expect(priceInput(1999)).toBe('19.99')
  expect(priceInput(0)).toBe('0.00')
  expect(priceInput(null)).toBe('')
  expect(priceInput(Number.MAX_SAFE_INTEGER)).toBe('90071992547409.91')
})

test('search, category, and inclusive prices combine with AND before numeric sorting, without mutating input', () => {
  const snapshot = structuredClone(products)
  expect(
    selectProducts(
      products,
      query(
        'q=++MUG++&category=home&minPrice=9&maxPrice=19.99&sort=price-desc',
      ),
    ).items.map((item) => item.id),
  ).toEqual(['c', 'a', 'b'])
  expect(
    selectProducts(products, query('sort=price-asc')).items.map(
      (item) => item.id,
    ),
  ).toEqual(['f', 'a', 'b', 'c', 'e', 'd'])
  expect(
    selectProducts(products, query()).items.map((item) => item.id),
  ).toEqual(['a', 'b', 'f', 'c', 'e', 'd'])
  expect(selectProducts(products, query('category=unknown')).count).toBe(0)
  expect(
    selectProducts(products, query('maxPrice=0')).items.map((item) => item.id),
  ).toEqual(['f'])
  expect(products).toEqual(snapshot)
})

test('page boundaries keep a visible page 1 for zero results and clamp to the final page', () => {
  for (const [count, pageCount, lastCount] of [
    [0, 1, 0],
    [1, 1, 1],
    [12, 1, 12],
    [13, 2, 1],
    [25, 3, 1],
    [49, 5, 1],
  ]) {
    const input = Array.from({ length: count }, (_, i) =>
      product(`item-${String(i + 1).padStart(2, '0')}`, 'Mug', i),
    )
    const selected = selectProducts(input, query('page=99'))
    expect(selected).toMatchObject({ count, pageCount, page: pageCount })
    expect(selected.items).toHaveLength(lastCount)
  }
})

test('filtering the entire catalog before slicing finds matches beyond the unfiltered first page', () => {
  const input = [
    ...Array.from({ length: 12 }, (_, i) =>
      product(`stool-${i}`, 'A Stool', 100),
    ),
    ...Array.from({ length: 13 }, (_, i) =>
      product(`mug-${String(i + 1).padStart(2, '0')}`, 'Z Mug', 900),
    ),
  ]
  const first = selectProducts(input, query('q=mug'))
  expect(first.items.map((item) => item.id)).toEqual([
    'mug-01',
    'mug-02',
    'mug-03',
    'mug-04',
    'mug-05',
    'mug-06',
    'mug-07',
    'mug-08',
    'mug-09',
    'mug-10',
    'mug-11',
    'mug-12',
  ])
  expect(first).toMatchObject({ count: 13, pageCount: 2, page: 1 })
  expect(
    selectProducts(input, query('q=mug&page=2')).items.map((item) => item.id),
  ).toEqual(['mug-13'])
})
