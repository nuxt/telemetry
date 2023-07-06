import { EventFactory } from '../types'

export interface ModuleEvent {
  name: 'module'
  moduleName: string
  version: string
  timing: number
}

export const module = <EventFactory<ModuleEvent>> function ({ nuxt: { options } }) {
  const events: ModuleEvent[] = []

  // Get used modules and only the ones with a version (published on npm)
  const modules = (options._installedModules || []).filter(m => m.meta?.version).map(m => ({
    name: m.meta.name,
    version: m.meta.version,
    timing: m.timings?.setup || 0
  }))

  for (const m of modules) {
    events.push({
      name: 'module',
      moduleName: m.name,
      version: m.version,
      timing: m.timing
    })
  }

  return events
}
