import { getDependencies } from '../utils/get-dependencies'
import { normalizeModules } from '../utils/normalize-modules'
import { NuxtOptions } from '../types'

interface Event {
  eventName: string
  options: NuxtOptions
  rootDir: string
}

interface DependencyEvent {
  name: string
  payload: {
    name: string
    isDevDependency: boolean
    isModule: boolean
    isBuildModule: boolean
    version: string
  }
}

export function dependencyEvent ({
  eventName,
  options,
  rootDir
}: Event): Array<DependencyEvent> {
  const dependencyEvents = []
  const nuxtBuildModules = normalizeModules(options.buildModules)
  const nuxtModules = normalizeModules(options.modules)

  const deps = getDependencies(rootDir)

  for (const type of ['dependencies', 'devDependencies']) {
    const _deps = deps[type]
    const isDevDependency = type === 'devDependencies'
    for (const name of Object.keys(_deps)) {
      dependencyEvents.push({
        name: eventName,
        payload: {
          isDevDependency,
          isModule: nuxtModules.includes(name),
          isBuildModule: nuxtBuildModules.includes(name),
          name,
          version: _deps[name]
        }
      })
    }
  }

  return dependencyEvents
}
