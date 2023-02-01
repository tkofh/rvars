import {describe, test} from 'vitest'
import {defineConditions} from '../../src'

describe('defineConditions Universal', () => {
  test('it knows to use fallback', ({expect}) => {
    expect(
      defineConditions({breakpoints: {mobile: {}, tablet: {min: 768}}, fallback: 'mobile'})
        .usingFallback
    ).toBe(true)
  })

  test('it uses the default fallback condition', ({expect}) => {
    expect(
      defineConditions({
        breakpoints: {mobile: {}, tablet: {min: 768}},
        fallback: 'mobile',
      }).evaluate({mobile: 'mobile', tablet: 'tablet'})
    ).toBe('mobile')
  })

  test('it uses the default value in the absence of a defined value at the default fallback condition', ({
                                                                                                           expect,
                                                                                                         }) => {
    expect(
      defineConditions({
        breakpoints: {mobile: {}, tablet: {min: 768}},
        fallback: 'mobile',
      }).evaluate({tablet: 'tablet'})
    ).toBeUndefined()

    expect(
      defineConditions({
        breakpoints: {mobile: {}, tablet: {min: 768}},
        fallback: 'mobile',
      }).evaluate({tablet: 'tablet'})
    ).toBe(undefined)
  })

  test('it uses the default value in the absence of a defined default fallback condition', ({
                                                                                              expect,
                                                                                            }) => {
    expect(
      defineConditions({
        breakpoints: {mobile: {}, tablet: {min: 768}},
      }).evaluate({mobile: 'mobile', tablet: 'tablet'})
    ).toBeUndefined()

    expect(
      defineConditions({
        breakpoints: {mobile: {}, tablet: {min: 768}},
      }).evaluate({mobile: 'mobile', tablet: 'tablet'})
    ).toBe(undefined)
  })

  test('it optimizes values', ({expect}) => {
    const conditions = defineConditions({
      breakpoints: {mobile: {}, tablet: {min: 768}, laptop: {min: 1024}, desktop: {min: 1280}},
      responsiveArray: ['mobile', 'tablet', 'laptop', 'desktop']
    })

    expect(conditions.optimize('foo')).toStrictEqual({mobile: 'foo'})
    expect(conditions.optimize(['foo', 'foo', 'bar'])).toStrictEqual({mobile: 'foo', laptop: 'bar'})
    expect(conditions.optimize({
      mobile: 'left',
      tablet: 'right',
      laptop: 'right',
      desktop: 'right'
    })).toStrictEqual({mobile: 'left', tablet: 'right'})
  })
})
