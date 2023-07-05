import { destr } from 'destr'
import { nanoid } from 'nanoid'
import { defineNuxtModule } from '@nuxt/kit'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { Telemetry } from './telemetry'
import { getStats } from './utils/build-stats'
import { Stats, TelemetryOptions } from './types'
import { ensureUserconsent } from './consent'
import { logger } from './utils/log'
import { hash } from './utils/hash'

export type ModuleOptions = boolean | TelemetryOptions

export default defineNuxtModule<TelemetryOptions>({
  meta: {
    name: '@nuxt/telemetry',
    configKey: 'telemetry'
  },
  defaults: {
    endpoint: process.env.NUXT_TELEMETRY_ENDPOINT || 'https://telemetry.nuxt.com',
    debug: destr(process.env.NUXT_TELEMETRY_DEBUG),
    enabled: undefined as any,
    seed: undefined as any
  },
  async setup (toptions, nuxt) {
    if (!toptions.debug) {
      logger.level = 0
    }

    const _topLevelTelemetry = (nuxt.options as any).telemetry
    if (_topLevelTelemetry !== true) {
      if (
        toptions.enabled === false ||
        _topLevelTelemetry === false ||
        !await ensureUserconsent(toptions)
      ) {
        logger.info('Telemetry disabled')
        return
      }
    }

    logger.info('Telemetry enabled')

    if (!toptions.seed) {
      toptions.seed = hash(nanoid())
      updateUserNuxtRc('telemetry.seed', toptions.seed)
      logger.info('Seed generated:', toptions.seed)
    }

    const t = new Telemetry(nuxt, toptions)

    nuxt.hook('modules:done', () => {
      t.createEvent('project')
      t.createEvent('session')
      t.createEvent('command')
      t.sendEvents(toptions.debug)
    })
  }
})

// TODO
// function profile (nuxt: Nuxt, t: Telemetry) {
//   const startT: any = {}
//   const duration: any = {}
//   const stats: Partial<Stats> = {}
//   let routesCount = 0

//   const timeStart = (name: string) => {
//     startT[name] = Date.now()
//   }
//   const timeEnd = (name: string) => {
//     duration[name] = Date.now() - startT[name]
//   }

//   // Total build timing
//   nuxt.hook('build:before', () => {
//     timeStart('build')
//   })
//   nuxt.hook('build:done', () => {
//     timeEnd('build')
//   })

//   nuxt.hook(
//     'build:compiled',
//     ({ name, stats: _stats }: { name: string; stats: Stats }) => {
//       // @ts-ignore
//       stats[name] = getStats(_stats)
//     }
//   )

//   // Generate timing
//   // TODO: workaround as generate:before is before build
//   nuxt.hook('generate:extendRoutes', () => timeStart('generate'))
//   nuxt.hook('generate:routeCreated', () => {
//     routesCount++
//   })
//   nuxt.hook('generate:done', () => {
//     timeEnd('generate')
//     // nuxt generate or nuxt export
//     t.createEvent('generate', { duration, stats, routesCount })
//     t.sendEvents()
//   })
//   // Report build time
//   nuxt.hook('build:done', () => {
//     // nuxt build or nuxt dev
//     t.createEvent('build', { duration, stats })
//     t.sendEvents()
//   })
// }
