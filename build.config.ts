import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    cjsBridge: false,
  },
  entries: [
    'src/cli',
  ],
})
