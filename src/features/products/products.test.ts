/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs'
import { expect, test } from 'vitest'
import { decodeProduct, decodeProducts } from './products'

const summary = {
  id: 'mug-1',
  slug: 'ceramic-mug',
  name: 'Ceramic Mug',
  category: 'home',
  image: '/images/mug.webp',
  price: '19.99',
  currency: 'USD',
}
const detail = {
  id: 'mug-1',
  slug: 'ceramic-mug',
  name: 'Ceramic Mug',
  category: 'home',
  images: ['/images/mug.webp'],
  description: 'A ceramic mug.',
  pricing: { amount: '19.99', currency: 'USD' },
}

test('a valid summary is normalized to the data consumed by the page', () => {
  expect(decodeProducts([summary])).toEqual([
    {
      id: 'mug-1',
      slug: 'ceramic-mug',
      name: 'Ceramic Mug',
      category: 'home',
      image: '/images/mug.webp',
      priceMinor: 1999,
      currency: 'USD',
    },
  ])
  expect(summary.price).toBe('19.99')
})

test('an empty catalog is valid so the UI can show its empty state', () => {
  expect(decodeProducts([])).toEqual([])
})

test('a detail price and images are decoded without changing the input', () => {
  const input = structuredClone(detail)
  expect(decodeProduct(input)).toEqual({
    id: 'mug-1',
    slug: 'ceramic-mug',
    name: 'Ceramic Mug',
    category: 'home',
    images: ['/images/mug.webp'],
    description: 'A ceramic mug.',
    priceMinor: 1999,
    currency: 'USD',
  })
  expect(input).toEqual(detail)
})

test('missing media, empty description, and a free price allow honest fallback states', () => {
  expect(
    decodeProducts([{ ...summary, image: '', price: '0' }])[0],
  ).toMatchObject({ image: '', priceMinor: 0 })
  expect(
    decodeProduct({ ...detail, images: [], description: '' }),
  ).toMatchObject({ images: [], description: '' })
})

test('malformed lists and required fields fail rather than becoming an empty catalog', () => {
  for (const input of [
    null,
    {},
    [null],
    [42],
    [{ ...summary, name: ' ' }],
    [{ ...summary, id: '' }],
    [{ ...summary, slug: '../other' }],
    [{ ...summary, image: 42 }],
    [{ ...summary, price: 'bad' }],
  ]) {
    expect(() => decodeProducts(input)).toThrow()
  }
})

test('duplicate IDs and slugs are rejected to keep routes and cart identity unambiguous', () => {
  expect(() =>
    decodeProducts([summary, { ...summary, slug: 'other-mug' }]),
  ).toThrow('unique')
  expect(() => decodeProducts([summary, { ...summary, id: 'mug-2' }])).toThrow(
    'unique',
  )
})

test('unsupported or mixed currency cannot slip into a USD catalog', () => {
  expect(() => decodeProducts([{ ...summary, currency: 'EUR' }])).toThrow(
    'currency',
  )
  expect(() =>
    decodeProducts([
      summary,
      { ...summary, id: 'mug-2', slug: 'other-mug', currency: 'EUR' },
    ]),
  ).toThrow('currency')
  expect(() =>
    decodeProduct({ ...detail, pricing: { amount: '1', currency: 'EUR' } }),
  ).toThrow('currency')
})

test('malformed detail fields and pricing fail instead of showing invented values', () => {
  for (const input of [
    null,
    {},
    { ...detail, pricing: null },
    { ...detail, images: 'mug.webp' },
    { ...detail, images: [1] },
    { ...detail, description: null },
    { ...detail, pricing: { amount: '19.999', currency: 'USD' } },
  ]) {
    expect(() => decodeProduct(input)).toThrow()
  }
})

test('shipped catalog and slug files agree on identity, prices, and local WebP assets', () => {
  const catalogPath = new URL(
    '../../../public/data/products.json',
    import.meta.url,
  )
  const raw: unknown = JSON.parse(readFileSync(catalogPath, 'utf8'))
  const catalog = decodeProducts(raw)
  expect(catalog).toHaveLength(49)
  expect(new Set(catalog.map((product) => product.category)).size).toBe(2)
  expect(
    catalog.filter(
      (product) =>
        product.name.toLowerCase().includes('mug') &&
        product.category === 'home' &&
        product.priceMinor >= 1000 &&
        product.priceMinor <= 5000,
    ),
  ).toHaveLength(25)
  const detailDirectory = new URL(
    '../../../public/data/products/',
    import.meta.url,
  )
  expect(readdirSync(detailDirectory).sort()).toEqual(
    catalog.map((product) => `${product.slug}.json`).sort(),
  )
  for (const summary of catalog) {
    const rawDetail: unknown = JSON.parse(
      readFileSync(new URL(`${summary.slug}.json`, detailDirectory), 'utf8'),
    )
    const product = decodeProduct(rawDetail)
    expect(product).toMatchObject({
      id: summary.id,
      slug: summary.slug,
      name: summary.name,
      category: summary.category,
      priceMinor: summary.priceMinor,
      currency: summary.currency,
    })
    expect(product.images[0]).toBe(summary.image)
    for (const path of product.images) {
      const bytes = readFileSync(
        new URL(`../../../public${path}`, import.meta.url),
      )
      expect(bytes.toString('ascii', 0, 4)).toBe('RIFF')
      expect(bytes.toString('ascii', 8, 12)).toBe('WEBP')
    }
  }
})
