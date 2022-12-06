import mitt from 'mitt'
import type {
  Breakpoint,
  Breakpoints,
  ConditionalValue,
  Conditions,
  ConditionsDefinition,
  ConditionsEvents,
  ConditionState,
  ResponsiveVariableValue,
} from './types'
import { toMediaQueryString } from './util'

export const defineConditions = <TBreakpoints extends Breakpoints>(
  conditions: ConditionsDefinition<TBreakpoints>
): Conditions<TBreakpoints> => {
  const usingFallback = typeof window === 'undefined'
  const eventHandlers = new Map<MediaQueryList, (event: MediaQueryListEvent) => void>()

  const state = new Map(
    Object.keys(conditions.breakpoints).map((key) => [key, false])
  ) as ConditionState<TBreakpoints>

  const emitter = mitt<ConditionsEvents<TBreakpoints>>()

  for (const [name, breakpoint] of Object.entries(conditions.breakpoints) as [
    keyof TBreakpoints,
    Breakpoint
  ][]) {
    const mediaQueryString = toMediaQueryString(breakpoint)

    if (mediaQueryString === '') {
      state.set(name, true)
    } else if (!usingFallback) {
      const mediaQueryList = window.matchMedia(mediaQueryString)
      state.set(name, mediaQueryList.matches)

      const handler = (event: MediaQueryListEvent) => {
        state.set(name, event.matches)
        emitter.emit('change', state)
      }
      eventHandlers.set(mediaQueryList, handler)
      mediaQueryList.addEventListener('change', handler)
    }
  }

  const responsiveArray = conditions.responsiveArray ?? Object.keys(conditions.breakpoints)

  const normalize = <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    fallback: TValue
  ): Record<keyof TBreakpoints, TValue> => {
    const breakpointKeys: (keyof TBreakpoints)[] = Object.keys(conditions.breakpoints)

    let valueAsObject: Partial<Record<keyof TBreakpoints, TValue>>
    if (Array.isArray(value)) {
      valueAsObject = Object.fromEntries(
        responsiveArray
          .slice(0, value.length)
          .map((breakpointKey, index) => [breakpointKey, value[index]])
      ) as Partial<Record<keyof TBreakpoints, TValue>>
    } else if (typeof value !== 'object' || value == null) {
      valueAsObject = { [breakpointKeys[0]]: value as TValue } as Partial<
        Record<keyof TBreakpoints, TValue>
      >
    } else {
      valueAsObject = value as Partial<Record<keyof TBreakpoints, TValue>>
    }

    // @ts-expect-error building object after initialization to avoid Object.fromEntries()
    const output: Record<keyof TBreakpoints, TValue | TBaseValue> = {}
    for (const [index, key] of breakpointKeys.entries()) {
      if(Object.hasOwn(valueAsObject, key)) {
        output[key] = valueAsObject[key]
      } else if(index === 0) {
        output[key] = fallback
      } else {
        output[key] = output[breakpointKeys[index - 1]]
      }
    }

    return output
  }

  return {
    ...conditions,
    responsiveArray,
    usingFallback,
    state,
    addEventListener: (event, handler) => {
      emitter.on(event, handler)
    },
    removeEventListener: (event, handler) => {
      emitter.off(event, handler)
    },
    normalize,
    evaluate: (value, fallback) => {
      const normalized = normalize(value, fallback)

      if (usingFallback) {
        return conditions.fallback ? normalized[conditions.fallback] : fallback
      } else {
        let matchedBreakpoint: keyof TBreakpoints | undefined
        for (const [breakpoint, breakpointState] of state.entries()) {
          if (breakpointState === true && breakpoint in normalized) {
            matchedBreakpoint = breakpoint
          }
        }

        return matchedBreakpoint != null ? normalized[matchedBreakpoint] : fallback
      }
    },
    dispose: () => {
      if (usingFallback) {
        emitter.all.clear()

        for (const [mediaQueryList, handler] of eventHandlers.entries()) {
          mediaQueryList.removeEventListener('change', handler)
        }
      }
    },
  }
}
