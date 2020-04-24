import { Telemetry } from './telemetry'
import { isTrue } from './utils/is-true'
import { getStats } from './utils/build-stats'

export default function telemetryModule() {
  if (isTrue(process.env.NUXT_TELEMETRY_DISABLED)) {
    return
  }

  const t = new Telemetry(this.nuxt)

  if (!this.options.dev) {
    // Production start
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

  profile(this.nuxt, t)
}

function profile(nuxt, t) {
  const startT = {}
  const duration = {}
  const stats = {}
  let generatedPages = 0

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
    generatedPages++
  })

  // Report all stats
  if (nuxt.options._generate) {
    nuxt.hook('generate:done', () => {
      t.processEvent('NUXT_SSG', { duration, stats, generatedPages })
      t.recordEvents()
    })
  } else {
    nuxt.hook('build:done', () => {
      t.processEvent('NUXT_BUILD', { duration, stats })
      t.recordEvents()
    })
  }
}
