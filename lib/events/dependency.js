import { getDependencies } from '../utils/get-dependencies'
import { normalizeModules } from '../utils/normalize-modules'

export function dependencyEvent({ eventName, options, rootDir }) {
  const dependencyEvents = []
  const nuxtBuildModules = normalizeModules(options.buildModules)
  const nuxtModules = normalizeModules(options.modules)

  const deps = getDependencies(rootDir)

  for (const type of ['dependencies', 'devDependencies']) {
    const _deps = deps[type]
    const devDependency = type === 'devDependencies'
    for (const name of Object.keys(_deps)) {
      dependencyEvents.push({
        name: eventName,
        payload: {
          devDependency,
          module: nuxtModules.includes(name),
          buildModule: nuxtBuildModules.includes(name),
          name,
          version: _deps[name]
        }
      })
    }
  }

  return dependencyEvents
}
