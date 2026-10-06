import { expect, test } from 'vitest'
import {
  addCartProduct,
  cartLineTotal,
  cartReducer,
  changeCartQuantity,
  summarizeCart,
  type CartLine,
  type CartProduct,
  type CartState,
} from './cart'

const mug: CartProduct = {
  id: 'mug',
  slug: 'mug',
  name: 'Mug',
  image: '/mug.webp',
  priceMinor: 1999,
  currency: 'USD',
}
const pencil: CartProduct = {
  id: 'pencil',
  slug: 'pencil',
  name: 'Pencil',
  image: '',
  priceMinor: 10,
  currency: 'USD',
}
const empty: CartState = { lines: [], error: null, checkout: null }
const line: CartLine = {
  productId: 'mug',
  slug: 'mug',
  name: 'Mug',
  image: '/mug.webp',
  unitPriceMinor: 1999,
  currency: 'USD',
  quantity: 1,
}

test('first add snapshots display data and repeated adds merge by ID without mutating input', () => {
  const first = cartReducer(empty, { type: 'add', product: mug })
  expect(first).toEqual({ lines: [line], error: null, checkout: null })
  const second = cartReducer(first, { type: 'add', product: mug })
  expect(second.lines).toEqual([{ ...line, quantity: 2 }])
  expect(summarizeCart(second.lines)).toEqual({ count: 2, totalMinor: 3998 })
  expect(first.lines).toEqual([line])
  expect(empty.lines).toEqual([])
  expect(mug.priceMinor).toBe(1999)
})

test('three mugs at 19.99 plus two pencils at 0.10 yield 59.97 and 0.20, total 60.17', () => {
  let state = empty
  for (const product of [mug, mug, mug, pencil, pencil])
    state = cartReducer(state, { type: 'add', product })
  expect(state.lines.map(cartLineTotal)).toEqual([5997, 20])
  expect(summarizeCart(state.lines)).toEqual({ count: 5, totalMinor: 6017 })
  expect(state.lines).toHaveLength(2)
})

test('increase and decrease update totals by one unit; decrease at one and missing-line changes are no-ops', () => {
  const original = [line]
  const two = changeCartQuantity(original, 'mug', 1)
  const three = changeCartQuantity(two, 'mug', 1)
  expect(summarizeCart(three)).toEqual({ count: 3, totalMinor: 5997 })
  const one = changeCartQuantity(
    changeCartQuantity(three, 'mug', -1),
    'mug',
    -1,
  )
  expect(one).toEqual([line])
  expect(changeCartQuantity(one, 'mug', -1)).toBe(one)
  expect(changeCartQuantity(one, 'missing', 1)).toBe(one)
  expect(changeCartQuantity(one, 'missing', -1)).toBe(one)
  expect(original).toEqual([line])
})

test('rapid sequential reducer updates retain every click and keep a single product line', () => {
  let state = cartReducer(empty, { type: 'add', product: mug })
  for (let i = 0; i < 20; i++)
    state = cartReducer(state, { type: 'increase', productId: 'mug' })
  expect(state.lines).toHaveLength(1)
  expect(summarizeCart(state.lines)).toEqual({ count: 21, totalMinor: 41979 })
  state = cartReducer(state, { type: 'decrease', productId: 'mug' })
  expect(summarizeCart(state.lines)).toEqual({ count: 20, totalMinor: 39980 })
})

test('remove deletes the whole line, missing remove is harmless, and clear produces a zero summary', () => {
  const lines = addCartProduct(
    addCartProduct(addCartProduct([], mug), mug),
    pencil,
  )
  const remaining = cartReducer(
    { lines, error: null, checkout: null },
    { type: 'remove', productId: 'mug' },
  )
  expect(remaining.lines.map((item) => item.productId)).toEqual(['pencil'])
  expect(summarizeCart(remaining.lines)).toEqual({ count: 1, totalMinor: 10 })
  expect(
    cartReducer(remaining, { type: 'remove', productId: 'missing' }),
  ).toEqual(remaining)
  expect(cartReducer(remaining, { type: 'clear' })).toEqual(empty)
  expect(cartReducer(empty, { type: 'clear' })).toEqual(empty)
  expect(summarizeCart([])).toEqual({ count: 0, totalMinor: 0 })
  expect(lines).toHaveLength(2)
  expect(lines[0].quantity).toBe(2)
})

