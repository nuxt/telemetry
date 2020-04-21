import { Telemetry } from './telemetry'

export default function () {
  const t = new Telemetry({ options: this.options, nuxt: this.nuxt })
  if (t.isDisabled) {
    return
  }

  if (!this.options.dev) {
    // nuxt start
    this.nuxt.hook('listen', () => {
      t.processEvent('NUXT_PROJECT')
      t.processEvent('NUXT_SESSION')
      t.processEvent('NUXT_CLI_COMMAND')
      t.recordEvents()
    })
  }

  this.nuxt.hook('build:before', () => {
    t.processEvent('NUXT_PROJECT')
    t.processEvent('NUXT_SESSION')
    t.processEvent('NUXT_CLI_COMMAND')
    t.processEvent('NUXT_DEPENDENCY')
    t.processEvent('NUXT_CONFIG')
  })

  if (!this.nuxt.options._generate) {
    this.nuxt.hook('build:before', () => {
      // nuxt build or nuxt dev
      t.processEvent('NUXT_BUILD')
    })
  } else {
    this.nuxt.hook('generate:before', () => {
      // nuxt generate or nuxt export
      t.processEvent('NUXT_SSG')
    })
  }

  this.nuxt.hook('build:done', (nuxt) => {
    t.recordEvents()
  })
}
