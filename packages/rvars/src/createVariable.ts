import type { Breakpoints, ConditionalValue, Conditions, ResponsiveVariable } from './types'

export const createVariable = <
  TValue,
  TBreakpoints extends Breakpoints,
  TDefaultValue extends TValue | undefined
>(
  conditions: Conditions<TBreakpoints>,
  value: ConditionalValue<TValue, TBreakpoints>,
  defaultValue: TDefaultValue
): ResponsiveVariable<TValue, TBreakpoints, TDefaultValue> => {
  const state = {
    value,
    defaultValue,
    current: conditions.evaluate(value, defaultValue),
  }

  const update = (value: ConditionalValue<TValue, TBreakpoints>, defaultValue: TDefaultValue) => {
    state.value = value
    state.defaultValue = defaultValue
  }

  conditions.addEventListener('change', () => {
    state.current = conditions.evaluate(state.value, state.defaultValue)
  })

  return { current: () => state.current, update }
}