test('invalid price, currency, or identity rejects the add without replacing valid lines', () => {
  const state = { lines: [line], error: null, checkout: null }
  for (const product of [
    { ...pencil, priceMinor: -1 },
    { ...pencil, priceMinor: 1.5 },
    { ...pencil, priceMinor: NaN },
    { ...pencil, priceMinor: Infinity },
    { ...pencil, currency: 'EUR' },
    { ...pencil, id: '' },
    { ...mug, priceMinor: 2000 },
  ]) {
    const result = cartReducer(state, { type: 'add', product })
    expect(result.lines).toBe(state.lines)
    expect(result.error).toBeTruthy()
  }
  expect(state).toEqual({ lines: [line], error: null, checkout: null })
})

test('invalid quantities and line arithmetic are rejected rather than displaying rounded totals', () => {
  for (const quantity of [
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    expect(() => cartLineTotal({ ...line, quantity })).toThrow()
  }
  expect(() =>
    cartLineTotal({
      ...line,
      unitPriceMinor: Number.MAX_SAFE_INTEGER,
      quantity: 2,
    }),
  ).toThrow()
  expect(() => cartLineTotal({ ...line, currency: 'EUR' })).toThrow()
})

test('aggregate overflow and count overflow preserve the cart and expose an error', () => {
  const expensive = { ...line, unitPriceMinor: Number.MAX_SAFE_INTEGER }
  expect(cartLineTotal(expensive)).toBe(Number.MAX_SAFE_INTEGER)
  const state = { lines: [expensive], error: null, checkout: null }
  const added = cartReducer(state, { type: 'add', product: pencil })
  expect(added.lines).toBe(state.lines)
  expect(added.error).toContain('too large')
  const increased = cartReducer(state, { type: 'increase', productId: 'mug' })
  expect(increased.lines).toBe(state.lines)
  expect(increased.error).toContain('too large')
  const free = { ...line, unitPriceMinor: 0, quantity: Number.MAX_SAFE_INTEGER }
  const freeState = { lines: [free], error: null, checkout: null }
  expect(
    cartReducer(freeState, { type: 'increase', productId: 'mug' }).lines,
  ).toBe(freeState.lines)
  expect(
    cartReducer(freeState, {
      type: 'add',
      product: { ...pencil, priceMinor: 0 },
    }).error,
  ).toContain('too large')
})

test('free products remain usable and a successful next action clears prior feedback', () => {
  const failed = cartReducer(empty, {
    type: 'add',
    product: { ...mug, priceMinor: -1 },
  })
  const added = cartReducer(failed, {
    type: 'add',
    product: { ...mug, priceMinor: 0 },
  })
  expect(added.error).toBeNull()
  expect(summarizeCart(added.lines)).toEqual({ count: 1, totalMinor: 0 })
})

test('checkout captures 60.17 before clearing; repeat checkout cannot create a zero receipt', () => {
  let state = empty
  for (const product of [mug, mug, mug, pencil, pencil])
    state = cartReducer(state, { type: 'add', product })
  const complete = cartReducer(state, { type: 'checkout' })
  expect(complete).toEqual({
    lines: [],
    error: null,
    checkout: { totalMinor: 6017, currency: 'USD' },
  })
  expect(summarizeCart(complete.lines)).toEqual({ count: 0, totalMinor: 0 })
  expect(cartReducer(complete, { type: 'checkout' })).toBe(complete)
  expect(cartReducer(empty, { type: 'checkout' })).toBe(empty)
  expect(cartReducer(complete, { type: 'dismiss-checkout' })).toEqual(empty)
  expect(state.lines).toHaveLength(2)
})

test('free-cart checkout succeeds; invalid checkout preserves lines without reporting success', () => {
  const free = cartReducer(empty, {
    type: 'add',
    product: { ...mug, priceMinor: 0 },
  })
  expect(cartReducer(free, { type: 'checkout' }).checkout).toEqual({
    totalMinor: 0,
    currency: 'USD',
  })
  const invalid = { ...empty, lines: [{ ...line, quantity: 0 }] }
  const result = cartReducer(invalid, { type: 'checkout' })
  expect(result.lines).toBe(invalid.lines)
  expect(result.checkout).toBeNull()
  expect(result.error).toBeTruthy()
})
