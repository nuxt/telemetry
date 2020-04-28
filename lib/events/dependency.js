import { getDependencies } from '../utils/get-dependencies'
import { normalizeModules } from '../utils/normalize-modules'

export function dependencyEvent({ eventName, options, rootDir }) {
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
