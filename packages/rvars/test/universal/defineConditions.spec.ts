import { describe, test } from 'vitest'
import { defineConditions } from '../../src'

describe('defineConditions Universal', () => {
  test('it knows to use fallback', ({ expect }) => {
    expect(
      defineConditions({ breakpoints: { mobile: {}, tablet: { min: 768 } }, fallback: 'mobile' })
        .usingFallback
    ).toBe(true)
  })

  test('it uses the default fallback condition', ({ expect }) => {
    expect(
      defineConditions({
        breakpoints: { mobile: {}, tablet: { min: 768 } },
        fallback: 'mobile',
      }).evaluate({ mobile: 'mobile', tablet: 'tablet' }, 'default')
    ).toBe('mobile')
  })

  test('it uses the default value in the absence of a defined value at the default fallback condition', ({
    expect,
  }) => {
    expect(
      defineConditions({
        breakpoints: { mobile: {}, tablet: { min: 768 } },
        fallback: 'mobile',
      }).evaluate({ tablet: 'tablet' }, 'default')
    ).toBe('default')

    expect(
      defineConditions({
        breakpoints: { mobile: {}, tablet: { min: 768 } },
        fallback: 'mobile',
      }).evaluate({ tablet: 'tablet' })
    ).toBe(undefined)
  })

  test('it uses the default value int he absence of a defined default fallback condition', ({
    expect,
  }) => {
    expect(
      defineConditions({
        breakpoints: { mobile: {}, tablet: { min: 768 } },
      }).evaluate({ mobile: 'mobile', tablet: 'tablet' }, 'default')
    ).toBe('default')

    expect(
      defineConditions({
        breakpoints: { mobile: {}, tablet: { min: 768 } },
      }).evaluate({ mobile: 'mobile', tablet: 'tablet' })
    ).toBe(undefined)
  })
})
