import mitt from 'mitt'
import type {
  Breakpoints,
  ConditionalValue,
  Conditions,
  ResponsiveVariable,
  ResponsiveVariableEvents,
  ResponsiveVariableValue,
} from './types'

export const createVariable = <
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints = Breakpoints
>(
  conditions: Conditions<TBreakpoints>,
  value: ConditionalValue<TValue, TBreakpoints>,
  base: TValue
): ResponsiveVariable<TValue, TBreakpoints> => {
  let internalValue = value
  let internalBase = base
  let current = conditions.evaluate(internalValue, internalBase)

  const emitter = mitt<ResponsiveVariableEvents<TValue>>()

  const onChange = () => {
    current = conditions.evaluate(internalValue, internalBase)
    emitter.emit('change', current)
  }

  conditions.addEventListener('change', onChange)

  return {
    current: () => current,
    update: (value: ConditionalValue<TValue, TBreakpoints>, base: TValue) => {
      internalValue = value
      internalBase = base
      onChange()
      return current
    },
    addEventListener: (event, handler) => {
      emitter.on(event, handler)
    },
    removeEventListener: (event, handler) => {
      emitter.off(event, handler)
    },
    dispose: () => {
      conditions.removeEventListener('change', onChange)
    },
  }
}
