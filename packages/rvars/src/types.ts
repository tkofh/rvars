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
  responsiveArray?: ReadonlyArray<keyof TBreakpoints>
}

export type ResponsiveVariableValue = string | number | boolean

export type ArrayConditionalValue<TValue extends ResponsiveVariableValue> = ReadonlyArray<TValue>
export type MappedConditionalValue<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> = {
  [TBreakpoint in keyof TBreakpoints]?: TValue
}

export type ConditionalValue<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> = TValue | ReadonlyArray<TValue> | Partial<Record<keyof TBreakpoints, TValue>>

export type ExtractConditionalValue<
  TValue extends ConditionalValue<ResponsiveVariableValue, Breakpoints>
> = TValue extends ReadonlyArray<ResponsiveVariableValue>
  ? TValue[number]
  : TValue extends Partial<Record<string, ResponsiveVariableValue>>
  ? TValue[keyof TValue]
  : TValue

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
  readonly responsiveArray: ReadonlyArray<keyof TBreakpoints>
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
    value: ConditionalValue<TValue, TBreakpoints>
  ) => Partial<Record<keyof TBreakpoints, TValue>>

  readonly fill: <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>,
    fill: TValue
  ) => Record<keyof TBreakpoints, TValue>

  readonly optimize: <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>
  ) => Partial<Record<keyof TBreakpoints, TValue>>

  readonly evaluate: <TValue extends ResponsiveVariableValue>(
    value: ConditionalValue<TValue, TBreakpoints>
  ) => TValue | undefined

  readonly dispose: () => void
}

export interface ResponsiveVariableEvents<TValue> {
  change: TValue | undefined
  [k: string | number | symbol]: unknown
}

export interface ResponsiveVariable<
  TValue extends ResponsiveVariableValue,
  TBreakpoints extends Breakpoints
> {
  readonly current: () => TValue | undefined

  readonly update: (value: ConditionalValue<TValue, TBreakpoints>) => TValue | undefined

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
