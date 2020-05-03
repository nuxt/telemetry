import { Telemetry } from './telemetry'
import { isTrue } from './utils/is-true'
import { getStats } from './utils/build-stats'

export default function telemetryModule() {
  if (isTrue(process.env.NUXT_TELEMETRY_DISABLED)) {
    return
  }

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

function profile(nuxt, t) {
  const startT = {}
  const duration = {}
  const stats = {}
  let routesCount = 0

  const timeStart = (name) => {
    startT[name] = new Date()
  }
  const timeEnd = (name) => {
    duration[name] = new Date() - startT[name]
  }

  // Total build timing
  nuxt.hook('build:before', () => {
    timeStart('build')
  })
  nuxt.hook('build:done', () => {
    timeEnd('build')
  })

  nuxt.hook('build:compiled', ({ name, stats: _stats }) => {
    stats[name] = getStats(_stats)
  })

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
