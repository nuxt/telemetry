import { Module } from '@nuxt/types'
import { Telemetry } from './telemetry'
import { getStats } from './utils/build-stats'
import { Stats, Nuxt, TelemetryOptions } from './types'

export default <Module> function () {
  const options: TelemetryOptions = {
    endpoint: 'https://telemetry.nuxtjs.com',
    debug: false,
    ...this.options.telemetry
  }

  const t = new Telemetry(this.nuxt, options)

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

function profile (nuxt: Nuxt, t: Telemetry) {
  const startT: any = {}
  const duration: any = {}
  const stats: Partial<Stats> = {}
  let routesCount = 0

  const timeStart = (name: string) => {
    startT[name] = Date.now()
  }
  const timeEnd = (name: string) => {
    duration[name] = Date.now() - startT[name]
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
      // @ts-ignore
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
