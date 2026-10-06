import { afterEach, expect, test, vi } from 'vitest'
import { fetchProduct, fetchProducts } from './api'

const detail = {
  id: 'mug-1',
  slug: 'ceramic-mug',
  name: 'Ceramic Mug',
  category: 'home',
  images: [],
  description: '',
  pricing: { amount: '19.99', currency: 'USD' },
}

afterEach(() => vi.unstubAllGlobals())

test('a missing slug stays not-found on a server with HTML fallback', async () => {
  // Vite serves the SPA HTML for default */* requests; JSON requests receive 404.
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockImplementation(async (_input, init) =>
        new Headers(init?.headers).get('Accept') === 'application/json'
          ? new Response(null, { status: 404 })
          : new Response('<!doctype html><title>Store</title>'),
      ),
  )
  expect(await fetchProduct('missing', new AbortController().signal)).toBeNull()
})

test('catalog HTTP data is validated and converted before reaching the hook', async () => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    Response.json([
      {
        id: 'mug-1',
        slug: 'ceramic-mug',
        name: 'Ceramic Mug',
        category: 'home',
        image: '',
        price: '19.99',
        currency: 'USD',
      },
    ]),
  )
  vi.stubGlobal('fetch', fetchMock)
  const controller = new AbortController()
  expect(await fetchProducts(controller.signal)).toEqual([
    {
      id: 'mug-1',
      slug: 'ceramic-mug',
      name: 'Ceramic Mug',
      category: 'home',
      image: '',
      priceMinor: 1999,
      currency: 'USD',
    },
  ])
  expect(fetchMock).toHaveBeenCalledWith('/data/products.json', {
    signal: controller.signal,
    headers: { Accept: 'application/json' },
  })
})

test('a slug request works without previously visiting the catalog', async () => {
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(Response.json(detail))
  vi.stubGlobal('fetch', fetchMock)
  const signal = new AbortController().signal
  expect(await fetchProduct('ceramic-mug', signal)).toMatchObject({
    id: 'mug-1',
    priceMinor: 1999,
  })
  expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
    '/data/products/ceramic-mug.json',
    { signal, headers: { Accept: 'application/json' } },
  )
})

test('404 and explicit null detail responses mean not found, not request failure', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(Response.json(null)),
  )
  const signal = new AbortController().signal
  expect(await fetchProduct('missing', signal)).toBeNull()
  expect(await fetchProduct('missing', signal)).toBeNull()
})

test('invalid slugs cannot create unintended data URLs', async () => {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  for (const slug of ['', '../secret', 'a/b', 'a?b', '%2e%2e']) {
    expect(await fetchProduct(slug, new AbortController().signal)).toBeNull()
  }
  expect(fetchMock).not.toHaveBeenCalled()
})

test('a detail for a different slug is rejected instead of displaying the wrong product', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>().mockResolvedValue(Response.json(detail)),
  )
  await expect(
    fetchProduct('other-mug', new AbortController().signal),
  ).rejects.toThrow('match')
})

test('HTTP failures stay errors, including a missing catalog file', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 })),
  )
  const signal = new AbortController().signal
  await expect(fetchProducts(signal)).rejects.toThrow('Unable')
  await expect(fetchProduct('ceramic-mug', signal)).rejects.toThrow('Unable')
})

test('malformed JSON or product data fails instead of leaking unvalidated data', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('<html>not JSON</html>'))
      .mockResolvedValueOnce(Response.json({ products: [] }))
      .mockResolvedValueOnce(
        Response.json({
          ...detail,
          pricing: { amount: '-1', currency: 'USD' },
        }),
      ),
  )
  const signal = new AbortController().signal
  await expect(fetchProducts(signal)).rejects.toThrow()
  await expect(fetchProducts(signal)).rejects.toThrow()
  await expect(fetchProduct('ceramic-mug', signal)).rejects.toThrow()
})

test('a retry can succeed after a failed request without a poisoned cache', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('Network unavailable'))
      .mockResolvedValueOnce(Response.json([])),
  )
  const signal = new AbortController().signal
  await expect(fetchProducts(signal)).rejects.toThrow('Network unavailable')
  expect(await fetchProducts(signal)).toEqual([])
})

test('the caller can abort in-flight catalog and detail requests', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>().mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          )
        }),
    ),
  )
  const controller = new AbortController()
  const catalog = expect(
    fetchProducts(controller.signal),
  ).rejects.toMatchObject({ name: 'AbortError' })
  const product = expect(
    fetchProduct('ceramic-mug', controller.signal),
  ).rejects.toMatchObject({ name: 'AbortError' })
  controller.abort()
  await Promise.all([catalog, product])
})
