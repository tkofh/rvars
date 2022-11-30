import type {
  ArrayConditionalValue,
  Breakpoint,
  Breakpoints,
  ConditionalValue,
  Conditions,
  MappedConditionalValue,
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

export const valueIsArrayConditionalValue = <TValue extends ResponsiveVariableValue, TBreakpoints extends Breakpoints>(
  value: ConditionalValue<TValue, TBreakpoints>
): value is ArrayConditionalValue<TValue> => Array.isArray(value)

export const valueIsMappedConditionalValue = <TValue extends ResponsiveVariableValue, TBreakpoints extends Breakpoints>(
  conditions: Conditions<TBreakpoints>,
  value: ConditionalValue<TValue, TBreakpoints>
): value is MappedConditionalValue<TValue, TBreakpoints> =>
  typeof value === 'object' &&
  value !== null &&
  Object.keys(conditions.breakpoints).some((breakpointKey) => Object.hasOwn(value, breakpointKey))

export const normalizeConditionalValue = <
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints,
  TDefaultValue extends TValue | undefined
>(
  conditions: Conditions<TBreakpoints>,
  value: ConditionalValue<TValue, TBreakpoints>,
  defaultValue?: TDefaultValue
): TDefaultValue extends undefined
  ? MappedConditionalValue<TValue, TBreakpoints>
  : Required<MappedConditionalValue<TValue, TBreakpoints>> => {
  const breakpointKeys: (keyof TBreakpoints)[] = Object.keys(conditions.breakpoints)

  const mappedValue: MappedConditionalValue<TValue, TBreakpoints> = {}
  if (valueIsArrayConditionalValue(value)) {
    for (const [index, breakpointKey] of conditions.responsiveArray
      .slice(0, value.length)
      .entries()) {
        mappedValue[breakpointKey] = value[index]
      }
    } else if (valueIsMappedConditionalValue(conditions, value)) {
    for (const key of breakpointKeys) {
      if (Object.hasOwn(value, key)) {
        mappedValue[key] = value[key]
      }
    }
  } else {
    mappedValue[breakpointKeys[0]] = value
  }


  for(const [index, breakpointKey] of breakpointKeys.entries()) {
    mappedValue[breakpointKey] = mappedValue[breakpointKey] ?? (index === 0 ? defaultValue : mappedValue[breakpointKeys[index - 1]])
  }

  return mappedValue as TDefaultValue extends undefined
    ? MappedConditionalValue<TValue, TBreakpoints>
    : Required<MappedConditionalValue<TValue, TBreakpoints>>
}
