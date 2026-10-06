import { expect, test } from 'vitest'
import { formatPrice, parsePrice } from './money'

test('19.99 becomes exactly 1999 cents, preventing floating-point price drift', () => {
  expect(parsePrice('19.99')).toBe(1999)
})

test('zero, whole amounts, and one decimal place keep their intended value', () => {
  expect(parsePrice('0.00')).toBe(0)
  expect(parsePrice('12')).toBe(1200)
  expect(parsePrice('0.1')).toBe(10)
})

test('invalid amounts are rejected instead of silently rounded or coerced', () => {
  for (const value of [
    '19.999',
    '-1',
    'NaN',
    'Infinity',
    '1e2',
    '',
    ' ',
    '$10',
    '1,000',
    null,
    12,
  ]) {
    expect(() => parsePrice(value)).toThrow()
  }
})

test('the exact safe-integer boundary is accepted and the next cent is rejected', () => {
  expect(parsePrice('90071992547409.91')).toBe(9007199254740991)
  expect(() => parsePrice('90071992547409.92')).toThrow()
})

test('USD formatting preserves cents, including free products and large amounts', () => {
  expect(formatPrice(1999)).toBe('$19.99')
  expect(formatPrice(10)).toBe('$0.10')
  expect(formatPrice(0)).toBe('$0.00')
  expect(formatPrice(9007199254740991)).toBe('$90,071,992,547,409.91')
})

test('formatting rejects invalid minor units rather than displaying a false price', () => {
  for (const value of [-1, 1.5, NaN, Infinity, 9007199254740992]) {
    expect(() => formatPrice(value)).toThrow()
  }
})
