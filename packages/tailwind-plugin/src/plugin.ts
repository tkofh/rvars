import type { PluginCreator } from 'tailwindcss/types/config'
import { getPluginScreens, resolveThemeTokens, toMediaQueryString } from './lib'
import type { PluginOptions } from './types'

const plugin = <TAdditionalConfigKeys extends string = never>(
  options: PluginOptions<TAdditionalConfigKeys>
): { handler: PluginCreator } => ({
  handler: (pluginAPI) => {
    const { theme, matchUtilities, addBase } = pluginAPI

    const screens = getPluginScreens(theme('screens'), options)
    const baseBreakpointName = options?.baseBreakpointName ?? 'xs'

    matchUtilities(
      {
        rvar: (value) => {
          const [varName, defaultValue] = value.split(',')

          const result: Record<string, string | Record<string, string>> = {}

          result[`--i-${varName}-${baseBreakpointName}`] = defaultValue
            ? `var(--${varName}-${baseBreakpointName}, ${defaultValue})`
            : `var(--${varName}-${baseBreakpointName})`

          result[`--${varName}`] = `var(--i-${varName}-${baseBreakpointName})`

          for (const [index, screen] of screens.entries()) {
            result[`--i-${varName}-${screen.name}`] = `var(--${varName}-${
              screen.name
            }, var(--i-${varName}-${index === 0 ? baseBreakpointName : screens[index - 1].name}))`
          }

          // split up so that tailwind groups all custom property definitions in one class declaration
          for (const screen of screens) {
            result[`@media ${toMediaQueryString(screen)}`] = {
              [`--${varName}`]: `var(--i-${varName}-${screen.name})`,
            }
          }

          return result
        },
      },
      {
        modifiers: {},
        supportsNegativeValues: true,
        type: 'any',
        respectImportant: true,
        respectPrefix: true,
      }
    )

    if (options.tokens != null) {
      addBase({
        ':root': resolveThemeTokens(pluginAPI, options.tokens, options.tokenPrefix),
      })
    }
  },
})
plugin.__isOptionsFunction = true

export { plugin }
