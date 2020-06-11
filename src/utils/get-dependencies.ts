import { join } from 'path'
import { existsSync } from 'fs'

// TODO: Use nuxt resolver module
const _require = require.main?.require || require

interface DependencyData {
  [key: string]: string
}

interface Dependencies {
  [key: string]: DependencyData
  // dependencies?: DependencyData
  // devDependencies?: DependencyData
}

export function getDependencies (rootDir: string) {
  const deps: Dependencies = {}

  const pkgPath = join(rootDir, 'package.json')

  if (!existsSync(pkgPath)) {
    return deps
  }

  const pkg = _require(pkgPath)

  // Read each dependency package.json to get exact installed version
  for (const type of ['dependencies', 'devDependencies']) {
    deps[type] = deps[type] || {}
    for (const _name in pkg[type] || {}) {
      try {
        const { name, version } = _require(
          join(_name, 'package.json')
        )
        deps[type][name] = version
      } catch (_e) {
        // Dependency is not installed
        deps[type][_name] = pkg[type][_name]
      }
    }
  }
  return deps
}
