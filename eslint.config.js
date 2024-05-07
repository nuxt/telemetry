// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
}).append({
  rules: {
    // TODO: improve type safety
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
