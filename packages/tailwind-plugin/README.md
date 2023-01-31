# rvars Tailwind Plugin

All `@rvars` TailwindCSS plugins in one

## Installation

Install `@rvars/tailwind-plugin` with your favorite package manager:

```sh
# with pnpm
pnpm add @rvars/tailwind-plugin

# or yarn
yarn add @rvars/tailwind-plugin

# or npm
npm install @rvars/tailwind-plugin
```

Then add it to your `tailwind.config`:

```javascript
// tailwind.config.cjs

const rvars = require('@rvars/tailwind-plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [
    rvars({
      rvars: {
        orderedBreakpoints: ['sm', 'md', 'lg', 'xl'],
      },
      themeTokens: {
        tokens: { colors: true },
      },
    }),
  ],
}
```

## Configuration

For details about configuring each plugin, please visit that plugins home page (list below). To disable any plugin, set its config key to `false` rather than the expected options object.

Included plugins & config keys:

| Plugin                                | Config Key    | Links                                                 |
| ------------------------------------- | ------------- | ----------------------------------------------------- |
| `@rvars/tailwind-plugin-rvars`        | `rvars`       | [GitHub](rvars-github) [NPM](rvars-npm)               |
| `@rvars/tailwind-plugin-theme-tokens` | `themeTokens` | [GitHub](theme-tokens-github) [NPM](theme-tokens-npm) |

[rvars-github]: "https://github.com/tkofh/rvars/tree/main/packages/tailwind-plugin-rvars"
[rvars-npm]: "https://www.npmjs.com/package/@rvars/tailwind-plugin-rvars"
[theme-tokens-github]: "https://github.com/tkofh/rvars/tree/main/packages/tailwind-plugin-theme-tokens"
[theme-tokens-npm]: "https://www.npmjs.com/package/@rvars/tailwind-plugin-theme-tokens"
