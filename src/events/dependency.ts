import { getDependencies } from '../utils/get-dependencies'

import { EventFactory } from '../types'

export interface DependencyEvent {
  name: 'dependency'
  packageName: string
  version: string
  isDevDependency: boolean
  isModule: boolean
  isBuildModule: boolean
}

const normalizeModules = modules => modules.map((m) => {
  if (typeof m === 'string') { return m }
  if (Array.isArray(m) && typeof m[0] === 'string') { return m[0] }
}).filter(Boolean)

export const dependency = <EventFactory<DependencyEvent>> function ({ nuxt: { options } }) {
  const events: DependencyEvent[] = []
  const rawDeps = getDependencies(options.rootDir)

  const modules = normalizeModules(options.modules)
  const buildModules = normalizeModules(options.buildModules)

  // Only report relevant dependencies
  const candidates = [...modules, ...buildModules]

  for (const type of ['dependencies', 'devDependencies']) {
    const _deps = rawDeps[type] || {}
    const isDevDependency = type === 'devDependencies'
    for (const name of Object.keys(_deps)) {
      if (candidates.includes(name)) {
        events.push({
          name: 'dependency',
          packageName: name,
          version: _deps[name],
          isDevDependency,
          isModule: modules.includes(name),
          isBuildModule: buildModules.includes(name)
        })
      }
    }
  }

  return events
}
