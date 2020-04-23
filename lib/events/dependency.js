import { getDependencies } from '../utils/get-dependencies'
import { normalizeModules } from '../utils/normalize-modules'

export function dependencyEvent({ eventName, options }) {
  return new Promise((resolve) => {
    try {
      const dependencyEvents = []
      const { dependencies, devDependencies } = getDependencies()
      const nuxtBuildModules = normalizeModules(options.buildModules)
      const nuxtModules = normalizeModules(options.modules)

      for (const d of Object.keys(dependencies)) {
        dependencyEvents.push({
          name: eventName,
          payload: {
            devDependency: false,
            module: nuxtModules.includes(d),
            buildModule: nuxtBuildModules.includes(d),
            name: d,
            version: dependencies[d]
          }
        })
      }
      for (const d of Object.keys(devDependencies)) {
        dependencyEvents.push({
          name: eventName,
          payload: {
            devDependency: true,
            module: nuxtModules.includes(d),
            buildModule: nuxtBuildModules.includes(d),
            name: d,
            version: devDependencies[d]
          }
        })
      }

      resolve(dependencyEvents)
    } catch (err) {
      // swallow
      return null
    }
  })
}
