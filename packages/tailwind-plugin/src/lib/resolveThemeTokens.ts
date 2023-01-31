import type { PluginAPI } from 'tailwindcss/types/config'
import type { TailwindThemeValue, TokensConfig } from '../types'
import { normalizeTokensConfig } from './normalizeTokensConfig'

const expandThemeValues = (prefix: string, values: TailwindThemeValue): [string, string][] => {
  if (typeof values === 'object') {
    return Object.entries(values)
      .map(([key, value]) => expandThemeValues(`${prefix}-${key}`, value))
      .flat(1)
  } else {
    return [[prefix, String(values)]]
  }
}

export const resolveThemeTokens = (
  pluginAPI: PluginAPI,
  tokens: TokensConfig,
  prefix: string | undefined
) => {
  const tokenEntries: [string, string][] = []

  for (const [label, configPath] of normalizeTokensConfig(tokens, prefix)) {
    const tailwindThemeValue = pluginAPI.theme(configPath)
    if (tailwindThemeValue == null) {
      // eslint-disable-next-line no-console
      console.warn(
        `[@fashionable/tailwind-plugin-theme-tokens]: Tailwind Theme Config Path '${configPath}' resolved to undefined. Skipping (would have been labeled '${label}')`
      )
    } else {
      tokenEntries.push(
        ...expandThemeValues(label, tailwindThemeValue).map(
          ([key, value]) => [`--${pluginAPI.e(key)}`, value] as [string, string]
        )
      )
    }
  }

  return Object.fromEntries(tokenEntries)
}
