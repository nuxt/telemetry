import { readFile, writeFile } from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    // remove in next major version
    emitCJS: true,
    cjsBridge: false,
  },
  // remove in next major version
  hooks: {
    'build:done': async (ctx) => {
      const declaration = await readFile('./dist/types.d.mts', 'utf-8')
      if (!ctx.options.stub && !declaration.includes('export { type ModuleOptions, default } from \'./module.mjs\'')) {
        process.exit(1)
      }
      await writeFile('./dist/types.d.cts', `
import { default as telemetryModule } from './module.mjs'
export = telemetryModule`)
    },
  },
  entries: [
    'src/cli',
  ],
})
