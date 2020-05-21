import consola from 'consola'
import defu from 'defu'
import { Telemetry } from './telemetry'
import { isTrue } from './utils/is-true'
import { getStats } from './utils/build-stats'
import { Module } from '@nuxt/types'
import { Stats, Nuxt } from './types'
// https://typescript.nuxtjs.org/cookbook/modules.html

const logger = consola.withScope('@nuxt/telemetry')

export default <Module>function (moduleOptions) {
  const defaultConfig = {
    isDisabled: false
    // TODO: set default url
  }
  const config = defu(
    {
      ...this.options.telemetry,
      ...moduleOptions
    },
    defaultConfig
  )

  if (
    this.options.telemetry === false ||
    isTrue(process.env.NUXT_TELEMETRY_DISABLED) ||
    isTrue(config.isDisabled)
  ) {
    return
  }

  // TODO: remove when out of beta
  logger.info(
    '[beta] Nuxt Telemetry is running, learn more on https://github.com/nuxt/telemetry'
  )
  logger.debug('Telemetry is running')

  const t = new Telemetry(this.nuxt)

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
  })

  profile(this.nuxt, t)
}

function profile(nuxt: Nuxt, t: Telemetry) {
  const startT: any = {}
  const duration: any = {}
  const stats: Partial<Stats> = {}
  let routesCount = 0

  const timeStart = (name: string) => {
    startT[name] = new Date()
  }
  const timeEnd = (name: string) => {
    // https://stackoverflow.com/a/60688789
    duration[name] = new Date().valueOf() - startT[name]
  }

  // Total build timing
  nuxt.hook('build:before', () => {
    timeStart('build')
  })
  nuxt.hook('build:done', () => {
    timeEnd('build')
  })

  nuxt.hook(
    'build:compiled',
    ({ name, stats: _stats }: { name: string; stats: Stats }) => {
      stats[name] = getStats(_stats)
    }
  )

  // Generate timing
  // TODO: workaround as generate:before is before build
  nuxt.hook('generate:extendRoutes', () => timeStart('generate'))
  nuxt.hook('generate:done', () => timeEnd('generate'))
  nuxt.hook('generate:routeCreated', () => {
    routesCount++
  })

  // report all stats
  if (nuxt.options._generate) {
    nuxt.hook('generate:done', () => {
      // nuxt generate or nuxt export
      t.processEvent('NUXT_SSG', { duration, stats, routesCount })
      t.recordEvents()
    })
  } else {
    nuxt.hook('build:done', () => {
      // nuxt build or nuxt dev
      t.processEvent('NUXT_BUILD', { duration, stats })
      t.recordEvents()
    })
  }
}
