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

  const breakpointKeys: (keyof TBreakpoints)[] = Object.keys(conditions.breakpoints)

  const state = new Map(
    breakpointKeys.map((key) => [key, false])
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

  const responsiveArray = conditions.responsiveArray ?? breakpointKeys

  const normalize = <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>
  ): Partial<Record<keyof TBreakpoints, TValue>> => {
    let normalized: Partial<Record<keyof TBreakpoints, TValue>>
    if (Array.isArray(value)) {
      normalized = Object.fromEntries(
        responsiveArray
          .slice(0, value.length)
          .map((breakpointKey, index) => [breakpointKey, value[index]])
      ) as Partial<Record<keyof TBreakpoints, TValue>>
    } else if (typeof value !== 'object') {
      normalized = { [breakpointKeys[0]]: value as TValue } as Partial<
        Record<keyof TBreakpoints, TValue>
      >
    } else {
      normalized = value
    }

    return normalized
  }

  const fill = <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    fill: TValue
  ): Record<keyof TBreakpoints, TValue> => {
    const normalized = normalize(value)

    const output = {} as Record<keyof TBreakpoints, TValue>
    for (const [index, key] of breakpointKeys.entries()) {
      if (key in normalized && normalized[key] != null) {
        output[key] = normalized[key]!
      } else if (index === 0) {
        output[key] = fill
      } else {
        output[key] = output[breakpointKeys[index - 1]]
      }
    }

    return output
  }

  const optimize = <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>
  ): Partial<Record<keyof TBreakpoints, TValue>> => {
    const normalized = normalize(value)

    const output = {} as Partial<Record<keyof TBreakpoints, TValue>>
    for(const [index, key] of breakpointKeys.entries()) {
      if(index === 0 || normalized[key] !== output[breakpointKeys[index - 1]]) {
        output[key] = normalized[key]
      } else {
        output[key] = undefined
      }
    }

    return normalized
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
    fill,
    optimize,
    evaluate: (value) => {
      const normalized = normalize(value)

      if (usingFallback) {
        return conditions.fallback ? normalized[conditions.fallback] : undefined
      } else {
        let matchedBreakpoint: keyof TBreakpoints | undefined
        for (const [breakpoint, breakpointState] of state.entries()) {
          if (breakpointState === true && breakpoint in normalized) {
            matchedBreakpoint = breakpoint
          }
        }

        return matchedBreakpoint != null ? normalized[matchedBreakpoint] : undefined
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
