import type {
  ArrayConditionalValue,
  Breakpoint,
  Breakpoints,
  ConditionalValue,
  ResponsiveVariableValue,
} from './types'

export const toMediaQueryString = (breakpoint: Breakpoint) => {
  if ('raw' in breakpoint) {
    return breakpoint.raw
  } else {
    const terms: string[] = []
    if ('min' in breakpoint) {
      const min = typeof breakpoint.min === 'number' ? `${breakpoint.min}px` : breakpoint.min
      terms.push(`(min-width: ${min})`)
    }
    if ('max' in breakpoint) {
      const max = typeof breakpoint.max === 'number' ? `${breakpoint.max}px` : breakpoint.max
      terms.push(`(max-width: ${max})`)
    }
    return terms.join(' and ')
  }
}

export const valueIsArrayConditionalValue = <
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
>(
  value: ConditionalValue<TValue, TBreakpoints>
): value is ArrayConditionalValue<TValue> => Array.isArray(value)
