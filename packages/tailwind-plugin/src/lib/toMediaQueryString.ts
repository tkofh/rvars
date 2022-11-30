import type { NormalizedScreen } from '../types'

export const toMediaQueryString = (screen: NormalizedScreen) => {
  const values = screen.values.map((screen) => {
    if (screen.raw !== undefined) {
      return screen.raw
    }

    return [screen.min && `(min-width: ${screen.min})`, screen.max && `(max-width: ${screen.max})`]
      .filter(Boolean)
      .join(' and ')
  })

  return screen.not ? `not all and ${values}` : values
}
