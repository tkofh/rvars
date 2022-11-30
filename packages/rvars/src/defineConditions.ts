import mitt from 'mitt'
import type {
  Breakpoint,
  Breakpoints,
  ConditionalValue,
  Conditions,
  ConditionsDefinition,
  ConditionsEvents,
  ConditionState,
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
        emitter.emit('update', state)
      }
      eventHandlers.set(mediaQueryList, handler)
      mediaQueryList.addEventListener('change', handler)
    }
  }

  const responsiveArray = conditions.responsiveArray ?? Object.keys(conditions.breakpoints)

  const normalize = <TValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    defaultValue?: TValue
  ): Record<keyof TBreakpoints, TValue | undefined> => {
    const breakpointKeys: (keyof TBreakpoints)[] = Object.keys(conditions.breakpoints)

    let valueAsObject: Record<keyof TBreakpoints, TValue | undefined>
    if (Array.isArray(value)) {
      valueAsObject = Object.fromEntries(
        responsiveArray
          .slice(0, value.length)
          .map((breakpointKey, index) => [breakpointKey, value[index]])
      ) as Record<keyof TBreakpoints, TValue | undefined>
    } else if (
      typeof value !== 'object' ||
      value === null ||
      breakpointKeys.every((breakpointKey) => !(breakpointKey in value))
    ) {
      valueAsObject = { [breakpointKeys[0]]: value as TValue } as Record<
        keyof TBreakpoints,
        TValue | undefined
      >
    } else {
      valueAsObject = value as Record<keyof TBreakpoints, TValue | undefined>
    }

    return Object.fromEntries(
      breakpointKeys.reduce<[keyof TBreakpoints, TValue | undefined][]>((entries, key, index) => {
        entries.push([
          key,
          valueAsObject[key] ?? (index === 0 ? defaultValue : entries[entries.length - 1][1]),
        ])
        return entries
      }, [])
    ) as Record<keyof TBreakpoints, TValue | undefined>
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
    evaluate: (value, defaultValue) => {
      const normalized = normalize(value, defaultValue)

      if (usingFallback) {
        return (conditions.fallback ? normalized[conditions.fallback] : undefined) ?? defaultValue
      } else {
        let matchedBreakpoint: keyof TBreakpoints | undefined
        for (const [breakpoint, breakpointState] of state.entries()) {
          if (breakpointState === true && breakpoint in normalized) {
            matchedBreakpoint = breakpoint
          }
        }

        return matchedBreakpoint != null ? normalized[matchedBreakpoint] : defaultValue
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
