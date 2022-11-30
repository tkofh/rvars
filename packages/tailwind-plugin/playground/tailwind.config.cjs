/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('../')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [
    plugin({
      orderedBreakpoints: ['sm', 'md', 'lg', 'xl'],
      baseBreakpointName: 'xs',
      tokens: {
        spacing: true
      },
    }),
  ],
}
