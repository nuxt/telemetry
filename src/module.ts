import destr from 'destr'
import { nanoid } from 'nanoid'
import { name, version } from '../package.json'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { Telemetry } from './telemetry'
import { getStats } from './utils/build-stats'
import { Stats, Nuxt, TelemetryOptions } from './types'
import { ensureUserNotice } from './notice'
import log from './utils/log'
import { hash } from './utils/hash'

async function telemetryModule () {
  const options: TelemetryOptions = {
    endpoint: destr(process.env.NUXT_TELEMETRY_ENDPOINT) || 'https://telemetry.nuxtjs.com',
    debug: destr(process.env.NUXT_TELEMETRY_DEBUG),
    ...this.options.telemetry
  }

  if (!options.debug) {
    log.level = -Infinity
  }

  if (this.options.telemetry !== true && !await ensureUserNotice(options)) {
    log.info('Telemetry disabled')
    return
  }
  log.info('Telemetry enabled')

  if (!options.seed) {
    options.seed = hash(nanoid())
    updateUserNuxtRc('telemetry.seed', options.seed)
    log.info('Seed generated:', options.seed)
  }

  const t = new Telemetry(this.nuxt, options)

  if (this.options._start) {
    // nuxt start
    this.nuxt.hook('listen', () => {
      t.createEvent('project')
      t.createEvent('session')
      t.createEvent('command')
      t.sendEvents()
    })
  }

  this.nuxt.hook('build:before', () => {
    t.createEvent('project')
    t.createEvent('session')
    t.createEvent('command')
    t.createEvent('dependency')
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
      t.createEvent('generate', { duration, stats, routesCount })
      t.sendEvents()
    })
  } else {
    nuxt.hook('build:done', () => {
      // nuxt build or nuxt dev
      t.createEvent('build', { duration, stats })
      t.sendEvents()
    })
  }
}

telemetryModule.meta = { name, version }

export default telemetryModule
