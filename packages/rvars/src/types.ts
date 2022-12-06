import type { Handler } from 'mitt'

export type Breakpoint =
  | { min: number | string }
  | { max: number | string }
  | { min: number | string; max: number | string }
  | { raw: string }
  | Record<string, never>

export interface Breakpoints {
  [BreakpointName: string]: Breakpoint
}

export interface ConditionsDefinition<TBreakpoints extends Breakpoints> {
  breakpoints: TBreakpoints
  fallback?: keyof TBreakpoints
  responsiveArray?: Array<keyof TBreakpoints>
}

export type ResponsiveVariableValue = string | number | boolean | symbol | null | undefined

export type ArrayConditionalValue<TValue extends ResponsiveVariableValue> = Array<TValue>
export type MappedConditionalValue<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> = {
  [TBreakpoint in keyof TBreakpoints]?: TValue
}

export type ConditionalValue<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> = TValue | Array<TValue> | Partial<Record<keyof TBreakpoints, TValue>>

export type ExtractSimpleConditionalValue<
  TConditionalValue extends ConditionalValue<ResponsiveVariableValue, Breakpoints>
> = TConditionalValue extends ConditionalValue<infer TValue, Breakpoints> ? TValue : never

export type ConditionState<TBreakpoints extends Breakpoints> = Map<keyof TBreakpoints, boolean>

export type ReadonlyConditionState<TBreakpoints extends Breakpoints> = ReadonlyMap<
  keyof TBreakpoints,
  boolean
>

export interface ConditionsEvents<TBreakpoints extends Breakpoints> {
  change: ReadonlyConditionState<TBreakpoints>
  [k: string | number | symbol]: unknown
}

export interface Conditions<TBreakpoints extends Breakpoints>
  extends Readonly<ConditionsDefinition<TBreakpoints>> {
  readonly responsiveArray: Array<keyof TBreakpoints>
  readonly usingFallback: boolean
  readonly state: ConditionState<TBreakpoints>

  readonly addEventListener: <TEvent extends keyof ConditionsEvents<TBreakpoints>>(
    event: TEvent,
    handler: Handler<ConditionsEvents<TBreakpoints>[TEvent]>
  ) => void

  readonly removeEventListener: <TEvent extends keyof ConditionsEvents<TBreakpoints>>(
    event: TEvent,
    handler: Handler<ConditionsEvents<TBreakpoints>[TEvent]>
  ) => void

  readonly normalize: <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    fallback: TValue
  ) => Record<keyof TBreakpoints, TValue>

  readonly evaluate: <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    fallback: TValue
  ) => TValue

  readonly dispose: () => void
}

export interface ResponsiveVariableEvents<TValue> {
  change: TValue
  [k: string | number | symbol]: unknown
}

export interface ResponsiveVariable<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> {
  readonly current: () => TValue

  readonly update: (value: ConditionalValue<TValue, TBreakpoints>, fallback: TValue) => TValue

  readonly addEventListener: <TEvent extends keyof ResponsiveVariableEvents<TValue>>(
    event: TEvent,
    handler: Handler<ConditionsEvents<TBreakpoints>[TEvent]>
  ) => void

  readonly removeEventListener: <TEvent extends keyof ResponsiveVariableEvents<TValue>>(
    event: TEvent,
    handler: Handler<ConditionsEvents<TBreakpoints>[TEvent]>
  ) => void

  dispose: () => void
}
