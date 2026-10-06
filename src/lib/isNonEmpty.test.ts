import { expect, test } from 'vitest'
import { isNonEmpty } from './isNonEmpty'

test('accepts text', () => {
  expect(isNonEmpty('hello')).toBe(true)
})

test('rejects an empty string', () => {
  expect(isNonEmpty('')).toBe(false)
})

test('rejects spaces without text', () => {
  expect(isNonEmpty('   ')).toBe(false)
})
