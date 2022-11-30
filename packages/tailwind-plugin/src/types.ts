import type { Config } from 'tailwindcss/types'

export type Entries<T extends Record<string, unknown>> = T extends Record<infer K, infer V>
  ? [K, V][]
  : never

export type ScreenConfig =
  | { raw: string }
  | { min: string }
  | { 'min-width': string }
  | { max: string }
  | { min: string; max: string }

export type ScreensConfig = string[] | Record<string, string | ScreenConfig | ScreenConfig[]>

export interface NormalizedScreenValue {
  min?: string
  max?: string
  raw?: string
}

export interface NormalizedScreen {
  name: string
  not: boolean
  values: NormalizedScreenValue[]
}

type RemoveIndex<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
}
interface RecursiveRecord<V = string> {
  [key: string]: V | RecursiveRecord<V>
}

type TailwindThemeConfig = Omit<
  RemoveIndex<Required<Exclude<Config['theme'], undefined>>>,
  'extend'
>

export type TailwindThemeValue = string | number | RecursiveRecord<string | number>

export type SimpleTokenConfig = string[] | boolean
export type RecursiveTokenConfig = RecursiveRecord<SimpleTokenConfig>
export interface AliasedTokenConfig {
  as: string
  values: SimpleTokenConfig | RecursiveTokenConfig
}
export type TokenConfig =
  | SimpleTokenConfig
  | RecursiveTokenConfig
  | AliasedTokenConfig
  | AliasedTokenConfig[]

export type TokensConfig<TAdditionalConfigKeys extends string = never> = {
  [K in keyof TailwindThemeConfig | TAdditionalConfigKeys]?: TokenConfig
}

export interface TokenAccessPath {
  label: string
  head: string
  tail: string[]
}


// export interface NamedThemeOptions<TAdditionalConfigKeys extends string = never>
//   extends ThemeOptions<TAdditionalConfigKeys> {
//   name: string
// }

export interface PluginOptions<TAdditionalConfigKeys extends string = never> {
  orderedBreakpoints: string[]
  baseBreakpointName?: string
  tokenPrefix?: string
  tokens?: TokensConfig<TAdditionalConfigKeys>
}
