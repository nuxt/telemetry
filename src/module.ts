import destr from 'destr'
import { nanoid } from 'nanoid'
import { name, version } from '../package.json'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { Telemetry } from './telemetry'
import { getStats } from './utils/build-stats'
import { Stats, Nuxt, TelemetryOptions } from './types'
import { ensureUserconsent } from './consent'
import log from './utils/log'
import { hash } from './utils/hash'

async function _telemetryModule (nuxt) {
  const toptions: TelemetryOptions = {
    endpoint: destr(process.env.NUXT_TELEMETRY_ENDPOINT) || 'https://telemetry.nuxtjs.com',
    debug: destr(process.env.NUXT_TELEMETRY_DEBUG),
    ...nuxt.options.telemetry
  }

  if (!toptions.debug) {
    log.level = -Infinity
  }

  if (nuxt.options.telemetry !== true) {
    if (
      toptions.enabled === false ||
      nuxt.options.telemetry === false ||
      !await ensureUserconsent(toptions)
    ) {
      log.info('Telemetry disabled')
      return
    }
  }

  log.info('Telemetry enabled')

  if (!toptions.seed) {
    toptions.seed = hash(nanoid())
    updateUserNuxtRc('telemetry.seed', toptions.seed)
    log.info('Seed generated:', toptions.seed)
  }

  const t = new Telemetry(nuxt, toptions)

  if (nuxt.options._start) {
    // nuxt start
    nuxt.hook('listen', () => {
      t.createEvent('project')
      t.createEvent('session')
      t.createEvent('command')
      t.sendEvents()
    })
  }

  nuxt.hook('build:before', () => {
    t.createEvent('project')
    t.createEvent('session')
    t.createEvent('command')
    t.createEvent('dependency')
  })

  profile(nuxt, t)
}

async function telemetryModule () {
  try {
    await _telemetryModule(this.nuxt)
  } catch (err) {
    log.error(err)
  }
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
  nuxt.hook('generate:routeCreated', () => {
    routesCount++
  })
  nuxt.hook('generate:done', () => {
    timeEnd('generate')
    // nuxt generate or nuxt export
    t.createEvent('generate', { duration, stats, routesCount })
    t.sendEvents()
  })
  // Report build time
  nuxt.hook('build:done', () => {
    // nuxt build or nuxt dev
    t.createEvent('build', { duration, stats })
    t.sendEvents()
  })
}

telemetryModule.meta = { name, version }

export default telemetryModule
