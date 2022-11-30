import { describe, test } from 'vitest'
import { defineConditions } from '../../src'
import { normalizeConditionalValue } from '../../src/util'

describe('normalizeConditionalValue', () => {
  const conditions = defineConditions({
    breakpoints: {
      mobile: {},
      tablet: { min: 768 }
    }
  })

  test('it handles simple values', ({ expect }) => {
    expect(normalizeConditionalValue(conditions, 10, 0)).toStrictEqual({
      mobile: 10,
      tablet: 10
    })
  })

  test('it handles array values', ({ expect }) => {
    expect(normalizeConditionalValue(conditions, [10, 20], 0)).toStrictEqual({
      mobile: 10,
      tablet: 20
    })

    expect(normalizeConditionalValue(conditions, [null, 20], 0)).toStrictEqual({
      mobile: 0,
      tablet: 20,
    })
  })

  test('it handles mapped values', ({ expect }) => {
    expect(normalizeConditionalValue(conditions, { mobile: 10, tablet: 10 }, 0)).toStrictEqual({
      mobile: 10,
      tablet: 10
    })
  })
})
